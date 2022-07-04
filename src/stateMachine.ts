import { Emiter } from "./Emiter";
type StateTransferFunction = (...args: any[]) => void;
export class StateMechine<
  S extends string | number,
  A extends string | number,
  Topic extends string | number
> extends Emiter<Topic> {
  // S可以转化的状态
  private transferTable: Map<S, Map<A, [StateTransferFunction, S]>>;
  // initState
  constructor(private states: S) {
    super();
    this.transferTable = new Map();
  }
  private addTransfer(from: S, to: S, action: A, fn: StateTransferFunction) {
    if (!this.transferTable.has(from)) {
      this.transferTable.set(from, new Map());
    }
    this.transferTable.get(from)!.set(action, [fn, to]);
  }
  public register(from: S | S[], to: S, action: A, fn: StateTransferFunction) {
    if (Array.isArray(from)) {
      from.forEach((f) => {
        this.addTransfer(f, to, action, fn);
      });
    } else {
      this.addTransfer(from, to, action, fn);
    }
  }
  public dispatch(action: A, ...data: any[]) {
    const adjTable = this.transferTable.get(this.states);
    const transfer = adjTable?.get(action);
    if (!transfer) {
      return false;
    }
    const [fn, nextState] = transfer;
    fn(...data);
    this.states = nextState;
    while (this.dispatch("<auto>" as A, ...data));
    return true;
  }
}
