import { Alert, AlertTitle } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { dashboardColors } from "@/styles/colors";

export default function MaintenanceAlert() {
  return (
    <Alert
      severity="warning"
      icon={<WarningRoundedIcon />}
      sx={{
        backgroundColor: dashboardColors.get("warning-alert"),
        border: `1px solid ${dashboardColors.get("warning-alert-border")}`,
        alignItems: "flex-start",
        "& .MuiAlert-icon": {
          color: dashboardColors.get("warning-icon"),
        },
      }}
    >
      <AlertTitle
        sx={{ fontWeight: 600, color: dashboardColors.get("warning-icon") }}
      >
        Attenzione
      </AlertTitle>
      <span style={{ color: dashboardColors.get("warning-icon") }}>
        È in corso una manutenzione programmata che potrebbe comportare dei
        ritardi nella disponibilità dei dati su dashboard e open data. Fai
        riferimento alla data indicata su questa pagina per verificare
        l&rsquo;ultimo aggiornamento disponibile. Gli aggiornamenti
        riprenderanno regolarmente al termine dell&rsquo;intervento.
      </span>
    </Alert>
  );
}
