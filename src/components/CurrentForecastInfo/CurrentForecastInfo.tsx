import { MISC } from "@enums/misc.enum";
import { SYMBOLS } from "@enums/symbols.enum";
import { capitalize } from "lodash";
import moment from "moment";
import hot from "@media/images/temperature/hot.svg";

export default function CurrentForecastInfo(props: any) {
  const { data } = props;
  return (
    <div className="current-weather-info">
      <div className="weather-card-overview">
        <h2 className="weather-card-title">{props.title || "Unknown"}</h2>
        <div className="weather-card-icon-wrapper">
          <img
            className="weather-card-icon"
            src={`http://${MISC.IMAGES_URI}${data?.weather?.icon}.png`}
            alt={data?.temperature.value}
            width="50"
            height="50"
          />
          <span className="weather-card-temp current">
            {`${parseInt(data?.temperature?.value)}`}
            {SYMBOLS.CELSIULS}
          </span>
        </div>
        <span className="weather-card-description">
          {capitalize(data?.weather?.description)}
        </span>
      </div>
      <div className="weather-card-temp-wrapper">
        <span className="weather-card-temp high">
          {/* <img
            src={require(`@media/images/temperature/hot.svg`).default}
            className="temp-hot"
            width="30"
            height="auto"
            alt="logo"
          /> */}
          {`Max: ${parseInt(data?.temperature?.max)}`}
          {SYMBOLS.CELSIULS}
        </span>
        <span className="weather-card-temp low">
          {/* <img
            src={require(`@media/images/temperature/cold.svg`).default}
            className="temp-hot"
            width="30"
            height="auto"
            alt="logo"
          /> */}
          {`Min: ${parseInt(data?.temperature?.min)}`}
          {SYMBOLS.CELSIULS}
        </span>
        <span className="weather-card-temp humidity">
        {/* <img
            src={require(`@media/images/temperature/humidity.svg`).default}
            className="temp-humidity"
            width="30"
            height="auto"
            alt="logo"
          /> */}
          {`Humidity: ${data?.humidity}%`}</span>
      </div>
      <div className="weather-card-sunrise-sunset">
        <span className="weather-card-sunrise">{`Sunrise: ${data?.sunrise.format(
          "HH:mm"
        )}`}</span>
        <span className="weather-card-sunset">{`Sunset: ${data?.sunset.format(
          "HH:mm"
        )}`}</span>
        <span className="weather-card-disclaimer">
          {MISC.LOCAL_TIMEZONE_DISCLAIMER}
        </span>
      </div>
    </div>
  );
}
