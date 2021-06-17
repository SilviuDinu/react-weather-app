import { HOME_MESSAGES } from '@enums/home.enum';
import SearchForm from '@components/SearchForm';
import Loader from '@components/Loader';
import CardGroup from '@components/CardGroup';
import { SearchParamsContext } from '@providers/SearchParamsContext';
import { WeatherContext } from '@providers/WeatherContext';
import { areCoordsInArray, exists, getObjIndexFromArray } from '@utils/helpers';
import { useContext, useEffect, useRef } from 'react';
import { FORM_DATA } from '@enums/search-form.enum';
import { CoordsContext } from '@providers/CoordsContext';
import { NotificationContext } from '@providers/NotificationContext';
import { LoadingContext } from '@providers/LoadingContext';
import { MESSAGES } from '@enums/misc.enum';
import Api from '@utils/api';
import { Forecast } from '@models/forecast';

const formData = {
  input: {
    placeholder: FORM_DATA.PLACEHOLDER,
    ariaLabel: FORM_DATA.ARIA_LABEL,
    class: 'city-search-form-input',
    autoComplete: false,
  },
  buttonText: FORM_DATA.BUTTON_TEXT,
  class: 'city-search-form',
};

const api = new Api();

export default function Home(props: any) {
  const isMounted = useRef(true);
  const [notification, setNotification] = useContext(NotificationContext);
  const [loading, setLoading] = useContext(LoadingContext);
  const [searchParams, setSearchParams] = useContext(SearchParamsContext);
  const [coords] = useContext(CoordsContext);
  const [weather, setWeather] = useContext(WeatherContext);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (!coords.loading && coords.lat !== null && coords.lon !== null) {
        if (!areCoordsInArray(weather, coords)) {
          setLoading(coords.loading);
          api.getWeatherByCoords({ lat: coords.lat, lon: coords.lon })
            .then((response: Forecast) => {
              if (isMounted.current) {
                updateWeather(response);
                setNotification({
                  severity: 'success',
                  message: `${MESSAGES.INITIAL_SUCCESS} - ${response.city}`,
                  isVisible: true,
                });
              }
            })
            .catch((err: any) => {
              if (isMounted.current) {
                setNotification({
                  severity: 'error',
                  message: MESSAGES.GENERIC_ERROR,
                  isVisible: true,
                });
              }
            });
        }
      }
    }
  }, [coords]);

  useEffect(() => {
    if (isMounted.current && searchParams.submitted) {
      setLoading(true);
      api.getWeatherByCity({ cityName: searchParams.searchValue, units: 'metric' })
        .then((response: Forecast) => {
          if (isMounted.current) {
            updateWeather(response);
            setSearchParams({
              ...searchParams,
              searchValue: '',
              submitted: false,
            });
            setNotification({
              severity: 'success',
              message: MESSAGES.GENERIC_SUCCESS,
              isVisible: true,
            });
          }
        })
        .catch((err: any) => {
          if (isMounted.current) {
            setNotification({
              severity: 'error',
              message: MESSAGES.GENERIC_ERROR,
              isVisible: true,
            });
          }
        })
        .finally(() => (isMounted.current ? setLoading(false) : null));
    }
  }, [searchParams.submitted]);

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

  return (
    <div className="home-page">
      <h1 className="home-page-title">{HOME_MESSAGES.TITLE}</h1>
      <div className="home-page-content">
        <SearchForm form={formData} />
        {/* try to display forecast based on current location */}
        {coords.loading && !coords.error ? <Loader isLoading={coords.loading} /> : <CardGroup />}
      </div>
    </div>
  );
}
