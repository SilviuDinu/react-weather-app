import { HOME_MESSAGES } from "@enums/home.enum";
import SearchForm from "@components/SearchForm/SearchForm";
import Loader from "@components/Loader/Loader";
import CardGroup from "@components/CardGroup/CardGroup";
import { WeatherContext } from "@providers/WeatherContext";
import {
  areCoordsInArray,
  getLoadingId,
  getObjIndexFromArray,
} from "@utils/helpers";
import { ChangeEvent, useContext, useEffect, useRef } from "react";
import { FORM_DATA } from "@enums/search-form.enum";
import { CoordsContext } from "@providers/CoordsContext";
import { NotificationContext } from "@providers/NotificationContext";
import { LoadingContext } from "@providers/LoadingContext";
import { MESSAGES } from "@enums/misc.enum";
import Api from "@utils/api";
import { Forecast } from "@models/forecast";
import { LOADER_TYPES } from '@enums/loader-types.enum';
import { SearchParams } from '@models/search-params';

const formData = {
  input: {
    placeholder: FORM_DATA.PLACEHOLDER,
    ariaLabel: FORM_DATA.ARIA_LABEL,
    class: "city-search-form-input",
    autoComplete: false,
  },
  buttonText: FORM_DATA.BUTTON_TEXT,
  class: "city-search-form",
};

const api = new Api();

export default function Home(props: any) {
  const isMounted = useRef(true);
  const [, setNotification] = useContext(NotificationContext);
  const [, setLoading] = useContext(LoadingContext);
  const [coords] = useContext(CoordsContext);
  const [weather, setWeather] = useContext(WeatherContext);

  console.log('re-render Home')

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (!coords.loading && coords.lat !== null && coords.lon !== null) {
        if (!areCoordsInArray(weather, coords)) {
          setLoading({ isLoading: true, id: 0 });
          api
            .getCityByCoords({ lat: coords.lat, lon: coords.lon })
            .then((res: any) => {
              api
                .getAllWeatherByCoords({
                  lat: coords.lat,
                  lon: coords.lon,
                  cityName: res.cityName,
                })
                .then((response: Forecast) => {
                  if (isMounted.current) {
                    updateWeather(response);
                    handleSuccess(
                      `${MESSAGES.INITIAL_SUCCESS} - ${response.city}`
                    );
                  }
                })
                .catch((err: any) => {
                  if (isMounted.current) {
                    handleErr(MESSAGES.GENERIC_ERROR, err);
                  }
                })
                .finally(() => {
                  if (isMounted.current) {
                    handleStopLoading();
                  }
                });
            })
            .catch((err: any) => {
              if (isMounted.current) {
                handleStopLoading();
                handleErr(MESSAGES.GENERIC_ERROR, err);
              }
            });
        }
      }
    }
  }, [coords]);

  const getWeather = (searchParams: SearchParams) => {
    if (isMounted.current && searchParams.submitted) {
      const loadingId = getLoadingId(weather, searchParams.searchValue);
      setLoading({
        isLoading: true,
        id: loadingId,
        isNext: !weather[loadingId],
      });
      api
        .getCoordsByCity(searchParams.searchValue)
        .then((res: any) => {
          const { lat, lon, cityName } = res;
          api
            .getAllWeatherByCoords({ lat, lon, cityName, units: "metric" })
            .then((response: Forecast) => {
              if (isMounted.current) {
                updateWeather(response);
                handleSuccess(MESSAGES.GENERIC_SUCCESS);
              }
            })
            .catch((err: any) => {
              if (isMounted.current) {
                handleErr(err, MESSAGES.GENERIC_ERROR);
              }
            })
            .finally(() => {
              if (isMounted.current) {
                handleStopLoading();
              }
            });
        })
        .catch((err: any) => {
          if (isMounted.current) {
            handleStopLoading();
            handleErr(MESSAGES.GENERIC_ERROR, err);
          }
        });
    }
  }

  const updateWeather = (response: Forecast): void => {
    const item = response;
    const index = getObjIndexFromArray(weather, item);
    if (index > -1) {
      weather[index] = item;
      setWeather([...weather]);
    } else {
      setWeather((weather: any[]) => [...weather, item]);
    }
  };

  const handleErr = (message: MESSAGES, err?: any): void => {
    setNotification({
      severity: "error",
      message,
      isVisible: true,
    });
  };

  const handleSuccess = (message: MESSAGES | string): void => {
    setNotification({
      severity: "success",
      message,
      isVisible: true,
    });
  };

  const handleStopLoading = (): void => {
    setLoading({
      isLoading: false,
      isNext: false,
    });
  };

  const onFormSubmit = (params: SearchParams, e: Event): void => {
    if (e) {
      e.preventDefault();
    }
    getWeather(params);
  };

  return (
    <div className="home-page">
      <h1 className="home-page-title">{HOME_MESSAGES.TITLE}</h1>
      <div className="home-page-content">
        <SearchForm form={formData} onFormSubmit={onFormSubmit} />
        {/* try to display forecast based on current location */}
        {coords.loading && !coords.error ? (
          <Loader isLoading={coords.loading} type={LOADER_TYPES.SPINNER} />
        ) : (
          <CardGroup />
        )}
      </div>
    </div>
  );
}
