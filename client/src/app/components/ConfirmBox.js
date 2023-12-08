import { Button } from "@mui/material";
import HeadlessTippy from "@tippyjs/react/headless";

function ConfirmBox({ children, header, visible, onCancel, onConfirm }) {
  return (
    <HeadlessTippy
      interactive
      visible={visible}
      appendTo={document.body}
      render={() => (
        <div className="p-4 border-2 border-slate-100 shadow-lg bg-white rounded-lg">
          <header className="font-semibold mb-5 text-slate-700">
            {header || "Bạn chắc chắn chứ?"}
          </header>
          <div className="flex items-center justify-center">
            <Button variant="outlined" color="error" onClick={onCancel}>
              Hủy
            </Button>
            <div className="ml-12">
              <Button variant="outlined" color="info" onClick={onConfirm}>
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </HeadlessTippy>
  );
}

export default ConfirmBox;
