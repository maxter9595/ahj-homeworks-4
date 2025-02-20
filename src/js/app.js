import CardManager from "./CardManager.js";

const inputElement = document.getElementById("card_number");
const cardsElements = document.querySelectorAll(".cards .card");
const submitButton = document.getElementById("submitform");

const cardManager = new CardManager(inputElement, cardsElements, submitButton);
cardManager.updateCardDisplay();
