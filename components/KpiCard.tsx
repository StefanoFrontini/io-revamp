import { dashboardColors } from "@/styles/colors";
import { Paper, Typography } from "@mui/material";

type Props = {
  children: React.ReactNode;
  subLabel?: string;
};
const KpiCard = ({ children, subLabel }: Props) => {
  return (
    <Paper
      elevation={8}
      sx={{
        px: 4,
        py: 6,
        borderRadius: 2,
      }}
    >
      {children}
      {subLabel && (
        <Typography
          variant="caption"
          sx={{
            color: dashboardColors.get("grey-850"),
          }}
        >
          {subLabel}
        </Typography>
      )}{" "}
    </Paper>
  );
};

export default KpiCard;
