import { apiClient } from '@/src/core/api/client';
import {
    InitPaymentDto,
    PaymentInitResponse,
    PaymentVerifyResponse
} from '../types';

export const paymentService = {
    // Initialize payment
    async initPayment(data: InitPaymentDto): Promise<PaymentInitResponse> {
        const response = await apiClient.post('/payments/init', data);
        return response.data;
    },

    // Verify payment status
    async verifyPayment(ref: string): Promise<PaymentVerifyResponse> {
        const response = await apiClient.get(`/payments/verify/${ref}`);
        return response.data;
    },
};
