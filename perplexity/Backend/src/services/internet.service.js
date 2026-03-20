import {tavily} from "@tavily/core"


const tvly = tavily({
    apiKey:process.env.TAVILY_API_KEY
})

export const searchInternet = async ({query}) => {

    const results = await tvly.search(query, {
        maxResults: 5,
    })

    console.log(JSON.stringify(results))

    return JSON.stringify(results)

}