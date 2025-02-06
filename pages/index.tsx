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
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [editTopicTitle, setEditTopicTitle] = useState(""); // State for edited topic title
  const [editTopicId, setEditTopicId] = useState<number | null>(null); // State for topic ID being edited

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

  const openContentModal = (subtopic: Subtopic) => {
    setSelectedSubtopic(subtopic);
    setIsContentModalOpen(true);
  };
  
  const closeContentModal = () => {
    setIsContentModalOpen(false);
    setSelectedSubtopic(null);
  };

  const deleteTopic = async (topicId: number) => {
    const { error } = await supabase.from("topics").delete().eq("id", topicId);
  
    if (error) {
      console.error("Erro ao excluir o tópico:", error);
      return;
    }
  
    // Atualiza a lista de topics após a exclusão
    fetchTopics();
  };
  
  // Open edit modal and set the current topic title and ID
  const openEditModal = (topicId: number, currentTitle: string) => {
    setEditTopicId(topicId);
    setEditTopicTitle(currentTitle);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTopicId(null);
    setEditTopicTitle("");
  };

  // Update topic title
  const updateTopic = async () => {
    if (!editTopicId || !editTopicTitle.trim()) return;
    const { error } = await supabase
      .from("topics")
      .update({ title: editTopicTitle })
      .eq("id", editTopicId);

    if (error) {
      console.error("Erro ao atualizar o tópico:", error);
      return;
    }

    closeEditModal();
    fetchTopics();
  };
  

  return (
    <>
      <GlobalCSS />
      <div className="container">
        <h2>Add New Topic</h2>
        <div className="form-container">          
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Topic name"
          />
          <button onClick={addTopic}>Add Topic</button>
        </div>
      </div>

      {topics.map((topic) => (
        <div key={topic.id} className="topic">
          <div className="topic-header">
            <h3 className="topic-title">
              {topic.title.length > 20 ? topic.title.substring(0, 20) + "..." : topic.title}
            </h3>
            
              <button className="edit-button" onClick={() => openEditModal(topic.id, topic.title)}>
                ✏️
              </button>
              <button className="delete-button" onClick={() => deleteTopic(topic.id)}>
                🗑️
              </button>
            
          </div>
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
                {subtopic.content && (
                  <button className="content-button" onClick={() => openContentModal(subtopic)}>
                    View Additional Content
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal(topic.id)}>Add Subtopic</button>
        </div>
      ))}


      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Subtopic</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <input
              type="text"
              value={newSubtopic[currentTopicId] || ""}
              onChange={(e) =>
                setNewSubtopic((prev) => ({ ...prev, [currentTopicId]: e.target.value }))
              }
              placeholder="Subtopic name"
            />
            <input
              type="text"
              value={newSubtopicUrl[currentTopicId] || ""}
              onChange={(e) =>
                setNewSubtopicUrl((prev) => ({ ...prev, [currentTopicId]: e.target.value }))
              }
              placeholder="URL (optional)"
            />
            <textarea
              value={newSubtopicContent[currentTopicId] || ""}
              onChange={(e) =>
                setNewSubtopicContent((prev) => ({ ...prev, [currentTopicId]: e.target.value }))
              }
              placeholder="Subtopic content"
            />
            <button onClick={addSubtopic}>Add</button>
          </div>
        </div>
      )}

      {isContentModalOpen && selectedSubtopic && (
        <div className="modal" onClick={closeContentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedSubtopic.title}</h2>
              <button className="modal-close-content" onClick={closeContentModal}>&times;</button>
            </div>
            <p>{selectedSubtopic.content}</p>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Topic</h2>
              <button className="modal-close" onClick={closeEditModal}>&times;</button>
            </div>
            <input
              type="text"
              value={editTopicTitle}
              onChange={(e) => setEditTopicTitle(e.target.value)}
              placeholder="Topic name"
            />
            <button onClick={updateTopic}>Update</button>
          </div>
        </div>
      )}

    </>
  );
}
