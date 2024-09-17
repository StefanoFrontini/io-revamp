/* eslint-disable @typescript-eslint/no-explicit-any */
import { expressionFunction, formatLocale, timeFormatLocale } from "vega";
import { EmbedOptions } from "vega-embed";

// BUG: https://github.com/vega/vega-embed/issues/473
// vega.expressionInterpreter = expressionInterpreter;

import itLocale from "../assets/data/it-IT-locale.json";
import itTimeLocale from "../assets/data/it-IT-time-locale.json";

import italiaTheme from "../assets/data/italia-theme.json";

import { cacheLoader } from "./vega-cache-loader";

// Add currency suffix
itLocale.currency = ["", "€"];

// Set default locale
formatLocale({ ...itLocale, nan: "–" });
timeFormatLocale(itTimeLocale);
// Add custom expressions
// REF: https://github.com/vega/vega/issues/3207

expressionFunction("entries", Object.entries);

const chartConfig: EmbedOptions = {
  actions: false,
  config: {
    ...italiaTheme,
    line: {
      ...italiaTheme.line,
    } as any,
    selection: {
      ...italiaTheme.selection,
    } as any,
    title: {
      ...italiaTheme.title,
      fontWeight: 600,
      anchor: "start",
    },
    header: {
      ...italiaTheme.header,
      title: null,
      labelOrient: "top",
      labelAnchor: "start",
      labelPadding: 5,
    },
    axis: {
      ...italiaTheme.axis,
      title: null,
      tickCount: 4,
    },
    axisX: {
      ...italiaTheme.axis,
      grid: undefined,
    },
    legend: {
      ...italiaTheme.legend,
      title: null,
      orient: "bottom",
      direction: "horizontal",
      layout: {
        bottom: { anchor: "middle" },
      } as any,
      // https://stackoverflow.com/questions/62420339/how-to-bottom-middle-align-a-legend-in-vega-lite
    } as any,
  },
  loader: cacheLoader,
  renderer: "svg",
  ast: true,
};

const pieRadius = 120;
const config = typeof chartConfig.config === "object" && {
  ...chartConfig.config,
};
const isLegendPresent = config && config.legend;
const legendProperties = isLegendPresent && { ...config.legend };
export const pieRightChartConfig: EmbedOptions = {
  ...chartConfig,
  width: pieRadius,
  height: pieRadius,
  config: {
    ...config,
    legend: {
      ...legendProperties,
      columns: 3,
      layout: { bottom: { anchor: "end" } }, // https://stackoverflow.com/questions/62420339/how-to-bottom-middle-align-a-legend-in-vega-lite
    } as any,
  },
};

export default chartConfig;
