import downloadKpiSpec from "@/assets/data/download-kpi.vl.json";
import downloadsTrendJson from "@/assets/data/downloads-trend.vl.json";
import entiKpiSpec from "@/assets/data/enti-kpi.vl.json";
import messagesKpiSpec from "@/assets/data/messages-kpi.vl.json";
import messagesTrendJson from "@/assets/data/messages-trend.vl.json";
import servicesKpiSpec from "@/assets/data/services-kpi.vl.json";
import DownloadsMessagesTrend from "@/components/DownloadsMessagesTrend";
import Icons from "@/components/Icons";
import KpiCard from "@/components/KpiCard";
import KpiCardFormat from "@/components/KpiCardFormat";
import KpiValue from "@/components/KpiValue";
import SectionFirstColumnLayout from "@/components/SectionFirstColumnLayout";
import SectionLayout from "@/components/SectionLayout";
import SectionSecondColumnLayout from "@/components/SectionSecondColumnLayout";
import ServicesMap from "@/components/ServicesMap";
import ServicesTaxonomy from "@/components/ServicesTaxonomy";
import ServicesTrend from "@/components/ServicesTrend";
import { toVegaLiteSpec } from "@/shared/toVegaLiteSpec";
export default function Home() {
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
        <SectionSecondColumnLayout>
          <DownloadsMessagesTrend
            spec={toVegaLiteSpec(downloadsTrendJson)}
            title="Andamento dei download"
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
          <ServicesTaxonomy />
          <ServicesMap />
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
        <SectionSecondColumnLayout>
          <DownloadsMessagesTrend
            title="Andamento dei messaggi inviati"
            spec={toVegaLiteSpec(messagesTrendJson)}
          />
        </SectionSecondColumnLayout>
      </SectionLayout>
      {/* <MapChart spec={toVegaLiteSpec(mapJsonSpec)} /> */}
    </>
  );
}
