export type CategoryType = 
  | 'ticket'       // Flights, trains, boarding passes, concerts, reservations
  | 'travel'       // Backward compatibility alias for ticket/travel
  | 'payment'      // Bills, invoices, payment due, utility fees
  | 'receipt'      // Receipts, warranties, proof of purchase
  | 'package'      // Deliveries, tracking, shipments
  | 'address'      // Places, venues, locations, maps
  | 'task'         // To-dos, deadlines, work items
  | 'event'        // Calendar appointments, meetings, webinars
  | 'contact'      // Business cards, people, phone/email
  | 'link'         // Web links, articles, publications
  | 'github'       // GitHub repositories, code, technical resources
  | 'document'     // Documents, policies, reference notes
  | 'other' 
  | 'unclear' 
  | 'none';

export type ActionType = 
  | 'calendar' 
  | 'reminder' 
  | 'map' 
  | 'pay' 
  | 'track' 
  | 'task' 
  | 'copy' 
  | 'share' 
  | 'call'
  | 'email'
  | 'contact'
  | 'open_link'
  | 'open_github';

export type RiskLevel = 'low' | 'high';

export type EntityProvenance = 'extracted' | 'inferred' | 'verified';

export interface ExtractedEntity {
  key: string;
  label: string;
  value: string;
  type?: 'text' | 'datetime' | 'currency' | 'location' | 'tracking' | 'phone' | 'email' | 'url' | 'status' | 'code' | 'badge';
  isEditable?: boolean;
  boundingBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000 scale
  provenance?: EntityProvenance; // 'extracted' (direct OCR), 'inferred' (AI calculated), 'verified' (external verification)
  confidence?: number; // 0.0 - 1.0 confidence level
  isWarning?: boolean; // Warning flag for missing or uncertain critical fields
  warningMessage?: string;
}

export interface SuggestedAction {
  id: string;
  title: string;
  subtitle: string;
  actionType: ActionType;
  riskLevel?: RiskLevel;
  isPrimary?: boolean;
  iconName?: string;
  details: {
    eventTitle?: string;
    datetime?: string;
    endDate?: string;
    location?: string;
    amount?: string;
    currency?: string;
    merchant?: string;
    dueDate?: string;
    paymentRef?: string;
    trackingNumber?: string;
    carrier?: string;
    destination?: string;
    orderNumber?: string;
    taskTitle?: string;
    priority?: 'High' | 'Medium' | 'Low';
    project?: string;
    address?: string;
    placeName?: string;
    phone?: string;
    email?: string;
    contactName?: string;
    organization?: string;
    titleRole?: string;
    productName?: string;
    warrantyDate?: string;
    url?: string;
    repoName?: string;
    repoOwner?: string;
    cloneUrl?: string;
    notes?: string;
    mapQuery?: string;
    actionUrl?: string;
  };
}

export interface CarrierCheckpoint {
  time: string;
  location: string;
  status: string;
  isCompleted: boolean;
}

export interface CarrierTrackingInfo {
  carrier: string;
  trackingNumber: string;
  currentStatus: 'label_created' | 'in_transit' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  destination?: string;
  verifiedDestination?: boolean;
  checkpoints: CarrierCheckpoint[];
}

export interface ExecutedAction {
  id: string;
  screenshotId: string;
  actionId: string;
  title: string;
  subtitle: string;
  actionType: ActionType;
  executedAt: number;
  status: 'active' | 'completed' | 'snoozed';
  category?: CategoryType;
  details: SuggestedAction['details'];
  carrierTracking?: CarrierTrackingInfo;
}

export interface ScreenshotItem {
  id: string;
  timestamp: number;
  title: string;
  category: CategoryType;
  summary: string;
  confidenceScore: number;
  imageSrc: string;
  ocrText?: string;
  extractedEntities: ExtractedEntity[];
  suggestedActions: SuggestedAction[];
  executedActions: ExecutedAction[];
  isPreset?: boolean;
  presetBadge?: string;
  isSavedToLibrary?: boolean;
  isArchived?: boolean;
  warnings?: string[];
  categoryConfidence?: number;
}

export type AuthProvider = 'google' | 'github' | 'facebook' | 'email';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  isLoggedIn: boolean;
  tier: 'Free' | 'Pro' | 'Enterprise';
}

export interface UserSettings {
  autoDetectActions: boolean;
  requireConfirmation: 'all' | 'high_impact_only' | 'none';
  defaultReminderOffset: string;
  defaultCalendar: 'google' | 'apple' | 'ics';
  storeScreenshotsLocally: boolean;
  cloudSync: boolean;
  hapticFeedback: boolean;
  theme: 'dark' | 'light';
  deviceFrame: 'mobile' | 'responsive';
}

export type ActiveTab = 'home' | 'history' | 'actions' | 'profile';

export type ViewMode = 'home' | 'processing' | 'result' | 'error';

export type HistoryFilter = 
  | 'all' 
  | 'saved' 
  | 'archived'
  | 'ticket' 
  | 'payment' 
  | 'receipt' 
  | 'package' 
  | 'address' 
  | 'task' 
  | 'event' 
  | 'contact' 
  | 'link' 
  | 'github' 
  | 'document' 
  | 'travel' 
  | 'other';
