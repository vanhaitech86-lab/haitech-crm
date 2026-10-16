'use client';

import React, { useState } from 'react';
import {
  AlarmClock,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Building,
} from 'lucide-react';
import { Task } from '@/types/crm';

interface TaskManagerProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onOpenNewTaskModal: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onToggleTask,
  onOpenNewTaskModal,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filterTab === 'pending') return t.status !== 'completed';
    if (filterTab === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7F6] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Quản Lý Nhiệm Vụ & Hẹn Nhắc Chăm Sóc
            </h2>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full">
              {tasks.filter((t) => t.status !== 'completed').length} việc cần làm
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Tự động đồng bộ lịch hẹn gọi lại, gửi hồ sơ kiểm định và chăm sóc khách hàng VIP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterTab === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterTab === 'pending' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Chưa xong
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterTab === 'completed' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Đã hoàn thành
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lịch Nhắc</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-[#E2E8E5] shadow-sm divide-y divide-stone-100 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            Không có nhiệm vụ nào trong danh sách.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`p-4 flex items-start gap-3.5 transition-colors ${
                  isDone ? 'bg-stone-50/70' : 'hover:bg-stone-50'
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                    isDone
                      ? 'bg-[#0284C7] border-[#0284C7] text-white'
                      : 'border-stone-300 hover:border-[#0284C7] bg-white'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isDone ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Priority badge */}
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        task.priority === 'urgent'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'high'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p
                      className={`text-[11px] mb-2 leading-relaxed ${
                        isDone ? 'text-stone-400' : 'text-stone-600'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-400">
                    <div className="flex items-center gap-1 font-medium text-stone-600">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{task.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Gán cho: {task.assigneeName}</span>
                    </div>

                    {task.contactName && (
                      <div className="flex items-center gap-1 text-[#0369A1] font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        <span>Khách: {task.contactName}</span>
                      </div>
                    )}

                    {task.dealTitle && (
                      <div className="flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        <span>Deal: {task.dealTitle}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
