import { dashboardColors } from "@/styles/colors";
type FormatTooltip = (
  value: Record<string, string>,
  sanitize: (x: string) => string
) => string;

export const formatTooltipEntitiesMapChart: (
  title: string,
  perc_enti: string,
  count_enti: string,
  count_enti_ipa: string
) => FormatTooltip =
  (title, text) =>
  (value, sanitize): string =>
    `
  <p>${sanitize(value[title] ?? "")}</p>
  <p>${sanitize(value[text] ?? "")}</p>
  <hr style="border-style: solid; border-color: ${dashboardColors.get(
    "grey-200"
  )};">
  <strong><span>${sanitize(
    value?.count_enti ?? ""
  )}</span></strong><span>/${sanitize(value?.count_enti_ipa ?? "")}</span>
  `;

export const formatTooltip: (title: string, text: string) => FormatTooltip =
  (title, text) => (value, sanitize) =>
    `
  <p>${sanitize(value[title] ?? "")}</p>
  <p>${sanitize(value[text] ?? "")}</p>
  `;
export const formatTooltipMonthYear: (
  title: string,
  text: string,
  year: string
) => FormatTooltip =
  (title, text, year) =>
  (value, sanitize): string =>
    `
      <p>${sanitize(value[title] ?? "")}&nbsp;${
      value[year] ? value[year] : ""
    }</p>
      <p>${sanitize(value[text] ?? "")}</p>
    `;
