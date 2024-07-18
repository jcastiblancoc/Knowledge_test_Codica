import fetch from 'node-fetch';
import { config } from 'dotenv';

config();


const params = {
    apikey: 'fca_live_PyaIuWAhdTaKTqr0vZOIHBh5abKdoUULg6vIkcLo'
};

async function ListAllCurrencies() {
    const url = "https://api.freecurrencyapi.com/v1/currencies";
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryParams}`, {
        headers: {
        'Cache-Control': 'no-cache'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch currencies: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
}


async function GetExchangeRate(baseCurrency) {
    const url = "https://api.freecurrencyapi.com/v1/latest";

    if (baseCurrency){
        params.base_currency = baseCurrency;
    }
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryParams}`, {
        headers: {
        'Cache-Control': 'no-cache'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch currencies: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
}


async function CustomExchangeRate(baseCurrency, targetCurrency) {
    const url = "https://api.freecurrencyapi.com/v1/latest";

    params.base_currency = baseCurrency;
    params.currencies = targetCurrency;

    const queryParams = new URLSearchParams(params).toString();
    try {
        const response = await fetch(`${url}?${queryParams}`, {
            headers: {
            'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch custom exchange rate: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        throw error;
    }
}

export {
    ListAllCurrencies,
    GetExchangeRate,
    CustomExchangeRate
};