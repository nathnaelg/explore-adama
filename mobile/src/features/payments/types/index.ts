export interface InitPaymentDto {
    userId: string;
    bookingId: string;
    amount: number;
    currency?: string;
    description?: string;
    returnUrl?: string;
}

export interface PaymentInitResponse {
    checkoutUrl: string;
    reference?: string;
    providerData?: any;
}

export interface PaymentVerifyResponse {
    status: 'success' | 'failed';
    message: string;
    data?: any;
}
