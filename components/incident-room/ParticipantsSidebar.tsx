"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoomParticipant } from "@/lib/types/incidentRoom";

interface ParticipantsSidebarProps {
  participants: RoomParticipant[];
}

export function ParticipantsSidebar({ participants }: ParticipantsSidebarProps) {
  const roleBadgeColor = {
    mssp_analyst: "bg-blue-500",
    ciso: "bg-purple-500",
    legal: "bg-green-500",
    hr: "bg-orange-500",
    forensics: "bg-red-500",
    observer: "bg-gray-500",
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          👥 Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.userId} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                {participant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{participant.name}</p>
                <Badge className={`${roleBadgeColor[participant.role]} text-white text-xs mt-1`}>
                  {participant.role.replace('_', ' ').toUpperCase()}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {participant.organization === 'mssp' ? 'MSSP' : 'Client'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
