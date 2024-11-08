import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { classname } from "@utils";
import Brand from "@screens/brand.svg?react";

import Style from "./index.module.css";
import ScreensStyle from "@screens/screens.module.css";

export const MainMenu: FunctionComponent = function () {
    const navigate = useNavigate();

    return (
        <div className={classname(ScreensStyle.frame, ScreensStyle.clickable)} onClick={() => navigate('/menu', { viewTransition: true })}>
            <Brand className={ScreensStyle.brand} style={{ margin: "auto" }} />
            <span className={Style.hint}>Tap to Start</span>
        </div>
    );
};

export default MainMenu;