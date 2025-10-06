import { Stack } from "@mui/material";

const IOCardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 3 }}>
      {children}
    </Stack>
  );
};

export default IOCardContent;
