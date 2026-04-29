import mapJsonSpec from "@/assets/data/italy-regions-circles.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { DashboardData } from "@/services/zodSchema";
import { dashboardColors } from "@/styles/colors";
import CloseIcon from "@mui/icons-material/Close";

const REGIONS_COORDINATES = [
  { region: "Marche", longitude: 13.5765, latitude: 43.6167 },
  { region: "Liguria", longitude: 8.93, latitude: 44.4115 },
  { region: "Veneto", longitude: 11.8768, latitude: 45.4345 },
  { region: "Lombardia", longitude: 9.69, latitude: 45.4642 },
  { region: "Molise", longitude: 14.6667, latitude: 41.6667 },
  { region: "Lazio", longitude: 12.4964, latitude: 41.9028 },
  { region: "Piemonte", longitude: 7.6869, latitude: 45.0703 },
  {
    region: "Trentino-Alto Adige/Südtirol",
    longitude: 11.1217,
    latitude: 46.4993,
  },
  { region: "Sicilia", longitude: 13.3615, latitude: 38.1157 },
  { region: "Abruzzo", longitude: 13.6184, latitude: 42.3512 },
  { region: "Campania", longitude: 14.2681, latitude: 40.8518 },
  { region: "Calabria", longitude: 16.255, latitude: 39.3088 },
  { region: "Emilia-Romagna", longitude: 11.3426, latitude: 44.4949 },
  { region: "Toscana", longitude: 11.2558, latitude: 43.4696 },
  { region: "Basilicata", longitude: 15.805, latitude: 40.6395 },
  { region: "Sardegna", longitude: 9.1217, latitude: 40.2153 },
  { region: "Puglia", longitude: 16.8698, latitude: 41.1258 },
  { region: "Umbria", longitude: 12.3888, latitude: 43.1122 },
  {
    region: "Valle d'Aosta/Vallée d'Aoste",
    longitude: 7.4167,
    latitude: 45.7372,
  },
  { region: "Friuli-Venezia Giulia", longitude: 13.3768, latitude: 46.1495 },
];

const spec = toVegaLiteSpec(mapJsonSpec);

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
  "Mappa interattiva dei servizi per regione, ordinata alfabeticamente.";

// Helper to find the corresponding scenegraph item
const findScenegraphItem = (items: any[], regionName: string): any => {
  if (!items) return null;

  for (const item of items) {
    if (
      item.mark?.marktype === "symbol" &&
      item.datum?.regione === regionName
    ) {
      return item;
    }

    if (item.items) {
      const found = findScenegraphItem(item.items, regionName);
      if (found) return found;
    }
  }
  return null;
};

type TooltipState = {
  isOpen: boolean;
  x: number;
  y: number;
  data: {
    regione: string;
    count_serv: number;
  } | null;
};

type Props = {
  categorySignal: string;
};

const ServicesMapChart = ({ categorySignal }: Props) => {
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

    const merged = filtered
      .map((d: DashboardData["metrics_by_geo_cat"][0]) => {
        const coords = REGIONS_COORDINATES.find((r) => r.region === d.regione);
        return {
          ...d,
          longitude: coords?.longitude,
          latitude: coords?.latitude,
        };
      })
      .filter((d) => d.longitude && d.latitude);

    return merged.sort((a, b) => a.regione.localeCompare(b.regione));
  }, [data, categorySignal]);

  // ---  Tooltip management ---

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
    // This is crucial: if moving the mouse in void space, do not postpone closing.
    if (closeTimeoutRef.current) return;

    // 3. Start the closing timer (200ms)
    closeTimeoutRef.current = setTimeout(() => {
      setTooltipState((prev) => ({ ...prev, isOpen: false }));
      closeTimeoutRef.current = null;
    }, 200);
  }, []);

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

      // CASE 1: We are over valid data (Region)
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
              count_serv: datum.count_serv,
            },
          });
        }, 150);
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
        a.regione.localeCompare(b.regione, "it")
      );

      chart.view
        .insert("dashboardData", sortedData)
        .resize()
        .runAsync()
        .then(() => {
          if (chartContent.current) cleanVegaAriaAttributes(chartContent.current);
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
    chart.view.signal("category", categorySignal).runAsync().then(() => {
      if (chartContent.current) cleanVegaAriaAttributes(chartContent.current);
    });

    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));

    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
    openTimeoutRef.current = null;
  }, [chart, categorySignal]);

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

  const updateTooltip = async (index: number) => {
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

    const clientX = rect.left + (paddingLeft || 0) + x;
    const clientY = rect.top + (paddingTop || 0) + y;

    const regionText = `Regione ${datum.regione}.`;
    const countText = `Numero servizi: ${new Intl.NumberFormat("it-IT", {
      useGrouping: true,
    }).format(Number(datum.count_serv))}.`;
    setSrText(`${regionText} ${countText}`);

    setTooltipState({
      isOpen: true,
      x: clientX,
      y: clientY,
      data: {
        regione: datum.regione,
        count_serv: datum.count_serv,
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
      onMouseLeave={handleMouseLeave}
      aria-label={ARIA_LABEL_TEXT}
    >
      <div
        ref={chartContent}
        style={{ width: "100%", height: "100%" }}
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
          id="map-tooltip"
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
            paddingBottom: "0.6rem",
            paddingTop: "0.4rem",
            borderRadius: "6px",
            pointerEvents: "auto",
            backgroundColor: dashboardColors.get("grey-850"),
            color: "#FFF",

            // --- Arrow down styles ---
            "&::after": {
              content: '""',
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "8px", // Arrow dimensions
              // Creates a tringle pointing down using transparent borders
              borderColor: `${dashboardColors.get("grey-850")} transparent transparent transparent`,
            },
          }}
        >
          {/* Header with Close Button */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="1rem"
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                lineHeight: 1.285,
                whiteSpace: "nowrap",
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

          {/* Data Content */}
          <Box>
            <Typography
              sx={{
                fontWeight: 400,
                color: "#FFF",
                lineHeight: 1.285,
              }}
            >
              {new Intl.NumberFormat("it-IT", {
                useGrouping: true,
              }).format(Number(tooltipState.data.count_serv))}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
export default ServicesMapChart;
