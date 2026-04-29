import { Paper, Stack } from "@mui/material";
import HDivider from "./HDivider";

const IOCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paper
      elevation={8}
      sx={{
        px: 4,
        py: 4,
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={{ xs: 0, sm: 2, md: 3 }}>
        <HDivider />
        {children}
        <HDivider />
      </Stack>
    </Paper>
  );
};

export default IOCard;
