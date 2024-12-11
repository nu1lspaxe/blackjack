
interface ClassNameMap {
    [classname: string]: any;
}

export function classname(...items: (string | string[] | ClassNameMap | undefined | null)[]) {
    let classnameList = new Set<string>();
    for (const item of items) {
        if (item == null) {
            continue;
        } else if (item instanceof Array) {
            item.forEach(classname => classnameList.add(classname));
        } else if (typeof item === "object") {
            Object.entries(item).forEach(([classname, value]) => value && classnameList.add(classname));
        } else {
            classnameList.add(item);
        }
    }

    return Array.from(classnameList.values()).join(" ");
}