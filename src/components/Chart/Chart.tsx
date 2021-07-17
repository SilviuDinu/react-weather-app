import { Sparklines, SparklinesLine } from "react-sparklines";

export default function Chart(props: any) {
  const { data, min = 0 } = props;
  
  const tempItemWidth = document.querySelector('.hourly-weather-temp-item')?.clientWidth;

  return (
    <div className="temp-chart" style={{ marginLeft: '32px' }}>
      <Sparklines
        data={[...data]}
        width={data.length * (tempItemWidth || 100)}
        svgWidth={data.length * (tempItemWidth || 100)}
        height={data.length * 2}
        min={min / 2}
        max={Math.max(...data)}
      >
        <SparklinesLine
          color="yellow"
          style={{ strokeWidth: "0.5", fillOpacity: 0.2 }}
        />
      </Sparklines>
    </div >
  );
}
