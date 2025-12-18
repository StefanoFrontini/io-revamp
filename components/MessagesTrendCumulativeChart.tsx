import messageTrendCumulativeLine from "@/assets/data/messages-trend-cumulative-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltip } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { DashboardData } from "@/services/zodSchema";
import { formatNumber } from "@/shared/formatNumber";
import { dashboardColors } from "@/styles/colors";
import { visuallyHidden } from "@mui/utils";

const spec = toVegaLiteSpec(messageTrendCumulativeLine);
const ARIA_LABEL_TEXT =
  "Grafico cumulativo annuale. Usa le frecce sinistra e destra per navigare i dati. Premi ESC per nascondere il tooltip.";

const MessagesTrendCumulativeChart = () => {
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
    if (!data?.messages_cumulative) return [];

    const sorted = [...data.messages_cumulative].sort(
      (
        a: DashboardData["messages_cumulative"][0],
        b: DashboardData["messages_cumulative"][0]
      ) => {
        return Number(a.year) - Number(b.year);
      }
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

  useEffect(() => {
    if (!chartContent.current || !data) return;

    const tooltipOptions = {
      formatTooltip: formatTooltip("year_text", "count"),
    };

    const options = { ...chartConfig, tooltip: tooltipOptions };

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
        const view = chartInstanceRef.current.view;
        const handler = (view as any).tooltip();
        if (typeof handler === "function") handler(null, {}, null, null);
        chartInstanceRef.current?.finalize();
      }
    };
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

  const updateTooltip = (index: number) => {
    if (!chart || index === -1) {
      const handler = (chart?.view as any).tooltip();
      if (typeof handler === "function") handler(null, {}, null, null);
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

    let x = scaleX(datum.timestamp);
    if (x === undefined) {
      x = scaleX(datum.year);
    }

    const y = scaleY(datum.count);

    const pageX = window.scrollX + rect.left + (paddingLeft || 0) + x;
    const pageY = window.scrollY + rect.top + (paddingTop || 0) + y;

    const mockEvent = {
      pageX,
      pageY,
      clientX: rect.left + (paddingLeft || 0) + x,
      clientY: rect.top + (paddingTop || 0) + y,
    };

    const tooltipValue = {
      year_text: datum.year_text,
      count: formatNumber(datum.count),
    };
    const yearText = `Anno: ${datum.year_text}.`;

    const countText = `Numero messaggi: ${new Intl.NumberFormat("it-IT").format(
      datum.count
    )}.`;

    const fullDescription = `${yearText} ${countText}`;

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
export default MessagesTrendCumulativeChart;
