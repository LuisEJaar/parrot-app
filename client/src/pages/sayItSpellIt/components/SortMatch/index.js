
  import {
    closestCenter,
    DndContext,
    PointerSensor,
    TouchSensor,
    useSensor,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    useSensors
  } from "@dnd-kit/core";
  import {
    arrayMove,
    //rectSwappingStrategy,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates
  } from "@dnd-kit/sortable";
  import React, { useState, useEffect } from "react";
  import SortableItem from "./SortableItem";
  import { v4 as uuidv4 } from "uuid";
  import shuffle from "lodash/shuffle";
  import { useSelector} from "react-redux"

  const SortMatch = () => {
     
     const { saidWord } = useSelector(state => state.word)
//   console.log(saidWord)
  
  const [items, setItems] = useState([])
    // const copyWord = saidWord.concat()
    // console.log(copyWord)
    
  useEffect(() => {
      const words = []
      if (saidWord.length > 0) {
          for (let i = 0; i < saidWord.length; i++) {
              words.push({
                  id: uuidv4(),
                  letter: saidWord[i],
                  position: i
              })
          }
      }
   setItems(shuffle(words))
  }, [saidWord])
  
    //is rendering with default useState. How to have my data set before this page gets rendered though?
console.log(items)
    //const sensors = [useSensor(PointerSensor)];
    const [activeId, setActiveId] = useState();
    // const [activeId, setActiveId] = useState(null);
    // const sensors = useSensors(
    //   useSensor(PointerSensor),
    //   useSensor(KeyboardSensor, {
    //     coordinateGetter: sortableKeyboardCoordinates
    //   })
    // );
    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(TouchSensor, {
    //         // Press delay of 250ms, with tolerance of 5px of movement
    //         activationConstraint: {
    //           delay: 250,
    //           tolerance: 5,
    //         },
    //       }),
    //     useSensor(KeyboardSensor, {
    //       coordinateGetter: sortableKeyboardCoordinates
    //     })
    //   );
      
    const pointerSensor = useSensor(PointerSensor);
    const touchSensor = useSensor(TouchSensor);
    const keyboardSensor = useSensor(KeyboardSensor);
    
    const sensors = useSensors(
      pointerSensor,
      touchSensor,
      keyboardSensor,
    );
  
    const handleDragEnd = ({active, over}) => {
        if (active.id !== over.id) {
          setItems((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id)
            const newIndex = items.findIndex(item => item.id === over.id)
    
            return arrayMove(items, oldIndex, newIndex)
          })
        }
      }
    
  
      const containerStyle = {
        background: "#dadada",
        padding: 10,
        margin: 10,
      };
  
    return (
      <div
        style={containerStyle}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          //onDragEnd={handleDragEnd}
          // onDragStart={handleDragStart}
          // onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext strategy={horizontalListSortingStrategy} items={items.map((item) => item.id)}>
            {items.map((item) => (
                <SortableItem item={item.letter} key={item.id} id={item.id}  />
            ))}
          </SortableContext>
  
          {/* <DragOverlay>{activeId ? activeId : null}</DragOverlay> */}
        </DndContext>
      </div>
    );
  }

export default SortMatch