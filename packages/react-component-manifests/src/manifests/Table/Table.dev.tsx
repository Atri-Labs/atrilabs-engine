import { forwardRef, useMemo } from "react";
import DataTable from "./Table";

const DevDataTable: typeof DataTable = forwardRef((props, ref) => {
  const rows = useMemo(() => {
    return [
      { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
      { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
      { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
      { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
      { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
      { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
      { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
      { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
      { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
      { id: 10, lastName: "Snow", firstName: "Jon", age: 35 },
      { id: 11, lastName: "Lannister", firstName: "Cersei", age: 42 },
      { id: 12, lastName: "Lannister", firstName: "Jaime", age: 45 },
      { id: 13, lastName: "Stark", firstName: "Arya", age: 16 },
      { id: 14, lastName: "Targaryen", firstName: "Daenerys", age: null },
      { id: 15, lastName: "Melisandre", firstName: null, age: 150 },
      { id: 16, lastName: "Clifford", firstName: "Ferrara", age: 44 },
      { id: 17, lastName: "Frances", firstName: "Rossini", age: 36 },
      { id: 18, lastName: "Roxie", firstName: "Harvey", age: 65 },
    ];
  }, []);
  const cols = [
    { field: "id", headerName: "ID" },
    { field: "firstName", headerName: "First name" },
    { field: "lastName", headerName: "Last name" },
    {
      field: "age",
      headerName: "Age",
      type: "number",
    },
  ];
  return (
    <DataTable {...props} ref={ref} custom={{ ...props.custom, rows, cols }} />
  );
});

export default DevDataTable;
