import { FunctionComponent } from "react";

import Button from "@components/button";

import Style from "./index.module.css";
import ScreensStyle from "@screens/screens.module.css";
import { Link } from "react-router-dom";

export const RandomMatch: FunctionComponent = function () {
    return (
        <div className={ScreensStyle.frame}>
            <Link className={ScreensStyle.back} to="/menu" viewTransition>〈 Back to Menu</Link>
            <div className={Style.avatar}>
                <canvas width={200} height={200}></canvas>
                <button className={Style["change-button"]}></button>
            </div>
            <div className={Style.name}>
                <span className={Style.label}>Display Name</span>
                <input className={Style.input}></input>
            </div>
            <Button>Start Matching</Button>
        </div>
    );
};

export default RandomMatch;