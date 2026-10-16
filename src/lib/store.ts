import {
  User,
  Team,
  ChannelConnector,
  Conversation,
  Message,
  Contact,
  Deal,
  PipelineStage,
  Task,
  Subagent,
  KnowledgeDocument,
  AuditLog,
  CrmStats,
  CommercialTenant,
  SubscriptionPlan,
  GoogleDriveConfig,
  GoogleDriveBackupLog,
} from '../types/crm';
import {
  initialCurrentUser,
  initialUsers,
  initialTeams,
  initialConnectors,
  initialPipelineStages,
  initialContacts,
  initialConversations,
  initialMessages,
  initialDeals,
  initialTasks,
  initialSubagents,
  initialKnowledge,
  initialAuditLogs,
  initialCrmStats,
} from './seedData';

// Storage keys
const STORAGE_PREFIX = 'haitech_crm_v1_';

class HaitechCrmStore {
  private currentUser: User = initialCurrentUser;
  private users: User[] = [...initialUsers];
  private teams: Team[] = [...initialTeams];
  private connectors: ChannelConnector[] = [...initialConnectors];
  private pipelineStages: PipelineStage[] = [...initialPipelineStages];
  private contacts: Contact[] = [...initialContacts];
  private conversations: Conversation[] = [...initialConversations];
  private messages: Record<string, Message[]> = { ...initialMessages };
  private deals: Deal[] = [...initialDeals];
  private tasks: Task[] = [...initialTasks];
  private subagents: Subagent[] = [...initialSubagents];
  private knowledge: KnowledgeDocument[] = [...initialKnowledge];
  private auditLogs: AuditLog[] = [...initialAuditLogs];
  private stats: CrmStats = { ...initialCrmStats };

  private currentTenant: CommercialTenant = {
    id: 'tenant-haitech-01',
    name: 'HAITECH AI',
    companyName: 'HAITECH AI SYSTEM CO., LTD',
    email: 'ai@haitech.vn',
    phone: '098739896',
    plan: 'enterprise',
    status: 'active',
    expiresAt: '2026-12-31',
    maxUsers: 50,
    maxChannels: 20,
    monthlyRentalPrice: 2490000,
    googleDriveConnected: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  private googleDriveConfig: GoogleDriveConfig = {
    connected: true,
    folderId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74HAITECH',
    folderName: 'HAITECH_CRM_DATABASE_BACKUPS',
    spreadsheetId: '1haitech_sheets_customer_data_2026_sync',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1haitech_sheets_customer_data_2026_sync/edit',
    autoSyncDaily: true,
    lastSyncAt: 'Hôm nay lúc 08:30 (Đã đồng bộ 100%)',
    totalRecordsSynced: 142,
    serviceAccountEmail: 'haitech-drive-sync@haitech-crm-cloud.iam.gserviceaccount.com',
  };

  private googleDriveBackupLogs: GoogleDriveBackupLog[] = [
    {
      id: 'gdrive-log-1',
      timestamp: '16/10/2026 08:30:15',
      recordCount: 142,
      fileFormat: 'google_sheets',
      fileName: 'HAITECH_CRM_Customer_Master_2026.xlsx',
      fileUrl: 'https://docs.google.com/spreadsheets/d/1haitech_sheets_customer_data_2026_sync/edit',
      sizeKb: 348,
      status: 'success',
      actorName: 'Tự động (Cron Sync)',
    },
    {
      id: 'gdrive-log-2',
      timestamp: '15/10/2026 00:00:02',
      recordCount: 138,
      fileFormat: 'csv',
      fileName: 'HAITECH_CRM_Backup_Daily_15102026.csv',
      fileUrl: 'https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74HAITECH',
      sizeKb: 284,
      status: 'success',
      actorName: 'HAITECH AI (Admin)',
    },
  ];

  private listeners: Set<() => void> = new Set();
  private isBrowser: boolean = typeof window !== 'undefined';

  constructor() {
    if (this.isBrowser) {
      this.loadFromStorage();
    }
  }

  private saveToStorage() {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + 'contacts', JSON.stringify(this.contacts));
      localStorage.setItem(STORAGE_PREFIX + 'conversations', JSON.stringify(this.conversations));
      localStorage.setItem(STORAGE_PREFIX + 'messages', JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_PREFIX + 'deals', JSON.stringify(this.deals));
      localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(this.tasks));
      localStorage.setItem(STORAGE_PREFIX + 'connectors', JSON.stringify(this.connectors));
      localStorage.setItem(STORAGE_PREFIX + 'subagents', JSON.stringify(this.subagents));
      localStorage.setItem(STORAGE_PREFIX + 'knowledge', JSON.stringify(this.knowledge));
      localStorage.setItem(STORAGE_PREFIX + 'auditLogs', JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(this.users));
      localStorage.setItem(STORAGE_PREFIX + 'tenant', JSON.stringify(this.currentTenant));
      localStorage.setItem(STORAGE_PREFIX + 'driveConfig', JSON.stringify(this.googleDriveConfig));
      localStorage.setItem(STORAGE_PREFIX + 'driveLogs', JSON.stringify(this.googleDriveBackupLogs));
    } catch (e) {
      console.warn('Failed to persist to localStorage', e);
    }
  }

  private loadFromStorage() {
    if (!this.isBrowser) return;
    try {
      const storedConvs = localStorage.getItem(STORAGE_PREFIX + 'conversations');
      if (storedConvs) this.conversations = JSON.parse(storedConvs);

      const storedMsgs = localStorage.getItem(STORAGE_PREFIX + 'messages');
      if (storedMsgs) this.messages = JSON.parse(storedMsgs);

      const storedContacts = localStorage.getItem(STORAGE_PREFIX + 'contacts');
      if (storedContacts) this.contacts = JSON.parse(storedContacts);

      const storedDeals = localStorage.getItem(STORAGE_PREFIX + 'deals');
      if (storedDeals) this.deals = JSON.parse(storedDeals);

      const storedTasks = localStorage.getItem(STORAGE_PREFIX + 'tasks');
      if (storedTasks) this.tasks = JSON.parse(storedTasks);

      const storedConnectors = localStorage.getItem(STORAGE_PREFIX + 'connectors');
      if (storedConnectors) this.connectors = JSON.parse(storedConnectors);

      const storedSubagents = localStorage.getItem(STORAGE_PREFIX + 'subagents');
      if (storedSubagents) this.subagents = JSON.parse(storedSubagents);

      const storedKb = localStorage.getItem(STORAGE_PREFIX + 'knowledge');
      if (storedKb) this.knowledge = JSON.parse(storedKb);

      const storedAudit = localStorage.getItem(STORAGE_PREFIX + 'auditLogs');
      if (storedAudit) this.auditLogs = JSON.parse(storedAudit);

      const storedUsers = localStorage.getItem(STORAGE_PREFIX + 'users');
      if (storedUsers) this.users = JSON.parse(storedUsers);

      const storedTenant = localStorage.getItem(STORAGE_PREFIX + 'tenant');
      if (storedTenant) this.currentTenant = JSON.parse(storedTenant);

      const storedDrive = localStorage.getItem(STORAGE_PREFIX + 'driveConfig');
      if (storedDrive) this.googleDriveConfig = JSON.parse(storedDrive);

      const storedDriveLogs = localStorage.getItem(STORAGE_PREFIX + 'driveLogs');
      if (storedDriveLogs) this.googleDriveBackupLogs = JSON.parse(storedDriveLogs);
    } catch (e) {
      console.error('Error loading HAITECH CRM storage:', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((fn) => fn());
  }

  // ==========================================
  // RESET SEED DATA
  // ==========================================
  public resetSeedData() {
    this.currentUser = { ...initialCurrentUser };
    this.users = [...initialUsers];
    this.teams = [...initialTeams];
    this.connectors = JSON.parse(JSON.stringify(initialConnectors));
    this.pipelineStages = JSON.parse(JSON.stringify(initialPipelineStages));
    this.contacts = JSON.parse(JSON.stringify(initialContacts));
    this.conversations = JSON.parse(JSON.stringify(initialConversations));
    this.messages = JSON.parse(JSON.stringify(initialMessages));
    this.deals = JSON.parse(JSON.stringify(initialDeals));
    this.tasks = JSON.parse(JSON.stringify(initialTasks));
    this.subagents = JSON.parse(JSON.stringify(initialSubagents));
    this.knowledge = JSON.parse(JSON.stringify(initialKnowledge));
    this.auditLogs = [
      {
        id: 'audit-reset-' + Date.now(),
        timestamp: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
        actorId: this.currentUser.id,
        actorName: this.currentUser.name,
        actorRole: this.currentUser.role,
        action: 'Khôi phục dữ liệu mẫu (Reset Seed Data)',
        category: 'settings',
        targetType: 'system',
        targetId: 'all',
        status: 'success',
        ipAddress: '127.0.0.1 (Local Session)',
        details: 'Đã hoàn tác và tải lại toàn bộ 142 hội thoại, deals, nhiệm vụ và connectors ban đầu.',
      },
      ...initialAuditLogs,
    ];
    this.stats = { ...initialCrmStats };
    this.notify();
    return true;
  }

  // ==========================================
  // CONVERSATIONS
  // ==========================================
  public getConversations(): Conversation[] {
    return [...this.conversations];
  }

  public getConversation(id: string): Conversation | undefined {
    return this.conversations.find((c) => c.id === id);
  }

  public updateConversation(id: string, partial: Partial<Conversation>) {
    const idx = this.conversations.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.conversations[idx] = { ...this.conversations[idx], ...partial };
      this.notify();
      return this.conversations[idx];
    }
    return undefined;
  }

  // ==========================================
  // MESSAGES
  // ==========================================
  public getMessages(conversationId: string): Message[] {
    return this.messages[conversationId] || [];
  }

  public sendMessage(
    conversationId: string,
    messagePayload: {
      text: string;
      senderType?: 'agent' | 'customer' | 'ai' | 'system';
      senderName?: string;
      isInternalNote?: boolean;
      status?: 'sent' | 'delivered' | 'read' | 'mock_simulated' | 'failed';
      metadata?: Record<string, any>;
    }
  ): Message {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      conversationId,
      senderType: messagePayload.senderType || 'agent',
      senderName: messagePayload.senderName || this.currentUser.name,
      text: messagePayload.text,
      isInternalNote: messagePayload.isInternalNote || false,
      status: messagePayload.status || 'sent',
      createdAt: timeStr,
      metadata: messagePayload.metadata,
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMsg);

    // Update conversation snippet and time
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessageSnippet = `${newMsg.senderName}: ${newMsg.text.slice(0, 45)}${newMsg.text.length > 45 ? '...' : ''}`;
      conv.lastMessageTime = 'Vừa xong';
      if (newMsg.senderType === 'customer') {
        conv.unreadCount += 1;
      }
    }

    // Add audit log
    this.addAuditLog({
      action: newMsg.isInternalNote ? 'Tạo ghi chú nội bộ' : 'Gửi tin nhắn phản hồi',
      category: 'conversation',
      targetType: 'conversation',
      targetId: conversationId,
      targetName: conv?.customerName || conversationId,
      status: 'success',
      details: `Nội dung: "${newMsg.text.slice(0, 60)}..." [${newMsg.status === 'mock_simulated' ? 'DEMO MOCK' : 'THỰC TẾ'}]`,
    });

    this.notify();
    return newMsg;
  }

  // ==========================================
  // AI SUGGESTION
  // ==========================================
  public generateAiSuggestion(conversationId: string): { suggestion: string; confidence: number; source: string } {
    const conv = this.getConversation(conversationId);
    const msgs = this.getMessages(conversationId);
    const lastCustomerMsg = [...msgs].reverse().find((m) => m.senderType === 'customer');

    const customerText = (lastCustomerMsg?.text || '').toLowerCase();

    if (customerText.includes('thử nghiệm') || customerText.includes('tiêu chuẩn') || customerText.includes('qcvn')) {
      return {
        suggestion:
          'Dạ vâng, bên em có đầy đủ hồ sơ kiểm định theo Quy chuẩn kỹ thuật quốc gia QCVN 6-1:2010/BYT từ Viện Sức khỏe Nghề nghiệp & Môi trường. Em xin phép gửi file PDF kết quả thử nghiệm và catalog chi tiết qua đây cho chị nhé!',
        confidence: 0.96,
        source: 'KB-02: Tiêu chuẩn Kỹ thuật Máy Lọc Nước Dakrong',
      };
    }

    if (customerText.includes('báo giá') || customerText.includes('chi phí') || customerText.includes('giá')) {
      return {
        suggestion:
          'Dạ chào anh/chị, HAITECH CRM hiện có các gói linh hoạt: Startup (1.500.000đ/th), Growth (3.800.000đ/th) và Enterprise tùy chỉnh. Nếu thanh toán theo năm bên em có chính sách chiết khấu 15-25% và miễn phí tích hợp 8 kênh đa nền tảng ạ!',
        confidence: 0.94,
        source: 'KB-01: Bảng giá & Chính sách Dịch vụ HAITECH CRM 2026',
      };
    }

    if (customerText.includes('live') || customerText.includes('livestream') || customerText.includes('tiktok')) {
      return {
        suggestion:
          'Dạ chào anh! Kịch bản AI Subagent Livestream của HAITECH tự động quét bình luận theo cú pháp đặt hàng chỉ mất 0.2s, đồng thời tự động gửi tin nhắn xác nhận qua Zalo cá nhân/Messenger để chốt đơn mà không lo sót khách ạ.',
        confidence: 0.97,
        source: 'Subagent: FlashSale Livestream & CSKH Đa Kênh',
      };
    }

    return {
      suggestion:
        `Dạ chào ${conv?.customerName || 'anh/chị'}, em là trợ lý của HAITECH CRM. Em đã ghi nhận yêu cầu và sẽ hỗ trợ kiểm tra thông tin để giải đáp ngay cho mình ạ!`,
      confidence: 0.88,
      source: 'Quy trình Tiếp nhận Tiêu chuẩn HAITECH SOP-01',
    };
  }

  // ==========================================
  // CONTACTS & CRM
  // ==========================================
  public getContacts(): Contact[] {
    return [...this.contacts];
  }

  public getContact(id: string): Contact | undefined {
    return this.contacts.find((c) => c.id === id);
  }

  public updateContact(id: string, partial: Partial<Contact>) {
    const idx = this.contacts.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.contacts[idx] = { ...this.contacts[idx], ...partial, updatedAt: new Date().toISOString() };
      this.notify();
      return this.contacts[idx];
    }
    return undefined;
  }

  public addContactMemory(contactId: string, memoryText: string) {
    const contact = this.getContact(contactId);
    if (contact && memoryText.trim()) {
      contact.aiMemories.push(memoryText.trim());
      this.addAuditLog({
        action: 'Thêm AI Ghi nhớ về khách',
        category: 'contact',
        targetType: 'contact',
        targetId: contactId,
        targetName: contact.name,
        status: 'success',
        details: `Đã thêm trí nhớ AI: "${memoryText.trim()}"`,
      });
      this.notify();
    }
  }

  // ==========================================
  // PIPELINE & DEALS
  // ==========================================
  public getPipelineStages(): PipelineStage[] {
    return [...this.pipelineStages];
  }

  public getDeals(): Deal[] {
    return [...this.deals];
  }

  public updateDealStage(dealId: string, newStageId: string) {
    const deal = this.deals.find((d) => d.id === dealId);
    const targetStage = this.pipelineStages.find((s) => s.id === newStageId);
    if (deal && targetStage) {
      const oldStageId = deal.stageId;
      deal.stageId = newStageId;
      deal.updatedAt = new Date().toISOString();

      this.addAuditLog({
        action: 'Chuyển giai đoạn cơ hội (Kanban)',
        category: 'deal',
        targetType: 'deal',
        targetId: dealId,
        targetName: deal.title,
        status: 'success',
        details: `Chuyển deal sang giai đoạn "${targetStage.name}" (${targetStage.probability}%). Giá trị: ${deal.value.toLocaleString('vi-VN')} đ`,
      });

      this.notify();
      return deal;
    }
    return undefined;
  }

  public createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal {
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deals.unshift(newDeal);

    this.addAuditLog({
      action: 'Tạo cơ hội mới (Deal)',
      category: 'deal',
      targetType: 'deal',
      targetId: newDeal.id,
      targetName: newDeal.title,
      status: 'success',
      details: `Giá trị: ${newDeal.value.toLocaleString('vi-VN')} đ. Khách hàng: ${newDeal.contactName}`,
    });

    this.notify();
    return newDeal;
  }

  // ==========================================
  // TASKS & REMINDERS
  // ==========================================
  public getTasks(): Task[] {
    return [...this.tasks];
  }

  public toggleTaskStatus(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = task.status === 'completed' ? 'pending' : 'completed';
      this.notify();
      return task;
    }
    return undefined;
  }

  public createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.tasks.unshift(newTask);

    this.addAuditLog({
      action: 'Tạo nhiệm vụ / Hẹn nhắc',
      category: 'conversation',
      targetType: 'task',
      targetId: newTask.id,
      targetName: newTask.title,
      status: 'success',
      details: `Hạn hoàn thành: ${newTask.dueDate}. Gán cho: ${newTask.assigneeName}`,
    });

    this.notify();
    return newTask;
  }

  // ==========================================
  // SUBAGENTS
  // ==========================================
  public getSubagents(): Subagent[] {
    return [...this.subagents];
  }

  public updateSubagent(id: string, partial: Partial<Subagent>) {
    const idx = this.subagents.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.subagents[idx] = { ...this.subagents[idx], ...partial };
      this.addAuditLog({
        action: 'Cập nhật cấu hình Subagent',
        category: 'subagent',
        targetType: 'subagent',
        targetId: id,
        targetName: this.subagents[idx].name,
        status: 'success',
        details: `Cập nhật chính sách, model hoặc prompt của subagent.`,
      });
      this.notify();
      return this.subagents[idx];
    }
    return undefined;
  }

  // ==========================================
  // KNOWLEDGE BASE
  // ==========================================
  public getKnowledge(): KnowledgeDocument[] {
    return [...this.knowledge];
  }

  public searchKnowledge(query: string): KnowledgeDocument[] {
    if (!query.trim()) return this.knowledge;
    const q = query.toLowerCase();
    return this.knowledge.filter(
      (k) => k.title.toLowerCase().includes(q) || k.content.toLowerCase().includes(q)
    );
  }

  // ==========================================
  // CONNECTORS
  // ==========================================
  public getConnectors(): ChannelConnector[] {
    return [...this.connectors];
  }

  public updateConnector(id: string, partial: Partial<ChannelConnector>) {
    const idx = this.connectors.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.connectors[idx] = { ...this.connectors[idx], ...partial };
      this.addAuditLog({
        action: 'Chỉnh sửa cấu hình kênh',
        category: 'connector',
        targetType: 'channel',
        targetId: id,
        targetName: this.connectors[idx].name,
        status: 'success',
        details: `Cập nhật thông số kết nối của "${this.connectors[idx].name}" (${this.connectors[idx].accountName}). URL: ${this.connectors[idx].url || 'N/A'}`,
      });
      this.notify();
      return this.connectors[idx];
    }
    return undefined;
  }

  public addConnector(connector: ChannelConnector) {
    this.connectors.unshift(connector);
    this.addAuditLog({
      action: 'Kết nối nền tảng mới',
      category: 'connector',
      targetType: 'channel',
      targetId: connector.id,
      targetName: connector.name,
      status: 'success',
      details: `Đã kết nối tài khoản "${connector.accountName}" (${connector.type}). URL: ${connector.url || 'N/A'}`,
    });
    this.notify();
    return connector;
  }

  public removeConnector(id: string) {
    const idx = this.connectors.findIndex((c) => c.id === id);
    if (idx !== -1) {
      const removed = this.connectors.splice(idx, 1)[0];
      this.addAuditLog({
        action: 'Hủy kết nối nền tảng',
        category: 'connector',
        targetType: 'channel',
        targetId: id,
        targetName: removed.name,
        status: 'success',
        details: `Đã gỡ kết nối tài khoản "${removed.accountName}" khỏi CRM.`,
      });
      this.notify();
      return removed;
    }
    return undefined;
  }

  public simulateInboundWebhook(connectorId: string, customerName: string, text: string) {
    const conn = this.connectors.find((c) => c.id === connectorId);
    if (!conn) return null;

    // find or create conversation
    let conv = this.conversations.find((c) => c.channel === conn.type);
    if (!conv) {
      conv = this.conversations[0];
    }

    const newMsg = this.sendMessage(conv.id, {
      text,
      senderType: 'customer',
      senderName: customerName,
      status: 'delivered',
    });

    conn.unreadCount += 1;
    conn.lastSyncAt = 'Vừa xong';

    this.addAuditLog({
      action: 'Nhận Webhook từ kênh bên ngoài',
      category: 'connector',
      targetType: 'channel',
      targetId: conn.id,
      targetName: conn.name,
      status: 'success',
      details: `Đã nhận sự kiện inbound từ ${customerName}: "${text.slice(0, 40)}"`,
    });

    this.notify();
    return { conversation: conv, message: newMsg };
  }

  // ==========================================
  // AUDIT LOGS
  // ==========================================
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp' | 'actorId' | 'actorName' | 'actorRole' | 'ipAddress'>) {
    const now = new Date();
    const newLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.toLocaleDateString('vi-VN')}`,
      actorId: this.currentUser.id,
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      ipAddress: '118.69.182.44 (Việt Nam)',
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 50) {
      this.auditLogs = this.auditLogs.slice(0, 50);
    }
  }

  // ==========================================
  // CURRENT USER & STATS
  // ==========================================
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public updateUser(userId: string, partial: Partial<User>) {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...partial };
      this.addAuditLog({
        action: 'Cập nhật quyền thành viên',
        category: 'settings',
        targetType: 'user',
        targetId: userId,
        targetName: this.users[idx].name,
        status: 'success',
        details: `Cập nhật thông tin / vai trò (${this.users[idx].role}) của ${this.users[idx].name}.`,
      });
      this.notify();
      return this.users[idx];
    }
    return undefined;
  }

  public addUser(user: User) {
    this.users.push(user);
    this.addAuditLog({
      action: 'Thêm thành viên mới',
      category: 'settings',
      targetType: 'user',
      targetId: user.id,
      targetName: user.name,
      status: 'success',
      details: `Đã cấp quyền truy cập CRM cho ${user.name} (${user.role} - ${user.email}).`,
    });
    this.notify();
    return user;
  }

  public removeUser(userId: string) {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      const removed = this.users.splice(idx, 1)[0];
      this.addAuditLog({
        action: 'Gỡ bỏ thành viên',
        category: 'settings',
        targetType: 'user',
        targetId: userId,
        targetName: removed.name,
        status: 'warning',
        details: `Đã vô hiệu hóa tài khoản và thu hồi quyền của ${removed.name}.`,
      });
      this.notify();
      return removed;
    }
    return undefined;
  }

  public getTeams(): Team[] {
    return [...this.teams];
  }

  // ==========================================
  // COMMERCIAL TENANT & AUTHENTICATION
  // ==========================================
  public getCurrentTenant(): CommercialTenant {
    return { ...this.currentTenant };
  }

  public updateTenant(partial: Partial<CommercialTenant>) {
    this.currentTenant = { ...this.currentTenant, ...partial };
    this.addAuditLog({
      action: 'Cập nhật gói thuê / Thông tin doanh nghiệp',
      category: 'settings',
      targetType: 'tenant',
      targetId: this.currentTenant.id,
      targetName: this.currentTenant.companyName,
      status: 'success',
      details: `Gói cước: ${this.currentTenant.plan.toUpperCase()} · Hạn dùng: ${this.currentTenant.expiresAt}`,
    });
    this.notify();
    return this.currentTenant;
  }

  public login(input: string | { email: string; password?: string }, maybePassword?: string) {
    const email = typeof input === 'string' ? input : input?.email || '';
    const password = typeof input === 'string' ? maybePassword : input?.password;

    // Check if matching an existing user
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.currentUser = existing;
      existing.isOnline = true;
    } else {
      // Create guest user
      const nameFromEmail = email ? email.split('@')[0] : 'KHACH_HANG';
      this.currentUser = {
        id: `usr-${Date.now()}`,
        name: nameFromEmail.toUpperCase(),
        email: email || 'khach@haitech.vn',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        isOnline: true,
      };
      this.users.unshift(this.currentUser);
    }

    if (this.currentTenant) {
      this.currentTenant.email = email || this.currentTenant.email;
    }

    this.addAuditLog({
      action: 'Đăng nhập hệ thống CRM',
      category: 'auth',
      targetType: 'user',
      targetId: this.currentUser.id,
      targetName: this.currentUser.name,
      status: 'success',
      details: `Đăng nhập thành công từ tài khoản ${email}. Doanh nghiệp: ${this.currentTenant?.companyName || 'HAITECH'}`,
    });

    this.notify();
    return {
      ...this.currentTenant,
      success: true,
      tenant: this.currentTenant,
      user: this.currentUser,
      companyName: this.currentTenant?.companyName || 'HAITECH AI',
    };
  }

  public register(data: {
    name?: string;
    contactName?: string;
    email: string;
    phone: string;
    companyName: string;
    plan: SubscriptionPlan;
  }) {
    const contactName = data.name || data.contactName || 'Khách Hàng Trải Nghiệm';
    const isTrial = data.plan === 'trial';
    const rentalPrice = data.plan === 'starter' ? 990000 : data.plan === 'pro' ? 1790000 : data.plan === 'enterprise' ? 2490000 : 0;
    
    // Create new tenant
    this.currentTenant = {
      id: `tenant-${Date.now()}`,
      name: contactName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      plan: data.plan,
      status: isTrial ? 'trial' : 'active',
      isPaid: !isTrial,
      trialDaysRemaining: isTrial ? 14 : undefined,
      expiresAt: isTrial ? 'Sau 14 ngày dùng thử' : '2026-12-31',
      maxUsers: data.plan === 'enterprise' ? 100 : data.plan === 'pro' ? 25 : 5,
      maxChannels: data.plan === 'enterprise' ? 30 : 10,
      monthlyRentalPrice: rentalPrice,
      googleDriveConnected: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    // Set new current user
    this.currentUser = {
      id: `usr-${Date.now()}`,
      name: contactName,
      email: data.email,
      phone: data.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      isOnline: true,
    };
    this.users.unshift(this.currentUser);

    this.addAuditLog({
      action: isTrial ? 'Đăng ký dùng thử CRM 14 ngày' : 'Đăng ký thuê CRM thương mại',
      category: 'auth',
      targetType: 'tenant',
      targetId: this.currentTenant.id,
      targetName: data.companyName,
      status: 'success',
      details: `Khách hàng: ${contactName} (${data.phone}) · Gói: ${data.plan.toUpperCase()} · Doanh nghiệp: ${data.companyName}`,
    });

    this.notify();
    return this.currentTenant;
  }

  public logout() {
    this.addAuditLog({
      action: 'Đăng xuất khỏi hệ thống',
      category: 'auth',
      targetType: 'user',
      targetId: this.currentUser.id,
      targetName: this.currentUser.name,
      status: 'success',
      details: `Người dùng ${this.currentUser.name} đã đăng xuất.`,
    });
    this.currentUser.isOnline = false;
    this.notify();
  }

  // ==========================================
  // GOOGLE DRIVE DATA SYNC & BACKUP
  // ==========================================
  public getGoogleDriveConfig(): GoogleDriveConfig {
    const sheetUrl = this.googleDriveConfig.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1haitech_sheets_customer_data_2026_sync/edit';
    return {
      ...this.googleDriveConfig,
      spreadsheetUrl: sheetUrl,
      googleSheetUrl: sheetUrl,
      connectedAccount: this.googleDriveConfig.serviceAccountEmail || 'haitech.ai.drive@gmail.com',
      autoSync: this.googleDriveConfig.autoSyncDaily,
    };
  }

  public updateGoogleDriveConfig(partial: Partial<GoogleDriveConfig>) {
    this.googleDriveConfig = { ...this.googleDriveConfig, ...partial };
    this.addAuditLog({
      action: 'Cập nhật cấu hình Google Drive',
      category: 'settings',
      targetType: 'google_drive',
      targetId: this.googleDriveConfig.folderId,
      targetName: this.googleDriveConfig.folderName,
      status: 'success',
      details: `Folder ID: ${this.googleDriveConfig.folderId} · Tự động đồng bộ: ${this.googleDriveConfig.autoSyncDaily ? 'Bật' : 'Tắt'}`,
    });
    this.notify();
    return this.getGoogleDriveConfig();
  }

  public getGoogleDriveBackupLogs(): GoogleDriveBackupLog[] {
    return [...this.googleDriveBackupLogs];
  }

  public syncCustomerDataToDrive(): {
    success: boolean;
    log: GoogleDriveBackupLog;
    message: string;
    driveUrl: string;
    recordCount: number;
  } {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.toLocaleDateString('vi-VN')}`;
    const recordCount = this.contacts.length;
    const fileUrl = this.googleDriveConfig.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1haitech_sheets_customer_data_2026_sync/edit';
    const driveFolderUrl = `https://drive.google.com/drive/folders/${this.googleDriveConfig.folderId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74HAITECH'}`;

    const newLog: GoogleDriveBackupLog = {
      id: `gdrive-log-${Date.now()}`,
      timestamp: timeStr,
      recordCount: recordCount,
      fileFormat: 'google_sheets',
      fileName: `HAITECH_CRM_Customer_Master_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.xlsx`,
      fileUrl: fileUrl,
      driveUrl: driveFolderUrl,
      fileSize: `${Math.round(250 + recordCount * 1.8)} KB`,
      sizeKb: Math.round(250 + recordCount * 1.8),
      status: 'success',
      actorName: `${this.currentUser.name} (Admin)`,
    };

    this.googleDriveBackupLogs.unshift(newLog);
    if (this.googleDriveBackupLogs.length > 30) {
      this.googleDriveBackupLogs = this.googleDriveBackupLogs.slice(0, 30);
    }

    this.googleDriveConfig.lastSyncAt = `Vừa xong lúc ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} (${recordCount} bản ghi)`;
    this.googleDriveConfig.totalRecordsSynced = recordCount;

    this.addAuditLog({
      action: 'Đồng bộ data khách hàng về Google Drive',
      category: 'settings',
      targetType: 'google_drive',
      targetId: newLog.id,
      targetName: newLog.fileName,
      status: 'success',
      details: `Đã đưa ${recordCount} hồ sơ khách hàng 360° lên Google Drive & Google Sheets thành công.`,
    });

    this.notify();
    return {
      success: true,
      log: newLog,
      message: `Đã đưa thành công ${recordCount} hồ sơ khách hàng về Google Drive (Thư mục: ${this.googleDriveConfig.folderName})!`,
      driveUrl: driveFolderUrl,
      recordCount: recordCount,
    };
  }

  public exportContactsCsv(): string {
    const headers = ['Mã khách', 'Họ tên', 'Số điện thoại', 'Email', 'Công ty', 'Giai đoạn Pipeline', 'Nguồn Lead', 'Người phụ trách', 'Thẻ phân loại', 'Số Deals', 'Tổng giá trị (VND)', 'Ngày tạo'];
    const rows = this.contacts.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.phone,
      c.email,
      `"${(c.company || '').replace(/"/g, '""')}"`,
      `"${c.pipelineStage}"`,
      c.leadSource,
      `"${c.ownerName || ''}"`,
      `"${c.tags.join(', ')}"`,
      c.dealsCount || 0,
      c.totalDealValue || 0,
      c.createdAt,
    ]);

    // UTF-8 BOM for Excel compatibility
    return '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public getStats(): CrmStats {
    return {
      ...this.stats,
      totalConversations: this.conversations.length,
      unreadConversations: this.conversations.filter((c) => c.unreadCount > 0).length,
      pipelineDealsCount: this.deals.length,
      pipelineTotalValue: this.deals.reduce((sum, d) => sum + d.value, 0),
      tasksTodayCount: this.tasks.filter((t) => t.status === 'pending').length,
    };
  }
}

// Global Singleton Instance
export const crmStore = new HaitechCrmStore();
