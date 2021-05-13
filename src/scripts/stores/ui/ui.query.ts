import { Query } from "@datorama/akita"

// Types
import { IVector } from "../../types/geometry"

// Store
import { IUiStoreState, UiStore } from "./ui.store"

export class UiQuery extends Query<IUiStoreState> {
  allState$ = this.select()
  pointerVector$ = this.select("pointerVector")

  constructor(protected store: UiStore) {
    super(store)
  }

  get allValues(): IUiStoreState {
    return this.getValue()
  }

  get pointerVector(): IVector {
    return this.getValue().pointerVector
  }
}
