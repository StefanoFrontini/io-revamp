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
import downloadSpec from "../assets/data/download.vl.json";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import CumulativeChart from "./CumulativeChart";
import Icons from "./Icons";
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

const DownloadTrend = () => {
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
          {optionsYear.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Box style={{ height: "22rem" }}>
        <CumulativeChart
          spec={toVegaLiteSpec(downloadSpec)}
          yearSignal={getChartOption(curOptionYear)}
        />
      </Box>
      <Typography
        sx={{ fontSize: "0.75rem", fontWeight: 600, lineHeight: 1.166666 }}
      >
        I dati mostrati sono da considerare come valori cumulati
      </Typography>
      <Box sx={{ backgroundColor: dashboardColors.get("turquoise"), p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Icons.NoteIcon sx={{ fontSize: "1.5rem" }} />{" "}
          <Typography
            sx={{ fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 }}
          >
            Cos’è un dato cumulato
          </Typography>
        </Stack>
        <Box sx={{ mt: 1 }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit,
          deserunt officiis? Fugit culpa veniam nam, molestiae vero, esse magni
          dolor illum repellat temporibus et, id distinctio aut provident libero
          iste.
        </Box>
      </Box>
    </KpiCard>
  );
};
export default DownloadTrend;
