/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/CardValidator.js
class CardValidator {
  static getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\D/g, "");
    const cardTypes = [{
      type: "mir",
      regex: /^220[0-4]/
    }, {
      type: "visa",
      regex: /^4/
    }, {
      type: "master",
      regex: /^5[1-5]|^222[1-9]\d{0,3}|^2[3-6]\d{0,3}|^27[0-2]\d{0,3}/
    }, {
      type: "amex",
      regex: /^3[47]/
    }, {
      type: "discover",
      regex: /^6011|^65|^64[4-9]|^6221[2-9][2-9][0-9]{3}|^622[2-9]\d{3,4}/
    }, {
      type: "jcb",
      regex: /^35[2-8]\d{12,16}$/
    }, {
      type: "diners_club",
      regex: /^3(0[0-5]|6|9|4[0-9]|5[4-9])/
    }];
    for (let {
      type,
      regex
    } of cardTypes) {
      if (regex.test(cleaned)) {
        return type;
      }
    }
    return null;
  }
  static isValidLuhn(cardNumber) {
    let sum = 0;
    const cardDigits = cardNumber.split("").map(Number);
    const length = cardDigits.length;
    const parity = length % 2;
    for (let i = 0; i < length - 1; i++) {
      let num = cardDigits[i];
      if (i % 2 === parity) {
        num *= 2;
        if (num > 9) num -= 9;
      }
      sum += num;
    }
    const checkDigit = cardDigits[length - 1];
    return checkDigit === (10 - sum % 10) % 10;
  }
  static validate(cardNumber) {
    const type = this.getCardType(cardNumber.replace(/\D/g, ""));
    const isValid = this.isValidLuhn(cardNumber.replace(/\D/g, ""));
    return {
      type,
      isValid
    };
  }
}
/* harmony default export */ const js_CardValidator = (CardValidator);
;// CONCATENATED MODULE: ./src/js/CardManager.js

class CardManager {
  constructor(inputElement, cardsElements, submitButton) {
    this.input = inputElement;
    this.cards = cardsElements;
    this.submitButton = submitButton;
    this.input.addEventListener("input", this.updateCardDisplay.bind(this));
    this.submitButton.addEventListener("click", this.handleSubmit.bind(this));
  }
  updateCardDisplay() {
    const cardNumber = this.input.value.trim();
    const {
      type
    } = js_CardValidator.validate(cardNumber);
    if (!cardNumber) {
      this.cards.forEach(card => card.classList.remove("cdisabled"));
      return;
    }
    this.cards.forEach(card => card.classList.add("cdisabled"));
    if (type) {
      const cardElement = document.querySelector(`.card.${type}`);
      if (cardElement) {
        cardElement.classList.remove("cdisabled");
      }
    }
  }
  handleSubmit() {
    const cardNumber = this.input.value.trim();
    const {
      isValid
    } = js_CardValidator.validate(cardNumber);
    if (!isValid) {
      alert("Некорректный номер карты");
      return;
    }
    alert("Оплата произведена");
    location.reload();
  }
}
/* harmony default export */ const js_CardManager = (CardManager);
;// CONCATENATED MODULE: ./src/js/app.js

const inputElement = document.getElementById("card_number");
const cardsElements = document.querySelectorAll(".cards .card");
const submitButton = document.getElementById("submitform");
const cardManager = new js_CardManager(inputElement, cardsElements, submitButton);
cardManager.updateCardDisplay();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;