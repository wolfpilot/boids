interface ISubscriber {
  id: number;
  cb: any;
}

interface ITopics {
  [key: string]: ISubscriber[];
}

// Setup
let topics: ITopics = {};
let subID = -1;

export const subscribe = (topic: string, cb: any) => {
  subID += 1;

  // Create empty topic if key doesn't exist
  if (!topics[topic]) {
    topics[topic] = [];
  }

  topics[topic].push({
    id: subID,
    cb,
  });

  return subID;
};

export const unsubscribe = (id: number) => {
  if (!topics) {
    return;
  }

  // Create a key/value array of all subscriptions
  const subscriptions = new Map(Object.entries(topics));

  // Check existing subscriptions for matching subscriber ID
  subscriptions.forEach((subscribers, topic) => {
    const subIndex = subscribers.findIndex(sub => sub.id === id);

    if (subIndex > -1) {
      topics[topic].splice(subIndex, 1);
    }
  });
};

export const publish = (topic: string, args: any) => {
  // Exit early if topic doesn't exist
  if (!topics || !topics[topic]) {
    return;
  }

  for (const subscriber of topics[topic]) {
    subscriber.cb(args);
  }
};
