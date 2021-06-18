import { MISC } from '@enums/misc.enum';
import { SYMBOLS } from '@enums/symbols.enum';
import { ForecastInfo } from '@models/forecast';
import { capitalize } from 'lodash';
import moment from 'moment';

export default function HourlyForecastInfo(props: any) {
  const { data } = props;

  return (
    <>
      {data.map((hour: ForecastInfo): any => {
        return (
          <div className="hourly-weather-info">
            <div className="weather-card-temp-wrapper">
              <span className="weather-card-temp hour">
                {moment.unix((hour as any)?.timeOfRequest).format('HH:mm')}
              </span>
              <span className="weather-card-temp current">
                {`${parseInt(hour?.temperature?.value)}`} {SYMBOLS.CELSIULS}
              </span>
              <span className="weather-card-temp humidity">{`Humidity: ${hour?.humidity}%`}</span>
            </div>
          </div>
        );
      })}
    </>
  );
}
