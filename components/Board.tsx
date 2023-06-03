"use client"
import { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { useBoardStore } from '@/store/BoardStore';
import Column from '@/components/Column'; 


function Board() {
  
  const [
    board, 
    getBoard, 
    setBoardState
  ] = useBoardStore((state) => [
    state.board, 
    state.getBoard,
    state.setBoardState
  ])

  useEffect(() => {
    getBoard(); 
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    
    const { destination, type, source } = result; 
    
    //drags card outside the board 
    if (!destination) return; 

    //column drag 
    if (type === "column") {
      const entries = Array.from(board.columns.entries()); 
      const [removed] = entries.splice(source.index, 1); 
      entries.splice(destination.index, 0, removed)
      const rearrangedColumns = new Map(entries); 
      setBoardState({
        ...board, columns : rearrangedColumns
      });
    }

    //drag a todo 
    const columns = Array.from(board.columns); 
    const startColIndex = columns[Number(source.droppableId)]; 
    const finishColIndex = columns[Number(destination.droppableId)]; 
    
    const startCol : Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos
    }

    const endCol : Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos
    }

    //if we didn't get the start column/finish column we just return 
    if (!startCol || !endCol) return; 

    //drag and drop in the same location 
    if ((source.index === destination.index) && (startCol === endCol)) return; 

      

  }

  return (
    
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type="column">
      {
        (provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column 
                  id={id}
                  key={id}
                  todos={column.todos}
                  index={index}
                />
              ))
            }
          </div>
        )
      }

      </Droppable>
    </DragDropContext>
  )
}

export default Board