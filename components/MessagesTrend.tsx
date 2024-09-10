import messagesSeriesSpec from "@/assets/data/messages-series.vl.json";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toVegaLiteSpec } from "../shared/toVegaLiteSpec";
import CumulativeChartMessages from "./CumulativeChartMessages";
import KpiCard from "./KpiCard";

type LabelsCumulativeDaily = "aggregate" | "monthly";

type OptionsCumulativeDaily = {
  id: number;
  label: LabelsCumulativeDaily;
};

const optionsCumulativeDaily: OptionsCumulativeDaily[] = [
  { id: 1, label: "aggregate" },
  { id: 2, label: "monthly" },
];

const MessagesTrend = () => {
  const [curOptionCumulativeDaily, setCurOptionCumulativeDaily] = useState(
    optionsCumulativeDaily[0].id
  );

  const handleOptionCumulativeDaily = (id: number) => {
    setCurOptionCumulativeDaily(id);
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
      </Stack>
      <Box style={{ height: "22rem" }}>
        <CumulativeChartMessages
          spec={toVegaLiteSpec(messagesSeriesSpec)}
          cumulativeSignal={curOptionCumulativeDaily === 1 ? true : false}
        />
      </Box>
    </KpiCard>
  );
};
export default MessagesTrend;
