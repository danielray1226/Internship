import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onSelectItem?: (heading: string, index: number, item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p> no items</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            key={item + "-" + index}
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            onClick={() => {
              setSelectedIndex(index);
              setSelectedIndex(index);
              onSelectItem(heading, index, item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
