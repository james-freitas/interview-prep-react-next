import { supabase } from "../../lib/supabase";
import { Topic } from "../../types/Topic";

export const topicService = {
  async getUserTopics(userId: string) {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return data as Topic[];
  },
};
