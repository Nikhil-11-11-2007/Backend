import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: []
    },
    reducers: {
        setCart: (state, action) => {
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
            state.items = action.payload.items;
        },
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

export const { setCart, setItems, addItem, incrementCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;