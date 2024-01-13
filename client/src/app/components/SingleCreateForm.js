import { RefreshOutlined } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Fragment } from "react";

function SingleCreateForm({
  placeholder,
  error,
  open,
  handleClose,
  handleSubmit,
  inputValue,
  onInputChange,
  isBtnSpinning,
}) {
  return (
    <Fragment>
      {open && (
        <div className="p-2">
          <TextField
            fullWidth
            placeholder={placeholder}
            inputRef={(input) => input && input.focus()}
            error={error}
            value={inputValue}
            onChange={(e) => {
              onInputChange(e.target.value);
            }}
            onKeyDown={(e) => {
              e.key == "Enter" && handleSubmit();
            }}
          />
          <div className="mt-2 grid gap-3 grid-cols-2">
            <Button
              variant="outlined"
              style={{ minWidth: "115px" }}
              disabled={error}
              onClick={handleSubmit}
            >
              {isBtnSpinning ? (
                <RefreshOutlined className="text-sky-500 animate-spin" />
              ) : (
                "Tạo mới"
              )}
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Hủy
            </Button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default SingleCreateForm;
