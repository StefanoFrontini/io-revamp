import { dashboardColors } from "@/styles/colors";
import { Paper, Stack, Typography } from "@mui/material";

type Props = {
  children: React.ReactNode;
  text?: string;
};
const KpiCard = ({ children, text }: Props) => {
  return (
    <Paper
      elevation={8}
      sx={{
        px: 4,
        py: 4,
        borderRadius: 2,
        height: "100%",
        // boxShadow: "0 4px 32px 0 rgba(11, 62, 227, 0.5)",
      }}
    >
      <Stack direction={"column"} spacing={2} width={"100%"}>
        {children}
        {text && (
          <Typography
            sx={{
              color: dashboardColors.get("grey-650"),
              fontWeight: 600,
              fontSize: "1.125rem",
              lineHeight: "1.125rem",
            }}
          >
            {text}
          </Typography>
        )}{" "}
      </Stack>
    </Paper>
  );
};

export default KpiCard;
