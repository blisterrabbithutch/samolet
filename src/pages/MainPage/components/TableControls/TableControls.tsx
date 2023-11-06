import { useState, memo, ChangeEvent, FC } from "react";
import { Button, NumberInput, NumberInputField } from "@chakra-ui/react";

import cls from "./TableControls.module.scss";
import { useCallback } from "react";
import { SelectedTableValuesType } from "../../ui/MainPage";

interface TableControlProps {
  selectedTableValues: SelectedTableValuesType;
  rowCount: number;
  setRowCount: (addedRows: number) => void;
}

export const TableControls: FC<TableControlProps> = memo((props) => {
  const { selectedTableValues, rowCount, setRowCount } = props;
  const [rowCountInput, setRowCountInput] = useState<string>("");

  const handleStateClick = useCallback(() => {
    console.log(selectedTableValues);
  }, [selectedTableValues]);

  const handleRowAddInput = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setRowCountInput(evt.target.value);
    },
    []
  );

  const handleRowAdd = useCallback(() => {
    setRowCount(rowCount + Number(rowCountInput));
    setRowCountInput("");
  }, [rowCount, rowCountInput, setRowCount]);

  return (
    <div className={cls.tableControls}>
      <NumberInput value={rowCountInput}>
        <NumberInputField
          onChange={handleRowAddInput}
          placeholder="Введите количество строк"
        />
      </NumberInput>
      <Button type="button" onClick={handleRowAdd}>
        Добавить строки
      </Button>
      <Button type="button" onClick={handleStateClick}>
        Стейт лог
      </Button>
    </div>
  );
});
