import messagesTrendLineJson from "@/assets/data/messages-trend-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltipMonthYear } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";

type Props = {
  yearSignal: number;
  cumulativeSignal: boolean;
};
const spec = toVegaLiteSpec(messagesTrendLineJson);
const MessagesTrendChart = ({ yearSignal, cumulativeSignal }: Props) => {
  const { data } = useDashboardData();
  const [chart, setChart] = useState<Result | null>(null);
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current || !data) return;
    const tooltipOptions = {
      formatTooltip: formatTooltipMonthYear(
        "month_name",
        "metric_value",
        "year_label"
      ),
    };
    const options = { ...chartConfig, tooltip: tooltipOptions };
    embed(chartContent.current, spec, options).then((chart) => {
      chart.view.insert("dashboardData", data.messages).resize().runAsync();
      setChart(chart);
    });
  }, [data, yearSignal]);

  useEffect(() => {
    if (chart === null) return;
    chart.view.signal("year", yearSignal).resize().runAsync();
  }, [chart, yearSignal]);

  useEffect(() => {
    if (chart === null) return;
    chart.view.signal("is_cumulative", cumulativeSignal).resize().runAsync();
  }, [chart, cumulativeSignal]);

  return <Box sx={{ height: "100%", width: "100%" }} ref={chartContent}></Box>;
};
export default MessagesTrendChart;
