import {
  useState,
  memo,
  useRef,
  FC,
  ReactElement,
  JSXElementConstructor,
  useCallback,
} from "react";
import { Button, Input, Select, Space } from "antd";

import type { InputRef } from "antd";

export type SelectOptionType = {
  value: string;
  label: string;
};

export type SelectOptionsType = SelectOptionType[];

interface ASelectProps {
  defValue: string;
  handleChange: (selectValue: string) => void;
  options: SelectOptionsType;
  addRuleToRelations: (newValue: string) => void;
}

export const ASelect: FC<ASelectProps> = memo((props) => {
  const { defValue, handleChange, options, addRuleToRelations } = props;

  const [searchValue, setSearchValue] = useState<string>("");
  const [name, setName] = useState<string>("");

  const inputRef = useRef<InputRef>(null);

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    []
  );

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const addItem = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      e.preventDefault();
      addRuleToRelations(name);
      setName("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [addRuleToRelations, name]
  );

  const customDropdownRender = useCallback(
    (menu: ReactElement<string | JSXElementConstructor<string>>) => {
      const filteredOptions = options.filter((option: SelectOptionType) =>
        option.value.toLowerCase().includes(searchValue.toLowerCase())
      );

      if (!filteredOptions.length) {
        return (
          <Space style={{ display: "flex" }}>
            <Input
              placeholder="Новое поле"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" onClick={addItem}>
              +
            </Button>
          </Space>
        );
      }

      return menu;
    },
    [addItem, name, onNameChange, options, searchValue]
  );

  return (
    <Select
      style={{ width: "100%" }}
      showSearch
      value={defValue}
      placeholder="Выбрать"
      onChange={handleChange}
      onSearch={handleSearch}
      options={options}
      dropdownRender={customDropdownRender}
    />
  );
});
