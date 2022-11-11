import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Item(props) {
  const { letter, id } = props;

  const style = {
    width: "100%",
    height: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
  }; 

  return <div id={id} style={style}>{ letter }</div>;
}

export default function SortableItem(props) {
  const { color } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    //border: '2px solid black',
    opacity: isDragging ? 0.5 : 1,
    background: color ,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={props.id} letter={props.letter} />
    </div>
  );
}