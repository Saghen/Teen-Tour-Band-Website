type EventListenerType = (...args: any[]) => any

interface EventsType {
  [key: string]: EventListenerType[]
}

class EventEmitter {
  events: EventsType = {}

  on(event: string, listener: EventListenerType): void {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = []
    }

    this.events[event].push(listener)
  }

  removeListener(event: string, listener: EventListenerType): boolean {
    if (typeof this.events[event] !== 'object') return false

    const listenerIndex = this.events[event].indexOf(listener)
    if (listenerIndex > -1) this.events[event].splice(listenerIndex, 1)
    return listenerIndex > -1
  }

  emit(event: string, ...args: any[]): void {
    if (typeof this.events[event] === 'object') {
      const listeners = this.events[event]

      for (const listener of listeners) {
        listener.apply(this, args)
      }
    }
  }

  once(event: string, listener: EventListenerType): void {
    this.on(event, function listenOnce(...args) {
      this.removeListener(event, listenOnce)
      listener.apply(this, args)
    })
  }
}

export default EventEmitter
