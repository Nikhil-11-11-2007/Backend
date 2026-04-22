import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState:{
        items: []
    },
    reducers:{
        // set first item in cart
        setItems: (state, action) => {
            state.items = action.payload;
        },
        // add item to cart
        addItem: (state, action) => {
            state.items.push(action.payload);
        }
    }
})

const { setItems, addItem } = cartSlice.actions;

export { setItems, addItem };
export default cartSlice.reducer;