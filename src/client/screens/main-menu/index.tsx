import { FunctionComponent } from "react";

import Brand from "@/client/screens/brand.svg?react";
import Button from "@/client/components/button";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import { useNavigate } from "react-router-dom";

export const MainMenu: FunctionComponent = function () {
    const navigate = useNavigate();

    return (
        <div className={screenStyles.frame}>
            <Brand className={screenStyles.brand} />
            <div className={styles["button-group"]}>
                <Button onClick={() => navigate('/match', { viewTransition: true })}>Random Match</Button>
                <Button onClick={() => navigate('/join', { viewTransition: true })}>Join Room</Button>
            </div>
        </div>
    );
};

export default MainMenu;