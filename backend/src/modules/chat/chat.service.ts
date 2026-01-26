// backend/src/modules/chat/chat.service.ts
import axios from "axios";
import { prisma } from "../../config/db.ts";
import { env } from "../../config/env.ts";
import { GeminiClient } from "./chat.gemini.ts";

const MEM_LIMIT = Number(env.CHAT_MEMORY_MESSAGES || 50); // Increased history limit
const ML_SERVICE_URL = env.ML_SERVICE_URL || "http://127.00.0.1:5000";
const ML_SECRET = env.ML_SECRET || "";

type HandleMessageParams = {
  sessionId?: string | null;
  userId?: string | null;
  message: string;
  language?: string;
  meta?: any;
};

export class ChatService {
  // create session (userId optional)
  static async createSession({ userId, title }: { userId?: string | null; title?: string | null }) {
    const session = await prisma.chatSession.create({
      data: {
        userId: userId || "anonymous",
        title: title || null,
      },
    });
    return session;
  }

  // fetch session + last messages
  static async getSession(sessionId: string) {
    return prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
  }

  static async listSessions(userId: string) {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
  }

  // main handler
  static async handleMessage(params: HandleMessageParams) {
    const { sessionId, userId, message, language, meta } = params;
    // 1) ensure session exists
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: userId || "anonymous",
          title: meta?.title || null,
        },
      });
    }

    const sid = session.id;

    // 2) save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: sid,
        role: "USER",
        content: message,
        metadata: meta ? meta : undefined,
      },
    });

    // 3) load last MEM_LIMIT messages for context (desc order to get LATEST, then reverse)
    let recent = await prisma.chatMessage.findMany({
      where: { sessionId: sid },
      orderBy: { createdAt: "desc" },
      take: MEM_LIMIT,
    });

    // Reverse to chronological order (oldest -> newest)
    recent = recent.reverse();

    // build message history to send to Gemini
    const history = recent.map((m) => ({
      role: m.role === "USER" ? "user" : "assistant",
      content: m.content,
    }));

    // 4) call Gemini (system prompt + history + user message)
    // IMPORTANT: The last message in 'history' is the one we just saved. 
    // GeminiClient.generate handles 'history' and 'userMessage' separately usually.
    // To avoid duplication, we should NOT pass the last message in 'history' if we also pass 'userMessage'.
    // However, GeminiClient impl:
    /*
        Conversation history:
        ${history.map(h => `${h.role}: ${h.content}`).join("\n")}
        User: ${userMessage}
    */
    // If 'history' already contains the latest user message, it will be duplicated. 
    // Let's remove the last element from history if it matches the current user message to avoid confusion, 
    // OR, better, we pass `userMessage` as empty string and let history handle it? 
    // Actually, checking GeminiClient.ts, it appends User: ${userMessage}. 
    // So we should exclude the *current* message from 'history' passed to GeminiClient.
    const historyForAi = history.slice(0, -1);

    const systemPrompt = ChatService._buildSystemPrompt(language);
    const geminiResp = await GeminiClient.generate({
      systemPrompt,
      history: historyForAi,
      userMessage: message,
    });

    // geminiResp expected: { reply: string, intent?: string, entities?: any, raw?: any }
    const { reply, intent, entities } = geminiResp;

    // 5) intent handling: if intent calls for DB or ML, call them and append results
    let data = null;
    let finalReply = reply;

    try {
      if (intent === "SEARCH_EVENTS") {
        data = await ChatService._searchEvents(entities);
        finalReply = ChatService._joinReplyWithData(reply, data);
      } else if (intent === "SEARCH_PLACES") {
        data = await ChatService._searchPlaces(entities);
        finalReply = ChatService._joinReplyWithData(reply, data);
      } else if (intent === "RECOMMEND_PERSONAL") {
        // call ML service
        if (userId) {
          const recs = await ChatService._getPersonalizedRecommendations(userId, entities);
          data = recs;
          finalReply = ChatService._joinReplyWithData(reply, data);
        } else {
          // no user -> fallback to global
          data = await ChatService._globalRecommendations();
          finalReply = ChatService._joinReplyWithData("I made some popular picks for you:", data);
        }
      } else if (intent === "GLOBAL_POPULAR") {
        data = await ChatService._globalRecommendations();
        finalReply = ChatService._joinReplyWithData(reply, data);
      } else {
        // fallback: small talk or unknown - reply only
      }
    } catch (err) {
      console.error("ChatService intent handler error:", err);
      // keep finalReply as gemini reply but notify user
      finalReply += "\n\n(Warning: failed to fetch live data.)";
    }

    // 6) save assistant message (with metadata storing intent and any returned data summary)
    await prisma.chatMessage.create({
      data: {
        sessionId: sid,
        role: "ASSISTANT",
        content: finalReply,
        metadata: { intent, entities, servedDataCount: Array.isArray(data) ? data.length : null },
      },
    });

    // 7) update session timestamp
    await prisma.chatSession.update({
      where: { id: sid },
      data: { updatedAt: new Date() },
    });

    // 8) return response to client
    return {
      sessionId: sid,
      reply: finalReply,
      intent,
      entities,
      data,
    };
  }

  // small helpers

  static _buildSystemPrompt(languageCode: string = "en") {
    const languageMap: Record<string, string> = {
      am: "Amharic",
      om: "Afan Oromo",
      en: "English",
    };
    const targetLang = languageMap[languageCode] || "English";

    return `You are "Navigator", an expert local travel assistant for Adama City, Ethiopia.
Your personality is warm, enthusiastic, and knowledgeable—like a local friend showing someone around.
You MUST reply to the user in ${targetLang} language ONLY.

CORE INSTRUCTIONS:
1. **Context Awareness**: Use the provided Conversation History to remember previous topics. If the user asks "where is that?", refer to the last mentioned place.
2. **Helpful & Actionable**: Don't just give facts; give suggestions. If someone asks for food, ask what cuisine they like or suggest the top rated one.
3. **Intent Detection**: Accurately predict what the user wants:
   - "Find me a jazz concert" -> SEARCH_EVENTS ({ category: "Music", keywords: "jazz" })
   - "Where can I eat burger?" -> SEARCH_PLACES ({ category: "Restaurant", name: "burger" })
   - "What should I do today?" -> RECOMMEND_PERSONAL
   - "What's popular?" -> GLOBAL_POPULAR
   - "Hi" -> SMALL_TALK
4. **Adama Specifics**: You know about Adama (Nazret). 
   
Refrain from making up availability. If you don't know, say "I can check the latest listings for you."

OUTPUT FORMAT:
You must return a valid JSON object with:
- "reply": The text to show the user.
- "intent": One of [SEARCH_EVENTS, SEARCH_PLACES, RECOMMEND_PERSONAL, GLOBAL_POPULAR, FAQ, SMALL_TALK].
- "entities": Object with search filters (date, category, placeId, name).
`;
  }

  static async _searchEvents(entities: any) {
    // Very simple entity-based search - refine as needed
    const where: any = {};
    if (entities?.date) {
      try {
        // expects YYYY-MM-DD or similar
        const d = new Date(entities.date);
        // Check if the date is valid after parsing
        if (!isNaN(d.getTime())) {
          const start = new Date(d.setHours(0, 0, 0, 0));
          const end = new Date(d.setHours(23, 59, 59, 999));
          where.date = { gte: start, lte: end };
        } else {
          // Log if date entity was extracted but invalid
          console.warn("ChatService._searchEvents: Invalid date extracted:", entities.date);
        }
      } catch (e) {
        console.error("ChatService._searchEvents: Error parsing date:", e);
      }
    }
    if (entities?.category) where.categoryId = entities.category;
    if (entities?.placeId) where.placeId = entities.placeId;
    if (entities?.keywords) {
      where.OR = [
        { title: { contains: entities.keywords, mode: 'insensitive' } },
        { description: { contains: entities.keywords, mode: 'insensitive' } }
      ];
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: [{ bookingCount: "desc" }, { viewCount: "desc" }],
      take: 10,
    });
    return events;
  }

  static async _searchPlaces(entities: any) {
    const where: any = {};
    if (entities?.category) where.categoryId = entities.category;
    if (entities?.name) where.name = { contains: entities.name, mode: "insensitive" };

    // Add generic keyword search
    if (entities?.keywords && !where.name) {
      where.OR = [
        { name: { contains: entities.keywords, mode: 'insensitive' } },
        { description: { contains: entities.keywords, mode: 'insensitive' } }
      ];
    }

    const places = await prisma.place.findMany({
      where,
      orderBy: [{ bookingCount: "desc" }, { viewCount: "desc" }],
      take: 10,
    });
    return places;
  }

  static async _getPersonalizedRecommendations(userId: string, entities: any) {
    try {
      const url = `${ML_SERVICE_URL}/recommend/user/${encodeURIComponent(userId)}?n=10`;
      const resp = await axios.get(url, {
        headers: { Authorization: `Bearer ${ML_SECRET}` },
        timeout: 15000,
      });
      // expect { userId, recommendations: [{itemId, score}, ...] }
      const rec = resp.data;
      // map itemIds to actual DB objects (events/places). Our ML returns itemId, and itemType may be included.
      const items = [];
      if (Array.isArray(rec.recommendations)) {
        for (const r of rec.recommendations) {
          const id = r.itemId;
          // Try event
          const ev = await prisma.event.findUnique({ where: { id } });
          if (ev) { items.push({ ...ev, _score: r.score, _type: "EVENT" }); continue; }
          const pl = await prisma.place.findUnique({ where: { id } });
          if (pl) { items.push({ ...pl, _score: r.score, _type: "PLACE" }); continue; }
        }
      }
      return items;
    } catch (err) {
      console.error("ChatService _getPersonalizedRecommendations error:", err?.response?.data ?? err.message);
      // Change: Do not re-throw error, but return empty array if ML service fails, 
      // allowing the flow to continue without the Warning in the final reply.
      return [];
    }
  }

  static async _globalRecommendations() {
    // reuse your global recommendation logic: top places & events
    const popularEvents = await prisma.event.findMany({
      orderBy: [{ bookingCount: "desc" }, { viewCount: "desc" }],
      take: 6,
    });
    const popularPlaces = await prisma.place.findMany({
      orderBy: [{ bookingCount: "desc" }, { viewCount: "desc" }],
      take: 6,
    });
    return { popularEvents, popularPlaces };
  }

  static _joinReplyWithData(reply: string, data: any) {
    // If data is array or object produce a short appended line
    if (!data) return reply;
    if (Array.isArray(data)) {
      if (data.length === 0) return reply + "\n\n(Note: I couldn't find any items matching your request.)";
      return `${reply}\n\nI found ${data.length} items — showing top ${Math.min(data.length, 6)}.`;
    }
    if (data.popularEvents || data.popularPlaces) {
      const eventCount = data.popularEvents?.length || 0;
      const placeCount = data.popularPlaces?.length || 0;
      if (eventCount === 0 && placeCount === 0) return reply + "\n\n(Note: I couldn't find any popular items right now.)";
      return `${reply}\n\nI found ${eventCount} popular events and ${placeCount} popular places.`;
    }
    return reply;
  }
}