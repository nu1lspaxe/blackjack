import { CSSProperties, FunctionComponent, MouseEvent, PropsWithChildren } from "react";

import { classname } from "@utils";

import Style from "./button.module.css";

interface ButtonProps extends PropsWithChildren {
    className?: string;
    style?: CSSProperties
    onClick?: (event: MouseEvent) => void;
}
export const Button: FunctionComponent<ButtonProps> = function (props) {
    return (
        <button 
            className={classname(Style.button, props.className)} 
            style={props.style}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

export default Button;