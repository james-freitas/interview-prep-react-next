import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { GlobalCSS } from "../src/components/GlobalCSS";
import Auth from "../src/components/Auth";
import { Session } from "@supabase/supabase-js";
import AddTopicForm from "../src/components/AddTopicForm/AddTopicForm";

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
  user_id: string;
  subtopics: Subtopic[];
}

export default function Home() {
  // State for managing user session
  const [session, setSession] = useState<Session | null>(null);

  // State for managing topics and their subtopics
  const [topics, setTopics] = useState<Topic[]>([]);

  // State for new topic input
  const [newTopic, setNewTopic] = useState("");

  // State for new subtopic inputs
  const [newSubtopic, setNewSubtopic] = useState<{ [key: number]: string }>({});
  const [newSubtopicUrl, setNewSubtopicUrl] = useState<{
    [key: number]: string;
  }>({});
  const [newSubtopicContent, setNewSubtopicContent] = useState<{
    [key: number]: string;
  }>({});

  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState<number | null>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicId, setEditTopicId] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTopics(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTopics(session.user.id);
      else setTopics([]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Use async/await consistently and handle errors properly
  const fetchTopics = async (userId: string) => {
    try {
      const { data: topicsData, error: topicsError } = await supabase
        .from("topics")
        .select("*")
        .eq("user_id", userId);

      if (topicsError) throw topicsError;

      const { data: subtopicsData, error: subtopicsError } = await supabase
        .from("subtopics")
        .select("id, title, completed, topic_id, url, content");

      if (subtopicsError) throw subtopicsError;

      const topicsWithSubtopics = topicsData?.map((topic) => ({
        ...topic,
        subtopics:
          subtopicsData?.filter((sub) => sub.topic_id === topic.id) || [],
      }));

      setTopics(topicsWithSubtopics);
    } catch (error) {
      console.error("Error fetching topics or subtopics:", error);
    }
  };

  // Function to add a new topic
  const addTopic = async () => {
    if (!newTopic.trim() || !session) return;

    try {
      await supabase
        .from("topics")
        .insert([{ title: newTopic, user_id: session.user.id }]);

      setNewTopic("");
      fetchTopics(session.user.id);
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  // Function to toggle subtopic completion status
  const toggleSubtopic = async (subtopicId: number, completed: boolean) => {
    if (!session) return;

    try {
      await supabase
        .from("subtopics")
        .update({ completed: !completed })
        .eq("id", subtopicId)
        .eq("user_id", session.user.id);

      fetchTopics(session.user.id);
    } catch (error) {
      console.error("Error updating subtopic:", error);
    }
  };

  const openModal = (topicId: number) => {
    setCurrentTopicId(topicId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTopicId(null);
  };

  const addSubtopic = async () => {
    if (!currentTopicId || !session || !newSubtopic[currentTopicId]?.trim())
      return;

    const { error } = await supabase.from("subtopics").insert([
      {
        title: newSubtopic[currentTopicId],
        topic_id: currentTopicId,
        completed: false,
        url: newSubtopicUrl[currentTopicId] || "",
        content: newSubtopicContent[currentTopicId] || "",
        user_id: session.user.id,
      },
    ]);

    if (error) {
      console.error("Erro ao adicionar subtópico:", error.message);
      return;
    }

    setNewSubtopic((prev) => ({ ...prev, [currentTopicId]: "" }));
    setNewSubtopicUrl((prev) => ({ ...prev, [currentTopicId]: "" }));
    setNewSubtopicContent((prev) => ({ ...prev, [currentTopicId]: "" }));
    closeModal();
    fetchTopics(session.user.id);
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
    await supabase.from("topics").delete().eq("id", topicId);
    if (session) fetchTopics(session.user.id);
  };

  const openEditModal = (topicId: number, currentTitle: string) => {
    setEditTopicId(topicId);
    setEditTopicTitle(currentTitle);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTopicId(null);
    setEditTopicTitle("");
  };

  const updateTopic = async () => {
    if (!editTopicId || !editTopicTitle.trim()) return;
    await supabase
      .from("topics")
      .update({ title: editTopicTitle })
      .eq("id", editTopicId);
    closeEditModal();
    if (session) fetchTopics(session.user.id);
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!session) {
    return (
      <>
        <GlobalCSS />
        <Auth />
      </>
    );
  }

  return (
    <>
      <GlobalCSS />
      <AddTopicForm
        newTopic={newTopic}
        setNewTopic={setNewTopic}
        addTopic={addTopic}
        logout={logout}
      />

      {topics.map((topic) => (
        <div key={topic.id} className="topic">
          <div className="topic-header">
            <h3 className="topic-title">
              {topic.title.length > 20
                ? topic.title.substring(0, 20) + "..."
                : topic.title}
            </h3>
            <button
              className="edit-button"
              onClick={() => openEditModal(topic.id, topic.title)}
            >
              ✏️
            </button>
            <button
              className="delete-button"
              onClick={() => deleteTopic(topic.id)}
            >
              🗑️
            </button>
          </div>
          <ul>
            {topic.subtopics.map((subtopic) => (
              <li key={subtopic.id} className="subtopic">
                <input
                  type="checkbox"
                  checked={subtopic.completed}
                  onChange={() =>
                    toggleSubtopic(subtopic.id, subtopic.completed)
                  }
                />
                <span
                  className={subtopic.completed ? "completed" : "not-completed"}
                >
                  <a
                    href={subtopic.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {subtopic.title}
                  </a>
                </span>
                {subtopic.content && (
                  <button
                    className="content-button"
                    onClick={() => openContentModal(subtopic)}
                  >
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
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <input
              type="text"
              value={newSubtopic[currentTopicId ?? -1] || ""}
              onChange={(e) =>
                setNewSubtopic((prev) => ({
                  ...prev,
                  [currentTopicId ?? -1]: e.target.value,
                }))
              }
              placeholder="Subtopic name"
            />
            <input
              type="text"
              value={newSubtopicUrl[currentTopicId ?? -1] || ""}
              onChange={(e) =>
                setNewSubtopicUrl((prev) => ({
                  ...prev,
                  [currentTopicId ?? -1]: e.target.value,
                }))
              }
              placeholder="URL (optional)"
            />
            <textarea
              value={newSubtopicContent[currentTopicId ?? -1] || ""}
              onChange={(e) =>
                setNewSubtopicContent((prev) => ({
                  ...prev,
                  [currentTopicId ?? -1]: e.target.value,
                }))
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
              <button
                className="modal-close-content"
                onClick={closeContentModal}
              >
                &times;
              </button>
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
              <button className="modal-close" onClick={closeEditModal}>
                &times;
              </button>
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
