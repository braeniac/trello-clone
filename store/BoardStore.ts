import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'; 
import { ID, databases, storage } from '@/appwrite';
import uploadImage from '@/lib/uploadImage';

interface BoardState {
    board : Board;
    getBoard : () => void; 
    setBoardState : (board: Board) => void; 
    updateTodoInDb : (todo: todo, columnId: TypedColumn) => void; 

    searchString: string; 
    setSearchString: (searchString: string) => void;  

    deleteTask: (taskIndex: number, todoId: todo, id: TypedColumn) => void; 

    newTaskInput: string; 
    setNewTaskInput: (input:string) => void; 

    newTaskType: TypedColumn; 
    setNewTaskType: (type: TypedColumn) => void; 

    image: File | null; 
    setImage: (image: File | null) => void; 

    addTask : (todo: string, columnId: TypedColumn, image?: File | null) => void; 

}   


export const useBoardStore = create<BoardState>((set, get) => ({
  
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  
  getBoard : async () => { 
    const board = await getTodosGroupedByColumn(); 
    set({ board }); 
  },
  
  setBoardState : (board) => {
    set({ board }); 
  },

  image: null,
  setImage: (image: File | null) => set({ image }),
  
  newTaskType: "todo",
  setNewTaskType: (type) => set({ newTaskType: type }),
  
  newTaskInput: "",
  setNewTaskInput: (input) => {
     set({ newTaskInput : input })
  },

  addTask : async (todo, columnId, image) => {
    
    //upload image 
    let file : Image | undefined; 

    if (image) {
      const fileUploaded = await uploadImage(image); 
      if (fileUploaded) {
        file = {
          bucketId : fileUploaded.bucketId, 
          fileId : fileUploaded.$id
        }
      }
    }

    //create document in appwrite 
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!, 
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, 
      ID.unique(), 
      {
        title : todo, 
        status: columnId, 
        //include image if it exists 
        ...(file && { image : JSON.stringify(file) })
      }
    ); 

    set({ newTaskInput: "" }); 

    set((state) => {
      const newColumns = new Map(state.board.columns); 

      const newTodo: todo = {
        $id, 
        $createdAt: new Date().toISOString(), 
        title: todo, 
        status: columnId, 
        //include image if it exists 
        ...(file && { image : file })
      }

      const column = newColumns.get(columnId)

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        }); 
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return{ 
        board: {
          columns: newColumns
        }
      }

    });
  },

  updateTodoInDb : async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, 
      todo.$id, 
      {
        title: todo.title, 
        status: columnId
      }
    )
  },

  searchString:"", 
  
  setSearchString: (searchString) => set({ searchString }), 

  deleteTask: async (taskIndex, todo, id) => {
    //get snapshot of columns
    const newColumn = new Map(get().board.columns); 
    //get specific task from column via id.
    newColumn.get(id)?.todos.splice(taskIndex, 1); 
    set({ board : { columns : newColumn }})

    //if task has an image 
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId); 
    }

    //delete task from appwrite
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, 
      todo.$id, 
    )}
}))