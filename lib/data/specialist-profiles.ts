export type SpecialistRole =
  | 'forensic_analyst'
  | 'malware_analyst'
  | 'threat_intel'
  | 'legal_counsel'
  | 'hr_director'
  | 'hr_investigator'
  | 'compliance_officer'
  | 'data_protection'
  | 'incident_commander'
  | 'network_forensics'
  | 'endpoint_specialist'
  | 'cloud_security'
  | 'insider_threat';

export interface SpecialistProfile {
  userId: string;
  name: string;
  email: string;
  role: SpecialistRole;
  displayRole: string;
  organization: 'mssp' | 'client' | 'independent';
  expertise: string[];
  incidentTypes: string[];
  certifications: string[];
  availability: 'available' | 'busy' | 'away';
  responseTime: string;
  hourlyRate?: number; // Only for independent experts
  isIndependent?: boolean;
  // Expert selection features
  starRating?: number; // 1-5 stars
  incidentsSupported?: number; // Total incidents worked
  resolutionRate?: number; // 0-100 percentage
  averageResponseTimeHours?: number; // Actual average in hours
}

export const SPECIALIST_PROFILES: SpecialistProfile[] = [
  // Forensic Specialists
  {
    userId: 'forensic-001',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@forensics.mssp.com',
    role: 'forensic_analyst',
    displayRole: 'Senior Digital Forensics Analyst',
    organization: 'mssp',
    expertise: ['Disk forensics', 'Memory analysis', 'Timeline reconstruction', 'Evidence preservation'],
    incidentTypes: ['Data Exfiltration', 'Unauthorized Access', 'Insider Threat', 'Evidence Collection'],
    certifications: ['GCFA', 'EnCE', 'CCFP', 'Ph.D. Digital Forensics'],
    availability: 'available',
    responseTime: '< 30 min',
  },
  {
    userId: 'forensic-002',
    name: 'Marcus Chen',
    email: 'marcus.chen@forensics.mssp.com',
    role: 'network_forensics',
    displayRole: 'Network Forensics Specialist',
    organization: 'mssp',
    expertise: ['Network traffic analysis', 'PCAP analysis', 'C2 detection', 'Protocol analysis'],
    incidentTypes: ['Network Intrusion', 'C2 Communication', 'DDoS Attack', 'Lateral Movement'],
    certifications: ['GNFA', 'GCIA', 'CISSP'],
    availability: 'available',
    responseTime: '< 1 hour',
  },
  {
    userId: 'forensic-003',
    name: 'Sarah Okonkwo',
    email: 'sarah.okonkwo@forensics.mssp.com',
    role: 'endpoint_specialist',
    displayRole: 'Endpoint Forensics Specialist',
    organization: 'mssp',
    expertise: ['EDR analysis', 'Registry forensics', 'Process analysis', 'Artifact collection'],
    incidentTypes: ['Malware Infection', 'Ransomware', 'Privilege Escalation', 'Suspicious Process'],
    certifications: ['GCFE', 'GREM', 'OSCP'],
    availability: 'busy',
    responseTime: '2-4 hours',
  },

  // Malware Specialists
  {
    userId: 'malware-001',
    name: 'Dr. James Park',
    email: 'james.park@malware.mssp.com',
    role: 'malware_analyst',
    displayRole: 'Lead Malware Reverse Engineer',
    organization: 'mssp',
    expertise: ['Reverse engineering', 'Static analysis', 'Dynamic analysis', 'Sandbox evasion'],
    incidentTypes: ['Malware Infection', 'Ransomware', 'Zero-Day Exploit', 'Advanced Persistent Threat'],
    certifications: ['GREM', 'OSEE', 'GXPN', 'M.S. Malware Analysis'],
    availability: 'available',
    responseTime: '< 1 hour',
  },
  {
    userId: 'malware-002',
    name: 'Aisha Hassan',
    email: 'aisha.hassan@malware.mssp.com',
    role: 'malware_analyst',
    displayRole: 'Malware Intelligence Analyst',
    organization: 'mssp',
    expertise: ['Malware triage', 'IOC extraction', 'YARA rules', 'Behavioral analysis'],
    incidentTypes: ['Malware Infection', 'Phishing', 'Trojan Detection', 'Botnet Activity'],
    certifications: ['GCTI', 'GREM', 'CISSP'],
    availability: 'available',
    responseTime: '< 30 min',
  },

  // Threat Intelligence
  {
    userId: 'threat-001',
    name: 'Rachel Goldman',
    email: 'rachel.goldman@intel.mssp.com',
    role: 'threat_intel',
    displayRole: 'Senior Threat Intelligence Analyst',
    organization: 'mssp',
    expertise: ['APT tracking', 'Threat actor attribution', 'TTPs analysis', 'Strategic intelligence'],
    incidentTypes: ['Advanced Persistent Threat', 'Nation-State Attack', 'Supply Chain Attack', 'Targeted Attack'],
    certifications: ['GCTI', 'GIAC', 'CTIA'],
    availability: 'available',
    responseTime: '< 1 hour',
  },
  {
    userId: 'threat-002',
    name: 'David Zhang',
    email: 'david.zhang@intel.mssp.com',
    role: 'threat_intel',
    displayRole: 'Cyber Threat Intelligence Specialist',
    organization: 'mssp',
    expertise: ['OSINT', 'Dark web monitoring', 'Indicator analysis', 'Threat hunting'],
    incidentTypes: ['Data Breach', 'Credential Theft', 'Information Disclosure', 'Reconnaissance'],
    certifications: ['GCTI', 'OSINT Professional', 'SANS FOR578'],
    availability: 'available',
    responseTime: '< 2 hours',
  },

  // Legal Specialists
  {
    userId: 'legal-001',
    name: 'Victoria Blackwood',
    email: 'victoria.blackwood@legal.client.com',
    role: 'legal_counsel',
    displayRole: 'Senior Legal Counsel - Cybersecurity',
    organization: 'client',
    expertise: ['Cyber law', 'Data breach response', 'Regulatory compliance', 'Evidence handling'],
    incidentTypes: ['Data Breach', 'Data Exfiltration', 'Privacy Violation', 'Regulatory Incident'],
    certifications: ['LLB', 'CIPP/E', 'CIPM', 'Solicitor of England & Wales'],
    availability: 'available',
    responseTime: '< 2 hours',
    starRating: 4.8,
    incidentsSupported: 73,
    resolutionRate: 96,
    averageResponseTimeHours: 1.5,
  },
  {
    userId: 'legal-002',
    name: 'Michael Torres',
    email: 'michael.torres@legal.client.com',
    role: 'legal_counsel',
    displayRole: 'Legal Counsel - Employment Law',
    organization: 'client',
    expertise: ['Employment law', 'Internal investigations', 'Disciplinary procedures', 'Employee rights'],
    incidentTypes: ['Insider Threat', 'Policy Violation', 'Data Misuse', 'Unauthorized Access'],
    certifications: ['LLB', 'Employment Law Specialist', 'CIPD'],
    availability: 'busy',
    responseTime: '4-8 hours',
    starRating: 4.6,
    incidentsSupported: 58,
    resolutionRate: 94,
    averageResponseTimeHours: 5.2,
  },
  {
    userId: 'legal-003',
    name: 'Jennifer Lin',
    email: 'jennifer.lin@legal.client.com',
    role: 'data_protection',
    displayRole: 'Data Protection Officer',
    organization: 'client',
    expertise: ['GDPR compliance', 'UK GDPR & DPA 2018', 'Data subject rights', 'ICO breach notification'],
    incidentTypes: ['Data Breach', 'Privacy Violation', 'Data Exfiltration', 'Unauthorized Disclosure'],
    certifications: ['CIPP/E', 'CIPM', 'CIPT', 'ICO Registered DPO'],
    availability: 'available',
    responseTime: '< 1 hour',
    starRating: 4.9,
    incidentsSupported: 89,
    resolutionRate: 98,
    averageResponseTimeHours: 0.8,
  },

  // HR Specialists
  {
    userId: 'hr-001',
    name: 'Patricia Wilson',
    email: 'patricia.wilson@hr.client.com',
    role: 'hr_director',
    displayRole: 'HR Director',
    organization: 'client',
    expertise: ['Employee relations', 'Disciplinary action', 'Personnel records', 'Dismissal procedures'],
    incidentTypes: ['Insider Threat', 'Policy Violation', 'Workplace Misconduct', 'Security Breach'],
    certifications: ['CIPD Level 7', 'MCIPD', 'Employment Law'],
    availability: 'available',
    responseTime: '< 1 hour',
    starRating: 4.7,
    incidentsSupported: 64,
    resolutionRate: 95,
    averageResponseTimeHours: 0.9,
  },
  {
    userId: 'hr-002',
    name: 'Robert Kumar',
    email: 'robert.kumar@hr.client.com',
    role: 'hr_investigator',
    displayRole: 'HR Investigations Specialist',
    organization: 'client',
    expertise: ['Internal investigations', 'Employee interviews', 'Case documentation', 'Misconduct analysis'],
    incidentTypes: ['Insider Threat', 'Policy Violation', 'Fraud', 'Data Misuse'],
    certifications: ['CIPD Level 5', 'Certified Fraud Examiner', 'Workplace Investigator'],
    availability: 'available',
    responseTime: '< 2 hours',
    starRating: 4.8,
    incidentsSupported: 82,
    resolutionRate: 97,
    averageResponseTimeHours: 1.3,
  },
  {
    userId: 'hr-003',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@hr.client.com',
    role: 'hr_investigator',
    displayRole: 'Senior HR Business Partner',
    organization: 'client',
    expertise: ['Performance management', 'Employee counseling', 'Risk assessment', 'Crisis management'],
    incidentTypes: ['Insider Threat', 'Behavioral Risk', 'Policy Violation', 'Workplace Security'],
    certifications: ['CIPD Level 7', 'MCIPD', 'Crisis Management'],
    availability: 'busy',
    responseTime: '2-4 hours',
    starRating: 4.5,
    incidentsSupported: 51,
    resolutionRate: 92,
    averageResponseTimeHours: 2.8,
  },

  // Compliance & Risk
  {
    userId: 'compliance-001',
    name: 'Thomas Wright',
    email: 'thomas.wright@compliance.client.com',
    role: 'compliance_officer',
    displayRole: 'Chief Compliance Officer',
    organization: 'client',
    expertise: ['Regulatory compliance', 'Risk assessment', 'Audit management', 'Policy enforcement'],
    incidentTypes: ['Regulatory Incident', 'Compliance Violation', 'Data Breach', 'Audit Finding'],
    certifications: ['CCEP', 'CISA', 'CRISC', 'MBA'],
    availability: 'available',
    responseTime: '< 2 hours',
  },
  {
    userId: 'compliance-002',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@compliance.client.com',
    role: 'compliance_officer',
    displayRole: 'IT Compliance Manager',
    organization: 'client',
    expertise: ['Security frameworks', 'ISO 27001', 'SOC 2', 'Control testing'],
    incidentTypes: ['Security Control Failure', 'Compliance Violation', 'Audit Finding', 'Policy Breach'],
    certifications: ['CISA', 'CRISC', 'ISO 27001 Lead Auditor'],
    availability: 'available',
    responseTime: '< 1 hour',
  },

  // Cloud & Infrastructure
  {
    userId: 'cloud-001',
    name: 'Kevin Patel',
    email: 'kevin.patel@cloud.mssp.com',
    role: 'cloud_security',
    displayRole: 'Cloud Security Architect',
    organization: 'mssp',
    expertise: ['AWS security', 'Azure security', 'Cloud forensics', 'Container security'],
    incidentTypes: ['Cloud Breach', 'Misconfiguration', 'Data Exposure', 'API Abuse'],
    certifications: ['CCSP', 'AWS Security Specialty', 'Azure Security Engineer'],
    availability: 'available',
    responseTime: '< 1 hour',
  },
  {
    userId: 'cloud-002',
    name: 'Angela Wu',
    email: 'angela.wu@cloud.mssp.com',
    role: 'cloud_security',
    displayRole: 'Cloud Incident Response Specialist',
    organization: 'mssp',
    expertise: ['Cloud IR', 'Log analysis', 'Identity compromise', 'Cloud SIEM'],
    incidentTypes: ['Cloud Breach', 'Account Compromise', 'Data Exfiltration', 'Privilege Escalation'],
    certifications: ['GCFA', 'CCSP', 'GCP Security Engineer'],
    availability: 'available',
    responseTime: '< 30 min',
  },

  // Insider Threat Specialists
  {
    userId: 'insider-001',
    name: 'Daniel Freeman',
    email: 'daniel.freeman@insider.mssp.com',
    role: 'insider_threat',
    displayRole: 'Insider Threat Program Manager',
    organization: 'mssp',
    expertise: ['Behavioral analysis', 'UEBA', 'Risk indicators', 'Investigation coordination'],
    incidentTypes: ['Insider Threat', 'Data Exfiltration', 'Policy Violation', 'Suspicious Behavior'],
    certifications: ['ITPM', 'CTIA', 'Behavioral Analysis'],
    availability: 'available',
    responseTime: '< 30 min',
  },
  {
    userId: 'insider-002',
    name: 'Megan Richardson',
    email: 'megan.richardson@insider.mssp.com',
    role: 'insider_threat',
    displayRole: 'Insider Threat Analyst',
    organization: 'mssp',
    expertise: ['User activity monitoring', 'Anomaly detection', 'DLP investigation', 'Case management'],
    incidentTypes: ['Insider Threat', 'Data Misuse', 'Intellectual Property Theft', 'Unauthorized Access'],
    certifications: ['GCTI', 'CFCE', 'Insider Threat Specialist'],
    availability: 'available',
    responseTime: '< 1 hour',
  },

  // Incident Command
  {
    userId: 'commander-001',
    name: 'Colonel (Ret.) James Mitchell',
    email: 'james.mitchell@command.mssp.com',
    role: 'incident_commander',
    displayRole: 'Chief Incident Commander',
    organization: 'mssp',
    expertise: ['Crisis management', 'Incident coordination', 'Executive communication', 'Strategic planning'],
    incidentTypes: ['Major Incident', 'Crisis Response', 'Multi-vector Attack', 'Executive Escalation'],
    certifications: ['CISSP', 'CISM', 'Crisis Management', 'Military Command'],
    availability: 'available',
    responseTime: '< 15 min',
  },

  // Independent Experts - On-Call HR Specialists
  {
    userId: 'independent-hr-001',
    name: 'Dr. Catherine Brooks',
    email: 'contact@independenthr.secure', // Masked email
    role: 'hr_investigator',
    displayRole: 'Independent HR Investigations Consultant',
    organization: 'independent',
    expertise: ['Workplace investigations', 'Conflict resolution', 'Employee rights', 'Crisis intervention'],
    incidentTypes: ['Insider Threat', 'Workplace Misconduct', 'Policy Violation', 'Employee Dispute'],
    certifications: ['CIPD Level 7', 'MCIPD', 'Certified Workplace Investigator', 'Ph.D. Organizational Psychology'],
    availability: 'available',
    responseTime: '< 2 hours',
    hourlyRate: 350,
    isIndependent: true,
    starRating: 4.9,
    incidentsSupported: 47,
    resolutionRate: 95,
    averageResponseTimeHours: 1.2,
  },
  {
    userId: 'independent-hr-002',
    name: 'Marcus Webb',
    email: 'contact@independenthr.secure',
    role: 'hr_director',
    displayRole: 'Independent HR Crisis Specialist',
    organization: 'independent',
    expertise: ['Executive coaching', 'Dismissal procedures', 'Risk mitigation', 'Sensitive investigations'],
    incidentTypes: ['Insider Threat', 'Executive Misconduct', 'Harassment Claims', 'Fraud Investigation'],
    certifications: ['FCIPD', 'CIPD Level 7', 'Crisis HR Specialist'],
    availability: 'available',
    responseTime: '< 1 hour',
    hourlyRate: 425,
    isIndependent: true,
    starRating: 5.0,
    incidentsSupported: 62,
    resolutionRate: 99,
    averageResponseTimeHours: 0.7,
  },
  {
    userId: 'independent-hr-003',
    name: 'Yuki Tanaka',
    email: 'contact@independenthr.secure',
    role: 'hr_investigator',
    displayRole: 'Independent Employee Relations Expert',
    organization: 'independent',
    expertise: ['Mediation', 'Internal investigations', 'Documentation', 'Witness interviews'],
    incidentTypes: ['Policy Violation', 'Workplace Conflict', 'Insider Threat', 'Data Misuse'],
    certifications: ['CIPD Level 5', 'Certified Mediator', 'Employment Law'],
    availability: 'busy',
    responseTime: '4-6 hours',
    hourlyRate: 295,
    isIndependent: true,
    starRating: 4.6,
    incidentsSupported: 35,
    resolutionRate: 93,
    averageResponseTimeHours: 4.5,
  },

  // Independent Experts - On-Call Legal Specialists
  {
    userId: 'independent-legal-001',
    name: 'Jonathan Hartley KC',
    email: 'contact@independentlegal.secure',
    role: 'legal_counsel',
    displayRole: 'Independent Cybersecurity Law Consultant',
    organization: 'independent',
    expertise: ['Cyber law', 'Data breach litigation', 'Regulatory defense', 'Crisis legal strategy'],
    incidentTypes: ['Data Breach', 'Regulatory Incident', 'Litigation Risk', 'Privacy Violation'],
    certifications: ['LLB', 'King\'s Counsel', 'CIPP/E', 'CIPM', 'Solicitor of England & Wales'],
    availability: 'available',
    responseTime: '< 1 hour',
    hourlyRate: 650,
    isIndependent: true,
    starRating: 5.0,
    incidentsSupported: 91,
    resolutionRate: 98,
    averageResponseTimeHours: 0.8,
  },
  {
    userId: 'independent-legal-002',
    name: 'Dr. Amara Okafor',
    email: 'contact@independentlegal.secure',
    role: 'data_protection',
    displayRole: 'Independent Privacy Law Expert',
    organization: 'independent',
    expertise: ['GDPR compliance', 'Privacy impact assessments', 'Data breach response', 'UK GDPR & DPA 2018'],
    incidentTypes: ['Data Breach', 'Privacy Violation', 'GDPR Violation', 'Cross-border Data Transfer'],
    certifications: ['LLB', 'CIPP/E', 'CIPM', 'CIPT', 'ICO Registered DPO'],
    availability: 'available',
    responseTime: '< 2 hours',
    hourlyRate: 475,
    isIndependent: true,
    starRating: 4.9,
    incidentsSupported: 78,
    resolutionRate: 97,
    averageResponseTimeHours: 1.4,
  },
  {
    userId: 'independent-legal-003',
    name: 'Rebecca Stone',
    email: 'contact@independentlegal.secure',
    role: 'legal_counsel',
    displayRole: 'Independent Employment Law Specialist',
    organization: 'independent',
    expertise: ['Employment law', 'Unfair dismissal', 'Discrimination cases', 'Employment tribunals'],
    incidentTypes: ['Insider Threat', 'Wrongful Termination Risk', 'Employee Rights', 'Disciplinary Action'],
    certifications: ['LLB', 'Employment Law Specialist', 'CIPD', 'Solicitor of England & Wales'],
    availability: 'available',
    responseTime: '< 3 hours',
    hourlyRate: 395,
    isIndependent: true,
    starRating: 4.7,
    incidentsSupported: 54,
    resolutionRate: 94,
    averageResponseTimeHours: 2.1,
  },
  {
    userId: 'independent-legal-004',
    name: 'Prof. Alexander Nguyen',
    email: 'contact@independentlegal.secure',
    role: 'legal_counsel',
    displayRole: 'Independent Incident Response Legal Advisor',
    organization: 'independent',
    expertise: ['Incident response law', 'Evidence preservation', 'Legal holds', 'Forensic admissibility'],
    incidentTypes: ['Major Incident', 'Evidence Collection', 'Litigation Preparation', 'Regulatory Investigation'],
    certifications: ['LLB', 'CISSP', 'GCFA', 'Professor of Cyber Law'],
    availability: 'away',
    responseTime: 'Next day',
    hourlyRate: 550,
    isIndependent: true,
    starRating: 4.8,
    incidentsSupported: 43,
    resolutionRate: 96,
    averageResponseTimeHours: 18.0,
  },
];

export function searchSpecialists(
  searchTerm: string,
  options?: {
    role?: SpecialistRole;
    organization?: 'mssp' | 'client';
    availableOnly?: boolean;
  }
): SpecialistProfile[] {
  const term = searchTerm.toLowerCase();

  return SPECIALIST_PROFILES.filter(profile => {
    // Filter by role if specified
    if (options?.role && profile.role !== options.role) {
      return false;
    }

    // Filter by organization if specified
    if (options?.organization && profile.organization !== options.organization) {
      return false;
    }

    // Filter by availability if specified
    if (options?.availableOnly && profile.availability !== 'available') {
      return false;
    }

    // Search across multiple fields
    const searchableText = [
      profile.name,
      profile.displayRole,
      profile.email,
      ...profile.expertise,
      ...profile.incidentTypes,
      ...profile.certifications,
    ].join(' ').toLowerCase();

    return searchableText.includes(term);
  });
}

export function getSpecialistsByIncidentType(incidentType: string): SpecialistProfile[] {
  return SPECIALIST_PROFILES.filter(profile =>
    profile.incidentTypes.some(type =>
      type.toLowerCase().includes(incidentType.toLowerCase()) ||
      incidentType.toLowerCase().includes(type.toLowerCase())
    )
  ).sort((a, b) => {
    // Sort by availability (available first)
    if (a.availability === 'available' && b.availability !== 'available') return -1;
    if (a.availability !== 'available' && b.availability === 'available') return 1;
    return 0;
  });
}

export function getSpecialistById(userId: string): SpecialistProfile | undefined {
  return SPECIALIST_PROFILES.find(profile => profile.userId === userId);
}
