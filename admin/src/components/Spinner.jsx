import { CircularProgress, Box, Typography } from "@mui/material"

const Spinner = ({ size = 40, fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          zIndex: 9999,
        }}
      >
        <CircularProgress size={size} />
        {text && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {text}
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <CircularProgress size={size} />
      {text && (
        <Typography variant="body1" sx={{ ml: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  )
}

export default Spinner

