import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, GradeLevel } from '../../types';
import {
  Plus,
  Search,
  Users,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Calendar,
  School,
  Award,
  Filter,
  X
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { StudentProfileModal } from './StudentProfileModal';
import { formatDate, formatScore, getPerformanceTier } from '../../utils/formatters';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    showConfirmDialog,
    selectedStudentId,
    setSelectedStudentId,
    getStudentStats
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    classId: '',
    className: '',
    grade: 10 as GradeLevel,
    gender: 'male' as 'male' | 'female',
    dob: '2008-05-15',
    phone: '',
    parentPhone: '',
    email: '',
    address: 'Hà Nội',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtered Students
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery) ||
      (student.parentPhone && student.parentPhone.includes(searchQuery));

    const matchesGrade =
      selectedGradeFilter === 'all' || student.grade.toString() === selectedGradeFilter;

    const matchesClass =
      selectedClassFilter === 'all' || student.classId === selectedClassFilter;

    const matchesGender =
      selectedGenderFilter === 'all' || student.gender === selectedGenderFilter;

    return matchesSearch && matchesGrade && matchesClass && matchesGender;
  });

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    const defaultClass = classes[0];
    const generatedCode = `HS${Math.floor(1000 + Math.random() * 9000)}`;

    setFormData({
      code: generatedCode,
      name: '',
      classId: defaultClass ? defaultClass.id : '',
      className: defaultClass ? defaultClass.name : '',
      grade: defaultClass ? defaultClass.grade : 10,
      gender: 'male',
      dob: '2008-09-12',
      phone: '',
      parentPhone: '',
      email: '',
      address: '',
      notes: ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (std: Student) => {
    setEditingStudent(std);
    setFormData({
      code: std.code,
      name: std.name,
      classId: std.classId,
      className: std.className,
      grade: std.grade,
      gender: std.gender,
      dob: std.dob,
      phone: std.phone || '',
      parentPhone: std.parentPhone || '',
      email: std.email || '',
      address: std.address || '',
      notes: std.notes || ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleClassChange = (classId: string) => {
    const foundClass = classes.find(c => c.id === classId);
    if (foundClass) {
      setFormData(prev => ({
        ...prev,
        classId: foundClass.id,
        className: foundClass.name,
        grade: foundClass.grade
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên học sinh';
    }
    if (!formData.code.trim()) {
      errors.code = 'Vui lòng nhập mã học sinh';
    }
    if (!formData.classId) {
      errors.classId = 'Vui lòng chọn lớp học';
    }
    if (!formData.dob) {
      errors.dob = 'Vui lòng chọn ngày sinh';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteStudent = (std: Student) => {
    showConfirmDialog({
      title: `Xác nhận xóa học sinh ${std.name}?`,
      message: `Bạn có chắc chắn muốn xóa học sinh ${std.name} (${std.code}) khỏi hệ thống? Tất cả điểm thi và bài tập liên quan cũng sẽ bị xóa.`,
      confirmLabel: 'Xóa học sinh',
      isDestructive: true,
      onConfirm: () => deleteStudent(std.id)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý hồ sơ học sinh THPT
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng số: <span className="font-bold text-slate-800">{students.length}</span> học sinh ({filteredStudents.length} đang hiển thị)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm học sinh mới</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã HS, SĐT..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade */}
          <select
            value={selectedGradeFilter}
            onChange={e => {
              setSelectedGradeFilter(e.target.value);
              setSelectedClassFilter('all');
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả các khối</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>

          {/* Class */}
          <select
            value={selectedClassFilter}
            onChange={e => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả các lớp</option>
            {classes
              .filter(
                c => selectedGradeFilter === 'all' || c.grade.toString() === selectedGradeFilter
              )
              .map(cls => (
                <option key={cls.id} value={cls.id}>
                  Lớp {cls.name}
                </option>
              ))}
          </select>

          {/* Gender */}
          <select
            value={selectedGenderFilter}
            onChange={e => setSelectedGenderFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          title="Không tìm thấy học sinh nào"
          description="Vui lòng thử điều chỉnh bộ lọc hoặc thêm học sinh mới."
          actionLabel="+ Thêm học sinh"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12">STT</th>
                  <th className="py-3 px-4">Mã HS</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Lớp</th>
                  <th className="py-3 px-4">Khối</th>
                  <th className="py-3 px-4">Giới tính</th>
                  <th className="py-3 px-4">Ngày sinh</th>
                  <th className="py-3 px-4">Điểm TB Lý</th>
                  <th className="py-3 px-4">Xếp loại</th>
                  <th className="py-3 px-4">Điện thoại</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std, idx) => {
                  const stats = getStudentStats(std.id);
                  const tier = getPerformanceTier(parseFloat(stats.overallAverage) || 0);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {std.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {std.name.charAt(0)}
                          </div>
                          <span
                            onClick={() => setSelectedStudentId(std.id)}
                            className="font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {std.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        Lớp {std.className}
                      </td>
                      <td className="py-3.5 px-4">
                        <GradeBadge grade={std.grade} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            std.gender === 'male'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-pink-50 text-pink-700'
                          }`}
                        >
                          {std.gender === 'male' ? 'Nam' : 'Nữ'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {formatDate(std.dob)}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-indigo-600">
                        {stats.overallAverage} <span className="text-[10px] text-slate-400 font-normal">/10</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            tier === 'Xuất sắc'
                              ? 'emerald'
                              : tier === 'Tốt'
                              ? 'blue'
                              : tier === 'Đạt'
                              ? 'amber'
                              : 'rose'
                          }
                          size="sm"
                          dot
                        >
                          {tier}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {std.phone || std.parentPhone || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedStudentId(std.id)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Xem hồ sơ học sinh"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(std)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(std)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingStudent ? `Cập nhật hồ sơ: ${editingStudent.name}` : 'Thêm học sinh mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã học sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    placeholder="HS1001"
                    className="w-full px-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                  {formErrors.code && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.code}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.classId}
                    onChange={e => handleClassChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        Lớp {cls.name} (Khối {cls.grade})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className={`w-full px-3 py-2 text-xs font-medium bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    formErrors.name ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e =>
                      setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại học sinh
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại Phụ huynh
                  </label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="0988 765 432"
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hocsinh@thpt.edu.vn"
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ & Ghi chú
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú về học lực, tinh thần phát biểu bài, tham gia đội tuyển..."
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                >
                  {editingStudent ? 'Cập nhật' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudentId && (
        <StudentProfileModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};
