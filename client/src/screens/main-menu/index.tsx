import { FunctionComponent } from "react";

import Brand from "@screens/brand.svg?react";

// import Style from "./index.module.css";
import ScreensStyle from "@screens/screens.module.css";

export const MainMenu: FunctionComponent = function () {
    return (
        <div className={ScreensStyle.frame}>
            <Brand className={ScreensStyle.brand}/>
        </div>
    );
};

export default MainMenu;