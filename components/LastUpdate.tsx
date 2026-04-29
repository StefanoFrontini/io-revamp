import { dashboardColors } from "@/styles/colors";
import { Box, Typography } from "@mui/material";

type Props = {
  date: string;
  text?: string;
};
const LastUpdate = ({ date, text }: Props) => {
  return (
    <Box
      sx={{
        flex: { xs: "0 0 40%", md: "0 0 30%", lg: "0 0 25%" },
        textAlign: { xs: "start", sm: "end" },
      }}
    >
      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "1.125rem",
          lineHeight: "1.5rem",
          mb: 1,
        }}
      >
        Ultimo aggiornamento -&nbsp;
        {date}
      </Typography>
      {text && (
        <Typography
          sx={{
            color: dashboardColors.get("grey-650"),
            fontWeight: 600,
            fontSize: "0.875rem",
            lineHeight: 1.285715,
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default LastUpdate;
