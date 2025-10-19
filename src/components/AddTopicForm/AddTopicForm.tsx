import React from "react";

interface AddTopicFormProps {
  newTopic: string;
  setNewTopic: (value: string) => void;
  addTopic: () => void;
  logout: () => void;
}

const AddTopicForm: React.FC<AddTopicFormProps> = ({
  newTopic,
  setNewTopic,
  addTopic,
  logout,
}) => {
  return (
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
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default AddTopicForm;
