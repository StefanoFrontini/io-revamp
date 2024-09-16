import LastUpdate from "@/components/LastUpdate";
import { dashboardColors } from "@/styles/colors";
import { Container, Stack, Typography } from "@mui/material";

type SectionLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const SectionLayout = ({ title, children }: SectionLayoutProps) => {
  return (
    <Container
      component="section"
      sx={{ py: 6, maxWidth: 1340, backgroundColor: "white" }}
      maxWidth={false}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Typography
          component="h2"
          sx={{
            color: dashboardColors.get("grey-850"),
            scrollMarginTop: "124px",
            fontSize: "2.375rem",
            fontWeight: 700,
            lineHeight: "3.125rem",
          }}
        >
          {title}
        </Typography>
        <LastUpdate />
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 2, md: 4 }}
        sx={{ mt: 3 }}
      >
        {children}
      </Stack>
    </Container>
  );
};
export default SectionLayout;
