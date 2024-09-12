import { Box } from "@mui/material";

const SectionSecondColumnLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Box sx={{ flex: "1 1 0" }}>{children}</Box>;
};

export default SectionSecondColumnLayout;
