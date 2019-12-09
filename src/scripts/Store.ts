// Types
import { GenericObject } from "../types/main";

// Utils
import { isObject } from "./utils/objectHelpers";

export class Store {
  public state: {};

  constructor(initialState: GenericObject = {}) {
    if (!isObject(initialState)) {
      throw new Error("The initial state must be an object.");
    }

    this.state = {
      ...initialState,
    };
  }

  public setState<T>(state: T): void {
    this.state = {
      ...this.state,
      ...state,
    };
  }
}
