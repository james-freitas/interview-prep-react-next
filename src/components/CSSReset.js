import { createGlobalStyle } from "styled-components";

export const CSSReset = createGlobalStyle`
  /* Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: sans-serif;
  }
  /* NextJS */
  html {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  body {
    display: flex;
    flex: 1;
  }
  #__next {
    display: flex;
    flex: 1;
  }
  /* Globals */
  body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 600px;
  margin: 40px auto;
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column; /* Organiza os tópicos em coluna */
  gap: 20px; /* Espaço entre os tópicos */
}

h1 {
  text-align: center;
  font-size: 24px;
}

/* Estilo de cada tópico */
.topic {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.topic-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Subtópicos organizados em coluna */
.subtopics-list {
  display: flex;
  flex-direction: column; /* Um subtópico abaixo do outro */
  gap: 10px;
  margin-top: 10px;
}

/* Cada subtópico com borda e espaçamento */
.subtopic {
  padding: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.subtopic input {
  margin-right: 10px;
}

.subtopic span {
  font-size: 16px;
}

.completed {
  text-decoration: line-through;
  color: gray;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

input[type="text"] {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

`;