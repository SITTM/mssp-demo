"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Clock, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EvidenceItem {
  item: string;
  collected: boolean;
  collectDelay: number; // milliseconds
}

interface PendingApproval {
  item: string;
  approver: string;
}

export function EvidenceAutoCollection() {
  const [isApproved, setIsApproved] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectedItems, setCollectedItems] = useState<Set<number>>(new Set());
  const [collectingItems, setCollectingItems] = useState<Set<number>>(new Set());

  // Evidence items with staggered collection delays
  const autoCollectedEvidence: EvidenceItem[] = [
    { item: "DLP alert logs (last 7 days)", collected: false, collectDelay: 1200 },
    { item: "User access patterns (90-day baseline)", collected: false, collectDelay: 2400 },
    { item: "File download history", collected: false, collectDelay: 1800 },
    { item: "Email metadata (subject lines only)", collected: false, collectDelay: 3000 },
    { item: "VPN connection logs", collected: false, collectDelay: 2100 },
    { item: "Active Directory logs", collected: false, collectDelay: 2700 },
  ];

  const pendingApprovalItems: PendingApproval[] = [
    { item: "Full email content", approver: "Legal Counsel" },
    { item: "HR performance records", approver: "HR Director" },
    { item: "Device forensic snapshot", approver: "CISO" },
  ];

  const handleApprove = () => {
    setIsApproved(true);
    setIsCollecting(true);

    // Start collecting evidence with staggered timers
    autoCollectedEvidence.forEach((evidence, index) => {
      // Mark as collecting immediately
      setTimeout(() => {
        setCollectingItems(prev => new Set(prev).add(index));
      }, evidence.collectDelay);

      // Mark as collected after a brief delay
      setTimeout(() => {
        setCollectingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        setCollectedItems(prev => new Set(prev).add(index));
      }, evidence.collectDelay + 800);
    });

    // Mark collection complete after all items are done
    const maxDelay = Math.max(...autoCollectedEvidence.map(e => e.collectDelay)) + 800;
    setTimeout(() => {
      setIsCollecting(false);
    }, maxDelay);
  };

  return (
    <Card className="shadow-sm border border-slate-700 bg-slate-900/95 backdrop-blur">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg font-semibold text-white">
              Evidence Collection
            </CardTitle>
          </div>
          {!isApproved && (
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Evidence Collection
            </Button>
          )}
          {isCollecting && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Collecting...
            </Badge>
          )}
          {isApproved && !isCollecting && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {!isApproved
            ? "Approve to begin automated evidence collection"
            : isCollecting
              ? "Collecting evidence from multiple sources..."
              : "All evidence items collected successfully"
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Pending Approval Items - NOW FIRST */}
        {!isApproved && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <h4 className="font-semibold text-white">Pending Approval</h4>
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
                      <span className="text-slate-300">{pending.item}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                      Awaiting: {pending.approver}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Alert className="border-yellow-500/30 bg-yellow-950/10">
              <AlertTitle className="text-sm font-semibold text-yellow-400">Action Required</AlertTitle>
              <AlertDescription className="text-sm text-slate-400">
                <div className="space-y-1 mt-2">
                  <p>Click "Approve Evidence Collection" to begin automated gathering</p>
                  <p>Collection includes DLP logs, access patterns, VPN logs, and more</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Auto-Collected Evidence - NOW SECOND (after approval) */}
        {isApproved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              {isCollecting ? (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              <h4 className="font-semibold text-white">
                {isCollecting ? "Collecting Evidence" : "Auto-Collected Evidence"}
              </h4>
              <Badge variant="secondary" className={`text-xs ${
                isCollecting
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                  : "bg-green-500/20 text-green-400 border-green-500/50"
              }`}>
                {isCollecting ? "In Progress" : "Ready"}
              </Badge>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <div className="space-y-2">
                {autoCollectedEvidence.map((evidence, index) => {
                  const isCollected = collectedItems.has(index);
                  const isCurrentlyCollecting = collectingItems.has(index);
                  const isPending = !isCollected && !isCurrentlyCollecting;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      {isCollected && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {isCurrentlyCollecting && (
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                      )}
                      {isPending && (
                        <Clock className="h-4 w-4 text-slate-500" />
                      )}
                      <span className={isCollected ? "text-slate-300" : "text-slate-500"}>
                        {evidence.item}
                      </span>
                      {isCurrentlyCollecting && (
                        <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400 ml-auto">
                          Collecting...
                        </Badge>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Timeline Info - shown after approval */}
        {isApproved && !isCollecting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Alert className="border-green-500/30 bg-green-950/10">
              <AlertTitle className="text-sm font-semibold text-green-400">Collection Complete</AlertTitle>
              <AlertDescription className="text-sm text-slate-400">
                <div className="space-y-1 mt-2">
                  <p>✓ All evidence items collected successfully</p>
                  <p>✓ Evidence ready for investigation team review</p>
                  <p>✓ Chain of custody logged and timestamped</p>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
