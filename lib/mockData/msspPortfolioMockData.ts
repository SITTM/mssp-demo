// MSSP Insider Portfolio Mock Data
// TypeScript interfaces and mock data for portfolio widget

export type ClientStatus = "green" | "yellow" | "blue" | "red";

export interface HeartbeatStatus {
  timestamp: Date;
  status: "active" | "delayed" | "stale";
  minutesAgo: number;
}

export interface PortfolioHealthSummary {
  green: number;
  yellow: number;
  blue: number;
  red: number;
  totalClients: number;
}

export interface PriorityActions {
  urgentNotables: number;
  scheduledActivities: number;
  controlGapRemediations: number;
}

export interface ClientMaturityScore {
  score: number; // 1.0-5.0
  level: number; // 1-5
  levelName: string; // "Ad Hoc" | "Managed" | "Defined" | "Quantitatively Managed" | "Optimizing"
}

export interface NotableTimelineEvent {
  timestamp: Date;
  description: string;
  isRedacted: boolean;
  type: "context" | "activity" | "trigger";
}

export interface EvidenceItem {
  name: string;
  collected: boolean;
  requiresConsent: boolean;
}

export interface RiskFactor {
  name: string;
  weight: number; // 0-100
}

export interface ForesightRiskAnalysis {
  confidence: number; // 0-100
  factors: RiskFactor[];
  recommendedActions: string[];
}

export interface PrivacySettings {
  tier: "strict" | "medium" | "permissive";
  geo: string;
  configuredDuring: string;
  maskingRules: {
    userIdentity: boolean;
    jobTitle: boolean;
    department: boolean;
    behavioralData: boolean;
  };
  notificationRules: {
    foresightHighRisk: "immediate" | "mssp-first";
    uebaMediumRisk: "immediate" | "mssp-first";
    dlpIncident: "immediate" | "mssp-first";
  };
  workroomAccessRules: {
    piiRevealedWhen: string;
    authorizedRoles: string[];
  };
}

export interface ClientNotificationStatus {
  configured: boolean;
  notified: boolean;
  notifiedAt?: Date;
  acknowledged?: boolean;
  acknowledgedAt?: Date;
  waitingFor?: string;
}

export interface UrgentNotable {
  id: string;
  clientName: string;
  maturityScore: ClientMaturityScore;
  notableType: string;
  detectedAt: Date;
  riskScore: number; // 0-100
  trigger: string;
  status: "needs_triage" | "triaging" | "confirmed" | "dismissed";
  clientNotification: ClientNotificationStatus;
  clientConfig: string;
  timeline: NotableTimelineEvent[];
  evidence: EvidenceItem[];
  riskAnalysis: ForesightRiskAnalysis;
  privacySettings: PrivacySettings;
  // Quick details fields
  sourceSystem: string;
  alertId: string;
  riskIndicators: {
    riskScore: number;
    baseline: number;
    triggerEvent: string;
    dataVolume: string;
    destination: string;
    accessMethod: string;
    device: string;
  };
  contextualFlags: {
    organizationalChange: boolean;
    performanceReview: string; // REDACTED or details
    departureRisk: string; // REDACTED or details
  };
}

export interface ScheduledActivity {
  id: string;
  time: string;
  clientName: string;
  maturityScore: number;
  activityType: string;
  description: string;
}

export interface ClientStatusInfo {
  name: string;
  status: ClientStatus;
  maturityScore: ClientMaturityScore;
  issue?: string;
  scheduledAction?: string;
  scheduledTime?: string;
}

// Mock Data

export const mockHeartbeat: HeartbeatStatus = {
  timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
  status: "active",
  minutesAgo: 2,
};

export const mockHeartbeatAfterSimulation: HeartbeatStatus = {
  timestamp: new Date(),
  status: "active",
  minutesAgo: 0,
};

export const initialPortfolioHealth: PortfolioHealthSummary = {
  green: 47,
  yellow: 2,
  blue: 1,
  red: 0,
  totalClients: 50,
};

export const simulatedPortfolioHealth: PortfolioHealthSummary = {
  green: 46,
  yellow: 2,
  blue: 1,
  red: 2,
  totalClients: 50,
};

export const initialPriorityActions: PriorityActions = {
  urgentNotables: 0,
  scheduledActivities: 3,
  controlGapRemediations: 2,
};

export const simulatedPriorityActions: PriorityActions = {
  urgentNotables: 2,
  scheduledActivities: 3,
  controlGapRemediations: 2,
};

export const mockScheduledActivities: ScheduledActivity[] = [
  {
    id: "act-1",
    time: "9:00 AM",
    clientName: "Harbor Financial",
    maturityScore: 1.2,
    activityType: "Onboarding Milestone",
    description: "Day 30 Onboarding Milestone",
  },
  {
    id: "act-2",
    time: "2:00 PM",
    clientName: "Precision Mfg",
    maturityScore: 2.3,
    activityType: "Advisory Call",
    description: "Monthly Advisory Call",
  },
  {
    id: "act-3",
    time: "4:00 PM",
    clientName: "Valley Legal",
    maturityScore: 1.5,
    activityType: "Policy Tuning",
    description: "DLP Policy Tuning",
  },
];

export const mockYellowStatusClients: ClientStatusInfo[] = [
  {
    name: "Valley Legal Partners",
    status: "yellow",
    maturityScore: {
      score: 1.5,
      level: 1,
      levelName: "Ad Hoc",
    },
    issue: "15 DLP false positives (last 7 days)",
    scheduledAction: "Policy tuning session",
    scheduledTime: "Today 4:00 PM",
  },
  {
    name: "Acme Manufacturing",
    status: "yellow",
    maturityScore: {
      score: 2.1,
      level: 2,
      levelName: "Managed",
    },
    issue: "Training completion 72% (target: 90%)",
    scheduledAction: "Send reminder emails to employees",
  },
];

export const mockOnboardingClient: ClientStatusInfo = {
  name: "Harbor Financial Services",
  status: "blue",
  maturityScore: {
    score: 1.2,
    level: 1,
    levelName: "Ad Hoc",
  },
  issue: "Day 30 of onboarding (Target: 2.0+)",
  scheduledAction: "Policy Development Kickoff",
  scheduledTime: "9:00 AM scheduled",
};

// Notable 1: Northstar Financial - Foresight High-Risk User
export const mockNotableNorthstar: UrgentNotable = {
  id: "notable-1",
  clientName: "Northstar Financial Group",
  maturityScore: {
    score: 2.8,
    level: 2,
    levelName: "Managed",
  },
  notableType: "Foresight High-Risk User Threshold Exceeded",
  detectedAt: new Date(Date.now() - 50 * 60 * 1000), // 50 min ago
  riskScore: 87,
  trigger: "User risk increased 580% (baseline: 15 → current: 87)",
  status: "needs_triage",
  clientNotification: {
    configured: true,
    notified: true,
    notifiedAt: new Date(Date.now() - 50 * 60 * 1000),
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 35 * 60 * 1000),
    waitingFor: "MSSP triage recommendation",
  },
  clientConfig: "Notify CISO immediately when notable fires",
  sourceSystem: "Foresight (Northstar's insider threat platform)",
  alertId: "FST-2847",
  riskIndicators: {
    riskScore: 87,
    baseline: 15,
    triggerEvent: "After-hours data access (2:15 AM - 2:43 AM)",
    dataVolume: "47 GB transferred",
    destination: "Personal cloud storage (non-corporate domain)",
    accessMethod: "VPN (remote connection)",
    device: "Corporate laptop (MAC: XX:XX:XX:XX:XX:47)",
  },
  contextualFlags: {
    organizationalChange: true,
    performanceReview: "[REDACTED - HR data] 🔒",
    departureRisk: "[REDACTED - HR data] 🔒",
  },
  timeline: [
    {
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // Yesterday 3:45 PM
      description:
        "[REDACTED USER] attended company all-hands meeting - Topic: Workforce reduction announcement (15% layoffs by Dec 31) - [HR Context: REDACTED - awaiting workroom access] 🔒",
      isRedacted: true,
      type: "context",
    },
    {
      timestamp: new Date(Date.now() - 23.5 * 60 * 60 * 1000), // Yesterday 5:30 PM
      description:
        "[REDACTED USER] emailed personal address - Subject: [REDACTED] 🔒 - Attachments: Resume.pdf (flagged by DLP, not blocked)",
      isRedacted: true,
      type: "activity",
    },
    {
      timestamp: new Date(Date.now() - 22.75 * 60 * 60 * 1000), // Yesterday 6:15 PM
      description:
        "[REDACTED USER] browsing activity - Sites: LinkedIn.com, Indeed.com (job search indicators)",
      isRedacted: true,
      type: "activity",
    },
    {
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // Yesterday 7:00 PM
      description: "[REDACTED USER] logged out (normal end of day)",
      isRedacted: true,
      type: "activity",
    },
    {
      timestamp: new Date(Date.now() - 10.75 * 60 * 60 * 1000), // Today 2:15 AM
      description:
        "[REDACTED USER] VPN login - Location: Dallas, TX (home IP address) - Device: Corporate laptop (MAC: XX:XX:XX:XX:XX:47) - Unusual: 5.5 hours outside normal work hours (8 AM - 6 PM)",
      isRedacted: true,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 10.7 * 60 * 60 * 1000), // Today 2:18 AM
      description:
        "File server access: \\\\FILESERVER\\CustomerData\\ - Files accessed: 2,300 Excel files, 850 PDFs - Total size: 47 GB - Unusual: 313x normal data access volume (baseline: 150 MB/day)",
      isRedacted: false,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 10.67 * 60 * 60 * 1000), // Today 2:20 AM
      description:
        "Upload to personal cloud storage - Destination: dropbox.com/personal/[REDACTED] - Duration: 23 minutes (2:20 AM - 2:43 AM) - Unusual: Non-corporate domain, personal account",
      isRedacted: true,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 10.28 * 60 * 60 * 1000), // Today 2:43 AM
      description: "Upload completed (47 GB transferred)",
      isRedacted: false,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 10.25 * 60 * 60 * 1000), // Today 2:45 AM
      description: "[REDACTED USER] logged out",
      isRedacted: true,
      type: "activity",
    },
    {
      timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 min ago
      description:
        "Foresight risk score threshold exceeded - Risk: 15 → 87 (580% increase) - Notable created automatically - CISO auto-notified (client config: immediate notification)",
      isRedacted: false,
      type: "trigger",
    },
  ],
  evidence: [
    { name: "Foresight logs (risk score history, 90 days)", collected: true, requiresConsent: false },
    { name: "Active Directory logs (login times, group memberships)", collected: true, requiresConsent: false },
    { name: "VPN logs (connection times, IP addresses, device IDs)", collected: true, requiresConsent: false },
    { name: "File server access logs (files accessed, timestamps)", collected: true, requiresConsent: false },
    {
      name: "DLP alerts (Dropbox upload detected, not blocked - monitor-only mode)",
      collected: true,
      requiresConsent: false,
    },
    { name: "Web proxy logs (browsing history, job search sites)", collected: true, requiresConsent: false },
    { name: "Email logs (external emails sent, last 30 days)", collected: true, requiresConsent: false },
    { name: "Endpoint forensic snapshot", collected: false, requiresConsent: true },
    { name: "HR records (performance reviews, PTO requests)", collected: false, requiresConsent: true },
  ],
  riskAnalysis: {
    confidence: 94,
    factors: [
      { name: "MOTIVE: Organizational change (layoff announcement)", weight: 35 },
      { name: "OPPORTUNITY: Elevated access privileges", weight: 20 },
      { name: "BEHAVIOR: After-hours activity (2 AM, outside 8-6 work hours)", weight: 25 },
      { name: "INTENT: Personal cloud storage (no business justification)", weight: 20 },
    ],
    recommendedActions: [
      "URGENT: Create triage workroom with CISO (user details revealed)",
      "URGENT: Assess containment need (disable account vs monitor)",
      "HIGH: Preserve forensic evidence (endpoint snapshot, memory dump)",
      "MEDIUM: Review other at-risk employees from layoff list",
    ],
  },
  privacySettings: {
    tier: "strict",
    geo: "United States (CCPA compliance required)",
    configuredDuring: "Onboarding (Day 15 - Privacy Policy Review)",
    maskingRules: {
      userIdentity: true,
      jobTitle: true,
      department: true,
      behavioralData: false,
    },
    notificationRules: {
      foresightHighRisk: "immediate",
      uebaMediumRisk: "mssp-first",
      dlpIncident: "immediate",
    },
    workroomAccessRules: {
      piiRevealedWhen: "MSSP creates workroom AND CISO approves access",
      authorizedRoles: ["MSSP Analyst", "Client CISO", "Legal", "HR"],
    },
  },
};

// Notable 2: SecureTech Industries - UEBA Anomaly
export const mockNotableSecureTech: UrgentNotable = {
  id: "notable-2",
  clientName: "SecureTech Industries",
  maturityScore: {
    score: 1.9,
    level: 1,
    levelName: "Ad Hoc",
  },
  notableType: "UEBA Anomaly - After-Hours Data Access",
  detectedAt: new Date(Date.now() - 65 * 60 * 1000), // 1 hr 5 min ago
  riskScore: 72,
  trigger: "Abnormal data access pattern (time: 3:00 AM, volume: 12 GB)",
  status: "needs_triage",
  clientNotification: {
    configured: false,
    notified: false,
    waitingFor: "MSSP triage decision",
  },
  clientConfig: "MSSP triages first, notify CISO only if incident",
  sourceSystem: "UEBA Platform (SecureTech)",
  alertId: "UEBA-4512",
  riskIndicators: {
    riskScore: 72,
    baseline: 22,
    triggerEvent: "After-hours data access (3:00 AM - 3:28 AM)",
    dataVolume: "12 GB transferred",
    destination: "External USB drive",
    accessMethod: "Physical access (office)",
    device: "Corporate workstation (DESK-SEC-047)",
  },
  contextualFlags: {
    organizationalChange: false,
    performanceReview: "[REDACTED - HR data] 🔒",
    departureRisk: "[REDACTED - HR data] 🔒",
  },
  timeline: [
    {
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // Today 3:00 AM
      description:
        "[REDACTED USER] badge swipe at office - Location: Building A, Floor 3 - Unusual: Weekend access, 3:00 AM",
      isRedacted: true,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 9.97 * 60 * 60 * 1000), // Today 3:02 AM
      description:
        "Workstation login: DESK-SEC-047 - [REDACTED USER] - Unusual: After-hours, weekend",
      isRedacted: true,
      type: "activity",
    },
    {
      timestamp: new Date(Date.now() - 9.93 * 60 * 60 * 1000), // Today 3:04 AM
      description:
        "File server access: \\\\FILESERVER\\Engineering\\Projects\\ - Files accessed: 450 CAD files, 120 specifications - Total size: 12 GB",
      isRedacted: false,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 9.87 * 60 * 60 * 1000), // Today 3:08 AM
      description:
        "USB device connected: External drive detected - Device ID: [REDACTED] - Transfer initiated",
      isRedacted: true,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 9.53 * 60 * 60 * 1000), // Today 3:28 AM
      description: "Data transfer completed (12 GB to USB) - USB device disconnected",
      isRedacted: false,
      type: "trigger",
    },
    {
      timestamp: new Date(Date.now() - 9.5 * 60 * 60 * 1000), // Today 3:30 AM
      description: "[REDACTED USER] logged out - Badge swipe exit recorded",
      isRedacted: true,
      type: "activity",
    },
    {
      timestamp: new Date(Date.now() - 65 * 60 * 1000), // 1 hr 5 min ago
      description:
        "UEBA anomaly threshold exceeded - Risk: 22 → 72 (227% increase) - Notable created automatically - CISO NOT notified (client config: MSSP triages first)",
      isRedacted: false,
      type: "trigger",
    },
  ],
  evidence: [
    { name: "UEBA logs (anomaly detection, 90 days)", collected: true, requiresConsent: false },
    { name: "Badge access logs (physical entry/exit)", collected: true, requiresConsent: false },
    { name: "Workstation logs (login times, applications used)", collected: true, requiresConsent: false },
    { name: "File server access logs (files accessed, timestamps)", collected: true, requiresConsent: false },
    { name: "USB device logs (connections, transfers)", collected: true, requiresConsent: false },
    { name: "Security camera footage", collected: false, requiresConsent: true },
    { name: "HR records", collected: false, requiresConsent: true },
  ],
  riskAnalysis: {
    confidence: 78,
    factors: [
      { name: "TIMING: After-hours weekend access (3 AM)", weight: 40 },
      { name: "VOLUME: Large data transfer (12 GB to USB)", weight: 30 },
      { name: "DESTINATION: Removable media (USB drive)", weight: 20 },
      { name: "PATTERN: First weekend access in 6 months", weight: 10 },
    ],
    recommendedActions: [
      "URGENT: Create triage workroom with CISO",
      "HIGH: Review security camera footage (if available)",
      "MEDIUM: Check for similar patterns in other employees",
      "LOW: Review USB device policy compliance",
    ],
  },
  privacySettings: {
    tier: "medium",
    geo: "United States (CCPA compliance required)",
    configuredDuring: "Onboarding (Day 15 - Privacy Policy Review)",
    maskingRules: {
      userIdentity: true,
      jobTitle: true,
      department: true,
      behavioralData: false,
    },
    notificationRules: {
      foresightHighRisk: "mssp-first",
      uebaMediumRisk: "mssp-first",
      dlpIncident: "immediate",
    },
    workroomAccessRules: {
      piiRevealedWhen: "MSSP creates workroom AND CISO approves access",
      authorizedRoles: ["MSSP Analyst", "Client CISO", "Legal"],
    },
  },
};

export const mockUrgentNotables: UrgentNotable[] = [mockNotableNorthstar, mockNotableSecureTech];

// Mock Workroom Participants
export const mockWorkroomParticipants = [
  {
    userId: "analyst-001",
    name: "MSSP Lead Analyst",
    email: "analyst@mssp.com",
    role: "mssp_analyst",
    organization: "mssp",
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
    email: "sarah.chen@client.com",
    role: "ciso",
    organization: "client",
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
    email: "james.wilson@client.com",
    role: "legal",
    organization: "client",
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
    email: "priya.patel@client.com",
    role: "hr",
    organization: "client",
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
