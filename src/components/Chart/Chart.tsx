import { Sparklines, SparklinesLine } from "react-sparklines";

export default function Chart(props: any) {
  const { data, min = 0 } = props;
  return (
    <div className="temp-chart">
      <Sparklines
        data={[...data]}
        width={data.length * 100}
        svgWidth={data.length * 22}
        height={data.length * 15}
        min={min / 2}
        max={Math.max(...data)}
      >
        <SparklinesLine
          color="yellow"
          style={{ strokeWidth: "0.5", fillOpacity: 0.2 }}
        />
      </Sparklines>
    </div>
  );
}
