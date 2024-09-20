import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import { TopLevelSpec } from "vega-lite";
import chartConfig from "../shared/chart-config";

type Props = {
  spec: TopLevelSpec;
  yearSignal: number | null;
};
type Values = {
  date: number;
  count: string;
};
const CumulativeChart = ({ yearSignal, spec }: Props) => {
  const [chart, setChart] = useState<Result | null>(null);
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current) return;
    const tooltipOptions = {
      formatTooltip: (
        value: Values,
        sanitize: (x: string | number) => string
      ) =>
        `
      <p>${sanitize(value.date)}</p>
      <p>${sanitize(value.count)}</p>
  `,
    };
    const options = { ...chartConfig, tooltip: tooltipOptions };
    embed(chartContent.current, spec, options).then(setChart);
  }, [spec, yearSignal]);

  useEffect(() => {
    if (chart === null) return;
    chart.view.signal("year", yearSignal).runAsync();
  }, [chart, yearSignal]);

  return (
    <Box
      sx={{ height: "100%", width: "100%" }}
      ref={chartContent}
      id="chart-content"
    ></Box>
  );
};
export default CumulativeChart;
