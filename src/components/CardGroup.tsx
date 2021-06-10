import { CurrentCityWeather } from "@models/current-weather";
import { WeatherContext } from "@providers/WeatherContext";
import Card from "@components/Card";
import { useContext } from "react";
import Loader from "@components/Loader";

export default function CardGroup(props: any) {
  const [weather] = useContext(WeatherContext);

  return (
    <div className="card-group">
      {weather.length > 0
        ? weather.map((item: CurrentCityWeather, index: number) => (
            <Card key={index} title={item.name} data={item}></Card>
          ))
        : null}
    </div>
  );
}
