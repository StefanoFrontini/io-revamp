import Stack from "@mui/material/Stack";
// import topAuthoritiesSpec from "../assets/data/top-authorities.vl.json";
import downloadKpiSpec from "@/assets/data/download-kpi.vl.json";

// import servicesSpec from "../assets/data/services.vl.json";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import Icons from "./Icons";
import IosAndroid from "./IosAndroid";
import Kpi from "./Kpi";
import KpiCard from "./KpiCard";

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
