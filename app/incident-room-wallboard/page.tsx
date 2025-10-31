"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { searchSpecialists, getSpecialistsByIncidentType } from "@/lib/data/specialist-profiles";
import { SpecialistSplitView } from "@/components/mssp/SpecialistSplitView";
import { Shield, Users, Building2, Clock, AlertTriangle } from "lucide-react";
import { loadIncidentRoom } from "@/lib/services/workroomCreation";
import { IncidentRoom } from "@/lib/types/incidentRoom";

export default function IncidentRoomWallboardPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [room, setRoom] = useState<IncidentRoom | null>(null);
  const [searchTerm, setSearchTerm] = useState("Insider Threat");
  const [searchResults, setSearchResults] = useState(() =>
    getSpecialistsByIncidentType("Insider Threat")
  );
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // Load incident room data if roomId is provided
  useEffect(() => {
    if (roomId) {
      const loadedRoom = loadIncidentRoom(roomId);
      setRoom(loadedRoom);
      if (loadedRoom) {
        setSearchTerm(loadedRoom.metadata.incidentType);
        const specialists = getSpecialistsByIncidentType(loadedRoom.metadata.incidentType);
        setSearchResults(specialists);
      }
    }
  }, [roomId]);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchSpecialists(term);
      setSearchResults(results);
    } else {
      const specialists = getSpecialistsByIncidentType("Insider Threat");
      setSearchResults(specialists);
    }
  };

  const toggleSpecialist = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              {room ? `Incident Room: ${room.id}` : "Incident Room Setup - Split Screen View"}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>MSSP & Client Perspectives</span>
              {room && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {room.metadata.incidentType}
                  </span>
                  <span>•</span>
                  <span>{room.clientName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono font-bold text-white">
            {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
          </div>
          <div className="text-xs text-slate-400">
            {currentTime ? currentTime.toLocaleDateString() : 'Loading...'}
          </div>
        </div>
      </div>

      {/* Split Screen - Two Completely Separate Floating Panels */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-120px)]">
        {/* LEFT SIDE - MSSP VIEW */}
        <div className="relative">
          <Card className="h-full flex flex-col border-2 border-blue-500 shadow-2xl shadow-blue-500/20 bg-slate-900/95 backdrop-blur">
            <CardHeader className="border-b border-blue-500/30 bg-blue-950/30 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500/20 p-2">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-blue-400">
                      MSSP Operations View
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-1">
                      Internal specialist search and team coordination
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  MSSP
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden pt-6">
              <div className="h-full flex flex-col">
                {/* MSSP Context Info */}
                <div className="mb-4 p-3 rounded-lg border border-blue-500/20 bg-blue-950/20 shrink-0">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-400 mb-1">
                        MSSP Analyst Perspective
                      </h4>
                      <p className="text-xs text-slate-300">
                        Search internal MSSP specialists, forensic analysts, and team members.
                        Independent expert contact details are <strong>hidden</strong> from this view.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selection Counter */}
                <div className="mb-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">
                      Selected: <span className="text-blue-400 font-bold">{selectedParticipants.length}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Scrollable Specialist List */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <SpecialistSplitView
                    searchResults={searchResults}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    selectedParticipants={selectedParticipants}
                    onToggleSpecialist={toggleSpecialist}
                    viewMode="mssp"
                  />
                </div>
              </div>
            </CardContent>

            {/* MSSP Footer */}
            <div className="border-t border-blue-500/30 p-4 bg-blue-950/20 shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Last updated: {currentTime?.toLocaleTimeString()}</span>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Create Incident Room
                </Button>
              </div>
            </div>
          </Card>

          {/* Floating MSSP Badge */}
          <div className="absolute -top-3 -left-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            MSSP SIDE
          </div>
        </div>

        {/* RIGHT SIDE - CLIENT VIEW */}
        <div className="relative">
          <Card className="h-full flex flex-col border-2 border-purple-500 shadow-2xl shadow-purple-500/20 bg-slate-900/95 backdrop-blur">
            <CardHeader className="border-b border-purple-500/30 bg-purple-950/30 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-2">
                    <Building2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-purple-400">
                      Client Operations View
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-1">
                      Independent expert marketplace with transparent pricing
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  CLIENT
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden pt-6">
              <div className="h-full flex flex-col">
                {/* Client Context Info */}
                <div className="mb-4 p-3 rounded-lg border border-purple-500/20 bg-purple-950/20 shrink-0">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-purple-400 mb-1">
                        Client Organization Perspective
                      </h4>
                      <p className="text-xs text-slate-300">
                        Access independent HR & Legal experts with transparent hourly rates.
                        Bring specialized expertise directly into your incident response.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selection Counter */}
                <div className="mb-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-slate-300">
                      Selected: <span className="text-purple-400 font-bold">{selectedParticipants.length}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Scrollable Specialist List */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <SpecialistSplitView
                    searchResults={searchResults}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    selectedParticipants={selectedParticipants}
                    onToggleSpecialist={toggleSpecialist}
                    viewMode="client"
                  />
                </div>
              </div>
            </CardContent>

            {/* Client Footer */}
            <div className="border-t border-purple-500/30 p-4 bg-purple-950/20 shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Last updated: {currentTime?.toLocaleTimeString()}</span>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Join Incident Room
                </Button>
              </div>
            </div>
          </Card>

          {/* Floating Client Badge */}
          <div className="absolute -top-3 -right-3 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            CLIENT SIDE
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-4 p-3 rounded-lg border border-slate-700 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {room ? (
              <>
                <Badge variant="outline" className="text-xs">
                  {room.stage.toUpperCase()}
                </Badge>
                <span className="text-slate-400">
                  Risk Score: <strong className="text-red-400">{room.metadata.riskScore}/100</strong>
                </span>
                <span className="text-slate-400">
                  Participants: <strong className="text-white">{room.participants.length}</strong>
                </span>
              </>
            ) : (
              <>
                <Badge variant="outline" className="text-xs">
                  Demo Mode
                </Badge>
                <span className="text-slate-400">
                  Incident Type: <strong className="text-white">{searchTerm}</strong>
                </span>
              </>
            )}
          </div>
          <div className="text-slate-400">
            Available Specialists: <strong className="text-white">{searchResults.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
