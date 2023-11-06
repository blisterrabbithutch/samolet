import { useState } from "react";
import { TableVirtuoso } from "react-virtuoso";

import { TableControls } from "../components/TableControls/TableControls";
import { TableRow } from "../components/TableRow/TableRow";
import { TableHeader } from "../components/TableHeader/TableHeader";

import cls from "./MainPage.module.scss";
import { AllOptionsType, allOptions } from "../../../configs";

export type RowValueType = Record<number, string>;

export type SelectedTableValuesType = Record<number, RowValueType>;

const MainPage = () => {
  const [rowCount, setRowCount] = useState<number>(1);
  const [tableData, setTableData] = useState<AllOptionsType>(allOptions);
  const [selectedTableValues, setSelectedTableValues] =
    useState<SelectedTableValuesType>({});

  return (
    <div className={cls.pageWrapper}>
      <div className={cls.table}>
        <TableVirtuoso
          style={{ height: 400 }}
          className={cls.tableWidget}
          data={Array.from({ length: rowCount })}
          fixedHeaderContent={TableHeader}
          itemContent={(index) => (
            <TableRow
              tableData={tableData}
              setTableData={setTableData}
              rowIndex={index}
              setSelectedTableValues={setSelectedTableValues}
              selectedTableValues={selectedTableValues}
            />
          )}
        />
      </div>
      <TableControls
        selectedTableValues={selectedTableValues}
        rowCount={rowCount}
        setRowCount={setRowCount}
      />
    </div>
  );
};

export default MainPage;
