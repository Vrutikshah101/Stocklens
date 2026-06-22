import { getScreenerResults, getScreenerTemplates } from '@/lib/utils/constants'
import type { ScreenerFilter } from '@/types/screener'

export function getScreenerTemplateCatalog() {
  return getScreenerTemplates()
}

export function runScreenerQuery(step: number, filters: ScreenerFilter[]) {
  return getScreenerResults(step, filters)
}
