import v8 from 'v8'

class Store {
  store: { [key: string]: any }

  initialValue: { [key: string]: any }

  constructor(initialValue) {
    this.store = initialValue
    this.initialValue = v8.deserialize(v8.serialize(initialValue))
  }

  get() {
    return this.store
  }

  set(value, setInitialValue) {
    this.store = value
    if (setInitialValue) this.initialValue = v8.deserialize(v8.serialize(value))
  }

  reset() {
    this.store = v8.deserialize(v8.serialize(this.initialValue))
  }
}

export default Store
