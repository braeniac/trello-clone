import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'; 
import { databases } from '@/appwrite';

interface BoardState {
    board : Board;
    getBoard : () => void; 
    setBoardState : (board: Board) => void; 
    updateTodoInDb : (todo: todo, columnId: TypedColumn) => void; 

    searchString: string; 
    setSearchString: (searchString: string) => void;  
}   


export const useBoardStore = create<BoardState>((set) => ({
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
  setSearchString: (searchString) => set({ searchString })

}))