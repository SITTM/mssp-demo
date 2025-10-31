// Incident Room Core Types
export type RoomStage = 'triage' | 'containment' | 'investigation' | 'remediation' | 'closed';
export type RoomRole = 'mssp_analyst' | 'ciso' | 'legal' | 'hr' | 'forensics' | 'observer';
export type ApprovalStatus = 'pending' | 'approved' | 'denied';

export interface IncidentRoom {
  id: string;
  clientId: string;
  clientName: string;
  notableId: string; // Links back to original notable that triggered room
  stage: RoomStage;
  createdAt: Date;
  createdBy: {
    userId: string;
    name: string;
    role: RoomRole;
  };
  participants: RoomParticipant[];
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  metadata: {
    incidentType: string;
    riskScore: number;
    affectedUser: {
      pseudonym: string; // e.g., "USER-47A2B"
      revealed: boolean;
      realIdentity?: {
        name: string;
        email: string;
        department: string;
        revealedAt: Date;
        revealedBy: string;
        justification: string;
      };
    };
  };
}

export interface RoomParticipant {
  userId: string;
  name: string;
  email: string;
  role: RoomRole;
  organization: 'mssp' | 'client' | 'independent';
  joinedAt: Date;
  lastSeen: Date;
  permissions: RoomPermissions;
}

export interface RoomPermissions {
  canViewIdentity: boolean;
  canApproveIdentityDisclosure: boolean;
  canAccessHRRecords: boolean;
  canApproveHRAccess: boolean;
  canExecuteContainment: boolean;
  canApproveContainment: boolean;
  canExportEvidence: boolean;
  canCloseRoom: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'alert' | 'approval' | 'containment' | 'evidence_added' | 'comment' | 'stage_change';
  actor: {
    userId: string;
    name: string;
    role: RoomRole;
  };
  description: string;
  metadata?: Record<string, unknown>;
}

export interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: {
    userId: string;
    name: string;
  };
  hash: string; // SHA-256 for chain of custody
  category: 'dlp_alert' | 'email' | 'forensic_image' | 'screenshot' | 'document' | 'other';
  metadata: {
    source: string;
    collectionMethod: string;
  };
}

export interface ApprovalRequest {
  id: string;
  type: 'identity_disclosure' | 'hr_data_access' | 'evidence_export' | 'containment';
  requestedBy: {
    userId: string;
    name: string;
    role: RoomRole;
  };
  requestedAt: Date;
  status: ApprovalStatus;
  approver?: {
    userId: string;
    name: string;
    role: RoomRole;
  };
  approvedAt?: Date;
  justification?: string;
  metadata?: Record<string, unknown>;
}
