import { dashboardColors } from "@/styles/colors";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useId, useState } from "react";
import EntitiesMapChart from "./EntitiesMapChart";
import KpiCard from "./KpiCard";
import ServicesMapChart from "./ServicesMapChart";

type Servizi = {
  tag: "servizi";
  label: string;
};

type Enti = {
  tag: "enti";
  label: string;
};

type Comuni = {
  tag: "comuni";
  label: string;
};
type Istruzione = {
  tag: "istruzione";
  label: string;
};

const servizi: Servizi = {
  tag: "servizi",
  label: "Servizi",
};

const enti: Enti = {
  tag: "enti",
  label: "Enti",
};

const comuni: Comuni = {
  tag: "comuni",
  label: "Comuni",
};
const istruzione: Istruzione = {
  tag: "istruzione",
  label: "Istruzione",
};

const ServicesMap = () => {
  const [curMapOption, setCurMapOption] = useState<
    Servizi["tag"] | Enti["tag"]
  >(servizi.tag);
  const [curOptionCategory, setCurOptionCategory] = useState<
    Comuni["tag"] | Istruzione["tag"]
  >(comuni.tag);

  const selectId = useId();
  const selectIdCategory = useId();

  const labelIdMap = `${selectId}-label`;
  const labelIdCategory = `${selectIdCategory}-label`;

  const handleOptionsMap = (tag: Servizi["tag"] | Enti["tag"]) => {
    setCurMapOption(tag);
  };

  const handleOptionsCategory = (tag: Comuni["tag"] | Istruzione["tag"]) => {
    setCurOptionCategory(tag);
  };

  const getCurOptionCategory = (tag: Comuni["tag"] | Istruzione["tag"]) => {
    switch (tag) {
      case "comuni":
        return comuni.label;
      case "istruzione":
        return istruzione.label;
      default:
        { const _exhaustiveCheck: never = tag;
        throw new Error(JSON.stringify(_exhaustiveCheck)); }
    }
  };

  const renderMap = () => {
    switch (curMapOption) {
      case "servizi":
        return (
          <ServicesMapChart
            categorySignal={getCurOptionCategory(curOptionCategory)}
          />
        );
      case "enti":
        return (
          <EntitiesMapChart
            categorySignal={getCurOptionCategory(curOptionCategory)}
          />
        );
      default:
        { const _exhaustiveCheck: never = curMapOption;
        throw new Error(JSON.stringify(_exhaustiveCheck)); }
    }
  };

  const renderNote = () => {
    switch (curMapOption) {
      case "servizi":
        return "Ogni bolla rappresenta i servizi attivi su IO in una regione, in base alla collocazione geografica degli enti erogatori. La dimensione della bolla indica il volume dei servizi. Il valore numerico è disponibile nel riquadro informativo associato a ciascuna regione, visualizzabile al passaggio del mouse oppure tramite navigazione da tastiera. Per navigare da tastiera usa le frecce sinistra e destra per spostarti tra i riquadri informativi delle regioni e premi ESC per chiuderli.";
      case "enti":
        return "La mappa mostra la percentuale di enti attivi in ciascuna regione. Il valore è rappresentato dall’intensità del colore ed è disponibile anche nel riquadro informativo associato a ogni regione. Il riquadro può essere visualizzato al passaggio del mouse o tramite navigazione da tastiera: usa le frecce sinistra e destra per spostarti tra le regioni e premi ESC per chiudere il riquadro informativo.";
      default:
        { const _exhaustiveCheck: never = curMapOption;
        throw new Error(JSON.stringify(_exhaustiveCheck)); }
    }
  };

  const isMapValue = (value: string): value is Servizi["tag"] | Enti["tag"] => {
    return value === "servizi" || value === "enti";
  };

  const isCategoryValue = (
    value: string,
  ): value is Comuni["tag"] | Istruzione["tag"] => {
    return value === "comuni" || value === "istruzione";
  };

  function parseEventTargetValue(
    name: "map",
  ): (value: string) => Servizi["tag"] | Enti["tag"];
  function parseEventTargetValue(
    name: "category",
  ): (value: string) => Comuni["tag"] | Istruzione["tag"];

  function parseEventTargetValue(name: "map" | "category") {
    return (value: string) => {
      if (name === "map") {
        if (!isMapValue(value)) {
          throw new Error(`Invalid map value: ${value}`);
        }
        return value;
      } else if (name === "category") {
        if (!isCategoryValue(value)) {
          throw new Error(`Invalid category value: ${value}`);
        }
        return value;
      }
      throw new Error(`Invalid name: ${name}`);
    };
  }

  return (
    <KpiCard>
      <Typography
        sx={{ fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.333334 }}
      >
        Distribuzione geografica dei servizi
      </Typography>

      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "0.875rem",
          lineHeight: 1.285715,
        }}
      >
        Il grafico mostra la distribuzione degli enti e dei servizi attivi nelle
        diverse regioni, per categoria.
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Typography
          id={labelIdMap}
          sx={{
            color: dashboardColors.get("grey-650"),
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: "1.5rem",
          }}
        >
          Visualizza
        </Typography>
        <FormControl>
          <Select
            IconComponent={ExpandMoreOutlinedIcon}
            id={selectId}
            labelId={labelIdMap}
            MenuProps={{
              disableEnforceFocus: true,
            }}
            inputProps={{
              id: selectId + "-input",
            }}
            defaultValue="servizi"
            value={curMapOption}
            size="small"
            onChange={(e: SelectChangeEvent<string>) =>
              handleOptionsMap(parseEventTargetValue("map")(e.target.value))
            }
          >
            {[servizi, enti].map(({ label, tag }) => (
              <MenuItem sx={{ fontWeight: 600 }} key={tag} value={tag}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography
          id={labelIdCategory}
          sx={{
            color: dashboardColors.get("grey-650"),
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: "1.5rem",
          }}
        >
          Seleziona la categoria
        </Typography>

        <FormControl>
          <Select
            IconComponent={ExpandMoreOutlinedIcon}
            id={selectIdCategory}
            labelId={labelIdCategory}
            MenuProps={{
              disableEnforceFocus: true,
            }}
            inputProps={{
              id: selectIdCategory + "-input",
            }}
            value={curOptionCategory}
            size="small"
            onChange={(e: SelectChangeEvent<string>) =>
              handleOptionsCategory(
                parseEventTargetValue("category")(e.target.value),
              )
            }
          >
            {[comuni, istruzione].map(({ label, tag }) => (
              <MenuItem sx={{ fontWeight: 600 }} key={tag} value={tag}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Typography
        sx={{
          color: dashboardColors.get("grey-650"),
          fontWeight: 600,
          fontSize: "0.875rem",
          lineHeight: 1.285715,
        }}
      >
        {renderNote()}
      </Typography>
      {renderMap()}
    </KpiCard>
  );
};
export default ServicesMap;
