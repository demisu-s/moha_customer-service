import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {router} from "./router/Router";
const App = () => {

    return (
        <>
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    );
};

export default App;
