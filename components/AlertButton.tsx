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
      href="https://www.dati.gov.it/view-dataset?Cerca=&tags_set=io&tags=io&ordinamento=&organization=pagopa-s-p-a"
      size="small"
    >
      {children}
    </Button>
  );
}
