import CardValidator from "./CardValidator.js";

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
    const { type } = CardValidator.validate(cardNumber);

    if (!cardNumber) {
      this.cards.forEach((card) => card.classList.remove("cdisabled"));
      return;
    }

    this.cards.forEach((card) => card.classList.add("cdisabled"));

    if (type) {
      const cardElement = document.querySelector(`.card.${type}`);
      if (cardElement) {
        cardElement.classList.remove("cdisabled");
      }
    }
  }

  handleSubmit() {
    const cardNumber = this.input.value.trim();
    const { isValid } = CardValidator.validate(cardNumber);

    if (!isValid) {
      alert("Некорректный номер карты");
      return;
    }

    alert("Оплата произведена");
    location.reload();
  }
}

export default CardManager;
