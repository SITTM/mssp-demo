"use client";

import { Badge } from "@/components/ui/badge";
import { SpecialistProfile } from "@/lib/data/specialist-profiles";
import { Star, Clock, Award, TrendingUp, CheckCircle2, Circle, CheckCircle } from "lucide-react";

interface ExpertCardProps {
  expert: SpecialistProfile;
  isSelected: boolean;
  onSelect: (expertId: string) => void;
  showHourlyRate?: boolean;
}

export function ExpertCard({ expert, isSelected, onSelect, showHourlyRate = true }: ExpertCardProps) {
  const availabilityConfig = {
    available: { dot: 'bg-green-500', text: 'text-green-600', label: 'Available' },
    busy: { dot: 'bg-amber-500', text: 'text-amber-600', label: 'Busy' },
    away: { dot: 'bg-gray-400', text: 'text-gray-500', label: 'Away' },
  };

  const config = availabilityConfig[expert.availability];

  return (
    <div
      onClick={() => onSelect(expert.userId)}
      className={`rounded-lg border p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary'
          : 'border-border hover:bg-muted/40'
      } ${
        expert.isIndependent
          ? 'border-purple-500/30 bg-purple-950/10'
          : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Selection Indicator */}
        <div className="mt-1">
          {isSelected ? (
            <CheckCircle className="h-5 w-5 text-primary fill-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-3">
          {/* Header: Name, Title, Star Rating */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="font-semibold text-base cursor-pointer flex items-center gap-2">
                {expert.name}
                {expert.starRating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">{expert.starRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{expert.displayRole}</p>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-4 text-sm flex-wrap">
            {/* Availability */}
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
              <span className={`font-medium ${config.text}`}>{config.label}</span>
            </div>

            {/* Response Time */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{expert.responseTime}</span>
            </div>

            {/* Hourly Rate (if applicable) */}
            {showHourlyRate && expert.isIndependent && expert.hourlyRate && (
              <div className="flex items-center gap-1 text-purple-600 font-semibold">
                <span>£{expert.hourlyRate}/hr</span>
              </div>
            )}

            {/* Organization Badge */}
            <Badge
              variant="outline"
              className={`text-xs ${
                expert.isIndependent ? 'border-purple-500/50 text-purple-500' : ''
              }`}
            >
              {expert.isIndependent ? 'INDEPENDENT' : expert.organization.toUpperCase()}
            </Badge>
          </div>

          {/* Performance Stats */}
          {(expert.incidentsSupported || expert.resolutionRate || expert.averageResponseTimeHours) && (
            <div className="pt-2 border-t border-border/50">
              <div className="text-xs font-semibold mb-2 text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Performance Stats:
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {expert.incidentsSupported && (
                  <div>
                    <div className="text-xs text-muted-foreground">Incidents</div>
                    <div className="font-semibold">{expert.incidentsSupported}</div>
                  </div>
                )}
                {expert.resolutionRate && (
                  <div>
                    <div className="text-xs text-muted-foreground">Resolution</div>
                    <div className="font-semibold flex items-center gap-1">
                      {expert.resolutionRate}%
                      {expert.resolutionRate >= 95 && (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                )}
                {expert.averageResponseTimeHours && (
                  <div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                    <div className="font-semibold">
                      {expert.averageResponseTimeHours < 1
                        ? `${Math.round(expert.averageResponseTimeHours * 60)}m`
                        : `${expert.averageResponseTimeHours.toFixed(1)}h`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expertise */}
          <div className="pt-2">
            <div className="text-xs font-semibold mb-2 text-muted-foreground flex items-center gap-1">
              <Award className="h-3 w-3" />
              Expertise:
            </div>
            <div className="flex flex-wrap gap-1">
              {expert.expertise.slice(0, 4).map((exp, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {exp}
                </Badge>
              ))}
              {expert.expertise.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{expert.expertise.length - 4} more
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
              {expert.incidentTypes.slice(0, 3).map((type, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
              {expert.incidentTypes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{expert.incidentTypes.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Certifications */}
          {expert.certifications.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-semibold mb-1 text-muted-foreground">
                Certifications:
              </div>
              <p className="text-xs text-muted-foreground">
                {expert.certifications.slice(0, 3).join(', ')}
                {expert.certifications.length > 3 && ` +${expert.certifications.length - 3} more`}
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="pt-2 text-xs text-muted-foreground">
            <span className="font-medium">Email:</span> {expert.email}
          </div>
        </div>
      </div>
    </div>
  );
}
