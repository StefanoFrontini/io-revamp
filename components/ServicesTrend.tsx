import servicesTrend from "@/assets/data/services-trend.vl.json";
import { dashboardColors } from "@/styles/colors";
import { Typography } from "@mui/material";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import KpiCard from "./KpiCard";
import ServicesChart from "./ServicesChart";

const ServicesTrend = () => {
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
        title
      </Typography>
      <ServicesChart spec={toVegaLiteSpec(servicesTrend)} />
    </KpiCard>
  );
};
export default ServicesTrend;
