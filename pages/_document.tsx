import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const env = process.env.NODE_ENV;
const src = env === "development" ? "" : "/dashboard-io";
// const src = env === "development" ? "" : "";

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <link rel="shortcut icon" href={`${src}/favicon.ico`} />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src={`${src}/iframe-resizer/child/index.umd.js`}
          type="text/javascript"
          id="iframe-resizer-child"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}
