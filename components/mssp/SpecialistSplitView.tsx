"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SpecialistProfile } from "@/lib/data/specialist-profiles";
import { Search, Award, Clock, DollarSign, Shield, Users, Filter, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpertSelectionModal } from "./ExpertSelectionModal";

interface SpecialistSplitViewProps {
  searchResults: SpecialistProfile[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedParticipants: string[];
  onToggleSpecialist: (userId: string) => void;
  viewMode: 'mssp' | 'client';
  clientName?: string;
  showInvitationStory?: boolean;
  invitationStatus?: Record<string, string>;
  selectedTeamMembers?: SpecialistProfile[];
}

export function SpecialistSplitView({
  searchResults,
  searchTerm,
  onSearchChange,
  selectedParticipants,
  onToggleSpecialist,
  viewMode,
  clientName = "NorthStar Financial Group",
  showInvitationStory = false,
  invitationStatus = {},
  selectedTeamMembers = [],
}: SpecialistSplitViewProps) {
  const [showIndependentsOnly, setShowIndependentsOnly] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);

  // Filter results based on view mode and independent filter
  const filteredResults = searchResults.filter(specialist => {
    if (showIndependentsOnly && !specialist.isIndependent) {
      return false;
    }
    return true;
  });

  const independentCount = searchResults.filter(s => s.isIndependent).length;

  const handleExpertSelection = (legalExpertId: string, hrExpertId: string) => {
    // Add both experts to selected participants
    onToggleSpecialist(legalExpertId);
    onToggleSpecialist(hrExpertId);
  };

  return (
    <div className="space-y-4">{/* View Mode Indicator removed - now in parent panel headers */}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={
            viewMode === 'client'
              ? "Search independent experts..."
              : "Search by incident type, expertise, role, or certification..."
          }
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client-only: Expert Selection Button */}
      {viewMode === 'client' && (
        <Button
          onClick={() => setShowExpertModal(true)}
          className="w-full flex items-center gap-2"
          size="lg"
        >
          <UserPlus className="h-4 w-4" />
          Select Legal & HR Experts
        </Button>
      )}

      {/* Expert Selection Modal */}
      <ExpertSelectionModal
        open={showExpertModal}
        onOpenChange={setShowExpertModal}
        onConfirm={handleExpertSelection}
      />

      {/* Search Results - Only show for MSSP view when actively searching */}
      {viewMode === 'mssp' && searchTerm && filteredResults.length > 0 && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            Found {filteredResults.length} specialist{filteredResults.length !== 1 ? 's' : ''} matching &ldquo;{searchTerm}&rdquo;
          </p>
          {filteredResults.map((specialist) => (
            <div
              key={specialist.userId}
              className={`rounded-lg border p-4 hover:bg-muted/40 transition-colors ${
                specialist.isIndependent
                  ? 'border-purple-500/30 bg-purple-950/10'
                  : 'border-border bg-muted/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={specialist.userId}
                  checked={selectedParticipants.includes(specialist.userId)}
                  onCheckedChange={() => onToggleSpecialist(specialist.userId)}
                  className="mt-1"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <label
                        htmlFor={specialist.userId}
                        className="font-medium cursor-pointer flex items-center gap-2 flex-wrap"
                      >
                        {specialist.name}
                        <Badge
                          variant={specialist.availability === 'available' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {specialist.availability === 'available' ? '✓ Available' :
                           specialist.availability === 'busy' ? 'Busy' : 'Away'}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            specialist.isIndependent ? 'border-purple-500/50 text-purple-500' : ''
                          }`}
                        >
                          {specialist.isIndependent ? 'INDEPENDENT' : specialist.organization.toUpperCase()}
                        </Badge>
                      </label>
                      <p className="text-sm text-muted-foreground">{specialist.displayRole}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{specialist.responseTime}</span>
                      </div>
                      {/* Show hourly rate only to client */}
                      {viewMode === 'client' && specialist.isIndependent && specialist.hourlyRate && (
                        <div className="flex items-center gap-1 text-sm font-semibold text-purple-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{specialist.hourlyRate}/hr</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hide contact details for independents in MSSP view */}
                  {(!specialist.isIndependent || viewMode === 'client') && (
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span className="font-mono text-xs">{specialist.email}</span>
                      </div>
                    </div>
                  )}

                  {/* Independent notice for MSSP view */}
                  {specialist.isIndependent && viewMode === 'mssp' && (
                    <Alert className="border-purple-500/30 bg-purple-950/10">
                      <AlertDescription className="text-xs">
                        Independent expert - Contact details and rates visible to client only
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Expertise */}
                  <div className="pt-2 border-t border-border/50">
                    <div className="text-xs font-semibold mb-2 text-muted-foreground flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Expertise:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {specialist.expertise.slice(0, 4).map((exp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {specialist.expertise.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{specialist.expertise.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Incident Types */}
                  <div className="pt-2">
                    <div className="text-xs font-semibold mb-2 text-muted-foreground">
                      Specializes in:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {specialist.incidentTypes.slice(0, 3).map((type, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {specialist.incidentTypes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{specialist.incidentTypes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  {specialist.certifications.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-semibold mb-1 text-muted-foreground">
                        Certifications:
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {specialist.certifications.slice(0, 3).join(', ')}
                        {specialist.certifications.length > 3 && ` +${specialist.certifications.length - 3} more`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results for MSSP View - only when actively searching */}
      {viewMode === 'mssp' && searchTerm && filteredResults.length === 0 && (
        <Alert>
          <AlertDescription className="text-sm">
            No specialists found for &ldquo;{searchTerm}&rdquo;. Try a different search term.
          </AlertDescription>
        </Alert>
      )}

      {/* Invitation Story for MSSP View - Core Team Status */}
      {viewMode === 'mssp' && showInvitationStory && (
        <div className="space-y-4">
          <Alert className="border-blue-500/30 bg-blue-50">
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold text-blue-900">Core Team Status</p>

                {/* MSSP Analyst - Always shown */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-blue-200">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Marcus Reid (MSSP Lead Analyst)</p>
                    <p className="text-xs text-slate-600">marcus.reid@mssp.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>

                {/* Client CISO - Always shown */}
                <div className={`flex items-center gap-3 p-3 rounded-lg bg-white border ${
                  invitationStatus['ciso'] === 'joined' ? 'border-green-200' : 'border-purple-200'
                }`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    invitationStatus['ciso'] === 'joined' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <Users className={`h-4 w-4 ${
                      invitationStatus['ciso'] === 'joined' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Sarah Chen (CISO)</p>
                    <p className="text-xs text-slate-600">sarah.chen@{clientName.toLowerCase().replace(/\s+/g, "")}.com</p>
                  </div>
                  {invitationStatus['ciso'] === 'joined' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600 font-medium">✓ Joined</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                      <span className="text-xs text-purple-600 font-medium">Sending invitation...</span>
                    </div>
                  )}
                </div>

                {/* Dynamically selected team members (Legal & HR from client org) - Appended to core team */}
                {selectedTeamMembers && selectedTeamMembers.length > 0 && selectedTeamMembers.map((member) => (
                  <div key={member.userId} className={`flex items-center gap-3 p-3 rounded-lg bg-white border ${
                    invitationStatus[member.userId] === 'joined' ? 'border-green-200' : 'border-purple-200'
                  }`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      invitationStatus[member.userId] === 'joined' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Users className={`h-4 w-4 ${
                        invitationStatus[member.userId] === 'joined' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{member.name} ({member.displayRole})</p>
                      <p className="text-xs text-slate-600">{member.email}</p>
                    </div>
                    {invitationStatus[member.userId] === 'joined' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-green-600 font-medium">✓ Joined</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-xs text-purple-600 font-medium">Inviting...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
