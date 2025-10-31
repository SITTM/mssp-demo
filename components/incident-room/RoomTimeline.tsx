"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineEvent } from "@/lib/types/incidentRoom";

interface RoomTimelineProps {
  timeline: TimelineEvent[];
}

export function RoomTimeline({ timeline }: RoomTimelineProps) {
  const eventIcons = {
    alert: "🚨",
    approval: "✅",
    containment: "🔒",
    evidence_added: "📎",
    comment: "💬",
    stage_change: "🔄",
  };

  const renderEventDetails = (event: TimelineEvent) => {
    if (event.type === 'approval' && event.metadata && 'approvalType' in event.metadata && event.metadata.approvalType === 'identity_disclosure') {
      const justification = 'justification' in event.metadata ? String(event.metadata.justification) : '';
      return (
        <div className="mt-2 p-3 border-l-4 border-green-500 bg-green-50/50 rounded-r">
          <p className="text-xs font-semibold text-green-700 mb-1">
            ✅ Identity Disclosure Approved
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Legal Justification:</strong> {justification}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>GDPR Basis:</strong> Legitimate Interest (Art. 6(1)(f)) - Security incident investigation
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          📅 Incident Timeline ({timeline.length} events)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((event) => (
            <div key={event.id} className="flex gap-3 pb-4 border-b last:border-0">
              <div className="text-2xl">{eventIcons[event.type]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">
                    {event.timestamp.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {event.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    by {event.actor.name} ({event.actor.role.replace('_', ' ')})
                  </span>
                </div>
                <p className="text-sm">{event.description}</p>

                {/* Render event-specific details */}
                {renderEventDetails(event)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
