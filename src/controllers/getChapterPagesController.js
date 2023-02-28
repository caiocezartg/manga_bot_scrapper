import { api } from "../lib/axios.js";
import PDFDocument from "pdfkit";
import fs from "fs";

export async function getChapterPagesController(chapter_id_release) {
  let chapterImages = [];

  try {
    const response = await api.get(
      `https://mangalivre.net/leitor/pages/${chapter_id_release}.json`
    );

    const responseImages = response.data.images;

    if (responseImages) {
      responseImages.forEach((image, index) => {
        chapterImages.push({
          index: index,
          image_url: image.legacy,
        });
      });
    }

    const doc = new PDFDocument();
    doc.text("Este é um PDF simples criado com pdfkit");
    const stream = doc.pipe(fs.createWriteStream("output.pdf"));

    fs.readFile("output.pdf", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      return data;
    });

    // return stream;
  } catch (error) {
    console.log(error);
  }
}
