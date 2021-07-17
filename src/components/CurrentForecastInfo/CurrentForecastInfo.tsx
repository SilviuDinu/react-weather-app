import { MISC } from "@enums/misc.enum";
import { SYMBOLS } from "@enums/symbols.enum";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useContext } from 'react';
import { CurrentCityContext } from '@providers/CurrentCityContext';
import { normalize, capitalize } from '@utils/helpers';
import CardField from '@components/CardField/CardField';

export default function CurrentForecastInfo(props: any) {
  const { data } = props;
  const [currentCity] = useContext(CurrentCityContext);

  const isCurrentCity = (city: string): boolean => {
    return city === currentCity || normalize(capitalize(city)) === normalize(capitalize(currentCity));
  }

  const isMisty = (description: string): boolean => {
    return description === 'mist' || description.includes('mist');
  }

  const isLowVisibility = (v: number): boolean => {
    return v < 5000;
  }

  const isHumidityHigh = (h: number): boolean => {
    return h > 65;
  }

  return (
    <div className="current-weather-info">
      <div className="weather-card-overview">
        <div className="weather-card-title-wrapper">
          <h2 className="weather-card-title">{props.title || "Unknown"}</h2>
          {isCurrentCity(props.title) ? <span className="current-location-icon"> <LocationOnIcon /> </span> : null}
        </div>
        <div className="weather-card-icon-wrapper">
          <img
            className={`weather-card-icon _${data?.weather?.icon}`}
            src={require(`@media/images/forecast/icons/${data?.weather?.icon}.png`).default}
            alt={data?.temperature.value}
            width="65"
            height="65"
          />
          <span className="weather-card-temp current">
            {`${parseInt(data?.temperature?.value)}`}
            {SYMBOLS.CELSIUS}
          </span>
        </div>
        <span className="weather-card-description">
          {capitalize(data?.weather?.description)}
        </span>
      </div>
      <div className="weather-card-section">
        <div className="weather-card-temp-wrapper">
          <span className="weather-card-temp high">
            <CardField
              label="Max"
              value={parseInt(data?.temperature?.max)}
              valueSymbol={SYMBOLS.CELSIUS}
            />
          </span>
          <span className="weather-card-temp low">
            <CardField
              label="Min"
              value={parseInt(data?.temperature?.min)}
              valueSymbol={SYMBOLS.CELSIUS}
            />
          </span>
          <span className="weather-card-temp uv-index">
            <CardField
              label="UV"
              value={(data?.uvIndex).toFixed(1)}
            />
          </span>
          {isHumidityHigh(data?.humidity)
            ? <span className="weather-card-temp humidity">
              <CardField
                label="Humidity"
                value={data?.humidity}
                valueSymbol="%"
              />
            </span>
            : null}

        </div>
      </div>
      <div className="weather-card-section">
        <div className="weather-card-general-info">
          <span className="weather-card-temp">
            <CardField
              label="Sunrise"
              value={data?.sunrise.format("HH:mm")}
            />
          </span>
          <span className="weather-card-temp">
            <CardField
              label="Sunset"
              value={data?.sunset.format("HH:mm")}
            />
          </span>
          <span className="weather-card-temp">
            <CardField
              label="Wind"
              value={(data?.wind?.speed * 3600 / 1000).toFixed(1)}
              valueSymbol="km/h"
            />
          </span>
          {!isMisty(data?.weather?.description) || isLowVisibility(data?.visibility)
            ?
            <span className="weather-card-temp">
              <CardField
                label="Visibility"
                value={(data?.visibility / 1000).toFixed(1)}
                valueSymbol="km"
              />
            </span>
            : null}
        </div>
      </div>
    </div>
  );
}
