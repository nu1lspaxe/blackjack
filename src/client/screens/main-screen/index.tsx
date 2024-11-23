import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { classname } from "@/client/utils";
import Brand from "@/client/screens/brand.svg?react";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";

export const MainMenu: FunctionComponent = function () {
    const navigate = useNavigate();

    return (
        <div className={classname(screenStyles.frame, screenStyles.clickable)} onClick={() => navigate('/menu', { viewTransition: true })}>
            <Brand className={screenStyles.brand} style={{ margin: "auto" }} />
            <span className={styles.hint}>Tap to Start</span>
        </div>
    );
};

export default MainMenu;