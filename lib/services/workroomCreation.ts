import { UrgentNotable } from "@/lib/mockData/msspPortfolioMockData";
import {
  IncidentRoom,
  RoomParticipant,
  TimelineEvent,
  EvidenceItem,
} from "@/lib/types/incidentRoom";

/**
 * Creates a new incident room from a notable alert
 * Generates unique room ID, initializes timeline, and sets up evidence collection
 */
export function createWorkroomFromNotable(
  notable: UrgentNotable,
  participants: RoomParticipant[]
): IncidentRoom {
  const roomId = generateRoomId();
  const now = new Date();

  // Generate user pseudonym
  const userPseudonym = `USER-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const incidentRoom: IncidentRoom = {
    id: roomId,
    clientId: `client-${notable.clientName.toLowerCase().replace(/\s+/g, "-")}`,
    clientName: notable.clientName,
    notableId: notable.id,
    stage: "triage",
    createdAt: now,
    createdBy: {
      userId: "analyst-001",
      name: "MSSP Lead Analyst",
      role: "mssp_analyst",
    },
    participants,
    timeline: generateInitialTimeline(roomId, notable, participants, now),
    evidence: generateInitialEvidence(notable, now),
    metadata: {
      incidentType: notable.notableType,
      riskScore: notable.riskScore,
      affectedUser: {
        pseudonym: userPseudonym,
        revealed: false,
      },
    },
  };

  // Store in session storage for demo purposes
  if (typeof window !== "undefined") {
    const existingRooms = sessionStorage.getItem("incident-rooms");
    const rooms = existingRooms ? JSON.parse(existingRooms) : {};
    rooms[roomId] = incidentRoom;
    sessionStorage.setItem("incident-rooms", JSON.stringify(rooms));
  }

  return incidentRoom;
}

/**
 * Generates a unique incident room ID
 * Format: INC-YYYY-####
 */
function generateRoomId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `INC-${year}-${random}`;
}

/**
 * Generates initial timeline events for the incident room
 */
function generateInitialTimeline(
  roomId: string,
  notable: UrgentNotable,
  participants: RoomParticipant[],
  now: Date
): TimelineEvent[] {
  const timeline: TimelineEvent[] = [];

  // Room created event
  timeline.push({
    id: `evt-${Date.now()}-1`,
    timestamp: now,
    type: "stage_change",
    actor: {
      userId: "analyst-001",
      name: "MSSP Lead Analyst",
      role: "mssp_analyst",
    },
    description: `Incident room ${roomId} created from notable alert ${notable.id}`,
    metadata: {
      previousStage: null,
      newStage: "triage",
      notableId: notable.id,
      riskScore: notable.riskScore,
    },
  });

  // Participants invited events
  participants.forEach((participant, index) => {
    timeline.push({
      id: `evt-${Date.now()}-${index + 2}`,
      timestamp: new Date(now.getTime() + (index + 1) * 1000),
      type: "comment",
      actor: {
        userId: "system",
        name: "System",
        role: "mssp_analyst",
      },
      description: `${participant.name} (${participant.role.replace(/_/g, " ").toUpperCase()}) invited to incident room`,
      metadata: {
        participantId: participant.userId,
        participantRole: participant.role,
      },
    });
  });

  // Evidence collection initiated
  timeline.push({
    id: `evt-${Date.now()}-${participants.length + 2}`,
    timestamp: new Date(now.getTime() + (participants.length + 1) * 1000),
    type: "evidence_added",
    actor: {
      userId: "system",
      name: "Automated Evidence Collection",
      role: "mssp_analyst",
    },
    description: "Auto-collection initiated for DLP logs, access patterns, and metadata",
    metadata: {
      evidenceCount: 6,
      collectionType: "automated",
    },
  });

  // Privacy notice
  timeline.push({
    id: `evt-${Date.now()}-${participants.length + 3}`,
    timestamp: new Date(now.getTime() + (participants.length + 2) * 1000),
    type: "comment",
    actor: {
      userId: "system",
      name: "Privacy System",
      role: "mssp_analyst",
    },
    description: "User identity REDACTED pending CISO approval for disclosure",
    metadata: {
      privacyTier: notable.privacySettings.tier,
      pseudonym: `USER-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    },
  });

  return timeline;
}

/**
 * Generates initial evidence items for the incident room
 */
function generateInitialEvidence(
  notable: UrgentNotable,
  now: Date
): EvidenceItem[] {
  const evidence: EvidenceItem[] = [];

  // Auto-collected evidence items
  const autoCollectedItems = [
    {
      fileName: "dlp-alerts-7days.json",
      category: "dlp_alert" as const,
      source: "DLP Platform",
      size: 245680,
    },
    {
      fileName: "user-access-patterns-90days.csv",
      category: "document" as const,
      source: "UEBA Platform",
      size: 189234,
    },
    {
      fileName: "file-download-history.log",
      category: "document" as const,
      source: "File Server Logs",
      size: 456123,
    },
    {
      fileName: "email-metadata.json",
      category: "email" as const,
      source: "Email Security Gateway",
      size: 98765,
    },
    {
      fileName: "vpn-connection-logs.log",
      category: "document" as const,
      source: "VPN Gateway",
      size: 134567,
    },
    {
      fileName: "active-directory-logs.evtx",
      category: "document" as const,
      source: "Active Directory",
      size: 287654,
    },
  ];

  autoCollectedItems.forEach((item, index) => {
    evidence.push({
      id: `evd-${Date.now()}-${index + 1}`,
      fileName: item.fileName,
      fileSize: item.size,
      fileType: item.fileName.split(".").pop() || "unknown",
      uploadedAt: new Date(now.getTime() + (index + 1) * 2000),
      uploadedBy: {
        userId: "system",
        name: "Automated Evidence Collection",
      },
      hash: generateMockHash(),
      category: item.category,
      metadata: {
        source: item.source,
        collectionMethod: "automated",
      },
    });
  });

  return evidence;
}

/**
 * Generates a mock SHA-256 hash for evidence chain of custody
 */
function generateMockHash(): string {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

/**
 * Retrieves an incident room by ID from session storage
 */
export function loadIncidentRoom(roomId: string): IncidentRoom | null {
  if (typeof window === "undefined") return null;

  const existingRooms = sessionStorage.getItem("incident-rooms");
  if (!existingRooms) return null;

  const rooms = JSON.parse(existingRooms);
  return rooms[roomId] || null;
}
