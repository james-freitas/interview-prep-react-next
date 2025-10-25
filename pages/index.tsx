import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { GlobalCSS } from "../src/components/GlobalCSS";
import Auth from "../src/components/Auth";
import { Session } from "@supabase/supabase-js";
import AddTopicForm from "../src/components/AddTopicForm/AddTopicForm";
import { Topic } from "../types/Topic";
import { Subtopic } from "../types/Subtopic";
import { topicService } from "../src/services/topicService";

// Main Home component for the app
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Add subtopic modal
  const [currentTopicId, setCurrentTopicId] = useState<number | null>(null); // Topic being edited/added to
  const [isContentModalOpen, setIsContentModalOpen] = useState(false); // Subtopic content modal
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(
    null
  ); // Subtopic selected for viewing content
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit topic modal
  const [editTopicTitle, setEditTopicTitle] = useState(""); // Title for editing topic
  const [editTopicId, setEditTopicId] = useState<number | null>(null); // Topic id being edited

  // Effect to handle authentication and fetch topics on login/logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTopics(session.user.id);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTopics(session.user.id);
      else setTopics([]);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch topics and their subtopics for the current user
  const fetchTopics = async (userId: string) => {
    try {
      const topicsData = await topicService.getUserTopics(userId);

      const { data: subtopicsData, error: subtopicsError } = await supabase
        .from("subtopics")
        .select("id, title, completed, topic_id, url, content");

      if (subtopicsError) throw subtopicsError;

      // Attach subtopics to their parent topics
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

  // Open modal to add a subtopic
  const openModal = (topicId: number) => {
    setCurrentTopicId(topicId);
    setIsModalOpen(true);
  };

  // Close add subtopic modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTopicId(null);
  };

  // Function to add a new subtopic to a topic
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

    // Reset input fields and close modal
    setNewSubtopic((prev) => ({ ...prev, [currentTopicId]: "" }));
    setNewSubtopicUrl((prev) => ({ ...prev, [currentTopicId]: "" }));
    setNewSubtopicContent((prev) => ({ ...prev, [currentTopicId]: "" }));
    closeModal();
    fetchTopics(session.user.id);
  };

  // Open modal to view additional content for a subtopic
  const openContentModal = (subtopic: Subtopic) => {
    setSelectedSubtopic(subtopic);
    setIsContentModalOpen(true);
  };

  // Close subtopic content modal
  const closeContentModal = () => {
    setIsContentModalOpen(false);
    setSelectedSubtopic(null);
  };

  // Function to delete a topic
  const deleteTopic = async (topicId: number) => {
    await supabase.from("topics").delete().eq("id", topicId);
    if (session) fetchTopics(session.user.id);
  };

  // Open modal to edit a topic
  const openEditModal = (topicId: number, currentTitle: string) => {
    setEditTopicId(topicId);
    setEditTopicTitle(currentTitle);
    setIsEditModalOpen(true);
  };

  // Close edit topic modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTopicId(null);
    setEditTopicTitle("");
  };

  // Function to update a topic's title
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

  // If not logged in, show Auth component
  if (!session) {
    return (
      <>
        <GlobalCSS />
        <Auth />
      </>
    );
  }

  // Main UI rendering
  return (
    <>
      <GlobalCSS />
      {/* Form to add a new topic and logout button */}
      <AddTopicForm
        newTopic={newTopic}
        setNewTopic={setNewTopic}
        addTopic={addTopic}
        logout={logout}
      />

      {/* Render all topics and their subtopics */}
      {topics.map((topic) => (
        <div key={topic.id} className="topic">
          <div className="topic-header">
            <h3 className="topic-title">
              {/* Truncate long topic titles */}
              {topic.title.length > 20
                ? topic.title.substring(0, 20) + "..."
                : topic.title}
            </h3>
            {/* Edit topic button */}
            <button
              className="edit-button"
              onClick={() => openEditModal(topic.id, topic.title)}
            >
              ✏️
            </button>
            {/* Delete topic button */}
            <button
              className="delete-button"
              onClick={() => deleteTopic(topic.id)}
            >
              🗑️
            </button>
          </div>
          <ul>
            {/* Render subtopics for this topic */}
            {topic.subtopics.map((subtopic) => (
              <li key={subtopic.id} className="subtopic">
                {/* Checkbox to mark subtopic as completed */}
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
                  {/* Link to subtopic URL */}
                  <a
                    href={subtopic.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {subtopic.title}
                  </a>
                </span>
                {/* Button to view additional content if present */}
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
          {/* Button to add a new subtopic */}
          <button onClick={() => openModal(topic.id)}>Add Subtopic</button>
        </div>
      ))}

      {/* Modal for adding a subtopic */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Subtopic</h2>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            {/* Input fields for subtopic details */}
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
            {/* Button to add subtopic */}
            <button onClick={addSubtopic}>Add</button>
          </div>
        </div>
      )}

      {/* Modal for viewing additional subtopic content */}
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

      {/* Modal for editing a topic */}
      {isEditModalOpen && (
        <div className="modal" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Topic</h2>
              <button className="modal-close" onClick={closeEditModal}>
                &times;
              </button>
            </div>
            {/* Input for editing topic title */}
            <input
              type="text"
              value={editTopicTitle}
              onChange={(e) => setEditTopicTitle(e.target.value)}
              placeholder="Topic name"
            />
            {/* Button to update topic */}
            <button onClick={updateTopic}>Update</button>
          </div>
        </div>
      )}
    </>
  );
}
