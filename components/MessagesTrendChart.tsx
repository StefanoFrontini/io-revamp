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

  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isOpen: false,
    x: 0,
    y: 0,
    data: null,
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // --- Tooltip Management Functions ---

  // Function to close the tooltip immediately
  const closeTooltip = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = null;
    closeTimeoutRef.current = null;

    setTooltipState((prev) => ({ ...prev, isOpen: false }));
    setSelectedIndex(-1);
  }, []);

  // Function called when mouse leaves the chart or tooltip
  const handleMouseLeave = useCallback(() => {
    // 1. Stop any pending opening attempt
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // 2. If a closing timer is already active, do not reset it
    if (closeTimeoutRef.current) return;

    // 3. Start closing timer
    closeTimeoutRef.current = setTimeout(() => {
      setTooltipState((prev) => ({ ...prev, isOpen: false }));
      closeTimeoutRef.current = null;
    }, 200); // 200ms tolerance
  }, []);

  // Ref to access handleMouseLeave inside listeners
  const handleMouseLeaveRef = useRef(handleMouseLeave);
  useEffect(() => {
    handleMouseLeaveRef.current = handleMouseLeave;
  }, [handleMouseLeave]);

  // Function called when mouse enters the tooltip
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

  // This function opens and closes the tooltip based on the item received from the mouse move event
  const handleMouseMove = useCallback(
    (event: MouseEvent, item: any) => {
      // Only accept items from the point layer (symbol marks), not from the area layer.
      // The area mark returns the first datum of the series on hover, causing the bug.
      const isPointMark = item && item.mark && item.mark.marktype === "symbol";
      const datum = isPointMark ? item.datum : null;

      // CASE 1: We are over valid data
      if (datum) {
        // Cancel pending closing
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }

        // If already open on this datum, stop
        if (
          tooltipState.isOpen &&
          tooltipState.data?.month_name === datum.month_name &&
          tooltipState.data?.year_label === datum.year_label
        ) {
          return;
        }

        // Debounce opening
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
        }, 150); // 150ms delay
      }
      // CASE 2: We are over the background (no valid data)
      else {
        handleMouseLeave();
      }
    },
    [handleMouseLeave, tooltipState.isOpen, tooltipState.data],
  );

  // Ref to access the function inside the listener (avoids stale closure if the function changes)
  const handleGlobalMouseMoveRef = useRef(handleMouseMove);

  useEffect(() => {
    handleGlobalMouseMoveRef.current = handleMouseMove;
  }, [handleMouseMove]);

  // --- Chart Initialization ---
  useEffect(() => {
    if (!chartContent.current || !data) return;

    // Disable default plugin and use our handler
    const options = {
      ...chartConfig,
      tooltip: () => {}, // No-op to disable native tooltip
    };

    embed(chartContent.current, spec, options).then((res) => {
      res.view.insert("dashboardData", data.messages).resize().runAsync();
      chartInstanceRef.current = res;
      setChart(res);

      // Global Mouse Move Listener
      res.view.addEventListener("mousemove", (event: any, item: any) => {
        handleGlobalMouseMoveRef.current(event, item);
      });
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.finalize();
      }
    };
  }, [data, yearSignal]);

  // Update signals and cleanup
  useEffect(() => {
    if (!chart) return;
    chart.view.signal("year", yearSignal).resize().runAsync();

    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));

    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
    openTimeoutRef.current = null;
  }, [chart, yearSignal]);

  useEffect(() => {
    if (!chart) return;
    chart.view.signal("is_cumulative", cumulativeSignal).resize().runAsync();

    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));

    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
    openTimeoutRef.current = null;
  }, [chart, cumulativeSignal]);

  // --- Keyboard Navigation  ---
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

    // FIX: Usiamo view.origin() invece di view.padding()
    // origin[0] è l'offset X (spazio per le label Y)
    // origin[1] è l'offset Y (spazio per il titolo/top)
    const origin = view.origin();

    const x = scaleX(datum.timestamp);
    const y = scaleY(datum.metric_value);

    // Coordinate client corrette sommano:
    // Posizione SVG + Offset asse + coordinata punto
    const clientX = rect.left + origin[0] + x;
    const clientY = rect.top + origin[1] + y;

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
      onMouseLeave={handleMouseLeave} // Handle exit from React box
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

      {/* --- Custom Tooltip --- */}
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
            transform: "translate(-50%, -115%)", // Spazio per la freccia
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
            overflow: "visible", // Fondamentale per la freccia

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
          {/* Header with Close Button */}
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
                color: "#FFF",
                whiteSpace: "nowrap",
              }}
            >
              {tooltipState.data.month_name} {tooltipState.data.year_label}
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

          {/* Data Content */}
          <Box>
            <Typography
              sx={{
                fontWeight: 400,
                color: "#FFF",
                lineHeight: 1.285,
                fontSize: "0.85rem",
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
