import { useDispatch } from "react-redux";
import { addItem, getCart, incrementCartItem } from "../service/cart.api";
import { setCart, incrementCartItemQuantity, setItems } from "../state/cart.slice";

export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddToCart({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        console.log(data);
        
        dispatch(setCart(data.cart))
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        await incrementCartItem({ productId, variantId })
        dispatch(incrementCartItemQuantity({ productId, variantId }))
    }

    return {
        handleAddToCart,
        handleGetCart,
        handleIncrementCartItem
    }
}

