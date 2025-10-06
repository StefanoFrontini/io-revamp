import { Stack } from "@mui/material";

const IORowCards = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 2, md: 4 }}
      justifyContent="space-between"
    >
      {children}
    </Stack>
  );
};

export default IORowCards;
