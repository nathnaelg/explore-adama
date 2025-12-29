import { Stack } from 'expo-router/stack';

export default function BookingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="history/index" />
            <Stack.Screen name="new/index" />
            <Stack.Screen name="new/payment/index" />
            <Stack.Screen name="new/success/index" />
            <Stack.Screen name="[bookingId]/index" />
        </Stack>
    );
}
