import { DashboardData, dashboardSchema } from "@/services/zodSchema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const env = process.env.NODE_ENV;
// const src = env === "development" ? "" : "/dashboard-io";
const src = env === "development" ? "" : "";

export const DASHBOARD_QUERY_KEY = "dashboardData";
export const FALLBACK_QUERY_KEY = "fallbackDashboardData";

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch(`${src}/data/dashboard-io.json`);
  const data = await response.json();
  return dashboardSchema.parse(data);
};

const useDashboardData = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const query = useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: fetchDashboardData,
    retry: false,
    enabled: !isDisabled,
    refetchOnMount: true,
  });

  return {
    ...query,
    setIsDisabled,
  };
};

export { fetchDashboardData, useDashboardData };
