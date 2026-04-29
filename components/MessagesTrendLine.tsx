import { dashboardColors } from "@/styles/colors";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useId, useState } from "react";
import KpiCard from "./KpiCard";
import MessagesTrendChart from "./MessagesTrendChart";
import MessagesTrendCumulativeChart from "./MessagesTrendCumulativeChart";

type Overall = { tag: "overall"; label: string };
type CurYear = { tag: "cur_year"; label: string };
type CurYearMinusOne = { tag: "cur_year_minus_one"; label: string };
type CurYearMinusTwo = { tag: "cur_year_minus_two"; label: string };

type Cumulative = { tag: "cumulative"; label: string };
type Monthly = { tag: "monthly"; label: string };

const curYear = new Date().getFullYear();

const overall: Overall = { tag: "overall", label: "Complessivo" };
const year: CurYear = { tag: "cur_year", label: String(curYear) };
const yearMinusOne: CurYearMinusOne = {
  tag: "cur_year_minus_one",
  label: String(curYear - 1),
};
const yearMinusTwo: CurYearMinusTwo = {
  tag: "cur_year_minus_two",
  label: String(curYear - 2),
};

const cumulative: Cumulative = { tag: "cumulative", label: "cumulato" };
const monthly: Monthly = { tag: "monthly", label: "mensile" };

type Props = {
  title: string;
};

const MessagesTrendLine = ({ title }: Props) => {
  const [curOptionYear, setCurOptionYear] = useState<
    | Overall["tag"]
    | CurYear["tag"]
    | CurYearMinusOne["tag"]
    | CurYearMinusTwo["tag"]
  >(overall.tag);

  const [curOptionCumulative, setCurOptionCumulative] = useState<
    Cumulative["tag"] | Monthly["tag"]
  >(cumulative.tag);

  const selectIdYear = useId();
  const selectIdCumulative = useId();

  const labelIdYear = `${selectIdYear}-label`;
  const labelIdCumulative = `${selectIdCumulative}-label`;

  const handleOptionsYear = (
    tag:
      | Overall["tag"]
      | CurYear["tag"]
      | CurYearMinusOne["tag"]
      | CurYearMinusTwo["tag"],
  ) => {
    setCurOptionYear(tag);
  };

  const handleOptionsCumulative = (tag: Cumulative["tag"] | Monthly["tag"]) => {
    setCurOptionCumulative(tag);
  };

  const getCurOptionYear = (
    tag:
      | Overall["tag"]
      | CurYear["tag"]
      | CurYearMinusOne["tag"]
      | CurYearMinusTwo["tag"],
  ) => {
    switch (tag) {
      case "overall":
        return Number(overall.label);
      case "cur_year":
        return Number(year.label);
      case "cur_year_minus_one":
        return Number(yearMinusOne.label);
      case "cur_year_minus_two":
        return Number(yearMinusTwo.label);
      default:
        { const _exhaustiveCheck: never = tag;
        throw new Error(JSON.stringify(_exhaustiveCheck)); }
    }
  };

  const isYearValue = (
    value: string,
  ): value is
    | Overall["tag"]
    | CurYear["tag"]
    | CurYearMinusOne["tag"]
    | CurYearMinusTwo["tag"] => {
    return (
      value === "overall" ||
      value === "cur_year" ||
      value === "cur_year_minus_one" ||
      value === "cur_year_minus_two"
    );
  };

  const isCumulativeValue = (
    value: string,
  ): value is Cumulative["tag"] | Monthly["tag"] => {
    return value === "cumulative" || value === "monthly";
  };

  function parseEventTargetValue(
    name: "year",
  ): (
    value: string,
  ) =>
    | Overall["tag"]
    | CurYear["tag"]
    | CurYearMinusOne["tag"]
    | CurYearMinusTwo["tag"];
  function parseEventTargetValue(
    name: "cumulative",
  ): (value: string) => Cumulative["tag"] | Monthly["tag"];

  function parseEventTargetValue(name: "year" | "cumulative") {
    return (value: string) => {
      if (name === "year") {
        if (!isYearValue(value)) {
          throw new Error(`Invalid year value: ${value}`);
        }
        return value;
      } else if (name === "cumulative") {
        if (!isCumulativeValue(value)) {
          throw new Error(`Invalid cumulative value: ${value}`);
        }
        return value;
      }
      throw new Error(`Invalid name: ${name}`);
    };
  }

  const renderSelectCumulativeMonthly = () => {
    switch (curOptionYear) {
      case "overall":
        return <></>;
      default:
        return (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography
              id={labelIdCumulative}
              sx={{
                color: dashboardColors.get("grey-650"),
                fontWeight: 600,
                fontSize: "1.125rem",
                lineHeight: "1.5rem",
              }}
            >
              Tipo di valore
            </Typography>
            <FormControl>
              <Select
                IconComponent={ExpandMoreOutlinedIcon}
                id={selectIdCumulative}
                labelId={labelIdCumulative}
                MenuProps={{
                  disableEnforceFocus: true,
                }}
                inputProps={{
                  id: selectIdCumulative + "-input",
                }}
                value={curOptionCumulative}
                size="small"
                onChange={(e: SelectChangeEvent<string>) =>
                  handleOptionsCumulative(
                    parseEventTargetValue("cumulative")(e.target.value),
                  )
                }
              >
                {[cumulative, monthly].map(({ tag, label }) => (
                  <MenuItem sx={{ fontWeight: 600 }} key={tag} value={tag}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        );
    }
  };

  const renderChart = () => {
    switch (curOptionYear) {
      case "overall":
        return <MessagesTrendCumulativeChart />;
      default:
        return (
          <MessagesTrendChart
            yearSignal={getCurOptionYear(curOptionYear)}
            cumulativeSignal={curOptionCumulative === "cumulative"}
          />
        );
    }
  };

  const renderNote = () => {
    const footNoteCumulative =
      "Dati in valore cumulato. Il valore cumulato è la somma progressiva di una quantità nel tempo.";

    switch (true) {
      case curOptionYear === "overall" || curOptionCumulative === "cumulative":
        return footNoteCumulative;
      case curOptionYear !== "overall" && curOptionCumulative === "cumulative":
        return footNoteCumulative;
      case curOptionYear !== "overall" && curOptionCumulative === "monthly":
        return "Dati in valore assoluto.";
      default:
        throw new Error("Invalid state");
    }
  };

  return (
    <KpiCard>
      <Typography
        sx={{ fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.333334 }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "0.875rem",
          lineHeight: 1.285715,
        }}
      >
        Numero di messaggi inviati agli utenti dagli enti erogatori dei servizi
        attivi su IO.
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Typography
          id={labelIdYear}
          sx={{
            color: dashboardColors.get("grey-650"),
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: "1.5rem",
          }}
        >
          Seleziona il periodo di riferimento
        </Typography>

        <FormControl>
          <Select
            IconComponent={ExpandMoreOutlinedIcon}
            id={selectIdYear}
            labelId={labelIdYear}
            MenuProps={{
              disableEnforceFocus: true,
            }}
            inputProps={{
              id: selectIdYear + "-input",
            }}
            value={curOptionYear}
            size="small"
            onChange={(e: SelectChangeEvent<string>) =>
              handleOptionsYear(parseEventTargetValue("year")(e.target.value))
            }
          >
            {[overall, year, yearMinusOne, yearMinusTwo].map(
              ({ tag, label }) => (
                <MenuItem sx={{ fontWeight: 600 }} key={tag} value={tag}>
                  {label}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </Stack>

      {renderSelectCumulativeMonthly()}
      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "0.875rem",
          lineHeight: 1.285715,
        }}
      >
        Usa le frecce sinistra e destra per navigare i dati. Premi ESC per
        chiudere il tooltip se aperto.
      </Typography>

      <Box style={{ height: "22rem", marginBottom: "2rem" }}>
        {renderChart()}
      </Box>
      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontSize: "0.75rem",
          fontWeight: 600,
          lineHeight: 1.166666,
        }}
      >
        {renderNote()}
      </Typography>
    </KpiCard>
  );
};

export default MessagesTrendLine;
