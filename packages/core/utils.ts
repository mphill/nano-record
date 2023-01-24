import { Adapter } from "./adapter";



interface Loadable { // @todo not a fan of this.
    load: (key : string, adapter: Adapter) => Promise<void>;
}

export {
    Loadable

}