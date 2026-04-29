import { dashboardColors } from "@/styles/colors";
import { Stack, Typography } from "@mui/material";

const IOCardTextContent = ({
  text,
  children,
  alignNumber = "flex-start"
}: {
  text: string;
  children: React.ReactNode;
  alignNumber?: "flex-start" | "center"
}) => {
  return (
    <Stack direction={"column"} alignItems={{sm: alignNumber}} spacing={2}>
      {children}
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
    </Stack>
  );
};

export default IOCardTextContent;
