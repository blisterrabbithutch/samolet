import { ChangeEvent, FC, memo, useCallback } from "react";
import { Button, Select } from "@chakra-ui/react";

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

export const TableRow: FC<TableRowProps> = memo((props) => {
  const {
    rowIndex,
    setSelectedTableValues,
    selectedTableValues,
    tableData,
    setTableData,
  } = props;

  const handleAddRowValue = useCallback(
    (previousRowValue: string) => () => {
      const newRelationRule = generateRelationRule(previousRowValue);

      const updatedTableData = [...tableData, newRelationRule];
      setTableData(updatedTableData);
    },
    [setTableData, tableData]
  );

  const generateButton = useCallback(
    (parentValue: string) => (
      <Button type="button" onClick={handleAddRowValue(parentValue)}>
        Добавить
      </Button>
    ),
    [handleAddRowValue]
  );

  const updateRowData = (
    rowData: RowDataType,
    columnNumber: number,
    selectValue: string
  ) => {
    let selectedRowData = rowData;
    if (selectValue === EMPTY_STRING) {
      delete selectedRowData[columnNumber];
    } else {
      selectedRowData = { ...selectedRowData, [columnNumber]: selectValue };
    }
    return selectedRowData;
  };

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
    [selectedTableValues]
  );

  const handleSelectChange = useCallback(
    (rowOrder: number, columnNumber: number) =>
      (evt: ChangeEvent<HTMLSelectElement>) => {
        const selectValue = evt.target.value;

        const newTableValuesState = prepareStateForSelectedTableValues(
          selectValue,
          rowOrder,
          columnNumber
        );

        setSelectedTableValues(newTableValuesState);
      },
    [prepareStateForSelectedTableValues, setSelectedTableValues]
  );

  const generateSelect = useCallback(
    (rowIndex: number, columnNumber: number, parentValue: string | null) => (
      <Select
        placeholder="Выбрать"
        onChange={handleSelectChange(rowIndex, columnNumber)}
      >
        {tableData
          .filter(
            (option: AllOptionItemType) => option.parentId === parentValue
          )
          .map((tableItem: AllOptionItemType) => (
            <option key={tableItem.id} value={tableItem.id}>
              {tableItem.id}
            </option>
          ))}
      </Select>
    ),
    [handleSelectChange, tableData]
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
            const filterOptions = tableData.filter(
              (option: AllOptionItemType) => option.parentId === parentValue
            );

            const handleSelect = generateSelect(
              rowIndex,
              columnNumber,
              parentValue
            );
            const handleButtonClick = generateButton(parentValue);

            rowTds.push(
              <td key={columnNumber} className={cls.td}>
                {filterOptions.length > 0 ? handleSelect : handleButtonClick}
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
    [generateButton, generateSelect, selectedTableValues, tableData]
  );

  return tableRowGenerator(rowIndex);
});
