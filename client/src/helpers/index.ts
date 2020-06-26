import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react'

export function convertToReadableDate(dateString: string | Date): string {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}/${Number(
    String(date.getFullYear()).substring(2, 4)
  )}`
}

export function cookieStringToObject(): { [key: string]: string } {
  return document.cookie.split(/; */).reduce((obj, str) => {
    if (str === '') return obj
    const eq = str.indexOf('=')
    const key = eq > 0 ? str.slice(0, eq) : str
    let val = eq > 0 ? str.slice(eq + 1) : null
    if (val != null)
      try {
        val = decodeURIComponent(val)
      } catch (ex) {
        /* pass */
      }
    obj[key] = val
    return obj
  }, {})
}

interface useInputType {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  reset: () => void
  bind: {
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
  }
}

export function useInput(initialValue: string, onChange?: (value: string) => void): useInputType {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: event => {
        const newValue = typeof event !== 'object' ? event : event.target.value
        if (typeof onChange === 'function') onChange(newValue)
        setValue(newValue)
      }
    }
  }
}

type EventHandlerType = (e: KeyboardEvent<HTMLInputElement>, ...props: any[]) => any

export function runOnEnter(func: EventHandlerType): EventHandlerType {
  const runOnEnterHandler: EventHandlerType = (e, ...props) => {
    if (e.key === 'Enter') func(e, ...props)
  }
  return runOnEnterHandler
}

export function runOnKey(func: EventHandlerType, key: string): EventHandlerType {
  const runOnKeyHandler: EventHandlerType = (e, ...props) => {
    if (e.key === key) func(e, ...props)
  }
  return runOnKeyHandler
}

type GenericFunction = (...args: any[]) => any

export function debounce(callback: GenericFunction, delay: number): GenericFunction {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), delay)
  }
}

export function useDebounce(func: GenericFunction, delay: number): GenericFunction {
  const [debouncedFunction, setDebouncedFunction] = useState<GenericFunction>()

  useEffect(() => {
    setDebouncedFunction(() => debounce(func, delay))
  }, [func, delay])

  return debouncedFunction
}

export function constantToReadable(text: string): string {
  return text
    .split('_')
    .filter(a => a)
    .map(word => word[0].toUpperCase() + word.slice(1, word.length).toLowerCase())
    .join(' ')
}

export function camelToReadable(text: string): string {
  return (text.match(/[A-Za-z][a-z]*/g) || []).join(' ').toLowerCase()
}
