'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  RefreshCw,
  FileText,
  CheckCircle2,
  Tag,
  Layers,
  Sparkles,
} from 'lucide-react';
import { KnowledgeDocument } from '@/types/crm';

interface KnowledgeBaseViewProps {
  knowledge: KnowledgeDocument[];
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  knowledge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>(knowledge[0]?.id || '');
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);

  const filteredKnowledge = knowledge.filter(
    (k) =>
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDoc =
    knowledge.find((k) => k.id === selectedDocId) || knowledge[0];

  const handleReindex = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
      setReindexSuccess(true);
      setTimeout(() => setReindexSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7F6] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8E5] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900">
              Kho Tri Thức & Huấn Luyện AI (Knowledge Base)
            </h2>
            <span className="text-xs bg-sky-50 text-[#0284C7] border border-sky-200 font-bold px-2.5 py-0.5 rounded-full">
              {knowledge.length} Tài liệu đã xuất bản
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Dữ liệu nguồn để AI Subagent tự động tra cứu, trích dẫn chính xác báo giá, thông số kỹ thuật và quy trình SOP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReindex}
            disabled={isReindexing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />
            <span>{isReindexing ? 'Đang Embed & Re-index...' : 'Re-index Tri Thức'}</span>
          </button>
        </div>
      </div>

      {reindexSuccess && (
        <div className="bg-sky-50 border-b border-sky-200 px-6 py-2.5 text-xs text-[#0369A1] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
          <span>Đã hoàn tất phân đoạn chunking (18 chunks) và cập nhật vector embeddings thành công!</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left List */}
        <div className="w-96 bg-white border-r border-[#E2E8E5] flex flex-col h-full flex-shrink-0">
          {/* Search Box */}
          <div className="p-3 border-b border-stone-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu, chính sách..."
                className="w-full bg-[#F0F6FA] text-xs text-stone-800 placeholder-stone-400 pl-8 pr-3 py-2 rounded-xl border border-transparent focus:border-[#0284C7] focus:bg-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredKnowledge.map((doc) => {
              const isSelected = doc.id === selectedDoc?.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#E0F2FE] border-l-4 border-l-[#0284C7]'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                      {doc.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      v{doc.version}
                    </span>
                  </div>

                  <h4
                    className={`text-xs font-bold mb-1 line-clamp-1 ${
                      isSelected ? 'text-[#0284C7]' : 'text-stone-900'
                    }`}
                  >
                    {doc.title}
                  </h4>

                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {doc.content.replace(/^#+ /, '')}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 pt-1 border-t border-stone-100">
                    <span>{doc.chunksCount} chunks vector</span>
                    <span>{doc.authorName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Viewer & Chunk Inspector */}
        {selectedDoc && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-sm space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-stone-900 mb-1">
                    {selectedDoc.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span>Tác giả: {selectedDoc.authorName}</span>
                    <span>•</span>
                    <span>Phiên bản v{selectedDoc.version}</span>
                    <span>•</span>
                    <span className="text-[#0284C7] font-semibold">Đã xuất bản</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-sky-50 text-[#0284C7] border border-sky-200 px-3 py-1 rounded-xl text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{selectedDoc.chunksCount} Khối Nhúng (Chunks)</span>
                </div>
              </div>

              {/* Markdown Content Box */}
              <div className="bg-[#F0F6FA] p-4 rounded-xl border border-sky-100 text-xs text-stone-800 leading-relaxed font-mono whitespace-pre-wrap">
                {selectedDoc.content}
              </div>

              {/* Source Citation Preview */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1 text-sky-800 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                  Tài liệu này tự động cấp quyền trích dẫn cho Subagent Tư Vấn & Báo Giá.
                </span>
                <span className="text-stone-400">
                  Cập nhật: {new Date(selectedDoc.lastIndexedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
