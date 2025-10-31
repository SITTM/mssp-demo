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
import { WorkroomCreationStep3 } from "./WorkroomCreationStep3";

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
    setCurrentStep(3);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
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
              Step {currentStep} of 3
            </span>
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Review incident summary and privacy notice"}
            {currentStep === 2 && "Select participants and configure access - Split Screen View"}
            {currentStep === 3 && "Review evidence collection and finalize"}
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
            onBack={handleStep2Back}
          />
        )}

        {currentStep === 3 && (
          <WorkroomCreationStep3
            notable={notable}
            participants={selectedParticipants}
            onFinalize={handleFinalize}
            onBack={handleStep3Back}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
