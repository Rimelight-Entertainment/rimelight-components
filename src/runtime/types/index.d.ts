export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = `daily` | `weekly` | `monthly`

export interface Range {
  start: Date
  end: Date
}
