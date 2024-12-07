import { ChangeEvent, FunctionComponent, useState } from "react";

import Brand from "@/client/screens/brand.svg?react";
import Button from "@/client/components/button";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import { Link, useNavigate } from "react-router-dom";
import { gameAgent } from "@/client/utils/game";


export const RandomMatch: FunctionComponent = function () {
    
    const [playerName, setPlayerHand] = useState(gameAgent.playerName);
    const navigate = useNavigate();

    function handleJoinRoom() {
        gameAgent.startMatch()
            .then(seat => navigate(seat == 1 ? '/hosting' : '/waiting'))
            .catch((err) => console.error(err));
    }

    function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        gameAgent.playerName = event.target.value;
        setPlayerHand(gameAgent.playerName);
    }

    return (
        <div className={screenStyles.frame}>
            <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            <div className={styles.avatar}>
                <canvas width={200} height={200}></canvas>
                <button className={styles["change-button"]}></button>
            </div>
            <div className={styles.name}>
                <span /* className={styles.label} */>Display Name</span>
                <input className={styles.input} onInput={handleNameChange} value={playerName} />
            </div>
            <Button onClick={handleJoinRoom}>Start Matching</Button>
        </div>
    );
};

export default RandomMatch;