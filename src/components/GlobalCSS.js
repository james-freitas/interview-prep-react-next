import { createGlobalStyle } from "styled-components";

export const GlobalCSS = createGlobalStyle`
 /* Reset e estilos globais */
* {
  margin: auto;
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
  align-items: left;
}

.modal-header h2 {
  font-size: 20px;
  margin-left: 0%;
  padding-bottom: 2%;
}

.modal-close-content {
  margin-top: -1%;
  margin-left: 33%;
  cursor: pointer;
  position: absolute;
  font-size: 16px; /* Reduce font size */
  border: none;
  background:rgb(82, 79, 245);
  padding: 5px 10px; /* Reduce padding */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px; /* Set a fixed width */
  height: 30px; /* Set a fixed height */
  border-radius: 20%; /* Make it circular */
}

.modal-close {
  margin-top: -1%;
  margin-left: 46%;
  cursor: pointer;
  position: absolute;
  font-size: 16px; /* Reduce font size */
  border: none;
  background:rgb(82, 79, 245);
  padding: 5px 10px; /* Reduce padding */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px; /* Set a fixed width */
  height: 30px; /* Set a fixed height */
  border-radius: 20%; /* Make it circular */
}

.modal-close:hover {
  background: rgba(245, 52, 52, 0.73);
}

.modal-close-content:hover {
  background: rgba(245, 52, 52, 0.73);
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

.content-button {
  background-color: #0056b3;
  color:rgb(239, 242, 245);
  border: none;
  cursor: pointer;
  text-decoration: none;
  margin-top: 3%;
}

.content-button:hover {
  background-color: #007bff;
}


.topic-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topic-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  flex-grow: 1; /* Ocupa o espaço disponível */
}

.delete-button {
  cursor: pointer;
  font-size: 16px;
  border: none;
  background: rgb(247, 227, 224);
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10%;
  margin-left: 10px; /* Add some spacing between the title and the button */
}

.delete-button:hover {
  color: #c82333; /* Tom mais escuro ao passar o mouse */
}


/* Responsividade */
@media (max-width: 480px) {

  button {
    font-size: medium;
    font-weight: 600;
  }
  .modal-content {
    width: 95%;
    font-weight: 900;
  }

  .modal-close {
    margin-top: -1%;
    margin-left: 77%;
  }

  .modal-close-content {
    margin-top: -1%;
    margin-left: 77%;
  }

  .delete-button {
    margin-left: 5px; /* Reduce spacing on smaller screens */
  }
}

`;