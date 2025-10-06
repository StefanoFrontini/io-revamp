import { Box, Divider, Stack } from "@mui/material";

const HDivider = () => {
  return (
    <Box flex={1} display={{ xs: "none", sm: "block" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        height={"100%"}
      >
        <Box flex={1}>
          <Divider sx={{ borderBottomWidth: "2px" }} />
        </Box>
      </Stack>
    </Box>
  );
};
export default HDivider;
