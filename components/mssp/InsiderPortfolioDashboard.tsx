"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  HeartbeatStatus,
  UrgentNotable,
  ScheduledActivity,
  ClientStatusInfo,
} from "@/lib/mockData/msspPortfolioMockData";
import { createIncidentRoomFromNotable, saveIncidentRoom } from "@/lib/mockData/incidentRoomMockData";
import { motion } from "framer-motion";

interface InsiderPortfolioDashboardProps {
  heartbeat: HeartbeatStatus;
  urgentNotables: UrgentNotable[];
  scheduledActivities: ScheduledActivity[];
  yellowStatusClients: ClientStatusInfo[];
  onboardingClient: ClientStatusInfo;
  greenClientsCount: number;
  onNotableClick?: (notableId: string) => void;
  onViewQuickDetails?: (notableId: string) => void;
  onTriageClick?: (notableId: string) => void;
  onDismissClick?: (notableId: string) => void;
}

export function InsiderPortfolioDashboard({
  heartbeat,
  urgentNotables,
  scheduledActivities,
  yellowStatusClients,
  onboardingClient,
  greenClientsCount,
  onNotableClick,
  onViewQuickDetails,
  onTriageClick,
  onDismissClick,
}: InsiderPortfolioDashboardProps) {
  const router = useRouter();
  const [greenSectionExpanded, setGreenSectionExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("urgency");

  const handleTriageClick = (notableId: string) => {
    // Find the notable
    const notable = urgentNotables.find(n => n.id === notableId);
    if (!notable) {
      console.error('Notable not found:', notableId);
      return;
    }

    // Create incident room
    const room = createIncidentRoomFromNotable(notableId, notable);

    // Save to localStorage
    saveIncidentRoom(room);

    // Navigate to room
    router.push(`/incident-room/${room.id}`);
  };

  const formatTimeAgo = (date: Date) => {
    const minutesAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutesAgo === 0) return "Just now";
    if (minutesAgo < 60) return `${minutesAgo} min ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    const remainingMinutes = minutesAgo % 60;
    if (hoursAgo === 1 && remainingMinutes === 0) return "1 hr ago";
    if (hoursAgo === 1) return `1 hr ${remainingMinutes} min ago`;
    return `${hoursAgo} hrs ${remainingMinutes} min ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 w-full"
    >
      {/* Header */}
      <Card className="shadow-sm border bg-muted/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <span>🛡️</span>
                <span>INSIDER THREAT PORTFOLIO - FULL VIEW</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm mt-2 text-muted-foreground">
                <span>Last Heartbeat:</span>
                <span>
                  {formatTimeAgo(heartbeat.timestamp)} (
                  {heartbeat.timestamp.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  )
                </span>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">ACTIVE</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Analyst</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="shadow-sm border bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="red">Red (Urgent)</SelectItem>
                <SelectItem value="yellow">Yellow (Minor)</SelectItem>
                <SelectItem value="blue">Blue (Onboarding)</SelectItem>
                <SelectItem value="green">Green (Healthy)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="financial">Financial Services</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by: Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgency">Sort by: Urgency</SelectItem>
                <SelectItem value="client">Sort by: Client Name</SelectItem>
                <SelectItem value="maturity">Sort by: Maturity Score</SelectItem>
                <SelectItem value="risk">Sort by: Risk Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Notables Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-red-600">
          🔴 URGENT NOTABLES ({urgentNotables.length}) - NEEDS IMMEDIATE TRIAGE
        </h2>
        {urgentNotables.map((notable, index) => (
          <Card key={notable.id} className="shadow-sm border-red-200 bg-red-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive" className="text-xs font-semibold">
                      [{index + 1}]
                    </Badge>
                    <span className="font-semibold text-base">{notable.clientName}</span>
                    <Badge variant="destructive">🔴 URGENT</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Maturity Score: {notable.maturityScore.score.toFixed(1)}/5.0 (Level{" "}
                    {notable.maturityScore.level} - {notable.maturityScore.levelName})
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Notable Type:</span> {notable.notableType}
                </p>
                <p>
                  <span className="font-medium">Detected:</span>{" "}
                  {notable.detectedAt.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  today ({formatTimeAgo(notable.detectedAt)})
                </p>
                <p>
                  <span className="font-medium">Risk Score:</span>{" "}
                  <span className="text-red-600 font-bold">
                    {notable.riskScore}/100 (
                    {notable.riskScore >= 80 ? "CRITICAL" : "HIGH"})
                  </span>
                </p>
                <p>
                  <span className="font-medium">Trigger:</span> {notable.trigger}
                </p>
                <p className="text-muted-foreground italic">
                  Context: [REDACTED - Privacy Protected] 🔒
                  <br />
                  <span className="text-xs">
                    (User details visible after triage/workroom creation)
                  </span>
                </p>
              </div>

              <div className="border-t pt-3 space-y-1">
                <p>
                  <span className="font-medium">Status:</span> {notable.status.toUpperCase()} |{" "}
                  <span className="font-medium">Client Notification:</span>{" "}
                  {notable.clientNotification.notified ? (
                    <>
                      ✅ NOTIFIED
                      {notable.clientNotification.acknowledged && " & ACKNOWLEDGED"}
                    </>
                  ) : (
                    <>
                      {notable.clientNotification.configured
                        ? "PENDING ⏸️"
                        : "NOT CONFIGURED ❌"}
                    </>
                  )}
                </p>
              </div>

              <div className="border rounded-md p-2 bg-background/50">
                <p className="text-xs">
                  <span className="font-medium">⚙️ Client Config:</span> {notable.clientConfig}
                </p>
                {notable.clientNotification.notified && (
                  <p className="text-xs mt-1">
                    → CISO auto-notified at{" "}
                    {notable.clientNotification.notifiedAt?.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    (email + platform alert)
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleTriageClick(notable.id)}
                  className="flex-1"
                >
                  🚨 Create Incident Room
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewQuickDetails?.(notable.id)}
                  className="flex-1"
                >
                  View Quick Details ▾
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDismissClick?.(notable.id)}
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduled Activities Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          📅 SCHEDULED ACTIVITIES TODAY ({scheduledActivities.length})
        </h2>
        <Card className="shadow-sm border bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              {scheduledActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <span className="font-semibold min-w-[70px]">{activity.time}</span>
                  <span>
                    <span className="font-medium">{activity.clientName}</span>{" "}
                    <span className="text-xs text-muted-foreground">
                      (Mat: {activity.maturityScore.toFixed(1)})
                    </span>{" "}
                    | {activity.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yellow Status Clients Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-yellow-600">
          🟡 YELLOW STATUS CLIENTS ({yellowStatusClients.length}) - Minor Issues (Routine)
        </h2>
        {yellowStatusClients.map((client) => (
          <Card key={client.name} className="shadow-sm border-yellow-200 bg-yellow-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-base">{client.name}</span>
                    <Badge className="bg-yellow-500 text-white">🟡 MINOR</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Maturity Score: {client.maturityScore.score.toFixed(1)}/5.0 (Level{" "}
                    {client.maturityScore.level} - {client.maturityScore.levelName})
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Issue:</span> {client.issue}
              </p>
              {client.scheduledAction && (
                <p>
                  <span className="font-medium">Scheduled:</span> {client.scheduledTime}{" "}
                  {client.scheduledAction}
                </p>
              )}
              <Button variant="outline" size="sm" className="mt-2">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onboarding Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-blue-600">🔵 ONBOARDING (1)</h2>
        <Card className="shadow-sm border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-base">{onboardingClient.name}</span>
                  <Badge className="bg-blue-500 text-white">🔵 DAY 30</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Maturity Score: {onboardingClient.maturityScore.score.toFixed(1)}/5.0 (Level{" "}
                  {onboardingClient.maturityScore.level} -{" "}
                  {onboardingClient.maturityScore.levelName}) → Target: 2.0+
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Today:</span> {onboardingClient.scheduledAction} (
              {onboardingClient.scheduledTime})
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Green Status Clients Section (Collapsible) */}
      <Collapsible open={greenSectionExpanded} onOpenChange={setGreenSectionExpanded}>
        <Card className="shadow-sm border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-green-600">
                  🟢 GREEN STATUS CLIENTS ({greenClientsCount})
                </h2>
                {greenSectionExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <p className="text-sm text-muted-foreground">
                All green status clients are healthy with no action needed. Click individual clients
                to view detailed metrics and historical performance.
              </p>
              <div className="mt-3 text-xs text-muted-foreground italic">
                (Full client list would be displayed here in production)
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
