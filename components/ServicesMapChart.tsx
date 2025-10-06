import { useDashboardData } from "@/hooks/useDashboardData";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";

import mapJsonSpec from "@/assets/data/italy-regions-circles.vl.json";
import { formatTooltip } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";

type Props = {
  categorySignal: string;
};
const spec = toVegaLiteSpec(mapJsonSpec);
const ServicesMapChart = ({ categorySignal }: Props) => {
  const { data, isPending, isLoading } = useDashboardData();

  const [chart, setChart] = useState<Result | null>(null);
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current || !data) return;
    const tooltipOptions = {
      formatTooltip: formatTooltip("regione", "count_serv"),
    };
    const options = {
      ...chartConfig,
      tooltip: tooltipOptions,
    };
    embed(chartContent.current, spec, options).then((chart) => {
      chart.view
        .insert("dashboardData", data.metrics_by_geo_cat)
        .resize()
        .runAsync();
      setChart(chart);
    });
  }, [data]);

  useEffect(() => {
    if (chart === null) return;
    chart.view.signal("category", categorySignal).runAsync();
  }, [chart, categorySignal]);

  return (
    <Box
      sx={{
        height: { xs: "25rem", sm: "37rem" },
        width: "100%",
        pt: { xs: "1rem", sm: "2rem" },
      }}
      ref={chartContent}
    ></Box>
  );
};
export default ServicesMapChart;
