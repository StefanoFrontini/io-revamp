import mapJsonSpec from "@/assets/data/italy-regions-circles.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltip } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { DashboardData } from "@/services/zodSchema";
import { dashboardColors } from "@/styles/colors";
import { visuallyHidden } from "@mui/utils";

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

const spec = toVegaLiteSpec(mapJsonSpec);

const ServicesMapChart = ({ categorySignal }: Props) => {
  const { data } = useDashboardData();
  const [chart, setChart] = useState<Result | null>(null);
  const [srText, setSrText] = useState("");
  const chartContent = useRef<HTMLDivElement>(null);

  /*
  Tooltip keyboard navigation.
  The tooltips are generated through the vega-tooltip plugin https://github.com/vega/vega-tooltip which is already installed in vega-embed. This plugin does not have a keyboard navigation feature.
  The vega-tooltip plugin exposes a handler function that accept a mouse event and the tooltip data as arguments.
  The idea is to generate a mock mouse event after a key press and pass it to the handler function.
  */
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const chartInstanceRef = useRef<Result | null>(null);

  const processedData = useMemo(() => {
    if (!data?.metrics_by_geo_cat) return [];

    const filtered = data.metrics_by_geo_cat.filter(
      (d: DashboardData["metrics_by_geo_cat"][0]) =>
        d.category === categorySignal
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

  useEffect(() => {
    if (!chartContent.current || !data) return;
    const tooltipOptions = {
      formatTooltip: formatTooltip("regione", "count_serv"),
    };
    const options = {
      ...chartConfig,
      tooltip: tooltipOptions,
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
        const view = chartInstanceRef.current.view;
        const handler = (view as any).tooltip();
        if (typeof handler === "function") handler(null, {}, null, null);
        chartInstanceRef.current?.finalize();
      }
    };
  }, [data]);

  useEffect(() => {
    if (chart === null) return;
    chart.view.signal("category", categorySignal).runAsync();
    setSelectedIndex(-1);
    const handler = (chart.view as any).tooltip();
    if (typeof handler === "function") handler(null, {}, null, null);
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
      newIndex = -1;
    } else {
      return;
    }

    setSelectedIndex(newIndex);
    updateTooltip(newIndex);
  };

  const handleBlur = () => {
    setSelectedIndex(-1);
    if (chart) {
      const handler = (chart.view as any).tooltip();
      if (typeof handler === "function") handler(null, {}, null, null);
    }
  };

  const updateTooltip = async (index: number) => {
    if (!chart || index === -1) {
      const handler = (chart?.view as any).tooltip();
      if (typeof handler === "function") handler(null, {}, null, null);

      setSrText("");
      return;
    }

    const datum = processedData[index];
    const view = chart.view;

    // view.scenegraph().root.items contains all drawn elements
    // we need to find the circle corresponding to the region
    const scenegraphItem = findScenegraphItem(
      (view.scenegraph() as any).root.items,
      datum.regione
    );

    if (!scenegraphItem || !scenegraphItem.bounds) {
      return;
    }

    // bounds.x1 and bounds.y1 are the bounding box coordinates relative to the graph area
    const bounds = scenegraphItem.bounds;

    // Circle center
    const x = (bounds.x1 + bounds.x2) / 2;
    const y = (bounds.y1 + bounds.y2) / 2;

    const renderEl = chartContent.current?.querySelector("svg");
    if (!renderEl) return;

    const rect = renderEl.getBoundingClientRect();

    const padding = view.padding();
    const paddingLeft = typeof padding === "object" ? padding.left : padding;
    const paddingTop = typeof padding === "object" ? padding.top : padding;

    const pageX = window.scrollX + rect.left + (paddingLeft || 0) + x;
    const pageY = window.scrollY + rect.top + (paddingTop || 0) + y;

    const mockEvent = {
      pageX,
      pageY,
      clientX: rect.left + (paddingLeft || 0) + x,
      clientY: rect.top + (paddingTop || 0) + y,
    };

    const tooltipValue = {
      regione: datum.regione,
      count_serv: new Intl.NumberFormat("it-IT", {
        useGrouping: true,
      }).format(Number(datum.count_serv)),
    };

    const regionText = `Regione ${datum.regione}.`;

    const countText = `Numero servizi: ${new Intl.NumberFormat("it-IT", {
      useGrouping: true,
    }).format(Number(datum.count_serv))}.`;

    const fullDescription = `${regionText} ${countText}`;

    setSrText(fullDescription);

    const handler = (view as any).tooltip();
    if (typeof handler === "function") {
      handler(tooltipValue, mockEvent, null, tooltipValue);
    }
  };

  return (
    <Box
      sx={{
        height: { xs: "25rem", sm: "37rem" },
        width: "100%",
        pt: { xs: "1rem", sm: "2rem" },
        outline: "none",
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
    </Box>
  );
};
export default ServicesMapChart;
