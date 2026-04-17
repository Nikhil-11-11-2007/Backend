import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import ViewProducts from "../features/products/pages/ViewProducts";
import Protected from "../features/auth/components/Protected";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Hello world</h1>
    },
    {
        path: "*",
        element: <h1>404 Not Found</h1>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
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
            }
        ]
    }
])