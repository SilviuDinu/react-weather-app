export default function CardField(props: any) {
    const { label, value, valueSymbol, orientation = '' } = props;
    return (
        <div className={`weather-card-field-wrapper ${orientation}`}>
            <span className="weather-card-field-label">{label}:</span>
            <span className="weather-card-field-value">{value}{valueSymbol}</span>
        </div>
    );
}
