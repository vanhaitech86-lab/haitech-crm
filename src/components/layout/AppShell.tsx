'use client';

import React, { useState, useEffect } from 'react';
import { crmStore } from '@/lib/store';
import {
  Conversation,
  Message,
  Contact,
  Deal,
  Task,
  Subagent,
  KnowledgeDocument,
  ChannelConnector,
  AuditLog,
  CrmStats,
  User,
  CommercialTenant,
  GoogleDriveConfig,
  GoogleDriveBackupLog,
  SubscriptionPlan,
} from '@/types/crm';
import { SidebarNav, NavTab } from './SidebarNav';
import { AppHeader } from './AppHeader';
import { ConversationList } from '../inbox/ConversationList';
import { ConversationView } from '../inbox/ConversationView';
import { ContactPanel } from '../inbox/ContactPanel';
import { OverviewDashboard } from '../overview/OverviewDashboard';
import { PipelineBoard } from '../pipeline/PipelineBoard';
import { SubagentManager } from '../subagents/SubagentManager';
import { KnowledgeBaseView } from '../knowledge/KnowledgeBaseView';
import { TaskManager } from '../tasks/TaskManager';
import { ChannelCatalog } from '../channels/ChannelCatalog';
import { SettingsView } from '../settings/SettingsView';
import { AdminPortal } from '../admin/AdminPortal';
import { ContactsView } from '../crm/ContactsView';
import { NewDealModal } from '../shared/NewDealModal';
import { NewTaskModal } from '../shared/NewTaskModal';
import { WebhookSimulatorModal } from '../shared/WebhookSimulatorModal';
import { AuthModal } from '../auth/AuthModal';
import { GoogleDriveSyncModal } from '../crm/GoogleDriveSyncModal';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('inbox');
  const [selectedConversationId, setSelectedConversationId] = useState<string>('conv-1');
  const [isProfileOpen, setIsProfileOpen] = useState(true);

  // Reactive state from store
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subagents, setSubagents] = useState<Subagent[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeDocument[]>([]);
  const [connectors, setConnectors] = useState<ChannelConnector[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<CrmStats>(crmStore.getStats());
  const [currentUser, setCurrentUser] = useState<User>(crmStore.getCurrentUser());

  // Commercial & Google Drive State
  const [currentTenant, setCurrentTenant] = useState<CommercialTenant | undefined>(
    crmStore.getCurrentTenant()
  );
  const [driveConfig, setDriveConfig] = useState<GoogleDriveConfig>(
    crmStore.getGoogleDriveConfig()
  );
  const [driveLogs, setDriveLogs] = useState<GoogleDriveBackupLog[]>(
    crmStore.getGoogleDriveBackupLogs()
  );

  // AI Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestion: string;
    confidence: number;
    source: string;
  } | null>(null);

  // Modals
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<
    'login' | 'register' | 'pricing'
  >('pricing');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Sync with store
  const refreshState = () => {
    setConversations(crmStore.getConversations());
    setContacts(crmStore.getContacts());
    setDeals(crmStore.getDeals());
    setTasks(crmStore.getTasks());
    setSubagents(crmStore.getSubagents());
    setKnowledge(crmStore.getKnowledge());
    setConnectors(crmStore.getConnectors());
    setAuditLogs(crmStore.getAuditLogs());
    setStats(crmStore.getStats());
    setCurrentUser(crmStore.getCurrentUser());
    setCurrentTenant(crmStore.getCurrentTenant());
    setDriveConfig(crmStore.getGoogleDriveConfig());
    setDriveLogs(crmStore.getGoogleDriveBackupLogs());

    // Update current conversation messages
    if (selectedConversationId) {
      setCurrentMessages(crmStore.getMessages(selectedConversationId));
    }
  };

  useEffect(() => {
    refreshState();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavTab | null;
      if (tabParam) {
        setCurrentTab(tabParam);
      }
    }
    const unsubscribe = crmStore.subscribe(refreshState);
    return () => {
      unsubscribe();
    };
  }, [selectedConversationId]);

  // Selected conversation & contact
  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];
  const activeContact = contacts.find((c) => c.id === activeConversation?.customerId);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setAiSuggestion(null);
    crmStore.updateConversation(id, { unreadCount: 0 });
  };

  const handleSendMessage = (text: string, isInternalNote: boolean) => {
    if (!activeConversation) return;
    crmStore.sendMessage(activeConversation.id, {
      text,
      isInternalNote,
      senderType: 'agent',
      status: 'mock_simulated',
    });
    setAiSuggestion(null);
  };

  const handleAiSuggest = () => {
    if (!activeConversation) return;
    const res = crmStore.generateAiSuggestion(activeConversation.id);
    setAiSuggestion(res);
  };

  const handleApproveAiSuggestion = (text: string) => {
    if (!activeConversation) return;
    crmStore.sendMessage(activeConversation.id, {
      text,
      senderType: 'ai',
      senderName: 'HAITECH Subagent (AI)',
      status: 'mock_simulated',
      metadata: {
        aiModel: 'claude-3-7-sonnet',
        confidence: aiSuggestion?.confidence || 0.95,
        approvedBy: currentUser.name,
      },
    });
    setAiSuggestion(null);
  };

  const handleResetSeedData = () => {
    setIsResetting(true);
    setTimeout(() => {
      crmStore.resetSeedData();
      setIsResetting(false);
      refreshState();
    }, 500);
  };

  // Auth & Commercial Modal Handlers
  const handleOpenAuthModal = (tab: 'login' | 'register' | 'pricing' = 'pricing') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLogin = (credentials: { email: string; password?: string }) => {
    crmStore.login(credentials);
    refreshState();
  };

  const handleRegister = (data: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    plan: SubscriptionPlan;
  }) => {
    crmStore.register(data);
    refreshState();
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    crmStore.updateTenant({
      plan,
      isPaid: plan !== 'trial',
      status: 'active',
    });
    refreshState();
  };

  // Google Drive Handlers
  const handleSyncDrive = async () => {
    const res = await crmStore.syncCustomerDataToDrive();
    refreshState();
    return res;
  };

  const handleDownloadCsv = () => {
    crmStore.exportContactsCsv();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F6FA] text-[#0F1E2E]">
      {/* 1. Left Vertical Navigation (~104px) */}
      <SidebarNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadCount={conversations.filter((c) => c.unreadCount > 0).length}
        taskAlertCount={tasks.filter((t) => t.status === 'pending').length}
      />

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <AppHeader
          currentUser={currentUser}
          currentTenant={currentTenant}
          onResetSeed={handleResetSeedData}
          onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
          onNavigateAdmin={() => setCurrentTab('admin')}
          onOpenAuthModal={handleOpenAuthModal}
          onOpenGoogleDriveModal={() => setIsDriveModalOpen(true)}
          isResetting={isResetting}
        />

        {/* Dynamic Section Render */}
        <div className="flex-1 flex h-[calc(100vh-52px)] overflow-hidden">
          {/* INBOX & INTERACTIONS (3-Column layout matching reference screenshot) */}
          {(currentTab === 'inbox' || currentTab === 'interactions') && (
            <>
              {/* Column 2: Conversation List (440px) */}
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                channelConnectors={connectors}
              />

              {/* Column 3: Center Conversation Thread View */}
              {activeConversation ? (
                <ConversationView
                  conversation={activeConversation}
                  messages={currentMessages}
                  onSendMessage={handleSendMessage}
                  onUpdateConversation={(partial) =>
                    crmStore.updateConversation(activeConversation.id, partial)
                  }
                  onToggleProfilePanel={() => setIsProfileOpen(!isProfileOpen)}
                  onNavigateSettings={() => setCurrentTab('admin')}
                  onAiSuggest={handleAiSuggest}
                  aiSuggestion={aiSuggestion}
                  onApproveAiSuggestion={handleApproveAiSuggestion}
                  isProfileOpen={isProfileOpen}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-stone-400 text-xs">
                  Chọn một hội thoại để bắt đầu trao đổi.
                </div>
              )}

              {/* Column 4: Right Contact Profile Drawer */}
              {isProfileOpen && (
                <ContactPanel
                  contact={activeContact}
                  tasks={tasks}
                  onUpdateContact={(partial) => {
                    if (activeContact) {
                      crmStore.updateContact(activeContact.id, partial);
                    }
                  }}
                  onAddMemory={(mem) => {
                    if (activeContact) {
                      crmStore.addContactMemory(activeContact.id, mem);
                    }
                  }}
                  onOpenNewDealModal={() => setIsNewDealOpen(true)}
                  onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
                  onClose={() => setIsProfileOpen(false)}
                  onViewTimeline={() => setCurrentTab('contacts')}
                />
              )}
            </>
          )}

          {/* OVERVIEW DASHBOARD */}
          {currentTab === 'overview' && (
            <OverviewDashboard
              stats={stats}
              conversations={conversations}
              deals={deals}
            />
          )}

          {/* CONTACTS / CRM */}
          {currentTab === 'contacts' && (
            <ContactsView
              contacts={contacts}
              onSelectContactForChat={(contactId) => {
                const conv = conversations.find((c) => c.customerId === contactId);
                if (conv) {
                  setSelectedConversationId(conv.id);
                  setCurrentTab('inbox');
                }
              }}
              onOpenGoogleDriveModal={() => setIsDriveModalOpen(true)}
              onDownloadCsv={handleDownloadCsv}
            />
          )}

          {/* PIPELINE KANBAN */}
          {currentTab === 'pipeline' && (
            <PipelineBoard
              stages={crmStore.getPipelineStages()}
              deals={deals}
              onUpdateDealStage={(dealId, newStageId) =>
                crmStore.updateDealStage(dealId, newStageId)
              }
              onOpenNewDealModal={() => setIsNewDealOpen(true)}
            />
          )}

          {/* SUBAGENTS & AI */}
          {currentTab === 'subagents' && (
            <SubagentManager
              subagents={subagents}
              onUpdateSubagent={(id, partial) => crmStore.updateSubagent(id, partial)}
            />
          )}

          {/* KNOWLEDGE BASE */}
          {currentTab === 'knowledge' && <KnowledgeBaseView knowledge={knowledge} />}

          {/* TASKS & REMINDERS */}
          {currentTab === 'tasks' && (
            <TaskManager
              tasks={tasks}
              onToggleTask={(taskId) => crmStore.toggleTaskStatus(taskId)}
              onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
            />
          )}

          {/* CHANNELS CATALOG */}
          {currentTab === 'channels' && (
            <ChannelCatalog
              connectors={connectors}
              onToggleDemoMode={(connectorId, isDemo) =>
                crmStore.updateConnector(connectorId, {
                  isDemo,
                  status: isDemo ? 'demo' : 'connected',
                })
              }
              onTestConnector={async (connectorId) => {
                const res = await fetch(`/api/v1/channels/${connectorId}/test`, {
                  method: 'POST',
                });
                return res.json();
              }}
              onAddConnector={(newConn) => crmStore.addConnector(newConn)}
              onRemoveConnector={(id) => crmStore.removeConnector(id)}
              onNavigateAdmin={() => setCurrentTab('admin')}
            />
          )}

          {/* ADMIN & SETTINGS PORTAL */}
          {(currentTab === 'settings' || currentTab === 'admin') && (
            <AdminPortal
              connectors={connectors}
              users={crmStore.getUsers()}
              auditLogs={auditLogs}
              subagents={subagents}
              currentTenant={currentTenant}
              driveConfig={driveConfig}
              driveLogs={driveLogs}
              onUpdateConnector={(id, partial) => crmStore.updateConnector(id, partial)}
              onAddConnector={(newConn) => crmStore.addConnector(newConn)}
              onRemoveConnector={(id) => crmStore.removeConnector(id)}
              onUpdateUser={(userId, partial) => crmStore.updateUser(userId, partial)}
              onAddUser={(newUser) => crmStore.addUser(newUser)}
              onRemoveUser={(userId) => crmStore.removeUser(userId)}
              onTestConnector={async (connectorId) => {
                const res = await fetch(`/api/v1/channels/${connectorId}/test`, {
                  method: 'POST',
                });
                return res.json();
              }}
              onTriggerWebhook={(connectorId, customerName, text) => {
                crmStore.simulateInboundWebhook(connectorId, customerName, text);
                refreshState();
              }}
              onResetSeedData={handleResetSeedData}
              onSyncDrive={handleSyncDrive}
              onUpdateDriveConfig={(partial) => {
                crmStore.updateGoogleDriveConfig(partial);
                refreshState();
              }}
              onDownloadCsv={handleDownloadCsv}
              onOpenAuthModal={handleOpenAuthModal}
              isResetting={isResetting}
            />
          )}
        </div>
      </div>

      {/* MODALS */}
      <NewDealModal
        isOpen={isNewDealOpen}
        onClose={() => setIsNewDealOpen(false)}
        onCreateDeal={(data) => crmStore.createDeal(data as any)}
        stages={crmStore.getPipelineStages()}
        contacts={contacts}
        initialContact={activeContact}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onCreateTask={(data) => crmStore.createTask(data as any)}
        contact={activeContact}
        deals={deals}
      />

      <WebhookSimulatorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        connectors={connectors}
        onTriggerWebhook={(connectorId, customerName, text) => {
          crmStore.simulateInboundWebhook(connectorId, customerName, text);
          refreshState();
        }}
      />

      {/* Commercial Auth, 14-Day Free Trial & Rental Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentTenant={currentTenant}
        initialTab={authModalInitialTab}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSelectPlan={handleSelectPlan}
      />

      {/* Google Drive & Customer Data Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        driveConfig={driveConfig}
        backupLogs={driveLogs}
        totalContactsCount={contacts.length}
        onSyncNow={handleSyncDrive}
        onUpdateConfig={(partial) => {
          crmStore.updateGoogleDriveConfig(partial);
          refreshState();
        }}
        onDownloadCsv={handleDownloadCsv}
      />
    </div>
  );
};
