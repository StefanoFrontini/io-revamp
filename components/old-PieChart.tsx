import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import embed from "vega-embed";
import { TopLevelSpec } from "vega-lite";
import chartConfig from "../shared/chart-config";

type Props = {
  spec: TopLevelSpec;
};

const PieChart = ({ spec }: Props) => {
  // const [chart, setChart] = useState<Result | null>(null);
  const chartContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContent.current) return;
    embed(chartContent.current, spec, chartConfig);
  }, [spec]);

  // useEffect(() => {
  //   if (chart === null) return;
  //   chart.view.signal("year", yearSignal).runAsync();
  // }, [chart, yearSignal]);

  return <Box ref={chartContent} sx={{ width: 120, height: 116 }}></Box>;
};

export default PieChart;
