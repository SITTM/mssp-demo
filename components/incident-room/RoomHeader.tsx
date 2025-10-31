"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { IncidentRoom } from "@/lib/types/incidentRoom";

interface RoomHeaderProps {
  room: IncidentRoom;
  onRoomUpdate?: (room: IncidentRoom) => void;
}

export function RoomHeader({ room }: RoomHeaderProps) {
  const router = useRouter();

  const stageBadgeColor = {
    triage: "bg-blue-500",
    containment: "bg-orange-500",
    investigation: "bg-purple-500",
    remediation: "bg-green-500",
    closed: "bg-gray-500",
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <button
            onClick={() => router.push('/mssp-demo')}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Portfolio Dashboard</span>
          </button>
          <span>/</span>
          <span>Incident Room {room.id}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">🚨</span>
              <span>Incident Room: {room.id}</span>
              <Badge className={`${stageBadgeColor[room.stage]} text-white`}>
                {room.stage.toUpperCase()}
              </Badge>
            </CardTitle>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>Client:</strong> {room.clientName}
              </p>
              <p>
                <strong>Incident Type:</strong> {room.metadata.incidentType}
              </p>
              <p>
                <strong>Risk Score:</strong>{" "}
                <span className="text-red-600 font-bold">{room.metadata.riskScore}/100</span>
              </p>
              <p>
                <strong>Created:</strong> {room.createdAt.toLocaleString()} by {room.createdBy.name}
              </p>
            </div>
          </div>

          {/* Action Buttons (Placeholder for Phase 2) */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Invite Participant
            </Button>
            <Button variant="outline" size="sm">
              Templates
            </Button>
            {room.stage !== 'closed' && (
              <Button variant="destructive" size="sm">
                Close Room
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
