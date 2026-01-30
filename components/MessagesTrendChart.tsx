import messagesTrendLineJson from "@/assets/data/messages-trend-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { formatNumber } from "@/shared/formatNumber";
import { DashboardData } from "@/services/zodSchema";
import { dashboardColors } from "@/styles/colors";
import chartConfig from "../shared/chartConfig";
import { visuallyHidden } from "@mui/utils";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import embed, { Result } from "vega-embed";

type Props = {
  yearSignal: number;
  cumulativeSignal: boolean;
};

// Definiamo il tipo per lo stato del Tooltip
type TooltipState = {
  isOpen: boolean;
  x: number;
  y: number;
  data: {
    month_name: string;
    year_label: string | number;
    metric_value: number;
  } | null;
};

const spec = toVegaLiteSpec(messagesTrendLineJson);
const ARIA_LABEL_TEXT =
  "Grafico andamento messaggi. Usa le frecce sinistra e destra per navigare i dati. Premi ESC per chiudere il tooltip se aperto.";

const MessagesTrendChart = ({ yearSignal, cumulativeSignal }: Props) => {
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

  // --- MODIFICA IMPORTANTE 1: Ref per accedere allo stato fresco dentro la callback ---
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

  // --- Elaborazione Dati (Invariata) ---
  const processedData = useMemo(() => {
    if (!data?.messages) return [];

    const filtered = data.messages.filter((d: DashboardData["messages"][0]) => {
      const dYear = new Date(d.date).getFullYear();
      return dYear === yearSignal;
    });

    filtered.sort(
      (a: DashboardData["messages"][0], b: DashboardData["messages"][0]) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let runningTotal = 0;

    return filtered.map((d: DashboardData["messages"][0]) => {
      const dateObj = new Date(d.date);
      runningTotal += d.count;
      const metric_value = cumulativeSignal ? runningTotal : d.count;

      return {
        ...d,
        metric_value,
        month_name: dateObj
          .toLocaleDateString("it-IT", { month: "short" })
          .replace(/^./, (str) => str.toUpperCase()),
        year_label: dateObj.getFullYear(),
        timestamp: dateObj.getTime(),
      };
    });
  }, [data, yearSignal, cumulativeSignal]);

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
    }, 400);
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

    // --- MODIFICA IMPORTANTE 2: Leggiamo dal REF, non dallo stato direttamente ---
    const currentTooltipState = tooltipStateRef.current;

    if (datum) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

      // Ora il console.log funzionerà correttamente mostrando lo stato aggiornato
      console.log("State aggiornato:", currentTooltipState);

      // Usiamo il valore aggiornato dal Ref per il controllo
      if (
        currentTooltipState.isOpen &&
        currentTooltipState.data?.month_name === datum.month_name &&
        currentTooltipState.data?.year_label === datum.year_label
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
            month_name: datum.month_name,
            year_label: datum.year_label,
            metric_value: datum.metric_value,
          },
        });
      }, 150);
    } else {
      handleMouseLeave();
    }
  };

  // --- Inizializzazione Grafico ---
  useEffect(() => {
    if (!chartContent.current || !data) return;

    const options = {
      ...chartConfig,
      tooltip: handleVegaTooltip,
    };

    embed(chartContent.current, spec, options).then((res) => {
      res.view.insert("dashboardData", data.messages).resize().runAsync();
      chartInstanceRef.current = res;
      setChart(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, yearSignal]);

  // Gestione segnali e pulizia timer...
  useEffect(() => {
    if (!chart) return;
    chart.view.signal("year", yearSignal).resize().runAsync();
    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, [chart, yearSignal]);

  useEffect(() => {
    if (!chart) return;
    chart.view.signal("is_cumulative", cumulativeSignal).resize().runAsync();
    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, [chart, cumulativeSignal]);

  // --- Navigazione Tastiera (Invariata) ---
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
    const padding = view.padding();
    const paddingLeft = typeof padding === "object" ? padding.left : padding;
    const paddingTop = typeof padding === "object" ? padding.top : padding;

    const x = scaleX(datum.timestamp);
    const y = scaleY(datum.metric_value);

    const clientX = rect.left + (paddingLeft || 0) + x;
    const clientY = rect.top + (paddingTop || 0) + y;

    const monthText = `Mese: ${datum.month_name}.`;
    const yearText = `Anno: ${datum.year_label}.`;
    const countText = `Numero messaggi: ${new Intl.NumberFormat("it-IT").format(
      datum.metric_value,
    )}.`;
    setSrText(`${monthText} ${yearText} ${countText}`);

    setTooltipState({
      isOpen: true,
      x: clientX,
      y: clientY,
      data: {
        month_name: datum.month_name,
        year_label: datum.year_label,
        metric_value: datum.metric_value,
      },
    });
  };

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
            transform: "translate(-50%, -115%)",
            zIndex: 1500,
            paddingRight: "0.5rem",
            paddingLeft: "1rem",
            paddingBottom: "0.5rem",
            paddingTop: "0.4rem",
            backgroundColor: "white",
            borderRadius: "6px",
            pointerEvents: "auto",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="2.5rem"
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                lineHeight: 1.285,
                color: dashboardColors.get("grey-850"),
                whiteSpace: "nowrap",
              }}
            >
              {tooltipState.data.month_name} {tooltipState.data.year_label}
            </Typography>
            <IconButton
              size="small"
              onClick={closeTooltip}
              aria-label="Chiudi tooltip"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 400,
                color: dashboardColors.get("grey-850"),
                lineHeight: 1.285,
              }}
            >
              {formatNumber(tooltipState.data.metric_value)}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MessagesTrendChart;
