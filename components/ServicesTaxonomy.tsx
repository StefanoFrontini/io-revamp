import servicesTaxonomy from "@/assets/data/services-taxonomy.vl.json";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import KpiCard from "./KpiCard";
import ServicesTaxonomyChart from "./ServicesTaxonomyChart";

const ServicesTaxonomy = () => {
  return (
    <KpiCard>
      {/* <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "1.125rem",
          lineHeight: "1.5rem",
        }}
      >
        I servizi su IO:
      </Typography> */}
      <ServicesTaxonomyChart spec={toVegaLiteSpec(servicesTaxonomy)} />
    </KpiCard>
  );
};
export default ServicesTaxonomy;
