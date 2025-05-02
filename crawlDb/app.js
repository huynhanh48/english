import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const getDataFile = () => {
  const __fileName = fileURLToPath(import.meta.url);
  const urlWord = path.dirname(__fileName) + "/word/temp.txt";
  console.log(urlWord);
  const data = fs.readFileSync(urlWord, "utf-8");
  return data.split("\n");
};

const url = "/Users/anh/crawlDb/word/1000-most-common-words.txt";
const test = getDataFile();
const cloneData = [];

const convertData = (data) => {
  if (data.word) {
    return {
      word: data.word,
      phonetic: data.phonetics[0],
      type: data.meanings[0].partOfSpeech,
      definitions: data.meanings.map((value) => {
        return {
          partOfSpeech: value.partOfSpeech,
          definitions: value.definitions.map((definitionChild) => {
            return {
              definition: definitionChild.definition,
              example: definitionChild.example || " ",
            };
          }),
        };
      }),
    };
  }
  return { title: "No Definitions Found" };
};
const writeJson = (data, fileName = "wordsData") => {
  // Tạo đường dẫn thư mục nơi tệp sẽ được lưu
  const dirPath = path.join(
    fileURLToPath(import.meta.url)
      .split("/")
      .slice(0, -1)
      .join("/"),
    "data"
  );

  // Đường dẫn đầy đủ tới tệp JSON
  const filePath = path.join(dirPath, `${fileName}.json`);

  // Kiểm tra nếu thư mục chưa tồn tại thì tạob nó
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Thư mục ${dirPath} đã được tạo.`);
  }

  // Ghi dữ liệu vào tệp JSON
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Đã ghi dữ liệu vào tệp: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi ghi tệp: ", error);
    return false;
  }
};

async function fetchWords() {
  await Promise.all(
    test.map(async (item, index) => {
      // Đảm bảo map sử dụng async function
      return new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const response = await fetch(
              `https://api.dictionaryapi.dev/api/v2/entries/en/${item}`,
              {
                headers: {
                  "Cache-Control": "no-store",
                },
              }
            );

            const data = await response.json();
            const convert = convertData(data[0]);
            cloneData.push(convert);
            console.log(`convert word  (${item} )  : `, convert);
          } catch (error) {
            console.error(
              `Error fetch từ "${item}":`,
              error.message.split("").slice(0, 200).join("")
            );
          }
          resolve();
        }, 500 * index);
      });
    })
  );
}

async function init() {
  await fetchWords();
  console.log("Số lượng dữ liệu: ", cloneData.length);
  writeJson(cloneData, "wordnewClone");
  console.log("da ghi");
}

init();
