import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: []
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        deleteProductById: (state, action) => {
            state.sellerProducts = state.sellerProducts.filter((product) => product._id !== action.payload)
        }
    }
})

export const { setSellerProducts, deleteProductById } = productSlice.actions
export default productSlice.reducer