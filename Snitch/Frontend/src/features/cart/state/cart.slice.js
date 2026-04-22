import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        // set first item in cart
        setItems: (state, action) => {
            state.items = action.payload;
        },
        // add item to cart
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        incrementCartItemQuantity: (state, action) => {
            const { productId, variantId } = action.payload

            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item;
                }
            })
        }
    }
})

export const { setItems, addItem, incrementCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;