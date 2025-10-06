import { z } from "zod";

const metricsByGeoCatSchema = z.object({
  regione: z.string(),
  category: z.enum(["Comuni", "Istruzione"]),
  count_enti: z.number(),
  count_serv: z.number(),
  count_enti_ipa: z.number(),
  perc_enti: z.string(),
});

const messagesSchema = z.object({
  date: z.string(),
  count: z.number(),
});

const messagesCumulativeSchema = z.object({
  year: z.string(),
  count: z.number(),
});

export const dashboardSchema = z.object({
  last_run: z.string(),
  users_total: z.number(),
  entities_total: z.number(),
  services_total: z.number(),
  metrics_by_geo_cat: z.array(metricsByGeoCatSchema),
  messages_total: z.number(),
  messages: z.array(messagesSchema),
  messages_cumulative: z.array(messagesCumulativeSchema),
  payment_instruments: z.number(),
  wallet_pid_attivi: z.number(),
  wallet_mdl_attivi: z.number(),
  wallet_edc_attivi: z.number(),
  wallet_team_attivi: z.number(),
  wallet_total_attivi: z.number(),
});

export type DashboardData = z.infer<typeof dashboardSchema>;
