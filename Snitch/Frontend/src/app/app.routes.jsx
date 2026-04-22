import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import ViewProducts from "../features/products/pages/ViewProducts";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetail from "../features/products/pages/SellerProductDetail";
import Cart from "../features/cart/pages/Cart";
import AppLayout from "./AppLayout";

export const routes = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "*",
        element: <h1>404 Not Found</h1>
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/product/:productId",
                element: <ProductDetail />
            },
            {
                path: "/cart",
                element: <Protected>
                    <Cart />
                </Protected>
            },
            {
                path: "/seller",
                children: [
                    {
                        path: "/seller/create-product",
                        element: <Protected role="seller">
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "/seller/view-products",
                        element: <Protected role="seller">
                            <ViewProducts />
                        </Protected>
                    },
                    {
                        path: "/seller/product/:productId",
                        element: <Protected role="seller">
                            <SellerProductDetail />
                        </Protected>
                    }
                ]
            },
        ]
    }
])