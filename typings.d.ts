interface Board {
    columns: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress" | "done"

interface Column {
    id: TypedColumn;
    todos: todo[]; 
}

interface todo {
    $id: string; 
    $createdAt: String; 
    title: string; 
    status: TypedColumn; 
    image?: Image
}

interface Image {
    bucketId: string; 
    fileId: string; 
}