import mapJsonSpec from "@/assets/data/italy-regions-circles.vl.json";
import { dashboardColors } from "@/styles/colors";
import { Typography } from "@mui/material";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import KpiCard from "./KpiCard";
import ServicesMapChart from "./ServicesMapChart";

const ServicesMap = () => {
  return (
    <KpiCard>
      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "1.125rem",
          lineHeight: "1.5rem",
        }}
      >
        Distribuzione geografica dei servizi
      </Typography>
      <ServicesMapChart spec={toVegaLiteSpec(mapJsonSpec)} />
    </KpiCard>
  );
};
export default ServicesMap;
