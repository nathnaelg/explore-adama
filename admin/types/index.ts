
// Enums from Prisma Schema
export enum Role {
  ADMIN = 'ADMIN',
  TOURIST = 'TOURIST'
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  HIDDEN = 'HIDDEN'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum PaymentProvider {
  CHAPA = 'CHAPA',
  STRIPE = 'STRIPE',
  MANUAL = 'MANUAL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum TicketStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  USED = 'USED',
  EXPIRED = 'EXPIRED'
}

export enum InteractionType {
  VIEW = 'VIEW',
  CLICK = 'CLICK',
  SAVE = 'SAVE',
  BOOK = 'BOOK',
  REVIEW = 'REVIEW',
  SHARE = 'SHARE'
}

export enum PlaceCategory {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  ATTRACTION = 'ATTRACTION',
  PARK = 'PARK',
  CULTURE = 'CULTURE',
  TRANSPORT = 'TRANSPORT'
}

export interface Category {
  id: string;
  name: string;
  key: string;
}

// Detailed Interfaces
export interface Interaction {
  id: string;
  type: InteractionType | string;
  itemId: string;
  createdAt?: string; // Optional based on API response
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  placeId?: string;
  eventId?: string;
  placeName?: string; // Optional frontend helper
  status: ReviewStatus;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    profile?: Profile;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // Full content
  author: string;
  authorAvatar?: string;
  image: string;
  category: string;
  tags?: string[];
  date: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  status: 'PUBLISHED' | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Comment {
  id: string;
  targetName: string; // Post title or entity name
  author: string;
  authorAvatar?: string;
  content: string;
  date: string;
  status?: 'APPROVED' | 'PENDING' | 'SPAM';
}

export interface ChatSession {
  id: string;
  subject: string;
  date: string;
  status: 'OPEN' | 'CLOSED';
  lastMessage: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: PaymentStatus;
  method: PaymentProvider;
  reference: string;
}

export interface Ticket {
  id: string;
  eventName: string;
  date: string;
  seat?: string;
  price: number;
  status: TicketStatus;
  code: string;
}

// Interfaces based on Prisma Models
export interface User {
  id: string;
  email: string;
  role: Role;
  banned?: boolean; // Added to match backend
  profile?: Profile;
  createdAt: string; // ISO Date
  
  // Detailed Views (Optional arrays)
  reviews?: Review[];
  blogPosts?: BlogPost[];
  comments?: Comment[];
  chatSessions?: ChatSession[];
  payments?: Payment[];
  tickets?: Ticket[];
  bookings?: Booking[];
}

export interface Profile {
  id: string;
  name?: string;
  avatar?: string;
  country?: string;
  gender?: string;
  phone?: string;
  userId?: string; // Added from backend response
  locale?: string; // Added from backend response
  city?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  price: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  ticketsSold: number;
  capacity: number;
  image: string;
  category: string;
  // New metrics
  viewCount?: number;
  bookingCount?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  rating: number;
  reviewsCount: number;
  status: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
  image: string;
  address: string;
  coordinates: { lat: number; lng: number };
  // New metrics
  viewCount?: number;
  bookingCount?: number;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: string;
}

export interface Booking {
  id: string;
  user: User;
  event: Partial<Event>; // Relaxed for booking list display
  status: string; 
  total: number;
  createdAt: string;
  quantity?: number; // Added from API
  ticketCount: number;
}

export interface ModerationItem {
  id: string;
  type: 'Review' | 'Media';
  content: string; // Text for review, URL for media
  author: string;
  status: ReviewStatus; // simplified for UI
  date: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalRevenue: number;
  totalOrders: number; // Tickets Sold
  totalReturns: number; // Content Items (Posts/Reviews)
  revenueGrowth: number;
  orderGrowth: number;
  totalInteractions?: number;
  conversionRate?: number;
  totalExpenses?: number;
}
