import { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { classname } from "@/client/utils";

import * as styles from "./index.module.css";
import * as screenStyles from "@/client/screens/screens.module.css";
import Button from "@/client/components/button";
import { Card, gameAgent } from "@/client/utils/game";

export const Game: FunctionComponent = function () {

    const [opponents, setOpponents] = useState(gameAgent.opponents);
    const opponentElements: ReactElement[] = useMemo(function () {
        const elements = [];

        for (let i = -2; i < 2; i++) {
            const opponent = opponents[(gameAgent.seat! + i - 1 + 4) % 4];
            if (!opponent) continue;

            elements.push(
                <div key={i} className={classname(
                    styles.oppponent,
                    (i + 0.5) ** 2 == 0.25 ? styles.down : styles.up,
                    i / 2 < 0 ? styles.left : styles.right
                )}>
                    <div className={styles.name}>{opponent.name}</div>
                    <div className={styles.avatar}></div>
                    <Cards cards={opponent.hands} />
                </div>
            );
        }

        return elements;
    }, [opponents]);

    useEffect(() => {
        function handleOpponentChange(opponents: any) {
            setOpponents(opponents);
        };

        gameAgent.listen("opponents", handleOpponentChange);
        return () => gameAgent.unlisten("opponents", handleOpponentChange);
    }, []);

    return (
        <div className={screenStyles.frame}>
            <Link className={screenStyles.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            <div className={styles.dealer}>
            </div>
            <div className={styles.view}>
                <div className={styles.dealer}>
                    <Cards cards={gameAgent.dealer.hands} />
                    <div className={styles.name}>Dealer</div>
                </div>
                <div className={styles.opponents}>{opponentElements}</div>
                <div className={styles.player}>
                    <div className={styles.name}>{gameAgent.playerName}</div>
                    <Cards cards={gameAgent.hands} />
                </div>
            </div>
        </div>
    );
};

const Cards: FunctionComponent<{ cards: Card[] }> = function ({ cards }) {

    const cardElements = cards.map((card, i) => (
        <div key={i} className={styles.card}>
            <img src={`/cards/face.svg`} />
            <img src={`/cards/suit-${card.suit}.svg`} />
            <img src={`/cards/value-${card.value}.svg`} />
        </div>
    ));

    return (
        <div
            className={styles.cards}
            style={cards.length > 1 ? { "--children-count": cards.length } as any : undefined}
        >
            {cardElements}
        </div>
    );
};

export default Game;