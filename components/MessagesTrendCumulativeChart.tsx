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

  // --- Gestione Tooltip ---

  const closeTooltip = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));
    setSelectedIndex(-1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) return;

    closeTimeoutRef.current = setTimeout(() => {
      setTooltipState((prev) => ({ ...prev, isOpen: false }));
      closeTimeoutRef.current = null;
    }, 200);
  }, []);

  const handleMouseEnterTooltip = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Handler per il mouse: filtra solo i punti (symbol)
  const handleMouseMove = useCallback(
    (event: MouseEvent, item: any) => {
      // Importante: accettiamo solo "symbol" per evitare l'attivazione sull'area
      const isPointMark = item && item.mark && item.mark.marktype === "symbol";
      const datum = isPointMark ? item.datum : null;

      if (datum) {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }

        if (
          tooltipState.isOpen &&
          tooltipState.data?.year_text === datum.year_text
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
        }, 150);
      } else {
        handleMouseLeave();
      }
    },
    [handleMouseLeave, tooltipState.isOpen, tooltipState.data],
  );

  const handleGlobalMouseMoveRef = useRef(handleMouseMove);
  useEffect(() => {
    handleGlobalMouseMoveRef.current = handleMouseMove;
  }, [handleMouseMove]);

  // --- Inizializzazione Chart ---
  useEffect(() => {
    if (!chartContent.current || !data) return;

    const options = {
      ...chartConfig,
      tooltip: () => {}, // Disabilita tooltip nativo
    };

    embed(chartContent.current, spec, options).then((res) => {
      res.view
        .insert("dashboardData", data.messages_cumulative)
        .resize()
        .runAsync();

      chartInstanceRef.current = res;
      setChart(res);

      // Listener per il movimento del mouse sulla view di Vega
      res.view.addEventListener("mousemove", (event: any, item: any) => {
        handleGlobalMouseMoveRef.current(event, item);
      });
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.finalize();
      }
    };
  }, [data]);

  // --- Navigazione da Tastiera ---
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

    // FIX OFFSET: Usiamo origin() per includere lo spazio delle label assi
    const origin = view.origin();

    let x = scaleX(datum.timestamp);
    if (x === undefined) x = scaleX(datum.year);
    const y = scaleY(datum.count);

    const clientX = rect.left + origin[0] + x;
    const clientY = rect.top + origin[1] + y;

    setSrText(
      `Anno: ${datum.year_text}. Numero messaggi: ${formatNumber(datum.count)}.`,
    );

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
    } else return;

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
      onMouseLeave={handleMouseLeave}
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
            padding: "0.4rem 0.5rem 0.5rem 1rem",
            backgroundColor: dashboardColors.get("grey-850"),
            color: "#FFF",
            borderRadius: "6px",
            pointerEvents: "auto",
            overflow: "visible",
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
                color: "#FFF",
                whiteSpace: "nowrap",
              }}
            >
              {tooltipState.data.year_text}
            </Typography>
            <IconButton
              size="small"
              onClick={closeTooltip}
              sx={{
                color: "#FFF",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box>
            <Typography
              sx={{ fontWeight: 400, color: "#FFF", fontSize: "0.85rem" }}
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
