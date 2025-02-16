import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import embed from "vega-embed";
import { TopLevelSpec } from "vega-lite";
import chartConfig from "../shared/chart-config";

type Props = {
  spec: TopLevelSpec;
};
type Values = {
  count: number;
  year: string;
};
const ServicesChart = ({ spec }: Props) => {
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current) return;
    const tooltipOptions = {
      formatTooltip: (
        value: Values,
        sanitize: (x: string | number) => string
      ) =>
        `
      <p>${sanitize(value.year)}</p>
      <p>${sanitize(value.count)}</p>
  `,
    };
    const options = { ...chartConfig, tooltip: tooltipOptions };
    embed(chartContent.current, spec, options);
  }, [spec]);

  return <Box sx={{ height: "23rem", width: "100%" }} ref={chartContent}></Box>;
};
export default ServicesChart;
