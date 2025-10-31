'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSOCData } from '@/lib/data/soc-data-generator';
import { Alert, Incident, AlertSeverity, AlertStatus, Client } from '@/lib/types/soc';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  User,
  Building2,
  Shield,
  Activity,
  TrendingUp,
  FileText,
  ExternalLink,
  ChevronRight,
  Target,
  Zap,
} from 'lucide-react';

const CURRENT_ANALYST = 'Sarah Chen'; // Simulated logged-in analyst

export default function AnalystDashboard() {
  const data = getSOCData();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [clientFilter, setClientFilter] = useState<string>('ALL');

  // Analyst's assigned work
  const myAlerts = data.alerts.filter(a => a.assignedTo === CURRENT_ANALYST && a.status !== 'RESOLVED');
  const myIncidents = data.incidents.filter(i => i.assignedAnalyst === CURRENT_ANALYST && i.status !== 'CLOSED');

  // Personal metrics
  const resolvedToday = data.alerts.filter(a => a.assignedTo === CURRENT_ANALYST && a.status === 'RESOLVED').length;
  const avgResponseTime = Math.round(
    data.alerts
      .filter(a => a.assignedTo === CURRENT_ANALYST && a.status === 'RESOLVED')
      .reduce((acc, a) => acc + Math.random() * 30, 0) / (resolvedToday || 1)
  );

  // All alerts stream with filtering
  let filteredAlerts = data.alerts.filter(a => a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE');
  if (severityFilter !== 'ALL') {
    filteredAlerts = filteredAlerts.filter(a => a.severity === severityFilter);
  }
  if (clientFilter !== 'ALL') {
    filteredAlerts = filteredAlerts.filter(a => a.clientId === clientFilter);
  }

  const selectedClient = selectedAlert ? data.clients.find(c => c.id === selectedAlert.clientId) : null;
  const selectedIncidentClient = selectedIncident ? data.clients.find(c => c.id === selectedIncident.clientId) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">SOC Analyst Console</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back, {CURRENT_ANALYST}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-slate-600 dark:text-slate-400">Your Performance Today</div>
              <div className="flex gap-4 mt-1">
                <div>
                  <span className="text-xs text-slate-500">Resolved:</span>
                  <span className="ml-1 font-semibold text-green-600">{resolvedToday}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Avg Response:</span>
                  <span className="ml-1 font-semibold text-blue-600">{avgResponseTime}m</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Queue:</span>
                  <span className="ml-1 font-semibold text-orange-600">{myAlerts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-89px)]">
        {/* Left Sidebar - My Work Queue */}
        <div className="w-80 border-r bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              My Work Queue
            </h2>
          </div>

          <Tabs defaultValue="alerts" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="alerts" className="flex-1">
                Alerts ({myAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="incidents" className="flex-1">
                Incidents ({myIncidents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="flex-1 overflow-hidden mt-2">
              <ScrollArea className="h-full px-4">
                <div className="space-y-2 pb-4">
                  {myAlerts
                    .sort((a, b) => {
                      // Sort by SLA urgency
                      if (a.isSLABreached && !b.isSLABreached) return -1;
                      if (!a.isSLABreached && b.isSLABreached) return 1;
                      return a.minutesUntilSLA - b.minutesUntilSLA;
                    })
                    .map(alert => (
                      <div
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert)}
                        className={`cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md ${
                          selectedAlert?.id === alert.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <Badge
                            variant={
                              alert.severity === 'CRITICAL' ? 'destructive' :
                              alert.severity === 'HIGH' ? 'default' : 'secondary'
                            }
                          >
                            {alert.severity}
                          </Badge>
                          {alert.isSLABreached ? (
                            <span className="text-xs font-semibold text-red-600">BREACHED</span>
                          ) : (
                            <span className={`text-xs ${alert.minutesUntilSLA < 30 ? 'text-orange-600 font-semibold' : 'text-slate-500'}`}>
                              {alert.minutesUntilSLA}m
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-sm mb-1">{alert.type}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{alert.clientName}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{alert.source}</span>
                          <Badge variant="outline" className="text-xs">{alert.status}</Badge>
                        </div>
                      </div>
                    ))}
                  {myAlerts.length === 0 && (
                    <div className="py-12 text-center text-sm text-slate-500">
                      <CheckCircle className="mx-auto h-12 w-12 mb-2 text-green-500" />
                      No alerts assigned
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="incidents" className="flex-1 overflow-hidden mt-2">
              <ScrollArea className="h-full px-4">
                <div className="space-y-2 pb-4">
                  {myIncidents
                    .sort((a, b) => a.minutesUntilSLA - b.minutesUntilSLA)
                    .map(incident => (
                      <div
                        key={incident.id}
                        onClick={() => setSelectedIncident(incident)}
                        className={`cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md ${
                          selectedIncident?.id === incident.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <Badge
                            variant={
                              incident.severity === 'CRITICAL' ? 'destructive' :
                              incident.severity === 'HIGH' ? 'default' : 'secondary'
                            }
                          >
                            {incident.severity}
                          </Badge>
                          <span className="font-mono text-xs text-slate-500">{incident.id}</span>
                        </div>
                        <div className="font-semibold text-sm mb-1">{incident.title}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{incident.clientName}</div>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline">{incident.status}</Badge>
                          <span className={incident.isSLABreached ? "text-red-600 font-semibold" : incident.minutesUntilSLA < 60 ? "text-orange-600" : "text-slate-500"}>
                            {incident.isSLABreached ? 'BREACHED' : `${Math.floor(incident.minutesUntilSLA / 60)}h ${incident.minutesUntilSLA % 60}m`}
                          </span>
                        </div>
                      </div>
                    ))}
                  {myIncidents.length === 0 && (
                    <div className="py-12 text-center text-sm text-slate-500">
                      <CheckCircle className="mx-auto h-12 w-12 mb-2 text-green-500" />
                      No incidents assigned
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Alert Stream */}
          <div className="border-b bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Alert Stream
              </h2>
              <div className="flex items-center gap-2">
                <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as AlertSeverity | 'ALL')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Severity</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Clients</SelectItem>
                    {data.clients.slice(0, 20).map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Severity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">SLA</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.slice(0, 50).map(alert => (
                    <TableRow
                      key={alert.id}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <TableCell>
                        <Badge
                          variant={
                            alert.severity === 'CRITICAL' ? 'destructive' :
                            alert.severity === 'HIGH' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{alert.type}</TableCell>
                      <TableCell className="text-sm">{alert.clientName}</TableCell>
                      <TableCell className="text-sm text-slate-600">{alert.source}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{alert.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${
                          alert.isSLABreached ? 'text-red-600' :
                          alert.minutesUntilSLA < 30 ? 'text-orange-600' : 'text-slate-500'
                        }`}>
                          {alert.isSLABreached ? 'BREACH' : `${alert.minutesUntilSLA}m`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Investigation Workspace */}
          <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
            {selectedAlert ? (
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Alert Details */}
                  <div className="col-span-2 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          Alert Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{selectedAlert.type}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedAlert.description}</p>
                          </div>
                          <Badge
                            variant={
                              selectedAlert.severity === 'CRITICAL' ? 'destructive' :
                              selectedAlert.severity === 'HIGH' ? 'default' : 'secondary'
                            }
                            className="text-sm"
                          >
                            {selectedAlert.severity}
                          </Badge>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                          <InfoItem label="Alert ID" value={selectedAlert.id} />
                          <InfoItem label="Status" value={selectedAlert.status} />
                          <InfoItem label="Source" value={selectedAlert.source} />
                          <InfoItem label="Detected" value={new Date(selectedAlert.timestamp).toLocaleString()} />
                          <InfoItem label="Assigned To" value={selectedAlert.assignedTo || 'Unassigned'} />
                          <InfoItem
                            label="SLA Deadline"
                            value={new Date(selectedAlert.slaDeadline).toLocaleString()}
                            highlight={selectedAlert.isSLABreached}
                          />
                        </div>

                        <Separator />

                        <div className="flex gap-2">
                          <button className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Investigate
                          </button>
                          <button className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            Escalate
                          </button>
                          <button className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            Mark False Positive
                          </button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Investigation Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <textarea
                          className="w-full min-h-32 rounded-md border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                          placeholder="Add investigation notes, findings, and actions taken..."
                        />
                        <div className="mt-2 flex justify-end">
                          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Save Notes
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Client Context */}
                  <div className="space-y-4">
                    {selectedClient && (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 text-blue-600" />
                              Client Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h3 className="font-bold text-lg">{selectedClient.name}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{selectedClient.industry}</p>
                            </div>

                            <Separator />

                            <InfoItem label="Tier" value={selectedClient.tier} badge />
                            <InfoItem label="Location" value={selectedClient.location} />
                            <InfoItem label="Assets Monitored" value={selectedClient.assetsMonitored.toLocaleString()} />
                            <InfoItem label="Employees" value={selectedClient.employeeCount.toLocaleString()} />
                            <InfoItem label="Health Score" value={`${selectedClient.healthScore}%`} />
                            <InfoItem label="Active Incidents" value={selectedClient.activeIncidents.toString()} />

                            <Separator />

                            <div>
                              <div className="text-xs font-semibold text-slate-500 mb-2">SLA Response Times</div>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Critical:</span>
                                  <span className="font-medium">{selectedClient.slaResponseMinutes.CRITICAL}m</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>High:</span>
                                  <span className="font-medium">{selectedClient.slaResponseMinutes.HIGH}m</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Medium:</span>
                                  <span className="font-medium">{selectedClient.slaResponseMinutes.MEDIUM}m</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="h-5 w-5 text-blue-600" />
                              Related Events
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {data.alerts
                                .filter(a => a.clientId === selectedClient.id && a.id !== selectedAlert.id)
                                .slice(0, 5)
                                .map(alert => (
                                  <div key={alert.id} className="text-xs rounded border border-slate-200 dark:border-slate-700 p-2">
                                    <div className="flex items-center justify-between mb-1">
                                      <Badge variant="secondary" className="text-xs">{alert.severity}</Badge>
                                      <span className="text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-slate-700 dark:text-slate-300">{alert.type}</div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : selectedIncident ? (
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-red-600" />
                          Incident Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-mono text-sm text-slate-500">{selectedIncident.id}</span>
                              <Badge variant={selectedIncident.clientTier === 'PLATINUM' ? 'default' : 'secondary'}>
                                {selectedIncident.clientTier}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{selectedIncident.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedIncident.clientName}</p>
                          </div>
                          <Badge
                            variant={
                              selectedIncident.severity === 'CRITICAL' ? 'destructive' :
                              selectedIncident.severity === 'HIGH' ? 'default' : 'secondary'
                            }
                            className="text-sm"
                          >
                            {selectedIncident.severity}
                          </Badge>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                          <InfoItem label="Status" value={selectedIncident.status} />
                          <InfoItem label="Attack Vector" value={selectedIncident.attackVector} />
                          <InfoItem label="Created" value={new Date(selectedIncident.createdAt).toLocaleString()} />
                          <InfoItem label="Last Updated" value={new Date(selectedIncident.updatedAt).toLocaleString()} />
                          <InfoItem label="Assigned Analyst" value={selectedIncident.assignedAnalyst} />
                          <InfoItem label="Affected Assets" value={selectedIncident.affectedAssets.toString()} />
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">Investigation Timeline</h4>
                          <div className="space-y-2">
                            {selectedIncident.investigationNotes.map((note, i) => (
                              <div key={i} className="flex gap-2 text-sm">
                                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                                <span>{note}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    {selectedIncidentClient && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            Client Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h3 className="font-bold text-lg">{selectedIncidentClient.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedIncidentClient.industry}</p>
                          </div>
                          <Separator />
                          <InfoItem label="Tier" value={selectedIncidentClient.tier} badge />
                          <InfoItem label="Health Score" value={`${selectedIncidentClient.healthScore}%`} />
                          <InfoItem label="Active Incidents" value={selectedIncidentClient.activeIncidents.toString()} />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                <div className="text-center">
                  <Search className="mx-auto h-16 w-16 mb-4 text-slate-300" />
                  <p className="text-lg font-medium">No alert or incident selected</p>
                  <p className="text-sm">Select an item from your queue or the alert stream to investigate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
  badge?: boolean;
}

function InfoItem({ label, value, highlight, badge }: InfoItemProps) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 mb-1">{label}</div>
      {badge ? (
        <Badge variant="default">{value}</Badge>
      ) : (
        <div className={`text-sm font-medium ${highlight ? 'text-red-600' : ''}`}>{value}</div>
      )}
    </div>
  );
}
