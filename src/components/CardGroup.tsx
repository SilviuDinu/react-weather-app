import { CurrentCityWeather } from "@models/current-weather";
import { WeatherContext } from "@providers/WeatherContext";
import Card from "@components/Card";
import { useContext } from "react";

export default function CardGroup(props: any) {
  const [weather] = useContext(WeatherContext);

  return (
    <div className="card-group">
      {weather.map((item: CurrentCityWeather, index: number) => (
        <Card key={index} loadingId={index} title={item.name} data={item}></Card>
      ))}
    </div>
  );
}
