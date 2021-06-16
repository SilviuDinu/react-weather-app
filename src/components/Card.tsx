import { SYMBOLS } from "@enums/symbols.enum";
import { capitalize } from "@utils/helpers";
import { MISC } from '@enums/misc.enum';
import { Forecast } from "@models/forecast";

export default function Card(props: any) {
  const { currentInfo } = props.data as Forecast || {};
  const parseWrapperClass = (description: string): string => {
    return description.split(' ').join('-');
  };
  return (
    <>
      <div
        className={`weather-card-wrapper ${parseWrapperClass(currentInfo.weather.description)}`}
      >
        <div className="weather-card-overview">
          <h2 className="weather-card-title">{props.title || "Unknown"}</h2>
          <div className="weather-card-icon-wrapper">
            <img
              className="weather-card-icon"
              src={`http://${MISC.IMAGES_URI}${currentInfo.weather.icon}.png`}
              alt={currentInfo.temperature.current}
              width="50"
              height="50"
            />
            <span className="weather-card-description">
              {capitalize(currentInfo.weather.description)}
            </span>
          </div>
        </div>
        <div className="weather-card-temp-wrapper">
          <span className="weather-card-temp current">
            {`Temp: ${parseInt(currentInfo.temperature.current)} `} {SYMBOLS.CELSIULS}
          </span>
          <span className="weather-card-temp high">
            {`Max: ${parseInt(currentInfo.temperature.max)} `} {SYMBOLS.CELSIULS}
          </span>
          <span className="weather-card-temp low">
            {`Min: ${parseInt(currentInfo.temperature.min)} `} {SYMBOLS.CELSIULS}
          </span>
          <span className="weather-card-temp humidity">
            {`Humidity: ${currentInfo.humidity}%`}
          </span>
        </div>
        <div className="weather-card-sunrise-sunset">
          <span className="weather-card-sunrise">
            {`Sunrise: ${currentInfo.sunrise}`}
          </span>
          <span className="weather-card-sunset">
            {`Sunset: ${currentInfo.sunset}`}
          </span>
          <span className="weather-card-disclaimer">
            {MISC.LOCAL_TIMEZONE_DISCLAIMER}
          </span>
        </div>
      </div>
    </>
  );
}
