import messageTrendCumulativeLine from "@/assets/data/messages-trend-cumulative-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { DashboardData } from "@/services/zodSchema";
import { formatNumber } from "@/shared/formatNumber";
import { dashboardColors } from "@/styles/colors";
import { visuallyHidden } from "@mui/utils";
import CloseIcon from "@mui/icons-material/Close";

// Tipo per lo stato del Tooltip
type TooltipState = {
  isOpen: boolean;
  x: number;
  y: number;
  data: {
    year_text: string;
    count: number;
  } | null;
};

const spec = toVegaLiteSpec(messageTrendCumulativeLine);
const ARIA_LABEL_TEXT =
  "Grafico cumulativo annuale. Usa le frecce sinistra e destra per navigare i dati. Premi ESC per nascondere il tooltip.";

const MessagesTrendCumulativeChart = () => {
  const { data } = useDashboardData();
  const [chart, setChart] = useState<Result | null>(null);
  const [srText, setSrText] = useState("");
  const chartContent = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<Result | null>(null);

  // Stato per il Tooltip personalizzato
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isOpen: false,
    x: 0,
    y: 0,
    data: null,
  });

  // Ref per accedere allo stato fresco dentro la callback di Vega
  const tooltipStateRef = useRef(tooltipState);

  // Teniamo il ref sincronizzato con lo stato
  useEffect(() => {
    tooltipStateRef.current = tooltipState;
  }, [tooltipState]);

  // Timer ref per gestire la chiusura
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timer ref per gestire l'apertura (debounce)
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const processedData = useMemo(() => {
    if (!data?.messages_cumulative) return [];

    const sorted = [...data.messages_cumulative].sort(
      (
        a: DashboardData["messages_cumulative"][0],
        b: DashboardData["messages_cumulative"][0],
      ) => {
        return Number(a.year) - Number(b.year);
      },
    );

    return sorted.map((d: DashboardData["messages_cumulative"][0]) => {
      const dateObj = new Date(Number(d.year), 0, 1);

      return {
        ...d,
        timestamp: dateObj.getTime(),
        year_text: d.year,
        count: Number(d.count),
      };
    });
  }, [data]);

  // --- Funzioni di Gestione Tooltip ---

  // Funzione per chiudere il tooltip (immediata)
  const closeTooltip = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    setTooltipState((prev) => ({ ...prev, isOpen: false }));
    setSelectedIndex(-1);
  }, []);

  // Funzione chiamata quando il mouse esce dal grafico o dal tooltip
  const handleMouseLeave = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);

    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setTooltipState((prev) => ({ ...prev, isOpen: false }));
    }, 400); // 400ms di tolleranza
  };

  // Funzione chiamata quando il mouse entra nel tooltip (o ritorna sul punto)
  const handleMouseEnterTooltip = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  };

  // Handler personalizzato da passare a Vega
  const handleVegaTooltip = (
    handler: any,
    event: MouseEvent,
    item: any,
    value: any,
  ) => {
    const datum = item && item.datum;
    const currentTooltipState = tooltipStateRef.current;

    if (datum) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

      // Se siamo già sullo stesso punto, non facciamo nulla
      if (
        currentTooltipState.isOpen &&
        currentTooltipState.data?.year_text === datum.year_text
      ) {
        return;
      }

      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);

      openTimeoutRef.current = setTimeout(() => {
        setTooltipState({
          isOpen: true,
          x: event.clientX,
          y: event.clientY,
          data: {
            year_text: datum.year_text,
            count: datum.count,
          },
        });
      }, 150); // 150ms di ritardo
    } else {
      handleMouseLeave();
    }
  };

  useEffect(() => {
    if (!chartContent.current || !data) return;

    // Sostituiamo le opzioni di default con il nostro handler custom
    const options = {
      ...chartConfig,
      tooltip: handleVegaTooltip,
    };

    embed(chartContent.current, spec, options).then((res) => {
      res.view
        .insert("dashboardData", data.messages_cumulative)
        .resize()
        .runAsync();

      chartInstanceRef.current = res;
      setChart(res);
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current?.finalize();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!chart || processedData.length === 0) return;

    let newIndex = selectedIndex;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      newIndex =
        selectedIndex === -1
          ? 0
          : Math.min(processedData.length - 1, selectedIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      newIndex =
        selectedIndex === -1
          ? processedData.length - 1
          : Math.max(0, selectedIndex - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      newIndex = -1;
      closeTooltip();
    } else {
      return;
    }

    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      updateTooltipFromKeyboard(newIndex);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('[role="tooltip"]')) return;

    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));
  };

  const updateTooltipFromKeyboard = (index: number) => {
    if (!chart || index === -1) {
      closeTooltip();
      return;
    }

    const datum = processedData[index];
    const view = chart.view;

    const renderEl = chartContent.current?.querySelector("svg") as Element;
    if (!renderEl) return;

    const scaleX = view.scale("x");
    const scaleY = view.scale("y");

    const rect = renderEl.getBoundingClientRect();

    // Sostituiamo il calcolo del padding con view.origin()
    // origin[0] è l'offset orizzontale (include lo spazio delle label Y)
    // origin[1] è l'offset verticale (include lo spazio delle label X)
    const origin = view.origin();

    let x = scaleX(datum.timestamp);
    if (x === undefined) {
      x = scaleX(datum.year);
    }
    const y = scaleY(datum.count);

    // Coordinate client corrette
    const clientX = rect.left + origin[0] + x;
    const clientY = rect.top + origin[1] + y;

    // Testo Screen Reader
    const yearText = `Anno: ${datum.year_text}.`;
    const countText = `Numero messaggi: ${new Intl.NumberFormat("it-IT").format(
      datum.count,
    )}.`;
    setSrText(`${yearText} ${countText}`);

    // Aggiornamento Stato
    setTooltipState({
      isOpen: true,
      x: clientX,
      y: clientY,
      data: {
        year_text: datum.year_text,
        count: datum.count,
      },
    });
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        outline: "none",
        position: "relative",
        "&:focus": {
          boxShadow: `0 0 0 2px ${dashboardColors.get("blue-500")}`,
        },
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      aria-label={ARIA_LABEL_TEXT}
      role="application"
    >
      <div
        style={{ height: "100%", width: "100%" }}
        aria-hidden="true"
        ref={chartContent}
      />
      <div
        style={visuallyHidden}
        role="status"
        aria-live="assertive"
        aria-atomic="true"
      >
        {srText}
      </div>

      {/* --- Tooltip Personalizzato --- */}
      {tooltipState.isOpen && tooltipState.data && (
        <Paper
          elevation={4}
          role="tooltip"
          id="chart-tooltip"
          onMouseEnter={handleMouseEnterTooltip}
          onMouseLeave={handleMouseLeave}
          sx={{
            position: "fixed",
            top: tooltipState.y,
            left: tooltipState.x,
            transform: "translate(-50%, -115%)", // Spostato in alto per la freccia
            zIndex: 1500,
            paddingRight: "0.5rem",
            paddingLeft: "1rem",
            paddingBottom: "0.5rem",
            paddingTop: "0.4rem",

            // --- DARK MODE & ARROW STYLE ---
            backgroundColor: dashboardColors.get("grey-850"), // Sfondo scuro
            color: "#FFF", // Testo bianco
            borderRadius: "6px",
            pointerEvents: "auto",
            overflow: "visible", // Necessario per la freccia esterna

            // La Linguetta (Arrow Down)
            "&::after": {
              content: '""',
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "8px",
              borderColor: `${dashboardColors.get("grey-850")} transparent transparent transparent`,
            },
          }}
        >
          {/* Header con pulsante chiusura */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="5rem"
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                lineHeight: 1.285,
                color: "#FFF",
                whiteSpace: "nowrap",
              }}
            >
              {tooltipState.data.year_text}
            </Typography>
            <IconButton
              size="small"
              onClick={closeTooltip}
              aria-label="Chiudi tooltip"
              sx={{
                color: "#FFF", // Icona bianca
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Hover chiaro visibile
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Contenuto Dati */}
          <Box>
            <Typography
              sx={{
                fontWeight: 400,
                color: "#FFF",
                lineHeight: 1.285,
                fontSize: "0.85rem",
              }}
            >
              {formatNumber(tooltipState.data.count)}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
export default MessagesTrendCumulativeChart;
