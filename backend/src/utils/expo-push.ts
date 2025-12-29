import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export interface PushNotificationPayload {
    to: string;
    title: string;
    body: string;
    data?: any;
}

export class ExpoPushUtils {
    /**
     * Send a single push notification
     */
    static async sendPushNotification(payload: PushNotificationPayload) {
        const { to, title, body, data } = payload;

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(to)) {
            console.error(`Push token ${to} is not a valid Expo push token`);
            return;
        }

        const messages: ExpoPushMessage[] = [{
            to,
            sound: 'default',
            title,
            body,
            data,
        }];

        try {
            const chunks = expo.chunkPushNotifications(messages);
            const tickets = [];

            for (const chunk of chunks) {
                try {
                    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error('Error sending push notification chunk:', error);
                }
            }

            return tickets;
        } catch (error) {
            console.error('Error in sendPushNotification:', error);
            throw error;
        }
    }

    /**
     * Send push notifications to multiple tokens
     */
    static async sendMultiplePushNotifications(messages: ExpoPushMessage[]) {
        const validMessages = messages.filter(m => {
            if (typeof m.to === 'string') {
                return Expo.isExpoPushToken(m.to);
            }
            if (Array.isArray(m.to)) {
                return m.to.every(token => Expo.isExpoPushToken(token));
            }
            return false;
        });

        try {
            const chunks = expo.chunkPushNotifications(validMessages);
            const tickets = [];

            for (const chunk of chunks) {
                try {
                    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error('Error sending push notification chunk:', error);
                }
            }

            return tickets;
        } catch (error) {
            console.error('Error in sendMultiplePushNotifications:', error);
            throw error;
        }
    }
}
