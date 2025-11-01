"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpecialistProfile, SPECIALIST_PROFILES } from "@/lib/data/specialist-profiles";
import { ExpertCard } from "./ExpertCard";
import { Search, Scale, Users as UsersIcon, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ExpertSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (legalExpertId: string, hrExpertId: string) => void;
  onCompanyExpertSelect?: (expertId: string, isAdding: boolean) => void; // Immediate callback for internal experts
}

type ExpertCategory = 'legal' | 'hr';
type SortOption = 'rating-desc' | 'rating-asc' | 'response-asc' | 'rate-asc' | 'rate-desc' | 'incidents-desc' | 'availability';

export function ExpertSelectionModal({ open, onOpenChange, onConfirm, onCompanyExpertSelect }: ExpertSelectionModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: My Company, Step 2: External
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

  // Get only ONE legal and ONE HR from company (first available)
  const companyLegal = allLegalExperts.find(s => s.organization === 'client' && s.availability === 'available')
    || allLegalExperts.find(s => s.organization === 'client');
  const companyHR = allHRExperts.find(s => s.organization === 'client' && s.availability === 'available')
    || allHRExperts.find(s => s.organization === 'client');

  const companyExperts = [companyLegal, companyHR].filter(Boolean) as SpecialistProfile[];

  // External experts
  const externalLegalExperts = allLegalExperts.filter(s => s.organization === 'independent');
  const externalHRExperts = allHRExperts.filter(s => s.organization === 'independent');
  const currentExternalExperts = category === 'legal' ? externalLegalExperts : externalHRExperts;

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

  const handleSelectCompanyExpert = (expertId: string, expertRole: 'legal_counsel' | 'data_protection' | 'hr_director' | 'hr_investigator') => {
    const isLegalRole = expertRole === 'legal_counsel' || expertRole === 'data_protection';
    const currentlySelected = isLegalRole ? selectedLegal : selectedHR;
    const isAdding = currentlySelected !== expertId;

    console.log('🔍 handleSelectCompanyExpert called:', {
      expertId,
      expertRole,
      isLegalRole,
      currentlySelected,
      isAdding,
      hasCallback: !!onCompanyExpertSelect
    });

    // Update local state
    if (isLegalRole) {
      setSelectedLegal(selectedLegal === expertId ? null : expertId);
    } else {
      setSelectedHR(selectedHR === expertId ? null : expertId);
    }

    // Immediately notify parent to add/remove from core team list
    if (onCompanyExpertSelect) {
      console.log('✅ Calling onCompanyExpertSelect with:', expertId, isAdding);
      onCompanyExpertSelect(expertId, isAdding);
    } else {
      console.log('❌ No onCompanyExpertSelect callback provided!');
    }
  };

  const handleSelectExternalExpert = (expertId: string) => {
    if (category === 'legal') {
      setSelectedLegal(expertId);
    } else {
      setSelectedHR(expertId);
    }
  };

  const handleContinueToExternal = () => {
    setStep(2);
    setSearchTerm('');
  };

  const handleBackToCompany = () => {
    setStep(1);
    setSearchTerm('');
  };

  const handleConfirm = () => {
    if (selectedLegal && selectedHR) {
      // Call onConfirm to add experts to the team (parent will close modal)
      onConfirm(selectedLegal, selectedHR);

      // Reset state for next time
      setStep(1);
      setSelectedLegal(null);
      setSelectedHR(null);
      setSearchTerm('');
    }
  };

  const handleReset = () => {
    setSelectedLegal(null);
    setSelectedHR(null);
    setStep(1);
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
            {step === 1
              ? "Step 1: Select from your company's incident response team"
              : "Step 2: Or choose external independent experts"}
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

        {/* STEP 1: My Company */}
        {step === 1 && (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h3 className="font-semibold text-sm text-blue-900 mb-1">
                    NorthStar Financial Group - Internal Team
                  </h3>
                  <p className="text-xs text-blue-700">
                    Select Legal and HR representatives from your company
                  </p>
                </div>

                {/* Simplified Company Expert List */}
                {companyExperts.map((expert) => {
                  const isLegalRole = expert.role === 'legal_counsel' || expert.role === 'data_protection';
                  const isSelected = isLegalRole ? selectedLegal === expert.userId : selectedHR === expert.userId;

                  return (
                    <div
                      key={expert.userId}
                      className={`rounded-lg border p-4 hover:bg-muted/40 transition-colors cursor-pointer ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-border bg-muted/20'
                      }`}
                      onClick={() => handleSelectCompanyExpert(expert.userId, expert.role)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectCompanyExpert(expert.userId, expert.role)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-base">{expert.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">{expert.displayRole}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4 space-y-3 bg-background">
              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleContinueToExternal}
                  variant="outline"
                  className="gap-2"
                >
                  View External Experts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: External Experts */}
        {step === 2 && (
          <>
            {/* Category Toggle with External label */}
            <div className="flex items-center gap-3 pb-3 border-b">
              <div className="px-3 py-1.5 bg-purple-100 border border-purple-300 rounded-md">
                <span className="text-sm font-semibold text-purple-900">External Experts</span>
              </div>
              <ToggleGroup type="single" value={category} onValueChange={(val) => val && setCategory(val as ExpertCategory)}>
                <ToggleGroupItem value="legal" className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Legal
                </ToggleGroupItem>
                <ToggleGroupItem value="hr" className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  HR
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
                  <label htmlFor="available-only" className="text-sm cursor-pointer">
                    Available Only
                  </label>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 ml-auto">
                  <label htmlFor="sort-by" className="text-sm">Sort by:</label>
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
                      onSelect={handleSelectExternalExpert}
                      showHourlyRate={true}
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {filteredAndSortedExternalExperts.length === 0 && (
                <Alert>
                  <AlertDescription className="text-sm">
                    No {category} experts found matching your criteria. Try adjusting your filters.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="border-t pt-4 space-y-3 bg-background">
              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={handleBackToCompany}>
                  ← Back to Company Team
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
          </>
        )}

        {/* Selection Summary - Always visible */}
        <div className="border-t pt-3 bg-muted/20">
          <div className="text-sm">
            <div className="font-semibold mb-2">Selected Experts:</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded border bg-background">
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

              <div className="p-2 rounded border bg-background">
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
              <div className="text-sm mt-2">
                <span className="text-muted-foreground">Estimated Cost: </span>
                <span className="font-semibold">£{estimatedCost}/hr</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
