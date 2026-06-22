import { DEMO_ALERTS } from '@/lib/utils/constants'
import type { AlertRecord } from '@/types/alert'

export function getInitialAlerts(): AlertRecord[] {
  return DEMO_ALERTS
}
