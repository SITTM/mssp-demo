"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EvidenceItem, RoomStage } from "@/lib/types/incidentRoom";

interface EvidenceLockerProps {
  evidence: EvidenceItem[];
  roomStage: RoomStage;
}

export function EvidenceLocker({ evidence, roomStage }: EvidenceLockerProps) {
  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            📁 Evidence Locker ({evidence.length} items)
          </CardTitle>
          <Button variant="outline" size="sm">
            Upload Evidence
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {evidence.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No evidence uploaded yet.</p>
            <p className="text-xs mt-2">
              Upload DLP alerts, emails, forensic images, or other evidence to build the case.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {evidence.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.fileSize} bytes · {item.category} · Uploaded by {item.uploadedBy.name}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
