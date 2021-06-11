import { SYMBOLS } from "@enums/symbols.enum";
import moment from "moment";
import { capitalize } from "@utils/helpers";
import { MISC } from '@enums/misc.enum';

export default function Card(props: any) {
  const { data } = props;
  return (
    <>
      <div
        className={`weather-card-wrapper ${data.weather[0].description
          .split(" ")
          .join("-")}`}
      >
        <div className="weather-card-overview">
          <h2 className="weather-card-title">{props.title || "Unknown"}</h2>
          <div className="weather-card-icon-wrapper">
            <img
              className="weather-card-icon"
              src={`http://${MISC.IMAGES_URI}${data.weather[0].icon}.png`}
              alt={data.weather[0].main}
              width="50"
              height="50"
            />
            <span className="weather-card-description">
              {capitalize(data.weather[0].description)}
            </span>
          </div>
        </div>
        <div className="weather-card-temp-wrapper">
          <span className="weather-card-temp current">
            {`Temp: ${parseInt(data.main.temp)} `} {SYMBOLS.CELSIULS}
          </span>
          <span className="weather-card-temp high">
            {`Max: ${parseInt(data.main.temp_max)} `} {SYMBOLS.CELSIULS}
          </span>
          <span className="weather-card-temp low">
            {`Min: ${parseInt(data.main.temp_min)} `} {SYMBOLS.CELSIULS}
          </span>
          <span className="weather-card-temp humidity">
            {`Humidity: ${parseInt(data.main.humidity)}%`}
          </span>
        </div>
        <div className="weather-card-sunrise-sunset">
          <span className="weather-card-sunrise">
            {`Sunrise: ${moment.unix(data.sys.sunrise).format("HH:mm")}`}
          </span>
          <span className="weather-card-sunset">
            {`Sunset: ${moment.unix(data.sys.sunset).format("HH:mm")}`}
          </span>
          <span className="weather-card-disclaimer">
            {MISC.LOCAL_TIMEZONE_DISCLAIMER}
          </span>
        </div>
      </div>
    </>
  );
}
