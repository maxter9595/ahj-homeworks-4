/**
 * @jest-environment jsdom
 */
import CardManager from "../CardManager.js";
import CardValidator from "../CardValidator.js";

jest.mock("../CardValidator.js", () => ({
  validate: jest.fn(() => ({ type: null, isValid: false })),
}));

describe("CardManager tests", () => {
  let inputElement, cardsElements, submitButton, cardManager;
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="col-md-5">
        <h3>Check your credit card number</h3>
        <ul class="cards list-unstyled">
          <li><span class="card mir"></span></li>
          <li><span class="card visa"></span></li>
          <li><span class="card master"></span></li>
          <li><span class="card amex"></span></li>
          <li><span class="card discover"></span></li>
          <li><span class="card jcb"></span></li>
          <li><span class="card diners_club"></span></li>
        </ul>
        <form id="form">
          <div class="form-group">
            <input class="form-control" id="card_number" type="text">
            <a id="submitform" class="btn btn-success">Click to Validate</a>
          </div>
        </form>
      </div>
    `;

    inputElement = document.getElementById("card_number");
    cardsElements = document.querySelectorAll(".cards .card");
    submitButton = document.getElementById("submitform");

    cardManager = new CardManager(inputElement, cardsElements, submitButton);
  });

  test("Displays all cards when input is empty", () => {
    inputElement.value = "";
    cardManager.updateCardDisplay();

    cardsElements.forEach((card) => {
      expect(card.classList.contains("cdisabled")).toBe(false);
    });
  });

  test("Disables all cards except detected type", () => {
    CardValidator.validate.mockReturnValue({ type: "visa", isValid: true });
    inputElement.value = "4111111111111111";
    cardManager.updateCardDisplay();

    expect(
      document.querySelector(".card.visa").classList.contains("cdisabled"),
    ).toBe(false);
    expect(
      document.querySelector(".card.master").classList.contains("cdisabled"),
    ).toBe(true);
    expect(
      document.querySelector(".card.mir").classList.contains("cdisabled"),
    ).toBe(true);
  });

  test("Shows alert on invalid card submission", () => {
    CardValidator.validate.mockReturnValue({ type: null, isValid: false });
    inputElement.value = "1234567812345678";

    global.alert = jest.fn();
    cardManager.handleSubmit();

    expect(global.alert).toHaveBeenCalledWith("Некорректный номер карты");
  });

  test("Shows alert on valid card submission", () => {
    CardValidator.validate.mockReturnValue({ type: "visa", isValid: true });
    inputElement.value = "4111111111111111";

    global.alert = jest.fn();
    cardManager.handleSubmit();

    expect(global.alert).toHaveBeenCalledWith("Оплата произведена");
    expect(window.location.reload).toHaveBeenCalled();
  });

  test("Does not throw an error if detected card type does not exist in DOM", () => {
    CardValidator.validate.mockReturnValue({
      type: "nonexistent",
      isValid: true,
    });

    inputElement.value = "9999999999999999";
    expect(() => cardManager.updateCardDisplay()).not.toThrow();
  });

  test("Does not modify card elements when type is null", () => {
    CardValidator.validate.mockReturnValue({ type: null, isValid: false });
    inputElement.value = "0000000000000000";

    cardManager.updateCardDisplay();

    cardsElements.forEach((card) => {
      expect(card.classList.contains("cdisabled")).toBe(true);
    });
  });
});
