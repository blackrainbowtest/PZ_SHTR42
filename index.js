const { default: axios } = require("axios");
const fs = require("fs");

const googleTranslateURL = (from, to, txt) =>
  `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${from}&tl=${to}&q=${txt}`;

const pause = 300; // API limit (5 requests per second)

const inputFilePath = "input.txt"; // файл с исходными строками
const outputFilePath = "translated.txt"; // файл для сохранения переведенных строк

const lines = fs.readFileSync(inputFilePath).toString().split("\n");

let translatedText = "";
let index = 0;
let isTranslating = false;

const intervalID = setInterval(addTranslation, pause);

async function addTranslation() {
  if (isTranslating) return;
  isTranslating = true;

  if (index >= lines.length) {
    console.log("stop process");
    clearInterval(intervalID);

    fs.writeFileSync(outputFilePath, translatedText);
    return;
  }

  const line = lines[index];
  if (line.trim().startsWith("--")) {
    translatedText += line + "\n";
    index++;
    isTranslating = false;
    return;
  }

  console.log("try line..", index);
  const url = googleTranslateURL("uk", "ru", encodeURI(line.trim()));
  let enResp;
  try {
    enResp = await axios(url);
  } catch (e) {
    console.log("skipped line", line);
    console.error(e);
  }

  translatedText += `${enResp ? enResp.data[0][0][0] : line.trim()}\n`;

  index++;
  isTranslating = false;
}