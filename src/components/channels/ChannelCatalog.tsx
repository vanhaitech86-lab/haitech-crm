'use client';

import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  Zap,
  Plus,
  X,
  Globe,
  Send,
  MessageSquare,
  Instagram,
  Music,
  MessageCircle,
  Mail,
  Webhook,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { ChannelConnector, ChannelType } from '@/types/crm';
import { ChannelBadge } from '../inbox/ChannelBadge';

interface ChannelCatalogProps {
  connectors: ChannelConnector[];
  onTestConnector: (connectorId: string) => Promise<{ success: boolean; message: string }>;
  onToggleDemoMode: (connectorId: string, isDemo: boolean) => void;
  onAddConnector?: (connector: ChannelConnector) => void;
  onRemoveConnector?: (connectorId: string) => void;
  onNavigateAdmin?: () => void;
}

export const ChannelCatalog: React.FC<ChannelCatalogProps> = ({
  connectors,
  onTestConnector,
  onToggleDemoMode,
  onAddConnector,
  onRemoveConnector,
  onNavigateAdmin,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string; success: boolean } | null>(null);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'connected' | 'demo'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New connector form state
  const [newType, setNewType] = useState<ChannelType>('facebook');
  const [newName, setNewName] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newConfigVal, setNewConfigVal] = useState('');
  const [newIsDemo, setNewIsDemo] = useState(false);

  const handleTest = async (connectorId: string) => {
    setTestingId(connectorId);
    setTestResult(null);
    try {
      const res = await onTestConnector(connectorId);
      setTestResult({ id: connectorId, message: res.message, success: res.success });
    } catch (e: any) {
      setTestResult({ id: connectorId, message: e.message || 'Lỗi thử nghiệm', success: false });
    } finally {
      setTestingId(null);
    }
  };

  const handleCopyWebhook = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  const handleCreateConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim() || !onAddConnector) return;

    const slug = newAccountName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const typeLabel =
      newType === 'facebook'
        ? 'Facebook Messenger'
        : newType === 'zalo_personal'
        ? 'Zalo Cá Nhân & OA'
        : newType === 'zalo_oa'
        ? 'Zalo OA'
        : newType === 'website'
        ? 'Website Live Widget'
        : newType === 'tiktok'
        ? 'TikTok Shop & Direct'
        : newType === 'telegram'
        ? 'Telegram Bot'
        : 'Instagram Direct';

    const newConnector: ChannelConnector = {
      id: `conn-${newType}-${Date.now()}`,
      type: newType,
      name: newName.trim() || typeLabel,
      accountName: newAccountName.trim(),
      url: newUrl.trim() || undefined,
      status: newIsDemo ? 'demo' : 'connected',
      isDemo: newIsDemo,
      credentialsConfigured: true,
      webhookUrl: `https://api.haitech.vn/v1/webhooks/${newType}/${slug || 'inbound'}`,
      unreadCount: 0,
      lastSyncAt: 'Vừa kết nối',
      config: {
        url: newUrl.trim() || undefined,
        apiKey: newConfigVal.trim() || undefined,
        pageId: newConfigVal.trim() || undefined,
        phone: newConfigVal.trim() || undefined,
      },
    };

    onAddConnector(newConnector);
    setIsAddModalOpen(false);

    // Reset form
    setNewAccountName('');
    setNewUrl('');
    setNewConfigVal('');
    setNewName('');
  };

  const filteredConnectors = connectors.filter((c) => {
    if (activeFilter === 'connected') return c.status === 'connected';
    if (activeFilter === 'demo') return c.status === 'demo';
    return true;
  });

  const connectedCount = connectors.filter((c) => c.status === 'connected').length;
  const demoCount = connectors.filter((c) => c.status === 'demo').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F0F6FA] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCE6EF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Trung Tâm Kết Nối Kênh (Omnichannel Hub)
            </h2>
            <span className="text-xs bg-sky-50 text-[#0284C7] border border-sky-200 font-bold px-2.5 py-0.5 rounded-full">
              {connectedCount} Đã kết nối thật · {connectors.length} Kênh cấu hình
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Kết nối trực tiếp API chính thức từ Zalo, Facebook Fanpage, TikTok Shop và Website với cơ chế Webhook Idempotency.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors shadow-sm"
              title="Mở Trang Quản Trị Hệ Thống Admin"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Cổng Quản Trị Admin</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Kết Nối Kênh Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Tất cả kênh ({connectors.length})
        </button>
        <button
          onClick={() => setActiveFilter('connected')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
            activeFilter === 'connected'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>Đã kết nối thật ({connectedCount})</span>
        </button>
        <button
          onClick={() => setActiveFilter('demo')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
            activeFilter === 'demo'
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
          <span>Demo / Mock ({demoCount})</span>
        </button>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredConnectors.map((conn) => {
          const isTesting = testingId === conn.id;
          const result = testResult?.id === conn.id ? testResult : null;
          const targetUrl = conn.url || conn.config?.pageUrl || conn.config?.targetUrl || conn.config?.profileUrl || conn.config?.url;

          return (
            <div
              key={conn.id}
              className="bg-white rounded-2xl border border-[#DCE6EF] shadow-sm p-5 flex flex-col justify-between hover:border-[#0284C7] transition-all hover:shadow-md"
            >
              <div>
                {/* Top status */}
                <div className="flex items-start justify-between mb-3">
                  <ChannelBadge type={conn.type} accountName={conn.accountName} />
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
                    ></span>
                    {conn.status === 'connected' ? 'Đã kết nối thật' : 'Demo / Mock'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 mb-0.5">{conn.name}</h3>
                    <p className="text-xs text-stone-500 mb-2">Tài khoản: <span className="font-semibold text-stone-800">{conn.accountName}</span></p>
                  </div>
                  {onRemoveConnector && !conn.id.startsWith('conn-fb-filter') && (
                    <button
                      onClick={() => onRemoveConnector(conn.id)}
                      className="text-stone-300 hover:text-red-500 p-1 rounded-lg transition-colors"
                      title="Gỡ kết nối"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Direct External URL Link Badge if exists */}
                {targetUrl && (
                  <div className="mb-3">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-semibold text-[11px] rounded-lg border border-sky-200 transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{targetUrl}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}

                {/* Webhook URL copy box */}
                <div className="bg-[#F0F6FA] p-2.5 rounded-xl border border-sky-100 mb-3 text-[11px]">
                  <div className="flex items-center justify-between text-stone-400 mb-1 font-mono text-[10px]">
                    <span>WEBHOOK URL</span>
                    <button
                      onClick={() => handleCopyWebhook(conn.id, conn.webhookUrl)}
                      className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-sans"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedUrlId === conn.id ? 'Đã chép!' : 'Chép'}</span>
                    </button>
                  </div>
                  <div className="truncate font-mono text-stone-700 text-[10px]">
                    {conn.webhookUrl}
                  </div>
                </div>

                {/* Test Result Feedback */}
                {result && (
                  <div
                    className={`p-2.5 rounded-xl border text-[11px] mb-3 leading-relaxed animate-message ${
                      result.success
                        ? 'bg-sky-50 border-sky-200 text-[#0369A1]'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    {result.message}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleDemoMode(conn.id, !conn.isDemo)}
                  className="text-[11px] font-medium text-stone-600 hover:text-stone-900 px-2 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  {conn.isDemo ? 'Bật Kết nối thật' : 'Chuyển về Demo'}
                </button>

                <button
                  onClick={() => handleTest(conn.id)}
                  disabled={isTesting}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Đang gửi...' : 'Gửi Test Event'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Connect New Channel */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden animate-message text-xs">
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#F0F6FA]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 text-[#0284C7] rounded-lg">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Kết Nối Nền Tảng / Kênh Mới Vào CRM
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateConnector} className="p-5 space-y-3.5">
              {/* Channel Type */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Chọn Nền Tảng *
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ChannelType)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="facebook">Facebook Messenger / Fanpage Meta</option>
                  <option value="zalo_personal">Zalo Cá Nhân & OA (Số điện thoại)</option>
                  <option value="website">Website Live Widget / Form Lead</option>
                  <option value="tiktok">TikTok Shop & Direct Messages</option>
                  <option value="telegram">Telegram Bot API</option>
                  <option value="instagram">Instagram Direct Feed</option>
                </select>
              </div>

              {/* Account / Display Name */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Tên Tài Khoản / Số Điện Thoại / Fanpage *
                </label>
                <input
                  type="text"
                  required
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Ví dụ: Haitech.AISystem, 098739896, @vanhaitech.ai..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              {/* URL */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Đường dẫn liên kết kênh (URL)
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.facebook.com/..., https://haitech-ai.vercel.app/..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              {/* Config / ID / Token */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Mã Page ID / App ID / API Key / Số điện thoại
                </label>
                <input
                  type="text"
                  value={newConfigVal}
                  onChange={(e) => setNewConfigVal(e.target.value)}
                  placeholder="Nhập ID hoặc token (không bắt buộc)..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              {/* Status Mode */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="connIsDemo"
                  checked={newIsDemo}
                  onChange={(e) => setNewIsDemo(e.target.checked)}
                  className="rounded text-[#0284C7] focus:ring-[#0284C7]"
                />
                <label htmlFor="connIsDemo" className="text-[11px] text-stone-700 select-none">
                  Lưu ở chế độ Demo/Mock (bỏ chọn để kích hoạt <b>Đã kết nối thật</b>)
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm transition-colors"
                >
                  Lưu & Kết Nối Vào CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

