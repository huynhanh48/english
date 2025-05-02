import fs from "fs";
import { GoogleGenAI } from "@google/genai";
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

export { concatString, getEmbedding, genai, delay };
