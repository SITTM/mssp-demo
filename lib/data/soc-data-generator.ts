import {
  Client,
  Alert,
  Incident,
  Analyst,
  ThreatIntelligence,
  GeoAttack,
  MetricsSummary,
  AlertSeverity,
  AlertStatus,
  IncidentStatus,
  ClientTier,
} from '@/lib/types/soc';

const INDUSTRIES = [
  'Financial Services', 'Healthcare', 'Technology', 'Manufacturing',
  'Retail', 'Energy', 'Transportation', 'Education', 'Government',
  'Telecommunications', 'Media', 'Pharmaceuticals', 'Insurance',
  'Real Estate', 'Legal Services', 'Consulting'
];

const COMPANY_PREFIXES = [
  'Global', 'National', 'Premier', 'United', 'First', 'Advanced',
  'Strategic', 'Elite', 'Summit', 'Nexus', 'Apex', 'Zenith', 'Prime'
];

const COMPANY_SUFFIXES = [
  'Corp', 'Industries', 'Solutions', 'Systems', 'Group', 'Enterprises',
  'Holdings', 'Partners', 'Technologies', 'Services', 'International', 'Ltd'
];

const ALERT_TYPES = [
  'Malware Detection', 'Phishing Attempt', 'Brute Force Attack',
  'Unauthorized Access', 'Data Exfiltration', 'Port Scan',
  'DDoS Attack', 'Privilege Escalation', 'Lateral Movement',
  'Suspicious Process', 'Web Shell Detected', 'C2 Communication',
  'Ransomware Activity', 'Credential Theft', 'SQL Injection'
];

const SOURCES = [
  'EDR', 'SIEM', 'Firewall', 'IDS/IPS', 'Email Gateway',
  'Web Proxy', 'Cloud Security', 'Network Monitor', 'DLP',
  'Endpoint Agent', 'Threat Intelligence', 'CASB'
];

const ATTACK_VECTORS = [
  'Email Phishing', 'Exploit Kit', 'Compromised Credentials',
  'SQL Injection', 'Remote Code Execution', 'Zero-Day Exploit',
  'Social Engineering', 'Supply Chain', 'Insider Threat',
  'Drive-by Download', 'Watering Hole', 'Brute Force'
];

const THREAT_ACTORS = [
  'APT28', 'APT29', 'Lazarus Group', 'FIN7', 'Wizard Spider',
  'Sandworm', 'Carbanak', 'OilRig', 'Turla', 'Evil Corp'
];

const ANALYST_NAMES = [
  'Sarah Chen', 'Marcus Johnson', 'Priya Patel', 'James Wilson',
  'Aisha Mohammed', 'Carlos Rodriguez', 'Emily Taylor', 'David Kim',
  'Rachel Brown', 'Ahmed Hassan', 'Lisa Anderson', 'Tom Mitchell'
];

const LOCATIONS = [
  { country: 'United States', code: 'US', lat: 37.0902, lng: -95.7129 },
  { country: 'United Kingdom', code: 'GB', lat: 55.3781, lng: -3.4360 },
  { country: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515 },
  { country: 'France', code: 'FR', lat: 46.2276, lng: 2.2137 },
  { country: 'Canada', code: 'CA', lat: 56.1304, lng: -106.3468 },
  { country: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751 },
  { country: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529 },
  { country: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198 },
  { country: 'Netherlands', code: 'NL', lat: 52.1326, lng: 5.2913 },
  { country: 'Sweden', code: 'SE', lat: 60.1282, lng: 18.6435 },
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateClients(count: number = 150): Client[] {
  const clients: Client[] = [];
  const tiers: ClientTier[] = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'];
  const tierWeights = [0.05, 0.15, 0.35, 0.45]; // Distribution

  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let tier: ClientTier = 'BRONZE';
    let cumulative = 0;
    for (let j = 0; j < tierWeights.length; j++) {
      cumulative += tierWeights[j];
      if (rand < cumulative) {
        tier = tiers[j];
        break;
      }
    }

    const slaBase = {
      PLATINUM: { CRITICAL: 15, HIGH: 30, MEDIUM: 60, LOW: 240, INFO: 480 },
      GOLD: { CRITICAL: 30, HIGH: 60, MEDIUM: 120, LOW: 480, INFO: 960 },
      SILVER: { CRITICAL: 60, HIGH: 120, MEDIUM: 240, LOW: 720, INFO: 1440 },
      BRONZE: { CRITICAL: 120, HIGH: 240, MEDIUM: 480, LOW: 1440, INFO: 2880 },
    };

    clients.push({
      id: `client-${i + 1}`,
      name: `${randomItem(COMPANY_PREFIXES)} ${randomItem(COMPANY_SUFFIXES)}`,
      industry: randomItem(INDUSTRIES),
      tier,
      assetsMonitored: randomInt(50, tier === 'PLATINUM' ? 5000 : tier === 'GOLD' ? 2000 : tier === 'SILVER' ? 500 : 200),
      employeeCount: randomInt(100, tier === 'PLATINUM' ? 10000 : tier === 'GOLD' ? 5000 : tier === 'SILVER' ? 1000 : 500),
      location: randomItem(LOCATIONS).country,
      slaResponseMinutes: slaBase[tier],
      healthScore: randomInt(65, 98),
      activeIncidents: Math.random() < 0.3 ? randomInt(0, 3) : 0,
      monthlyAlerts: randomInt(10, 500),
    });
  }

  return clients;
}

export function generateAlerts(clients: Client[], count: number = 250): Alert[] {
  const alerts: Alert[] = [];
  const statuses: AlertStatus[] = ['NEW', 'ASSIGNED', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'];
  const statusWeights = [0.3, 0.25, 0.2, 0.15, 0.1];
  const severities: AlertSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
  const severityWeights = [0.05, 0.15, 0.35, 0.30, 0.15];

  for (let i = 0; i < count; i++) {
    const client = randomItem(clients);

    let rand = Math.random();
    let severity: AlertSeverity = 'LOW';
    let cumulative = 0;
    for (let j = 0; j < severityWeights.length; j++) {
      cumulative += severityWeights[j];
      if (rand < cumulative) {
        severity = severities[j];
        break;
      }
    }

    rand = Math.random();
    let status: AlertStatus = 'NEW';
    cumulative = 0;
    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j];
      if (rand < cumulative) {
        status = statuses[j];
        break;
      }
    }

    const timestamp = new Date(Date.now() - randomInt(0, 12 * 60 * 60 * 1000));
    const slaMinutes = client.slaResponseMinutes[severity];
    const slaDeadline = new Date(timestamp.getTime() + slaMinutes * 60 * 1000);
    const minutesUntilSLA = Math.floor((slaDeadline.getTime() - Date.now()) / 60000);
    const isSLABreached = minutesUntilSLA < 0;

    alerts.push({
      id: `alert-${i + 1}`,
      clientId: client.id,
      clientName: client.name,
      timestamp,
      severity,
      status,
      type: randomItem(ALERT_TYPES),
      source: randomItem(SOURCES),
      description: `${randomItem(ALERT_TYPES)} detected on ${randomItem(['workstation', 'server', 'endpoint', 'network device'])}`,
      assignedTo: status !== 'NEW' ? randomItem(ANALYST_NAMES) : undefined,
      slaDeadline,
      minutesUntilSLA,
      isSLABreached,
    });
  }

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateIncidents(clients: Client[], count: number = 45): Incident[] {
  const incidents: Incident[] = [];
  const statuses: IncidentStatus[] = ['OPEN', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED'];
  const statusWeights = [0.2, 0.35, 0.2, 0.15, 0.1];
  const severities: AlertSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM'];
  const severityWeights = [0.15, 0.45, 0.40];

  for (let i = 0; i < count; i++) {
    const client = randomItem(clients);

    let rand = Math.random();
    let severity: AlertSeverity = 'MEDIUM';
    let cumulative = 0;
    for (let j = 0; j < severityWeights.length; j++) {
      cumulative += severityWeights[j];
      if (rand < cumulative) {
        severity = severities[j];
        break;
      }
    }

    rand = Math.random();
    let status: IncidentStatus = 'INVESTIGATING';
    cumulative = 0;
    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j];
      if (rand < cumulative) {
        status = statuses[j];
        break;
      }
    }

    const createdAt = new Date(Date.now() - randomInt(0, 48 * 60 * 60 * 1000));
    const updatedAt = new Date(createdAt.getTime() + randomInt(0, Date.now() - createdAt.getTime()));
    const slaMinutes = client.slaResponseMinutes[severity];
    const slaDeadline = new Date(createdAt.getTime() + slaMinutes * 60 * 1000);
    const minutesUntilSLA = Math.floor((slaDeadline.getTime() - Date.now()) / 60000);
    const isSLABreached = minutesUntilSLA < 0 && status !== 'CLOSED' && status !== 'RESOLVED';

    const attackVector = randomItem(ATTACK_VECTORS);
    incidents.push({
      id: `inc-${String(i + 1).padStart(4, '0')}`,
      clientId: client.id,
      clientName: client.name,
      clientTier: client.tier,
      severity,
      status,
      title: `${attackVector} - ${randomItem(ALERT_TYPES)}`,
      attackVector,
      createdAt,
      updatedAt,
      assignedAnalyst: randomItem(ANALYST_NAMES),
      affectedAssets: randomInt(1, 25),
      slaDeadline,
      minutesUntilSLA,
      isSLABreached,
      investigationNotes: [
        'Initial triage completed',
        'Evidence collected from affected systems',
        status === 'INVESTIGATING' || status === 'CONTAINED' ? 'Containment measures applied' : '',
      ].filter(Boolean),
    });
  }

  return incidents.sort((a, b) => {
    if (a.isSLABreached && !b.isSLABreached) return -1;
    if (!a.isSLABreached && b.isSLABreached) return 1;
    return a.minutesUntilSLA - b.minutesUntilSLA;
  });
}

export function generateAnalysts(): Analyst[] {
  return ANALYST_NAMES.map((name, i) => ({
    id: `analyst-${i + 1}`,
    name,
    avatar: undefined,
    status: Math.random() < 0.8 ? 'ACTIVE' : Math.random() < 0.5 ? 'BUSY' : 'AWAY',
    assignedAlerts: randomInt(2, 15),
    resolvedToday: randomInt(5, 30),
    avgResponseTimeMinutes: randomInt(8, 45),
  }));
}

export function generateThreatIntel(): ThreatIntelligence[] {
  return THREAT_ACTORS.slice(0, 6).map((actor, i) => ({
    id: `threat-${i + 1}`,
    threatActor: actor,
    campaignName: `Operation ${['Shadow', 'Ghost', 'Phantom', 'Storm', 'Viper', 'Cobra'][i]}`,
    ttps: ['T1566.001', 'T1059.001', 'T1071.001'].slice(0, randomInt(2, 3)),
    affectedClients: randomInt(1, 8),
    iocMatches: randomInt(5, 50),
    severity: randomItem(['CRITICAL', 'HIGH', 'MEDIUM'] as AlertSeverity[]),
    firstSeen: new Date(Date.now() - randomInt(0, 14 * 24 * 60 * 60 * 1000)),
  }));
}

export function generateGeoAttacks(): GeoAttack[] {
  return LOCATIONS.map(loc => ({
    country: loc.country,
    countryCode: loc.code,
    lat: loc.lat,
    lng: loc.lng,
    alertCount: randomInt(5, 150),
    criticalCount: randomInt(0, 15),
  })).sort((a, b) => b.alertCount - a.alertCount);
}

export function calculateMetrics(
  clients: Client[],
  alerts: Alert[],
  incidents: Incident[],
  analysts: Analyst[]
): MetricsSummary {
  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
  const openIncidents = incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length;
  const slaBreaches = incidents.filter(i => i.isSLABreached).length;
  const atRiskIncidents = incidents.filter(i => !i.isSLABreached && i.minutesUntilSLA < 30 && i.status !== 'CLOSED').length;
  const totalIncidents = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const slaCompliance = totalIncidents > 0 ? ((totalIncidents - slaBreaches) / totalIncidents) * 100 : 98.5;
  const activeAnalysts = analysts.filter(a => a.status === 'ACTIVE').length;
  const falsePositives = alerts.filter(a => a.status === 'FALSE_POSITIVE').length;
  const falsePositiveRate = alerts.length > 0 ? (falsePositives / alerts.length) * 100 : 5.2;

  return {
    totalClients: clients.length,
    activeAlerts,
    openIncidents,
    criticalIncidents,
    slaCompliance: Math.round(slaCompliance * 10) / 10,
    slaBreaches,
    atRiskIncidents,
    avgMTTD: randomFloat(8, 18),
    avgMTTR: randomFloat(45, 120),
    coveragePercent: randomFloat(94, 99.5),
    activeAnalysts,
    falsePositiveRate: Math.round(falsePositiveRate * 10) / 10,
  };
}

// Singleton instance for consistent data across components
let dataCache: {
  clients: Client[];
  alerts: Alert[];
  incidents: Incident[];
  analysts: Analyst[];
  threatIntel: ThreatIntelligence[];
  geoAttacks: GeoAttack[];
  metrics: MetricsSummary;
} | null = null;

export function getSOCData() {
  if (!dataCache) {
    const clients = generateClients(150);
    const alerts = generateAlerts(clients, 250);
    const incidents = generateIncidents(clients, 45);
    const analysts = generateAnalysts();
    const threatIntel = generateThreatIntel();
    const geoAttacks = generateGeoAttacks();
    const metrics = calculateMetrics(clients, alerts, incidents, analysts);

    dataCache = {
      clients,
      alerts,
      incidents,
      analysts,
      threatIntel,
      geoAttacks,
      metrics,
    };
  }

  return dataCache;
}

// Force regenerate data
export function refreshSOCData() {
  dataCache = null;
  return getSOCData();
}
