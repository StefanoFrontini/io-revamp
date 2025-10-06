import mapJsonSpecEnti from "@/assets/data/italy-regions-circles-enti.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltipEntitiesMapChart } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
type Props = {
  categorySignal: string;
};

const spec = toVegaLiteSpec(mapJsonSpecEnti);
const EntiMapChart = ({ categorySignal }: Props) => {
  const { data } = useDashboardData();
  const [chart, setChart] = useState<Result | null>(null);

  const chartContent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartContent.current || !data) return;
    const tooltipOptions = {
      formatTooltip: formatTooltipEntitiesMapChart(
        "regione",
        "perc_enti",
        "count_enti",
        "count_enti_ipa"
      ),
    };
    const options = { ...chartConfig, tooltip: tooltipOptions };
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
    chart.view.signal("category", categorySignal).resize().runAsync();
  }, [categorySignal, chart]);

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
export default EntiMapChart;
