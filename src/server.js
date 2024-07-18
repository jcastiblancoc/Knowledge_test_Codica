import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {
    ListAllCurrencies,
    GetExchangeRate,
    CustomExchangeRate
} from './helpers.js';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = new URL('.', import.meta.url).pathname;
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/list_all_currencies', async (request, response) => {
    try {
        const currencies = await ListAllCurrencies();
        response.json(currencies);
    } catch (error) {
        console.error('Error fetching currencies:', error.message);
        response.status(500).json({ error: 'Failed to fetch currencies' });
    }
});

app.get('/get_exchange_rate', async (request, response) => {
    try {
        const base_currency = request.query.base_currency || 'USD';
        const exchangeRate = await GetExchangeRate(base_currency);
        response.json({ exchangeRate });
    } catch (error) {
        console.error('Error fetching exchange rate:', error.message);
        res.status(500).json({ error: 'Failed to fetch exchange rate' });
    }
});


app.get('/custom_exchange_rate', async (request, response) => {
    try {
        const base_currency = (request.query.base_currency || 'USD').trim().toUpperCase();
        const target_currency = request.query.target_currency.trim().toUpperCase();

        const exchangeRate = await CustomExchangeRate(base_currency, target_currency);
        response.json({exchangeRate});
    } catch (error){
        console.error('Error fetching custom exchange rate:', error.message);
        response.status(500).json({error: 'Failed to fetch custom exchange rate'});
    }
});

const HistoricalLog = {};

app.get('/exchange_value', async (request, response) => {
    try {
        const amount = request.query.amount;
        const base_currency = (request.query.base_currency || 'USD').trim().toUpperCase();
        const target_currency = request.query.target_currency.trim().toUpperCase();

        const exchangeRate = await CustomExchangeRate(base_currency, target_currency);
        const exchangeRateValue = exchangeRate.data[target_currency];

        let payload = {
            'base_currency': base_currency,
            'target_currency': target_currency,
            'amount': amount,
            'exchange_rate': exchangeRateValue,
            'total': parseFloat(amount) * parseFloat(exchangeRateValue),
            'timestamp': new Date().toISOString()
        };

        const key = new Date().toISOString();

        HistoricalLog[key] = {
            'base_currency': payload.base_currency,
            'target_currency': payload.target_currency,
            'amount': payload.amount,
            'exchange_rate': payload.exchange_rate,
            'total': payload.total,
            'timestamp': payload.timestamp
        };

        response.json(payload);

        } catch (error){
            console.error('Error fetching custom exchange rate:', error.message);
            response.status(500).json({error: 'Failed to fetch custom exchange rate'});
        }
});


app.get('/historical_log', (request, response) => {
    if (Object.keys(HistoricalLog).length === 0) {
        return response.status(404).json({ error: 'No historical log found' });
    }

    response.json(HistoricalLog);
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
