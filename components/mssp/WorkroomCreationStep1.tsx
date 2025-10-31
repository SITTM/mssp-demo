"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";
import { Lock, AlertTriangle } from "lucide-react";

interface WorkroomCreationStep1Props {
  notable: UrgentNotable;
  onContinue: () => void;
  onCancel: () => void;
}

export function WorkroomCreationStep1({
  notable,
  onContinue,
  onCancel,
}: WorkroomCreationStep1Props) {
  // Generate pseudonym once and memoize it so it doesn't change on re-renders
  const userPseudonym = useMemo(() =>
    `USER-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    [] // Empty dependency array means this only runs once
  );

  return (
    <div className="space-y-6 py-4">
      {/* Incident Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Incident Summary</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Client Name</div>
            <div className="font-medium">{notable.clientName}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Risk Score</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">
                {notable.riskScore}/100
              </span>
              {notable.riskScore >= 80 && (
                <Badge variant="destructive">CRITICAL</Badge>
              )}
              {notable.riskScore >= 60 && notable.riskScore < 80 && (
                <Badge className="bg-orange-600 text-white">HIGH</Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Alert Type</div>
            <div className="text-sm">{notable.notableType}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Detected At</div>
            <div className="text-sm">
              {notable.detectedAt.toLocaleDateString()} at{" "}
              {notable.detectedAt.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Behavior Summary */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <h4 className="text-sm font-semibold">Behavior Summary</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Trigger Event:</span>
            <p className="text-muted-foreground mt-1">{notable.trigger}</p>
          </div>
          <div>
            <span className="font-medium">Key Indicators:</span>
            <ul className="list-disc list-inside pl-2 mt-1 text-muted-foreground space-y-1">
              <li>{notable.riskIndicators.triggerEvent}</li>
              <li>Data volume: {notable.riskIndicators.dataVolume}</li>
              <li>Destination: {notable.riskIndicators.destination}</li>
              <li>Access method: {notable.riskIndicators.accessMethod}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Privacy-Protected User Identity */}
      <div className="rounded-lg border-2 border-yellow-500/30 bg-yellow-950/20 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-yellow-500" />
          <h4 className="text-sm font-semibold">Privacy-Protected User Identity</h4>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">User Pseudonym:</span>
            <Badge variant="outline" className="font-mono">
              {userPseudonym}
            </Badge>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <Alert variant="default" className="border-yellow-500/50 bg-yellow-950/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle>Privacy Protection Notice</AlertTitle>
        <AlertDescription className="text-sm">
          <p className="font-medium">
            User identity will remain REDACTED until CISO approval
          </p>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="default" onClick={onContinue}>
          Continue to Participant Selection →
        </Button>
      </div>
    </div>
  );
}
