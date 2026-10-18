import { Query } from "@datorama/akita"

// Types
import { Vector } from "../../types/geometry"

// Store
import { UiStoreState, UiStore } from "./ui.store"

export class UiQuery extends Query<UiStoreState> {
  allState$ = this.select()
  pointerVector$ = this.select("pointerVector")

  constructor(protected store: UiStore) {
    super(store)
  }

  get allValues(): UiStoreState {
    return this.getValue()
  }

  get pointerVector(): Vector {
    return this.getValue().pointerVector
  }
}
