import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import Brand from "@screens/brand.svg?react";

import Style from "./index.module.css";
import ScreensStyle from "@screens/screens.module.css";
import { classname } from "@/utils";

export const MainMenu: FunctionComponent = function () {
    const navigate = useNavigate();
    
    return (
        <div className={classname(ScreensStyle.frame, ScreensStyle.clickable)} onClick={() => navigate('/menu', { viewTransition: true })}>
            <Brand className={ScreensStyle.brand} />
            <span className={Style.hint}>Tap to Start</span>
        </div>
    );
};

export default MainMenu;