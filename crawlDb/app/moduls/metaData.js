import mongoose from "mongoose";

const { Schema } = mongoose;

// Định nghĩa Schema cho từ vựng
const WordSchema = new Schema({
  word: { type: String }, // Từ cần định nghĩa, không bắt buộc

  phonetic: {
    text: { type: String },
    audio: { type: String },
    sourceUrl: { type: String }, // Liên kết đến nguồn của âm thanh, không bắt buộc
    license: {
      name: { type: String }, // Tên giấy phép, không bắt buộc
      url: { type: String }, // URL của giấy phép, không bắt buộc
    },
  },

  type: { type: String }, // Loại từ (adverb, verb, noun, v.v.), không bắt buộc

  definitions: [
    {
      partOfSpeech: { type: String }, // Loại từ (adverb, verb, v.v.), không bắt buộc
      definitions: [
        {
          definition: { type: String }, // Định nghĩa của từ, không bắt buộc
          example: { type: String }, // Ví dụ về cách sử dụng từ, không bắt buộc
        },
      ],
    },
  ],

  embedding: { type: [Number] }, // Mảng số (vector embedding), không bắt buộc
});

// Tạo model từ schema
const Word = mongoose.model("MetaData", WordSchema);

export default Word;
