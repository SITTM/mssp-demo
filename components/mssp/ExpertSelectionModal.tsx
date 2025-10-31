"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpecialistProfile, SPECIALIST_PROFILES } from "@/lib/data/specialist-profiles";
import { ExpertCard } from "./ExpertCard";
import { Search, Scale, Users as UsersIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ExpertSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (legalExpertId: string, hrExpertId: string) => void;
}

type ExpertCategory = 'legal' | 'hr';
type SortOption = 'rating-desc' | 'rating-asc' | 'response-asc' | 'rate-asc' | 'rate-desc' | 'incidents-desc' | 'availability';

export function ExpertSelectionModal({ open, onOpenChange, onConfirm }: ExpertSelectionModalProps) {
  const [selectedLegal, setSelectedLegal] = useState<string | null>(null);
  const [selectedHR, setSelectedHR] = useState<string | null>(null);
  const [category, setCategory] = useState<ExpertCategory>('legal');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

  // Filter experts by category and organization
  const allLegalExperts = SPECIALIST_PROFILES.filter(
    s => s.role === 'legal_counsel' || s.role === 'data_protection'
  );
  const allHRExperts = SPECIALIST_PROFILES.filter(
    s => s.role === 'hr_director' || s.role === 'hr_investigator'
  );

  // Separate internal (client) from external (independent) experts
  const internalLegalExperts = allLegalExperts.filter(s => s.organization === 'client');
  const externalLegalExperts = allLegalExperts.filter(s => s.organization === 'independent');

  const internalHRExperts = allHRExperts.filter(s => s.organization === 'client');
  const externalHRExperts = allHRExperts.filter(s => s.organization === 'independent');

  const currentInternalExperts = category === 'legal' ? internalLegalExperts : internalHRExperts;
  const currentExternalExperts = category === 'legal' ? externalLegalExperts : externalHRExperts;

  // Apply filters and sorting to internal experts
  const filteredAndSortedInternalExperts = useMemo(() => {
    let filtered = currentInternalExperts.filter(expert => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchableText = [
          expert.name,
          expert.displayRole,
          ...expert.expertise,
          ...expert.incidentTypes,
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      // Availability filter
      if (showAvailableOnly && expert.availability !== 'available') {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.starRating || 0) - (a.starRating || 0);
        case 'rating-asc':
          return (a.starRating || 0) - (b.starRating || 0);
        case 'response-asc':
          return (a.averageResponseTimeHours || 999) - (b.averageResponseTimeHours || 999);
        case 'rate-asc':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case 'rate-desc':
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        case 'incidents-desc':
          return (b.incidentsSupported || 0) - (a.incidentsSupported || 0);
        case 'availability':
          const order = { available: 0, busy: 1, away: 2 };
          return order[a.availability] - order[b.availability];
        default:
          return 0;
      }
    });

    return filtered;
  }, [currentInternalExperts, searchTerm, showAvailableOnly, sortBy]);

  // Apply filters and sorting to external experts
  const filteredAndSortedExternalExperts = useMemo(() => {
    let filtered = currentExternalExperts.filter(expert => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchableText = [
          expert.name,
          expert.displayRole,
          ...expert.expertise,
          ...expert.incidentTypes,
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      // Availability filter
      if (showAvailableOnly && expert.availability !== 'available') {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.starRating || 0) - (a.starRating || 0);
        case 'rating-asc':
          return (a.starRating || 0) - (b.starRating || 0);
        case 'response-asc':
          return (a.averageResponseTimeHours || 999) - (b.averageResponseTimeHours || 999);
        case 'rate-asc':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case 'rate-desc':
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        case 'incidents-desc':
          return (b.incidentsSupported || 0) - (a.incidentsSupported || 0);
        case 'availability':
          const order = { available: 0, busy: 1, away: 2 };
          return order[a.availability] - order[b.availability];
        default:
          return 0;
      }
    });

    return filtered;
  }, [currentExternalExperts, searchTerm, showAvailableOnly, sortBy]);

  const handleSelectExpert = (expertId: string) => {
    if (category === 'legal') {
      setSelectedLegal(expertId);
    } else {
      setSelectedHR(expertId);
    }
  };

  const handleConfirm = () => {
    if (selectedLegal && selectedHR) {
      onConfirm(selectedLegal, selectedHR);
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setSelectedLegal(null);
    setSelectedHR(null);
    setCategory('legal');
    setSearchTerm('');
    setShowAvailableOnly(true);
    setSortBy('rating-desc');
  };

  const selectedLegalExpert = allLegalExperts.find(e => e.userId === selectedLegal);
  const selectedHRExpert = allHRExperts.find(e => e.userId === selectedHR);

  const estimatedCost =
    (selectedLegalExpert?.hourlyRate || 0) +
    (selectedHRExpert?.hourlyRate || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Incident Room Experts</DialogTitle>
          <DialogDescription>
            Choose one Legal and one HR expert for this incident
          </DialogDescription>
          <div className="flex items-center gap-4 pt-2 text-sm">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-amber-500" />
              <span className={selectedLegal ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                Legal: {selectedLegal ? '1/1 ✓' : '0/1'}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-teal-500" />
              <span className={selectedHR ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                HR: {selectedHR ? '1/1 ✓' : '0/1'}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Category Toggle */}
        <div className="py-3">
          <ToggleGroup type="single" value={category} onValueChange={(val) => val && setCategory(val as ExpertCategory)}>
            <ToggleGroupItem value="legal" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Legal Experts
            </ToggleGroupItem>
            <ToggleGroupItem value="hr" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              HR Experts
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${category} experts...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Available Only */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="available-only"
                checked={showAvailableOnly}
                onCheckedChange={(checked) => setShowAvailableOnly(checked as boolean)}
              />
              <Label htmlFor="available-only" className="text-sm cursor-pointer">
                Available Only
              </Label>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <Label htmlFor="sort-by" className="text-sm">Sort by:</Label>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                <SelectTrigger id="sort-by" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
                  <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
                  <SelectItem value="response-asc">Response Time (Fastest)</SelectItem>
                  <SelectItem value="rate-asc">Hourly Rate (Low to High)</SelectItem>
                  <SelectItem value="rate-desc">Hourly Rate (High to Low)</SelectItem>
                  <SelectItem value="incidents-desc">Most Experience</SelectItem>
                  <SelectItem value="availability">Availability Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Expert List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Internal Team Panel */}
          {filteredAndSortedInternalExperts.length > 0 && (
            <div className="space-y-3">
              <div className="sticky top-0 bg-background py-2 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-blue-600">NorthStar Financial Group</span>
                  <span className="text-muted-foreground">Internal Incident Response Team</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredAndSortedInternalExperts.length} {category} team member{filteredAndSortedInternalExperts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {filteredAndSortedInternalExperts.map((expert) => (
                <ExpertCard
                  key={expert.userId}
                  expert={expert}
                  isSelected={category === 'legal' ? selectedLegal === expert.userId : selectedHR === expert.userId}
                  onSelect={handleSelectExpert}
                  showHourlyRate={false}
                />
              ))}
            </div>
          )}

          {/* External Experts Panel */}
          {filteredAndSortedExternalExperts.length > 0 && (
            <div className="space-y-3">
              <div className="sticky top-0 bg-background py-2 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-purple-600">External {category === 'legal' ? 'Legal' : 'HR'} Experts</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredAndSortedExternalExperts.length} independent expert{filteredAndSortedExternalExperts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {filteredAndSortedExternalExperts.map((expert) => (
                <ExpertCard
                  key={expert.userId}
                  expert={expert}
                  isSelected={category === 'legal' ? selectedLegal === expert.userId : selectedHR === expert.userId}
                  onSelect={handleSelectExpert}
                  showHourlyRate={true}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredAndSortedInternalExperts.length === 0 && filteredAndSortedExternalExperts.length === 0 && (
            <Alert>
              <AlertDescription className="text-sm">
                No {category} experts found matching your criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Selection Summary Footer */}
        <div className="border-t pt-4 space-y-3 bg-background">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Selected Experts:</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 rounded border bg-muted/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Scale className="h-3 w-3" />
                  <span>Legal:</span>
                </div>
                {selectedLegalExpert ? (
                  <div>
                    <div className="font-medium">{selectedLegalExpert.name}</div>
                    {selectedLegalExpert.hourlyRate && (
                      <div className="text-xs text-muted-foreground">
                        £{selectedLegalExpert.hourlyRate}/hr
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">Not selected</div>
                )}
              </div>

              <div className="p-2 rounded border bg-muted/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <UsersIcon className="h-3 w-3" />
                  <span>HR:</span>
                </div>
                {selectedHRExpert ? (
                  <div>
                    <div className="font-medium">{selectedHRExpert.name}</div>
                    {selectedHRExpert.hourlyRate && (
                      <div className="text-xs text-muted-foreground">
                        £{selectedHRExpert.hourlyRate}/hr
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">Not selected</div>
                )}
              </div>
            </div>

            {estimatedCost > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Estimated Cost: </span>
                <span className="font-semibold">£{estimatedCost}/hr</span>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={handleReset}>
              Reset Selection
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedLegal || !selectedHR}
                className="min-w-[150px]"
              >
                {selectedLegal && selectedHR ? 'Confirm Selection ✓' : 'Select Both Experts'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
