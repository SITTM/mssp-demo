"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { IncidentRoom, TimelineEvent } from "@/lib/types/incidentRoom";
import { updateIncidentRoom } from "@/lib/mockData/incidentRoomMockData";

interface PrivacyControlsProps {
  room: IncidentRoom;
  onRoomUpdate?: (room: IncidentRoom) => void;
}

export function PrivacyControls({ room, onRoomUpdate }: PrivacyControlsProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { affectedUser } = room.metadata;

  const handleRequestDisclosure = () => {
    setShowApprovalDialog(true);
  };

  const handleSubmitRequest = async () => {
    if (!justification.trim() || justification.length < 50) {
      alert("Please provide justification of at least 50 characters for identity disclosure");
      return;
    }

    setIsSubmitting(true);

    // MVP: Simulate approval (in production: POST to /api/approvals)
    setTimeout(() => {
      // Auto-approve for demo (in production: wait for CISO approval)
      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date(),
        type: 'approval',
        actor: {
          userId: 'ciso-001',
          name: 'Michael Chen',
          role: 'ciso',
        },
        description: `Identity disclosed: ${room.metadata.affectedUser.pseudonym} → Jennifer Park (Finance)`,
        metadata: {
          approvalType: 'identity_disclosure',
          justification: justification,
        },
      };

      const updatedRoom: IncidentRoom = {
        ...room,
        metadata: {
          ...room.metadata,
          affectedUser: {
            ...room.metadata.affectedUser,
            revealed: true,
            realIdentity: {
              name: "Jennifer Park",
              email: "jennifer.park@northstar.com",
              department: "Finance",
              revealedAt: new Date(),
              revealedBy: "Michael Chen (CISO)",
              justification: justification,
            },
          },
        },
        timeline: [
          ...room.timeline,
          newEvent,
        ],
      };

      // Update localStorage
      updateIncidentRoom(updatedRoom);

      // Reload page to show updated state
      window.location.reload();
    }, 2000);
  };

  return (
    <Card className="shadow-sm border border-yellow-500">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span>🔒</span>
          <span>Privacy Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Identity Status */}
        <div>
          <h4 className="text-sm font-semibold mb-2">User Identity</h4>
          {!affectedUser.revealed ? (
            <div className="space-y-2">
              <div className="p-3 border rounded-lg bg-yellow-50/50">
                <p className="text-sm font-mono">
                  🔒 {affectedUser.pseudonym}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Identity REDACTED for privacy)
                </p>
              </div>

              {!showApprovalDialog ? (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleRequestDisclosure}
                  >
                    Request Identity Disclosure (CISO Approval)
                  </Button>

                  <p className="text-xs text-muted-foreground italic">
                    CISO must approve disclosure when &quot;reasonable suspicion&quot; threshold is met
                  </p>
                </>
              ) : (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                  <h5 className="text-sm font-semibold">
                    Submit Approval Request to CISO
                  </h5>

                  <div>
                    <label className="text-xs font-medium">
                      Legal Justification (required):
                    </label>
                    <Textarea
                      placeholder="Example: 'Reasonable suspicion established - 47GB data exfiltration to personal Dropbox account. Evidence: DLP alert + forensic log correlation. Justifies disclosure under GDPR legitimate interest (security incident investigation).'"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      className="mt-1 text-sm"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 50 characters (currently: {justification.length})
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSubmitRequest}
                      disabled={isSubmitting || justification.length < 50}
                      className="flex-1"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApprovalDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>

                  {isSubmitting && (
                    <p className="text-xs text-muted-foreground italic">
                      Requesting CISO approval... (Auto-approved for demo in 2 seconds)
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 border rounded-lg bg-green-50/50">
                <p className="text-sm font-semibold">
                  ✅ {affectedUser.realIdentity?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {affectedUser.realIdentity?.email} · {affectedUser.realIdentity?.department}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Disclosed by {affectedUser.realIdentity?.revealedBy} on{" "}
                {affectedUser.realIdentity?.revealedAt.toLocaleString()}
              </p>
              <p className="text-xs italic border-l-2 border-green-500 pl-2">
                Justification: {affectedUser.realIdentity?.justification}
              </p>
            </div>
          )}
        </div>

        {/* HR Records Access */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">HR Records</h4>
          <Badge variant="secondary" className="text-xs">🔒 LOCKED</Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Requires Legal approval (GDPR Article 9 - Special Category Data)
          </p>
          <Button variant="outline" size="sm" className="w-full mt-2" disabled>
            Request HR Data Access (Legal Approval)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
