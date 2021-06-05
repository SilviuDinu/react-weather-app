export default function Card(props: any) {
  return (
    <div className="weather-card-wrapper">
      <h1 className="weather-card-title">{props.title || 'Unknown'}</h1>
      <div className="weather-card-content"></div>
    </div>
  );
}
