import usersJson from "@/assets/data/users.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltipMonthYear } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import embed from "vega-embed";
import chartConfig from "../shared/chartConfig";

const spec = toVegaLiteSpec(usersJson);
const UsersChart = () => {
  const { data } = useDashboardData();
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current || !data) return;
    const tooltipOptions = {
      formatTooltip: formatTooltipMonthYear("month_name", "count", "year"),
    };
    const options = { ...chartConfig, tooltip: tooltipOptions };

    embed(chartContent.current, spec, options).then((chart) => {
      chart.view.insert("dashboardData", data.messages).resize().runAsync();
    });
  }, [data]);

  return <Box sx={{ height: "100%", width: "100%" }} ref={chartContent}></Box>;
};
export default UsersChart;
