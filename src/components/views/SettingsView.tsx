import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { physicsCurriculum } from '../../data/physicsTopics';
import {
  User,
  School,
  Calendar,
  Database,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  Atom,
  BookOpen,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { GradeBadge } from '../common/Badge';

export const SettingsView: React.FC = () => {
  const {
    teacherProfile,
    updateTeacherProfile,
    resetToMockData,
    showConfirmDialog,
    addToast,
    classes,
    students,
    assignments,
    exams,
    examScores
  } = useApp();

  const [formData, setFormData] = useState({
    name: teacherProfile.name,
    subject: teacherProfile.subject,
    school: teacherProfile.school,
    academicYear: teacherProfile.academicYear,
    email: teacherProfile.email,
    phone: teacherProfile.phone
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile(formData);
    addToast('Đã lưu thông tin giáo viên thành công!', 'success');
  };

  const handleResetData = () => {
    showConfirmDialog({
      title: 'Khôi phục dữ liệu mẫu ban đầu?',
      message:
        'Thao tác này sẽ tải lại dữ liệu mẫu (6 lớp, 36 học sinh, các bài tập và bài kiểm tra mẫu). Các chỉnh sửa gần đây của bạn sẽ được thay thế.',
      confirmLabel: 'Khôi phục dữ liệu',
      isDestructive: true,
      onConfirm: () => {
        resetToMockData();
        addToast('Đã khôi phục dữ liệu mẫu thành công!', 'info');
      }
    });
  };

  const handleExportData = () => {
    const backupData = {
      teacherProfile: formData,
      classes,
      students,
      assignments,
      exams,
      examScores,
      exportedAt: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `physics_teacher_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('Đã xuất tập tin sao lưu dữ liệu (.json) thành công!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Cài đặt hệ thống & Thông tin giáo viên
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tùy chỉnh thông tin hồ sơ giáo viên, xem khung chương trình Vật lý GDPT và quản lý sao lưu dữ liệu
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
          <User className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Thông tin giáo viên phụ trách
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bộ môn giảng dạy
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đơn vị công tác / Trường THPT
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={e => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Năm học đang giảng dạy
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email liên hệ
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thông tin</span>
            </button>
          </div>
        </form>
      </div>

      {/* Physics Curriculum Standard Reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
          <Atom className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Khung chương trình môn Vật lý THPT (Chương trình GDPT 2018)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {physicsCurriculum.map(cur => (
            <div
              key={cur.grade}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <GradeBadge grade={cur.grade} />
                  <span className="text-[11px] font-bold text-slate-500">
                    {cur.chapters.length} chương
                  </span>
                </div>

                <div className="space-y-2.5">
                  {cur.chapters.map(chap => (
                    <div key={chap.id} className="text-xs">
                      <p className="font-bold text-slate-800">{chap.name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {chap.topics.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management & Persistence */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Quản lý dữ liệu & Sao lưu
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-indigo-950">Sao lưu dữ liệu ra file (.json)</h4>
              <p className="text-xs text-indigo-800/80 mt-1">
                Tải về toàn bộ danh sách lớp, học sinh, bài tập và bảng điểm để lưu trữ an toàn.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải file dữ liệu</span>
            </button>
          </div>

          {/* Reset */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-rose-950">Khôi phục dữ liệu mẫu gốc</h4>
              <p className="text-xs text-rose-800/80 mt-1">
                Tải lại 6 lớp học mẫu và hơn 30 học sinh cùng hệ thống điểm và bài tập chuẩn.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetData}
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khôi phục dữ liệu mẫu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
