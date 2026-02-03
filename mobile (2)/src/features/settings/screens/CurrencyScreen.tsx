import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CurrencySelectionScreen() {
    const [selectedCurrency, setSelectedCurrency] = useState('ETB');

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');
    const success = useThemeColor({}, 'success');
    const warning = '#FF9800'; // Define locally or add to Colors if widely used. Let's use hardcoded for now or mapping. Actually Colors has 'primary' which is orange/yellow. Let's use a specific color or keep hardcoded if it's unique. Wait, Colors has 'error' and 'success'. Does it have warning?
    // Colors.ts has: primary, accent, error, success.
    // Let's use primary for popular if it matches, or keep hardcoded.
    // The previous popular badge used #FF9800 which is similar to primary #F59E0B.
    // Let's use primary for popular.

    const currencies = [
        {
            id: 1,
            code: 'ETB',
            symbol: 'Br',
            name: 'Ethiopian Birr',
            rate: '1.00',
            isDefault: true,
        },
        {
            id: 2,
            code: 'USD',
            symbol: '$',
            name: 'US Dollar',
            rate: '0.018',
            isPopular: true,
        },
        {
            id: 3,
            code: 'EUR',
            symbol: '€',
            name: 'Euro',
            rate: '0.016',
        },
        {
            id: 4,
            code: 'GBP',
            symbol: '£',
            name: 'British Pound',
            rate: '0.014',
        },
        {
            id: 5,
            code: 'AED',
            symbol: 'د.إ',
            name: 'UAE Dirham',
            rate: '0.065',
        },
        {
            id: 6,
            code: 'CNY',
            symbol: '¥',
            name: 'Chinese Yuan',
            rate: '0.13',
        },
        {
            id: 7,
            code: 'KES',
            symbol: 'KSh',
            name: 'Kenyan Shilling',
            rate: '2.45',
        },
        {
            id: 8,
            code: 'EGP',
            symbol: 'E£',
            name: 'Egyptian Pound',
            rate: '0.55',
        },
    ];

    const handleCurrencySelect = (currencyCode: string) => {
        setSelectedCurrency(currencyCode);
        // In a real app, you would save this to async storage
        setTimeout(() => {
            router.back();
        }, 300);
    };

    const formatExamplePrice = () => {
        const selected = currencies.find(c => c.code === selectedCurrency);
        if (selected) {
            const price = 1500; // Example price in ETB
            const converted = (price * parseFloat(selected.rate)).toFixed(2);
            return `${selected.symbol}${converted}`;
        }
        return 'Br1,500.00';
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        Currency
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Current Selection */}
                <View style={[styles.currentSection, { borderBottomColor: muted }]}>
                    <ThemedText type="subtitle" style={[styles.currentTitle, { color: muted }]}>
                        Selected Currency
                    </ThemedText>
                    <View style={[styles.currentCard, { backgroundColor: `${primary}15`, borderColor: primary }]}>
                        <View style={styles.currentCurrency}>
                            <View style={[styles.currencySymbol, { backgroundColor: primary }]}>
                                <ThemedText type="title" style={styles.symbolText}>
                                    {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                </ThemedText>
                            </View>
                            <View style={styles.currencyInfo}>
                                <ThemedText type="title" style={styles.currencyCode}>
                                    {selectedCurrency}
                                </ThemedText>
                                <ThemedText type="default" style={[styles.currencyName, { color: muted }]}>
                                    {currencies.find(c => c.code === selectedCurrency)?.name}
                                </ThemedText>
                            </View>
                        </View>
                        <ThemedText type="default" style={[styles.examplePrice, { color: muted }]}>
                            Example: {formatExamplePrice()}
                        </ThemedText>
                    </View>
                </View>

                {/* Currency List */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Available Currencies
                    </ThemedText>

                    <View style={styles.currenciesList}>
                        {currencies.map((currency) => {
                            const isSelected = selectedCurrency === currency.code;
                            return (
                                <TouchableOpacity
                                    key={currency.id}
                                    style={[
                                        styles.currencyOption,
                                        { backgroundColor: card },
                                        isSelected && { backgroundColor: `${primary}15`, borderColor: primary, borderWidth: 2 },
                                    ]}
                                    onPress={() => handleCurrencySelect(currency.code)}
                                >
                                    <View style={styles.currencyOptionLeft}>
                                        <View style={[styles.currencyOptionSymbol, { backgroundColor: chip }]}>
                                            <ThemedText type="default" style={styles.currencyOptionSymbolText}>
                                                {currency.symbol}
                                            </ThemedText>
                                        </View>
                                        <View style={styles.currencyOptionInfo}>
                                            <ThemedText type="default" style={styles.currencyOptionCode}>
                                                {currency.code}
                                            </ThemedText>
                                            <ThemedText type="default" style={[styles.currencyOptionName, { color: muted }]}>
                                                {currency.name}
                                            </ThemedText>
                                        </View>
                                    </View>

                                    <View style={styles.currencyOptionRight}>
                                        {currency.isDefault && (
                                            <View style={[styles.defaultBadge, { backgroundColor: success }]}>
                                                <ThemedText type="default" style={styles.defaultBadgeText}>
                                                    Default
                                                </ThemedText>
                                            </View>
                                        )}
                                        {currency.isPopular && (
                                            <View style={[styles.popularBadge, { backgroundColor: primary }]}>
                                                <ThemedText type="default" style={styles.popularBadgeText}>
                                                    Popular
                                                </ThemedText>
                                            </View>
                                        )}
                                        <ThemedText type="default" style={[styles.currencyRate, { color: muted }]}>
                                            1 ETB = {currency.rate} {currency.code}
                                        </ThemedText>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={24} color={primary} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Exchange Rate Info */}
                <View style={[styles.infoSection, { backgroundColor: `${primary}10` }]}>
                    <Ionicons name="cash-outline" size={24} color={primary} />
                    <View style={styles.infoTexts}>
                        <ThemedText type="default" style={styles.infoTitle}>
                            Exchange Rates
                        </ThemedText>
                        <ThemedText type="default" style={[styles.infoDescription, { color: muted }]}>
                            Rates are updated daily. For actual payment, your bank&apos;s exchange rate will apply.
                        </ThemedText>
                    </View>
                </View>

                {/* Auto Update */}
                <View style={[styles.autoUpdateSection, { borderTopColor: muted }]}>
                    <View style={styles.autoUpdateOption}>
                        <Ionicons name="refresh-circle-outline" size={24} color={muted} />
                        <View style={styles.autoUpdateTexts}>
                            <ThemedText type="default" style={styles.autoUpdateTitle}>
                                Auto-update exchange rates
                            </ThemedText>
                            <ThemedText type="default" style={[styles.autoUpdateDescription, { color: muted }]}>
                                Update rates automatically when connected to internet
                            </ThemedText>
                        </View>
                        <Ionicons name="toggle" size={32} color={primary} />
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    currentSection: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    currentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    currentCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
    },
    currentCurrency: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    currencySymbol: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    symbolText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    currencyInfo: {
        flex: 1,
    },
    currencyCode: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    currencyName: {
        fontSize: 16,
    },
    examplePrice: {
        fontSize: 14,
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    currenciesList: {
        gap: 12,
    },
    currencyOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    currencyOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    currencyOptionSymbol: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    currencyOptionSymbolText: {
        fontSize: 16,
        fontWeight: '600',
    },
    currencyOptionInfo: {
        flex: 1,
    },
    currencyOptionCode: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    currencyOptionName: {
        fontSize: 12,
    },
    currencyOptionRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    defaultBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    popularBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    popularBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    currencyRate: {
        fontSize: 12,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginHorizontal: 20,
        marginVertical: 16,
        borderRadius: 12,
        gap: 12,
    },
    infoTexts: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 12,
        lineHeight: 16,
    },
    autoUpdateSection: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    autoUpdateOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    autoUpdateTexts: {
        flex: 1,
    },
    autoUpdateTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    autoUpdateDescription: {
        fontSize: 14,
    },
});
