import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import { TopLevelSpec } from "vega-lite";
import chartConfig from "../shared/chart-config";

type Props = {
  spec: TopLevelSpec;
  yearSignal: number | null;
};
const CumulativeChartMessages = ({
  spec,
  yearSignal,
}: // filterSignal,
Props) => {
  const [chart, setChart] = useState<Result | null>(null);
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current) return;
    embed(chartContent.current, spec, chartConfig).then(setChart);
  }, [spec]);

  // useEffect(() => {
  //   if (chart === null) return;
  //   chart.view.signal("is_overall", overallSignal).runAsync();
  // }, [chart, overallSignal]);

  // useEffect(() => {
  //   if (chart === null) return;
  //   chart.view.signal("notification_type", filterSignal).runAsync();
  // }, [chart, filterSignal]);

  useEffect(() => {
    if (chart === null) return;
    chart.view.signal("year", yearSignal).runAsync();
  }, [chart, yearSignal]);

  return <Box sx={{ height: "100%", width: "100%" }} ref={chartContent}></Box>;
};
export default CumulativeChartMessages;
