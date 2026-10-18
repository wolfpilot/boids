import { Query } from "@datorama/akita"

// Types
import { Vector } from "../../types/geometry"
import { UiStoreState } from "./ui.types"

// Store
import { UiStore } from "./ui.store"

export class UiQuery extends Query<UiStoreState> {
  allState$ = this.select()
  pointerVector$ = this.select("pointerVector")
  isPointerPresent$ = this.select("isPointerPresent")

  constructor(protected store: UiStore) {
    super(store)
  }

  get allValues(): UiStoreState {
    return this.getValue()
  }

  get pointerVector(): Vector {
    return this.getValue().pointerVector
  }

  get isPointerPresent(): boolean {
    return this.getValue().isPointerPresent
  }
}
