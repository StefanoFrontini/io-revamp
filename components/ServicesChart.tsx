import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import embed from "vega-embed";
import { TopLevelSpec } from "vega-lite";
import chartConfig from "../shared/chart-config";

type Props = {
  spec: TopLevelSpec;
};
const ServicesChart = ({ spec }: Props) => {
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current) return;
    embed(chartContent.current, spec, chartConfig);
  }, [spec]);

  return <Box sx={{ height: "23rem", width: "100%" }} ref={chartContent}></Box>;
};
export default ServicesChart;
