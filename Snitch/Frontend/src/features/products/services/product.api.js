import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)
    return response.data
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller")
    return response.data
}

export async function deleteProduct(id) {
    const response = await productApiInstance.delete(`/${id}`)
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")
    return response.data
}

export async function getProductById(productId) {
    const response = await productApiInstance.get(`detail/${productId}`)
    return response.data
}

export async function addVariant(productId, payload) {
    const response = await productApiInstance.post(`/${productId}/variant`, payload)
    return response.data
}

export async function deleteVariant(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variant/${variantId}`)
    return response.data
}

export async function updateVariantStock(productId, variantId, stock) {
    const response = await productApiInstance.patch(`/${productId}/variant/${variantId}/stock`, { stock })
    return response.data
}