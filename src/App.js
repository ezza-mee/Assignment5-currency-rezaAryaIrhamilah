import { useEffect, useState, useCallback } from 'react';
import styles from './App.module.css';

const API_KEY = '23e950e79b974312a5630ebc62763f71';

const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

function App() {
	const [currencies, setCurrencies] = useState([]);

	const getPercentageValue = (numStr, percentage) => {
		const num = parseFloat(numStr);
		return (num * percentage) / 100;
	};

	const getPurchaseRate = (exchangeRate, percentage) => {
		return parseFloat(exchangeRate) + percentage;
	};

	const getSellRate = (exchangeRate, percentage) => {
		return parseFloat(exchangeRate) - percentage;
	};

	const formatApiData = useCallback((apiResult) => {
		const currenciesToShow = ['CAD', 'EUR', 'IDR', 'JPY', 'CHF', 'GBP'];
		const percentage = 2.5;

		const resultCurrency = currenciesToShow.map((currency) => {
			const exchangeRate = parseFloat(apiResult.rates[currency]);
			const purchaseRate = getPurchaseRate(exchangeRate, getPercentageValue(exchangeRate, percentage));
			const sellRate = getSellRate(exchangeRate, getPercentageValue(exchangeRate, percentage));

			return {
				currency,
				purchaseRate: purchaseRate.toFixed(4),
				exchangeRate: exchangeRate.toFixed(4),
				sellRate: sellRate.toFixed(4),
			};
		});
		setCurrencies(resultCurrency);
	}, []);

	useEffect(() => {
		const fetchCurrencyData = async () => {
			try {
				const res = await fetch(API_URL);
				if (!res.ok) {
					const respJson = await res.json();
					throw respJson;
				}
				const result = await res.json();
				formatApiData(result);
			} catch (error) {
				console.error('[fetchCurrencyData]:', error);
			}
		};
		fetchCurrencyData();
	}, [formatApiData]);

	return (
		<main className={styles.main}>
			<section className={styles.container}>
				<div style={{ width: '100%' }}>
					<h1 style={{ color: 'white', marginBottom: '10px' }}>{'Currency'}</h1>
					{currencies.map((curr, index) => (
						<div style={{ width: '100%' }} key={index}>
							<p style={{ marginBottom: '5px', color: 'white' }}>{curr.currency}</p>
						</div>
					))}
				</div>
				<div style={{ width: '100%' }}>
					<h1 style={{ color: 'white', marginBottom: '10px' }}>{'We buy'}</h1>
					{currencies.map((curr, index) => (
						<div style={{ width: '100%' }} key={index}>
							<p style={{ marginBottom: '5px', color: 'white' }}>{curr.purchaseRate}</p>
						</div>
					))}
				</div>
				<div style={{ width: '100%' }}>
					<h1 style={{ color: 'white', marginBottom: '10px' }}>{'Exchange Rate'}</h1>
					{currencies.map((curr, index) => (
						<div style={{ width: '100%' }} key={index}>
							<p style={{ marginBottom: '5px', color: 'white' }}>{curr.exchangeRate}</p>
						</div>
					))}
				</div>
				<div style={{ width: '100%' }}>
					<h1 style={{ color: 'white', marginBottom: '10px' }}>{'We Sell'}</h1>
					{currencies.map((curr, index) => (
						<div style={{ width: '100%' }} key={index}>
							<p style={{ marginBottom: '5px', color: 'white' }}>{curr.sellRate}</p>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}

export default App;
