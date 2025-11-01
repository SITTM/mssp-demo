"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";
import { RoomParticipant } from "@/lib/types/incidentRoom";
import { WorkroomCreationStep1 } from "./WorkroomCreationStep1";
import { WorkroomCreationStep2 } from "./WorkroomCreationStep2";

interface WorkroomCreationModalProps {
  notable: UrgentNotable | null;
  isOpen: boolean;
  onClose: () => void;
  onWorkroomCreated: (roomId: string) => void;
}

export function WorkroomCreationModal({
  notable,
  isOpen,
  onClose,
  onWorkroomCreated,
}: WorkroomCreationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedParticipants, setSelectedParticipants] = useState<RoomParticipant[]>([]);

  if (!notable) return null;

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedParticipants([]);
    onClose();
  };

  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  const handleStep2Continue = (participants: RoomParticipant[]) => {
    setSelectedParticipants(participants);
    // Step 3 removed - participants selection now finalizes in Step 2
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleFinalize = (roomId: string) => {
    handleClose();
    onWorkroomCreated(roomId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={currentStep === 2 ? "max-w-[95vw] max-h-[95vh] overflow-hidden" : "max-w-3xl max-h-[90vh] overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Incident Room</span>
            <span className="text-sm font-normal text-muted-foreground">
              Step {currentStep} of 2
            </span>
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Review incident summary and privacy notice"}
            {currentStep === 2 && "Select participants and finalize incident room creation"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 1 && (
          <WorkroomCreationStep1
            notable={notable}
            onContinue={handleStep1Continue}
            onCancel={handleClose}
          />
        )}

        {currentStep === 2 && (
          <WorkroomCreationStep2
            notable={notable}
            onContinue={handleStep2Continue}
            onFinalize={handleFinalize}
            onBack={handleStep2Back}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
