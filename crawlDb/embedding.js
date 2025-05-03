import fs from "fs";
import { GoogleGenAI, FunctionCallingConfigMode } from "@google/genai";
import "dotenv/config";
export const url = "/Users/anh/crawlDb/data/wordnewClone.json";

// console.log(data[0]);
// console.log(process.env.GOOGLE_API);

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API,
});

async function getEmbedding(s) {
  const response = await genai.models.embedContent({
    model: "text-embedding-004",
    contents: [`${s}`],
    config: {
      outputDimensionality: 64,
    },
  });
  const result = response.embeddings[0].values;
  return result;
}
// const toTranslateVn = (word) => {
//   return {
//     wordOrigin: word.english,
//     // wordTranslate: word.vietname,
//   };
// };
async function generatorWord(s) {
  // const toTranslateVnDeclare = {
  //   name: "toTranslateVn",
  //   parameters: {
  //     type: "object",
  //     description:
  //       " set one  word  to  translate   VienNam  into  function and  example  case  used  english  ",
  //     properties: {
  //       english: {
  //         type: "string",
  //         description:
  //           " word  origin for   user   if  syntax  then  you  custome correct  ",
  //       },
  //       vietname: {
  //         type: "string",
  //         description: "word  after  have  translate   to VietNam",
  //       },
  //       example: {
  //         type: "Array",
  //         description: "Give some examples of usage in English. ",
  //         items: {
  //           type: "string",
  //         },
  //       },
  //     },
  //     required: ["english", "vietname", "example"],
  //   },
  // };
  const toTranslateVnDeclare = {
    name: "toTranslateVn",
    parameters: {
      type: "object",
      description: `
      Translate input from English to Vietnamese.
      - If the input is a single word, return its Vietnamese meaning and some example usage.
      - If the input is a sentence, return the full sentence translation and some example usage.
      - If the input has an option theme, generate example usage according to the specified theme.
      `,
      properties: {
        english: {
          type: "string",
          description: "Original English word or sentence.",
        },
        vietname: {
          type: "string",
          description: "Vietnamese translation.",
        },
        option: {
          type: "string",
          description:
            "Theme or kind of the example generation (e.g., 'technology').",
        },
        example: {
          type: "array",
          description:
            "Examples of usage for the word in English, based on the provided theme.",
          items: { type: "string" },
        },
      },
      required: ["english", "vietname", "example", "option"],
    },
  };
  const reponse = await genai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: s,
    config: {
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY,
          allowedFunctionNames: ["toTranslateVn"],
        },
      },
      tools: [{ functionDeclarations: [toTranslateVnDeclare] }],
    },
  });
  console.log(reponse.functionCalls[0]);
  return reponse.functionCalls[0];
}

function concatString(word, data = []) {
  //   console.log(data);
  let duplication = word + " ";
  let definition = data.definitions[0].definition;
  let example = data.definitions[0].example;
  //   console.log(data.definitions[0].definition);
  //   console.log(data.definitions[0].example);
  duplication += definition + example;

  return duplication;
}
const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

async function run() {
  const x = fs.readFileSync(url, "utf-8");
  let data = JSON.parse(x);
  data = data.filter(Boolean);

  data.forEach(async (item) => {
    // console.log(item);
    const embeddingString = concatString(item.word, item.definitions[0]);
    let delayres = await delay(1000);
    const vector = await getEmbedding(embeddingString);
    // console.log(vector, "\n");
    const metaData = { ...item, embbeding: vector };
    console.log(metaData);
  });
}

export { concatString, getEmbedding, genai, delay, generatorWord };
