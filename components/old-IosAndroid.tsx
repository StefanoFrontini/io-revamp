// import notificationAnalogSpec from "../assets/data/notifications-analog.vl.json";
// import notificationsDigitalSpec from "../assets/data/notifications-digital.vl.json";
// import notificationsTotalSpec from "../assets/data/notifications-total.vl.json";
// import pieChartAnalogSpec from "../assets/data/pie-chart-analog.vl.json";
// import pieChartDigitalSpec from "../assets/data/pie-chart-digital.vl.json";
import downloadOsSpec from "@/assets/data/old_download-os.vl.json";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { dashboardColors } from "@/styles/colors";
import { Box, Stack, Typography } from "@mui/material";
import KpiCard from "./KpiCard";
import PieChart from "./old-PieChart";

interface LegendProps {
  color: string | undefined;
  value: string;
}
const Legend = ({ color = "red", value = "70%" }: LegendProps) => {
  return (
    <Stack direction={"row"} alignItems={"center"}>
      <Box
        sx={{ width: 15, height: 15, bgcolor: color, mr: 1, borderRadius: 100 }}
      ></Box>
      <Typography
        variant="caption"
        sx={{ color: dashboardColors.get("grey-650"), fontWeight: 600 }}
      >
        {value}
      </Typography>
    </Stack>
  );
};

const IosAndroid = () => {
  return (
    <KpiCard>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 2, md: 4 }}
      >
        <Box>
          <Typography
            component="h3"
            variant="body2"
            sx={{
              color: dashboardColors.get("grey-850"),
              fontWeight: 600,
              mb: 1,
            }}
          >
            iOS o Android
          </Typography>
          <Typography
            variant="caption"
            component={"p"}
            sx={{ color: dashboardColors.get("grey-650"), mb: 1 }}
          >
            Il sistema operativo usato dagli utenti
          </Typography>
          <Stack direction={"column"} spacing={0.5}>
            <Legend
              color={dashboardColors.get("blue-500")}
              value="Android 70%"
            />
            <Legend color={dashboardColors.get("grey-650")} value="iOS 30%" />
          </Stack>
        </Box>
        <Box>
          <PieChart spec={toVegaLiteSpec(downloadOsSpec)} />
        </Box>
      </Stack>
    </KpiCard>
  );
};

export default IosAndroid;
