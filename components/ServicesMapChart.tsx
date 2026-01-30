import mapJsonSpec from "@/assets/data/italy-regions-circles.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { DashboardData } from "@/services/zodSchema";
import { dashboardColors } from "@/styles/colors";
import { visuallyHidden } from "@mui/utils";
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

const ARIA_LABEL_TEXT =
  "Mappa dei servizi per regione. Usa le frecce sinistra e destra per navigare i dati. Premi ESC per nascondere il tooltip.";

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

type Props = {
  categorySignal: string;
};

// Tipo per lo stato del Tooltip
type TooltipState = {
  isOpen: boolean;
  x: number;
  y: number;
  data: {
    regione: string;
    count_serv: number;
  } | null;
};

const spec = toVegaLiteSpec(mapJsonSpec);

const ServicesMapChart = ({ categorySignal }: Props) => {
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

  // --- MODIFICA: Ref per accedere allo stato fresco dentro la callback ---
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

  // --- Funzioni di Gestione Tooltip ---

  const closeTooltip = useCallback(() => {
    // Cancelliamo eventuali timer pendenti
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    setTooltipState((prev) => ({ ...prev, isOpen: false }));
    setSelectedIndex(-1);
  }, []);

  const handleMouseLeave = () => {
    // Se il mouse esce, cancelliamo eventuali aperture pendenti
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);

    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setTooltipState((prev) => ({ ...prev, isOpen: false }));
    }, 400); // 400ms di tolleranza per l'uscita
  };

  const handleMouseEnterTooltip = () => {
    // 1. Blocca la chiusura
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // 2. Blocca l'apertura di altre regioni (se stiamo passando sopra i vicini)
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  };

  // Handler per intercettare il tooltip di Vega (Mouse hover)
  const handleVegaTooltip = (
    handler: any,
    event: MouseEvent,
    item: any,
    value: any,
  ) => {
    // Usiamo item.datum per accedere ai dati grezzi
    const datum = item && item.datum;

    // --- MODIFICA: Leggiamo dal REF ---
    const currentTooltipState = tooltipStateRef.current;

    if (datum && datum.regione) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

      // Se siamo già sulla stessa regione, non facciamo nulla (evita flickering o reset timer)
      // Usiamo currentTooltipState invece di tooltipState
      if (
        currentTooltipState.isOpen &&
        currentTooltipState.data?.regione === datum.regione
      ) {
        return;
      }

      // Resettiamo timer precedenti di apertura
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);

      // Ritardiamo l'apertura (Debounce)
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

    embed(chartContent.current, spec, options).then((chart) => {
      chart.view
        .insert("dashboardData", data.metrics_by_geo_cat)
        .resize()
        .runAsync();

      chartInstanceRef.current = chart;
      setChart(chart);
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current?.finalize();
      }
    };
  }, [data]);

  useEffect(() => {
    if (chart === null) return;
    chart.view.signal("category", categorySignal).runAsync();

    setSelectedIndex(-1);
    setTooltipState((prev) => ({ ...prev, isOpen: false }));

    // Pulizia Timer al cambio categoria
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
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
    const view = chart.view;

    const scenegraphItem = findScenegraphItem(
      (view.scenegraph() as any).root.items,
      datum.regione,
    );

    if (!scenegraphItem || !scenegraphItem.bounds) {
      return;
    }

    const bounds = scenegraphItem.bounds;
    // Centro del cerchio
    const x = (bounds.x1 + bounds.x2) / 2;
    const y = (bounds.y1 + bounds.y2) / 2;

    const renderEl = chartContent.current?.querySelector("svg");
    if (!renderEl) return;

    const rect = renderEl.getBoundingClientRect();
    const padding = view.padding();
    const paddingLeft = typeof padding === "object" ? padding.left : padding;
    const paddingTop = typeof padding === "object" ? padding.top : padding;

    // Calcolo coordinate client per posizionamento React Tooltip
    const clientX = rect.left + (paddingLeft || 0) + x;
    const clientY = rect.top + (paddingTop || 0) + y;

    // Aggiornamento testo Screen Reader
    const regionText = `Regione ${datum.regione}.`;
    const countText = `Numero servizi: ${new Intl.NumberFormat("it-IT", {
      useGrouping: true,
    }).format(Number(datum.count_serv))}.`;
    setSrText(`${regionText} ${countText}`);

    // Aggiornamento stato Tooltip
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
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      aria-label={ARIA_LABEL_TEXT}
      role="application"
    >
      <div
        ref={chartContent}
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
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
            backgroundColor: "white",
            borderRadius: "6px",
            pointerEvents: "auto",
          }}
        >
          {/* Header con pulsante chiusura */}
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
                color: dashboardColors.get("grey-850"),
                whiteSpace: "nowrap",
              }}
            >
              {tooltipState.data.regione}
            </Typography>
            <IconButton
              size="small"
              onClick={closeTooltip}
              aria-label="Chiudi tooltip"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Contenuto Dati */}
          <Box>
            <Typography
              sx={{
                fontWeight: 400,
                color: dashboardColors.get("grey-850"),
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
