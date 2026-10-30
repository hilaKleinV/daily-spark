export type Spark = {
  id: number;
  category: string;
  title: string;
  content: string;
  prompt: string;
  imageUrl?: string;
  wikiUrl?: string;
}

export type Entry = {
  id: string;
  sparkId: number;
  date: string;
  response: string;
}

export type WritingTaskEntry = {
  id: string;
  taskId: number;
  date: string;
  response: string;
  taskType: string;
  taskTitle: string;
}
