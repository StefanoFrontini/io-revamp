import { Box, Stack } from "@mui/material";

const SectionFirstColumnLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ flex: "0 0 25%" }}>
      <Stack direction="column" spacing={{ xs: 2, sm: 2, md: 4 }}>
        {children}
      </Stack>
    </Box>
  );
};

export default SectionFirstColumnLayout;
