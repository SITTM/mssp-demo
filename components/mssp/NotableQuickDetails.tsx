"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Info, Lock } from "lucide-react";
import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";
import { motion, AnimatePresence } from "framer-motion";

interface NotableQuickDetailsProps {
  notable: UrgentNotable;
  isOpen: boolean;
  onToggle: () => void;
  onViewFullDetails: () => void;
  onTriageClick: () => void;
  onDismissClick: () => void;
}

export function NotableQuickDetails({
  notable,
  isOpen,
  onToggle,
  onViewFullDetails,
  onTriageClick,
  onDismissClick,
}: NotableQuickDetailsProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="font-medium">
            {isOpen ? "Hide Quick Details" : "View Quick Details"}
          </span>
        </Button>
      </CollapsibleTrigger>
      <AnimatePresence>
        {isOpen && (
          <CollapsibleContent forceMount>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 border rounded-lg bg-background/50 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Info className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-sm">QUICK DETAILS (Privacy-Protected View)</h3>
                </div>

                {/* Notable Summary */}
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Notable Summary</h4>
                  <div className="space-y-1 text-xs">
                    <p>
                      <span className="font-medium">Source System:</span> {notable.sourceSystem}
                    </p>
                    <p>
                      <span className="font-medium">Alert ID:</span> {notable.alertId}
                    </p>
                    <p>
                      <span className="font-medium">Timestamp:</span>{" "}
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
                  </div>
                </div>

                {/* Risk Indicators */}
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Risk Indicators (Behavioral Patterns Only):</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    <li>
                      Risk score: {notable.riskIndicators.riskScore}/100 (increased{" "}
                      {Math.round(
                        ((notable.riskIndicators.riskScore - notable.riskIndicators.baseline) /
                          notable.riskIndicators.baseline) *
                          100
                      )}
                      % in 24 hours)
                    </li>
                    <li>Baseline risk: {notable.riskIndicators.baseline}/100 (last 90-day average)</li>
                    <li>Trigger event: {notable.riskIndicators.triggerEvent}</li>
                    <li>Data volume: {notable.riskIndicators.dataVolume}</li>
                    <li>Destination: {notable.riskIndicators.destination}</li>
                    <li>Access method: {notable.riskIndicators.accessMethod}</li>
                    <li>Device: {notable.riskIndicators.device}</li>
                  </ul>
                </div>

                {/* Contextual Flags */}
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Contextual Flags (from {notable.sourceSystem.split(" ")[0]}):</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    <li>
                      Recent organizational change:{" "}
                      <span className="font-semibold">
                        {notable.contextualFlags.organizationalChange ? "YES" : "NO"}
                      </span>{" "}
                      {notable.contextualFlags.organizationalChange && "(within 7 days)"}
                    </li>
                    <li className="flex items-center gap-1">
                      Performance review flag:{" "}
                      <span className="text-muted-foreground italic flex items-center gap-1">
                        {notable.contextualFlags.performanceReview}{" "}
                        {notable.contextualFlags.performanceReview.includes("REDACTED") && (
                          <Lock className="h-3 w-3" />
                        )}
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      Departure risk indicator:{" "}
                      <span className="text-muted-foreground italic flex items-center gap-1">
                        {notable.contextualFlags.departureRisk}{" "}
                        {notable.contextualFlags.departureRisk.includes("REDACTED") && (
                          <Lock className="h-3 w-3" />
                        )}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* User Identity (Privacy-Protected) */}
                <div className="space-y-2 text-sm bg-muted/50 p-3 rounded">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    User Identity (Privacy-Protected):
                  </h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2 text-muted-foreground">
                    <li className="flex items-center gap-1">
                      User ID: <span className="italic">[REDACTED] 🔒</span>
                    </li>
                    <li className="flex items-center gap-1">
                      Name: <span className="italic">[REDACTED] 🔒</span>
                    </li>
                    <li className="flex items-center gap-1">
                      Job Title: <span className="italic">[REDACTED] 🔒</span>
                    </li>
                    <li className="flex items-center gap-1">
                      Department: <span className="italic">[REDACTED] 🔒</span>
                    </li>
                    <li className="flex items-center gap-1">
                      Seniority Level: <span className="italic">[REDACTED] 🔒</span>
                    </li>
                  </ul>
                </div>

                {/* Privacy Notice */}
                <Alert variant="info">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-semibold">Privacy Notice:</AlertTitle>
                  <AlertDescription className="text-xs space-y-1">
                    <p>
                      <span className="font-medium">{notable.clientName}&apos;s privacy settings:</span>{" "}
                      &quot;{notable.privacySettings.tier === "strict" && "Mask PII until workroom created"}&quot;
                    </p>
                    <p>
                      <span className="font-medium">Geo:</span> {notable.privacySettings.geo}
                    </p>
                    <p>
                      <span className="font-medium">Config:</span> Per-client override (stricter than US
                      default)
                    </p>
                    <p className="pt-2 border-t">User details will be revealed to authorized stakeholders when:</p>
                    <ul className="list-disc list-inside pl-2">
                      <li>MSSP analyst creates triage workroom, AND</li>
                      <li>Client CISO approves workroom access</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Client Notification Status */}
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Client Notification Status:</h4>
                  <div className="space-y-1 text-xs">
                    {notable.clientNotification.notified && (
                      <>
                        <p className="flex items-center gap-1">
                          ✅ CISO notified at{" "}
                          {notable.clientNotification.notifiedAt?.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          (email + platform alert)
                        </p>
                        {notable.clientNotification.acknowledged && (
                          <p className="flex items-center gap-1">
                            ✅ CISO acknowledged notification at{" "}
                            {notable.clientNotification.acknowledgedAt?.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </>
                    )}
                    <p className="flex items-center gap-1">
                      ⏸️ {notable.clientNotification.waitingFor || "Awaiting MSSP triage"}
                    </p>
                  </div>
                </div>

                {/* Recommended Triage Steps */}
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Recommended Triage Steps:</h4>
                  <ol className="space-y-1 text-xs list-decimal list-inside pl-2">
                    <li>Create triage workroom (auto-invites: CISO, Legal, HR)</li>
                    <li>MSSP analyst + CISO review together (user identity revealed)</li>
                    <li>Assess: Is this incident or false positive?</li>
                    <li>If incident → Escalate to full investigation workroom</li>
                    <li>If false positive → Tune Foresight threshold, dismiss</li>
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="default" size="sm" onClick={onViewFullDetails} className="flex-1">
                    📋 View Full Technical Details
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="default" size="sm" onClick={onTriageClick} className="flex-1">
                    Triage & Create Incident Room
                  </Button>
                  <Button variant="outline" size="sm" onClick={onDismissClick} className="flex-1">
                    Dismiss as False Positive
                  </Button>
                </div>
              </div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}
