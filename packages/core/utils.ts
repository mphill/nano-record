import { Adapter } from "./adapter";



interface Loadable { // @todo not a fan of this.
    load: (key : string, adapter: Adapter) => Promise<void>;
}


const verifyKey = (str: string) => {
    return str.match(/^[a-z0-9-]+$/);
}

export {
    Loadable,
    verifyKey

}