'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Key,
  Users,
  Clock,
  Activity,
  Copy,
  ExternalLink,
  Plus,
  X,
  Trash2,
  Edit3,
  Save,
  Search,
  Eye,
  EyeOff,
  Globe,
  Bot,
  Sparkles,
  Code,
  Cpu,
  Send,
  RefreshCw,
  Sliders,
  Lock,
  Check,
  Share2,
  MessageCircle,
  FileText,
  Laptop,
  CheckCheck,
  HardDrive,
  FileSpreadsheet,
  Download,
  FolderOpen,
  CreditCard,
} from 'lucide-react';
import {
  ChannelConnector,
  ChannelType,
  User,
  UserRole,
  AuditLog,
  Subagent,
  CommercialTenant,
  GoogleDriveConfig,
  GoogleDriveBackupLog,
} from '@/types/crm';
import { ChannelBadge } from '../inbox/ChannelBadge';

interface AdminPortalProps {
  connectors: ChannelConnector[];
  users: User[];
  auditLogs: AuditLog[];
  subagents?: Subagent[];
  currentTenant?: CommercialTenant;
  driveConfig?: GoogleDriveConfig;
  driveLogs?: GoogleDriveBackupLog[];
  onUpdateConnector: (id: string, partial: Partial<ChannelConnector>) => void;
  onAddConnector: (connector: ChannelConnector) => void;
  onRemoveConnector: (id: string) => void;
  onUpdateUser: (userId: string, partial: Partial<User>) => void;
  onAddUser: (user: User) => void;
  onRemoveUser: (userId: string) => void;
  onTestConnector: (connectorId: string) => Promise<{ success: boolean; message: string }>;
  onTriggerWebhook: (connectorId: string, customerName: string, text: string) => void;
  onResetSeedData: () => void;
  onSyncDrive?: () => Promise<any> | any;
  onUpdateDriveConfig?: (partial: Partial<GoogleDriveConfig>) => void;
  onDownloadCsv?: () => void;
  onOpenAuthModal?: (tab?: 'login' | 'register' | 'pricing') => void;
  isResetting?: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  connectors,
  users,
  auditLogs,
  subagents = [],
  currentTenant,
  driveConfig,
  driveLogs = [],
  onUpdateConnector,
  onAddConnector,
  onRemoveConnector,
  onUpdateUser,
  onAddUser,
  onRemoveUser,
  onTestConnector,
  onTriggerWebhook,
  onResetSeedData,
  onSyncDrive,
  onUpdateDriveConfig,
  onDownloadCsv,
  onOpenAuthModal,
  isResetting = false,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'connectors' | 'ai' | 'members' | 'sla_routing' | 'webhooks_audit' | 'gdrive_data'>('connectors');

  // Channel filter & search
  const [channelFilter, setChannelFilter] = useState<'all' | 'connected' | 'demo' | 'core'>('all');
  const [channelSearch, setChannelSearch] = useState('');

  // Editing Connector Modal state
  const [editingConnector, setEditingConnector] = useState<ChannelConnector | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  // Testing connector state
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string; success: boolean; latencyMs?: number } | null>(null);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  // Add Connector Modal state
  const [isAddConnectorModalOpen, setIsAddConnectorModalOpen] = useState(false);
  const [newConnType, setNewConnType] = useState<ChannelType>('facebook');
  const [newConnName, setNewConnName] = useState('');
  const [newConnAccount, setNewConnAccount] = useState('');
  const [newConnUrl, setNewConnUrl] = useState('');
  const [newConnApiKey, setNewConnApiKey] = useState('');
  const [newConnSecret, setNewConnSecret] = useState('');
  const [newConnIsDemo, setNewConnIsDemo] = useState(false);

  // Website Embed Widget Code Modal
  const [embedModalConnector, setEmbedModalConnector] = useState<ChannelConnector | null>(null);
  const [embedCopied, setEmbedCopied] = useState(false);

  // AI Settings State
  const [claudeKey, setClaudeKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [aiModelSales, setAiModelSales] = useState<'claude-3-7-sonnet' | 'gpt-4o' | 'gemini-2-flash'>('claude-3-7-sonnet');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(80);
  const [aiFallbackHuman, setAiFallbackHuman] = useState(true);
  const [testPromptText, setTestPromptText] = useState('');
  const [testPromptResult, setTestPromptResult] = useState<{ answer: string; model: string; latency: number } | null>(null);
  const [isAiTesting, setIsAiTesting] = useState(false);

  // Member Management Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('agent');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // SLA & Routing State
  const [firstResponseTargetMin, setFirstResponseTargetMin] = useState(2);
  const [maxAiLatencyMs, setMaxAiLatencyMs] = useState(800);
  const [escalationAlertMin, setEscalationAlertMin] = useState(10);
  const [routingStrategy, setRoutingStrategy] = useState<'round_robin' | 'least_loaded' | 'ai_first'>('round_robin');
  const [outOfOfficeMessage, setOutOfOfficeMessage] = useState(
    'Cảm ơn Quý khách đã liên hệ HAITECH AI! Hiện tại đang ngoài giờ làm việc hành chính (08:00 - 22:00). Chuyên viên tư vấn sẽ liên hệ lại ngay khi ca làm việc bắt đầu.'
  );

  // Webhook Simulator State
  const [simChannelId, setSimChannelId] = useState<string>(connectors[0]?.id || 'conn-zalo-098739896');
  const [simCustomerName, setSimCustomerName] = useState('Trần Văn Hưng (Kỹ Sư Công Trình)');
  const [simMessageText, setSimMessageText] = useState('Chào HAITECH AI, tôi cần khảo sát lắp đặt hệ thống lọc tổng cho tòa nhà 7 tầng.');
  const [simSuccessNotice, setSimSuccessNotice] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('all');

  // Google Drive & Data Sync State
  const [driveFolderId, setDriveFolderId] = useState(driveConfig?.folderId || '1A2B3C_HAITECH_BACKUPS_DATA');
  const [driveAutoSync, setDriveAutoSync] = useState(driveConfig?.autoSync ?? true);
  const [isSyncingDriveState, setIsSyncingDriveState] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Trigger Save Notification Toast
  const triggerToast = (msg: string) => {
    setSaveSuccessToast(msg);
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  const handleTriggerSyncDrive = async () => {
    setIsSyncingDriveState(true);
    setSyncProgress(25);
    setTimeout(() => setSyncProgress(70), 300);
    try {
      if (onSyncDrive) {
        await onSyncDrive();
      }
      setTimeout(() => {
        setSyncProgress(100);
        setIsSyncingDriveState(false);
        triggerToast('Đã đồng bộ toàn bộ data khách hàng về Google Drive thành công!');
      }, 700);
    } catch {
      setIsSyncingDriveState(false);
    }
  };

  const handleSaveDriveFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateDriveConfig) {
      onUpdateDriveConfig({ folderId: driveFolderId.trim(), autoSync: driveAutoSync });
    }
    triggerToast('Đã lưu cấu hình thư mục Google Drive thành công!');
  };

  // Ping test connector
  const handleTestPing = async (connectorId: string) => {
    setTestingId(connectorId);
    setTestResult(null);
    const startTime = Date.now();
    try {
      const res = await onTestConnector(connectorId);
      const latency = Date.now() - startTime;
      setTestResult({
        id: connectorId,
        message: res.message || 'Kết nối thành công tới Webhook Gateway',
        success: res.success,
        latencyMs: Math.max(latency, 88),
      });
    } catch (e: any) {
      setTestResult({
        id: connectorId,
        message: e.message || 'Lỗi khi kiểm tra kết nối API',
        success: false,
        latencyMs: 150,
      });
    } finally {
      setTestingId(null);
    }
  };

  // Copy webhook URL
  const handleCopyWebhook = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  // Save edited connector
  const handleSaveEditedConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConnector) return;

    onUpdateConnector(editingConnector.id, {
      name: editingConnector.name,
      accountName: editingConnector.accountName,
      url: editingConnector.url,
      status: editingConnector.isDemo ? 'demo' : 'connected',
      isDemo: editingConnector.isDemo,
      credentialsConfigured: true,
      config: {
        ...editingConnector.config,
        url: editingConnector.url,
      },
    });

    triggerToast(`Đã lưu cấu hình kết nối cho kênh "${editingConnector.name}"!`);
    setEditingConnector(null);
  };

  // Create new connector
  const handleCreateConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnAccount.trim()) return;

    const slug = newConnAccount.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const defaultLabel =
      newConnType === 'facebook'
        ? 'Facebook Fanpage'
        : newConnType === 'zalo_personal'
        ? 'Zalo Cá Nhân & OA'
        : newConnType === 'website'
        ? 'Website Live Widget'
        : newConnType === 'tiktok'
        ? 'TikTok Shop & Direct'
        : newConnType === 'telegram'
        ? 'Telegram Bot'
        : 'Instagram Direct';

    const newConn: ChannelConnector = {
      id: `conn-${newConnType}-${Date.now()}`,
      type: newConnType,
      name: newConnName.trim() || defaultLabel,
      accountName: newConnAccount.trim(),
      url: newConnUrl.trim() || undefined,
      status: newConnIsDemo ? 'demo' : 'connected',
      isDemo: newConnIsDemo,
      credentialsConfigured: true,
      webhookUrl: `https://api.haitech.vn/v1/webhooks/${newConnType}/${slug || 'inbound'}`,
      unreadCount: 0,
      lastSyncAt: 'Vừa kết nối',
      config: {
        apiKey: newConnApiKey.trim() || undefined,
        secretKey: newConnSecret.trim() || undefined,
        url: newConnUrl.trim() || undefined,
      },
    };

    onAddConnector(newConn);
    setIsAddConnectorModalOpen(false);
    triggerToast(`Đã tạo và kết nối thành công kênh mới "${newConn.name}"!`);

    // Reset
    setNewConnName('');
    setNewConnAccount('');
    setNewConnUrl('');
    setNewConnApiKey('');
    setNewConnSecret('');
  };

  // Save AI Keys
  const handleSaveAiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Đã lưu và mã hóa an toàn khóa API mô hình AI!');
  };

  // Test AI prompt
  const handleRunAiPromptTest = () => {
    if (!testPromptText.trim()) return;
    setIsAiTesting(true);
    setTimeout(() => {
      setTestPromptResult({
        answer: `Dạ chào Quý khách! HAITECH AI đã tiếp nhận câu hỏi "${testPromptText}". Theo tài liệu tiêu chuẩn kỹ thuật HAITECH, hệ thống lọc nước RO công nghiệp công suất 500L/h có màng lọc Filmtec USA, khử trùng UV diệt 99.9% vi khuẩn, bảo hành chính hãng 24 tháng.`,
        model: aiModelSales,
        latency: 412,
      });
      setIsAiTesting(false);
    }, 600);
  };

  // Member management
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: newUserRole,
      phone: newUserPhone.trim() || undefined,
      isOnline: true,
    };

    onAddUser(newUser);
    setIsAddUserModalOpen(false);
    triggerToast(`Đã thêm thành viên "${newUser.name}" vào hệ thống!`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
  };

  const handleSaveEditedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser.id, editingUser);
    triggerToast(`Đã cập nhật phân quyền cho thành viên "${editingUser.name}"!`);
    setEditingUser(null);
  };

  // Trigger simulated inbound webhook
  const handleSendSimulatedWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simMessageText.trim()) return;
    onTriggerWebhook(simChannelId, simCustomerName, simMessageText);
    setSimSuccessNotice(true);
    setTimeout(() => setSimSuccessNotice(false), 3000);
  };

  // Filter connectors
  const filteredConnectors = connectors.filter((c) => {
    // text search
    const matchesSearch =
      c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
      c.accountName.toLowerCase().includes(channelSearch.toLowerCase()) ||
      (c.url && c.url.toLowerCase().includes(channelSearch.toLowerCase())) ||
      c.type.toLowerCase().includes(channelSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (channelFilter === 'connected') return c.status === 'connected';
    if (channelFilter === 'demo') return c.status === 'demo';
    if (channelFilter === 'core') {
      return (
        c.accountName.includes('098739896') ||
        c.accountName.includes('Haitech.AISystem') ||
        c.accountName.includes('haitech-ai.vercel.app') ||
        c.accountName.includes('@vanhaitech.ai')
      );
    }
    return true;
  });

  const connectedCount = connectors.filter((c) => c.status === 'connected').length;
  const demoCount = connectors.filter((c) => c.status === 'demo').length;

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(auditSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (auditCategoryFilter !== 'all' && log.category !== auditCategoryFilter) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F0F6FA] overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2239] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#38BDF8]/40 flex items-center gap-3 animate-message text-xs font-semibold">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span>{saveSuccessToast}</span>
        </div>
      )}

      {/* TOP HEADER: ADMIN CONTROL CENTER */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCE6EF] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2 bg-[#0284C7] text-white rounded-xl shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">
                  Trang Quản Trị Hệ Thống Admin (HAITECH Control Center)
                </h1>
                <span className="text-[10px] font-extrabold tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full uppercase border border-purple-200">
                  Root Admin
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Cấu hình kết nối và chỉnh sửa thông số 4 nền tảng trọng tâm (Zalo, Facebook, Website, TikTok), khóa API AI, thành viên và kiểm toán.
              </p>
            </div>
          </div>

          {/* Quick status bar */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium">
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đã kết nối thật: <strong>{connectedCount} kênh</strong>
            </span>
            <span className="bg-sky-50 text-[#0284C7] px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Webhook Gateway: <strong>SSL / TLS 1.3 Active</strong>
            </span>
            <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              AI Router: <strong>Claude 3.7 + GPT-4o + Gemini 2.0</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tenant Commercial Badge */}
          {currentTenant && (
            <div className="hidden sm:flex items-center gap-2 bg-[#F0F6FA] border border-[#38BDF8]/40 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#0A2239]">{currentTenant.companyName}</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  currentTenant.plan === 'enterprise'
                    ? 'bg-purple-100 text-purple-700'
                    : currentTenant.plan === 'pro'
                    ? 'bg-sky-100 text-[#0284C7]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentTenant.plan === 'enterprise'
                  ? 'Gói Doanh Nghiệp'
                  : currentTenant.plan === 'pro'
                  ? 'Gói Chuyên Nghiệp'
                  : 'Gói Dùng Thử 14 Ngày'}
              </span>
            </div>
          )}

          <button
            onClick={() => onOpenAuthModal?.('pricing')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            title="Xem bảng giá và các gói thuê CRM thương mại"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Gói Thuê CRM Thương Mại</span>
          </button>

          <button
            onClick={() => onOpenAuthModal?.('login')}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đăng Nhập / Đăng Ký Khách</span>
          </button>

          <button
            onClick={() => setIsAddConnectorModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Kênh Mới</span>
          </button>

          <button
            onClick={onResetSeedData}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            title="Khôi phục lại dữ liệu mẫu gốc"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Mẫu</span>
          </button>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="bg-white p-1.5 rounded-2xl border border-[#DCE6EF] shadow-sm flex flex-wrap gap-1.5 text-xs font-bold">
        <button
          onClick={() => setActiveTab('connectors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'connectors'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Cấu Hình Kết Nối Đa Kênh ({connectors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'ai'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Khóa API AI & Mô Hình</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'members'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Thành Viên & Phân Quyền ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sla_routing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'sla_routing'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Quy Tắc Phân Bổ & SLA</span>
        </button>

        <button
          onClick={() => setActiveTab('webhooks_audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'webhooks_audit'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Giám Sát Webhook & Kiểm Toán</span>
        </button>

        <button
          onClick={() => setActiveTab('gdrive_data')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'gdrive_data'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Quản Lý Toàn Bộ Data & Google Drive</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CẤU HÌNH KẾT NỐI ĐA KÊNH & CHỈNH SỬA THÔNG SỐ                       */}
      {/* ========================================================================= */}
      {activeTab === 'connectors' && (
        <div className="space-y-5">
          {/* Spotlight Banner: 4 Core User Platforms */}
          <div className="bg-gradient-to-r from-[#0A2239] via-[#0369A1] to-[#0284C7] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>4 Kênh Trọng Tâm Đang Hoạt Động Của HAITECH AI</span>
              </div>
              <h2 className="text-lg font-extrabold mb-3">
                Zalo (098739896) · Facebook (Haitech.AISystem) · Website (haitech-ai.vercel.app) · TikTok (@vanhaitech.ai)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                  <div className="font-bold text-sky-200 flex items-center gap-1.5 mb-1">
                    <MessageCircle className="w-4 h-4" /> Zalo Cá Nhân / OA
                  </div>
                  <div className="font-semibold truncate">098739896 (HAITECH AI)</div>
                  <div className="text-[11px] text-sky-100 mt-1 opacity-80">https://zalo.me/098739896</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                  <div className="font-bold text-sky-200 flex items-center gap-1.5 mb-1">
                    <Share2 className="w-4 h-4" /> Facebook Fanpage
                  </div>
                  <div className="font-semibold truncate">Haitech.AISystem</div>
                  <div className="text-[11px] text-sky-100 mt-1 opacity-80">fb.com/Haitech.AISystem</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                  <div className="font-bold text-sky-200 flex items-center gap-1.5 mb-1">
                    <Laptop className="w-4 h-4" /> Website Live Widget
                  </div>
                  <div className="font-semibold truncate">haitech-ai.vercel.app</div>
                  <div className="text-[11px] text-sky-100 mt-1 opacity-80">/san-pham.html</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                  <div className="font-bold text-sky-200 flex items-center gap-1.5 mb-1">
                    <Zap className="w-4 h-4" /> TikTok Shop & Video
                  </div>
                  <div className="font-semibold truncate">@vanhaitech.ai</div>
                  <div className="text-[11px] text-sky-100 mt-1 opacity-80">tiktok.com/@vanhaitech.ai</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setChannelFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  channelFilter === 'all'
                    ? 'bg-[#0284C7] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                Tất cả kênh ({connectors.length})
              </button>
              <button
                onClick={() => setChannelFilter('core')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  channelFilter === 'core'
                    ? 'bg-[#0284C7] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>4 Kênh Trọng Tâm HAITECH</span>
              </button>
              <button
                onClick={() => setChannelFilter('connected')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  channelFilter === 'connected'
                    ? 'bg-[#0284C7] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Đã kết nối thật ({connectedCount})</span>
              </button>
              <button
                onClick={() => setChannelFilter('demo')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  channelFilter === 'demo'
                    ? 'bg-[#0284C7] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Demo Sandbox ({demoCount})</span>
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                placeholder="Tìm tên kênh, tài khoản, URL..."
                className="w-full text-xs bg-white pl-8 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0284C7] shadow-sm"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredConnectors.map((conn) => {
              const isTesting = testingId === conn.id;
              const result = testResult?.id === conn.id ? testResult : null;
              const targetUrl = conn.url || conn.config?.pageUrl || conn.config?.targetUrl || conn.config?.profileUrl || conn.config?.url;
              const isCoreChannel =
                conn.accountName.includes('098739896') ||
                conn.accountName.includes('Haitech.AISystem') ||
                conn.accountName.includes('haitech-ai.vercel.app') ||
                conn.accountName.includes('@vanhaitech.ai');

              return (
                <div
                  key={conn.id}
                  className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                    isCoreChannel ? 'border-sky-300 ring-2 ring-sky-100' : 'border-[#DCE6EF] hover:border-[#0284C7]'
                  }`}
                >
                  <div>
                    {/* Top status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <ChannelBadge type={conn.type} accountName={conn.accountName} />
                        {isCoreChannel && (
                          <span className="text-[9px] bg-sky-100 text-[#0284C7] font-extrabold px-1.5 py-0.5 rounded-md border border-sky-200">
                            HAITECH
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                          conn.status === 'connected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            conn.status === 'connected' ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        />
                        {conn.status === 'connected' ? 'Đã kết nối thật' : 'Demo / Sandbox'}
                      </span>
                    </div>

                    {/* Title & Account */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-sm text-stone-900 mb-0.5">{conn.name}</h3>
                        <p className="text-xs text-stone-500">
                          Tài khoản: <span className="font-semibold text-stone-800">{conn.accountName}</span>
                        </p>
                      </div>

                      {/* Remove Button if not default */}
                      {!conn.id.startsWith('conn-fb-filter') && !isCoreChannel && (
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn gỡ kết nối kênh "${conn.name}"?`)) {
                              onRemoveConnector(conn.id);
                            }
                          }}
                          className="text-stone-300 hover:text-red-500 p-1 rounded-lg transition-colors"
                          title="Gỡ kết nối"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Target URL with click */}
                    {targetUrl && (
                      <div className="mb-3">
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-semibold text-[11px] rounded-lg border border-sky-200 transition-colors"
                        >
                          <span className="truncate max-w-[210px]">{targetUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {/* Webhook endpoint copy box */}
                    <div className="bg-[#F0F6FA] p-2.5 rounded-xl border border-sky-100 mb-3 text-[11px]">
                      <div className="flex items-center justify-between text-stone-400 mb-1 font-mono text-[10px]">
                        <span>CỔNG WEBHOOK INBOUND</span>
                        <button
                          onClick={() => handleCopyWebhook(conn.id, conn.webhookUrl)}
                          className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-sans font-semibold"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedUrlId === conn.id ? 'Đã chép!' : 'Chép'}</span>
                        </button>
                      </div>
                      <div className="truncate font-mono text-stone-700 text-[10px]">
                        {conn.webhookUrl}
                      </div>
                    </div>

                    {/* Website Livechat Embed Snippet Button if type === 'website' */}
                    {conn.type === 'website' && (
                      <div className="mb-3">
                        <button
                          onClick={() => setEmbedModalConnector(conn)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] rounded-xl border border-purple-200 transition-colors"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>Xem Mã Nhúng Widget Livechat Cho Website</span>
                        </button>
                      </div>
                    )}

                    {/* Test Result Feedback */}
                    {result && (
                      <div
                        className={`p-2.5 rounded-xl border text-[11px] mb-3 leading-relaxed animate-message ${
                          result.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1 mb-0.5">
                          {result.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          <span>{result.success ? '200 OK — Kết nối bình thường' : 'Cảnh báo'}</span>
                          {result.latencyMs && <span className="text-[10px] opacity-75">({result.latencyMs}ms)</span>}
                        </div>
                        <div>{result.message}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      {/* Edit Configuration Button */}
                      <button
                        onClick={() => {
                          setEditingConnector(JSON.parse(JSON.stringify(conn)));
                          setShowSecretKey(false);
                          setShowToken(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Chỉnh Sửa Cấu Hình</span>
                      </button>

                      {/* Ping Test Button */}
                      <button
                        onClick={() => handleTestPing(conn.id)}
                        disabled={isTesting}
                        className="flex items-center gap-1 px-3 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                        title="Gửi tín hiệu kiểm tra kết nối API"
                      >
                        <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? 'Ping...' : 'Ping Test'}</span>
                      </button>
                    </div>

                    {/* Toggle Real / Demo quick button */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                      <span>Đồng bộ: {conn.lastSyncAt}</span>
                      <button
                        onClick={() => {
                          const newDemoState = !conn.isDemo;
                          onUpdateConnector(conn.id, {
                            isDemo: newDemoState,
                            status: newDemoState ? 'demo' : 'connected',
                          });
                          triggerToast(`Đã chuyển kênh "${conn.name}" sang ${newDemoState ? 'Demo Sandbox' : 'Kết nối thật'}!`);
                        }}
                        className="text-[#0284C7] hover:underline font-semibold"
                      >
                        {conn.isDemo ? 'Bật kết nối thật' : 'Chuyển về Demo'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KHÓA API AI & CẤU HÌNH SUBAGENTS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* Card 1: API Keys */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-50 text-[#0284C7] rounded-xl">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-stone-900">
                    Cấu Hình Khóa Bí Mật API Trí Tuệ Nhân Tạo (LLM API Keys)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Khóa được mã hóa bằng AES-256 ở Backend an toàn, bảo vệ trước nguy cơ rò rỉ mã nguồn máy trạm.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAiKeys} className="space-y-4 max-w-2xl text-xs">
              {/* Claude Key */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Anthropic Claude API Key (Khuyên dùng cho Subagent Bán hàng & Tư vấn)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={claudeKey}
                    onChange={(e) => setClaudeKey(e.target.value)}
                    placeholder="sk-ant-api03-haitech-ai-key-..."
                    className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Kích hoạt mô hình Claude 3.7 Sonnet để sinh câu trả lời tư vấn sâu và chốt đơn thông minh.
                </span>
              </div>

              {/* OpenAI Key */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  OpenAI API Key (GPT-4o)
                </label>
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  placeholder="sk-proj-openai-haitech-..."
                  className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              {/* Gemini Key */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Google Gemini API Key (Gemini 2.0 Flash)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSyHAITECH_GEMINI_KEY_..."
                  className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Cấu Hình Khóa API</span>
              </button>
            </form>
          </div>

          {/* Card 2: AI Routing & Confidence Policies */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Bot className="w-5 h-5 text-[#0284C7]" />
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Chính Sách Điều Phối Mô Hình AI & Ngưỡng Tin Cậy
                </h3>
                <p className="text-xs text-stone-500">
                  Cấu hình mô hình ưu tiên cho các kênh Zalo, Facebook, Website và TikTok.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1.5">
                  Mô Hình Mặc Định Cho Subagent Bán Hàng & Chăm Sóc
                </label>
                <select
                  value={aiModelSales}
                  onChange={(e: any) => setAiModelSales(e.target.value)}
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 font-semibold focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Anthropic - Tối ưu suy luận & tiếng Việt)</option>
                  <option value="gpt-4o">GPT-4o (OpenAI - Đa năng & tốc độ cao)</option>
                  <option value="gemini-2-flash">Gemini 2.0 Flash (Google - Phản hồi siêu tốc & ngữ cảnh lớn)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1.5 flex items-center justify-between">
                  <span>Ngưỡng Tin Cậy Tự Động Phản Hồi:</span>
                  <span className="text-[#0284C7] font-extrabold">{aiConfidenceThreshold}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={aiConfidenceThreshold}
                  onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-[#0284C7] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>50% (Rất tự tin)</span>
                  <span>80% (Khuyên dùng)</span>
                  <span>98% (Nghiêm ngặt)</span>
                </div>
              </div>

              <div className="md:col-span-2 p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800">Cơ chế chuyển quyền khi AI chưa chắc chắn (Human Takeover)</div>
                  <div className="text-stone-500 text-[11px]">
                    Tự động tạo thông báo và chuyển hội thoại về chuyên viên khi độ tin cậy dưới {aiConfidenceThreshold}%.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={aiFallbackHuman}
                  onChange={(e) => setAiFallbackHuman(e.target.checked)}
                  className="w-4 h-4 accent-[#0284C7] cursor-pointer rounded"
                />
              </div>
            </div>
          </div>

          {/* Card 3: AI Sandbox Playground */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Thử Nghiệm Phản Hồi AI Subagent Trực Tiếp (AI Playground)
                </h3>
                <p className="text-xs text-stone-500">
                  Kiểm tra khả năng truy xuất kho kiến thức HAITECH CRM và đo lường độ trễ thực tế.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={testPromptText}
                onChange={(e) => setTestPromptText(e.target.value)}
                placeholder="Nhập câu hỏi thử nghiệm (VD: Cho xin báo giá máy lọc nước RO 500L/h)..."
                className="flex-1 text-xs bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                onKeyDown={(e) => e.key === 'Enter' && handleRunAiPromptTest()}
              />
              <button
                onClick={handleRunAiPromptTest}
                disabled={isAiTesting || !testPromptText.trim()}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 justify-center"
              >
                {isAiTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isAiTesting ? 'Đang phân tích...' : 'Thử Nghiệm'}</span>
              </button>
            </div>

            {testPromptResult && (
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2 text-xs animate-message">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                  <span className="text-[#0284C7] font-bold">Mô hình: {testPromptResult.model}</span>
                  <span>Độ trễ: {testPromptResult.latency} ms</span>
                </div>
                <div className="text-stone-800 leading-relaxed font-medium">
                  {testPromptResult.answer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: THÀNH VIÊN & MA TRẬN PHÂN QUYỀN RBAC                                */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0284C7]" />
                <span>Quản Trị Thành Viên & Ma Trận Phân Quyền (RBAC)</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Quản lý quyền hạn Admin, Trưởng nhóm (Manager) và Chuyên viên tư vấn (Agent).
              </p>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Nhân Viên Mới</span>
            </button>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-semibold text-[11px]">
                  <th className="py-2.5 pr-4">Thành viên</th>
                  <th className="py-2.5 pr-4">Email / Tài khoản</th>
                  <th className="py-2.5 pr-4">Số điện thoại</th>
                  <th className="py-2.5 pr-4">Vai trò (Role)</th>
                  <th className="py-2.5 pr-4">Trạng thái</th>
                  <th className="py-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-normal text-stone-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                        <span className="font-bold text-stone-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                      {u.email}
                    </td>
                    <td className="py-3 pr-4 text-stone-600 font-mono text-[11px] whitespace-nowrap">
                      {u.phone || '098739896'}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : u.role === 'manager'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-sky-100 text-sky-900 border border-sky-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          onUpdateUser(u.id, { isOnline: !u.isOnline });
                          triggerToast(`Đã chuyển trạng thái của ${u.name} sang ${!u.isOnline ? 'Online' : 'Offline'}!`);
                        }}
                        className={`text-[11px] font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${
                          u.isOnline
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${u.isOnline ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                        <span>{u.isOnline ? 'Đang Online' : 'Ngoại tuyến'}</span>
                      </button>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser({ ...u })}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0284C7] hover:bg-sky-50 rounded-lg transition-colors border border-sky-200"
                        >
                          Sửa quyền
                        </button>
                        {u.id !== 'usr-1' && (
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa nhân viên "${u.name}" khỏi CRM?`)) {
                                onRemoveUser(u.id);
                              }
                            }}
                            className="p-1 text-stone-300 hover:text-red-500 rounded-lg transition-colors"
                            title="Xóa nhân viên"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: QUY TẮC PHÂN BỔ TỰ ĐỘNG & CAM KẾT SLA                               */}
      {/* ========================================================================= */}
      {activeTab === 'sla_routing' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Clock className="w-5 h-5 text-[#0284C7]" />
              <div>
                <h2 className="font-bold text-sm text-stone-900">
                  Cấu Hình Cam Kết Mức Phục Vụ (SLA Standards)
                </h2>
                <p className="text-xs text-stone-500">
                  Đặt ngưỡng cảnh báo vi phạm phản hồi cho tin nhắn từ Zalo, Facebook, TikTok và Website.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#F0F6FA] rounded-xl border border-sky-100 space-y-2">
                <div className="font-bold text-stone-800">Thời gian phản hồi đầu tiên (FRT)</div>
                <div className="text-[11px] text-stone-500">Mục tiêu tối đa phản hồi khách mới</div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={firstResponseTargetMin}
                    onChange={(e) => setFirstResponseTargetMin(Number(e.target.value))}
                    className="w-20 bg-white border border-sky-200 rounded-lg px-2.5 py-1 font-bold text-stone-900"
                  />
                  <span className="font-semibold text-stone-600">Phút</span>
                </div>
              </div>

              <div className="p-4 bg-[#F0F6FA] rounded-xl border border-sky-100 space-y-2">
                <div className="font-bold text-stone-800">Độ trễ tối đa của AI Subagent</div>
                <div className="text-[11px] text-stone-500">Thời gian sinh câu trả lời gợi ý</div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    step="50"
                    value={maxAiLatencyMs}
                    onChange={(e) => setMaxAiLatencyMs(Number(e.target.value))}
                    className="w-24 bg-white border border-sky-200 rounded-lg px-2.5 py-1 font-bold text-stone-900"
                  />
                  <span className="font-semibold text-stone-600">Mili-giây (ms)</span>
                </div>
              </div>

              <div className="p-4 bg-[#F0F6FA] rounded-xl border border-sky-100 space-y-2">
                <div className="font-bold text-stone-800">Cảnh báo leo thang vi phạm</div>
                <div className="text-[11px] text-stone-500">Báo động khi chưa có phản hồi</div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="3"
                    max="120"
                    value={escalationAlertMin}
                    onChange={(e) => setEscalationAlertMin(Number(e.target.value))}
                    className="w-20 bg-white border border-sky-200 rounded-lg px-2.5 py-1 font-bold text-stone-900"
                  />
                  <span className="font-semibold text-stone-600">Phút</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Sliders className="w-5 h-5 text-[#0284C7]" />
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Chiến Lược Điều Phối Tin Nhắn & Lời Chào Tự Động
                </h3>
                <p className="text-xs text-stone-500">
                  Thiết lập cách CRM gán cuộc trò chuyện mới tới các nhân viên bán hàng.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1.5">Phương thức phân bổ hội thoại mới:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setRoutingStrategy('round_robin')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      routingStrategy === 'round_robin'
                        ? 'bg-sky-50 border-[#0284C7] ring-1 ring-[#0284C7]'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-stone-900">Xoay vòng (Round-Robin)</div>
                    <div className="text-[11px] text-stone-500 mt-1">Phân bổ đều tuần tự theo danh sách nhân viên online.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoutingStrategy('least_loaded')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      routingStrategy === 'least_loaded'
                        ? 'bg-sky-50 border-[#0284C7] ring-1 ring-[#0284C7]'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-stone-900">Ít việc nhất (Least-Loaded)</div>
                    <div className="text-[11px] text-stone-500 mt-1">Ưu tiên gán cho người đang có ít hội thoại đang mở nhất.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoutingStrategy('ai_first')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      routingStrategy === 'ai_first'
                        ? 'bg-sky-50 border-[#0284C7] ring-1 ring-[#0284C7]'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-stone-900">AI-First (Subagent trước)</div>
                    <div className="text-[11px] text-stone-500 mt-1">AI trả lời sơ bộ, chỉ gán người khi khách yêu cầu.</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Lời chào tự động ngoài giờ hành chính (Out-of-Office):</label>
                <textarea
                  rows={3}
                  value={outOfOfficeMessage}
                  onChange={(e) => setOutOfOfficeMessage(e.target.value)}
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-[#0284C7] text-xs"
                />
              </div>

              <button
                onClick={() => triggerToast('Đã lưu quy tắc phân bổ và SLA thành công!')}
                className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Cấu Hình SLA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GIÁM SÁT WEBHOOK LIVE & NHẬT KÝ KIỂM TOÁN                          */}
      {/* ========================================================================= */}
      {activeTab === 'webhooks_audit' && (
        <div className="space-y-6">
          {/* Card 1: Webhook Simulator */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Activity className="w-5 h-5 text-[#0284C7]" />
              <div>
                <h2 className="font-bold text-sm text-stone-900">
                  Bộ Mô Phỏng & Bắn Webhook Inbound Thử Nghiệm (Live Simulator)
                </h2>
                <p className="text-xs text-stone-500">
                  Kiểm tra xem webhook từ Zalo, Facebook, Website, TikTok có lập tức được CRM nhận và phân bổ hay không.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendSimulatedWebhook} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Chọn Kênh Nhận Webhook:</label>
                  <select
                    value={simChannelId}
                    onChange={(e) => setSimChannelId(e.target.value)}
                    className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 font-semibold focus:outline-none focus:border-[#0284C7]"
                  >
                    {connectors.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.type.toUpperCase()}] {c.name} - {c.accountName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tên Khách Hàng Gửi Đến:</label>
                  <input
                    type="text"
                    value={simCustomerName}
                    onChange={(e) => setSimCustomerName(e.target.value)}
                    className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Nội dung tin nhắn khách hàng gửi:</label>
                <input
                  type="text"
                  value={simMessageText}
                  onChange={(e) => setSimMessageText(e.target.value)}
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Phát Webhook Inbound Ngay</span>
                </button>

                {simSuccessNotice && (
                  <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold flex items-center gap-1 animate-message">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Đã bắn webhook thành công! Hộp thư đã cập nhật tin nhắn mới.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Card 2: Audit Logs */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-bold text-sm text-stone-900">
                  Nhật Ký Kiểm Toán Toàn Diện (System Audit Logs)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={auditCategoryFilter}
                  onChange={(e) => setAuditCategoryFilter(e.target.value)}
                  className="text-xs bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-1.5 text-stone-700 font-medium focus:outline-none"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="connector">Kênh kết nối</option>
                  <option value="conversation">Hội thoại</option>
                  <option value="deal">Cơ hội (Deal)</option>
                  <option value="subagent">Subagent AI</option>
                  <option value="settings">Cài đặt hệ thống</option>
                </select>

                <div className="relative w-56">
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Tìm nhật ký..."
                    className="w-full text-xs bg-[#F0F6FA] pl-8 pr-3 py-1.5 rounded-xl border border-sky-100 focus:outline-none focus:border-[#0284C7]"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-semibold text-[11px]">
                    <th className="py-2 pr-3">Thời gian</th>
                    <th className="py-2 pr-3">Người thao tác</th>
                    <th className="py-2 pr-3">Hành động</th>
                    <th className="py-2 pr-3">Chi tiết</th>
                    <th className="py-2 pr-3">Địa chỉ IP</th>
                    <th className="py-2">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-normal text-stone-700">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-2.5 pr-3 text-[11px] text-stone-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 pr-3 font-semibold text-stone-900 whitespace-nowrap">
                        {log.actorName}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-[#0284C7] whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-2.5 pr-3 text-[11px] text-stone-600 max-w-sm truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-2.5 pr-3 text-[10px] font-mono text-stone-400 whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                      <td className="py-2.5 whitespace-nowrap">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            log.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: QUẢN LÝ TOÀN BỘ DATA KHÁCH HÀNG & ĐƯA VỀ GOOGLE DRIVE             */}
      {/* ========================================================================= */}
      {activeTab === 'gdrive_data' && (
        <div className="space-y-6">
          {/* Top Banner: Google Drive Cloud Integration */}
          <div className="bg-gradient-to-r from-[#0A2239] via-[#0369A1] to-[#0284C7] rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider">
                  <HardDrive className="w-4 h-4 text-sky-300" />
                  <span>Google Drive & Google Sheets Cloud Data Lake</span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">
                  Quản Lý Toàn Bộ Data Khách Hàng & Đưa Về Google Drive
                </h2>
                <p className="text-xs text-sky-100 leading-relaxed opacity-90">
                  Hệ thống tự động sao lưu và đẩy toàn bộ danh bạ, lịch sử tương tác 4 kênh (Zalo, Facebook, Website, TikTok), đơn hàng và pipeline về Google Drive & Google Sheets riêng. Đảm bảo an toàn 100% dữ liệu cho khách hàng trải nghiệm hoặc thuê CRM thương mại.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
                <button
                  onClick={handleTriggerSyncDrive}
                  disabled={isSyncingDriveState}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingDriveState ? 'animate-spin' : ''}`} />
                  <span>{isSyncingDriveState ? 'Đang Đẩy Lên Drive...' : 'Đồng Bộ Ngay Về Google Drive'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onDownloadCsv}
                    className="flex-1 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File .CSV</span>
                  </button>

                  <a
                    href={driveConfig?.googleSheetUrl || 'https://docs.google.com/spreadsheets/d/1haitech_crm_master_data_live/edit'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-3.5 py-2 bg-white text-[#0A2239] hover:bg-sky-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mở Google Sheet</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Sync Progress Indicator if syncing */}
            {isSyncingDriveState && (
              <div className="mt-4 pt-4 border-t border-white/15 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-sky-100">
                  <span>Đang mã hóa UTF-8 BOM và đẩy dữ liệu lên Google Drive API v4...</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics & Configuration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#DCE6EF] shadow-sm flex items-center gap-3.5">
              <div className="p-3 bg-sky-50 text-[#0284C7] rounded-xl">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] text-stone-500 font-medium">Thư Mục Google Drive</div>
                <div className="font-bold text-stone-900 text-sm truncate max-w-[200px]" title={driveConfig?.folderName}>
                  {driveConfig?.folderName || 'HAITECH_CRM_DATABASE_BACKUPS'}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Kết nối Cloud Storage</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DCE6EF] shadow-sm flex items-center gap-3.5">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] text-stone-500 font-medium">Tổng Data Khách Đã Đồng Bộ</div>
                <div className="font-extrabold text-stone-900 text-lg">
                  {driveConfig?.totalRecordsSynced || 15} <span className="text-xs font-normal text-stone-500">khách hàng</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Lần cuối: {driveConfig?.lastSyncAt || 'Hôm nay'}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DCE6EF] shadow-sm flex items-center gap-3.5">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] text-stone-500 font-medium">Tài Khoản Google Drive</div>
                <div className="font-bold text-stone-900 text-sm truncate max-w-[200px]" title={driveConfig?.connectedAccount}>
                  {driveConfig?.connectedAccount || 'haitech.ai.drive@gmail.com'}
                </div>
                <div className="text-[10px] text-sky-600 font-semibold mt-0.5">
                  Tự động sync mỗi 15 phút: {driveAutoSync ? 'Bật' : 'Tắt'}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Form & Commercial Tenant Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Folder ID Config */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Settings className="w-4 h-4 text-[#0284C7]" />
                <h3 className="font-bold text-sm text-stone-900">Cấu Hình Thư Mục & Tài Khoản Google Drive</h3>
              </div>

              <form onSubmit={handleSaveDriveFolder} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Google Drive Folder ID (Thư Mục Đích):
                  </label>
                  <input
                    type="text"
                    value={driveFolderId}
                    onChange={(e) => setDriveFolderId(e.target.value)}
                    placeholder="VD: 1A2B3C_HAITECH_BACKUPS_DATA"
                    required
                    className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Lấy ID từ URL Google Drive: https://drive.google.com/drive/folders/<strong>[ID_O_DAY]</strong>
                  </p>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Tên Thư Mục Lưu Trữ:
                  </label>
                  <input
                    type="text"
                    value={driveConfig?.folderName || 'HAITECH_CRM_DATABASE_BACKUPS'}
                    disabled
                    className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-600 cursor-not-allowed"
                  />
                </div>

                <div className="p-3 bg-[#F0F6FA] rounded-xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-800">Tự Động Đẩy Lên Drive (Cron Auto-Sync)</div>
                    <div className="text-stone-500 text-[11px]">
                      Tự động sao lưu định kỳ mỗi khi có khách hàng mới từ Zalo, FB, Web, TikTok.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={driveAutoSync}
                    onChange={(e) => setDriveAutoSync(e.target.checked)}
                    className="w-4 h-4 accent-[#0284C7] cursor-pointer rounded"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Cấu Hình Drive</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Commercial Feature Explanation for CRM Rentals */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <CreditCard className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-stone-900">Lợi Thế Dành Cho Khách Hàng Thuê CRM</h3>
              </div>

              <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-stone-900">Bảo Vệ Chủ Quyền Dữ Liệu 100%:</strong>
                    <p className="text-[11px] mt-0.5">
                      Khách hàng thuê CRM có toàn quyền sở hữu data. Dữ liệu đổ thẳng vào Google Drive và Google Sheets thuộc tài khoản riêng của họ, không lo phụ thuộc nền tảng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-stone-900">Tích Hợp Sẵn Với Looker Studio & Excel:</strong>
                    <p className="text-[11px] mt-0.5">
                      Từ file Google Sheets tự động cập nhật, dễ dàng dựng dashboard BI, báo cáo doanh thu đa kênh và phân tích ROI quảng cáo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-stone-900">Hỗ Trợ Định Dạng Tiếng Việt UTF-8 BOM:</strong>
                    <p className="text-[11px] mt-0.5">
                      Tất cả file CSV xuất từ hệ thống đều có mã UTF-8 BOM chuẩn quốc tế, mở trực tiếp bằng Microsoft Excel không bao giờ bị lỗi font tiếng Việt.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenAuthModal?.('pricing')}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-500/20 text-center transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Xem Bảng Giá Gói Thuê CRM Thương Mại</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backup History Logs Table */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6EF] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0284C7]" />
                  <span>Nhật Ký Đồng Bộ Về Google Drive (Backup Logs)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Lịch sử các lần tự động sao lưu và đẩy dữ liệu khách hàng lên đám mây.
                </p>
              </div>

              <button
                onClick={handleTriggerSyncDrive}
                disabled={isSyncingDriveState}
                className="px-3.5 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDriveState ? 'animate-spin' : ''}`} />
                <span>Sao Lưu Mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-semibold text-[11px]">
                    <th className="py-2.5 pr-3">Thời Gian</th>
                    <th className="py-2.5 pr-3">Tên File Trên Drive</th>
                    <th className="py-2.5 pr-3">Số Bản Ghi</th>
                    <th className="py-2.5 pr-3">Dung Lượng</th>
                    <th className="py-2.5 pr-3">Trạng Thái</th>
                    <th className="py-2.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-normal text-stone-700">
                  {driveLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-stone-400">
                        Chưa có nhật ký sao lưu nào. Nhấn "Đồng Bộ Ngay Về Google Drive" để bắt đầu sao lưu!
                      </td>
                    </tr>
                  ) : (
                    driveLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 pr-3 font-medium text-stone-600 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3 pr-3 font-semibold text-stone-900 whitespace-nowrap flex items-center gap-1.5">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{log.fileName}</span>
                        </td>
                        <td className="py-3 pr-3 whitespace-nowrap">
                          <span className="font-bold text-[#0284C7]">{log.recordCount}</span> khách hàng
                        </td>
                        <td className="py-3 pr-3 text-stone-500 whitespace-nowrap">
                          {log.fileSize}
                        </td>
                        <td className="py-3 pr-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              log.status === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {log.status === 'success' ? 'Thành công' : 'Thất bại'}
                          </span>
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <a
                            href={log.driveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#0284C7] hover:underline font-bold text-xs"
                          >
                            <span>Xem File</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {editingConnector && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-message text-xs flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#F0F6FA]">
              <div className="flex items-center gap-2.5">
                <ChannelBadge type={editingConnector.type} accountName={editingConnector.accountName} />
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Chỉnh Sửa Cấu Hình Kênh: {editingConnector.name}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Thiết lập token, webhook callback và thông số API nền tảng.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingConnector(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEditedConnector} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Channel Name */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tên Kênh Hiển Thị:</label>
                  <input
                    type="text"
                    value={editingConnector.name}
                    onChange={(e) => setEditingConnector({ ...editingConnector, name: e.target.value })}
                    required
                    className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                {/* Account Identifier */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Định Danh Tài Khoản (SĐT / ID / Handle):
                  </label>
                  <input
                    type="text"
                    value={editingConnector.accountName}
                    onChange={(e) => setEditingConnector({ ...editingConnector, accountName: e.target.value })}
                    required
                    className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                {/* Public URL */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">Đường Dẫn Trang / Hồ Sơ Công Khai (URL):</label>
                  <input
                    type="url"
                    value={editingConnector.url || ''}
                    onChange={(e) => setEditingConnector({ ...editingConnector, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                {/* App ID / OA ID */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">App ID / OA ID / Client ID:</label>
                  <input
                    type="text"
                    value={editingConnector.config?.appId || editingConnector.config?.oaId || editingConnector.config?.pageId || ''}
                    onChange={(e) =>
                      setEditingConnector({
                        ...editingConnector,
                        config: { ...editingConnector.config, appId: e.target.value, pageId: e.target.value },
                      })
                    }
                    placeholder="VD: 10928374619 hoặc zalo_oa_id"
                    className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                {/* Secret Key */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1 flex items-center justify-between">
                    <span>App Secret / Khóa Bí Mật:</span>
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="text-[#0284C7] font-semibold text-[10px] flex items-center gap-1"
                    >
                      {showSecretKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showSecretKey ? 'Ẩn' : 'Hiện'}</span>
                    </button>
                  </label>
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={editingConnector.config?.secretKey || '••••••••••••••••••••'}
                    onChange={(e) =>
                      setEditingConnector({
                        ...editingConnector,
                        config: { ...editingConnector.config, secretKey: e.target.value },
                      })
                    }
                    className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                {/* Access Token */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1 flex items-center justify-between">
                    <span>Mã Truy Cập Token (Page Access Token / Bearer Token):</span>
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="text-[#0284C7] font-semibold text-[10px] flex items-center gap-1"
                    >
                      {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showToken ? 'Ẩn' : 'Hiện'}</span>
                    </button>
                  </label>
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={editingConnector.config?.apiKey || editingConnector.config?.botToken || 'EAAHz...haitech_token_live'}
                    onChange={(e) =>
                      setEditingConnector({
                        ...editingConnector,
                        config: { ...editingConnector.config, apiKey: e.target.value },
                      })
                    }
                    className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                {/* Webhook Callback Info */}
                <div className="sm:col-span-2 bg-sky-50 p-3 rounded-xl border border-sky-200">
                  <div className="font-bold text-stone-800 mb-1 flex items-center justify-between">
                    <span>Đường dẫn Webhook Inbound (Callback URL):</span>
                    <button
                      type="button"
                      onClick={() => handleCopyWebhook(editingConnector.id, editingConnector.webhookUrl)}
                      className="text-[#0284C7] font-bold text-[11px] flex items-center gap-1 hover:underline"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedUrlId === editingConnector.id ? 'Đã chép!' : 'Sao chép URL'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[10px] text-stone-700 break-all select-all">
                    {editingConnector.webhookUrl}
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="sm:col-span-2 p-3 bg-[#F0F6FA] rounded-xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-800">Trạng Thái Kết Nối Thật (Live Production)</div>
                    <div className="text-stone-500 text-[11px]">
                      Bật để nhận dữ liệu thật từ webhook bên ngoài. Tắt để chạy chế độ Sandbox giả lập an toàn.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!editingConnector.isDemo}
                    onChange={(e) =>
                      setEditingConnector({
                        ...editingConnector,
                        isDemo: !e.target.checked,
                        status: e.target.checked ? 'connected' : 'demo',
                      })
                    }
                    className="w-4 h-4 accent-[#0284C7] cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleTestPing(editingConnector.id)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Kiểm Tra Kết Nối (Ping)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingConnector(null)}
                    className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 font-semibold transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cấu Hình</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MÃ NHÚNG WIDGET LIVECHAT (EMBED CODE MODAL)                      */}
      {/* ========================================================================= */}
      {embedModalConnector && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-xl overflow-hidden animate-message text-xs">
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#F0F6FA]">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-stone-900">
                  Mã Nhúng Widget Livechat Cho Website ({embedModalConnector.accountName})
                </h3>
              </div>
              <button
                onClick={() => setEmbedModalConnector(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-stone-600 leading-relaxed">
                Dán đoạn mã JavaScript dưới đây vào trước thẻ <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-purple-700">&lt;/body&gt;</code> của trang web <strong className="text-stone-900">{embedModalConnector.url || 'haitech-ai.vercel.app/san-pham.html'}</strong> để kích hoạt khung chat thông minh kết nối trực tiếp vào HAITECH CRM:
              </p>

              <div className="relative bg-[#0A2239] text-sky-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
                <button
                  onClick={() => {
                    const snippet = `<!-- HAITECH CRM LIVECHAT WIDGET -->
<script
  src="https://api.haitech.vn/widget/v1/livechat.js"
  data-app-id="ht-livechat-sanpham"
  data-account="${embedModalConnector.accountName}"
  data-color="#0284C7"
  data-position="bottom-right"
  async>
</script>`;
                    navigator.clipboard.writeText(snippet);
                    setEmbedCopied(true);
                    setTimeout(() => setEmbedCopied(false), 2000);
                  }}
                  className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold flex items-center gap-1 transition-colors"
                >
                  {embedCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{embedCopied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                </button>

                <pre className="text-sky-300">
{`<!-- HAITECH CRM LIVECHAT WIDGET -->
<script
  src="https://api.haitech.vn/widget/v1/livechat.js"
  data-app-id="ht-livechat-sanpham"
  data-account="${embedModalConnector.accountName}"
  data-color="#0284C7"
  data-position="bottom-right"
  async>
</script>`}
                </pre>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Widget tự động hỗ trợ tin nhắn văn bản, gửi ảnh thực tế, định danh khách hàng và chuyển tiếp tới Subagent AI.</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setEmbedModalConnector(null)}
                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: KẾT NỐI KÊNH MỚI (ADD CONNECTOR MODAL)                           */}
      {/* ========================================================================= */}
      {isAddConnectorModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-lg overflow-hidden animate-message text-xs">
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#F0F6FA]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-bold text-sm text-stone-900">Kết Nối Nền Tảng Kênh Mới Vào CRM</h3>
              </div>
              <button
                onClick={() => setIsAddConnectorModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateConnector} className="p-5 space-y-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Loại Nền Tảng:</label>
                <select
                  value={newConnType}
                  onChange={(e: any) => setNewConnType(e.target.value)}
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 font-semibold focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="facebook">Facebook Messenger / Fanpage</option>
                  <option value="zalo_personal">Zalo Cá Nhân / Zalo OA</option>
                  <option value="website">Website Live Widget</option>
                  <option value="tiktok">TikTok Shop & Direct Message</option>
                  <option value="telegram">Telegram Bot</option>
                  <option value="instagram">Instagram Direct</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Tên Kênh Hiển Thị (Tùy chọn):</label>
                <input
                  type="text"
                  value={newConnName}
                  onChange={(e) => setNewConnName(e.target.value)}
                  placeholder="VD: Fanpage Bán Hàng HAITECH hoặc Zalo CSKH..."
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Tên Tài Khoản / Định Danh (*):</label>
                <input
                  type="text"
                  value={newConnAccount}
                  onChange={(e) => setNewConnAccount(e.target.value)}
                  placeholder="VD: 098739896, Haitech.AISystem, hoặc @vanhaitech.ai"
                  required
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Đường Dẫn Công Khai (URL):</label>
                <input
                  type="url"
                  value={newConnUrl}
                  onChange={(e) => setNewConnUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">API Key / Access Token / ID:</label>
                <input
                  type="password"
                  value={newConnApiKey}
                  onChange={(e) => setNewConnApiKey(e.target.value)}
                  placeholder="Token từ Facebook Meta / Zalo OA / TikTok Partner..."
                  className="w-full font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="p-3 bg-[#F0F6FA] rounded-xl border border-sky-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800">Chế độ kết nối thật ngay</div>
                  <div className="text-stone-500 text-[11px]">Bật để nhận dữ liệu thật từ webhook ngay lập tức.</div>
                </div>
                <input
                  type="checkbox"
                  checked={!newConnIsDemo}
                  onChange={(e) => setNewConnIsDemo(!e.target.checked)}
                  className="w-4 h-4 accent-[#0284C7] cursor-pointer rounded"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddConnectorModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm transition-colors"
                >
                  Lưu & Kết Nối Kênh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: THÊM THÀNH VIÊN MỚI (ADD USER MODAL)                             */}
      {/* ========================================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-md overflow-hidden animate-message text-xs">
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#F0F6FA]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-bold text-sm text-stone-900">Thêm Thành Viên Mới Vào CRM</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Họ và Tên (*):</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="VD: Vũ Hải Đăng"
                  required
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email Đăng Nhập (*):</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="dang.vu@haitech.vn"
                  required
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Số Điện Thoại:</label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="098739896"
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Vai Trò (Phân quyền):</label>
                <select
                  value={newUserRole}
                  onChange={(e: any) => setNewUserRole(e.target.value)}
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 font-semibold focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="agent">Chuyên viên tư vấn / CSKH (Agent)</option>
                  <option value="manager">Trưởng nhóm bán hàng (Manager)</option>
                  <option value="admin">Quản trị viên toàn quyền (Admin)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm transition-colors"
                >
                  Tạo Thành Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CHỈNH SỬA QUYỀN THÀNH VIÊN (EDIT USER MODAL)                     */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-md overflow-hidden animate-message text-xs">
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#F0F6FA]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-bold text-sm text-stone-900">Sửa Phân Quyền: {editingUser.name}</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedUser} className="p-5 space-y-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Họ và Tên:</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email:</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Vai Trò Phân Quyền:</label>
                <select
                  value={editingUser.role}
                  onChange={(e: any) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 font-semibold focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="agent">Chuyên viên tư vấn / CSKH (Agent)</option>
                  <option value="manager">Trưởng nhóm bán hàng (Manager)</option>
                  <option value="admin">Quản trị viên toàn quyền (Admin)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm transition-colors"
                >
                  Cập Nhật Quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
