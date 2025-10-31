'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSOCData } from '@/lib/data/soc-data-generator';
import { InsiderPortfolioWidget } from '@/components/mssp/InsiderPortfolioWidget';
import {
  mockHeartbeat,
  initialPortfolioHealth,
  initialPriorityActions,
  simulatedPortfolioHealth,
  simulatedPriorityActions,
} from '@/lib/mockData/msspPortfolioMockData';
import {
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Activity,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function WallboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [portfolioHealth, setPortfolioHealth] = useState(initialPortfolioHealth);
  const [priorityActions, setPriorityActions] = useState(initialPriorityActions);
  const [data, setData] = useState<ReturnType<typeof getSOCData> | null>(null);

  useEffect(() => {
    // Initialize data and time on client only to avoid hydration mismatch
    setData(getSOCData());
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateIncident = () => {
    setPortfolioHealth(simulatedPortfolioHealth);
    setPriorityActions(simulatedPriorityActions);
  };

  const criticalAlerts = data?.alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED') || [];
  const highAlerts = data?.alerts.filter(a => a.severity === 'HIGH' && a.status !== 'RESOLVED') || [];
  const slaBreachedIncidents = data?.incidents.filter(i => i.isSLABreached) || [];
  const atRiskIncidents = data?.incidents.filter(i => !i.isSLABreached && i.minutesUntilSLA < 30) || [];

  const topAffectedClients = data?.clients
    .filter(c => c.activeIncidents > 0)
    .sort((a, b) => b.activeIncidents - a.activeIncidents)
    .slice(0, 5) || [];

  const topGeoAttacks = data?.geoAttacks.slice(0, 5) || [];

  const recentIncidents = data?.incidents.slice(0, 6) || [];

  // Show loading state if data hasn't loaded yet
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-xl">Loading SOC Wallboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-10 w-10 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">MSSP Security Operations Center</h1>
              <p className="text-sm text-slate-400">Real-time Threat Monitoring & Response</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold">
            {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
          </div>
          <div className="text-sm text-slate-400">
            {currentTime ? currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading...'}
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="mb-6 grid grid-cols-6 gap-4">
        <MetricCard
          title="Total Clients"
          value={data.metrics.totalClients.toString()}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Active Alerts"
          value={data.metrics.activeAlerts.toString()}
          icon={<AlertTriangle className="h-6 w-6" />}
          color={data.metrics.activeAlerts > 200 ? "red" : "yellow"}
          subtitle={`${criticalAlerts.length} Critical, ${highAlerts.length} High`}
        />
        <MetricCard
          title="Open Incidents"
          value={data.metrics.openIncidents.toString()}
          icon={<Activity className="h-6 w-6" />}
          color={data.metrics.criticalIncidents > 5 ? "red" : "orange"}
          subtitle={`${data.metrics.criticalIncidents} Critical`}
        />
        <MetricCard
          title="SLA Compliance"
          value={`${data.metrics.slaCompliance}%`}
          icon={data.metrics.slaCompliance >= 95 ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
          color={data.metrics.slaCompliance >= 95 ? "green" : "red"}
          subtitle={`${data.metrics.slaBreaches} Breaches`}
        />
        <MetricCard
          title="MTTR"
          value={`${Math.round(data.metrics.avgMTTR)}m`}
          icon={<Clock className="h-6 w-6" />}
          color="cyan"
          subtitle="Mean Time to Respond"
        />
        <MetricCard
          title="Active Analysts"
          value={`${data.metrics.activeAnalysts}/${data.analysts.length}`}
          icon={<Users className="h-6 w-6" />}
          color="purple"
          subtitle="On Duty"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* MSSP Insider Portfolio Widget - EMBEDDED WITH RED OUTLINE */}
          <div className="rounded-lg border-4 border-red-500 p-1 shadow-lg shadow-red-500/50">
            <InsiderPortfolioWidget
              heartbeat={mockHeartbeat}
              portfolioHealth={portfolioHealth}
              priorityActions={priorityActions}
              onSimulateAlert={handleSimulateIncident}
              showSimulateButton={false}
            />
          </div>

          {/* Critical Alerts */}
          <Card className="border-red-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Zap className="h-5 w-5" />
                Critical Alerts ({criticalAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="rounded-lg border border-red-500/20 bg-red-950/20 p-3">
                  <div className="mb-1 flex items-start justify-between">
                    <span className="font-semibold text-sm">{alert.type}</span>
                    <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                  </div>
                  <div className="text-xs text-slate-400">{alert.clientName}</div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{alert.source}</span>
                    <span className={alert.isSLABreached ? "text-red-400 font-semibold" : "text-slate-400"}>
                      {alert.isSLABreached ? 'SLA BREACHED' : `${Math.abs(alert.minutesUntilSLA)}m to SLA`}
                    </span>
                  </div>
                </div>
              ))}
              {criticalAlerts.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">No critical alerts</div>
              )}
            </CardContent>
          </Card>

          {/* Top Affected Clients */}
          <Card className="border-orange-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Target className="h-5 w-5" />
                Top Affected Clients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topAffectedClients.map(client => (
                <div key={client.id} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                  <div>
                    <div className="font-semibold text-sm">{client.name}</div>
                    <div className="text-xs text-slate-400">{client.industry}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={client.tier === 'PLATINUM' ? 'default' : 'secondary'} className="mb-1">
                      {client.tier}
                    </Badge>
                    <div className="text-xs text-orange-400">{client.activeIncidents} incidents</div>
                  </div>
                </div>
              ))}
              {topAffectedClients.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">No active incidents</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Column */}
        <div className="space-y-6">
          {/* Recent Incidents */}
          <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Recent Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentIncidents.map(incident => (
                <div key={incident.id} className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge
                          variant={
                            incident.severity === 'CRITICAL' ? 'destructive' :
                            incident.severity === 'HIGH' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {incident.severity}
                        </Badge>
                        <span className="font-mono text-xs text-slate-500">{incident.id}</span>
                      </div>
                      <div className="font-semibold text-sm">{incident.title}</div>
                      <div className="text-xs text-slate-400">{incident.clientName}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="text-xs">
                      {incident.status}
                    </Badge>
                    <span className={incident.isSLABreached ? "text-red-400 font-semibold" : incident.minutesUntilSLA < 30 ? "text-yellow-400" : "text-slate-500"}>
                      {incident.isSLABreached ? 'BREACHED' : incident.minutesUntilSLA < 60 ? `${incident.minutesUntilSLA}m` : `${Math.floor(incident.minutesUntilSLA / 60)}h`}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SLA Status */}
          <Card className="border-yellow-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Clock className="h-5 w-5" />
                SLA Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compliance Rate</span>
                  <span className="font-bold">{data.metrics.slaCompliance}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
                  <div
                    className={`h-full transition-all ${data.metrics.slaCompliance >= 95 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${data.metrics.slaCompliance}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-red-400">Breached</span>
                    <span className="text-2xl font-bold text-red-400">{slaBreachedIncidents.length}</span>
                  </div>
                  {slaBreachedIncidents.slice(0, 2).map(inc => (
                    <div key={inc.id} className="mt-2 text-xs text-slate-400">
                      {inc.clientName} - {Math.abs(inc.minutesUntilSLA)}m overdue
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-yellow-400">At Risk</span>
                    <span className="text-2xl font-bold text-yellow-400">{atRiskIncidents.length}</span>
                  </div>
                  {atRiskIncidents.slice(0, 2).map(inc => (
                    <div key={inc.id} className="mt-2 text-xs text-slate-400">
                      {inc.clientName} - {inc.minutesUntilSLA}m remaining
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Geographic Attacks */}
          <Card className="border-purple-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Globe className="h-5 w-5" />
                Geographic Threats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topGeoAttacks.map((geo, index) => (
                <div key={geo.countryCode} className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{geo.country}</div>
                    <div className="text-xs text-slate-400">{geo.alertCount} alerts</div>
                  </div>
                  {geo.criticalCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {geo.criticalCount} critical
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Threat Intelligence */}
          <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <TrendingUp className="h-5 w-5" />
                Active Threat Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.threatIntel.slice(0, 4).map(threat => (
                <div key={threat.id} className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-sm">{threat.threatActor}</span>
                    <Badge
                      variant={threat.severity === 'CRITICAL' ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      {threat.severity}
                    </Badge>
                  </div>
                  <div className="mb-2 text-xs text-slate-400">{threat.campaignName}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{threat.affectedClients} clients affected</span>
                    <span className="text-cyan-400">{threat.iocMatches} IOC matches</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card className="border-green-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Users className="h-5 w-5" />
                Analyst Team Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {data.analysts.filter(a => a.status === 'ACTIVE').length}
                  </div>
                  <div className="text-xs text-slate-400">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {data.analysts.filter(a => a.status === 'BUSY').length}
                  </div>
                  <div className="text-xs text-slate-400">Busy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-400">
                    {data.analysts.filter(a => a.status === 'AWAY').length}
                  </div>
                  <div className="text-xs text-slate-400">Away</div>
                </div>
              </div>
              <div className="space-y-2">
                {data.analysts
                  .filter(a => a.status === 'ACTIVE')
                  .sort((a, b) => b.assignedAlerts - a.assignedAlerts)
                  .slice(0, 4)
                  .map(analyst => (
                    <div key={analyst.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <span>{analyst.name}</span>
                      </div>
                      <span className="text-slate-400">{analyst.assignedAlerts} alerts</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'yellow' | 'orange' | 'green' | 'cyan' | 'purple';
  subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
  const colorClasses = {
    blue: 'border-blue-500/20 bg-blue-950/20 text-blue-400',
    red: 'border-red-500/20 bg-red-950/20 text-red-400',
    yellow: 'border-yellow-500/20 bg-yellow-950/20 text-yellow-400',
    orange: 'border-orange-500/20 bg-orange-950/20 text-orange-400',
    green: 'border-green-500/20 bg-green-950/20 text-green-400',
    cyan: 'border-cyan-500/20 bg-cyan-950/20 text-cyan-400',
    purple: 'border-purple-500/20 bg-purple-950/20 text-purple-400',
  };

  return (
    <Card className={`border backdrop-blur ${colorClasses[color]}`}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{title}</span>
          {icon}
        </div>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && <div className="mt-1 text-xs text-slate-400">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}
