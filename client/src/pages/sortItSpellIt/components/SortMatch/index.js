import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useSelector } from "react-redux"
import Container from "./container";
import { Item } from "./sortable_item";
import { v4 as uuidv4 } from "uuid"
import shuffle from "lodash/shuffle"
import Submission from "./Submission"

const wrapperStyle = {
  display: "flex",
  flexDirection: "column"
};

const defaultAnnouncements = {
  onDragStart(id) {
    console.log(`Picked up draggable item ${id}.`);
  },
  onDragOver(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(`Draggable item ${id} is no longer over a droppable area.`);
  },
  onDragEnd(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`Draggable item ${id} was dropped.`);
  },
  onDragCancel(id) {
    console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
  }
};

export default function SortMatch() {
  
  const { saidWord } = useSelector(state => state.word)
  const [activeId, setActiveId] = useState();
  const [items, setItems] = useState(null)
  const [initialItems, setInitialItems] = useState([])

  useEffect(() => {
    const words = []
    if (saidWord.length > 0) {
      for (let i = 0; i < saidWord.length; i++) {
        words.push({
          id: uuidv4(),
          letter: saidWord[i],
          isCorrect: null,
          color: null
        })
      }
    }

    const shuffledWord = shuffle(words)
    setItems({
      root: shuffledWord,
      container1: [],
    })
    setInitialItems({
      root: shuffledWord,
      container1: [],
    })
  }, [saidWord])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const onDragCancel = () => {
    setActiveId(null)
  }

  return (
    <>
      {items && 
      <div style={wrapperStyle}>
        <DndContext
          announcements={defaultAnnouncements}
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
        <Container id="root" items={items.root} />
            
        <div className="bottomContainer">
          <Container id="container1" items={items.container1} />
        </div>
          
        <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
        </DndContext>
          
        <Submission
          items={items.root}
          setItems={setItems}
          reset={onDragCancel}
          word={saidWord}
          initialItems={initialItems}
        />
      </div>
      }
    </>
  );

  function findContainer(id) {
    
    if (id in items) {
      return id;
    } 
    
    let target = Object.keys(items).find((key) => items[key].find((item) => item.id === id))
    return target;
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      console.log(prev[overContainer])
      console.log(activeItems)

      // Find the indexes for the items
      const activeIndex = activeItems.map(object => object.id).indexOf(active.id);
      const overIndex = overItems.map(object => object.id).indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        console.log("root stat")
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }
      console.log(newIndex)
      return {
        //removing from old
        ...prev, 
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id)
        ],
        //placing into new
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
 
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].map(object => object.id).indexOf(active.id);
    const overIndex = items[overContainer].map(object => object.id).indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
    }

    setActiveId(null);
  }
} 