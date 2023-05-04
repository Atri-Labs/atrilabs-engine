import React, { forwardRef } from "react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";

export const DataTable = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    custom: {
      rows: { [field: string]: string | number | null }[];
      cols: GridColDef[];
      checkboxSelection?: boolean;
      rowHeight?: number;
      numRows?: number;
      autoHeight?: boolean;
      selection?: GridRowId[];
    };
    onSelectionChange?: (selection: GridRowId[]) => void;
    id?: string;
  }
>((props, ref) => {
  return (
    <div
      className={props.attrs?.class}
      ref={ref}
      style={props.styles}
      id={props.id}
    >
      <DataGrid
        autoHeight={props.custom.autoHeight}
        rowHeight={props.custom.rowHeight || 20}
        rows={props.custom.rows}
        columns={props.custom.cols}
        pageSize={props.custom.numRows || 10}
        rowsPerPageOptions={[props.custom.numRows || 10]}
        checkboxSelection={props.custom.checkboxSelection}
        onSelectionModelChange={(model, _details) => {
          props.onSelectionChange?.(model);
        }}
        selectionModel={props.custom.selection || []}
      />
    </div>
  );
});

export default DataTable;
