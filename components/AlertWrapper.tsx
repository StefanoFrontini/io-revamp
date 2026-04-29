import { Alert, SxProps } from "@mui/material";
import { dashboardColors } from "@/styles/colors";
import Icons from "./Icons";
import AlertButton from "./AlertButton";

export default function AlertWrapper({
  children,
  buttonText,
  sx,
}: {
  children: React.ReactNode;
  buttonText: string;
  sx: SxProps;
}) {
  return (
    <Alert
      iconMapping={{
        info: <Icons.InfoIcon />,
      }}
      action={<AlertButton>{buttonText}</AlertButton>}
      severity="info"
      sx={{
        backgroundColor: dashboardColors.get("alert"),
        border: `1px solid ${dashboardColors.get("alert-border")}`,
        alignItems: "center",
        ...sx,
      }}
    >
      {children}
    </Alert>
  );
}
