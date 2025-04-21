import { Subtopic } from "./Subtopic";

export interface Topic {
  id: number;
  title: string;
  created_at: string;
  user_id: string;
  subtopics: Subtopic[];
}
