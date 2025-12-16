import messagesTrendLineJson from "@/assets/data/messages-trend-line.vl.json";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTooltipMonthYear } from "@/shared/formatTooltip";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import embed, { Result } from "vega-embed";
import chartConfig from "../shared/chartConfig";
import { DashboardData } from "@/services/zodSchema";

type Props = {
  yearSignal: number;
  cumulativeSignal: boolean;
};

// Mappatura mesi per replicare la logica Vega nel tooltip
const MONTH_NAMES = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

const spec = toVegaLiteSpec(messagesTrendLineJson);

const MessagesTrendChart = ({ yearSignal, cumulativeSignal }: Props) => {
  const { data } = useDashboardData();
  const [chart, setChart] = useState<Result | null>(null);
  const chartContent = useRef<HTMLDivElement>(null);

  // Stato per tracciare l'indice selezionato da tastiera (-1 = nessuno)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // 1. Replichiamo la trasformazione dei dati (Filtro -> Sort -> Cumulativo)
  // Questo ci serve per sapere "cosa" mostrare quando si premono le frecce
  const processedData = useMemo(() => {
    if (!data?.messages) return [];

    // Filtra per anno (assumendo che yearSignal sia l'anno specifico)
    // Nota: Adegua la logica se 'overall' è gestito diversamente in React
    const filtered = data.messages.filter((d: DashboardData["messages"][0]) => {
      const dYear = new Date(d.date).getFullYear();
      // Se yearSignal gestisce un valore speciale per "tutti gli anni", aggiungi la condizione qui
      return dYear === yearSignal;
    });

    // Ordina per data
    filtered.sort(
      (a: DashboardData["messages"][0], b: DashboardData["messages"][0]) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calcola cumulativo se necessario e prepara i campi per il tooltip
    let runningTotal = 0;
    return filtered.map((d: DashboardData["messages"][0]) => {
      const dateObj = new Date(d.date);
      runningTotal += d.count;

      const metric_value = cumulativeSignal ? runningTotal : d.count;

      return {
        ...d,
        // Campi calcolati necessari per il tooltip
        metric_value: metric_value,
        month_name: MONTH_NAMES[dateObj.getMonth()],
        year_label: dateObj.getFullYear(),
        timestamp: dateObj.getTime(), // utile per le scale
      };
    });
  }, [data, yearSignal, cumulativeSignal]);

  // Setup Grafico Vega
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
      setChart(res);
    });

    // Cleanup: nascondi tooltip quando il componente smonta
    // return () => {
    //   if (chart) (chart.view as any).tooltip().call(null, null, null, null);
    // };
  }, [data, yearSignal]);

  // Nota: Rimuovi yearSignal da qui se usi il signal sotto per evitare re-rendering completi
  // Aggiornamento segnali Vega
  useEffect(() => {
    if (!chart) return;
    chart.view.signal("year", yearSignal).resize().runAsync();
    // Reset indice selezione quando cambiano i filtri
    setSelectedIndex(-1);
    // Nascondi tooltip esistente
    (chart.view as any).tooltip().call(null, {}, null, null);
  }, [chart, yearSignal]);

  useEffect(() => {
    if (!chart) return;
    chart.view.signal("is_cumulative", cumulativeSignal).resize().runAsync();
    // Ricalcola dati processati e resetta selezione se cambia modalità
    setSelectedIndex(-1);
  }, [chart, cumulativeSignal]);

  // 2. Gestione eventi Tastiera
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!chart || processedData.length === 0) return;

    let newIndex = selectedIndex;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      // Se non c'è selezione, parte dal primo punto, altrimenti avanza
      newIndex =
        selectedIndex === -1
          ? 0
          : Math.min(processedData.length - 1, selectedIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      // Se non c'è selezione, parte dall'ultimo, altrimenti indietreggia
      newIndex =
        selectedIndex === -1
          ? processedData.length - 1
          : Math.max(0, selectedIndex - 1);
    } else if (e.key === "Escape") {
      // Chiudi tooltip su ESC
      newIndex = -1;
    } else {
      return; // Ignora altri tasti
    }

    setSelectedIndex(newIndex);
    updateTooltip(newIndex);
  };

  // Funzione per nascondere il tooltip quando si perde il focus (Tab out)
  const handleBlur = () => {
    setSelectedIndex(-1);
    if (chart) {
      // CAST A ANY anche qui
      const handler = (chart.view as any).tooltip();
      if (typeof handler === "function") {
        handler(null, {}, null, null);
      }
    }
  };

  // 3. Logica Core: Trigger Manuale del Tooltip
  const updateTooltip = async (index: number) => {
    // 1. Gestione chiusura tooltip
    if (!chart || index === -1) {
      const handler = (chart?.view as any).tooltip();
      if (typeof handler === "function") {
        handler(null, {}, null, null);
      }
      return;
    }

    const datum = processedData[index];
    const view = chart.view;

    // 2. Trova l'elemento di rendering (Canvas O SVG)
    // chartContent.current è il tuo div contenitore
    // vega-embed crea un wrapper interno, cerchiamo l'elemento grafico reale
    const renderEl = chartContent.current?.querySelector(
      "canvas, svg"
    ) as Element;

    if (!renderEl) {
      console.warn("Elemento grafico (canvas/svg) non trovato");
      return;
    }

    // 3. Calcolo Coordinate
    const scaleX = view.scale("x");
    const scaleY = view.scale("y");

    // Otteniamo la posizione assoluta dell'elemento grafico nella pagina
    const rect = renderEl.getBoundingClientRect();
    console.log({ rect });

    // Vega View ha spesso un padding (definito nel JSON o di default)
    // view.padding() restituisce {left, top, right, bottom}
    // Dobbiamo sommare questo padding perché le scale (0,0) partono DOPO il padding.
    const padding = view.padding();
    const paddingLeft = typeof padding === "object" ? padding.left : padding;
    const paddingTop = typeof padding === "object" ? padding.top : padding;

    // Coordinata X e Y relative all'area di disegno
    const x = scaleX(datum.timestamp);
    const y = scaleY(datum.metric_value);

    // Coordinate assolute per l'evento (Scroll pagina + Posizione Canvas + Padding Vega + Posizione Punto)
    const pageX = window.scrollX + rect.left + (paddingLeft || 0) + x;
    const pageY = window.scrollY + rect.top + (paddingTop || 0) + y;

    const mockEvent = {
      pageX: pageX,
      pageY: pageY,
      clientX: rect.left + (paddingLeft || 0) + x,
      clientY: rect.top + (paddingTop || 0) + y,
    };

    const tooltipValue = {
      month_name: datum.month_name,
      year_label: datum.year_label,
      metric_value: new Intl.NumberFormat("it-IT").format(datum.metric_value),
    };

    // 4. Invocazione Handler
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
        outline: "none", // Rimuovi outline di default se preferisci uno stile custom su :focus
        "&:focus": {
          // Esempio stile focus visibile per accessibilità
          boxShadow: "0 0 0 2px #0B3EE3",
        },
      }}
      ref={chartContent}
      // Rende il div focusable via Tab
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      aria-label="Grafico andamento messaggi. Usa le frecce sinistra e destra per navigare i dati."
    />
  );
};

export default MessagesTrendChart;
