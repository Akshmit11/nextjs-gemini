'use client';

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useState } from "react";


const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);



export default function Home() {
  const [data, setData] = useState<string>("");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(input: string) {
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage(input);
    console.log(result.response.text());
  }
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = (event.target as HTMLFormElement)?.prompt?.value || "";
    run(prompt);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
       <form onSubmit={onSubmit} className="">
        <p className="mb-2">Enter your prompt here</p>
        <input
          type="text"
          placeholder="Enter your prompt here"
          name="prompt"
          className="border-none outline-none p-4 rounded-lg text-black"
        />{" "}
        <br />
        <button
          type="submit"
          className="bg-white border border-none outline-none p-4 rounded-lg text-black font-bold uppercase mt-2"
        >
          Submit
        </button>
      </form>
      {data && (
        <div>
          <h1 className="mt-32">Output</h1>
          <div dangerouslySetInnerHTML={{ __html: data }} />
        </div>
      )}
    </main>
  );
}
