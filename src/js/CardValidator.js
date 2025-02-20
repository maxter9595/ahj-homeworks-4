class CardValidator {
  static getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\D/g, "");

    const cardTypes = [
      {
        type: "mir",
        regex: /^220[0-4]/,
      },
      {
        type: "visa",
        regex: /^4/,
      },
      {
        type: "master",
        regex: /^5[1-5]|^222[1-9]\d{0,3}|^2[3-6]\d{0,3}|^27[0-2]\d{0,3}/,
      },
      {
        type: "amex",
        regex: /^3[47]/,
      },
      {
        type: "discover",
        regex: /^6011|^65|^64[4-9]|^6221[2-9][2-9][0-9]{3}|^622[2-9]\d{3,4}/,
      },
      {
        type: "jcb",
        regex: /^35[2-8]\d{12,16}$/,
      },
      {
        type: "diners_club",
        regex: /^3(0[0-5]|6|9|4[0-9]|5[4-9])/,
      },
    ];

    for (let { type, regex } of cardTypes) {
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
    return checkDigit === (10 - (sum % 10)) % 10;
  }

  static validate(cardNumber) {
    const type = this.getCardType(cardNumber.replace(/\D/g, ""));
    const isValid = this.isValidLuhn(cardNumber.replace(/\D/g, ""));

    return { type, isValid };
  }
}

export default CardValidator;
