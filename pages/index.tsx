// import styles from "@/styles/Home.module.css";
// import { Box, Typography, useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import localFont from "next/font/local";
import downloadKpiSpec from "@/assets/data/download-kpi.vl.json";
import entiKpiSpec from "@/assets/data/enti-kpi.vl.json";
import messagesKpiSpec from "@/assets/data/messages-kpi.vl.json";
import messagesTrendJson from "@/assets/data/messages-trend.vl.json";
import servicesKpiSpec from "@/assets/data/services-kpi.vl.json";
import MessagesTrend from "@/components/MessagesTrend";
// import DownloadsMessagesTrend from "@/components/DownloadsMessagesTrend";
import Icons from "@/components/Icons";
import KpiCard from "@/components/KpiCard";
import KpiCardFormat from "@/components/KpiCardFormat";
import KpiValue from "@/components/KpiValue";
import SectionFirstColumnLayout from "@/components/SectionFirstColumnLayout";
import SectionLayout from "@/components/SectionLayout";
import SectionSecondColumnLayout from "@/components/SectionSecondColumnLayout";
import ServicesTrend from "@/components/ServicesTrend";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
// import { useState } from "react";
// import Image from "next/image";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
// <Head>
//   <title>Create Next App</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
// type Tabs = {
//   id: number | null;
//   label: string;
// };
// const curYear = new Date().getFullYear();
// const firstYear = curYear - 1;

// const numYear = curYear - firstYear + 1;
// const years = Array.from({ length: numYear }, (_, i) => curYear - i).map(
//   (y) => ({ id: y, label: String(y) })
// );

export default function Home() {
  // const [selYear, setSelYear] = useState<number | null>(null);

  // const tabs: Tabs[] = [{ id: null, label: "total" }, ...years];
  // const handleTabChange = (tab: number) => {
  //   if (tab === tabs[tab].id) {
  //     return;
  //   }
  //   setSelYear(tabs[tab].id);
  // };
  return (
    <>
      <SectionLayout title="Download dell’app">
        <SectionFirstColumnLayout>
          <KpiCard subLabel="Download complessivi dal 2020">
            <Icons.DownloadIcon />
            <KpiCardFormat>
              <KpiValue spec={toVegaLiteSpec(downloadKpiSpec)} />
            </KpiCardFormat>
          </KpiCard>
        </SectionFirstColumnLayout>
        {/* <SectionSecondColumnLayout>
          <DownloadsTrend
            spec={toVegaLiteSpec(downloadsTrend)}
            title="Andamento dei download"
            idChart="downloads-trend"
          />
        </SectionSecondColumnLayout> */}
        <SectionSecondColumnLayout>
          <MessagesTrend
            spec={toVegaLiteSpec(messagesTrendJson)}
            title="Andamento dei messaggi inviati"
            idChart="messages-trend"
          />
        </SectionSecondColumnLayout>
      </SectionLayout>
      <SectionLayout title="Servizi e enti attivi">
        <SectionFirstColumnLayout>
          <KpiCard subLabel="Servizi totali disponibili in app">
            <Icons.InitiavesIcon />
            <KpiCardFormat>
              <KpiValue spec={toVegaLiteSpec(servicesKpiSpec)} />
            </KpiCardFormat>
          </KpiCard>
          <KpiCard subLabel="Enti attivi">
            <Icons.EntityIcon />
            <KpiCardFormat>
              <KpiValue spec={toVegaLiteSpec(entiKpiSpec)} />
            </KpiCardFormat>
          </KpiCard>
        </SectionFirstColumnLayout>
        <SectionSecondColumnLayout>
          <ServicesTrend />
        </SectionSecondColumnLayout>
      </SectionLayout>
      <SectionLayout title="Messaggi">
        <SectionFirstColumnLayout>
          <KpiCard subLabel="Messaggi inviati dagli enti dal 2020">
            <Icons.MessageIcon />
            <KpiCardFormat>
              <KpiValue spec={toVegaLiteSpec(messagesKpiSpec)} />
            </KpiCardFormat>
          </KpiCard>
        </SectionFirstColumnLayout>
        {/* <SectionSecondColumnLayout>
          <MessagesTrend
            spec={toVegaLiteSpec(messagesTrendJson)}
            title="Andamento dei messaggi inviati"
            idChart="messages-trend"
          />
        </SectionSecondColumnLayout> */}
      </SectionLayout>

      {/* <Tabs tabs={tabs.map((tab) => tab.label)} onTabChange={handleTabChange} />
      <Box sx={{ overflowX: "hidden" }}>
        <SectionLayout
          title={t("sent_notifications.title", { ns: "numeri" })}
          description={t("sent_notifications.description", { ns: "numeri" })}
        >
          <Box mb={2}>
            <KpiNotifications selYear={selYear} />

            <NotificationsTrend selYear={selYear} />
          </Box>
        </SectionLayout>

        <SectionLayout
          title={t("authorities_and_types.title", { ns: "numeri" })}
          description={t("authorities_and_types.description", { ns: "numeri" })}
          background="grey"
        >
          <Box mb={2}>
            <KpiAuthoritiesServices />
            <TopServices />
          </Box>
        </SectionLayout>
      </Box> */}
    </>
  );
}
