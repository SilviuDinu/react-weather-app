import { MISC } from "@enums/misc.enum";
import { SYMBOLS } from "@enums/symbols.enum";
import { capitalize } from "lodash";

export default function CardSummaryInfo(props: any) {
  const { data } = props;
  return (
    <>
      <div className="weather-card-overview">
        <h2 className="weather-card-title">{props.title || 'Unknown'}</h2>
        <div className="weather-card-icon-wrapper">
          <img
            className="weather-card-icon"
            src={`http://${MISC.IMAGES_URI}${data?.weather?.icon}.png`}
            alt={data?.temperature.current}
            width="50"
            height="50"
          />
          <span className="weather-card-description">{capitalize(data?.weather?.description)}</span>
        </div>
      </div>
      <div className="weather-card-temp-wrapper">
        <span className="weather-card-temp current">
          {`Temp: ${parseInt(data?.temperature?.current)}`} {SYMBOLS.CELSIULS}
        </span>
        <span className="weather-card-temp high">
          {`Max: ${parseInt(data?.temperature?.max)}`} {SYMBOLS.CELSIULS}
        </span>
        <span className="weather-card-temp low">
          {`Min: ${parseInt(data?.temperature?.min)}`} {SYMBOLS.CELSIULS}
        </span>
        <span className="weather-card-temp humidity">{`Humidity: ${data?.humidity}%`}</span>
      </div>
      <div className="weather-card-sunrise-sunset">
        <span className="weather-card-sunrise">{`Sunrise: ${data?.sunrise}`}</span>
        <span className="weather-card-sunset">{`Sunset: ${data?.sunset}`}</span>
        <span className="weather-card-disclaimer">{MISC.LOCAL_TIMEZONE_DISCLAIMER}</span>
      </div>
    </>
  );
}