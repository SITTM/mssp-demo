"use client";

import { useState, useEffect, use } from "react";
import { RoomHeader } from "@/components/incident-room/RoomHeader";
import { RoomTimeline } from "@/components/incident-room/RoomTimeline";
import { EvidenceLocker } from "@/components/incident-room/EvidenceLocker";
import { ParticipantsSidebar } from "@/components/incident-room/ParticipantsSidebar";
import { PrivacyControls } from "@/components/incident-room/PrivacyControls";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IncidentRoom } from "@/lib/types/incidentRoom";
import { loadIncidentRoom } from "@/lib/mockData/incidentRoomMockData";

interface IncidentRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function IncidentRoomPage({ params }: IncidentRoomPageProps) {
  const { roomId } = use(params);
  const [room, setRoom] = useState<IncidentRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedRoom = loadIncidentRoom(roomId);
    setRoom(loadedRoom);
    setLoading(false);
  }, [roomId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-pulse">🚨</div>
          <p className="text-lg font-semibold">Loading Incident Room...</p>
          <p className="text-sm text-muted-foreground">Room ID: {roomId}</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <CardContent className="text-center space-y-3">
            <div className="text-4xl">❌</div>
            <h1 className="text-2xl font-bold text-red-600">Incident Room Not Found</h1>
            <p className="text-muted-foreground">Room ID: {roomId}</p>
            <p className="text-sm">
              This room may have been deleted or the ID is incorrect.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Room Header */}
        <RoomHeader room={room} onRoomUpdate={setRoom} />

        {/* Privacy Banner (if identity still redacted) */}
        {!room.metadata.affectedUser.revealed && (
          <Card className="border-yellow-500 bg-yellow-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500 text-white">🔒 PRIVACY PROTECTED</Badge>
                <p className="text-sm">
                  User identity is currently <strong>REDACTED</strong> (shown as{" "}
                  <code className="bg-yellow-100 px-1 py-0.5 rounded">
                    {room.metadata.affectedUser.pseudonym}
                  </code>
                  ). CISO can approve disclosure when &quot;reasonable suspicion&quot; threshold is met.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Timeline + Evidence (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <RoomTimeline timeline={room.timeline} />
            <EvidenceLocker evidence={room.evidence} roomStage={room.stage} />
          </div>

          {/* Right Column: Participants + Privacy Controls (1/3 width) */}
          <div className="space-y-6">
            <ParticipantsSidebar participants={room.participants} />
            <PrivacyControls room={room} onRoomUpdate={setRoom} />
          </div>
        </div>
      </div>
    </div>
  );
}
