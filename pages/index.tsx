import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import { GlobalCSS } from "../src/components/GlobalCSS";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState<number | null>(null);

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

  const openModal = (topicId: number) => {
    console.log("Abrindo modal para o tópico:", topicId);
    setCurrentTopicId(topicId);
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTopicId(null);
  };

  const addSubtopic = async () => {
    if (!currentTopicId || !newSubtopic[currentTopicId]?.trim()) return;
    await supabase
      .from("subtopics")
      .insert([
        { 
          title: newSubtopic[currentTopicId], 
          topic_id: currentTopicId, 
          completed: false,
          url: newSubtopicUrl[currentTopicId] || "", 
          content: newSubtopicContent[currentTopicId] || ""  
        }
      ]);
    setNewSubtopic((prev) => ({ ...prev, [currentTopicId]: "" }));
    setNewSubtopicUrl((prev) => ({ ...prev, [currentTopicId]: "" }));
    setNewSubtopicContent((prev) => ({ ...prev, [currentTopicId]: "" }));
    closeModal();
    fetchTopics();
  };

  return (
    <>
      <GlobalCSS />
      <div className="container">
        <h1>Adicionar Novo Tópico</h1>
        <div className="form-container">          
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
                <span className={subtopic.completed ? "completed" : "not-completed"}>
                  <a href={subtopic.url} target="_blank" rel="noopener noreferrer">
                    {subtopic.title}
                  </a>
                </span>                
                {subtopic.content && <p>{subtopic.content}</p>}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal(topic.id)}>Adicionar Subtópico</button>
        </div>
      ))}

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Subtópico</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <input
              type="text"
              value={newSubtopic[currentTopicId!] || ""}
              onChange={(e) =>
                setNewSubtopic((prev) => ({ ...prev, [currentTopicId!]: e.target.value }))
              }
              placeholder="Nome do Subtópico"
            />
            <input
              type="text"
              value={newSubtopicUrl[currentTopicId!] || ""}
              onChange={(e) =>
                setNewSubtopicUrl((prev) => ({ ...prev, [currentTopicId!]: e.target.value }))
              }
              placeholder="URL (opcional)"
            />
            <textarea
              value={newSubtopicContent[currentTopicId!] || ""}
              onChange={(e) =>
                setNewSubtopicContent((prev) => ({ ...prev, [currentTopicId!]: e.target.value }))
              }
              placeholder="Conteúdo do subtópico"
            />
            <button onClick={addSubtopic}>Adicionar</button>
          </div>
        </div>
      )}
    </>
  );
}
