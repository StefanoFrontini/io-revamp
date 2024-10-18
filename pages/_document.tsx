import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="/iframe-resizer/child/index.umd.js"
          type="text/javascript"
          id="iframe-resizer-child"
          strategy="lazyOnload"
        />
      </body>
    </Html>
  );
}
