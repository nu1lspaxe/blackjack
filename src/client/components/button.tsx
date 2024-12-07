import { CSSProperties, FunctionComponent, MouseEvent, PropsWithChildren } from "react";

import { classname } from "@/client/utils";

import * as styles from "./button.module.css";

interface ButtonProps extends PropsWithChildren {
    className?: string;
    styles?: CSSProperties
    onClick?: (event: MouseEvent) => void;
}
export const Button: FunctionComponent<ButtonProps> = function (props) {
    return (
        <button 
            className={classname(styles.button, props.className)} 
            style={props.styles}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

export default Button;