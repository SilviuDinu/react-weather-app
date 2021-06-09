export default function Card(props: any) {
  const {data} = props;
  return (
    <div className="weather-card-wrapper">
      <h1 className="weather-card-title">{props.title || 'Unknown'}</h1>
      <div className="weather-card-content">
        <span>Temperatura: {`${data.main.temp}`}</span>
      </div>
    </div>
  );
}
