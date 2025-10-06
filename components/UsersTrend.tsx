import { dashboardColors } from "@/styles/colors";
import { Box, Typography } from "@mui/material";
import KpiCard from "./KpiCard";
import UsersChart from "./UsersChart";

type Props = {
  title: string;
};

const UsersTrend = ({ title }: Props) => {
  return (
    <KpiCard>
      <Typography
        sx={{ fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.333334 }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "0.875rem",
          lineHeight: 1.285715,
        }}
      >
        Numero di utenti attivi che hanno fatto accesso all&rsquo;app almeno una
        volta, per singolo mese, negli ultimi 12 mesi
      </Typography>
      <Box style={{ height: "22rem" }}>
        <UsersChart />
      </Box>
      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontSize: "0.75rem",
          fontWeight: 600,
          lineHeight: 1.166666,
        }}
      >
        I valori mostrati sono una stima basata sulle informazioni disponibili
      </Typography>
    </KpiCard>
  );
};
export default UsersTrend;
