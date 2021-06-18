import { MISC } from '@enums/misc.enum';
import { SYMBOLS } from '@enums/symbols.enum';
import { ForecastInfo } from '@models/forecast';
import { capitalize } from 'lodash';
import moment from 'moment';

export default function HourlyForecastInfo(props: any) {
  const { data } = props;

  return (
    <>
      {data.map((hour: ForecastInfo, idx: number): any => {
        return (
          <div key={idx} className="hourly-weather-info">
            <div className="hourly-weather-temp-wrapper">
              <img
                className="weather-card-icon"
                src={`http://${MISC.IMAGES_URI}${hour?.weather?.icon}.png`}
                alt={hour?.temperature.value}
                width="50"
                height="50"
              />
              <span className="hourly-weather-temp hour">{hour?.timeOfRequest.format('HH:mm')}</span>
              <span className="hourly-weather-temp current">
                {`${parseInt(hour?.temperature?.value)}`}
                {SYMBOLS.CELSIULS}
              </span>
              {/* <span className="hourly-weather-temp humidity">{`Humidity: ${hour?.humidity}%`}</span> */}
            </div>
          </div>
        );
      })}
    </>
  );
}
