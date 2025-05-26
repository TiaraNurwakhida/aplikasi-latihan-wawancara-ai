import React, { useState, useEffect, useRef } from "react";
import CopyRight from "../Component/HSA_Footer.jsx";
import axios from "axios";
import { useLocation } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Navbar from "../Component/SA_Header.jsx";

function ActionPage() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const location = useLocation();
  const { jobDescription, BahasaInterview } = location.state;
  const [language, setLanguage] = useState("id-ID");
  const [voice, setVoice] = useState(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (BahasaInterview === "Indonesia") {
      setLanguage("id-ID");
    } else {
      setLanguage("en-IN");
    }
  }, [BahasaInterview]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const voices = synth.getVoices();
      let selectedVoice;
      if (language === "id-ID") {
        selectedVoice = voices.find((v) => v.lang === "id-ID") || voices[0];
      } else {
        selectedVoice =
          voices.find((v) => v.lang.startsWith("en")) || voices[0];
      }
      setVoice(selectedVoice);
    };

    if (synth.getVoices().length > 0) {
      loadVoices();
    }

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, [language]);

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      role: "system",
      content:
        BahasaInterview === "Indonesia"
          ? `nama anda neo. Anda berperan sebagai pewawancara kerja yang ramah dan profesional untuk sebuah perusahaan. Deskripsi pekerjaan yang relevan adalah: ${jobDescription || "Deskripsi pekerjaan tidak tersedia"}. Seluruh wawancara akan dilakukan dalam bahasa ${BahasaInterview}.

Tugas Anda adalah mengevaluasi pengalaman, keterampilan teknis, dan kemampuan pemecahan masalah kandidat. Gunakan pertanyaan yang relevan dan berbasis skenario, serta sesuaikan pertanyaan dengan tanggapan kandidat.

**Petunjuk penting:**
1. Ajukan hanya **satu pertanyaan dalam satu waktu**.
2. **Tunggu jawaban kandidat terlebih dahulu** sebelum memberikan pertanyaan berikutnya.
3. Mulailah dengan memperkenalkan diri secara singkat dan menjelaskan alur wawancara.
4. Setelah perkenalan, tanyakan tentang latar belakang atau pengalaman kerja kandidat terlebih dahulu sebelum lanjut ke keterampilan teknis dan pemecahan masalah.
5. Akhiri wawancara dengan menanyakan apakah kandidat memiliki pertanyaan.
6. Jika wawancara sudah selesai atau tidak bisa dilanjukan maka anda cukup berkata STOP

Fokus pada membangun percakapan alami dan profesional seperti dalam wawancara kerja sungguhan.`
          : `your name is neo, You are acting as a friendly and professional job interviewer for a company. The relevant job description is: ${jobDescription || "No job description available"}. The entire interview must be conducted in ${BahasaInterview}.

Your task is to evaluate the candidate’s experience, technical skills, and problem-solving abilities. Use relevant and scenario-based questions, and adapt them based on the candidate’s responses.

**Important instructions:**
1. Ask **only one question at a time**.
2. **Wait for the candidate’s answer** before asking the next question.
3. Start by briefly introducing yourself and explaining the interview flow.
4. After the introduction, begin by asking about the candidate’s background or work experience before moving to technical and problem-solving questions.
5. Conclude the interview by asking if the candidate has any questions.

Focus on creating a natural and professional conversation, just like a real job interview.`,
    },
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition.</p>;
  }

  const startListening = async (lang) => {
    abortControllerRef.current = new AbortController();
    setLanguage(lang);
    await SpeechRecognition.startListening({
      continuous: true,
      language: lang,
    });
    setIsRecording(true);
  };

  const stopListening = async () => {
    try {
      // Stop speech recognition first
      await SpeechRecognition.stopListening();
      setIsRecording(false);

      // Process final transcript
      const finalTranscript = transcript.trim();
      let updatedHistory = [...conversationHistory];

      if (finalTranscript !== "") {
        updatedHistory = [
          ...updatedHistory,
          { role: "user", content: finalTranscript },
        ];
        resetTranscript();
      }

      setConversationHistory(updatedHistory);
      await handleSendToApi(updatedHistory);
    } catch (error) {
      console.error("Error stopping recognition:", error);
    }
  };

  const stopInterview = async () => {
    try {
      abortControllerRef.current.abort();
      if (isRecording) {
        await SpeechRecognition.abortListening();
        setIsRecording(false);
      }
      setInterviewEnded(true);
    } catch (error) {
      console.error("Error stopping interview:", error);
    }
  };

  const splitTextToChunks = (text, maxLength = 200) => {
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
    const chunks = [];

    let currentChunk = "";

    for (let sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk.trim() !== "") {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const speakText = (text) => {
    return new Promise((resolve, reject) => {
      if (!voice || !text) {
        reject("Voice not loaded or no text");
        return;
      }

      // Cancel ongoing speech
      window.speechSynthesis.cancel();

      const chunks = splitTextToChunks(text);

      const speakChunk = (index) => {
        if (index >= chunks.length) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.voice = voice;
        utterance.rate = 1.3;
        utterance.pitch = 0.8;

        utterance.onend = () => {
          speakChunk(index + 1);
        };

        utterance.onerror = (e) => {
          console.error("Speech error:", e);
          reject(e);
        };

        window.speechSynthesis.speak(utterance);
      };

      speakChunk(0);
    });
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleSendToApi = async (history) => {
    if (interviewEnded) return;

    try {
      if (!interviewStarted) {
        setInterviewStarted(true);
      }
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4.1", //"ft:gpt-3.5-turbo-1106:personal::A1tMavrf",
          messages: history,
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        }
      );

      const apiResponse = response.data.choices[0].message.content;
      const newHistory = [
        ...history,
        { role: "assistant", content: apiResponse },
      ];

      setConversationHistory(newHistory);

      if (apiResponse.includes("STOP")) {
        setInterviewEnded(true);
      }

      // Tunggu hingga selesai berbicara sebelum melanjutkan
      await speakText(apiResponse);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error communicating with API:", error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.key === " ") {
        event.preventDefault();
        if (isRecording) {
          await stopListening();
        } else {
          await startListening(language);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRecording, language, conversationHistory, transcript]);

  return (
    <>
      <div className="bg-white bg-gradient-to-r from-purple-300 via-pink-200 to-white opacity-90 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          {!interviewStarted ? (
            <div className="flex items-center justify-center min-h-screen">
              <button
                onClick={() => handleSendToApi(conversationHistory)}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Start Interview
              </button>
            </div>
          ) : (
            <>
              <div className="mt-[80px] flex-grow">
                {!interviewEnded && (
                  <>
                    <div className="max-w-6xl mx-auto px-4">
                      <div className="flex justify-between items-center mb-4">
                        <button
                          onClick={stopInterview}
                          className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Stop Interview
                        </button>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="rounded-xl bg-white border border-gray-300 px-3 py-2 text-sm font-normal text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                          <option value="en-IN">English</option>
                          <option value="id-ID">Indonesia</option>
                        </select>
                      </div>

                      <div className="space-y-6 mb-20 max-h-[calc(100vh-280px)] overflow-y-auto p-4">
                        {conversationHistory
                          .filter((msg) => msg.role !== "system")
                          .map((message, index) => (
                            <div
                              key={index}
                              className={
                                message.role === "assistant"
                                  ? "text-left"
                                  : "text-right"
                              }
                            >
                              <p
                                className={`font-bold ${
                                  message.role === "assistant"
                                    ? "text-indigo-600"
                                    : "text-green-600"
                                }`}
                              >
                                {message.role === "assistant"
                                  ? "Interviewer"
                                  : "You"}
                              </p>
                              <div
                                className={`p-3 rounded-xl shadow-md mt-1 ${
                                  message.role === "assistant"
                                    ? "bg-[#F3F8FF]"
                                    : "bg-[#E1F7E3]"
                                }`}
                                style={{
                                  maxWidth: "80%",
                                  display: "inline-block",
                                }}
                              >
                                <p className="text-gray-900 font-semibold text-justify">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        {isRecording && transcript && (
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              You (typing...)
                            </p>
                            <div
                              className="p-3 rounded-xl shadow-md mt-1 bg-[#E1F7E3]"
                              style={{
                                maxWidth: "80%",
                                display: "inline-block",
                              }}
                            >
                              <p className="text-gray-900 font-semibold text-justify">
                                {transcript}
                              </p>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </>
                )}

                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2 items-center">
                  {!interviewEnded && (
                    <>
                      <div className="relative inline-block">
                        <button
                          onClick={() => {
                            if (isRecording) {
                              stopListening();
                            } else {
                              startListening(language);
                            }
                          }}
                          className={`rounded-full p-3 text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            isRecording
                              ? "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600"
                              : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
                          } transition-colors duration-300`}
                          aria-label={
                            isRecording ? "Stop recording" : "Start recording"
                          }
                        >
                          {isRecording ? (
                            <svg
                              className="w-6 h-6"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                            >
                              <path
                                fill="#ffffff"
                                d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 21.2-5.1 41.1-14.2 58.7L416 300.8 416 96c0-53-43-96-96-96s-96 43-96 96l0 54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128l0-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                            >
                              <path
                                fill="#ffffff"
                                d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isRecording
                          ? "Recording... Press space to stop"
                          : "Press space to start recording"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {interviewEnded && (
            <div className="flex justify-center items-center mt-[240px]">
              <div className="text-center">
                <div className="p-4">
                  <p className="text-red-600 text-lg">Interview has ended!</p>
                </div>
                <div>
                  <a
                    href="/start"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Start Again
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white bg-gradient-to-r from-purple-300 via-pink-200 to-white opacity-90">
        <CopyRight />
      </div>
    </>
  );
}

export default ActionPage;
