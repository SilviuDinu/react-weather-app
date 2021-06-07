import { ENDPOINTS } from '@enums/endpoints.enum';
import { HOME_MESSAGES } from '@enums/home.enum';
import { CurrentCityWeather, Weather } from '@models/current-weather';
import { useEffect, useState } from 'react';

export default function Home(props: any) {
  const [weather, setWeather] = useState<CurrentCityWeather[]>([]);

  useEffect(() => {
    fetch(ENDPOINTS.MOCK_ALL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response: any) => response.json())
      .then((response: CurrentCityWeather[]) => {
        setWeather(weather => [...weather, ...response]);
      })
      .catch(err => {
        throw new Error(err);
      })
  }, []);

  return (
    <div className="home-page">
      <h1 className="home-page-title">{HOME_MESSAGES.TITLE}</h1>
      <div className="home-page-content">
        {weather.map((item: CurrentCityWeather, index: number) => (
          <p key={index}>{item.name}</p>
        ))}
      </div>
    </div>
  );
}
