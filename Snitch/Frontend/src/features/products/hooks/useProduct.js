import { useDispatch } from "react-redux"
import { createProduct, deleteProduct, getSellerProduct } from "../services/product.api"
import { deleteProductById, setSellerProducts } from "../state/product.slice"

export const useProduct = () => {

    const dispatch = useDispatch()

    async function handleCreateProduct(formData){
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct(){
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    async function handleDeleteProduct(id){
        const data = await deleteProduct(id)
        dispatch(deleteProductById(id))
        return data.product
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleDeleteProduct
    }
}