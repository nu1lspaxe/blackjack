import { FunctionComponent } from "react";

import Brand from "@screens/brand.svg?react";
import Button from "@components/button";

import Style from "./index.module.css";
import ScreensStyle from "@screens/screens.module.css";

export const MainMenu: FunctionComponent = function () {
    return (
        <div className={ScreensStyle.frame}>
            <Brand className={ScreensStyle.brand}/>
            <div className={Style["button-group"]}>
                <Button>Random Match</Button>
                <Button>Join Room</Button>
            </div>
        </div>
    );
};

export default MainMenu;