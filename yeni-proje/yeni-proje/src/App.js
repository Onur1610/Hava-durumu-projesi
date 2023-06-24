import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(getInitialMode());

  const API_KEY = 'APİ_KEY_GİRİNİZ';

  useEffect(() => {
    localStorage.setItem('dark', JSON.stringify(isDarkMode));
    applyTheme();
  }, [isDarkMode]);

  function getInitialMode() {
    const savedMode = JSON.parse(localStorage.getItem('dark'));
    return savedMode || false;
  }

  function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', isDarkMode ? '#333' : '#f9f9f9');
    root.style.setProperty('--text-color', isDarkMode ? '#fff' : '#333');
    root.style.setProperty('--input-bg-color', isDarkMode ? '#555' : '#eef2f5');
    root.style.setProperty('--input-focus-bg-color', isDarkMode ? '#444' : '#d9e2e7');
    root.style.setProperty('--button-bg-color', isDarkMode ? '#4caf50' : '#ff6f6f');
    root.style.setProperty('--button-text-color', isDarkMode ? '#fff' : '#fff');
    root.style.setProperty('--button-hover-bg-color', isDarkMode ? '#45a049' : '#ff4f4f');
    root.style.setProperty('--forecast-bg-color', isDarkMode ? '#444' : '#fff');
    root.style.setProperty('--secondary-text-color', isDarkMode ? '#ccc' : '#555');
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`
      );
      const weatherData = response.data;
      setWeatherData(weatherData);
    } catch (error) {
      console.log('Hava durumu verileri alınırken bir hata oluştu:', error);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="title">Hava Durumu Uygulaması</h1>
      <div className="theme-toggle">
        <button onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Şehir adı girin"
        />
        <button type="submit">Hava Durumunu Getir</button>
      </form>
      {weatherData && (
        <div className="forecast-container">
          {weatherData.forecast.forecastday.slice(0, 5).map((forecastDay) => (
            <div key={forecastDay.date} className="forecast-day">
              <p className="date">{forecastDay.date}</p>
              <div className="weather-details">
                <img src={forecastDay.day.condition.icon} alt="Hava Durumu" />
                <p className="temperature">Max: {forecastDay.day.maxtemp_c}°C</p>
                <p className="temperature">Min: {forecastDay.day.mintemp_c}°C</p>
                <p className="condition">{forecastDay.day.condition.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
