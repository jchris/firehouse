export interface MessageDoc {
  type: 'message'
  max: number
  created: number
  message: string
  profileImg: string
  ai?: string
  _id?: string
}

export interface ReactionDoc {
  type: 'reaction'
  parent: { max: number; created: number; id: string }
  reaction: string
  profileImg: string
  _id?: string
}

export interface ChannelDoc {
  created?: number
  name?: string
  description?: string
  _id?: string
}
