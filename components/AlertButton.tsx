import { Button } from "@mui/material";
import { dashboardColors } from "@/styles/colors";

export default function AlertButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Button
      sx={{
        color: dashboardColors.get("icon"),
        whiteSpace: "nowrap",
        fontWeight: 600,
        textTransform: "none",
      }}
      href="/"
      size="small"
    >
      {children}
    </Button>
  );
}
