import { FunctionComponent } from "react";

import Button from "@/client/components/button";
import { gameAgent } from "@/client/utils/game";

// import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import { Link } from "react-router-dom";


export const RoomWaiting: FunctionComponent = function () {

    return (
        <div className={screenStyles.frame}>
            <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            
        </div>
    );
};

export default RoomWaiting;