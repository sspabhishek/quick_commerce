import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrder from "../pages/MyOrder";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrder />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "category",
                        element: <CategoryPage />
                    },
                    {
                        path: "subcategory",
                        element: <SubCategoryPage />
                    },
                    {
                        path: "upload-product",
                        element: <UploadProduct />
                    },
                    {
                        path: "product",
                        element: <ProductAdmin />
                    }
                ]
            }
        ]

    }
]);

export default router;