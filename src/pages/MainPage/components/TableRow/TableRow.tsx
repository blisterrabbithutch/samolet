import { FC, useCallback } from "react";
import {
  ASelect,
  SelectOptionsType,
} from "../../../../components/Select/ASelect";

import {
  TABLE_COLUMNS_NUMBER,
  AllOptionsType,
  EMPTY_STRING,
} from "../../../../configs";

import cls from "./TableRow.module.scss";
import { generateRelationRule } from "../../../../modules/helpers/generateRelationRule";
import { deleteColumnsAfterCurrentColumn } from "../../../../modules/helpers/deleteColumnsAfterCurrentColumn";
import { SelectedTableValuesType } from "../../ui/MainPage";
import { AllOptionItemType } from "../../../../configs";

export type RowDataType = Record<number, string>;

interface TableRowProps {
  tableData: AllOptionsType;
  setTableData: (selectedTableValues: AllOptionsType) => void;
  selectedTableValues: SelectedTableValuesType;
  rowIndex: number;
  setSelectedTableValues: (
    selectedTableValues: SelectedTableValuesType
  ) => void;
}

export const TableRow: FC<TableRowProps> = (props) => {
  const {
    rowIndex,
    setSelectedTableValues,
    selectedTableValues,
    tableData,
    setTableData,
  } = props;

  const handleAddRowValue = useCallback(
    (previousRowValue: string | null) => (newValue: string) => {
      const newRelationRule = generateRelationRule(previousRowValue, newValue);

      const updatedTableData = [...tableData, newRelationRule];
      setTableData(updatedTableData);
    },
    [setTableData, tableData]
  );

  const updateRowData = useCallback(
    (rowData: RowDataType, columnNumber: number, selectValue: string) => {
      let selectedRowData = rowData;
      if (selectValue === EMPTY_STRING) {
        delete selectedRowData[columnNumber];
      } else {
        selectedRowData = { ...selectedRowData, [columnNumber]: selectValue };
      }
      return selectedRowData;
    },
    []
  );

  const prepareStateForSelectedTableValues = useCallback(
    (selectValue: string, rowOrder: number, columnNumber: number) => {
      let baseRowData = { ...selectedTableValues[rowOrder] };

      baseRowData = deleteColumnsAfterCurrentColumn(
        baseRowData,
        columnNumber,
        TABLE_COLUMNS_NUMBER
      );

      baseRowData = updateRowData(baseRowData, columnNumber, selectValue);

      const updatedValues = {
        ...selectedTableValues,
      };

      if (Object.keys(baseRowData).length === 0) {
        delete updatedValues[rowOrder];
      } else {
        updatedValues[rowOrder] = { ...baseRowData };
      }

      return updatedValues;
    },
    [selectedTableValues, updateRowData]
  );

  const handleSelectChange = useCallback(
    (rowOrder: number, columnNumber: number) => (value: string) => {
      const selectValue = value;

      const newTableValuesState = prepareStateForSelectedTableValues(
        selectValue,
        rowOrder,
        columnNumber
      );

      setSelectedTableValues(newTableValuesState);
    },
    [prepareStateForSelectedTableValues, setSelectedTableValues]
  );

  const generateOptions = useCallback(
    (parentValue: string | null) => {
      const resultArr: SelectOptionsType = tableData.reduce(
        (acc: SelectOptionsType, tableItem: AllOptionItemType) => {
          if (tableItem.parentId === parentValue) {
            acc.push({ value: tableItem.id, label: tableItem.id });
          }
          return acc;
        },
        []
      );
      return resultArr;
    },
    [tableData]
  );

  const generateSelect = useCallback(
    (rowIndex: number, columnNumber: number, parentValue: string | null) => {
      const defaultValue = selectedTableValues?.[rowIndex]?.[columnNumber];

      return (
        <ASelect
          addRuleToRelations={handleAddRowValue(parentValue)}
          defValue={defaultValue}
          handleChange={handleSelectChange(rowIndex, columnNumber)}
          options={generateOptions(parentValue)}
        />
      );
    },
    [
      generateOptions,
      handleAddRowValue,
      handleSelectChange,
      selectedTableValues,
    ]
  );

  const tableRowGenerator = useCallback(
    (rowIndex: number): JSX.Element => {
      const rowTds = [];

      for (let i = 0; i < TABLE_COLUMNS_NUMBER; i++) {
        const columnNumber = i;

        if (columnNumber === 0) {
          rowTds.push(
            <td className={cls.td} key={columnNumber}>
              {rowIndex + columnNumber}
            </td>
          );
        } else if (columnNumber === 1) {
          const parentValue = null;
          rowTds.push(
            <td key={columnNumber} className={cls.td}>
              {generateSelect(rowIndex, columnNumber, parentValue)}
            </td>
          );
        } else {
          if (
            selectedTableValues.hasOwnProperty(rowIndex.toString()) &&
            selectedTableValues[rowIndex][columnNumber - 1]
          ) {
            const parentValue = selectedTableValues[rowIndex][columnNumber - 1];

            const handleSelect = generateSelect(
              rowIndex,
              columnNumber,
              parentValue
            );

            rowTds.push(
              <td key={columnNumber} className={cls.td}>
                {handleSelect}
              </td>
            );
          } else {
            rowTds.push(
              <td className={cls.td} key={columnNumber}>
                Заблокировано
              </td>
            );
          }
        }
      }

      return <>{rowTds}</>;
    },
    [generateSelect, selectedTableValues]
  );

  return tableRowGenerator(rowIndex);
};
