export type MessageAppPayload = {
  name: string
  url: string
  image?: string
}

export type MessageAppFormValues = {
  manifestUrl: string
}

export type MessagePushPayload = {
  title?: string
  message: string
  link?: string
  address?: string
  addresses?: string[]
}

export type MessagePushFormValues = {
  title: string
  message: string
  link: string
  addresses: string
}
