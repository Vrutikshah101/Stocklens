export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

