import { createGlobalStyle } from "styled-components";

export const GlobalCSS = createGlobalStyle`
 /* Reset e estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  text-align: center;
  font-size: 24px;
}

/* Estilos para os tópicos */
.topic {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 10px;
}

.topic-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtopic {
  padding: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
}

.completed {
  text-decoration: line-through;
  color: gray;
  margin-left: 2%;
}

.not-completed {
  text-decoration: none;
  margin-left: 2%;
}

.content {
  margin-top: 2%;
}

ul {
    list-style-type:none;
}

a {
  text-decoration: none;
}

/* Botões */
button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}


.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-header h2 {
  font-size: 20px;
}

.modal-close {
  cursor: pointer;
  font-size: 20px;
  border: none;
  background: none;
}

/* Inputs dentro do modal */
input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
}

/* Responsividade */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
  }
}


`;