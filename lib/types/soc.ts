export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type AlertStatus = 'NEW' | 'ASSIGNED' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
export type ClientTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';

export interface Client {
  id: string;
  name: string;
  industry: string;
  tier: ClientTier;
  assetsMonitored: number;
  employeeCount: number;
  location: string;
  slaResponseMinutes: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    INFO: number;
  };
  healthScore: number;
  activeIncidents: number;
  monthlyAlerts: number;
}

export interface Alert {
  id: string;
  clientId: string;
  clientName: string;
  timestamp: Date;
  severity: AlertSeverity;
  status: AlertStatus;
  type: string;
  source: string;
  description: string;
  assignedTo?: string;
  slaDeadline: Date;
  minutesUntilSLA: number;
  isSLABreached: boolean;
}

export interface Incident {
  id: string;
  clientId: string;
  clientName: string;
  clientTier: ClientTier;
  severity: AlertSeverity;
  status: IncidentStatus;
  title: string;
  attackVector: string;
  createdAt: Date;
  updatedAt: Date;
  assignedAnalyst: string;
  affectedAssets: number;
  slaDeadline: Date;
  minutesUntilSLA: number;
  isSLABreached: boolean;
  investigationNotes: string[];
}

export interface Analyst {
  id: string;
  name: string;
  avatar?: string;
  status: 'ACTIVE' | 'AWAY' | 'BUSY';
  assignedAlerts: number;
  resolvedToday: number;
  avgResponseTimeMinutes: number;
}

export interface ThreatIntelligence {
  id: string;
  threatActor: string;
  campaignName: string;
  ttps: string[];
  affectedClients: number;
  iocMatches: number;
  severity: AlertSeverity;
  firstSeen: Date;
}

export interface GeoAttack {
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  alertCount: number;
  criticalCount: number;
}

export interface MetricsSummary {
  totalClients: number;
  activeAlerts: number;
  openIncidents: number;
  criticalIncidents: number;
  slaCompliance: number;
  slaBreaches: number;
  atRiskIncidents: number;
  avgMTTD: number;
  avgMTTR: number;
  coveragePercent: number;
  activeAnalysts: number;
  falsePositiveRate: number;
}
