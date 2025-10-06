import { Box, Stack } from "@mui/material";

const SectionFullColumnLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box flex={1}>
      <Stack direction="column" spacing={{ xs: 2, sm: 2, md: 6 }}>
        {children}
      </Stack>
    </Box>
  );
};

export default SectionFullColumnLayout;
