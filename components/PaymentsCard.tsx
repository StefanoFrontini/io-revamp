import { Paper } from "@mui/material";

const PaymentsCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paper
      elevation={8}
      sx={{
        px: 4,
        py: 4,
        borderRadius: 2,
      }}
    >
      {children}
    </Paper>
  );
};

export default PaymentsCard;
