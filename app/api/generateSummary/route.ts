import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { todos } = await request.json();

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0.8,
            n: 1,
            stream: false,
            messages: [
                {
                    role: "system",
                    content: `When responding, welcome the user always as "Welcome to Trello Maninder!"
                    Limit the response to 200 characters`
                },
                {
                    role: 'user',
                    content: `Hi there, provide a summary of following todos. 
                    Count how many todos are in each category. 
                    Such as To do, in progress, and done, then tell the user to have a productive day! 
                    Here's the data: ${JSON.stringify(todos)}`
                }
            ]
        })

        const { data } = response;
        return NextResponse.json(data.choices[0].message)
        
    } catch (error) {
        
        console.log("error");
        // mimic response expected by calling function
        return NextResponse.json({ content: "Could not connect with ChatGPT" })
    }

}