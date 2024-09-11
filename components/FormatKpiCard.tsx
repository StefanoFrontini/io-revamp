import { dashboardColors } from "@/styles/colors";
import { Typography } from "@mui/material";

const FormatKpiCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography
      component={"h3"}
      sx={{
        fontSize: "3rem",
        fontWeight: 700,
        color: dashboardColors.get("blue-500"),
        lineHeight: 0.875,
      }}
    >
      {children}
    </Typography>
  );
};

export default FormatKpiCard;
