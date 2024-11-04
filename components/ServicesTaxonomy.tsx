import servicesTaxonomy from "@/assets/data/services-taxonomy.vl.json";
import { dashboardColors } from "@/styles/colors";
import { Typography } from "@mui/material";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import KpiCard from "./KpiCard";
import ServicesTaxonomyChart from "./ServicesTaxonomyChart";

const ServicesTaxonomy = () => {
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
        Distribuzione dei principali servizi per categoria
      </Typography>
      <ServicesTaxonomyChart spec={toVegaLiteSpec(servicesTaxonomy)} />
    </KpiCard>
  );
};
export default ServicesTaxonomy;
