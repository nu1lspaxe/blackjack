import { FunctionComponent } from "react";

import Brand from "@/client/screens/brand.svg?react";
import Button from "@/client/components/button";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import { Link } from "react-router-dom";


export const RandomMatch: FunctionComponent = function () {
    return (
        <div className={screenStyles.frame}>
            <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            <div className={styles.avatar}>
                <canvas width={200} height={200}></canvas>
                <button className={styles["change-button"]}></button>
            </div>
            <div className={styles.name}>
                <span className={styles.label}>Display Name</span>
                <input className={styles.input}></input>
            </div>
            <Button>Start Matching</Button>
        </div>
    );
};

export default RandomMatch;