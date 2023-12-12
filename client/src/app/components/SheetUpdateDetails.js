import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2VlhiQlVPd0BBQmFJfFdmTWlcflR0fUU3HVdTRHRcQ19jTX5bc0dnUHpddnY="
);

import { useEffect, useRef } from "react";

import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";

import HeadlessTippy from "@tippyjs/react/headless";
import { ClearOutlined } from "@mui/icons-material";

function SheetUpdateDetails({ updates, open, onClose }) {
  const spreadsheetRef = useRef(null);

  useEffect(() => {
    if (!open || !updates) return;
    updates.forEach((jsonUpdate) => {
      const update = JSON.parse(jsonUpdate);
      spreadsheetRef.current?.updateAction(update);
    });
  }, [open]);

  return (
    <HeadlessTippy
      visible
      interactive={open}
      offset={[-30, 0]}
      appendTo={document.body}
      render={() => (
        <div
          className={`bg-slate-300/[.40] shadow-md border-2 border-slate-200 h-[calc(100vh-5px)] w-[calc(100vw-1px)] flex items-center justify-center ${
            open ? "" : "hidden"
          }`}
        >
          <div className="flex flex-col items-end">
            <button
              className={`flex items-center justify-center p-1 hover:bg-red-400 rounded-full duration-300 bg-red-500 mb-2 border-2 border-red-400`}
              title={"Đóng cửa sổ"}
              onClick={() => {
                onClose();
              }}
            >
              <ClearOutlined className="text-white" />
            </button>
            <div className="p-14 pt-6">
              <div className="border-2 border-sky-400">
                <SpreadsheetComponent
                  ref={spreadsheetRef}
                  width={"500px"}
                  height={"500px"}
                  showRibbon={false}
                  allowEditing={false}
                  allowInsert={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    ></HeadlessTippy>
  );
}

export default SheetUpdateDetails;
