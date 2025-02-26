import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

import React, { useState, useEffect } from "react";
import "./App.css";
import NewBoardForm from "./Components/NewBoardForm.js";
import BoardList from "./Components/BoardList";
import NewCardForm from "./Components/NewCardForm";
import Board from "./Components/Board";

const App = () => {
  // const axios = require("axios");
  const BOARDS = [];
  const [boardsData, setBoardsData] = useState(BOARDS);
  const [selectedBoard, setSelectedBoard] = useState({
    title: "",
    id: null,
    cards: [],
  });

  const getNewCards = (clickedBoard, title) => {
    let cards;
    console.log(clickedBoard);
    axios
      .get(
        `https://ancient-inlet-63477.herokuapp.com/boards/${clickedBoard}/cards`
      )
      .then((response) => {
        console.log(response);
        cards = response.data.map((card) => {
          return {
            id: card.id,
            message: card.message,
            likes: card.likes,
          };
        });
        cards = cards.sort((a, b) => a.id - b.id);

        setSelectedBoard({
          ...selectedBoard,
          id: clickedBoard,
          cards: cards,
          title: title,
        });
      })
      .catch(() => {
        console.log("This request could not go through");
      });
  };

  const createBoard = (title, owner) => {
    const newBoardList = [...boardsData];
    const newlyCreatedBoard = {
      title: title,
      owner_name: owner,
    };
    newBoardList.push(newlyCreatedBoard);
    axios
      .post(
        "https://ancient-inlet-63477.herokuapp.com/boards",
        newlyCreatedBoard
      )
      .then((response) => {
        const boards = response.data.map((board) => {
          return {
            id: board.id,
            title: board.title,
            owner: board.owner_name,
            cards: board.cards,
          };
        });
        setBoardsData(boards);
        console.log("That worked!");
      })
      .catch((error) => {
        console.log("Error Status Code:", error.response.status);
        console.log("Error Message:", error.response.data);
      });
  };

  const createCard = (message) => {
    const newlyCreatedCard = {
      message: message,
    };
    console.log(selectedBoard.id);
    axios
      .post(
        `https://ancient-inlet-63477.herokuapp.com/boards/${selectedBoard.id}/cards`,
        newlyCreatedCard
      )
      .then(() => {
        console.log("That worked!");
        getNewCards(selectedBoard.id, selectedBoard.title);
      })
      .catch((error) => {
        console.log("Error Status Code:", error.response.status);
        console.log("Error Message:", error.response.data);
      });
    // newCardList.push(newlyCreatedCard);
  };
  const selectBoard = (clickedBoard) => {
    console.log(clickedBoard.id);
    setSelectedBoard({
      title: clickedBoard.title,
      cards: [],
      id: clickedBoard.id,
    });
    getNewCards(clickedBoard.id, clickedBoard.title);
  };

  const deleteCard = (card) => {
    // const cards = board.card.filter((card) => card.id !== CardData.id);
    // setBoardsData(cards);
    console.log(card);
    axios
      .delete(
        `https://ancient-inlet-63477.herokuapp.com/boards/${selectedBoard.id}/cards/${card.id}`
      )
      .then((response) => {
        const cards = response.data.map((card) => {
          return {
            id: card.id,
            message: card.message,
            likes: card.likes,
          };
        });
        setSelectedBoard({ ...selectedBoard, cards });
        console.log("The card has been deleted.");
      })
      .catch(() => {
        console.log("The card cannot be deleted.");
      });
  };

  const deleteBoard = (board) => {
    axios
      .delete(`https://ancient-inlet-63477.herokuapp.com/boards/${board.id}`)
      .then((response) => {
        const boards = response.data.map((board) => {
          return {
            id: board.id,
            title: board.title,
            owner: board.owner,
          };
        });
        setBoardsData(boards);
        console.log("The board has been deleted.");
      })
      .catch(() => {
        console.log("The board cannot be deleted.");
      });
  };

  const updateLikes = (card) => {
    // console.log(selectedBoard)
    const cards = selectedBoard.cards.map((other_card) => {
      if (other_card.id === card.id) {
        return { ...card, likes: card.likes + 1 };
      } else {
        return other_card;
      }
    });
    setSelectedBoard({ ...selectedBoard, cards });
    axios
      .patch(
        `https://ancient-inlet-63477.herokuapp.com/boards/${selectedBoard.id}/cards/${card.id}`,
        card
      )
      .catch((error) => {
        console.log("Error Status Code:", error);
        console.log("Error Message:", error.response);
      });
  };

  useEffect(() => {
    axios
      .get("https://ancient-inlet-63477.herokuapp.com/boards")
      .then((response) => {
        const boards = response.data.map((board) => {
          return {
            id: board.id,
            title: board.title,
            owner: board.owner_name,
            cards: board.cards,
          };
        });
        setBoardsData(boards);
      })
      .catch(() => {
        console.log("This request could not go through");
      });
  }, []);

  return (
    <div className="App">
      <header></header>
      <h1>Inspiration Board</h1>
      <main>
        <div className="boardInfo">
          <BoardList
            boards={boardsData}
            selectBoard={selectBoard}
            deleteBoard={deleteBoard}
          />
          <NewBoardForm createBoard={createBoard} className="cardInfo" />
        </div>
        <Board
          board={selectedBoard.cards}
          deleteCard={deleteCard}
          createCard={createCard}
          updateLikes={updateLikes}
          title={selectedBoard.title}
        />
      </main>
    </div>
  );
};
export default App;
