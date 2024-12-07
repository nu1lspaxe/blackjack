import { FunctionComponent, ReactElement } from "react";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { classname } from "@/client/utils";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import Button from "@/client/components/button";
import { gameAgent } from "@/client/utils/game";

export const Game: FunctionComponent = function () {

    const opponents: ReactElement[] = [];

    for (let i = -2; i < 2; i++) {
        const opponent = gameAgent.opponents[(gameAgent.seat! + i - 1 + 4) % 4];
        if (!opponent) continue;

        opponents.push(
            <div key={i} className={classname(
                styles.oppponent,
                (i + 0.5) ** 2 == 0.25 ? styles.down : styles.up,
                i / 2 < 0 ? styles.left : styles.right
            )}>
                <div className={styles.name}>{opponent}</div>
                <div className={styles.avatar}></div>
                <div className={styles.hands}></div>
            </div>
        );
    }

    return (
        <div className={screenStyles.frame}>
            {/* <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link> */}
            <div className={styles.view}>
                <div className={styles.opponents}>{opponents}</div>
            </div>
            {/* <Button onClick={() => gameAgent.nextTurn()}>Next Turn</Button> */}
        </div>
    );
};

export default Game;