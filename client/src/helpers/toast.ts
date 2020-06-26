import { toast } from 'react-toastify'

export const toastWithErrorMessage = (text: string) => (err: Error): void => {
  toast.error([text, err.message].filter(a => a).join(': '))
}
