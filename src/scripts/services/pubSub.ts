// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICallback<T = any> = (args?: T) => void

interface ISubscriber {
  id: number
  cb: ICallback
}

interface ITopics {
  [key: string]: ISubscriber[]
}

// Setup
const topics: ITopics = {}
let subID = -1

export const subscribe = (topic: string, cb: ICallback): number => {
  subID += 1

  // Create empty topic if key doesn't exist
  if (!topics[topic]) {
    topics[topic] = []
  }

  topics[topic].push({
    id: subID,
    cb,
  })

  return subID
}

export const unsubscribe = (id: number): void => {
  if (!topics) {
    return
  }

  // Create a key/value array of all subscriptions
  const subscriptions = new Map(Object.entries(topics))

  // Check existing subscriptions for matching subscriber ID
  subscriptions.forEach((subscribers, topic) => {
    const subIndex = subscribers.findIndex((sub) => sub.id === id)

    if (subIndex > -1) {
      topics[topic].splice(subIndex, 1)
    }
  })
}

export const publish = (topic: string, args: unknown): void => {
  // Exit early if topic doesn't exist
  if (!topics || !topics[topic]) {
    return
  }

  for (const subscriber of topics[topic]) {
    subscriber.cb(args)
  }
}
