import { theme } from "@/shared/themeConfig";
import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useState } from "react";

// Diagnostic patch: intercept focus() calls to add preventScroll:true
// to verify if MUI FocusTrap scroll propagation in cross-origin iframes
// is the root cause of the scroll-to-top bug.
// if (typeof window !== "undefined") {
//   const originalFocus = HTMLElement.prototype.focus;
//   HTMLElement.prototype.focus = function (options?: FocusOptions) {
//     originalFocus.call(this, { ...options, preventScroll: true });
//   };
// }

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
