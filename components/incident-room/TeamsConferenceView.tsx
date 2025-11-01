"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Mic, Video, PhoneOff, Monitor, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamsConferenceViewProps {
  onClose: () => void;
}

interface Transcript {
  speaker: string;
  speakerColor: string;
  text: string;
  participantIndex: number;
  duration: number; // milliseconds to display
}

export function TeamsConferenceView({ onClose }: TeamsConferenceViewProps) {
  const participants = [
    { name: "Sarah Chen", role: "CISO", initial: "SC", color: "bg-blue-600" },
    { name: "You (MSSP Analyst)", role: "Lead Analyst", initial: "MA", color: "bg-purple-600" },
    { name: "James Wilson", role: "Legal Counsel", initial: "JW", color: "bg-green-600" },
    { name: "Priya Patel", role: "HR Director", initial: "PP", color: "bg-orange-600" },
    { name: "Alex Martinez", role: "Forensics", initial: "AM", color: "bg-red-600" },
    { name: "Dr. Emily Foster", role: "External Legal", initial: "EF", color: "bg-teal-600" },
  ];

  const transcripts: Transcript[] = [
    {
      speaker: "Sarah Chen",
      speakerColor: "text-blue-400",
      text: "Thank you everyone for joining. We've detected unusual data access patterns that triggered our insider threat protocols. The MSSP team has initiated evidence collection with our approval.",
      participantIndex: 0,
      duration: 6000,
    },
    {
      speaker: "MSSP Analyst",
      speakerColor: "text-purple-400",
      text: "Thanks Sarah. Our automated systems flagged a 165% deviation from baseline access patterns. We're seeing significant after-hours activity and large volume downloads to personal storage.",
      participantIndex: 1,
      duration: 5500,
    },
    {
      speaker: "Alex Martinez",
      speakerColor: "text-red-400",
      text: "From a forensics perspective, we've already collected DLP logs, VPN connection data, and Active Directory logs. The user accessed restricted systems three times in the past week.",
      participantIndex: 4,
      duration: 5000,
    },
    {
      speaker: "James Wilson",
      speakerColor: "text-green-400",
      text: "Before we proceed further, we need to ensure all evidence collection is legally compliant. I'll need to review the scope of data access and confirm we have proper authorization for email content review.",
      participantIndex: 2,
      duration: 5500,
    },
    {
      speaker: "Priya Patel",
      speakerColor: "text-orange-400",
      text: "From HR's side, I can confirm we have performance concerns on file. However, I need CISO approval before sharing any personnel records. We must protect employee privacy throughout this process.",
      participantIndex: 3,
      duration: 5000,
    },
    {
      speaker: "Dr. Emily Foster",
      speakerColor: "text-teal-400",
      text: "I agree with James. Given the sensitive nature of insider threats, we should establish a clear legal framework for this investigation. This protects both the organization and the individual's rights.",
      participantIndex: 5,
      duration: 5500,
    },
    {
      speaker: "Sarah Chen",
      speakerColor: "text-blue-400",
      text: "Understood. I'm approving evidence collection for DLP logs, access patterns, and metadata. For full email content and HR records, let's follow our standard approval workflow. James and Priya, you have my authorization to proceed.",
      participantIndex: 0,
      duration: 6000,
    },
    {
      speaker: "MSSP Analyst",
      speakerColor: "text-purple-400",
      text: "Perfect. The evidence collection is now in progress. We'll have a complete picture within the next few minutes. I recommend we reconvene in 30 minutes to review findings and determine next steps.",
      participantIndex: 1,
      duration: 5000,
    },
  ];

  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState(0);

  useEffect(() => {
    if (currentTranscriptIndex >= transcripts.length) {
      // Loop back to start
      const loopTimer = setTimeout(() => {
        setCurrentTranscriptIndex(0);
      }, 2000);
      return () => clearTimeout(loopTimer);
    }

    const currentTranscript = transcripts[currentTranscriptIndex];
    setActiveSpeaker(currentTranscript.participantIndex);

    const timer = setTimeout(() => {
      setCurrentTranscriptIndex(prev => prev + 1);
    }, currentTranscript.duration);

    return () => clearTimeout(timer);
  }, [currentTranscriptIndex]);

  const currentTranscript = currentTranscriptIndex < transcripts.length
    ? transcripts[currentTranscriptIndex]
    : transcripts[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-slate-900 rounded-lg overflow-hidden flex flex-col">
        {/* Teams Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Incident Response Conference</h3>
                <p className="text-slate-400 text-xs">INC-2025-8542 | Insider Threat Investigation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Recording
            </Badge>
            <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
              6 Participants
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Gallery View */}
        <div className="flex-1 bg-slate-950 p-4">
          <div className="grid grid-cols-3 gap-4 h-full">
            {participants.map((participant, index) => (
              <Card
                key={index}
                className="relative bg-slate-800 border-slate-700 flex items-center justify-center overflow-hidden group"
              >
                {/* Video placeholder with avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`${participant.color} w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold`}>
                    {participant.initial}
                  </div>
                </div>

                {/* Participant info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">{participant.name}</p>
                      <p className="text-slate-300 text-xs">{participant.role}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-slate-700/50 rounded-full flex items-center justify-center">
                        <Mic className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Speaking indicator */}
                {index === activeSpeaker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 border-3 border-green-500 rounded-lg pointer-events-none shadow-lg shadow-green-500/50"
                    style={{ borderWidth: '3px' }}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Live Captions */}
        <div className="bg-black/60 backdrop-blur-sm px-6 py-3 border-t border-slate-700 min-h-[80px]">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 shrink-0">
              LIVE
            </Badge>
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTranscriptIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-white text-sm"
                >
                  <span className={`${currentTranscript.speakerColor} font-semibold`}>
                    {currentTranscript.speaker}:
                  </span>{" "}
                  {currentTranscript.text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Teams Controls Bar */}
        <div className="bg-slate-900 border-t border-slate-700 p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Mic className="h-5 w-5" />
              </div>
              <span className="text-xs">Unmute</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <span className="text-xs">Camera</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Monitor className="h-5 w-5" />
              </div>
              <span className="text-xs">Share</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-950/20"
            >
              <div className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center">
                <PhoneOff className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs">Leave</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
