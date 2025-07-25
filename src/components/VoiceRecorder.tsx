/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Mic,
  MicOff,
  Send,
  ImagePlus,
  X,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import { ScrollDownButton } from "@/components/ScrollDownButton";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";

interface Message {
  sender: "user" | "bot";
  type: "text" | "image";
  content: string;
  imageURL?: string;
}

const features = [
  {
    icon: "💰",
    title: "Budget Planning",
    desc: "Create a monthly budget plan",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: "📊",
    title: "Expense Analysis",
    desc: "Analyze your spending patterns",
    gradient: "from-green-600 to-green-400",
  },
  {
    icon: "🎯",
    title: "Savings Goals",
    desc: "Set and track savings targets",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: "📱",
    title: "Receipt Scanner",
    desc: "Upload receipts for instant tracking",
    gradient: "from-teal-500 to-green-600",
  },
];


export function VoiceRecorder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastTranscriptRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [outMessage, setOutMessage] = useState<string>("");
  const navigate = useNavigate();

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot" || lastMessage.sender === "user") {
        scrollToBottom();
      }
    }
  }, [messages]);


  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
      alert("Microphone access is required.");
    });
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (transcript && transcript !== lastTranscriptRef.current) {
      const newPart = transcript.replace(lastTranscriptRef.current, "").trim();
      if (newPart) {
        setInput((prev) => `${prev} ${newPart}`.trim());
      }
      lastTranscriptRef.current = transcript;

      // Reset silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, 5000); // 5 seconds of silence
    }
  }, [transcript]);
  function base64ToBlob(base64) {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  function isBlob(value: any): value is Blob {
    return (
      value &&
      typeof value === "object" &&
      typeof (value as Blob).arrayBuffer === "function"
    );
  }
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !imagePreview) return;

    if (isListening) stopListening();

    const formData = new FormData();

    if (imagePreview !== null) {
      // Append image-related fields
      if (trimmedInput) {
        formData.append("user_explanation", trimmedInput);
      }
      // formData.append("image", imagePreview);

      if (
        typeof imagePreview === "string" &&
        imagePreview.startsWith("data:image/")
      ) {
        const imageBlob = base64ToBlob(imagePreview);
        formData.append("image", imageBlob, "upload.jpg");
      } else if (isBlob(imagePreview)) {
        formData.append("image", imagePreview, "upload.jpg");
      }
    } else {
      // Append text-only fields
      formData.append("user_explanation", trimmedInput);
    }
    try {
      const response = await fetch("http://localhost:8000/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
    
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    
      const data = await response.json();
    
      // If response is a list => it's expense items
      if (Array.isArray(data)) {
        const message = data
          .map(
            (item) =>
              `🛒 Item: ${item.item_name}\n💰 Price: ₹${item.unit_price}\n📦 Category: ${item.category}`
          )
          .join("\n\n");
    
        setOutMessage(message);
    
      } else if (typeof data === "object" && data.message) {
        // If response is an object => it's a chatbot message or error
        let message = data.message;
        
        // If there's also an AI response, add it
        if (data.ai_response) {
          message += `\n\n💬 AI Response:\n${data.ai_response}`;
        }
    
        setOutMessage(message);
      } else {
        // Unexpected response
        setOutMessage("⚠️ Unexpected response format from server.");
      }
    
    } catch (error) {
      console.error("Failed to send message:", error);
      setOutMessage("❌ Oops! Something went wrong. Please try again later.");
    }

    // Update local chat
    if (imagePreview) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          type: "image",
          content: trimmedInput,
          imageURL: imagePreview,
        },
      ]);
      setImagePreview(null);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "user", type: "text", content: trimmedInput },
      ]);
    }

    setInput("");
    resetTranscript();
    lastTranscriptRef.current = "";
    setIsTyping(true);
  };
  useEffect(() => {
    if (!outMessage) return; // optionally skip if empty or null

    setIsTyping(true);

    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          content: `Your expense summary saved is: \n"${outMessage || "[image only]"}".`,
        },
      ]);
    }, 1500);

    // Cleanup timeout if outMessage changes again or component unmounts
    return () => clearTimeout(timer);
  }, [outMessage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col">
      {/* Chat Area */}
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-accent-foreground">
          Speak naturally about your income and expenses
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center space-y-8 max-w-2xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                  {features.map((item, index) => (
                    <Card
                      key={index}
                      className="flex flex-col gap-3 p-4 rounded-xl border border-green-200 shadow-sm bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex justify-center">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white`}
                        >
                          <span className="text-xl">{item.icon}</span>
                        </div>
                      </div>
                      <p className="text-sm text-black-600 text-center">{item.desc}</p>
                    </Card>

                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 ${msg.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.sender === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-white to-gray-100 border border-green-200"
                      }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-green-600" />
                    )}
                  </div>

                  <div
                    className={`flex-1 max-w-3xl ${msg.sender === "user" ? "text-right" : ""
                      }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${msg.sender === "user"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-white/90 backdrop-blur-sm text-gray-800 border border-green-200 shadow-md"
                        }`}
                    >
                      {msg.imageURL && (
                        <img
                          src={msg.imageURL}
                          alt="Uploaded"
                          className="max-w-full rounded-xl mb-2"
                        />
                      )}
                      {msg.content && (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-100 border border-green-200 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm border border-green-200 rounded-2xl p-4 shadow-md">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <div
            className={`border-t border-green-200 backdrop-blur-lg bg-white/80 p-6 shadow-lg ${messages.length === 0 ? "mt-8" : ""
              }`}
          >
            {imagePreview && (
              <div className="relative inline-block mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-32 max-h-32 rounded-xl border border-green-300 shadow-md"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    imagePreview
                      ? "Add a message with your image..."
                      : "Ask me anything about your finances..."
                  }
                  className="w-full bg-white/90 backdrop-blur-sm border border-green-300 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none max-h-32 shadow-md"
                  rows={1}
                  style={{
                    height: "auto",
                    minHeight: "56px",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />

                {isListening && (
                  <div className="absolute bottom-2 left-4 flex items-center space-x-2 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Listening...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white/80 hover:bg-white backdrop-blur-sm rounded-xl border border-green-300 text-green-600 hover:text-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <ImagePlus className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </button>

                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`relative p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${isListening
                    ? "bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                >
                  {/* Animated Pulse Ring when listening */}
                  {isListening && (
                    <span className="absolute inset-0 rounded-xl border-2 border-red-400 animate-ping opacity-75"></span>
                  )}

                  {isListening ? (
                    <Mic className="w-5 h-5 relative z-10" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleSend}
                  disabled={!input.trim() && !imagePreview}
                  className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-xl text-white transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollDownButton
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }}
      />
      {transcript && (
        <Card className="p-3 bg-accent w-full max-w-md mx-auto">
          <h3 className="text-sm font-medium text-accent-foreground mb-1">
            Processing your input...
          </h3>
          <p className="text-xs text-accent-foreground">
            AI is analyzing: "{transcript}"
          </p>
        </Card>
      )}
    </div>
  );
}
