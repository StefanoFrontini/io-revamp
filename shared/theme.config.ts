import { dashboardColors } from "@/styles/colors";
import { createTheme } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { theme as muiItaliaTheme } from "@pagopa/mui-italia";

/**
 * It is based on the `@pagopa/mui-italia` theme.
 * It overrides some of the default values.
 */
export const theme = createTheme(
  deepmerge(muiItaliaTheme, {
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
    },
  })
);
