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
import { useContext, useEffect, useRef } from "react";
import { FORM_DATA } from "@enums/search-form.enum";
import { CoordsContext } from "@providers/CoordsContext";
import { NotificationContext } from "@providers/NotificationContext";
import { LoadingContext } from "@providers/LoadingContext";
import { MESSAGES } from "@enums/misc.enum";
import Api from "@utils/api";
import { Forecast } from "@models/forecast";
import { LOADER_TYPES } from '@enums/loader-types.enum';
import { SearchParams } from '@models/search-params';
import { Coords } from '@models/coords';
import { CurrentCityContext } from '@providers/CurrentCityContext';

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
  const updates = useRef<NodeJS.Timeout[]>([]);
  const [, setCurrentCity] = useContext(CurrentCityContext);
  const [, setNotification] = useContext(NotificationContext);
  const [loading, setLoading] = useContext(LoadingContext);
  const [coords] = useContext(CoordsContext);
  const [weather, setWeather] = useContext(WeatherContext);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      updates.current.forEach((update: NodeJS.Timeout, index: number) => {
        clearTimeout(update);
        updates.current.splice(index, 1);
      });
      setLoading({ isLoading: false });
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (areCoordsValid(coords)) {
        if (!areCoordsInArray(weather, coords)) {
          setLoading({ isLoading: true, id: 0 });
          if (coords.city) {
            retrieveWeatherData({ lat: coords.lat, lon: coords.lon, city: coords.city }, { success: `${MESSAGES.INITIAL_SUCCESS} - ${coords.city}` });
            setCurrentCity(coords.city);
          }
          else {
            api.getCityByCoords({ lat: coords.lat, lon: coords.lon })
              .then((res: any) => {
                retrieveWeatherData({ lat: coords.lat, lon: coords.lon, city: res.city }, { success: `${MESSAGES.INITIAL_SUCCESS} - ${res.city}` });
                setCurrentCity(res.city);
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
    }
  }, [coords]);

  const areCoordsValid = (coords: Coords): boolean => {
    return !coords.loading && coords.lat !== null && coords.lon !== null;
  }

  const getCityData = (searchParams: SearchParams) => {
    if (isMounted.current && searchParams.submitted) {
      const loadingId = getLoadingId(weather, searchParams.searchValue);
      setLoading({
        isLoading: true,
        id: loadingId,
        isNext: !weather[loadingId],
      });
      return api.getCoordsByCity(searchParams.searchValue);
    }
    return Promise.reject(isMounted.current);
  }

  const retrieveWeatherData = (params:
    { lat: number, lon: number, city: string },
    messages?: { success?: MESSAGES | string, error?: MESSAGES | string }): void => {
    api.getAllWeatherByCoords({ ...params, units: "metric" })
      .then((response: Forecast) => {
        if (isMounted.current) {
          updateWeather(response);
          handleSuccess(messages?.success || MESSAGES.GENERIC_SUCCESS);
        }
      })
      .catch((err: any) => {
        if (isMounted.current) {
          handleErr(err, messages?.error || MESSAGES.GENERIC_ERROR);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          handleStopLoading();
        }
      });
  }

  const onFormSubmit = (params: SearchParams, e: Event): void => {
    if (e) {
      e.preventDefault();
    }
    if (!loading.isLoading && !coords.loading) {
      getCityData(params)
        .then((res: any) => {
          const { lat, lon, city } = res;
          retrieveWeatherData({ lat, lon, city });
        })
        .catch((err: any) => {
          if (isMounted.current) {
            handleStopLoading();
            handleErr(MESSAGES.GENERIC_ERROR, err);
          }
        });
    }
  };

  const updateWeather = (response: Forecast): void => {
    const item = response;
    const index = getObjIndexFromArray(weather, item);
    if (index > -1) {
      weather[index] = item;
      setWeather([...weather]);
    } else {
      setWeather((weather: any[]) => [...weather, item]);
    }
    scheduleUpdate(item, index);
  };

  const scheduleUpdate = (item: Forecast, index: number) => {
    if (!item) {
      return;
    }
    const { lat, lon, city } = item;
    if (index > -1) {
      clearTimeout(updates.current[index]);
      updates.current.splice(index, 1);
      const promise = setTimeout(() => {
        const loadingId = getLoadingId(weather, city);
        setLoading({
          isLoading: true,
          id: loadingId,
          isNext: !weather[loadingId],
        });
        retrieveWeatherData({ lat, lon, city });
      }, 3000);
      updates.current.push(promise);
      console.log(updates.current)
    }
  }

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
