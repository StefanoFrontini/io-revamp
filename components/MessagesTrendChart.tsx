import messagesTrendLineJson from "@/assets/data/messages-trend-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltipMonthYear } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { DashboardData } from "@/services/zodSchema";
import { dashboardColors } from "@/styles/colors";
import { formatNumber } from "@/shared/formatNumber";
import { visuallyHidden } from "@mui/utils";

type Props = {
  yearSignal: number;
  cumulativeSignal: boolean;
};

const spec = toVegaLiteSpec(messagesTrendLineJson);
const ARIA_LABEL_TEXT =
  "Grafico andamento messaggi. Usa le frecce sinistra e destra per navigare i dati. Premi ESC per nascondere il tooltip";

const MessagesTrendChart = ({ yearSignal, cumulativeSignal }: Props) => {
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
    if (!data?.messages) return [];

    const filtered = data.messages.filter((d: DashboardData["messages"][0]) => {
      const dYear = new Date(d.date).getFullYear();
      return dYear === yearSignal;
    });

    filtered.sort(
      (a: DashboardData["messages"][0], b: DashboardData["messages"][0]) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
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
  console.log(processedData);

  useEffect(() => {
    if (!chartContent.current || !data) return;

    const tooltipOptions = {
      formatTooltip: formatTooltipMonthYear(
        "month_name",
        "metric_value",
        "year_label"
      ),
    };

    const options = { ...chartConfig, tooltip: tooltipOptions };

    embed(chartContent.current, spec, options).then((res) => {
      res.view.insert("dashboardData", data.messages).resize().runAsync();

      chartInstanceRef.current = res;
      setChart(res);
    });
  }, [data, yearSignal]);

  useEffect(() => {
    if (!chart) return;
    chart.view.signal("year", yearSignal).resize().runAsync();
    setSelectedIndex(-1);
    (chart.view as any).tooltip().call(null, {}, null, null);
  }, [chart, yearSignal]);

  useEffect(() => {
    if (!chart) return;
    chart.view.signal("is_cumulative", cumulativeSignal).resize().runAsync();
    setSelectedIndex(-1);
  }, [chart, cumulativeSignal]);

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
      if (typeof handler === "function") {
        handler(null, {}, null, null);
      }
    }
  };

  const updateTooltip = async (index: number) => {
    if (!chart || index === -1) {
      const handler = (chart?.view as any).tooltip();
      if (typeof handler === "function") {
        handler(null, {}, null, null);
      }
      return;
    }

    const datum = processedData[index];
    const view = chart.view;

    const renderEl = chartContent.current?.querySelector("svg") as Element;

    if (!renderEl) {
      console.error("Elemento grafico svg non trovato");
      return;
    }

    const scaleX = view.scale("x");
    const scaleY = view.scale("y");

    const rect = renderEl.getBoundingClientRect();

    const padding = view.padding();
    const paddingLeft = typeof padding === "object" ? padding.left : padding;
    const paddingTop = typeof padding === "object" ? padding.top : padding;

    // X and Y coordinates relative to the drawing area
    const x = scaleX(datum.timestamp);
    const y = scaleY(datum.metric_value);

    // Absolute coordinates for the event (scroll page + svg position + Vega padding + point position)
    const pageX = window.scrollX + rect.left + (paddingLeft || 0) + x;
    const pageY = window.scrollY + rect.top + (paddingTop || 0) + y;

    const mockEvent = {
      pageX,
      pageY,
      clientX: rect.left + (paddingLeft || 0) + x,
      clientY: rect.top + (paddingTop || 0) + y,
    };

    const tooltipValue = {
      month_name: datum.month_name,
      year_label: datum.year_label,
      metric_value: formatNumber(datum.metric_value),
    };
    const monthText = `Mese: ${datum.month_name}.`;
    const yearText = `Anno: ${datum.year_label}.`;

    const countText = `Numero messaggi: ${new Intl.NumberFormat("it-IT").format(
      datum.metric_value
    )}.`;

    const fullDescription = `${monthText} ${yearText} ${countText}`;

    setSrText(fullDescription);

    const handler = (view as any).tooltip();
    if (typeof handler === "function") {
      handler(tooltipValue, mockEvent, null, tooltipValue);
    }
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
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

export default MessagesTrendChart;
