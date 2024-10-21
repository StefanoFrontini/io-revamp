import { dashboardColors } from "@/styles/colors";
import { createTheme } from "@mui/material";
import localFont from "next/font/local";
// import { theme as muiItaliaTheme } from "@pagopa/mui-italia";
const titilliumWeb = localFont({
  src: [
    {
      path: "../assets/Font/TitilliumWeb-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/Font/TitilliumWeb-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/Font/TitilliumWeb-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/Font/TitilliumWeb-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/Font/TitilliumWeb-Light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
});
export const theme = createTheme({
  typography: {
    fontFamily: titilliumWeb.style.fontFamily,
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: dashboardColors.get("grey-850"),
          "&.Mui-selected": {
            color: dashboardColors.get("blue-500"),
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: "1.125rem",
          fontWeight: 600,
          lineHeight: 1.333333,
          color: dashboardColors.get("grey-850"),
          "& .MuiSvgIcon-root": {
            color: dashboardColors.get("blue-500"),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: dashboardColors.get("blue-500"),
          },
        },
      },
    },
  },
});

/**
 * It is based on the `@pagopa/mui-italia` theme.
 * It overrides some of the default values.
 */
// export const theme = createTheme(
//   deepmerge(muiItaliaTheme, {
//     // palette: { primary: { main: "#d1005e" } },
//     components: {
//       MuiMenuItem: {
//         styleOverrides: {
//           root: {
//             color: dashboardColors.get("grey-850"),
//             "&.Mui-selected": {
//               color: dashboardColors.get("blue-500"),
//             },
//           },
//         },
//       },
//       MuiSelect: {
//         styleOverrides: {
//           root: {
//             fontSize: "1.125rem",
//             fontWeight: 600,
//             lineHeight: 1.333333,
//             color: dashboardColors.get("grey-850"),
//             "& .MuiSvgIcon-root": {
//               color: dashboardColors.get("blue-500"),
//             },
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: dashboardColors.get("blue-500"),
//             },
//           },
//         },
//       },
//     },
//   })
// );
