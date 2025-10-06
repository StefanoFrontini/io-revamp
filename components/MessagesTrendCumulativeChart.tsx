import messageTrendCumulativeLine from "@/assets/data/messages-trend-cumulative-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltip } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import embed from "vega-embed";
import chartConfig from "../shared/chartConfig";

const spec = toVegaLiteSpec(messageTrendCumulativeLine);

const MessagesTrendCumulativeChart = () => {
  const { data } = useDashboardData();
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current || !data) return;
    const tooltipOptions = {
      formatTooltip: formatTooltip("year_text", "count"),
    };
    const options = { ...chartConfig, tooltip: tooltipOptions };
    embed(chartContent.current, spec, options).then((chart) => {
      chart.view
        .insert("dashboardData", data.messages_cumulative)
        .resize()
        .runAsync();
    });
  }, [data]);

  return <Box sx={{ height: "100%", width: "100%" }} ref={chartContent}></Box>;
};
export default MessagesTrendCumulativeChart;
