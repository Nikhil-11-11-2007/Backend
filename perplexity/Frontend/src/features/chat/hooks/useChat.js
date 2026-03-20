import { useDispatch } from "react-redux"
import { initializeSocketConnection } from "../service/chat.socket"
import { addMessages, addNewMessage, createNewChat, setChats, setCurrentChatId, setLoading, deleteChat } from "../chat.slice"
import { getChats, getMessages, sendMessage, deleteChat as deleteChatAPI } from "../service/chat.api"

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        try {
            const data = await sendMessage({ message, chatId })

            const { chat, aimessage } = data
            if (!chatId)
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title
                }))

            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: message,
                role: "user"
            }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aimessage.content,
                role: aimessage.role
            }))
            dispatch(setCurrentChatId(chat._id))
        } catch (error) {
            console.error("Error sending message:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.UpdatedAt
            }

            return acc

        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenchat(chatId, chats) {

        if (chats[chatId]?.messages.length === 0) {

            const data = await getMessages(chatId)

            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }

        dispatch(setCurrentChatId(chatId))
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChatAPI(chatId)
            dispatch(deleteChat({ chatId }))
        } catch (error) {
            console.error("Error deleting chat:", error)
        }
    }

    function handleNewChat() {
        dispatch(setCurrentChatId(null))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenchat,
        handleDeleteChat,
        handleNewChat
    }
}