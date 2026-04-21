import axios from "axios";

const createApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = ({productId, variantId}) => {
    const response = createApiInstance.post(`/add/${productId}/${variantId}`,{
        quantity: 1
    })
    return response
}