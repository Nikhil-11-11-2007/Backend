import axios from "axios";

const createApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = async ({ productId, variantId }) => {
    const response = await createApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })
    return response.data
}

export const getCart = async () => {
    const response = await createApiInstance.get("/")
    return response.data
}

export const incrementCartItem = async ({ productId, variantId }) => {
    
    const response = await createApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}