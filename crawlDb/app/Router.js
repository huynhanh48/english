import express from "express";
import {
  concatString,
  getEmbedding,
  genai,
  url,
  delay,
  generatorWord,
} from "../embedding.js";
import fs from "fs";
import Word from "./moduls/metaData.js";

const router = express.Router();

router.get("/question", async (req, res) => {
  console.log("query   : ", req.query);
  const word = req.query.q;
  word ? res.json(await generatorWord(word)) : res.json(null);
});
router.post("/setmetadata", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});
router.get("/:word", async (req, res, next) => {
  const keyword = req.params.word;

  const word = await Word.findOne({ word: keyword }).exec();
  console.log(`key Word ${keyword} : `, word);
  res.json(word);
});

router.get("/fetchAllData", async (req, res) => {
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
      const metaData = { ...item, embedding: vector };
      //dua metaData vao db  mongodb
      const word = new Word(metaData);
      word.save().then(() => {
        console.log("luu dataBase");
      });
      // console.log(metaData);
    });
  }
  await run();

  res.send("FetchData");
});
router.get("/", (req, res, next) => {
  res.send("metadataHome");
});

export default router;
