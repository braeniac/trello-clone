import { Draggable, Droppable } from "react-beautiful-dnd"
import TodoCard from "./TodoCard"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { useBoardStore } from "@/store/BoardStore"
import { useModalStore } from "@/store/ModalStore"

type Props = {
    id: TypedColumn,
    todos: todo[],
    index: number
}

const idToColumnText : {
    [key in TypedColumn] : string
} = {
    "todo" : "To Do",
    "inprogress" : "In Progress", 
    "done" : "Done"
}

function Column({ id, todos, index} : Props) {

    const [searchString] = useBoardStore((state) => [
        state.searchString
    ]); 

    const openModal = useModalStore((state) => state.openModal); 

  return (
    <Draggable draggableId={id} index={index}>
        {
            (provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                > 
                    
                    <Droppable droppableId={index.toString()} type="card">
                        {
                            (provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`p-2 rounded-2xl mt-5 shadow-sm ${snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"}`}
                                >
                                    <h2 className="font-bold justify-between p-2 text-xl flex">
                                        {idToColumnText[id]}
                                        <span 
                                            className="text-gray-500 bg-gray-200 rounded-full font-normal text-xs px-2 py-1 items-center"
                                        >
                                            {!searchString ? todos.length : todos.filter(todo => todo.title.toLowerCase().includes(searchString.toLowerCase())).length}
                                        </span>    
                                    </h2>

                                    <div className="space-y-2">
                                        {
                                            todos.map((todo, index) => {

                                                //search 
                                                if (searchString && !todo.title.toLowerCase().includes(searchString.toLowerCase())) 
                                                    return null; 

                                                return (
                                                <Draggable
                                                    key={todo.$id}
                                                    draggableId={todo.$id}
                                                    index={index}
                                                >
                                                    {
                                                        (provided) => (
                                                            <TodoCard 
                                                                todo={todo}
                                                                index={index}
                                                                id={id}
                                                                innerRef={provided.innerRef}
                                                                draggableProps={provided.draggableProps}
                                                                dragHandleProps={provided.dragHandleProps}
                                                            />
                                                        )
                                                    }
                                                </Draggable>
                                            )})
                                        }

                                        {provided.placeholder}

                                        <div className="flex items-end justify-end">
                                            <button
                                                onClick={openModal}
                                            >
                                                <PlusCircleIcon 
                                                    className="h-10 w-10 text-green-500 hover:text-green-600"
                                                />
                                            </button>
                                        </div>  
                                    </div>
                                </div>
                            )
                        }
                    </Droppable>
                </div>
            )
        }
    </Draggable>
  )
}

export default Column