type Topic = {
  id: number
  name: string
}
export interface Challenge {
  id: string
  title: string
  description: string
  expiresAt: string
  topic: Topic
}
