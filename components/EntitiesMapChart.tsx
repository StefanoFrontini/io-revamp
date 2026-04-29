import mapJsonSpecEnti from "@/assets/data/italy-regions-circles-enti.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";

import { visuallyHidden } from "@mui/utils";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { dashboardColors } from "@/styles/colors";
import { DashboardData } from "@/services/zodSchema";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  categorySignal: string;
};

type TooltipState = {
  isOpen: boolean;
  x: number;
  y: number;
  data: {
    regione: string;
    perc_enti: number;
    count_enti: number;
    count_enti_ipa: number;
  } | null;
};

const spec = toVegaLiteSpec(mapJsonSpecEnti);

const NOISE_ROLES = new Set([
  "graphics-document",
  "graphics-object",
  "graphics-symbol",
  "graphics-data-description",
]);

const cleanVegaAriaAttributes = (container: HTMLDivElement) => {
  // Vega-Embed adds noisy attrs directly to the container element itself
  container.removeAttribute("aria-roledescription");
  if (container.getAttribute("aria-label") === "Vega visualization") {
    container.removeAttribute("aria-label");
  }
  const containerRole = container.getAttribute("role");
  if (containerRole && NOISE_ROLES.has(containerRole)) {
    container.removeAttribute("role");
  }
  // Also clean SVG internals
  container.querySelectorAll("[aria-roledescription], [role]").forEach((el) => {
    el.removeAttribute("aria-roledescription");
    if (el.getAttribute("aria-label") === "Vega visualization") {
      el.removeAttribute("aria-label");
    }
    const role = el.getAttribute("role");
    if (role && NOISE_ROLES.has(role)) el.removeAttribute("role");
  });
};

const ARIA_LABEL_TEXT =
  "Mappa enti per regione. Usa le frecce sinistra e destra per navigare i dati. Premi ESC per nascondere il tooltip.";

const findScenegraphItem = (items: any[], regionName: string): any => {
  if (!items) return null;

  for (const item of items) {
    if (item.datum && item.datum.regione === regionName) {
      if (item.bounds && !item.bounds.empty()) {
        return item;
      }
    }

    if (item.items) {
      const found = findScenegraphItem(item.items, regionName);
      if (found) return found;
    }
  }
  return null;
};

const EntiMapChart = ({ categorySignal }: Props) => {
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

  // Timer refs
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const processedData = useMemo(() => {
    if (!data?.metrics_by_geo_cat) return [];

    const filtered = data.metrics_by_geo_cat.filter(
      (d: DashboardData["metrics_by_geo_cat"][0]) =>
        d.category === categorySignal,
    );

    return filtered.sort(
      (
        a: DashboardData["metrics_by_geo_cat"][0],
        b: DashboardData["metrics_by_geo_cat"][0],
      ) => a.regione.localeCompare(b.regione),
    );
  }, [data, categorySignal]);

  // --- Tooltip management ---

  const closeTooltip = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = null;
    closeTimeoutRef.current = null;

    setTooltipState((prev) => ({ ...prev, isOpen: false }));
    setSelectedIndex(-1);
  }, []);

  // Closing logic with timer
  const handleMouseLeave = useCallback(() => {
    // 1. Stop any pending opening attempt
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // 2. If a closing timer is already active, DO NOT reset it.
    if (closeTimeoutRef.current) return;

    // 3. Start the closing timer (200ms)
    closeTimeoutRef.current = setTimeout(() => {
      setTooltipState((prev) => ({ ...prev, isOpen: false }));
      closeTimeoutRef.current = null;
    }, 200);
  }, []);

  // Ref to access handleMouseLeave inside the listener of Vega
  const handleMouseLeaveRef = useRef(handleMouseLeave);
  useEffect(() => {
    handleMouseLeaveRef.current = handleMouseLeave;
  }, [handleMouseLeave]);

  const handleMouseEnterTooltip = () => {
    // If entering the tooltip, cancel the closing
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // And cancel any pending opening of other regions
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  };

  // This function opens and closes the tooltip based on the item received from the mouse move event
  const handleMouseMove = useCallback(
    (event: MouseEvent, item: any) => {
      const datum = item && item.datum;

      // CASE 1: we are on a valid data
      if (datum && datum.regione) {
        // Cancel pending closing
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }

        // If already open on this datum, stop
        if (
          tooltipState.isOpen &&
          tooltipState.data?.regione === datum.regione
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
              regione: datum.regione,
              perc_enti: datum.perc_enti,
              count_enti: datum.count_enti,
              count_enti_ipa: datum.count_enti_ipa,
            },
          });
        }, 150);
      }
      // CASE 2: We are above the background (no valid data)
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

  useEffect(() => {
    if (!chartContent.current || !data) return;

    // Disable the native tooltip
    const geoBaseURL = process.env.NODE_ENV === "development"
      ? "/"
      : `${process.env.NEXT_PUBLIC_BASE_PATH ?? "/dashboard-io"}/`;
    const options = {
      ...chartConfig,
      tooltip: () => {},
      baseURL: geoBaseURL,
    };

    embed(chartContent.current, spec, options).then((chart) => {
      const sortedData = [...data.metrics_by_geo_cat].sort((a, b) =>
        a.regione.localeCompare(b.regione, "it"),
      );

      chart.view
        .insert("dashboardData", sortedData)
        .resize()
        .runAsync()
        .then(() => {
          if (chartContent.current)
            cleanVegaAriaAttributes(chartContent.current);
        });

      chartInstanceRef.current = chart;
      setChart(chart);

      // Global Mouse Move Listener
      chart.view.addEventListener("mousemove", (event: any, item: any) => {
        handleGlobalMouseMoveRef.current(event, item);
      });
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.finalize();
      }
    };
  }, [data]);

  useEffect(() => {
    if (chart === null) return;

    chart.view
      .signal("category", categorySignal)
      .resize()
      .runAsync()
      .then(() => {
        if (chartContent.current) cleanVegaAriaAttributes(chartContent.current);
      });

    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));

    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
    openTimeoutRef.current = null;
  }, [categorySignal, chart]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!chart || processedData.length === 0) return;

    let newIndex = selectedIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      newIndex =
        selectedIndex === -1
          ? 0
          : Math.min(processedData.length - 1, selectedIndex + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
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
      updateTooltip(newIndex);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('[role="tooltip"]')) return;

    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));
  };

  const updateTooltip = (index: number) => {
    if (!chart || index === -1) {
      setSrText("");
      closeTooltip();
      return;
    }

    const datum = processedData[index];
    if (!datum) return;
    const view = chart.view;

    const scenegraphItem = findScenegraphItem(
      (view.scenegraph() as any).root.items,
      datum.regione,
    );

    if (!scenegraphItem || !scenegraphItem.bounds) {
      return;
    }

    const bounds = scenegraphItem.bounds;

    const x = (bounds.x1 + bounds.x2) / 2;
    const y = (bounds.y1 + bounds.y2) / 2;

    const renderEl = chartContent.current?.querySelector("svg");
    if (!renderEl) return;

    const rect = renderEl.getBoundingClientRect();

    const padding = view.padding();
    const paddingLeft = typeof padding === "object" ? padding.left : padding;
    const paddingTop = typeof padding === "object" ? padding.top : padding;

    // Coordinate Client
    const clientX = rect.left + (paddingLeft || 0) + x;
    const clientY = rect.top + (paddingTop || 0) + y;

    // Formatter per Screen Reader
    const percentFormatter = new Intl.NumberFormat("it-IT", {
      style: "percent",
      maximumFractionDigits: 0,
    });

    const intFormatter = new Intl.NumberFormat("it-IT");

    const regionText = `Regione ${datum.regione}.`;
    const percentText = `Percentuale enti: ${percentFormatter.format(
      Number(datum.perc_enti),
    )}.`;
    const countText = `Numero enti: ${intFormatter.format(
      datum.count_enti,
    )} su ${intFormatter.format(datum.count_enti_ipa)}.`;

    setSrText(`${regionText} ${percentText} ${countText}`);

    setTooltipState({
      isOpen: true,
      x: clientX,
      y: clientY,
      data: {
        regione: datum.regione,
        perc_enti: Number(datum.perc_enti),
        count_enti: datum.count_enti,
        count_enti_ipa: datum.count_enti_ipa,
      },
    });
  };

  return (
    <Box
      sx={{
        height: { xs: "25rem", sm: "37rem" },
        width: "100%",
        pt: { xs: "1rem", sm: "2rem" },
        outline: "none",
        position: "relative",
        "&:focus": {
          boxShadow: `0 0 0 2px ${dashboardColors.get("blue-500")}`,
        },
      }}
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onMouseLeave={handleMouseLeave} // Handle exit from React box
      aria-label={ARIA_LABEL_TEXT}
    >
      <div style={{ height: "100%", width: "100%" }} ref={chartContent} />
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
          id="enti-tooltip"
          onMouseEnter={handleMouseEnterTooltip}
          onMouseLeave={handleMouseLeave}
          sx={{
            position: "fixed",
            top: tooltipState.y,
            left: tooltipState.x,
            transform: "translate(-50%, -115%)",
            zIndex: 1500,
            // Allineamento padding come in ServicesMapChart
            paddingLeft: "1rem",
            paddingRight: "0.5rem",
            paddingBottom: "0.6rem",
            paddingTop: "0.4rem",

            // --- DARK MODE & ARROW STYLE ---
            backgroundColor: dashboardColors.get("grey-850"),
            color: "#FFF",
            borderRadius: "8px",
            pointerEvents: "auto",
            overflow: "visible",

            // Arrow Down
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
            gap="1.5rem"
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                whiteSpace: "nowrap",
                lineHeight: 1.285,
                color: "#FFF",
              }}
            >
              {tooltipState.data.regione}
            </Typography>
            <IconButton
              size="small"
              onClick={closeTooltip}
              aria-label="Chiudi tooltip"
              sx={{
                color: "#FFF",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "0.875rem",
                lineHeight: 1.285,
                color: "#FFF",
              }}
            >
              {new Intl.NumberFormat("it-IT", {
                style: "percent",
                maximumFractionDigits: 0,
              }).format(Number(tooltipState.data.perc_enti))}
            </Typography>

            <Divider
              sx={{
                width: "100%",
                my: 0.5,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            />

            <Box display="flex" alignItems="baseline">
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#FFF",
                }}
              >
                {new Intl.NumberFormat("it-IT").format(
                  tooltipState.data.count_enti,
                )}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  color: "#FFF",
                  mx: 0.25,
                }}
              >
                /
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.85rem",
                  color: "#FFF",
                }}
              >
                {new Intl.NumberFormat("it-IT").format(
                  tooltipState.data.count_enti_ipa,
                )}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
export default EntiMapChart;
