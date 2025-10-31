"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Lock, X } from "lucide-react";
import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";

interface NotableTechnicalDetailsModalProps {
  notable: UrgentNotable | null;
  isOpen: boolean;
  onClose: () => void;
  onTriageClick: () => void;
  onDismissClick: () => void;
}

export function NotableTechnicalDetailsModal({
  notable,
  isOpen,
  onClose,
  onTriageClick,
  onDismissClick,
}: NotableTechnicalDetailsModalProps) {
  if (!notable) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                NOTABLE DETAILS - FULL TECHNICAL VIEW
              </DialogTitle>
              <DialogDescription className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Client:</span> {notable.clientName}
                </p>
                <p>
                  <span className="font-medium">Notable ID:</span> {notable.alertId}
                </p>
                <p>
                  <span className="font-medium">Detected:</span>{" "}
                  {notable.detectedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  {notable.detectedAt.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZoneName: "short",
                  })}
                </p>
                <p>
                  <span className="font-medium">Risk Score:</span>{" "}
                  <span className="text-red-600 font-bold">
                    {notable.riskScore}/100 (
                    {notable.riskScore >= 80 ? "CRITICAL" : "HIGH"})
                  </span>
                </p>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-200px)] px-6">
          <div className="space-y-6 py-4">
            {/* Timeline Reconstruction */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-base">TIMELINE RECONSTRUCTION (Automated)</h3>
              </div>
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                {notable.timeline.map((event, index) => (
                  <div key={index} className="relative pl-6 pb-3">
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-blue-500 -translate-x-[1.4rem]" />
                    <div className="text-xs text-muted-foreground font-medium mb-1">
                      {event.timestamp.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {event.timestamp.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                    <p className="text-sm">
                      {event.description}
                      {event.isRedacted && <Lock className="inline-block h-3 w-3 ml-1" />}
                    </p>
                    {event.type === "trigger" && (
                      <Badge variant="destructive" className="mt-1 text-xs">
                        Trigger Event
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Evidence Collected */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-base">
                  EVIDENCE COLLECTED (Auto-Collected by Integrations)
                </h3>
              </div>
              <div className="space-y-2">
                {notable.evidence.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {item.collected ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span>
                      {item.name}
                      {item.requiresConsent && !item.collected && (
                        <span className="text-xs text-muted-foreground italic ml-2">
                          (awaiting workroom approval)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Risk Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Badge variant="destructive" className="h-5">
                  AI
                </Badge>
                <h3 className="font-semibold text-base">RISK ANALYSIS (Foresight AI Assessment)</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">
                    Confidence: {notable.riskAnalysis.confidence}% Insider Threat{" "}
                    {notable.riskAnalysis.confidence >= 90 ? "(High Confidence)" : "(Medium Confidence)"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Contributing Factors:</h4>
                  <div className="space-y-3">
                    {notable.riskAnalysis.factors.map((factor, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{factor.name}</span>
                          <span className="font-semibold">{factor.weight}%</span>
                        </div>
                        <Progress value={factor.weight} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Recommended Actions:</h4>
                  <ol className="space-y-1 text-sm list-decimal list-inside pl-2">
                    {notable.riskAnalysis.recommendedActions.map((action, index) => (
                      <li key={index}>
                        {action.startsWith("URGENT") && (
                          <Badge variant="destructive" className="mr-1 text-xs">
                            URGENT
                          </Badge>
                        )}
                        {action.startsWith("HIGH") && (
                          <Badge className="mr-1 text-xs bg-orange-500">HIGH</Badge>
                        )}
                        {action.startsWith("MEDIUM") && (
                          <Badge variant="secondary" className="mr-1 text-xs">
                            MEDIUM
                          </Badge>
                        )}
                        {action.replace(/^(URGENT|HIGH|MEDIUM):\s*/, "")}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Lock className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-base">
                  PRIVACY SETTINGS ({notable.clientName})
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p>
                    <span className="font-medium">Client Privacy Tier:</span>{" "}
                    <Badge variant="secondary">{notable.privacySettings.tier.toUpperCase()}</Badge>{" "}
                    (Custom - stricter than US default)
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Geo:</span> {notable.privacySettings.geo}
                  </p>
                  <p>
                    <span className="font-medium">Configured During:</span>{" "}
                    {notable.privacySettings.configuredDuring}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">PII Masking Rules:</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    <li>
                      User identity (name, email, ID):{" "}
                      {notable.privacySettings.maskingRules.userIdentity ? (
                        <span className="font-semibold text-red-600">MASKED until workroom created</span>
                      ) : (
                        "VISIBLE"
                      )}
                    </li>
                    <li>
                      Job title/role:{" "}
                      {notable.privacySettings.maskingRules.jobTitle ? (
                        <span className="font-semibold text-red-600">MASKED until workroom created</span>
                      ) : (
                        "VISIBLE"
                      )}
                    </li>
                    <li>
                      Department:{" "}
                      {notable.privacySettings.maskingRules.department ? (
                        <span className="font-semibold text-red-600">MASKED until workroom created</span>
                      ) : (
                        "VISIBLE"
                      )}
                    </li>
                    <li>
                      Behavioral data (risk score, volume, timing):{" "}
                      <span className="font-semibold text-green-600">VISIBLE to MSSP</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Client Notification Rules:</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    <li>
                      Foresight notable (risk &gt;80):{" "}
                      <span className="font-semibold">
                        {notable.privacySettings.notificationRules.foresightHighRisk === "immediate"
                          ? "Notify CISO immediately (parallel)"
                          : "MSSP triages first"}
                      </span>
                    </li>
                    <li>
                      UEBA notable (risk &lt;80):{" "}
                      <span className="font-semibold">
                        {notable.privacySettings.notificationRules.uebaMediumRisk === "immediate"
                          ? "Notify CISO immediately"
                          : "MSSP triages first, notify if confirmed"}
                      </span>
                    </li>
                    <li>
                      DLP incident:{" "}
                      <span className="font-semibold">
                        Notify CISO + Legal immediately (regulatory requirement)
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Workroom Access Authorization:</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    <li>
                      PII revealed when:{" "}
                      <span className="font-semibold">
                        {notable.privacySettings.workroomAccessRules.piiRevealedWhen}
                      </span>
                    </li>
                    <li>
                      Authorized roles:{" "}
                      <span className="font-semibold">
                        {notable.privacySettings.workroomAccessRules.authorizedRoles.join(", ")}
                      </span>
                    </li>
                    <li>
                      Audit trail:{" "}
                      <span className="font-semibold">All PII access logged (compliance requirement)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 px-6 py-4 border-t">
          <Button variant="default" onClick={onTriageClick} className="flex-1">
            Triage & Create Workroom
          </Button>
          <Button variant="outline" onClick={onDismissClick} className="flex-1">
            Dismiss
          </Button>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
