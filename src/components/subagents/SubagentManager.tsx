'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  FileCode,
  Zap,
} from 'lucide-react';
import { Subagent, ChannelType } from '@/types/crm';

interface SubagentManagerProps {
  subagents: Subagent[];
  onUpdateSubagent: (id: string, partial: Partial<Subagent>) => void;
}

export const SubagentManager: React.FC<SubagentManagerProps> = ({
  subagents,
  onUpdateSubagent,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(subagents[0]?.id || '');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedAgent = subagents.find((s) => s.id === selectedAgentId) || subagents[0];

  const handleSimulateTest = () => {
    if (!testInput.trim()) return;
    setIsSimulating(true);
    setTestOutput(null);

    setTimeout(() => {
      setIsSimulating(false);
      setTestOutput(
        `[${selectedAgent.name}] Trả lời: Dạ chào anh/chị! Em đã kiểm tra tài liệu kiến thức và xác nhận tiêu chuẩn kỹ thuật phù hợp với yêu cầu của mình. Em xin phép gửi thông tin chi tiết qua kênh chat ngay ạ!`
      );
    }, 450);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7F6] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8E5] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900">
              Quản Trị AI Subagent & Chính Sách Guardrails
            </h2>
            <span className="text-xs bg-sky-50 text-[#0284C7] border border-sky-200 font-bold px-2 py-0.5 rounded-full">
              {subagents.length} Trợ lý kích hoạt
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình mô hình LLM, phạm vi công cụ (Tools), tài liệu huấn luyện và rào chắn an toàn (Human-in-the-loop).
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Subagents List (320px) */}
        <div className="w-80 bg-white border-r border-[#E2E8E5] flex flex-col h-full overflow-y-auto divide-y divide-stone-100 flex-shrink-0">
          <div className="p-3 bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Danh sách Subagents
          </div>

          {subagents.map((agent) => {
            const isSelected = agent.id === selectedAgent?.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-3.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#E0F2FE] border-l-4 border-l-[#0284C7]' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`text-xs font-bold ${
                      isSelected ? 'text-[#0284C7]' : 'text-stone-900'
                    }`}
                  >
                    {agent.name}
                  </h4>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      agent.status === 'active'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 line-clamp-2 mb-2 leading-relaxed">
                  {agent.goal}
                </p>

                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                    {agent.model}
                  </span>
                  <span className="text-[#0284C7] font-semibold">
                    {agent.metrics.approvalRate}% duyệt
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail & Settings Editor */}
        {selectedAgent && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Card 1: Identity & Model */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 text-[#0284C7] rounded-xl">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{selectedAgent.name}</h3>
                    <p className="text-xs text-stone-500">{selectedAgent.description}</p>
                  </div>
                </div>

                {/* Model Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">Model LLM:</span>
                  <select
                    value={selectedAgent.model}
                    onChange={(e) =>
                      onUpdateSubagent(selectedAgent.id, { model: e.target.value as any })
                    }
                    className="text-xs font-semibold bg-[#F0F6FA] border border-sky-200 rounded-xl px-3 py-1.5 text-stone-800 focus:outline-none"
                  >
                    <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Anthropic)</option>
                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                    <option value="gemini-2-flash">Gemini 2.0 Flash (Google)</option>
                  </select>
                </div>
              </div>

              {/* Guardrails Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Ngưỡng Tin Cậy (Confidence Threshold Guardrail)</span>
                  </div>
                  <span className="font-extrabold text-[#0284C7]">
                    {Math.round(selectedAgent.confidenceThreshold * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={Math.round(selectedAgent.confidenceThreshold * 100)}
                  onChange={(e) =>
                    onUpdateSubagent(selectedAgent.id, {
                      confidenceThreshold: Number(e.target.value) / 100,
                    })
                  }
                  className="w-full accent-[#0284C7] h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Nếu độ tự tin của AI dưới ngưỡng này, hệ thống bắt buộc chuyển giao cho chuyên viên người thật xử lý.
                </p>
              </div>

              {/* Tools & Knowledge Scopes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Công cụ được phép (Allowed Tools)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.allowedTools.map((t) => (
                      <span
                        key={t}
                        className="bg-stone-100 text-stone-700 font-mono text-[10px] px-2 py-0.5 rounded-lg border border-stone-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Tài liệu tham chiếu (Knowledge Scope)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.knowledgeScope.map((k) => (
                      <span
                        key={k}
                        className="bg-sky-50 text-[#0284C7] font-medium text-[10px] px-2 py-0.5 rounded-lg border border-sky-200"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Prompt View */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5 text-stone-500" />
                  <span>Kịch bản chỉ đạo (System Prompt)</span>
                </label>
                <textarea
                  rows={4}
                  value={selectedAgent.systemPrompt}
                  onChange={(e) =>
                    onUpdateSubagent(selectedAgent.id, { systemPrompt: e.target.value })
                  }
                  className="w-full text-xs font-mono bg-[#F0F6FA] text-stone-800 p-3 rounded-xl border border-sky-100 focus:outline-none focus:border-[#0284C7] leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Card 2: Interactive Sandbox Playground */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Thử Nghiệm Phản Hồi Trực Tiếp (Subagent Playground)</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Nhập câu hỏi thử nghiệm của khách (Ví dụ: Cho mình hỏi giá gói Enterprise)..."
                  className="flex-1 text-xs bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSimulateTest()}
                />
                <button
                  onClick={handleSimulateTest}
                  disabled={isSimulating || !testInput.trim()}
                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {isSimulating ? 'Đang suy nghĩ...' : 'Kiểm tra'}
                </button>
              </div>

              {testOutput && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-stone-800 leading-relaxed animate-message">
                  {testOutput}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
