import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript?: (text: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate voice recording for demo
    setTimeout(() => {
      const demoTranscript = "I spent $50 on groceries, $20 on gas, and $30 on utilities this week.";
      setTranscript(demoTranscript);
      onTranscript?.(demoTranscript);
      setIsRecording(false);
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <Card className="p-8 text-center bg-gradient-subtle border-border shadow-card">
      <div className="space-y-6">
        <div className="space-y-3">
          <Volume2 className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-senior-lg font-semibold text-foreground">
            Voice Budget Assistant
          </h3>
          <p className="text-senior-base text-muted-foreground max-w-md mx-auto">
            Tell me about your expenses and I'll help organize your budget
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            size="lg"
            className={`h-20 w-20 rounded-full text-senior-base font-medium transition-all duration-300 ${
              isRecording
                ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                : "bg-gradient-primary hover:shadow-gentle"
            }`}
          >
            {isRecording ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>

          <p className="text-senior-sm text-muted-foreground">
            {isRecording ? "Listening... Tap to stop" : "Tap to start speaking"}
          </p>
        </div>

        {transcript && (
          <div className="mt-6 p-4 bg-accent rounded-lg border border-border">
            <h4 className="text-senior-base font-medium text-accent-foreground mb-2">
              What I heard:
            </h4>
            <p className="text-senior-sm text-accent-foreground">{transcript}</p>
          </div>
        )}
      </div>
    </Card>
  );
}