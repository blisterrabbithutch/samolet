import { RowDataType } from "../../pages/MainPage/components/TableRow/TableRow";

export const deleteColumnsAfterCurrentColumn = (
  rowData: RowDataType,
  columnNumber: number,
  totalColumns: number
) => {
  const updatedRowData = { ...rowData };
  for (let i = columnNumber; i <= totalColumns; i++) {
    if (i !== columnNumber) delete updatedRowData[i];
  }
  return updatedRowData;
};
