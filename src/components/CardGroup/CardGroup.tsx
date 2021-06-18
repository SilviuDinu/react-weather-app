import { WeatherContext } from '@providers/WeatherContext';
import Card from '@components/Card/Card';
import { useContext } from 'react';
import { Forecast } from '@models/forecast';

export default function CardGroup(props: any) {
  const [weather] = useContext(WeatherContext);

  return (
    <div className="card-group">
      {weather.map((item: any, index: number) => (
          <Card key={index} title={item.city} id={index} data={item as Forecast}></Card>
      ))}
    </div>
  );
}
