/**
 * @jest-environment jsdom
 */
import CardValidator from "../CardValidator";

describe("CardValidator Unit Tests", () => {
  test("Validates card numbers using Luhn algorithm", () => {
    expect(CardValidator.isValidLuhn("4532015112830366")).toBe(true);
    expect(CardValidator.isValidLuhn("6011000990139424")).toBe(true);
    expect(CardValidator.isValidLuhn("1234567812345671")).toBe(false);
  });

  test("Detects the correct card type based on the card number", () => {
    expect(CardValidator.getCardType("2202201016974954")).toBe("mir");
    expect(CardValidator.getCardType("2200154542462337")).toBe("mir");
    expect(CardValidator.getCardType("2201382000000013")).toBe("mir");

    expect(CardValidator.getCardType("4556706216985053")).toBe("visa");
    expect(CardValidator.getCardType("4024007125001163")).toBe("visa");
    expect(CardValidator.getCardType("4024007174936109679")).toBe("visa");

    expect(CardValidator.getCardType("2221005316806569")).toBe("master");
    expect(CardValidator.getCardType("5522073986849755")).toBe("master");
    expect(CardValidator.getCardType("5153268409501621")).toBe("master");

    expect(CardValidator.getCardType("344666953136135")).toBe("amex");
    expect(CardValidator.getCardType("347755880087367")).toBe("amex");
    expect(CardValidator.getCardType("348218076475234")).toBe("amex");

    expect(CardValidator.getCardType("6011222820562324")).toBe("discover");
    expect(CardValidator.getCardType("6011540894881340")).toBe("discover");
    expect(CardValidator.getCardType("6011999468660913099")).toBe("discover");

    expect(CardValidator.getCardType("3535685806397945")).toBe("jcb");
    expect(CardValidator.getCardType("3536665388973965")).toBe("jcb");
    expect(CardValidator.getCardType("3540530120464769295")).toBe("jcb");

    expect(CardValidator.getCardType("36283021926837")).toBe("diners_club");
    expect(CardValidator.getCardType("30253532089223")).toBe("diners_club");
    expect(CardValidator.getCardType("30472399561633")).toBe("diners_club");

    expect(CardValidator.getCardType("0000000000000000")).toBe(null);
    expect(CardValidator.getCardType("9999999999999999")).toBe(null);
    expect(CardValidator.getCardType("qwertepass123456")).toBe(null);
  });

  test("Performs full card validation including Luhn and card type detection", () => {
    expect(CardValidator.validate("2202201016974954")).toEqual({
      type: "mir",
      isValid: true,
    });

    expect(CardValidator.validate("4556706216985053")).toEqual({
      type: "visa",
      isValid: true,
    });

    expect(CardValidator.validate("2221005316806569")).toEqual({
      type: "master",
      isValid: true,
    });

    expect(CardValidator.validate("344666953136135")).toEqual({
      type: "amex",
      isValid: true,
    });

    expect(CardValidator.validate("6011222820562324")).toEqual({
      type: "discover",
      isValid: true,
    });

    expect(CardValidator.validate("3535685806397945")).toEqual({
      type: "jcb",
      isValid: true,
    });

    expect(CardValidator.validate("36283021926837")).toEqual({
      type: "diners_club",
      isValid: true,
    });

    expect(CardValidator.validate("1234567812345671")).toEqual({
      type: null,
      isValid: false,
    });
  });
});

describe("CardValidator DOM Tests", () => {
  let input;
  let button;
  let message;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="col-md-5">
        <h3>Check your credit card number</h3>
        <ul class="cards list-unstyled">
            <li><span class="card mir" title="MIR">MIR</span></li>
            <li><span class="card visa" title="Visa">Visa</span></li>
            <li><span class="card master" title="Mastercard">Mastercard</span></li>
            <li><span class="card amex" title="American Express">American Express</span></li>
            <li><span class="card discover" title="Discover">Discover</span></li>
            <li><span class="card jcb" title="JCB">JCB</span></li>
            <li><span class="card diners_club" title="Diners Club">Diners Club</span></li>
        </ul>
        <form id="form" class="form-inline" novalidate="novalidate">
            <div class="form-group">
                <input class="form-control col-md-6" id="card_number" name="card_number" type="text" placeholder="Credit card number" />
                <a id="submitform" class="btn btn-success">Click to Validate</a>
            </div>
        </form>
        <p id="message"></p>
      </div>
    `;

    input = document.querySelector("#card_number");
    button = document.querySelector("#submitform");
    message = document.querySelector("#message");

    button.addEventListener("click", () => {
      const cardNumber = input.value.trim();

      if (!cardNumber) {
        message.textContent = "Введите номер карты";
        return;
      }

      const validationResult = CardValidator.validate(cardNumber);
      const isValid = validationResult?.isValid ?? false;

      message.textContent = isValid
        ? "Оплата произведена"
        : "Некорректный номер карты";
    });
  });

  test.each([
    ["4556706216985053", "Оплата произведена"],
    ["1234567890123456", "Некорректный номер карты"],
    ["", "Введите номер карты"],
    ["abcdefg12345678", "Некорректный номер карты"],
  ])("Validating card number %s", async (cardNumber, expectedMessage) => {
    input.value = cardNumber;
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(message.textContent).toBe(expectedMessage);
  });
});
