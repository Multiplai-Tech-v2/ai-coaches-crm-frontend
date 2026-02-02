import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Briefcase,
  DollarSign,
  Plus,
  Minus,
  Download,
  Save,
  X,
  GripVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

// Type definitions
interface Workshop {
  id: string;
  name: string;
  type: 'unstoppable' | 'roadmap';
  date: string;
  duration: number; // days
  participants: number;
  cost: number;
  status: 'confirmed' | 'forecast' | 'tbd';
}

interface EmbeddedTeam {
  id: string;
  role: string;
  startDate: string;
  durationMonths: number;
  monthlyCost: number;
  status: 'confirmed' | 'forecast' | 'tbd';
}

interface QuarterlyBusinessReview {
  id: string;
  date: string;
  quarter: number;
  status: 'confirmed' | 'forecast' | 'tbd';
}

interface FractionalCAIO {
  startDate: string;
  durationMonths: number;
  monthlyRate: number;
  hoursPerMonth: number;
  status: 'confirmed' | 'forecast' | 'tbd';
  qbrs: QuarterlyBusinessReview[];
}

interface ProposalData {
  companyName: string;
  employeeCount: number;
  startDate: string;
  workshops: Workshop[];
  embeddedTeams: EmbeddedTeam[];
  fractionalCAIO: FractionalCAIO;
}

// Default costs and configurations
const DEFAULT_CAIO_RATE = 15000;
const UNSTOPPABLE_GAME_COST = 12000;
const ROADMAP_WORKSHOP_COST = 8000;
const MAX_PARTICIPANTS_PER_WORKSHOP = 30;
const DEFAULT_TEAM_ROLES = [
  { role: 'Business Analyst', cost: 12000 },
  { role: 'AI Automation Engineer', cost: 15000 },
  { role: 'QA/Data Specialist', cost: 11000 },
];

// Date calculation helper functions
const addWeeks = (date: Date, weeks: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
};

const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }
  
  return result;
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function ProposalBuilder({ onClose, onSave }: { onClose: () => void; onSave: (data: ProposalData) => void }) {
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  
  // Component state
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [embeddedTeams, setEmbeddedTeams] = useState<EmbeddedTeam[]>([]);
  const [fractionalCAIO, setFractionalCAIO] = useState<FractionalCAIO>({
    startDate: '',
    durationMonths: 12,
    monthlyRate: DEFAULT_CAIO_RATE,
    hoursPerMonth: 40,
    status: 'forecast',
    qbrs: [],
  });

  // View state
  const [viewMode, setViewMode] = useState<'form' | 'timeline'>('form');
  const [timelineGranularity, setTimelineGranularity] = useState<'months' | 'weeks' | 'days'>('months');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Update timeline view when start date changes
  useEffect(() => {
    if (startDate && viewMode === 'timeline') {
      const date = new Date(startDate);
      setSelectedMonth(date.getMonth());
      setSelectedYear(date.getFullYear());
    }
  }, [startDate, viewMode]);

  // Generate QBRs when CAIO start date or duration changes
  useEffect(() => {
    if (fractionalCAIO.startDate && fractionalCAIO.durationMonths > 0) {
      const caioStart = new Date(fractionalCAIO.startDate);
      const numQBRs = Math.floor(fractionalCAIO.durationMonths / 3); // One QBR every 3 months
      
      // Only regenerate if the number of QBRs should change or if there are no QBRs yet
      if (fractionalCAIO.qbrs.length !== numQBRs) {
        const newQBRs: QuarterlyBusinessReview[] = [];
        
        for (let i = 0; i < numQBRs; i++) {
          const qbrDate = new Date(caioStart);
          qbrDate.setMonth(qbrDate.getMonth() + (i + 1) * 3); // QBR after each quarter
          
          // Check if we already have a QBR for this quarter
          const existingQBR = fractionalCAIO.qbrs[i];
          
          newQBRs.push({
            id: existingQBR?.id || `qbr-${Date.now()}-${i}`,
            date: existingQBR?.date || formatDateForInput(qbrDate),
            quarter: i + 1,
            status: existingQBR?.status || 'forecast',
          });
        }
        
        setFractionalCAIO(prev => ({ ...prev, qbrs: newQBRs }));
      }
    }
  }, [fractionalCAIO.startDate, fractionalCAIO.durationMonths]);

  // Calculate recommended workshops based on employee count
  useEffect(() => {
    if (employeeCount > 0) {
      const existingUnstoppable = workshops.filter(w => w.type === 'unstoppable');
      const existingRoadmap = workshops.filter(w => w.type === 'roadmap');
      
      // Calculate number of roadmap workshops needed (1 per 30 employees)
      const numRoadmapWorkshopsNeeded = Math.ceil(employeeCount / MAX_PARTICIPANTS_PER_WORKSHOP);
      
      const newWorkshops: Workshop[] = [];
      
      // Calculate dates if start date is set
      let unstoppableDate = '';
      let firstRoadmapDate = '';
      
      if (startDate) {
        const baseDate = new Date(startDate);
        unstoppableDate = startDate; // Same as start date
        
        // First roadmap workshop is 2 weeks after Unstoppable Game
        const roadmapStartDate = addWeeks(baseDate, 2);
        firstRoadmapDate = formatDateForInput(roadmapStartDate);
      }
      
      // Keep or add Unstoppable Company Game
      if (existingUnstoppable.length === 0) {
        newWorkshops.push({
          id: `workshop-unstoppable-${Date.now()}`,
          name: 'Unstoppable Company Game',
          type: 'unstoppable',
          date: unstoppableDate,
          duration: 1,
          participants: Math.min(employeeCount, 30),
          cost: UNSTOPPABLE_GAME_COST,
          status: unstoppableDate ? 'forecast' : 'tbd',
        });
      } else {
        // Update existing unstoppable workshop dates
        newWorkshops.push(...existingUnstoppable.map(w => ({
          ...w,
          date: unstoppableDate,
          status: unstoppableDate ? w.status : 'tbd',
        })));
      }
      
      // Add or update roadmap workshops
      for (let i = 0; i < numRoadmapWorkshopsNeeded; i++) {
        const participantsInThisWorkshop = Math.min(
          MAX_PARTICIPANTS_PER_WORKSHOP,
          employeeCount - (i * MAX_PARTICIPANTS_PER_WORKSHOP)
        );
        
        // Calculate date for this workshop (each subsequent one is 1 business day after)
        let workshopDate = '';
        if (firstRoadmapDate) {
          const roadmapBaseDate = new Date(firstRoadmapDate);
          const thisWorkshopDate = addBusinessDays(roadmapBaseDate, i);
          workshopDate = formatDateForInput(thisWorkshopDate);
        }
        
        // Keep existing roadmap workshop if it exists
        if (existingRoadmap[i]) {
          newWorkshops.push({
            ...existingRoadmap[i],
            participants: participantsInThisWorkshop,
            name: `AI Strategic & Execution Roadmap Workshop ${i + 1}`,
            date: workshopDate,
            status: workshopDate ? existingRoadmap[i].status : 'tbd',
          });
        } else {
          newWorkshops.push({
            id: `workshop-roadmap-${Date.now()}-${i}`,
            name: `AI Strategic & Execution Roadmap Workshop ${i + 1}`,
            type: 'roadmap',
            date: workshopDate,
            duration: 1,
            participants: participantsInThisWorkshop,
            cost: ROADMAP_WORKSHOP_COST,
            status: workshopDate ? 'forecast' : 'tbd',
          });
        }
      }
      
      // Keep any manually added roadmap workshops beyond the recommended count
      const manuallyAddedRoadmap = existingRoadmap.slice(numRoadmapWorkshopsNeeded);
      // Update their dates to continue the sequence
      for (let i = 0; i < manuallyAddedRoadmap.length; i++) {
        let workshopDate = '';
        if (firstRoadmapDate) {
          const roadmapBaseDate = new Date(firstRoadmapDate);
          const thisWorkshopDate = addBusinessDays(roadmapBaseDate, numRoadmapWorkshopsNeeded + i);
          workshopDate = formatDateForInput(thisWorkshopDate);
        }
        newWorkshops.push({
          ...manuallyAddedRoadmap[i],
          date: workshopDate,
          status: workshopDate ? manuallyAddedRoadmap[i].status : 'tbd',
        });
      }

      setWorkshops(newWorkshops);

      // Initialize embedded teams (only once)
      if (embeddedTeams.length === 0) {
        const defaultTeams = DEFAULT_TEAM_ROLES.map((role, index) => ({
          id: `team-${Date.now()}-${index}`,
          role: role.role,
          startDate: '',
          durationMonths: 12,
          monthlyCost: role.cost,
          status: 'forecast' as const,
        }));
        setEmbeddedTeams(defaultTeams);
      }

      // Update embedded teams start date (6 weeks after start date)
      if (startDate && embeddedTeams.length > 0) {
        const baseDate = new Date(startDate);
        const teamsStartDate = addWeeks(baseDate, 6);
        const teamsStartDateStr = formatDateForInput(teamsStartDate);
        
        setEmbeddedTeams(embeddedTeams.map(team => ({
          ...team,
          startDate: teamsStartDateStr,
          status: 'forecast',
        })));
      }

      // Set CAIO start date (6 weeks after start date)
      if (startDate) {
        const baseDate = new Date(startDate);
        const caioStartDate = addWeeks(baseDate, 6);
        const caioStartDateStr = formatDateForInput(caioStartDate);
        
        setFractionalCAIO({
          ...fractionalCAIO,
          startDate: caioStartDateStr,
          status: 'forecast',
        });
      }
    }
  }, [employeeCount, startDate]);

  // Update workshop date
  const updateWorkshop = (id: string, updates: Partial<Workshop>) => {
    setWorkshops(workshops.map(w => (w.id === id ? { ...w, ...updates } : w)));
  };

  // Add new workshop
  const addWorkshop = (type: 'unstoppable' | 'roadmap') => {
    const workshopCount = workshops.filter(w => w.type === type).length;
    
    let calculatedDate = '';
    let status: 'confirmed' | 'forecast' | 'tbd' = 'tbd';
    
    if (type === 'unstoppable' && startDate) {
      calculatedDate = startDate;
      status = 'forecast';
    } else if (type === 'roadmap' && startDate) {
      const baseDate = new Date(startDate);
      const firstRoadmapDate = addWeeks(baseDate, 2);
      // Each roadmap workshop is 1 business day after the previous
      const thisWorkshopDate = addBusinessDays(firstRoadmapDate, workshopCount);
      calculatedDate = formatDateForInput(thisWorkshopDate);
      status = 'forecast';
    }
    
    const newWorkshop: Workshop = {
      id: `workshop-${type}-${Date.now()}`,
      name: type === 'unstoppable' 
        ? 'Unstoppable Company Game' 
        : `AI Strategic & Execution Roadmap Workshop ${workshopCount + 1}`,
      type,
      date: calculatedDate,
      duration: 1,
      participants: 30,
      cost: type === 'unstoppable' ? UNSTOPPABLE_GAME_COST : ROADMAP_WORKSHOP_COST,
      status,
    };
    setWorkshops([...workshops, newWorkshop]);
  };

  // Remove workshop
  const removeWorkshop = (id: string) => {
    setWorkshops(workshops.filter(w => w.id !== id));
  };

  // Update embedded team
  const updateEmbeddedTeam = (id: string, updates: Partial<EmbeddedTeam>) => {
    setEmbeddedTeams(embeddedTeams.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  // Add new embedded team
  const addEmbeddedTeam = () => {
    let calculatedStartDate = '';
    if (startDate) {
      const baseDate = new Date(startDate);
      const teamsStartDate = addWeeks(baseDate, 6);
      calculatedStartDate = formatDateForInput(teamsStartDate);
    }
    
    setEmbeddedTeams([
      ...embeddedTeams,
      {
        id: `team-${Date.now()}`,
        role: 'New Team Member',
        startDate: calculatedStartDate,
        durationMonths: 12,
        monthlyCost: 12000,
        status: calculatedStartDate ? 'forecast' : 'tbd',
      },
    ]);
  };

  // Remove embedded team
  const removeEmbeddedTeam = (id: string) => {
    setEmbeddedTeams(embeddedTeams.filter(t => t.id !== id));
  };

  // Update QBR
  const updateQBR = (id: string, updates: Partial<QuarterlyBusinessReview>) => {
    setFractionalCAIO(prev => ({
      ...prev,
      qbrs: prev.qbrs.map(qbr => (qbr.id === id ? { ...qbr, ...updates } : qbr)),
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    const workshopTotal = workshops.reduce((sum, w) => sum + w.cost, 0);
    const caioTotal = fractionalCAIO.monthlyRate * fractionalCAIO.durationMonths;
    const embeddedTeamTotal = embeddedTeams.reduce(
      (sum, t) => sum + t.monthlyCost * t.durationMonths,
      0
    );
    
    const total = workshopTotal + caioTotal + embeddedTeamTotal;
    const monthlyRunRate = (caioTotal / fractionalCAIO.durationMonths) + 
      embeddedTeams.reduce((sum, t) => sum + t.monthlyCost, 0);

    return {
      workshopTotal,
      caioTotal,
      embeddedTeamTotal,
      total,
      monthlyRunRate,
    };
  };

  const totals = calculateTotals();

  // Generate timeline periods based on granularity
  const generateTimelineMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(selectedYear, selectedMonth + i, 1);
      months.push({
        label: date.toLocaleString('default', { month: 'short' }),
        sublabel: date.getFullYear().toString(),
        fullDate: date,
      });
    }
    return months;
  };

  const generateTimelineWeeks = () => {
    const weeks = [];
    const startDate = new Date(selectedYear, selectedMonth, 1);
    // Find the Monday of the week containing the 1st
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);
    
    // Generate 13 weeks (about 3 months)
    for (let i = 0; i < 13; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      weeks.push({
        label: `Week ${i + 1}`,
        sublabel: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        fullDate: weekStart,
        endDate: weekEnd,
      });
    }
    return weeks;
  };

  const generateTimelineDays = () => {
    const days = [];
    const startDate = new Date(selectedYear, selectedMonth, 1);
    
    // Generate 30 days (1 month)
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      days.push({
        label: date.toLocaleString('default', { weekday: 'short' }),
        sublabel: `${date.getMonth() + 1}/${date.getDate()}`,
        fullDate: date,
      });
    }
    return days;
  };

  const getTimelinePeriods = () => {
    switch (timelineGranularity) {
      case 'weeks':
        return generateTimelineWeeks();
      case 'days':
        return generateTimelineDays();
      default:
        return generateTimelineMonths();
    }
  };

  const timelinePeriods = getTimelinePeriods();
  const timelineMonths = generateTimelineMonths(); // Keep for backward compatibility

  // Check if a workshop falls in a specific period
  const isWorkshopInPeriod = (workshop: Workshop, period: any) => {
    if (!workshop.date) return false;
    const workshopDate = new Date(workshop.date);
    workshopDate.setHours(0, 0, 0, 0);
    
    if (timelineGranularity === 'months') {
      return (
        workshopDate.getMonth() === period.fullDate.getMonth() &&
        workshopDate.getFullYear() === period.fullDate.getFullYear()
      );
    } else if (timelineGranularity === 'weeks') {
      const periodStart = new Date(period.fullDate);
      const periodEnd = new Date(period.endDate);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd.setHours(23, 59, 59, 999);
      return workshopDate >= periodStart && workshopDate <= periodEnd;
    } else {
      // days
      const periodDate = new Date(period.fullDate);
      periodDate.setHours(0, 0, 0, 0);
      return workshopDate.getTime() === periodDate.getTime();
    }
  };

  // Legacy function for backward compatibility
  const isWorkshopInMonth = (workshop: Workshop, monthDate: Date) => {
    if (!workshop.date) return false;
    const workshopDate = new Date(workshop.date);
    return (
      workshopDate.getMonth() === monthDate.getMonth() &&
      workshopDate.getFullYear() === monthDate.getFullYear()
    );
  };

  // Check if CAIO is active in a specific period
  const isCAIOActiveInPeriod = (period: any) => {
    if (!fractionalCAIO.startDate) return false;
    const caioStart = new Date(fractionalCAIO.startDate);
    const caioEnd = new Date(caioStart);
    caioEnd.setMonth(caioEnd.getMonth() + fractionalCAIO.durationMonths);
    
    if (timelineGranularity === 'months') {
      const periodStart = new Date(period.fullDate);
      const periodEnd = new Date(period.fullDate);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      return caioStart < periodEnd && caioEnd > periodStart;
    } else if (timelineGranularity === 'weeks') {
      return caioStart <= period.endDate && caioEnd > period.fullDate;
    } else {
      // days
      const periodDate = new Date(period.fullDate);
      const nextDay = new Date(periodDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return caioStart < nextDay && caioEnd > periodDate;
    }
  };

  // Legacy function for backward compatibility
  const isCAIOActiveInMonth = (monthDate: Date) => {
    if (!fractionalCAIO.startDate) return false;
    const startDate = new Date(fractionalCAIO.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + fractionalCAIO.durationMonths);
    return monthDate >= startDate && monthDate < endDate;
  };

  // Check if embedded team is active in a specific period
  const isTeamActiveInPeriod = (team: EmbeddedTeam, period: any) => {
    if (!team.startDate) return false;
    const teamStart = new Date(team.startDate);
    const teamEnd = new Date(teamStart);
    teamEnd.setMonth(teamEnd.getMonth() + team.durationMonths);
    
    if (timelineGranularity === 'months') {
      const periodStart = new Date(period.fullDate);
      const periodEnd = new Date(period.fullDate);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      return teamStart < periodEnd && teamEnd > periodStart;
    } else if (timelineGranularity === 'weeks') {
      return teamStart <= period.endDate && teamEnd > period.fullDate;
    } else {
      // days
      const periodDate = new Date(period.fullDate);
      const nextDay = new Date(periodDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return teamStart < nextDay && teamEnd > periodDate;
    }
  };

  // Legacy function for backward compatibility
  const isTeamActiveInMonth = (team: EmbeddedTeam, monthDate: Date) => {
    if (!team.startDate) return false;
    const startDate = new Date(team.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + team.durationMonths);
    return monthDate >= startDate && monthDate < endDate;
  };

  // Check if a QBR falls in a specific period
  const isQBRInPeriod = (qbr: QuarterlyBusinessReview, period: any) => {
    if (!qbr.date) return false;
    const qbrDate = new Date(qbr.date);
    qbrDate.setHours(0, 0, 0, 0);
    
    if (timelineGranularity === 'months') {
      return (
        qbrDate.getMonth() === period.fullDate.getMonth() &&
        qbrDate.getFullYear() === period.fullDate.getFullYear()
      );
    } else if (timelineGranularity === 'weeks') {
      const periodStart = new Date(period.fullDate);
      const periodEnd = new Date(period.endDate);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd.setHours(23, 59, 59, 999);
      return qbrDate >= periodStart && qbrDate <= periodEnd;
    } else {
      // days
      const periodDate = new Date(period.fullDate);
      periodDate.setHours(0, 0, 0, 0);
      return qbrDate.getTime() === periodDate.getTime();
    }
  };

  const handleSave = () => {
    const proposalData: ProposalData = {
      companyName,
      employeeCount,
      startDate,
      workshops,
      embeddedTeams,
      fractionalCAIO,
    };
    onSave(proposalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Engagement Proposal Builder</h2>
            <p className="text-sm text-gray-500 mt-1">
              Based on the AI Sweet Spot™ engagement model
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'form' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('form')}
              >
                <Settings2 className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Timeline
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'form' ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2 block">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700 mb-2 block">
                      Number of Employees *
                    </Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      value={employeeCount || ''}
                      onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 0)}
                      placeholder="Enter employee count"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                      Proposed Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {startDate && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">Auto-calculated Schedule:</p>
                        <ul className="space-y-0.5 ml-2">
                          <li>• Unstoppable Company Game: {new Date(startDate).toLocaleDateString()}</li>
                          <li>• First Roadmap Workshop: {addWeeks(new Date(startDate), 2).toLocaleDateString()}</li>
                          <li>• Embedded Teams & CAIO Start: {addWeeks(new Date(startDate), 6).toLocaleDateString()}</li>
                        </ul>
                        <p className="mt-1 text-blue-600 italic">All dates can be manually adjusted below</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Strategic Ideation */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Strategic Ideation</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Foundation workshop - scheduled on start date
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {workshops.filter(w => w.type === 'unstoppable').length} Workshop(s)
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => addWorkshop('unstoppable')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Workshop
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                {workshops
                  .filter((w) => w.type === 'unstoppable')
                  .map((workshop) => (
                    <div key={workshop.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{workshop.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">1-day strategic workshop</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWorkshop(workshop.id)}
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">
                            Date
                          </Label>
                          <Input
                            type="date"
                            value={workshop.date}
                            onChange={(e) => updateWorkshop(workshop.id, { date: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">
                            Participants
                          </Label>
                          <Input
                            type="number"
                            value={workshop.participants}
                            onChange={(e) =>
                              updateWorkshop(workshop.id, {
                                participants: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">
                            Cost ($)
                          </Label>
                          <Input
                            type="number"
                            value={workshop.cost}
                            onChange={(e) =>
                              updateWorkshop(workshop.id, {
                                cost: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full text-sm"
                            placeholder="12000"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">
                            Status
                          </Label>
                          <Select
                            value={workshop.status}
                            onValueChange={(value) =>
                              updateWorkshop(workshop.id, {
                                status: value as 'confirmed' | 'forecast' | 'tbd',
                              })
                            }
                          >
                            <SelectTrigger className="w-full text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                  <span>Confirmed</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="forecast">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-blue-600" />
                                  <span>Forecast</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="tbd">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-3 h-3 text-gray-600" />
                                  <span>TBD</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Change Management & Enablement */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Change Management & Enablement
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Roadmap workshops - starts 2 weeks after Unstoppable Game, 1 business day apart (1 per 30 employees)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {workshops.filter((w) => w.type === 'roadmap').length} Workshop(s)
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => addWorkshop('roadmap')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Workshop
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {workshops
                    .filter((w) => w.type === 'roadmap')
                    .map((workshop) => (
                      <div key={workshop.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{workshop.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              1-day roadmap workshop - {workshop.participants} participants
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWorkshop(workshop.id)}
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">
                              Date
                            </Label>
                            <Input
                              type="date"
                              value={workshop.date}
                              onChange={(e) => updateWorkshop(workshop.id, { date: e.target.value })}
                              className="w-full text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">
                              Participants
                            </Label>
                            <Input
                              type="number"
                              value={workshop.participants}
                              onChange={(e) =>
                                updateWorkshop(workshop.id, {
                                  participants: parseInt(e.target.value) || 0,
                                })
                              }
                              max={MAX_PARTICIPANTS_PER_WORKSHOP}
                              className="w-full text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">
                              Cost ($)
                            </Label>
                            <Input
                              type="number"
                              value={workshop.cost}
                              onChange={(e) =>
                                updateWorkshop(workshop.id, {
                                  cost: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full text-sm"
                              placeholder="8000"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">
                              Status
                            </Label>
                            <Select
                              value={workshop.status}
                              onValueChange={(value) =>
                                updateWorkshop(workshop.id, {
                                  status: value as 'confirmed' | 'forecast' | 'tbd',
                                })
                              }
                            >
                              <SelectTrigger className="w-full text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirmed">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    <span>Confirmed</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="forecast">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-blue-600" />
                                    <span>Forecast</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="tbd">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-gray-600" />
                                    <span>TBD</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              {/* Fractional CAIO */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Fractional Chief AI Officer
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ongoing strategic AI leadership - starts 6 weeks after kickoff
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Always Recommended
                  </Badge>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        value={fractionalCAIO.startDate}
                        onChange={(e) =>
                          setFractionalCAIO({ ...fractionalCAIO, startDate: e.target.value })
                        }
                        className="w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">
                        Duration (Months)
                      </Label>
                      <Input
                        type="number"
                        value={fractionalCAIO.durationMonths}
                        onChange={(e) =>
                          setFractionalCAIO({
                            ...fractionalCAIO,
                            durationMonths: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">
                        Monthly Rate ($)
                      </Label>
                      <Input
                        type="number"
                        value={fractionalCAIO.monthlyRate}
                        onChange={(e) =>
                          setFractionalCAIO({
                            ...fractionalCAIO,
                            monthlyRate: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">
                        Hours/Month
                      </Label>
                      <Input
                        type="number"
                        value={fractionalCAIO.hoursPerMonth}
                        onChange={(e) =>
                          setFractionalCAIO({
                            ...fractionalCAIO,
                            hoursPerMonth: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span className="text-sm font-medium text-gray-700">Total CAIO Investment</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${totals.caioTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Quarterly Business Reviews */}
                  {fractionalCAIO.qbrs.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Quarterly Business Reviews
                      </h4>
                      <div className="space-y-2">
                        {fractionalCAIO.qbrs.map((qbr) => (
                          <div
                            key={qbr.id}
                            className="border border-gray-200 rounded-lg p-3 bg-white"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1 block">
                                  Quarter {qbr.quarter}
                                </Label>
                                <Input
                                  type="date"
                                  value={qbr.date}
                                  onChange={(e) =>
                                    updateQBR(qbr.id, { date: e.target.value })
                                  }
                                  className="w-full text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-xs font-medium text-gray-700 mb-1 block">
                                  Status
                                </Label>
                                <Select
                                  value={qbr.status}
                                  onValueChange={(value) =>
                                    updateQBR(qbr.id, {
                                      status: value as 'confirmed' | 'forecast' | 'tbd',
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="confirmed">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                                        <span>Confirmed</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="forecast">
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-blue-600" />
                                        <span>Forecast</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="tbd">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3 text-gray-600" />
                                        <span>TBD</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Embedded Execution Teams */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Embedded Execution Teams</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Dedicated full-time resources - all start 6 weeks after kickoff
                    </p>
                  </div>
                  <Button size="sm" onClick={addEmbeddedTeam}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>

                <div className="space-y-3">
                  {embeddedTeams.map((team) => (
                    <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400 mt-2" />
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <Input
                              value={team.role}
                              onChange={(e) => updateEmbeddedTeam(team.id, { role: e.target.value })}
                              className="text-base font-medium max-w-md"
                              placeholder="Role title"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">
                                ${(team.monthlyCost * team.durationMonths).toLocaleString()}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEmbeddedTeam(team.id)}
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">
                                Start Date
                              </Label>
                              <Input
                                type="date"
                                value={team.startDate}
                                onChange={(e) =>
                                  updateEmbeddedTeam(team.id, { startDate: e.target.value })
                                }
                                className="w-full text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">
                                Duration (Months)
                              </Label>
                              <Input
                                type="number"
                                value={team.durationMonths}
                                onChange={(e) =>
                                  updateEmbeddedTeam(team.id, {
                                    durationMonths: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-full text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">
                                Monthly Cost ($)
                              </Label>
                              <Input
                                type="number"
                                value={team.monthlyCost}
                                onChange={(e) =>
                                  updateEmbeddedTeam(team.id, {
                                    monthlyCost: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-full text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {embeddedTeams.length > 0 && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded mt-4">
                    <span className="text-sm font-medium text-gray-700">
                      Total Embedded Team Investment
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${totals.embeddedTeamTotal.toLocaleString()}
                    </span>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            // Timeline View
            <div className="space-y-6">
              {/* Timeline Controls */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedMonth === 0) {
                          setSelectedMonth(11);
                          setSelectedYear(selectedYear - 1);
                        } else {
                          setSelectedMonth(selectedMonth - 1);
                        }
                      }}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-700">
                      {timelineGranularity === 'months' && (
                        <>
                          {new Date(selectedYear, selectedMonth).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          - {timelineMonths[11]?.label} {timelineMonths[11]?.sublabel}
                        </>
                      )}
                      {timelineGranularity === 'weeks' && (
                        <>
                          {new Date(selectedYear, selectedMonth).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          (13 weeks)
                        </>
                      )}
                      {timelineGranularity === 'days' && (
                        <>
                          {new Date(selectedYear, selectedMonth).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          (30 days)
                        </>
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedMonth === 11) {
                          setSelectedMonth(0);
                          setSelectedYear(selectedYear + 1);
                        } else {
                          setSelectedMonth(selectedMonth + 1);
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600">Forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">TBD</span>
                    </div>
                  </div>
                </div>
                
                {/* Granularity Selector */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">View:</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={timelineGranularity === 'months' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimelineGranularity('months')}
                    >
                      Months
                    </Button>
                    <Button
                      variant={timelineGranularity === 'weeks' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimelineGranularity('weeks')}
                    >
                      Weeks
                    </Button>
                    <Button
                      variant={timelineGranularity === 'days' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimelineGranularity('days')}
                    >
                      Days
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Timeline Grid */}
              <Card className="p-6">
                <div className="overflow-x-auto">
                  <div className={timelineGranularity === 'days' ? 'min-w-[2400px]' : 'min-w-[1200px]'}>
                    {/* Period Headers */}
                    <div className={`grid gap-2 mb-4 ${
                      timelineGranularity === 'months' ? 'grid-cols-12' : 
                      timelineGranularity === 'weeks' ? 'grid-cols-13' : 
                      'grid-cols-30'
                    }`}>
                      {timelinePeriods.map((period, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs font-semibold text-gray-700">{period.label}</div>
                          <div className="text-xs text-gray-500">{period.sublabel}</div>
                        </div>
                      ))}
                    </div>

                    {/* Workshops Row */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <h4 className="text-sm font-semibold text-gray-900">Workshops</h4>
                      </div>
                      <div className={`grid gap-2 h-16 ${
                        timelineGranularity === 'months' ? 'grid-cols-12' : 
                        timelineGranularity === 'weeks' ? 'grid-cols-13' : 
                        'grid-cols-30'
                      }`}>
                        {timelinePeriods.map((period, index) => {
                          const workshopsInPeriod = workshops.filter((w) =>
                            isWorkshopInPeriod(w, period)
                          );
                          return (
                            <div
                              key={index}
                              className="border border-gray-200 rounded bg-gray-50 p-1 relative"
                            >
                              {workshopsInPeriod.map((workshop, wIndex) => (
                                <div
                                  key={wIndex}
                                  className={`text-xs p-1 rounded mb-1 ${
                                    workshop.status === 'confirmed'
                                      ? 'bg-green-100 text-green-700'
                                      : workshop.status === 'forecast'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                  title={workshop.name}
                                >
                                  <div className="truncate font-medium">
                                    {workshop.type === 'unstoppable' ? 'UCG' : 'RW'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fractional CAIO Row */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <h4 className="text-sm font-semibold text-gray-900">Fractional CAIO</h4>
                      </div>
                      <div className={`grid gap-2 h-12 ${
                        timelineGranularity === 'months' ? 'grid-cols-12' : 
                        timelineGranularity === 'weeks' ? 'grid-cols-13' : 
                        'grid-cols-30'
                      }`}>
                        {timelinePeriods.map((period, index) => {
                          const isActive = isCAIOActiveInPeriod(period);
                          return (
                            <div
                              key={index}
                              className={`border rounded p-1 flex items-center justify-center ${
                                isActive
                                  ? 'bg-green-100 border-green-300'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              {isActive && (
                                <div className="text-xs font-medium text-green-700">Active</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* QBR Row */}
                    {fractionalCAIO.qbrs.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-orange-600" />
                          <h4 className="text-sm font-semibold text-gray-900">Quarterly Business Reviews</h4>
                        </div>
                        <div className={`grid gap-2 h-16 ${
                          timelineGranularity === 'months' ? 'grid-cols-12' : 
                          timelineGranularity === 'weeks' ? 'grid-cols-13' : 
                          'grid-cols-30'
                        }`}>
                          {timelinePeriods.map((period, index) => {
                            const qbrsInPeriod = fractionalCAIO.qbrs.filter((qbr) =>
                              isQBRInPeriod(qbr, period)
                            );
                            return (
                              <div
                                key={index}
                                className="border border-gray-200 rounded bg-gray-50 p-1 relative"
                              >
                                {qbrsInPeriod.map((qbr, qIndex) => (
                                  <div
                                    key={qIndex}
                                    className={`text-xs p-1 rounded mb-1 ${
                                      qbr.status === 'confirmed'
                                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                                        : qbr.status === 'forecast'
                                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                                    title={`QBR Q${qbr.quarter}`}
                                  >
                                    <div className="truncate font-medium text-center">
                                      Q{qbr.quarter}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Embedded Teams Rows */}
                    {embeddedTeams.map((team) => (
                      <div key={team.id} className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <h4 className="text-sm font-semibold text-gray-900">{team.role}</h4>
                        </div>
                        <div className={`grid gap-2 h-12 ${
                          timelineGranularity === 'months' ? 'grid-cols-12' : 
                          timelineGranularity === 'weeks' ? 'grid-cols-13' : 
                          'grid-cols-30'
                        }`}>
                          {timelinePeriods.map((period, index) => {
                            const isActive = isTeamActiveInPeriod(team, period);
                            return (
                              <div
                                key={index}
                                className={`border rounded p-1 flex items-center justify-center ${
                                  isActive
                                    ? 'bg-blue-100 border-blue-300'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                {isActive && (
                                  <div className="text-xs font-medium text-blue-700">Active</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="grid grid-cols-4 gap-6 flex-1">
              <div>
                <p className="text-xs text-gray-500 mb-1">Workshops</p>
                <p className="text-lg font-bold text-gray-900">
                  ${totals.workshopTotal.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Fractional CAIO</p>
                <p className="text-lg font-bold text-gray-900">
                  ${totals.caioTotal.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Embedded Teams</p>
                <p className="text-lg font-bold text-gray-900">
                  ${totals.embeddedTeamTotal.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Monthly Run Rate</p>
                <p className="text-lg font-bold text-blue-600">
                  ${totals.monthlyRunRate.toLocaleString()}/mo
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Engagement Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totals.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={handleSave} disabled={!companyName || employeeCount === 0}>
                <Save className="w-4 h-4 mr-2" />
                Save Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
