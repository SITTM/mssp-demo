"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";
import { Lock } from "lucide-react";

interface NotableAlertModalProps {
  notable: UrgentNotable;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex: number;
  totalCount: number;
  onTriageClick?: () => void;
}

export function NotableAlertModal({
  notable,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  currentIndex,
  totalCount,
  onTriageClick,
}: NotableAlertModalProps) {
  const getSeverityBadge = () => {
    if (notable.riskScore >= 80) {
      return <Badge variant="destructive">CRITICAL</Badge>;
    } else if (notable.riskScore >= 60) {
      return <Badge className="bg-orange-600 text-white">HIGH</Badge>;
    } else {
      return <Badge className="bg-yellow-600 text-white">MEDIUM</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Badge variant="destructive">🔴 URGENT NOTABLE</Badge>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {totalCount}
            </span>
          </DialogTitle>
          <DialogDescription>
            High-risk user threshold exceeded - Requires immediate triage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Client & Risk Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{notable.clientName}</h3>
              <Badge variant="outline">
                Maturity: {notable.maturityScore.score.toFixed(1)}/5.0
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">Risk Score:</span>
              <span className="text-2xl font-bold text-red-600">
                {notable.riskScore}/100
              </span>
              {getSeverityBadge()}
            </div>
          </div>

          {/* Notable Details */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Type:</span>
              <p className="text-sm">{notable.notableType}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Detected:</span>
              <p className="text-sm">
                {notable.detectedAt.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                today
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Trigger:</span>
              <p className="text-sm">{notable.trigger}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Source:</span>
              <p className="text-sm">{notable.sourceSystem}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Alert ID:</span>
              <p className="text-sm font-mono">{notable.alertId}</p>
            </div>
          </div>

          {/* Privacy Notice */}
          <Alert variant="default" className="border-yellow-500/50 bg-yellow-950/20">
            <Lock className="h-4 w-4" />
            <AlertTitle>Privacy Protected</AlertTitle>
            <AlertDescription className="text-xs">
              User identity masked until workroom created. Only behavioral data visible to MSSP.
            </AlertDescription>
          </Alert>

          {/* Client Notification Status */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-3">
            <div className="text-sm font-semibold mb-2">Client Notification:</div>
            {notable.clientNotification.notified ? (
              <div className="text-xs space-y-1">
                <p>
                  ✅ CISO notified at{" "}
                  {notable.clientNotification.notifiedAt?.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                {notable.clientNotification.acknowledged && (
                  <p>
                    ✅ CISO acknowledged at{" "}
                    {notable.clientNotification.acknowledgedAt?.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xs">
                ⏸️ MSSP triage first - CISO will be notified if confirmed
              </div>
            )}
          </div>

          {/* Client Configuration */}
          <div className="rounded-lg border bg-slate-950/50 p-3">
            <div className="text-xs font-semibold mb-1 text-muted-foreground">
              Client Configuration:
            </div>
            <p className="text-xs">{notable.clientConfig}</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={currentIndex === 0}
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={currentIndex === totalCount - 1}
            >
              Next →
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={onTriageClick}>
              Triage & Create Incident Room
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
