import { WeatherContext } from "@providers/WeatherContext";
import Card from "@components/Card/Card";
import { useContext } from "react";
import { Forecast } from "@models/forecast";
import Loader from "@components/Loader/Loader";
import { LoadingContext } from "@providers/LoadingContext";
import { LOADER_TYPES } from "@enums/loader-types.enum";

export default function CardGroup(props: any) {
  const [weather] = useContext(WeatherContext);
  const [loading] = useContext(LoadingContext);

  /*
  Decide if we need to re-load an existing weather Card
  if the index from the map function is the same as the loading ID

  OR

  if the index from map is undefined means we're fetching forecast data for a non-existing
  card, and if that's the case, we display the loader insteaf of the new card
  */

  const displayLoader = (currIndex?: number): boolean => {
    return (
      loading.isLoading &&
      (loading.id === 0 || !!loading.id) &&
      (currIndex === loading.id ||
        (currIndex === undefined && loading.id === weather.length))
    );
  };

  return (
    <div className="card-group">
      {weather.map((item: any, index: number) =>
        displayLoader(index) ? (
          <Loader
            key={index}
            isLoading={loading.isLoading}
            type={LOADER_TYPES.SKELETON}
            numCols={3}
            numRows={3}
            rowWidth={100}
            rowHeight={25}
          />
        ) :
          <Card
            key={index}
            title={item.city}
            id={index}
            data={item as Forecast}
          ></Card>
      )}
      {displayLoader() ?
        <Loader
          isLoading={loading.isLoading}
          type={LOADER_TYPES.SKELETON}
          numCols={3}
          numRows={3}
          rowWidth={100}
          rowHeight={25}
        /> : null}
    </div>
  );
}
