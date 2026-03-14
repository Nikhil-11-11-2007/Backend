import "dotenv/config"
import readline from 'readline/promises'
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, HumanMessage, tool } from 'langchain'
import { sendEmail } from "./mail.service.js";
import * as z from "zod"
import { tavily } from "@tavily/core";


const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
})


// email sending tool
const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use this tool to send an email",
        schema: z.object({
            to: z.string().describe("The recipient's email address"),
            html: z.string().describe("The HTML content of the email"),
            subject: z.string().describe("The subject of the email")
        })
    }
)

// webSearching tool

const webSearchTool = tool(
    async ({ query }) => {
        try {

            const response = await tvly.search(query)

            return JSON.stringify(response.results)

        } catch (error) {

            console.log("Tavily ERROR:", error)

            return "Error while fetching web results"

        }
    },
    {
        name: "webSearch",
        description: "Search the internet for latest information",
        schema: z.object({
            query: z.string().describe("Search query for the internet")
        })
    }
)


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatMistralAI({
    model: "mistral-small-latest"
})

const agent = createAgent({
    model,
    tools: [emailTool, webSearchTool],
    systemPrompt: "You are an AI assistant. If the user asks for latest information or internet data you MUST use the webSearch tool."
})

const messages = []

while (true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ")

    messages.push(new HumanMessage(userInput))

    const response = await agent.invoke({
        messages
    })

    messages.push(response.messages[response.messages.length - 1])

    console.log(`\x1b[34m[AI]\x1b[0m ${response.messages[response.messages.length - 1].content}`)
}


rl.close()