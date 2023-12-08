import { useEffect, useRef } from "react";

import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";

function SheetUpdateDetails({ updateArgsObj }) {
  const spreadsheetRef = useRef(null);

  useEffect(() => {
    // spreadsheetRef.current?.updateAction(updateArgsObj);
  }, []);

  return (
    <div>
      <SpreadsheetComponent
        ref={spreadsheetRef}
        allowOpen={true}
        showRibbon={false}
        allowEditing={false}
      />
    </div>
  );
}

export default SheetUpdateDetails;
