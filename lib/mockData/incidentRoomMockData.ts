import { IncidentRoom, RoomParticipant, TimelineEvent, RoomStage } from '@/lib/types/incidentRoom';

// Helper functions
export function generatePseudonym(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return 'USER-' + Array.from({length: 5}, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export function getMSSPAnalystPermissions(stage: RoomStage) {
  return {
    canViewIdentity: stage !== 'triage', // REDACTED in triage
    canApproveIdentityDisclosure: false,
    canAccessHRRecords: false, // Never for MSSP
    canApproveHRAccess: false,
    canExecuteContainment: true,
    canApproveContainment: false,
    canExportEvidence: false, // Requires Legal approval
    canCloseRoom: false,
  };
}

export function getCISOPermissions(stage: RoomStage) {
  return {
    canViewIdentity: true, // Always (data controller)
    canApproveIdentityDisclosure: true, // Approval authority
    canAccessHRRecords: false, // Requires Legal approval
    canApproveHRAccess: false,
    canExecuteContainment: true,
    canApproveContainment: true, // Approval authority
    canExportEvidence: false, // Requires Legal approval
    canCloseRoom: true, // Final authority
  };
}

export function createIncidentRoomFromNotable(notableId: string, notable: { clientId?: string; clientName: string; notableType: string; riskScore: number; trigger: string }): IncidentRoom {
  const roomId = `IR-${Date.now()}`;
  const pseudonym = generatePseudonym();

  return {
    id: roomId,
    clientId: notable.clientId || 'NS-001',
    clientName: notable.clientName,
    notableId: notableId,
    stage: 'triage',
    createdAt: new Date(),
    createdBy: {
      userId: 'analyst-001',
      name: 'Sarah Chen',
      role: 'mssp_analyst',
    },
    participants: [
      {
        userId: 'analyst-001',
        name: 'Sarah Chen',
        email: 'sarah.chen@mssp.com',
        role: 'mssp_analyst',
        organization: 'mssp',
        joinedAt: new Date(),
        lastSeen: new Date(),
        permissions: getMSSPAnalystPermissions('triage'),
      },
      {
        userId: 'ciso-001',
        name: 'Michael Chen',
        email: 'michael.chen@client.com',
        role: 'ciso',
        organization: 'client',
        joinedAt: new Date(),
        lastSeen: new Date(),
        permissions: getCISOPermissions('triage'),
      },
    ],
    timeline: [
      {
        id: 'evt-001',
        timestamp: new Date(),
        type: 'alert',
        actor: {
          userId: 'system',
          name: 'Foresight UEBA',
          role: 'mssp_analyst',
        },
        description: `Incident Room created from Notable: ${notable.notableType}`,
        metadata: {
          notableId: notableId,
          riskScore: notable.riskScore,
          trigger: notable.trigger,
        },
      },
    ],
    evidence: [],
    metadata: {
      incidentType: notable.notableType,
      riskScore: notable.riskScore,
      affectedUser: {
        pseudonym: pseudonym,
        revealed: false,
      },
    },
  };
}

// Storage helpers (localStorage for MVP)
export function saveIncidentRoom(room: IncidentRoom): void {
  const rooms = JSON.parse(localStorage.getItem('incident_rooms') || '{}');
  rooms[room.id] = room;
  localStorage.setItem('incident_rooms', JSON.stringify(rooms));
}

export function loadIncidentRoom(roomId: string): IncidentRoom | null {
  const rooms = JSON.parse(localStorage.getItem('incident_rooms') || '{}');
  const room = rooms[roomId];

  if (!room) return null;

  // Convert date strings back to Date objects
  room.createdAt = new Date(room.createdAt);
  room.participants = room.participants.map((p: RoomParticipant) => ({
    ...p,
    joinedAt: new Date(p.joinedAt),
    lastSeen: new Date(p.lastSeen),
  }));
  room.timeline = room.timeline.map((evt: TimelineEvent) => ({
    ...evt,
    timestamp: new Date(evt.timestamp),
  }));

  // Convert realIdentity dates if identity is revealed
  if (room.metadata.affectedUser.revealed && room.metadata.affectedUser.realIdentity) {
    room.metadata.affectedUser.realIdentity.revealedAt = new Date(
      room.metadata.affectedUser.realIdentity.revealedAt
    );
  }

  return room;
}

export function updateIncidentRoom(room: IncidentRoom): void {
  saveIncidentRoom(room);
}
