type Topic = {
  id: number;
  name: string;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  expiresAt: string;
  topic: Topic;
};

export type { Topic, Challenge };
