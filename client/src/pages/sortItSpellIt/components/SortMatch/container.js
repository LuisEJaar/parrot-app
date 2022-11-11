import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";

import SortableItem from "./sortable_item";

const containerStyle = {
  background: "#dadada",
  padding: 10,
  margin: 10,
  flex: 1
};

export default function Container(props) {
  const { id, items } = props;

  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <SortableContext
      id={id}
      items={items == [] ? [] : items?.map(item => item.id)}
      strategy={horizontalListSortingStrategy}
    >
      <div className="sortContainer lined thick" ref={setNodeRef} style={containerStyle}>
        {items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id}
            letter={item.letter}
            color={item.color}
          />
        ))}
      </div>
    </SortableContext>
  );
}
