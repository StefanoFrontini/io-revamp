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
import KpiCard from "./KpiCard";

type Props = {
  selYear: number | null;
};

type LabelsCumulativeDaily = "aggregate" | "monthly";
type LabelsTotalDigitalAnalog = "total" | "digital" | "analog";

type OptionsCumulativeDaily = {
  id: number;
  label: LabelsCumulativeDaily;
};
type OptionsTotalDigitalAnalog = {
  id: number;
  label: LabelsTotalDigitalAnalog;
};

const optionsCumulativeDaily: OptionsCumulativeDaily[] = [
  { id: 1, label: "aggregate" },
  { id: 2, label: "monthly" },
];

const optionsTotalDigitalAnalog: OptionsTotalDigitalAnalog[] = [
  { id: 1, label: "total" },
  { id: 2, label: "digital" },
  { id: 3, label: "analog" },
];

const DownloadTrend = ({ selYear }: Props) => {
  const [curOptionCumulativeDaily, setCurOptionCumulativeDaily] = useState(
    optionsCumulativeDaily[0].id
  );
  const [curOptionTotalDigitalAnalog, setCurOptionTotalDigitalAnalog] =
    useState(optionsTotalDigitalAnalog[0].id);

  const handleOptionCumulativeDaily = (id: number) => {
    setCurOptionCumulativeDaily(id);
  };

  const handleOptionsTotalDigitalAnalog = (id: number) => {
    setCurOptionTotalDigitalAnalog(id);
  };
  return (
    <KpiCard>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="caption" color="textSecondary">
          description
        </Typography>

        <Select
          value={curOptionCumulativeDaily}
          size="small"
          sx={{ fontSize: 14 }}
          onChange={(e: SelectChangeEvent<number>) =>
            handleOptionCumulativeDaily(+e.target.value)
          }
        >
          {optionsCumulativeDaily.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              label
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="textSecondary">
          {" "}
          description
        </Typography>
        <Select
          size={"small"}
          sx={{ fontSize: 14 }}
          value={curOptionTotalDigitalAnalog}
          onChange={(e) => handleOptionsTotalDigitalAnalog(+e.target.value)}
        >
          {optionsTotalDigitalAnalog.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              label
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Box style={{ height: "22rem" }}>
        <CumulativeChart
          spec={toVegaLiteSpec(downloadSpec)}
          yearSignal={selYear}
        />
      </Box>
    </KpiCard>
  );
};
export default DownloadTrend;
