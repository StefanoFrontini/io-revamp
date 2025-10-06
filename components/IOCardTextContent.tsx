import { dashboardColors } from "@/styles/colors";
import { Stack, Typography } from "@mui/material";

const IOCardTextContent = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <Stack direction={"column"} spacing={2}>
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
