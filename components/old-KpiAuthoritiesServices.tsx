import Stack from "@mui/material/Stack";
// import topAuthoritiesSpec from "../assets/data/top-authorities.vl.json";
import downloadKpiSpec from "@/assets/data/download-kpi.vl.json";

// import servicesSpec from "../assets/data/services.vl.json";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import Icons from "./Icons";
import KpiCard from "./KpiCard";
import IosAndroid from "./old-IosAndroid";
import Kpi from "./old-Kpi";

const KpiAuthoritiesServices = () => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <KpiCard subLabel="Download dell'app">
        <Icons.DownloadIcon sx={{ fontSize: 30 }} />
        <Kpi spec={toVegaLiteSpec(downloadKpiSpec)} />
      </KpiCard>
      <IosAndroid />
    </Stack>
  );
};

export default KpiAuthoritiesServices;
