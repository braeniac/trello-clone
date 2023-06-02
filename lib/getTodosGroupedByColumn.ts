import { databases } from "@/appwrite"

export const getTodosGroupedByColumn = async () => {
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    ); 

    console.log(data); 


    const todos = data.documents; 

    const columns = todos.reduce((acculatorValue, todo) => {
        if (!acculatorValue.get(todo.status)) {
            acculatorValue.set(todo.status, {
                id: todo.status, 
                todos: []
            })
        }   

        acculatorValue.get(todo.status)!.todos.push({
            $id: todo.$id, 
            $createdAt: todo.$createdAt,
            title: todo.title, 
            status: todo.status,
            //only get image if it exists on the todo
            ...(todo.image && { image : JSON.parse(todo.image) })
        }); 

        return acculatorValue; 

    }, new Map<TypedColumn, Column>)

    const columnTypes : TypedColumn[] = ["todo", "inprogress", "done"]

    for () {
        
    }

}