"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import {
  HeartbeatStatus,
  PortfolioHealthSummary,
  PriorityActions,
  mockUrgentNotables,
  UrgentNotable,
} from "@/lib/mockData/msspPortfolioMockData";
import { motion } from "framer-motion";
import { NotableAlertModal } from "./NotableAlertModal";
import { WorkroomCreationModal } from "./WorkroomCreationModal";

interface InsiderPortfolioWidgetProps {
  heartbeat: HeartbeatStatus;
  portfolioHealth: PortfolioHealthSummary;
  priorityActions: PriorityActions;
  onSimulateAlert?: () => void;
  onViewFullPortfolio?: () => void;
  showSimulateButton?: boolean;
}

export function InsiderPortfolioWidget({
  heartbeat,
  portfolioHealth,
  priorityActions,
  onSimulateAlert,
  onViewFullPortfolio,
  showSimulateButton = true,
}: InsiderPortfolioWidgetProps) {
  const router = useRouter();
  const [isSimulated, setIsSimulated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentNotableIndex, setCurrentNotableIndex] = useState(0);
  const [workroomModalOpen, setWorkroomModalOpen] = useState(false);
  const [selectedNotableForWorkroom, setSelectedNotableForWorkroom] = useState<UrgentNotable | null>(null);

  const handleShieldClick = () => {
    if (!isSimulated) {
      setIsSimulated(true);
      setCurrentNotableIndex(0);
      setShowModal(true);
      onSimulateAlert?.();
    }
  };

  const handleNextNotable = () => {
    if (currentNotableIndex < mockUrgentNotables.length - 1) {
      setCurrentNotableIndex(currentNotableIndex + 1);
    } else {
      setShowModal(false);
    }
  };

  const handlePreviousNotable = () => {
    if (currentNotableIndex > 0) {
      setCurrentNotableIndex(currentNotableIndex - 1);
    }
  };

  const handleTriageClick = () => {
    const notable = mockUrgentNotables[currentNotableIndex];
    setSelectedNotableForWorkroom(notable);
    setWorkroomModalOpen(true);
    setShowModal(false);
  };

  const handleWorkroomCreated = (roomId: string) => {
    // Redirect to split-screen wallboard view showing MSSP & Client perspectives
    router.push(`/incident-room-wallboard?roomId=${roomId}`);
  };

  const getHeartbeatIcon = () => {
    switch (heartbeat.status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "delayed":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "stale":
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getHeartbeatText = () => {
    switch (heartbeat.status) {
      case "active":
        return "ACTIVE";
      case "delayed":
        return "DELAYED";
      case "stale":
        return "STALE";
    }
  };

  const getHeartbeatColor = () => {
    switch (heartbeat.status) {
      case "active":
        return "text-green-600";
      case "delayed":
        return "text-yellow-600";
      case "stale":
        return "text-red-600";
    }
  };

  const formatTimeAgo = (minutesAgo: number) => {
    if (minutesAgo === 0) return "Just now";
    if (minutesAgo === 1) return "1 min ago";
    return `${minutesAgo} min ago`;
  };

  const greenPercent = Math.round((portfolioHealth.green / portfolioHealth.totalClients) * 100);
  const yellowPercent = Math.round((portfolioHealth.yellow / portfolioHealth.totalClients) * 100);
  const bluePercent = Math.round((portfolioHealth.blue / portfolioHealth.totalClients) * 100);
  const redPercent = Math.round((portfolioHealth.red / portfolioHealth.totalClients) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-sm border bg-muted/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <button
                onClick={handleShieldClick}
                disabled={isSimulated}
                className={`cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${
                  isSimulated ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Simulate incident"
                title={isSimulated ? "Simulation already active" : "Click to simulate incident"}
              >
                <span className="text-2xl">🛡️</span>
              </button>
              <span>INSIDER THREAT PORTFOLIO</span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className="text-white">Last Heartbeat:</span>
            <span className="text-white">
              {formatTimeAgo(heartbeat.minutesAgo)} (
              {heartbeat.timestamp.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
              )
            </span>
            <div className={`w-3 h-3 rounded-full ${
              heartbeat.status === 'active' ? 'bg-green-500' :
              heartbeat.status === 'delayed' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Portfolio Health Summary */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Portfolio Health Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-white">
                  <span className="font-medium">Green: {portfolioHealth.green} clients</span>{" "}
                  <span className="text-white/80">({greenPercent}%) - Healthy</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-white">
                  <span className="font-medium">Yellow: {portfolioHealth.yellow} clients</span>{" "}
                  <span className="text-white/80">
                    ({yellowPercent}%) - Minor issues (routine)
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-white">
                  <span className="font-medium">Blue: {portfolioHealth.blue} client</span>{" "}
                  <span className="text-white/80">({bluePercent}%) - Onboarding</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-white">
                  <span className="font-medium">
                    {portfolioHealth.red > 0 ? "🔴 " : ""}Red: {portfolioHealth.red} clients
                  </span>{" "}
                  <span className="text-white/80">
                    ({redPercent}%) -{" "}
                    {portfolioHealth.red > 0 ? "Active incidents" : "Active incidents"}
                  </span>
                </span>
              </div>
              <div className="pt-2 border-t">
                <span className="font-medium">Total Clients: {portfolioHealth.totalClients}</span>
              </div>
            </div>
          </div>

          {/* Priority Actions */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Today&apos;s Priority Actions ({new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white">
                  {priorityActions.urgentNotables > 0 ? "🚨" : "🚨"}{" "}
                  <span
                    className={
                      priorityActions.urgentNotables > 0
                        ? "font-bold text-red-600"
                        : "font-medium text-white"
                    }
                  >
                    {priorityActions.urgentNotables} Urgent Notable
                    {priorityActions.urgentNotables !== 1 ? "s" : ""}
                  </span>{" "}
                  <span className="text-white/80">
                    {priorityActions.urgentNotables > 0
                      ? "(NEEDS IMMEDIATE TRIAGE) ⚠️"
                      : "(needs triage)"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white">
                  📅{" "}
                  <span className="font-medium">
                    {priorityActions.scheduledActivities} Scheduled activities
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white">
                  🔔{" "}
                  <span className="font-medium">
                    {priorityActions.controlGapRemediations} Control gap remediations
                  </span>{" "}
                  <span className="text-white/80">(yellow status)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {showSimulateButton && onSimulateAlert && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSimulateAlert}
                className="flex-1"
              >
                🧪 Simulate Notable Alert
              </Button>
            )}
            {onViewFullPortfolio && (
              <Button variant="default" size="sm" onClick={onViewFullPortfolio} className="flex-1">
                View Full Portfolio →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notable Alert Modals */}
      {isSimulated && showModal && (
        <NotableAlertModal
          notable={mockUrgentNotables[currentNotableIndex]}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onNext={handleNextNotable}
          onPrevious={handlePreviousNotable}
          currentIndex={currentNotableIndex}
          totalCount={mockUrgentNotables.length}
          onTriageClick={handleTriageClick}
        />
      )}

      {/* Workroom Creation Modal */}
      <WorkroomCreationModal
        notable={selectedNotableForWorkroom}
        isOpen={workroomModalOpen}
        onClose={() => setWorkroomModalOpen(false)}
        onWorkroomCreated={handleWorkroomCreated}
      />
    </motion.div>
  );
}
