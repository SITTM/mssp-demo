"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InsiderPortfolioWidget } from "@/components/mssp/InsiderPortfolioWidget";
import { InsiderPortfolioDashboard } from "@/components/mssp/InsiderPortfolioDashboard";
import { NotableQuickDetails } from "@/components/mssp/NotableQuickDetails";
import { NotableTechnicalDetailsModal } from "@/components/mssp/NotableTechnicalDetailsModal";
import { WorkroomCreationModal } from "@/components/mssp/WorkroomCreationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockHeartbeat,
  mockHeartbeatAfterSimulation,
  initialPortfolioHealth,
  simulatedPortfolioHealth,
  initialPriorityActions,
  simulatedPriorityActions,
  mockUrgentNotables,
  mockScheduledActivities,
  mockYellowStatusClients,
  mockOnboardingClient,
  UrgentNotable,
} from "@/lib/mockData/msspPortfolioMockData";
import { motion, AnimatePresence } from "framer-motion";

type DemoStep = "initial" | "simulated" | "full-portfolio";

export default function MSSPDemoPage() {
  const router = useRouter();
  const [demoStep, setDemoStep] = useState<DemoStep>("initial");
  const [selectedNotableId, setSelectedNotableId] = useState<string | null>(null);
  const [quickDetailsOpen, setQuickDetailsOpen] = useState<{ [key: string]: boolean }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNotable, setModalNotable] = useState<UrgentNotable | null>(null);
  const [workroomModalOpen, setWorkroomModalOpen] = useState(false);
  const [selectedNotableForWorkroom, setSelectedNotableForWorkroom] = useState<UrgentNotable | null>(null);

  const handleSimulateAlert = () => {
    setDemoStep("simulated");
  };

  const handleViewFullPortfolio = () => {
    setDemoStep("full-portfolio");
  };

  const handleViewQuickDetails = (notableId: string) => {
    setQuickDetailsOpen((prev) => ({
      ...prev,
      [notableId]: !prev[notableId],
    }));
  };

  const handleViewFullDetails = (notableId: string) => {
    const notable = mockUrgentNotables.find((n) => n.id === notableId);
    if (notable) {
      setModalNotable(notable);
      setModalOpen(true);
    }
  };

  const handleTriageClick = (notableId: string) => {
    const notable = mockUrgentNotables.find((n) => n.id === notableId);
    if (notable) {
      setSelectedNotableForWorkroom(notable);
      setWorkroomModalOpen(true);
    }
  };

  const handleWorkroomCreated = (roomId: string) => {
    router.push(`/incident-room/${roomId}`);
  };

  const handleDismissClick = (notableId: string) => {
    alert("Dismiss feature coming soon!\n\nThis would:\n1. Mark notable as false positive\n2. Update Foresight threshold\n3. Remove from urgent notables list\n4. Log dismissal reason for audit");
  };

  const handleResetDemo = () => {
    setDemoStep("initial");
    setSelectedNotableId(null);
    setQuickDetailsOpen({});
    setModalOpen(false);
    setModalNotable(null);
    setWorkroomModalOpen(false);
    setSelectedNotableForWorkroom(null);
  };

  const getStepBadge = () => {
    switch (demoStep) {
      case "initial":
        return <Badge variant="secondary">Step 1: Initial Widget View</Badge>;
      case "simulated":
        return <Badge variant="destructive">Step 2: After Simulation</Badge>;
      case "full-portfolio":
        return <Badge>Step 3-5: Full Portfolio & Details</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Demo Header */}
        <Card className="shadow-sm border bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  MSSP Insider Portfolio Widget - Interactive Demo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Experience the full user journey from initial widget to detailed technical analysis
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getStepBadge()}
                {demoStep !== "initial" && (
                  <Button variant="outline" size="sm" onClick={handleResetDemo}>
                    🔄 Reset Demo
                  </Button>
                )}
              </div>
            </div>

            {/* Demo Instructions */}
            <div className="mt-4 p-4 border rounded-lg bg-background space-y-2 text-sm">
              <h3 className="font-semibold">Demo Flow:</h3>
              <ol className="list-decimal list-inside space-y-1 text-xs pl-2">
                <li className={demoStep === "initial" ? "font-bold text-blue-600" : ""}>
                  <strong>Initial Widget:</strong> Shows portfolio health summary (no active notables)
                </li>
                <li className={demoStep === "simulated" ? "font-bold text-blue-600" : ""}>
                  <strong>Simulate Alert:</strong> Click button to trigger 2 realistic notable alerts
                </li>
                <li className={demoStep === "full-portfolio" ? "font-bold text-blue-600" : ""}>
                  <strong>Full Portfolio:</strong> View urgent notables, scheduled activities, and client status
                </li>
                <li>
                  <strong>Quick Details:</strong> Expand inline dropdown to see privacy-protected summary
                </li>
                <li>
                  <strong>Technical Details:</strong> Open modal for deep-dive timeline and risk analysis
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Main Demo Area */}
        <AnimatePresence mode="wait">
          {demoStep === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <InsiderPortfolioWidget
                heartbeat={mockHeartbeat}
                portfolioHealth={initialPortfolioHealth}
                priorityActions={initialPriorityActions}
                onSimulateAlert={handleSimulateAlert}
                onViewFullPortfolio={handleViewFullPortfolio}
                showSimulateButton={true}
              />
            </motion.div>
          )}

          {demoStep === "simulated" && (
            <motion.div
              key="simulated"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <InsiderPortfolioWidget
                heartbeat={mockHeartbeatAfterSimulation}
                portfolioHealth={simulatedPortfolioHealth}
                priorityActions={simulatedPriorityActions}
                onSimulateAlert={handleSimulateAlert}
                onViewFullPortfolio={handleViewFullPortfolio}
                showSimulateButton={false}
              />
            </motion.div>
          )}

          {demoStep === "full-portfolio" && (
            <motion.div
              key="full-portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <InsiderPortfolioDashboard
                heartbeat={mockHeartbeatAfterSimulation}
                urgentNotables={mockUrgentNotables}
                scheduledActivities={mockScheduledActivities}
                yellowStatusClients={mockYellowStatusClients}
                onboardingClient={mockOnboardingClient}
                greenClientsCount={simulatedPortfolioHealth.green}
                onViewQuickDetails={handleViewQuickDetails}
                onTriageClick={handleTriageClick}
                onDismissClick={handleDismissClick}
              />

              {/* Quick Details Sections (Integrated with Dashboard) */}
              <div className="space-y-4">
                {mockUrgentNotables.map((notable) => (
                  <div key={notable.id}>
                    <NotableQuickDetails
                      notable={notable}
                      isOpen={quickDetailsOpen[notable.id] || false}
                      onToggle={() => handleViewQuickDetails(notable.id)}
                      onViewFullDetails={() => handleViewFullDetails(notable.id)}
                      onTriageClick={() => handleTriageClick(notable.id)}
                      onDismissClick={() => handleDismissClick(notable.id)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technical Details Modal */}
        <NotableTechnicalDetailsModal
          notable={modalNotable}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onTriageClick={() => {
            if (modalNotable) handleTriageClick(modalNotable.id);
          }}
          onDismissClick={() => {
            if (modalNotable) handleDismissClick(modalNotable.id);
          }}
        />

        {/* Workroom Creation Modal */}
        <WorkroomCreationModal
          notable={selectedNotableForWorkroom}
          isOpen={workroomModalOpen}
          onClose={() => setWorkroomModalOpen(false)}
          onWorkroomCreated={handleWorkroomCreated}
        />

        {/* Demo Footer */}
        <Card className="shadow-sm border bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-sm space-y-2">
              <p className="font-semibold">Implementation Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-xs pl-2 text-muted-foreground">
                <li>Built with Next.js 15, TypeScript, Tailwind CSS, and Radix UI</li>
                <li>Uses Framer Motion for smooth animations and transitions</li>
                <li>
                  Privacy-first design: PII masked until workroom created (matches Barclays PoC patterns)
                </li>
                <li>Responsive layout: Mobile (1-col), Tablet (2-col), Desktop (full grid)</li>
                <li>
                  All data is mocked for demonstration - production would integrate with Foresight/UEBA APIs
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
