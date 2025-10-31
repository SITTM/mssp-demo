"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";
import { RoomParticipant, RoomRole } from "@/lib/types/incidentRoom";
import { searchSpecialists, getSpecialistsByIncidentType, getSpecialistById, SpecialistProfile } from "@/lib/data/specialist-profiles";
import { Users, Shield, Scale, UserCheck, Building2, Clock } from "lucide-react";
import { SpecialistSplitView } from "./SpecialistSplitView";

interface WorkroomCreationStep2Props {
  notable: UrgentNotable;
  onContinue: (participants: RoomParticipant[]) => void;
  onBack: () => void;
}

interface ParticipantOption {
  userId: string;
  name: string;
  email: string;
  role: RoomRole;
  organization: "mssp" | "client";
  required: boolean;
  icon: React.ReactNode;
  description: string;
  permissions: {
    canViewIdentity: boolean;
    canApproveIdentityDisclosure: boolean;
    canAccessHRRecords: boolean;
    canApproveHRAccess: boolean;
    canExecuteContainment: boolean;
    canApproveContainment: boolean;
    canExportEvidence: boolean;
    canCloseRoom: boolean;
  };
}

export function WorkroomCreationStep2({
  notable,
  onContinue,
  onBack,
}: WorkroomCreationStep2Props) {
  const [searchTerm, setSearchTerm] = useState(notable.notableType);
  const [searchResults, setSearchResults] = useState<SpecialistProfile[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [showClientInvitation, setShowClientInvitation] = useState(true);
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState<Record<string, string>>({
    mssp_analyst: 'active',
    ciso: 'pending',
  });
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<SpecialistProfile[]>([]);

  // Calculate incident dates once to avoid hydration mismatch
  const [incidentDates] = useState(() => ({
    today: new Date().toISOString().split('T')[0],
    threeDaysAgo: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));

  // Load specialists based on incident type on mount
  useEffect(() => {
    const specialists = getSpecialistsByIncidentType(notable.notableType);
    setSearchResults(specialists);
  }, [notable.notableType]);

  // Clock timer
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchSpecialists(term);
      setSearchResults(results);
    } else {
      const specialists = getSpecialistsByIncidentType(notable.notableType);
      setSearchResults(specialists);
    }
  };

  const participantOptions: ParticipantOption[] = [
    {
      userId: "analyst-001",
      name: "You (MSSP Lead Analyst)",
      email: "analyst@mssp.com",
      role: "mssp_analyst" as RoomRole,
      organization: "mssp",
      required: true,
      icon: <Shield className="h-4 w-4" />,
      description: "Room owner, coordinates investigation",
      permissions: {
        canViewIdentity: true,
        canApproveIdentityDisclosure: false,
        canAccessHRRecords: false,
        canApproveHRAccess: false,
        canExecuteContainment: true,
        canApproveContainment: false,
        canExportEvidence: true,
        canCloseRoom: false,
      },
    },
    {
      userId: "ciso-001",
      name: "Sarah Chen",
      email: `sarah.chen@${notable.clientName.toLowerCase().replace(/\s+/g, "")}.com`,
      role: "ciso" as RoomRole,
      organization: "client",
      required: true,
      icon: <Shield className="h-4 w-4 text-blue-500" />,
      description: "Approves identity disclosure, containment actions",
      permissions: {
        canViewIdentity: false,
        canApproveIdentityDisclosure: true,
        canAccessHRRecords: false,
        canApproveHRAccess: true,
        canExecuteContainment: true,
        canApproveContainment: true,
        canExportEvidence: true,
        canCloseRoom: true,
      },
    },
    {
      userId: "legal-001",
      name: "James Wilson",
      email: `james.wilson@${notable.clientName.toLowerCase().replace(/\s+/g, "")}.com`,
      role: "legal" as RoomRole,
      organization: "client",
      required: true,
      icon: <Scale className="h-4 w-4 text-purple-500" />,
      description: "Legal oversight, privacy compliance review",
      permissions: {
        canViewIdentity: false,
        canApproveIdentityDisclosure: true,
        canAccessHRRecords: false,
        canApproveHRAccess: false,
        canExecuteContainment: false,
        canApproveContainment: false,
        canExportEvidence: true,
        canCloseRoom: false,
      },
    },
    {
      userId: "hr-001",
      name: "Priya Patel",
      email: `priya.patel@${notable.clientName.toLowerCase().replace(/\s+/g, "")}.com`,
      role: "hr" as RoomRole,
      organization: "client",
      required: false,
      icon: <UserCheck className="h-4 w-4 text-green-500" />,
      description: "Provides HR context if needed (optional)",
      permissions: {
        canViewIdentity: false,
        canApproveIdentityDisclosure: false,
        canAccessHRRecords: true,
        canApproveHRAccess: true,
        canExecuteContainment: false,
        canApproveContainment: false,
        canExportEvidence: false,
        canCloseRoom: false,
      },
    },
  ];

  // Initialize with required participants
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    participantOptions.filter((p) => p.required).map((p) => p.userId)
  );

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSpecialist = (userId: string) => {
    const isAdding = !selectedParticipants.includes(userId);

    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );

    // If adding an internal (client) team member, trigger invitation animation
    if (isAdding) {
      // Look up specialist from full profiles list, not just searchResults
      // This ensures Legal & HR experts selected via modal are found even if not in filtered results
      const specialist = getSpecialistById(userId);
      if (specialist && specialist.organization === 'client') {
        // Add to selected team members
        setSelectedTeamMembers(prev => [...prev, specialist]);

        // Set initial status as "inviting"
        setInvitationStatus(prev => ({
          ...prev,
          [userId]: 'inviting'
        }));

        // After 10 seconds, update to "joined"
        setTimeout(() => {
          setInvitationStatus(prev => ({
            ...prev,
            [userId]: 'joined'
          }));
        }, 10000);
      }
    } else {
      // If removing, also remove from team members and invitation status
      setSelectedTeamMembers(prev => prev.filter(m => m.userId !== userId));
      setInvitationStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[userId];
        return newStatus;
      });
    }
  };

  const convertSpecialistToParticipant = (specialist: SpecialistProfile): RoomParticipant => {
    // Map specialist roles to room roles with appropriate permissions
    const roleMapping: Record<string, { role: RoomRole; permissions: ParticipantOption['permissions'] }> = {
      forensic_analyst: {
        role: "mssp_analyst" as RoomRole,
        permissions: {
          canViewIdentity: true,
          canApproveIdentityDisclosure: false,
          canAccessHRRecords: false,
          canApproveHRAccess: false,
          canExecuteContainment: true,
          canApproveContainment: false,
          canExportEvidence: true,
          canCloseRoom: false,
        }
      },
      legal_counsel: {
        role: "legal" as RoomRole,
        permissions: {
          canViewIdentity: false,
          canApproveIdentityDisclosure: true,
          canAccessHRRecords: false,
          canApproveHRAccess: false,
          canExecuteContainment: false,
          canApproveContainment: false,
          canExportEvidence: true,
          canCloseRoom: false,
        }
      },
      hr_director: {
        role: "hr" as RoomRole,
        permissions: {
          canViewIdentity: false,
          canApproveIdentityDisclosure: false,
          canAccessHRRecords: true,
          canApproveHRAccess: true,
          canExecuteContainment: false,
          canApproveContainment: false,
          canExportEvidence: false,
          canCloseRoom: false,
        }
      },
    };

    const mapping = roleMapping[specialist.role] || roleMapping.forensic_analyst;

    return {
      userId: specialist.userId,
      name: specialist.name,
      email: specialist.email,
      role: mapping.role,
      organization: specialist.organization,
      joinedAt: new Date(),
      lastSeen: new Date(),
      permissions: mapping.permissions,
    };
  };

  const handleAcceptInvitation = () => {
    // Update status when client accepts
    setInvitationStatus({
      mssp_analyst: 'active',
      ciso: 'joined',
      legal: 'joined'
    });
    setShowClientInvitation(false);
  };

  const handleContinue = () => {
    const coreParticipants: RoomParticipant[] = participantOptions
      .filter((p) => selectedParticipants.includes(p.userId))
      .map((p) => ({
        userId: p.userId,
        name: p.name,
        email: p.email,
        role: p.role,
        organization: p.organization,
        joinedAt: new Date(),
        lastSeen: new Date(),
        permissions: p.permissions,
      }));

    const specialistParticipants: RoomParticipant[] = searchResults
      .filter((s) => selectedParticipants.includes(s.userId))
      .map(convertSpecialistToParticipant);

    onContinue([...coreParticipants, ...specialistParticipants]);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Split Screen - Two Completely Separate Floating Panels */}
      <div className="grid grid-cols-2 gap-4 h-[calc(90vh-180px)] p-4 relative">
        {/* Thick Black Divider Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black -translate-x-1/2 z-10"></div>
        {/* LEFT SIDE - MSSP VIEW */}
        <div className="relative">
          <Card className="h-full flex flex-col border-2 border-blue-500 shadow-xl shadow-blue-500/20">
            <CardHeader className="border-b border-blue-500/30 bg-blue-50 shrink-0 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500/20 p-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-blue-700">
                      MSSP Operations View
                    </CardTitle>
                    <p className="text-xs text-slate-600 mt-1">
                      Internal specialist search and team coordination
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/50">
                  MSSP
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden pt-4">
              <div className="h-full flex flex-col">
                {/* Selection Counter */}
                <div className="mb-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Selected: <span className="text-blue-600 font-bold">{selectedParticipants.length}</span>
                    </span>
                  </div>
                </div>

                {/* Scrollable Specialist List */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <SpecialistSplitView
                    searchResults={searchResults}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    selectedParticipants={selectedParticipants}
                    onToggleSpecialist={toggleSpecialist}
                    viewMode="mssp"
                    clientName={notable.clientName}
                    showInvitationStory={true}
                    invitationStatus={invitationStatus}
                    selectedTeamMembers={selectedTeamMembers}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Floating MSSP Badge */}
          <div className="absolute -top-2 -left-2 bg-blue-600 text-white px-3 py-1 rounded-md shadow-lg font-bold text-xs flex items-center gap-1">
            <Shield className="h-3 w-3" />
            MSSP SIDE
          </div>
        </div>

        {/* RIGHT SIDE - CLIENT VIEW */}
        <div className="relative">
          <Card className="h-full flex flex-col border-2 border-purple-500 shadow-xl shadow-purple-500/20">
            <CardHeader className="border-b border-purple-500/30 bg-purple-50 shrink-0 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-purple-700">
                      Client Operations View
                    </CardTitle>
                    <p className="text-xs text-slate-600 mt-1">
                      Independent expert marketplace with transparent pricing
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/50">
                  CLIENT
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden pt-4">
              <div className="h-full flex flex-col">
                {/* Selection Counter */}
                <div className="mb-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Selected: <span className="text-purple-600 font-bold">{selectedParticipants.length}</span>
                    </span>
                  </div>
                </div>

                {/* Scrollable Specialist List */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <SpecialistSplitView
                    searchResults={searchResults}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    selectedParticipants={selectedParticipants}
                    onToggleSpecialist={toggleSpecialist}
                    viewMode="client"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Floating Client Badge */}
          <div className="absolute -top-2 -right-2 bg-purple-600 text-white px-3 py-1 rounded-md shadow-lg font-bold text-xs flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            CLIENT SIDE
          </div>

          {/* Risk Details Modal */}
          {showRiskDetails && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative rounded-lg border-2 border-red-500 bg-white shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                  ⚠️ RISK EVALUATION DETAILS
                </div>

                <div className="p-6 pt-8 space-y-4 max-h-[80vh] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 shrink-0">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900">
                        User Risk Threshold Exceeded
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {notable.clientName} - Foresight UEBA Analysis
                      </p>
                    </div>
                  </div>

                  {/* Risk Score Summary */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-xs text-red-700 font-medium mb-1">Current Risk Score</p>
                      <p className="text-2xl font-bold text-red-900">{notable.riskScore}/100</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-xs text-orange-700 font-medium mb-1">Historical Incidents</p>
                      <p className="text-2xl font-bold text-orange-900">3</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 font-medium mb-1">Threshold</p>
                      <p className="text-2xl font-bold text-amber-900">75</p>
                    </div>
                  </div>

                  {/* Radar Chart */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">Risk Profile Analysis</h4>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-400 rounded"></div>
                          <span>Current Risk</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-400 rounded"></div>
                          <span>Normal Baseline</span>
                        </div>
                      </div>
                    </div>

                    {/* Radar Chart Image */}
                    <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                      <img
                        src="/risk-radar-chart.png"
                        alt="UEBA Risk Profile Analysis showing Current Risk vs Normal Baseline across multiple dimensions including Access Patterns, Job Security, Communication, Work Hours, System Usage, Data & Systems Access, Collaboration, Financial Stress, and Performance Issues"
                        className="w-full h-auto rounded"
                        onLoad={() => console.log('✅ Image loaded successfully')}
                        onError={(e) => {
                          console.error('❌ Image failed to load:', e);
                          console.log('Image src:', '/risk-radar-chart.svg');
                          console.log('Full URL:', window.location.origin + '/risk-radar-chart.svg');
                        }}
                      />
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900">Key Findings</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2 rounded bg-red-50">
                        <span className="text-red-600 font-bold text-sm">•</span>
                        <p className="text-sm text-slate-700">
                          <strong>Access Patterns:</strong> Significant deviation from baseline (165% above normal)
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded bg-orange-50">
                        <span className="text-orange-600 font-bold text-sm">•</span>
                        <p className="text-sm text-slate-700">
                          <strong>Work Hours:</strong> Unusual access during off-hours and weekends
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded bg-amber-50">
                        <span className="text-amber-600 font-bold text-sm">•</span>
                        <p className="text-sm text-slate-700">
                          <strong>Data Access:</strong> Large volume downloads to personal storage
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Historical Context */}
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">Historical Incidents (3 confirmed)</h4>
                    <ul className="space-y-1 text-sm text-orange-800">
                      <li>• {incidentDates.today}: Policy violation - Unauthorized data transfer</li>
                      <li>• {incidentDates.threeDaysAgo}: DLP alert - Sensitive file email attempt</li>
                      <li>• {incidentDates.sevenDaysAgo}: Access control breach - Restricted system access</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowRiskDetails(false)}
                    >
                      Close
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setShowRiskDetails(false);
                        handleAcceptInvitation();
                      }}
                    >
                      ✓ Accept & Join Incident Room
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client CISO Invitation Popup */}
          {showClientInvitation && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] max-w-md">
              <div className="relative rounded-lg border-2 border-amber-500 bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  🔔 NEW INVITATION
                </div>

                <div className="p-6 pt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 shrink-0">
                      <Shield className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 mb-2">
                        Incident Room Invitation
                      </h3>
                      <p className="text-sm text-slate-700">
                        You have been invited to an incident room related to:
                      </p>
                      <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm font-semibold text-red-900">
                          User High Risk Insider Triggers Threshold Exceeded
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          {notable.clientName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <Users className="h-4 w-4" />
                    <span>
                      <strong>From:</strong> MSSP Lead Analyst (analyst@mssp.com)
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleAcceptInvitation}
                    >
                      ✓ Accept & Join
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowClientInvitation(false);
                        setShowRiskDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t bg-white p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              Client: <strong className="text-slate-900">{notable.clientName}</strong>
            </span>
            <span>•</span>
            <span>
              Incident: <strong className="text-slate-900">{notable.notableType}</strong>
            </span>
            <span>•</span>
            <span>
              Available Specialists: <strong className="text-slate-900">{searchResults.length}</strong>
            </span>
          </div>
          <div className="text-sm text-slate-600">
            {currentTime?.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>

          <Alert className="flex-1 mx-4 py-2">
            <AlertDescription className="text-sm">
              <strong>Selected participants: {selectedParticipants.length}</strong> -
              All will receive invitations when the room is created
            </AlertDescription>
          </Alert>

          <Button variant="default" onClick={handleContinue} className="px-6">
            Continue to Evidence Collection →
          </Button>
        </div>
      </div>
    </div>
  );
}
