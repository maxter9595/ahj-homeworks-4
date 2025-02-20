import puppeteer from "puppeteer";

describe("Card Validation Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({
      headless: true,
    });
    page = await browser.newPage();
  });

  test("Valid Card Number", async () => {
    const validCardNumber = "4556706216985053";

    await page.goto("http://localhost:9000/");
    await page.waitForSelector("#card_number");
    await page.type("#card_number", validCardNumber);

    const dialogPromise = new Promise((resolve) => {
      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toBe("Оплата произведена");
        await dialog.dismiss();
        resolve();
      });
    });

    await Promise.all([page.click("#submitform"), dialogPromise]);
  }, 30000);

  test("Invalid Card Number", async () => {
    const invalidCardNumber = "1234567890123456";

    await page.goto("http://localhost:9000/");
    await page.waitForSelector("#card_number");
    await page.type("#card_number", invalidCardNumber);

    const dialogPromise = new Promise((resolve) => {
      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toBe("Некорректный номер карты");
        await dialog.dismiss();
        resolve();
      });
    });

    await Promise.all([page.click("#submitform"), dialogPromise]);
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });
});
