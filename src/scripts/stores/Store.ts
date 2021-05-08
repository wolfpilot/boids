// Utils
import { isObject } from "../utils/objectHelpers"

export class Store<TState> {
  public state: TState

  constructor(initialState: TState) {
    if (!isObject(initialState)) {
      throw new Error("The initial state must be an object.")
    }

    this.state = {
      ...initialState,
    }
  }

  public setState(state: Partial<TState>): void {
    this.state = {
      ...this.state,
      ...state,
    }
  }
}
