export type UserPlan = 'FREE' | 'PRO' | 'ELITE'

export interface UserProfile {
  id: string
  name: string
  email: string
  plan: UserPlan
  avatarInitials: string
  notifications: boolean
}

