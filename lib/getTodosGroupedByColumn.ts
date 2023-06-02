import { databases } from "@/appwrite"

export const getTodosGroupedByColumn = async () => {
    //get data from appwrite
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    ); 

    const todos = data.documents; 

    //aggregate data to fit a column
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

    //if columns doesn't have inprogress, todo, and done
    //add empty todos
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType, 
                todos: []
            })
        }
    }

    //sort by the column types 
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a, b) => (columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]))
        )
    )

    const board : Board = {
        columns : sortedColumns
    }

    return board; 

}