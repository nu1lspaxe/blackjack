declare module "*.svg?react" {
    import { FunctionComponent, SVGProps } from "react";
    const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export = classes;
}
