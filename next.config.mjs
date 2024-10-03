const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pagopa/mui-italia"],
  distDir: isProd ? "dist" : undefined,
  output: "export",
  assetPrefix: isProd ? "/assets/js/dashboard-new/" : undefined,
  generateBuildId: () => "fixed-build-id",
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, "canvas", "jQuery"];
    config.optimization.splitChunks = false;
    config.plugins.forEach((p) => {
      // REF: To override plugins config: https://stackoverflow.com/a/59045822

      // Remove style hash
      if (p.constructor.name === "NextMiniCssExtractPlugin") {
        // HACK: cannot find the real instance
        p.options.filename = "static/css/[name].css";
        p.options.chunkFilename = "static/css/[name].css";
      }

      // Remove polyfills hash
      if (
        p.constructor.name === "CopyFilePlugin" &&
        p.name === "static/chunks/polyfills-[hash].js"
      ) {
        p.name = "static/chunks/polyfills.js";
      }
    });

    // Remove javascript chunks hash
    if (config.output.filename === "static/chunks/[name]-[contenthash].js") {
      (config.output.filename = "static/chunks/[name].js"),
        (config.output.chunkFilename = "static/chunks/[name].js");
    }

    return config;
  },
};

export default nextConfig;
