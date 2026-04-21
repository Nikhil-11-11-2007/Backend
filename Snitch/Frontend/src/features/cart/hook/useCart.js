import { useDispatch } from "react-redux";
import { addItem } from "../service/cart.api";
import { addItem as addItemToCart } from "../state/cart.slice";

export const useCart = () => {
    
    const dispatch = useDispatch()

    async function handleAddToCart({productId, variantId}) {
        const response = await addItem({productId, variantId})
        return response.data
    }

    return {
        handleAddToCart
    }
}

