import { Box, Stack } from "@mui/material";

const SectionSecondColumnLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ flex: "1 1 0" }}>
      <Stack direction="column" spacing={{ xs: 2, sm: 2, md: 4 }}>
        {children}
      </Stack>
    </Box>
  );
};

export default SectionSecondColumnLayout;
