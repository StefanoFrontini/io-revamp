import mapJsonSpecEnti from "@/assets/data/italy-regions-circles-enti.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltipEntitiesMapChart } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { dashboardColors } from "@/styles/colors";
import { visuallyHidden } from "@mui/utils";
import { DashboardData } from "@/services/zodSchema";

type Props = {
  categorySignal: string;
};

const spec = toVegaLiteSpec(mapJsonSpecEnti);
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

  /*
  Tooltip keyboard navigation.
  The tooltips are generated through the vega-tooltip plugin https://github.com/vega/vega-tooltip which is already installed in vega-embed. This plugin does not have a keyboard navigation feature.
  The vega-tooltip plugin exposes a handler function that accept a mouse event and the tooltip data as arguments.
  The idea is to generate a mock mouse event after a key press and pass it to the handler function.
  */
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const processedData = useMemo(() => {
    if (!data?.metrics_by_geo_cat) return [];

    const filtered = data.metrics_by_geo_cat.filter(
      (d: DashboardData["metrics_by_geo_cat"][0]) =>
        d.category === categorySignal
    );

    return filtered.sort(
      (
        a: DashboardData["metrics_by_geo_cat"][0],
        b: DashboardData["metrics_by_geo_cat"][0]
      ) => a.regione.localeCompare(b.regione)
    );
  }, [data, categorySignal]);

  useEffect(() => {
    if (!chartContent.current || !data) return;

    const tooltipOptions = {
      formatTooltip: formatTooltipEntitiesMapChart(
        "regione",
        "perc_enti",
        "count_enti",
        "count_enti_ipa"
      ),
    };

    const options = { ...chartConfig, tooltip: tooltipOptions };

    embed(chartContent.current, spec, options).then((res) => {
      res.view
        .insert("dashboardData", data.metrics_by_geo_cat)
        .resize()
        .runAsync();
      chartInstanceRef.current = res;
      setChart(res);
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

    chart.view.signal("category", categorySignal).resize().runAsync();

    setSelectedIndex(-1);
    const handler = (chart.view as any).tooltip();
    if (typeof handler === "function") handler(null, {}, null, null);
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

  const updateTooltip = (index: number) => {
    if (!chart || index === -1) {
      const handler = (chart?.view as any).tooltip();
      if (typeof handler === "function") handler(null, {}, null, null);
      setSrText("");
      return;
    }

    const datum = processedData[index];
    const view = chart.view;

    const scenegraphItem = findScenegraphItem(
      (view.scenegraph() as any).root.items,
      datum.regione
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

    const pageX = window.scrollX + rect.left + (paddingLeft || 0) + x;
    const pageY = window.scrollY + rect.top + (paddingTop || 0) + y;

    const mockEvent = {
      pageX,
      pageY,
      clientX: rect.left + (paddingLeft || 0) + x,
      clientY: rect.top + (paddingTop || 0) + y,
    };

    const percentFormatter = new Intl.NumberFormat("it-IT", {
      style: "percent",
      maximumFractionDigits: 0,
    });

    const intFormatter = new Intl.NumberFormat("it-IT");

    const tooltipValue = {
      regione: datum.regione,
      perc_enti: percentFormatter.format(Number(datum.perc_enti)),
      count_enti: intFormatter.format(datum.count_enti),
      count_enti_ipa: intFormatter.format(datum.count_enti_ipa),
    };
    const regionText = `Regione ${datum.regione}.`;

    const percentText = `Percentuale enti: ${new Intl.NumberFormat("it-IT", {
      style: "percent",
      maximumFractionDigits: 0,
    }).format(Number(datum.perc_enti))}.`;

    const countText = `Numero enti: ${new Intl.NumberFormat("it-IT").format(
      datum.count_enti
    )} su ${new Intl.NumberFormat("it-IT").format(datum.count_enti_ipa)}.`;

    const fullDescription = `${regionText} ${percentText} ${countText}`;

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
    </Box>
  );
};
export default EntiMapChart;
