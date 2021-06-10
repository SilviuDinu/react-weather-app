import { LoadingContext } from "@providers/LoadingContext";
import { useContext } from "react";
import Loader from "@components/Loader";

export default function Card(props: any) {
  const [loading, setLoading] = useContext(LoadingContext);
  const { data } = props;
  return (
    <>
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <div className="weather-card-wrapper">
          <h1 className="weather-card-title">{props.title || "Unknown"}</h1>
          <div className="weather-card-content">
            <span>Temperatura: {`${data.main.temp}`}</span>
          </div>
        </div>
      )}
    </>
  );
}
