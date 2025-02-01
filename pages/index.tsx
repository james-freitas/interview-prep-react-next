import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import styled from "styled-components"
import { CSSReset } from "../src/components/CSSReset";

interface Subtopic {
  id: number;
  title: string;
  completed: boolean;
  topic_id: number;
  content?: string;
  url?: string;
}

interface Topic {
  id: number;
  title: string;
  created_at: string;
  subtopics: Subtopic[];
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [newSubtopic, setNewSubtopic] = useState<{ [key: number]: string }>({});
  const [newSubtopicUrl, setNewSubtopicUrl] = useState<{ [key: number]: string }>({});
  const [newSubtopicContent, setNewSubtopicContent] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    let { data: topicsData, error: topicsError } = await supabase
      .from("topics")
      .select("*");

    let { data: subtopicsData, error: subtopicsError } = await supabase
      .from("subtopics")
      .select("id, title, completed, topic_id, url, content");

    if (topicsError || subtopicsError) {
      console.error("Erro ao buscar dados:", topicsError || subtopicsError);
      return;
    }

    const topicsWithSubtopics = topicsData?.map((topic) => ({
      ...topic,
      subtopics: subtopicsData?.filter((sub) => sub.topic_id === topic.id) || [],
    }));

    setTopics(topicsWithSubtopics);
  };

  const addTopic = async () => {
    if (!newTopic.trim()) return;
    await supabase.from("topics").insert([{ title: newTopic }]);
    setNewTopic("");
    fetchTopics();
  };

  const toggleSubtopic = async (subtopicId: number, completed: boolean) => {
    await supabase
      .from("subtopics")
      .update({ completed: !completed })
      .eq("id", subtopicId);

    fetchTopics();
  };

  const addSubtopic = async (topicId: number) => {
    if (!newSubtopic[topicId]?.trim()) return;
    await supabase
      .from("subtopics")
      .insert([
        { 
          title: newSubtopic[topicId], 
          topic_id: topicId, 
          completed: false,
          url: newSubtopicUrl[topicId] || "", 
          content: newSubtopicContent[topicId] || ""  
        }
      ]);
    setNewSubtopic((prev) => ({ ...prev, [topicId]: "" }));
    setNewSubtopicUrl((prev) => ({ ...prev, [topicId]: "" }));
    setNewSubtopicContent((prev) => ({ ...prev, [topicId]: "" }));
    fetchTopics();
  };

  return (
    <>
      <CSSReset />

      <div className="container">
        <h1>Topic List</h1>

        <div className="form-container">
        <h2>Adicionar Novo Tópico</h2>
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Nome do Tópico"
        />
        <button onClick={addTopic}>Adicionar Tópico</button>
        </div>
      </div>

      {topics.map((topic) => (
        <div key={topic.id} className="topic">
          <h2 className="topic-title">{topic.title}</h2>
          <ul>
            {topic.subtopics.map((subtopic) => (
              <li key={subtopic.id} className="subtopic">
                <input
                  type="checkbox"
                  checked={subtopic.completed}
                  onChange={() => toggleSubtopic(subtopic.id, subtopic.completed)}
                />
                <span className={subtopic.completed ? "completed" : ""}>
                  <a href={subtopic.url} target="_blank" rel="noopener noreferrer">
                    {subtopic.title}
                  </a>
                </span>                
                {subtopic.content && <p>{subtopic.content}</p>}
              </li>
            ))}
          </ul>

          <div className="input-container">
            <input
              type="text"
              value={newSubtopic[topic.id] || ""}
              onChange={(e) =>
                setNewSubtopic((prev) => ({ ...prev, [topic.id]: e.target.value }))
              }
              placeholder="Novo Subtópico"
            />
            <input
              type="text"
              value={newSubtopicUrl[topic.id] || ""}
              onChange={(e) =>
                setNewSubtopicUrl((prev) => ({ ...prev, [topic.id]: e.target.value }))
              }
              placeholder="URL (opcional)"
            />
            <textarea
              value={newSubtopicContent[topic.id] || ""}
              onChange={(e) =>
                setNewSubtopicContent((prev) => ({ ...prev, [topic.id]: e.target.value }))
              }
              placeholder="Conteúdo do subtópico"
            />
            <button onClick={() => addSubtopic(topic.id)}>Adicionar</button>
          </div>
        </div>
      ))}
    

    </>
  );
}
