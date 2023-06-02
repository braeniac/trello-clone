import { Draggable } from "react-beautiful-dnd"

type Props = {
    id: TypedColumn,
    todos: todo[],
    index: number
}

function Column({ id, todos, index} : Props) {
  return (
    <Draggable>
        {(provided) => {
            <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
            >
                {/* render droppable todos in the column  */}
            </div>
        }}
    </Draggable>
  )
}

export default Column