import { MISC } from "@enums/misc.enum";
import { SYMBOLS } from "@enums/symbols.enum";
import { ForecastInfo } from "@models/forecast";
import { useState } from "react";
import Chart from "@components/Chart/Chart";

export default function HourlyForecastInfo(props: any) {
  const { data } = props;
  const [chartData] = useState<number[]>(
    data.map((hour: ForecastInfo) => parseInt(hour?.temperature?.value))
  );

  return (
    <div className="hourly-weather-info">
      <div className="hourly-weather-temp-wrapper">
        {data.map((hour: ForecastInfo, idx: number): any => {
          return (
            <div key={idx} className="hourly-weather-temp-item">
              <img
                className="weather-card-icon"
                src={`http://${MISC.IMAGES_URI}${hour?.weather?.icon}.png`}
                alt={hour?.temperature.value}
                width="50"
                height="50"
              />
              <span className="hourly-weather-temp hour">
                {hour?.timeOfRequest.format("HH:mm")}
              </span>
              <span className="hourly-weather-temp current">
                {`${parseInt(hour?.temperature?.value)}`}
                {SYMBOLS.CELSIUS}
              </span>
              {/* <span className="hourly-weather-temp humidity">{`Humidity: ${hour?.humidity}%`}</span> */}
            </div>
          );
        })}
      </div>
      {chartData.length === data.length ? (
        <Chart data={chartData} min={Math.min(...chartData)} />
      ) : null}
    </div>
  );
}
