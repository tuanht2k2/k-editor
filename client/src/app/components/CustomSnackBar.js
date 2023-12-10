import { Alert, Snackbar } from "@mui/material";

function CustomSnackBar({ content, severity, open, onCLose, placement }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onCLose}
      anchorOrigin={placement || { vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onCLose}
        severity={severity || "info"}
        sx={{ width: "100%" }}
      >
        {content}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackBar;
