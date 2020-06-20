import v8 from 'v8'

type StoreType = { [key: string]: any }

class Store {
  store: StoreType

  initialValue: { [key: string]: any }

  constructor(initialValue: StoreType) {
    this.store = initialValue
    this.initialValue = v8.deserialize(v8.serialize(initialValue))
  }

  get(): StoreType {
    return this.store
  }

  set(value: StoreType, setInitialValue: boolean): void {
    this.store = value
    if (setInitialValue) this.initialValue = v8.deserialize(v8.serialize(value))
  }

  reset(): void {
    this.store = v8.deserialize(v8.serialize(this.initialValue))
  }
}

export default Store
