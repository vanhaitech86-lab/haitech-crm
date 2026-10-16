// ========================================================
// HAITECH CRM - CORE TYPE DEFINITIONS
// ========================================================

export type UserRole = 'owner' | 'admin' | 'manager' | 'agent' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  teamId?: string;
  phone?: string;
  allowedChannels?: ChannelType[];
  isOnline: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  memberCount: number;
}

export type ChannelType =
  | 'website'
  | 'facebook'
  | 'instagram'
  | 'telegram'
  | 'tiktok'
  | 'zalo_personal'
  | 'zalo_oa'
  | 'email'
  | 'webhook';

export interface ChannelConnector {
  id: string;
  type: ChannelType;
  name: string;
  accountName: string;
  avatar?: string;
  url?: string;
  status: 'demo' | 'connected' | 'error' | 'disconnected';
  statusMessage?: string;
  isDemo: boolean;
  credentialsConfigured: boolean;
  webhookUrl: string;
  unreadCount: number;
  lastSyncAt: string;
  config: {
    appId?: string;
    pageId?: string;
    botToken?: string;
    oaId?: string;
    apiKey?: string;
    verifyToken?: string;
    url?: string;
    phone?: string;
    [key: string]: any;
  };
}

export type ConversationStatus = 'open' | 'in_progress' | 'waiting' | 'closed';

export interface ConversationParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'agent' | 'bot';
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name: string;
  sizeBytes?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'customer' | 'agent' | 'ai' | 'system';
  senderName: string;
  senderAvatar?: string;
  text: string;
  attachments?: MessageAttachment[];
  isInternalNote?: boolean;
  status: 'sent' | 'delivered' | 'read' | 'mock_simulated' | 'failed';
  createdAt: string;
  clientMessageId?: string;
  metadata?: {
    aiModel?: string;
    confidence?: number;
    tokensUsed?: number;
    approvedBy?: string;
    cannedReplyId?: string;
    channelMessageId?: string;
  };
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  email: string;
  company?: string;
  pipelineStage: string;
  tags: string[];
  notes: string;
  aiMemories: string[];
  leadSource: ChannelType;
  ownerId?: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
  dealsCount?: number;
  totalDealValue?: number;
}

export interface ActivityTimelineItem {
  id: string;
  contactId: string;
  type: 'conversation' | 'note' | 'stage_change' | 'deal_created' | 'task_created' | 'ai_event' | 'call';
  title: string;
  description: string;
  actorName: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  customerPhone?: string;
  customerEmail?: string;
  channel: ChannelType;
  channelAccountName: string;
  assigneeId?: string;
  assigneeName?: string;
  teamId?: string;
  teamName?: string;
  status: ConversationStatus;
  aiAutoReply: boolean;
  aiAutoDispatch: boolean;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  isGroup: boolean;
  tags: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  probability: number; // 0 - 100
  color: string;
  order: number;
}

export interface Deal {
  id: string;
  title: string;
  value: number; // VNĐ
  stageId: string;
  contactId: string;
  contactName: string;
  expectedCloseDate: string;
  ownerId: string;
  ownerName: string;
  channelSource: ChannelType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'overdue';
  assigneeId: string;
  assigneeName: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealTitle?: string;
  conversationId?: string;
  createdAt: string;
}

export interface Subagent {
  id: string;
  name: string;
  description: string;
  goal: string;
  model: 'gpt-4o' | 'claude-3-7-sonnet' | 'gemini-2-flash' | 'local-llm';
  status: 'active' | 'paused' | 'testing';
  allowedTools: string[];
  knowledgeScope: string[];
  confidenceThreshold: number; // e.g. 0.8
  systemPrompt: string;
  autoReplyChannels: ChannelType[];
  metrics: {
    totalSuggestions: number;
    approvedSuggestions: number;
    approvalRate: number;
    avgLatencyMs: number;
    tokensUsed: number;
  };
  lastActiveAt: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'product_specs' | 'pricing_policy' | 'faq' | 'troubleshooting' | 'internal_sop';
  content: string;
  status: 'published' | 'draft';
  version: number;
  authorName: string;
  chunksCount: number;
  lastIndexedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  category: 'conversation' | 'deal' | 'contact' | 'subagent' | 'connector' | 'auth' | 'settings';
  targetType: string;
  targetId: string;
  targetName?: string;
  status: 'success' | 'warning' | 'error';
  ipAddress: string;
  details: string;
}

export interface CrmStats {
  totalConversations: number;
  openConversations: number;
  unreadConversations: number;
  waitingCustomerCount: number;
  totalContacts: number;
  newContactsThisMonth: number;
  pipelineTotalValue: number;
  pipelineDealsCount: number;
  avgResponseTimeMin: number;
  slaComplianceRate: number; // 96.5%
  tasksOverdueCount: number;
  tasksTodayCount: number;
  aiAssistedRate: number;
}

export type SubscriptionPlan = 'trial' | 'starter' | 'pro' | 'enterprise';

export interface CommercialTenant {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  plan: SubscriptionPlan;
  status: 'active' | 'trial' | 'expired';
  isPaid?: boolean;
  trialDaysRemaining?: number;
  expiresAt: string;
  maxUsers: number;
  maxChannels: number;
  monthlyRentalPrice: number;
  googleDriveConnected: boolean;
  avatar?: string;
}

export interface GoogleDriveConfig {
  connected: boolean;
  folderId: string;
  folderName: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  googleSheetUrl?: string;
  connectedAccount?: string;
  autoSyncDaily: boolean;
  autoSync?: boolean;
  lastSyncAt?: string;
  totalRecordsSynced: number;
  serviceAccountEmail?: string;
}

export interface GoogleDriveBackupLog {
  id: string;
  timestamp: string;
  recordCount: number;
  fileFormat: 'google_sheets' | 'csv' | 'xlsx';
  fileName: string;
  fileUrl: string;
  driveUrl?: string;
  fileSize?: string;
  sizeKb: number;
  status: 'success' | 'syncing' | 'failed';
  actorName: string;
}

