"use client";

import { GoogleGenAI } from "@google/genai";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState("");
  const [text, setText] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };
  // const payload = {
  //   prompt,
  // };
  // const onClick = async () => {
  //   const ai = new GoogleGenAI({
  //     apiKey: "AIzaSyDrJ37nOT3Km36hMFdh7wugJDEU1_i6Qug",
  //   });

  //   if (!prompt) throw new Error("you should input prompt");
  //   const response = await ai.models.generateContent({
  //     model: "gemini-2.5-flash-image",
  //     contents: prompt,
  //   });

  //   // setData(response.candidates[0].content?.parts[0].text);
  //   for (const part of response.candidates[0].content.parts) {
  //     if (part.text) {
  //       setText(part.text);
  //     } else if (part.inlineData) {
  //       const imageData = part.inlineData.data;
  //       console.log("Image saved as gemini-native-image.png");
  //       setData(imageData);
  //     }
  //   }
  // };
  // console.log(data);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>Hello </p>

      <input
        type="text"
        value={prompt}
        onChange={handleChange}
        className="border border-green-300"
      />
      <button className="border-2 border-red-600">Click here</button>
      {text && data ? (
        <div>
          <p>{text}</p>
          <img src={`data:image/png;base64,${data}`} alt="" />
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
