
interface Adapter<T> {
    name : string,
    read : () => Promise<T[]>,
    write : (data : T[]) => Promise<void>,
    destroy : () => Promise<void>,
    autoCommit : boolean
}

export default Adapter;