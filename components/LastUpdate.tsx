import { dashboardColors } from "@/styles/colors";
import { Typography } from "@mui/material";
import lastUpdateSpec from "../assets/data/last-update.vl.json";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import KpiValue from "./KpiValue";

const LastUpdate = () => {
  return (
    <Typography
      sx={{
        color: dashboardColors.get("grey-650"),
        fontWeight: 600,
        fontSize: "1.125rem",
        lineHeight: "1.5rem",
      }}
    >
      Ultimo aggiornamento -&nbsp;
      <KpiValue spec={toVegaLiteSpec(lastUpdateSpec)} />
    </Typography>
  );
};

export default LastUpdate;
