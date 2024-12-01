import { FunctionComponent } from "react";

import Button from "@/client/components/button";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import { Link } from "react-router-dom";


export const RoomJoin: FunctionComponent = function () {
    return (
        <div className={screenStyles.frame}>
            <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            <h1 className={styles.title}>Join Room</h1>
            <div className={styles.block}>
                <h2 className={styles.label}>With Room Code</h2>
                <input className={styles.input} type="text" placeholder="Room Code" />
                <Button>Enter Room</Button>
            </div>
            <div className={styles.divider}>OR</div>
            <div className={styles.block}>
                <Button>Create New Room</Button>
            </div>
        </div>
    );
};

export default RoomJoin;