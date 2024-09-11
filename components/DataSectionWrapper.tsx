import LastUpdate from "@/components/LastUpdate";
import { dashboardColors } from "@/styles/colors";
import { Box, Container, Stack, Typography } from "@mui/material";

type DataSectionWrapperProps = {
  title: string;
  description?: string;
  background?: "white" | "grey";
  anchor?: string;
  children: React.ReactNode;
};

export const DataSectionWrapper: React.FC<DataSectionWrapperProps> = ({
  title,
  anchor,
  children,
}) => {
  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "white",
      }}
    >
      <Container sx={{ py: 6, maxWidth: 1340 }} maxWidth={false}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{
              color: dashboardColors.get("grey-850"),
              scrollMarginTop: "124px",
            }}
            id={anchor}
          >
            {title}
          </Typography>
          <LastUpdate />
        </Stack>
        <Stack sx={{ mt: 3 }} spacing={3}>
          {children}
        </Stack>
      </Container>
    </Box>
  );
};
