import { dashboardColors } from "@/styles/colors";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TopLevelSpec } from "vega-lite";
import DownloadsMessagesChart from "./DownloadsMessagesChart";
import KpiCard from "./KpiCard";

const curYear = new Date().getFullYear();

const optionsYear = [
  {
    id: 1,
    label: "overall",
    chart: null,
  },
  {
    id: 2,
    label: String(curYear),
    chart: curYear,
  },
  {
    id: 3,
    label: String(curYear - 1),
    chart: curYear - 1,
  },
  {
    id: 4,
    label: String(curYear - 2),
    chart: curYear - 2,
  },
];

type Props = {
  title: string;
  spec: TopLevelSpec;
};

const DownloadsMessagesTrend = ({ title, spec }: Props) => {
  const [curOptionYear, setCurOptionYear] = useState(optionsYear[0].id);

  const handleOptionsYear = (id: number) => {
    setCurOptionYear(id);
  };
  const getChartOption = (id: number) => {
    const result = optionsYear.find((f) => f.id === id);
    return result ? result.chart : null;
  };

  return (
    <KpiCard>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "2rem",
          lineHeight: 1.3125,
          color: dashboardColors.get("grey-850"),
        }}
      >
        {title}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Typography
          sx={{
            color: dashboardColors.get("grey-650"),
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: "1.5rem",
          }}
        >
          Seleziona il periodo di riferimento
        </Typography>

        <Select
          IconComponent={ExpandMoreOutlinedIcon}
          value={curOptionYear}
          size="small"
          onChange={(e: SelectChangeEvent<number>) =>
            handleOptionsYear(+e.target.value)
          }
        >
          {optionsYear.map(({ id, label }) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Box style={{ height: "22rem" }}>
        <DownloadsMessagesChart
          spec={spec}
          yearSignal={getChartOption(curOptionYear)}
        />
      </Box>
      <Typography
        sx={{ fontSize: "0.75rem", fontWeight: 600, lineHeight: 1.166666 }}
      >
        I dati mostrati sono da considerare come valori cumulati
      </Typography>
    </KpiCard>
  );
};
export default DownloadsMessagesTrend;
