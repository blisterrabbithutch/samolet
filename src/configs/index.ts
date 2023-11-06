export const TABLE_COLUMNS_NUMBER = 6;

export const EMPTY_STRING = "";

export type AllOptionItemType = {
  id: string;
  parentId: string | null;
};

export type AllOptionsType = AllOptionItemType[];

export const allOptions: AllOptionsType = [
  {
    id: "1.1",
    parentId: null,
  },
  {
    id: "1.2",
    parentId: null,
  },
  // убираем для отработки автоматического определения и добавления связи при нажатии кнопки добавить
  // {
  //   id: "2.1",
  //   parentId: "1.1",
  // },
  {
    id: "2.2",
    parentId: "1.2",
  },
  {
    id: "3.1",
    parentId: "2.1",
  },
  {
    id: "3.2",
    parentId: "2.2",
  },
  {
    id: "4.1",
    parentId: "3.1",
  },
  {
    id: "4.2",
    parentId: "3.2",
  },
  {
    id: "5.1",
    parentId: "4.1",
  },
  {
    id: "5.2",
    parentId: "4.2",
  },
];
