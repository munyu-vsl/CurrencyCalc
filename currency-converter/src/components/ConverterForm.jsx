import React, { useEffect, useState } from "react";

const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

export default function ConverterForm() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exchange rates on mount
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch exchange rates");
        return res.json();
      })
      .then((data) => {
        setCurrencies(Object.keys(data.rates));
        setExchangeRates(data.rates);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Calculate conversion whenever dependencies change
  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      setConvertedAmount((amount * rate).toFixed(4));
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  if (loading) return <p className="text-center mt-10">Loading rates...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Currency Converter</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label htmlFor="fromCurrency" className="block mb-1 font-semibold">From:</label>
          <select
            id="fromCurrency"
            className="w-full border border-gray-300 rounded p-2"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="toCurrency" className="block mb-1 font-semibold">To:</label>
          <select
            id="toCurrency"
            className="w-full border border-gray-300 rounded p-2"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block mb-1 font-semibold">Amount:</label>
        <input
          id="amount"
          type="number"
          min="0"
          className="w-full border border-gray-300 rounded p-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="text-center text-xl font-semibold mt-4">
        {amount} {fromCurrency} = {convertedAmount} {toCurrency}
      </div>
    </div>
  );
}
