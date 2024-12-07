import { FunctionComponent, useRef } from "react";

import Button from "@/client/components/button";
import { gameAgent } from "@/client/utils/game";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import { Link, useNavigate } from "react-router-dom";


export const RoomJoin: FunctionComponent = function () {

    const navigate = useNavigate();

    const roomCodeInput = useRef<HTMLInputElement>(null);

    function handleJoinRoom() {
        const value = roomCodeInput.current?.value;
        if (!value) return;
        
        gameAgent.joinRoom(value)
            .then(() => navigate('/waiting'))
            .catch((err) => console.error(err));
    }

    function handleCreateRoom() {
        gameAgent.newRoom()
            .then(() => navigate('/hosting'))
            .catch((err) => console.error(err));
    }

    return (
        <div className={screenStyles.frame}>
            <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            <h1 className={styles.title}>Join Room</h1>
            <div className={styles.block}>
                <h2 className={styles.label}>With Room Code</h2>
                <input className={styles.input} ref={roomCodeInput} type="text" placeholder="Room Code" />
                <Button onClick={handleJoinRoom}>Enter Room</Button>
            </div>
            <div className={styles.divider}>OR</div>
            <div className={styles.block}>
                <Button onClick={handleCreateRoom}>Create New Room</Button>
            </div>
        </div>
    );
};

export default RoomJoin;