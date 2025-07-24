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

interface Message {
  sender: "user" | "bot";
  type: "text" | "image";
  content: string;
  imageURL?: string;
}

export function VoiceRecorder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastTranscriptRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [outMessage, setOutMessage] = useState<string>("");

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !imagePreview) return;

    if (isListening) stopListening();

    const formData = new FormData();

    if (imagePreview !== null) {
      // Append image-related fields

      formData.append("user_id", "user-001-1");
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
      formData.append("user_id", "user-001-1");
      formData.append("user_explanation", trimmedInput);
    }
    try {
      // 2. Append fields
      // for example, a file from input

      const response = await fetch("http://localhost:8000/process/", {
        method: "POST",

        body: formData,
      });
      console.log(response);

      const data = await response.json(); // parse JSON response

      const message = data
        .map(
          (item) =>
            `item name: ${item.item_name} \n item price:${item.unit_price}\n item catagoery:  ${item.category}`
        )
        .join(", ");

      console.log("Constructed message:", message);

      // Assuming you have a React state setter called setOutMessageState
      setOutMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
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

    // Simulated bot reply with typing animation

    // setTimeout(() => {
    //   setIsTyping(false);
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       sender: "bot",
    //       type: "text",
    //       content: `I understand you said: "${
    //         trimmedInput || "[image only]"
    //       }".`,
    //     },
    //   ]);
    // }, 1500);
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
          content: `I understand you said: "${outMessage || "[image only]"}".`,
        },
      ]);
    }, 1500);

    // Cleanup timeout if outMessage changes again or component unmounts
    return () => clearTimeout(timer);
  }, [outMessage]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      {/* Header */}
      {/* <div className="backdrop-blur-lg bg-green-600/95 border-b border-green-500/20 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BudgetGPT</h1>
              <p className="text-sm text-green-100">Your AI Financial Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-100">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div> */}

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center space-y-8 max-w-2xl">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800">
                    How can I help you today?
                  </h2>
                  <p className="text-xl text-gray-600">
                    Ask me about budgeting, expenses, savings, or upload
                    receipts for analysis
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                  {[
                    {
                      title: "💰 Budget Planning",
                      desc: "Create a monthly budget plan",
                      gradient: "from-green-500 to-emerald-500",
                    },
                    {
                      title: "📊 Expense Analysis",
                      desc: "Analyze your spending patterns",
                      gradient: "from-green-600 to-green-400",
                    },
                    {
                      title: "🎯 Savings Goals",
                      desc: "Set and track savings targets",
                      gradient: "from-emerald-500 to-teal-500",
                    },
                    {
                      title: "📱 Receipt Scanner",
                      desc: "Upload receipts for instant tracking",
                      gradient: "from-teal-500 to-green-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-green-200 hover:bg-white/95 hover:border-green-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      onClick={() => setInput(item.desc)}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center mb-3`}
                      >
                        <span className="text-2xl">
                          {item.title.split(" ")[0]}
                        </span>
                      </div>
                      <h3 className="text-gray-800 font-semibold mb-2">
                        {item.title.slice(2)}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
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
                  className={`flex items-start space-x-4 ${
                    msg.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.sender === "user"
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
                    className={`flex-1 max-w-3xl ${
                      msg.sender === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        msg.sender === "user"
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
          <div className="border-t border-green-200 backdrop-blur-lg bg-white/80 p-6 shadow-lg">
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
                  className={`p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
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
    </div>
  );
}
