/**
 * Currency information
 */
export type CurrencyInfo = {
    id: string
    code: string
    decimalPlaces: number
    isActive: boolean
    name: string
    symbol: string
    type: string
};

/**
 * Formatted exchange rate with computed display values
 */
export type FormattedExchangeRate = {
    id: string;
    serverId: string | null;
    rate: number;
    rateDate: string;
    source: string;
    sourceCurrency: CurrencyInfo;
    targetCurrency: CurrencyInfo;
};

/**
 * Cross rate result (computed from USD-based rates)
 */
export type CrossRateResult = {
    id: string;
    rate: number;
    displayText: string;
    sourceCurrency: CurrencyInfo;
    targetCurrency: CurrencyInfo
};


//formatted types for select sheet
export type FormattedSpecificCurrencyRate = {
    value: string;
    label: string;
    rightText?: string;
    rate: CrossRateResult;
    originalItem: CurrencyInfo;
}

export type FormattedRatesForSpecificCurrencyList = {
    allCrossRates: FormattedSpecificCurrencyRate[];
    cryptoRates: FormattedSpecificCurrencyRate[];
    fiatRates: FormattedSpecificCurrencyRate[];
}



/**
 * Calculate cross rate between two currencies using USD as base
 */
export function calculateCrossRate(
    fromCurrencyCode: string,
    toCurrencyCode: string,
    usdRates: FormattedExchangeRate[]
): CrossRateResult | null {
    // Handle direct USD conversions
    if (fromCurrencyCode === 'USD') {
        const directRate = usdRates.find(
            rate => rate.targetCurrency.code === toCurrencyCode
        );
        if (directRate) {
            return {
                id: directRate.id,
                rate: directRate.rate,
                displayText: `${directRate.sourceCurrency.name} - 1 ${fromCurrencyCode} = ${directRate.rate.toFixed(2)} ${toCurrencyCode}`,
                sourceCurrency: directRate.sourceCurrency,
                targetCurrency: directRate.targetCurrency,
            } as CrossRateResult;
        }
        return null;
    }

    if (toCurrencyCode === 'USD') {
        const directRate = usdRates.find(
            rate => rate.targetCurrency.code === fromCurrencyCode
        );
        if (directRate) {
            return {
                id: `computed_${fromCurrencyCode}_${toCurrencyCode}`,
                rate: 1 / directRate.rate,
                displayText: `${directRate.targetCurrency.name} - 1 ${fromCurrencyCode} = ${directRate.rate.toFixed(2)} ${toCurrencyCode}`,
                sourceCurrency: directRate.targetCurrency,
                targetCurrency: directRate.sourceCurrency,
            };
        }
        return null;
    }

    // Find USD → fromCurrency rate
    const usdToFrom = usdRates.find(
        rate => rate.sourceCurrency.code === 'USD' && rate.targetCurrency.code === fromCurrencyCode
    );

    // Find USD → toCurrency rate
    const usdToTarget = usdRates.find(
        rate => rate.sourceCurrency.code === 'USD' && rate.targetCurrency.code === toCurrencyCode
    );

    if (!usdToFrom || !usdToTarget) {
        console.warn(`Cannot calculate cross rate: ${fromCurrencyCode} → ${toCurrencyCode}`);
        return null;
    }

    // Calculate cross rate: (USD → Target) / (USD → From)
    const crossRate = usdToTarget.rate / usdToFrom.rate;

    return {
        id: `computed_${fromCurrencyCode}_${toCurrencyCode}`,
        rate: crossRate,
        displayText: `${usdToFrom.targetCurrency.name} - 1 ${fromCurrencyCode} = ${crossRate.toFixed(2)} ${toCurrencyCode}`,
        sourceCurrency: usdToFrom.targetCurrency,
        targetCurrency: usdToTarget.targetCurrency,
    };
}

/**
 * Generate all possible cross rates from USD-based rates
 */
export function generateAllCrossRates(
    usdRates: FormattedExchangeRate[]
): CrossRateResult[] {
    const crossRates: CrossRateResult[] = [];
    const currencies: CurrencyInfo[] = usdRates.map(rate => rate.targetCurrency);

    // Add USD as a currency option
    const usdCurrency = usdRates[0]?.sourceCurrency;
    if (usdCurrency) {
        currencies.push(usdCurrency);
    }

    // Generate all combinations
    for (let i = 0; i < currencies.length; i++) {
        for (let j = 0; j < currencies.length; j++) {
            if (i === j) continue; // Skip same currency

            const fromCurrency = currencies[i];
            const toCurrency = currencies[j];

            const crossRate = calculateCrossRate(
                fromCurrency.code,
                toCurrency.code,
                usdRates
            );

            if (crossRate) {
                crossRates.push(crossRate);
            }
        }
    }

    return crossRates;
}

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
    amount: number,
    fromCurrencyCode: string,
    toCurrencyCode: string,
    usdRates: FormattedExchangeRate[]
): { convertedAmount: number; rate: number } | null {
    if (fromCurrencyCode === toCurrencyCode) {
        return { convertedAmount: amount, rate: 1 };
    }

    const crossRate = calculateCrossRate(fromCurrencyCode, toCurrencyCode, usdRates);

    if (!crossRate) {
        return null;
    }

    return {
        convertedAmount: amount * crossRate.rate,
        rate: crossRate.rate,
    };
}


/**
 * Get all rates for a specific currency
 */
export function getRatesForSpecificCurrency(
    currencyCode: string,
    usdRates: FormattedExchangeRate[],
    direction: 'from' | 'to' | 'both' = 'both'
): CrossRateResult[] {
    const allRates = generateAllCrossRates(usdRates);

    if (direction === 'from') {
        return allRates.filter(rate => rate.sourceCurrency.code === currencyCode);
    }

    if (direction === 'to') {
        return allRates.filter(rate => rate.targetCurrency.code === currencyCode);
    }

    // Both directions
    return allRates.filter(
        rate => rate.sourceCurrency.code === currencyCode ||
            rate.targetCurrency.code === currencyCode
    );
}





/**
 * Generate for specific currency cross rates from USD-based rates used for select sheet
 */
export function generateSpecificCrossRates(
    currencyCode: string,
    usdRates: FormattedExchangeRate[]
): FormattedRatesForSpecificCurrencyList {
    const allCrossRates: FormattedSpecificCurrencyRate[] = [];
    const cryptoRates: FormattedSpecificCurrencyRate[] = [];
    const fiatRates: FormattedSpecificCurrencyRate[] = [];
    const fromCurrencies: CurrencyInfo[] = usdRates.map(rate => rate.targetCurrency);
    const toCurrency = fromCurrencies.find(rate => rate.code === currencyCode) || usdRates[0]?.targetCurrency;

    // Add USD as a currency option
    const usdCurrency = usdRates[0]?.sourceCurrency;
    if (usdCurrency) {
        fromCurrencies.push(usdCurrency);
    }



    for (let i = 0; i < fromCurrencies.length; i++) {

        // Skip if fromCurrency is same as toCurrency
        if (fromCurrencies[i].code === currencyCode) continue;

        const crossRate = calculateCrossRate(
            fromCurrencies[i].code,
            toCurrency.code,
            usdRates
        );

        if (crossRate) {
            //formatting data for select sheet 
            const formattedCrossRate: FormattedSpecificCurrencyRate = {
                rate: crossRate,
                label: `${crossRate.sourceCurrency.name}`,
                value: crossRate.sourceCurrency.id,
                rightText: `1 ${crossRate.sourceCurrency.code} = ${crossRate.rate.toPrecision(3)} ${crossRate.targetCurrency.code}`,
                originalItem: crossRate.sourceCurrency,
            };
            allCrossRates.push(formattedCrossRate);
            if (crossRate.sourceCurrency.type === 'crypto') {
                cryptoRates.push(formattedCrossRate);
            } else {
                fiatRates.push(formattedCrossRate);
            }
        }

    }

    return { allCrossRates, cryptoRates, fiatRates };
}