import { ID, storage } from "@/appwrite"; 

const uploadImage =async (file:File) => {
    if (!file) return; 
    const fileUploaded = await storage.createFile(
        "647661afb8a939d4504e",
        ID.unique(), 
        file
    );
    return fileUploaded; 
}

export default uploadImage; 

