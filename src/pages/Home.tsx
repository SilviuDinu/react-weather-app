import { ENDPOINTS } from "@enums/endpoints.enum";
import { HOME_MESSAGES } from "@enums/home.enum";
import { FORM_DATA } from "@enums/search-form.enum";
import { CurrentCityWeather } from "@models/current-weather";
import { useEffect, useState } from "react";
import SearchForm from "@components/SearchForm";
import { SearchParams } from "@models/search-params";
import { buildSearchParams } from '@utils/helpers';

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

const getData = (params: any): Promise<any> => {
  const query = buildSearchParams(params);
  return fetch(ENDPOINTS.MOCK_CITY + query, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export default function Home(props: any) {
  const [weather, setWeather] = useState<CurrentCityWeather[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchValue: "",
    lat: NaN,
    long: NaN,
    submitted: false,
  });

  useEffect((): any => {
    let isSubscribed = true;
    if (searchParams.submitted && !loading) {
      setLoading(true);
      getData({ cityName: searchParams.searchValue, units: 'imperial' })
        .then((response: any) => response.json())
        .then((response: CurrentCityWeather[]) => {
          if (isSubscribed) {
            setWeather((weather) => [...weather, ...response]);
          }
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => (isSubscribed ? setLoading(false) : null));
    }

    return () => (isSubscribed = false);
  }, [searchParams.submitted]);

  useEffect((): any => {
    let isSubscribed = true;
    navigator.geolocation.getCurrentPosition(function (position) {
      if (isSubscribed) {
        setSearchParams((searchParams: SearchParams) => {
          return {
            ...searchParams,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };
        });
      }
    });

    console.log("Latitude is:", searchParams.lat);
    console.log("Longitude is:", searchParams.long);
    return () => (isSubscribed = false);
  }, [searchParams.lat, searchParams.long]);

  const onInputChange = (e: Event): void => {
    const val = (e.target as HTMLTextAreaElement).value || "";
    setSearchParams({
      ...searchParams,
      submitted: false,
      searchValue: val,
    });
  };

  const onFormSubmit = (e: Event): void => {
    if (e) {
      e.preventDefault();
    }
    setSearchParams({
      ...searchParams,
      submitted: true,
    });
  };

  return (
    <div className="home-page">
      <h1 className="home-page-title">{HOME_MESSAGES.TITLE}</h1>
      <div className="home-page-content">
        <SearchForm
          form={formData}
          inputValue={searchParams.searchValue}
          onInputChange={onInputChange}
          onFormSubmit={onFormSubmit}
        />
        {!loading
          ? weather.map((item: CurrentCityWeather, index: number) => (
              <p key={index}>{item.name}</p>
            ))
          : "Loading"}
      </div>
    </div>
  );
}
