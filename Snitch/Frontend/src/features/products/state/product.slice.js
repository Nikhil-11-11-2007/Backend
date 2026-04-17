import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        allProducts: []
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        deleteProductById: (state, action) => {
            state.sellerProducts = state.sellerProducts.filter((product) => product._id !== action.payload)
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload
        }
    }
})

export const { setSellerProducts, deleteProductById, setAllProducts } = productSlice.actions
export default productSlice.reducer