import { FunctionComponent } from "react";
import { RouterProvider } from "react-router-dom";

import router from "./screens";

export const App: FunctionComponent = function () {
    return (
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
    );
}

export default App;