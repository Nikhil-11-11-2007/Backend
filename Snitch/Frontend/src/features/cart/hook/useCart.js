import { useDispatch } from "react-redux";
import { addItem, createCartOrder, getCart, incrementCartItem } from "../service/cart.api";
import { setCart, incrementCartItemQuantity, setItems } from "../state/cart.slice";

export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddToCart({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setCart(data.cart))
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        await incrementCartItem({ productId, variantId })
        dispatch(incrementCartItemQuantity({ productId, variantId }))
    }

    async function handleCreateCartOrder() {
        const data = await createCartOrder()
        return data.order
    }

    return {
        handleAddToCart,
        handleGetCart,
        handleIncrementCartItem,
        handleCreateCartOrder
    }
}

