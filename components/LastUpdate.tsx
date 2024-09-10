import { Stack, Typography } from "@mui/material";
import lastUpdateSpec from "../assets/data/last-update.vl.json";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import KpiWrapper from "./KpiWrapper";

const LastUpdate = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0}
      justifyContent="center"
    >
      <Typography color="textSecondary" variant="caption">
        Ultimo aggiornamento -&nbsp;
      </Typography>
      <Typography color="textSecondary" variant="caption">
        <KpiWrapper spec={toVegaLiteSpec(lastUpdateSpec)} />
      </Typography>
    </Stack>
  );
};

export default LastUpdate;
