import cls from "./TableHeader.module.scss";

export const TableHeader = () => {
  return (
    <tr className={cls.th}>
      <th>ID</th>
      <th>Уровень 1</th>
      <th>Уровень 2</th>
      <th>Уровень 3</th>
      <th>Уровень 4</th>
      <th>Уровень 5</th>
    </tr>
  );
};
