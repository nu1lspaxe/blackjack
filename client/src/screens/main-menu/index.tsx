import { FunctionComponent } from "react";

import Brand from "@screens/brand.svg?react";
import Button from "@components/button";

import Style from "./index.module.css";
import ScreensStyle from "@screens/screens.module.css";
import { useNavigate } from "react-router-dom";

export const MainMenu: FunctionComponent = function () {
    const navigate = useNavigate();

    return (
        <div className={ScreensStyle.frame}>
            <Brand className={ScreensStyle.brand} />
            <div className={Style["button-group"]}>
                <Button onClick={() => navigate('/match', { viewTransition: true })}>Random Match</Button>
                <Button>Join Room</Button>
            </div>
        </div>
    );
};

export default MainMenu;