import messageTrendCumulativeLine from "@/assets/data/messages-trend-cumulative-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltip } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";

const spec = toVegaLiteSpec(messageTrendCumulativeLine);

const MessagesTrendCumulativeChart = () => {
  const { data } = useDashboardData();
  const [chart, setChart] = useState<Result | null>(null);
  const chartContent = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // 1. FIX: Creazione corretta dei dati per la navigazione
  const processedData = useMemo(() => {
    if (!data?.messages_cumulative) return [];

    // Ordiniamo per anno (convertendo la stringa in numero per sicurezza)
    const sorted = [...data.messages_cumulative].sort((a: any, b: any) => {
      return Number(a.year) - Number(b.year);
    });

    return sorted.map((d: any) => {
      // CORREZIONE NAN: Creiamo una data valida partendo dall'anno
      // new Date(anno, mese (0=Gen), giorno)
      const dateObj = new Date(Number(d.year), 0, 1);

      return {
        ...d,
        // Creiamo un timestamp valido per eventuali scale temporali
        timestamp: dateObj.getTime(),
        // Assicuriamoci che year_text esista per il tooltip (copiandolo da year)
        year_text: d.year,
        // Parsiamo count come numero per sicurezza
        count: Number(d.count),
      };
    });
  }, [data]);

  useEffect(() => {
    if (!chartContent.current || !data) return;

    const tooltipOptions = {
      // Qui definisci le chiavi che ti aspetti nel 'datum' passato al tooltip
      formatTooltip: formatTooltip("year_text", "count"),
      theme: "light",
    };

    const options = { ...chartConfig, tooltip: tooltipOptions };

    embed(chartContent.current, spec, options).then((res) => {
      res.view
        .insert("dashboardData", data.messages_cumulative)
        .resize()
        .runAsync();
      setChart(res);
    });

    return () => {
      if (chart) {
        const handler = (chart.view as any).tooltip();
        if (typeof handler === "function") handler(null, {}, null, null);
      }
    };
  }, [data]);

  // Gestione Eventi Tastiera (Invariata)
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
      if (typeof handler === "function") handler(null, {}, null, null);
      return;
    }

    const datum = processedData[index];
    const view = chart.view;

    const renderEl = chartContent.current?.querySelector(
      "canvas, svg"
    ) as Element;
    if (!renderEl) return;

    const scaleX = view.scale("x");
    const scaleY = view.scale("y");

    const rect = renderEl.getBoundingClientRect();
    const padding = await view.padding();
    const paddingLeft = typeof padding === "object" ? padding.left : padding;
    const paddingTop = typeof padding === "object" ? padding.top : padding;

    // FIX SCALA X:
    // Proviamo prima a passare il timestamp (se asse temporale).
    // Se scaleX restituisce undefined (perché asse ordinale/stringa), usiamo datum.year.
    let x = scaleX(datum.timestamp);
    if (x === undefined) {
      x = scaleX(datum.year); // Fallback per assi ordinali ("2023", "2024")
    }

    const y = scaleY(datum.count);

    // Coordinate pagina
    const pageX = window.scrollX + rect.left + (paddingLeft || 0) + x;
    const pageY = window.scrollY + rect.top + (paddingTop || 0) + y;

    const mockEvent = {
      pageX: pageX,
      pageY: pageY,
      clientX: rect.left + (paddingLeft || 0) + x,
      clientY: rect.top + (paddingTop || 0) + y,
    };

    // Usiamo year_text che abbiamo creato nel map sopra
    const tooltipValue = {
      year_text: datum.year_text,
      // Formatta il numero usando il locale italiano (es. 500.784.123)
      count: new Intl.NumberFormat("it-IT").format(datum.count),
    };

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
        "&:focus": { boxShadow: "0 0 0 2px #0B3EE3" },
      }}
      ref={chartContent}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      aria-label="Grafico cumulativo annuale"
    />
  );
};
export default MessagesTrendCumulativeChart;
