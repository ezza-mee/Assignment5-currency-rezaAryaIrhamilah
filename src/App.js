import { useEffect, useState, useCallback } from 'react';

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
		<main className="bg-orange-500 min-h-screen flex items-center justify-center p-6">
			<div className="flex flex-col justify-center items-center">
				<section className="bg-orange-500 rounded-lg shadow-lg p-8 w-full max-w-6xl grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					<div>
						<h1 className="text-white text-xl font-semibold mb-4">Currency</h1>
						{currencies.map((curr, index) => (
							<p key={index} className="text-white text-sm mb-2">
								{curr.currency}
							</p>
						))}
					</div>
					<div>
						<h1 className="text-white text-xl font-semibold mb-4">We Buy</h1>
						{currencies.map((curr, index) => (
							<p key={index} className="text-white text-sm mb-2">
								{curr.purchaseRate}
							</p>
						))}
					</div>
					<div>
						<h1 className="text-white text-xl font-semibold mb-4">Exchange Rate</h1>
						{currencies.map((curr, index) => (
							<p key={index} className="text-white text-sm mb-2">
								{curr.exchangeRate}
							</p>
						))}
					</div>
					<div>
						<h1 className="text-white text-xl font-semibold mb-4">We Sell</h1>
						{currencies.map((curr, index) => (
							<p key={index} className="text-white text-sm mb-2">
								{curr.sellRate}
							</p>
						))}
					</div>
				</section>
				<div className="flex justify-center items-center w-full h-16">
					<p className="text-white mt-4 text-xs">
						Rates are fetched from 1 USD. This application uses API from{' '}
						<a href="https://currencyfreaks.com" className="underline">
							currencyfreaks.com
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

export default App;
