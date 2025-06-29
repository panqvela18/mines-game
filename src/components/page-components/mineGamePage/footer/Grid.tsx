import React from "react";
import "@/styles/ui/grid.css";

const Grid = <T extends number | string>({
  items,
  maxCount,
  title,
  selectedItem,
  onItemClick,
  className,
}: GridProps<T>) => {
  const displayCount = maxCount ?? items.length;

  return (
    <>
      <h4 className="round-title">{title}</h4>
      <div className={className}>
        {items.slice(0, displayCount).map((item, idx) => (
          <button
            key={idx}
            onClick={() => onItemClick(item)}
            style={{
              backgroundColor: item === selectedItem ? "#555961" : "#393b3f",
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
};

export default Grid;
