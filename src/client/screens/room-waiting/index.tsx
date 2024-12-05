import { ChangeEvent, FunctionComponent, PropsWithChildren, useEffect, useState } from "react";

import Button from "@/client/components/button";
import { gameAgent } from "@/client/utils/game";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import { Link } from "react-router-dom";
import { classname } from "@/client/utils";

const RoomDisplay: FunctionComponent<PropsWithChildren> = function (props) {
    const [playerName, setPlayerName] = useState(gameAgent.playerName);
    const [opponents, setOpponents] = useState(gameAgent.opponents);

    function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        const playerName = event.target.value;
        setPlayerName(playerName);
        // gameAgent.changeName(playerName)
    }

    useEffect(() => {
        function handleOpponentChange(opponents: string[]) {
            setOpponents(opponents);
        };

        gameAgent.listen("opponents", handleOpponentChange);
        return () => gameAgent.unlisten("opponents", handleOpponentChange);
    }, [opponents]);

    return (
        <div className={screenStyles.frame}>
            <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            <h1 className={styles.code}>Room Code: {gameAgent.roomCode}</h1>
            <div className={styles.players}>
                <div className={styles.oppenent}>
                    <div className={styles.name}>{gameAgent.opponents[0] ?? "--"}</div>
                    <div className={styles.view}></div>
                </div>
                <div className={styles.oppenent}>
                    <div className={styles.name}>{gameAgent.opponents[1] ?? "--"}</div>
                    <div className={styles.view}></div>
                </div>
                <div className={styles.player}>
                    <div className={styles.view}></div>
                </div>
                <div className={styles.oppenent}>
                    <div className={styles.view}></div>
                    <div className={styles.name}>{gameAgent.opponents[2] ?? "--"}</div>
                </div>
                <div className={styles.oppenent}>
                    <div className={styles.view}></div>
                    <div className={styles.name}>{gameAgent.opponents[3] ?? "--"}</div>
                </div>
            </div>
            <input className={styles.input} type="text" onInput={handleNameChange} value={playerName} />
            {props.children}
        </div>
    );
};

export const RoomWaiting: FunctionComponent = function () {

    const [readyState, setReadyState] = useState(false);

    function handleReady() {
        setReadyState(!readyState);
        // gameAgent.changeReadyState(readyState);
    }

    return (
        <RoomDisplay>
            <Button className={classname({ [styles.ready]: readyState })} onClick={handleReady}>Get Ready</Button>
        </RoomDisplay>
    );
};

export const RoomHosting: FunctionComponent = function () {

    return (
        <RoomDisplay>
            <div className={styles.buttons}>
                <Button>Start</Button>
                <Button>Settings</Button>
            </div>
        </RoomDisplay>
    );
};