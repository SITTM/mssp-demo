"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";
import { RoomParticipant } from "@/lib/types/incidentRoom";
import { createWorkroomFromNotable } from "@/lib/services/workroomCreation";
import { CheckCircle2, Clock, FileText, Loader2, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkroomCreationStep3Props {
  notable: UrgentNotable;
  participants: RoomParticipant[];
  onFinalize: (roomId: string) => void;
  onBack: () => void;
}

interface EvidenceItem {
  item: string;
  collected: boolean;
}

interface PendingApproval {
  item: string;
  approver: string;
}

export function WorkroomCreationStep3({
  notable,
  participants,
  onFinalize,
  onBack,
}: WorkroomCreationStep3Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  const autoCollectedEvidence: EvidenceItem[] = [
    { item: "DLP alert logs (last 7 days)", collected: true },
    { item: "User access patterns (90-day baseline)", collected: true },
    { item: "File download history", collected: true },
    { item: "Email metadata (subject lines only)", collected: true },
    { item: "VPN connection logs", collected: true },
    { item: "Active Directory logs", collected: true },
  ];

  const pendingApprovalItems: PendingApproval[] = [
    { item: "Full email content", approver: "Legal Counsel" },
    { item: "HR performance records", approver: "HR Director" },
    { item: "Device forensic snapshot", approver: "CISO" },
  ];

  const handleFinalize = async () => {
    setIsCreating(true);
    setCreationProgress(0);

    // Simulate progressive creation
    const progressSteps = [
      { progress: 20, delay: 300 },
      { progress: 40, delay: 500 },
      { progress: 60, delay: 400 },
      { progress: 80, delay: 500 },
      { progress: 100, delay: 300 },
    ];

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setCreationProgress(step.progress);
    }

    // Create the workroom
    const incidentRoom = createWorkroomFromNotable(notable, participants);
    setCreatedRoomId(incidentRoom.id);

    // Show success animation
    setIsComplete(true);

    // Auto-redirect after 1.5 seconds
    setTimeout(() => {
      onFinalize(incidentRoom.id);
    }, 1500);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Evidence Auto-Collection Preview</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Review evidence that will be collected automatically and items requiring approval
        </p>
      </div>

      {/* Auto-Collected Evidence */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h4 className="font-semibold">Auto-Collected Evidence</h4>
          <Badge variant="secondary" className="text-xs">
            Ready
          </Badge>
        </div>

        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="space-y-2">
            {autoCollectedEvidence.map((evidence, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{evidence.item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Approval Items */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          <h4 className="font-semibold">Pending Approval</h4>
          <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-500">
            Requires Authorization
          </Badge>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-950/10 p-4">
          <div className="space-y-3">
            {pendingApprovalItems.map((pending, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>{pending.item}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Awaiting: {pending.approver}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Estimate */}
      <Alert>
        <AlertTitle className="text-sm font-semibold">Creation Timeline</AlertTitle>
        <AlertDescription className="text-sm">
          <div className="space-y-1 mt-2">
            <p>✓ Incident room ready in ~30 seconds</p>
            <p>✓ Participants auto-invited via email</p>
            <p>⏳ Approval requests sent to designated approvers</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Creation Progress */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 rounded-lg border border-blue-500/30 bg-blue-950/10 p-4"
          >
            <div className="flex items-center gap-2">
              {!isComplete ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : (
                <CheckCheck className="h-5 w-5 text-green-500" />
              )}
              <span className="font-semibold">
                {!isComplete ? "Creating Incident Room..." : "Incident Room Created!"}
              </span>
            </div>

            <Progress value={creationProgress} className="h-2" />

            {isComplete && createdRoomId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm space-y-1"
              >
                <p className="text-green-500 font-medium">
                  ✓ Room ID: {createdRoomId}
                </p>
                <p className="text-muted-foreground">Redirecting to incident room...</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {!isCreating && (
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <Button variant="default" onClick={handleFinalize} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Finalize & Create Incident Room
          </Button>
        </div>
      )}
    </div>
  );
}
