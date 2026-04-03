import AlertDialog from "@/components/AlertDialog";
import AlertWrapper from "@/components/AlertWrapper";
import FormatIOIcon from "@/components/FormatIOIcon";
import FormatIORowCard from "@/components/FormatIORowCard";
import Icons from "@/components/Icons";
import IOCard from "@/components/IOCard";
import IOCardContent from "@/components/IOCardContent";
import IOCardTextContent from "@/components/IOCardTextContent";
import IORowCards from "@/components/IORowCards";
import KpiCard from "@/components/KpiCard";
import KpiCardFormat from "@/components/KpiCardFormat";
import Loading from "@/components/Loading";
import MessagesTrendLine from "@/components/MessagesTrendLine";
import PaymentsCard from "@/components/PaymentsCard";
import SectionFirstColumnLayout from "@/components/SectionFirstColumnLayout";
import SectionFullColumnLayout from "@/components/SectionFullColumnLayout";
import SectionLayout from "@/components/SectionLayout";
import SectionSecondColumnLayout from "@/components/SectionSecondColumnLayout";
import ServicesMap from "@/components/ServicesMap";
import {
  DASHBOARD_QUERY_KEY,
  FALLBACK_QUERY_KEY,
  useDashboardData,
} from "@/hooks/useDashboardData";
import fallbackData from "@/public/fallbackData/dashboard-io-fallback.json";
import { formatDate } from "@/shared/formatDate";
import { formatNumber, formatNumberWallet } from "@/shared/formatNumber";
import { dashboardColors } from "@/styles/colors";
import { Container, Stack, Typography } from "@mui/material";
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";

export async function getStaticProps() {
  const queryClient = new QueryClient();
  queryClient.setQueryData([FALLBACK_QUERY_KEY], fallbackData);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Home() {
  const queryClient = useQueryClient();
  const { data, error, setIsDisabled, isPending } = useDashboardData();

  const handleErrorClose = () => {
    const fallbackData = queryClient.getQueryData([FALLBACK_QUERY_KEY]);
    if (fallbackData) {
      queryClient.setQueryData([DASHBOARD_QUERY_KEY], fallbackData);
      queryClient.setQueryDefaults([DASHBOARD_QUERY_KEY], {
        staleTime: 60 * 1000,
      });
      setIsDisabled(true);
    }
  };
  if (isPending) return <Loading />;

  if (error)
    return <AlertDialog error={error.message} onClose={handleErrorClose} />;

  return (
    <>
      <Container
        component="header"
        sx={{ py: 6, maxWidth: 1340, backgroundColor: "white" }}
        maxWidth={false}
      >
        <Stack
          direction="row"
          justifyContent={{ xs: "center", md: "flex-end" }}
        >
          <AlertWrapper
            buttonText="Vai al sito"
            sx={{ flex: { md: "0 0 30%", lg: "0 0 25%" } }}
          >
            I dati sono disponibili su dati.gov.it
          </AlertWrapper>
        </Stack>
      </Container>

      <SectionLayout
        title="Utenti attivi in app"
        date={formatDate(data.last_run)}
        text="Il valore esposto deriva da una stima basata sulle informazioni disponibili."
      >
        <SectionFullColumnLayout>
          <IOCard>
            <IOCardContent>
              <FormatIOIcon>
                <Icons.UsersIcon />
              </FormatIOIcon>
              <IOCardTextContent text="Utenti attivi negli ultimi 12 mesi">
                <KpiCardFormat>
                  {formatNumberWallet(data.users_total)} Milioni
                </KpiCardFormat>
              </IOCardTextContent>
            </IOCardContent>
          </IOCard>
        </SectionFullColumnLayout>
      </SectionLayout>
      <SectionLayout
        title="Servizi e enti attivi"
        date={formatDate(data.last_run)}
      >
        <SectionFirstColumnLayout>
          <KpiCard text="Totale servizi disponibili in app">
            <Icons.InitiavesIcon />
            <KpiCardFormat>{formatNumber(data.services_total)}</KpiCardFormat>
          </KpiCard>
          <KpiCard text="Enti attivi">
            <Icons.EntityIcon />
            <KpiCardFormat>{formatNumber(data.entities_total)}</KpiCardFormat>
          </KpiCard>
        </SectionFirstColumnLayout>
        <SectionSecondColumnLayout>
          <ServicesMap />
        </SectionSecondColumnLayout>
      </SectionLayout>
      <SectionLayout title="Messaggi" date={formatDate(data.last_run)}>
        <SectionFirstColumnLayout>
          <KpiCard text="Messaggi inviati dagli enti dal 2020">
            <Icons.MessageIcon />
            <KpiCardFormat>{formatNumber(data.messages_total)}</KpiCardFormat>
          </KpiCard>
        </SectionFirstColumnLayout>
        <SectionSecondColumnLayout>
          <MessagesTrendLine title="Messaggi inviati" />
        </SectionSecondColumnLayout>
      </SectionLayout>
      <SectionLayout
        title="Documenti su IO"
        date={formatDate(data.last_run)}
        text="Fonte:IPZS"
      >
        <SectionFullColumnLayout>
          <IOCard>
            <IOCardContent>
              <FormatIOIcon>
                <Icons.WalletIcon />
              </FormatIOIcon>
              <IOCardTextContent
                text="Attivazioni di Documenti su IO*"
                alignNumber="center"
              >
                <KpiCardFormat>
                  {formatNumberWallet(data.wallet_pid_attivi)} Milioni
                </KpiCardFormat>
              </IOCardTextContent>
            </IOCardContent>
          </IOCard>
          <IOCard>
            <IOCardContent>
              <FormatIOIcon>
                <Icons.DigitalDocIcon />
              </FormatIOIcon>
              <IOCardTextContent
                text="Documenti digitali aggiunti dagli utenti*"
                alignNumber="center"
              >
                <KpiCardFormat>
                  {formatNumberWallet(data.wallet_total_attivi)} Milioni
                </KpiCardFormat>
              </IOCardTextContent>
            </IOCardContent>
          </IOCard>
          <IORowCards>
            <FormatIORowCard>
              <KpiCard text="Tessera sanitaria - Tessera europea di assicurazione malattia">
                <Icons.TesseraSanitariaIcon />
                <KpiCardFormat>
                  {formatNumberWallet(data.wallet_team_attivi)} Milioni
                </KpiCardFormat>
              </KpiCard>
            </FormatIORowCard>
            <FormatIORowCard>
              <KpiCard text="Patente di guida">
                <Icons.CarIcon />
                <KpiCardFormat>
                  {formatNumberWallet(data.wallet_mdl_attivi)} Milioni
                </KpiCardFormat>
              </KpiCard>
            </FormatIORowCard>
            <FormatIORowCard>
              <KpiCard text="Carta Europea della Disabilità">
                <Icons.EntityIcon />
                <KpiCardFormat>
                  {formatNumberWallet(data.wallet_edc_attivi)} Milioni
                </KpiCardFormat>
              </KpiCard>
            </FormatIORowCard>
          </IORowCards>
          <Typography
            sx={{
              color: dashboardColors.get("grey-650"),
              fontSize: "0.875rem",
              fontWeight: 600,
              lineHeight: 1.285715,
              pt: 2,
            }}
          >
            * Il dato somma gli utenti che hanno attivato Documenti su IO per la
            prima volta e gli utenti che hanno rinnovato dopo un anno un’utenza
            già attiva.
          </Typography>
        </SectionFullColumnLayout>
      </SectionLayout>
      <SectionLayout
        title="Metodi di pagamento"
        date={formatDate(data.last_run)}
      >
        <SectionFullColumnLayout>
          <PaymentsCard>
            <IOCardContent>
              <FormatIOIcon>
                <Icons.CreditCardIcon />
              </FormatIOIcon>
              <IOCardTextContent text="Numero di metodi di pagamento attivi aggiunti dagli utenti">
                <KpiCardFormat>
                  {formatNumber(data.payment_instruments)}
                </KpiCardFormat>
              </IOCardTextContent>
            </IOCardContent>
          </PaymentsCard>
        </SectionFullColumnLayout>
      </SectionLayout>
    </>
  );
}
