import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  GradeLevel,
  ClassInfo,
  Student,
  Assignment,
  AssignmentSubmission,
  Exam,
  ExamScore,
  ActivityLog,
  TeacherProfile,
  NotificationItem,
  ActiveTab
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAMS,
  INITIAL_EXAM_SCORES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TEACHER_PROFILE,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  classes: ClassInfo[];
  students: Student[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  exams: Exam[];
  examScores: ExamScore[];
  activityLogs: ActivityLog[];
  teacherProfile: TeacherProfile;
  notifications: NotificationItem[];
  
  // Navigation & Selected States
  selectedClassId: string | null;
  setSelectedClassId: (id: string | null) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
  selectedExamId: string | null;
  setSelectedExamId: (id: string | null) => void;
  
  // Modals & Search
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  // Toast & Confirm Dialog
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  confirmDialogState: (ConfirmDialogOptions & { isOpen: boolean }) | null;
  showConfirmDialog: (options: ConfirmDialogOptions) => void;
  closeConfirmDialog: () => void;

  // CRUD Operations - Classes
  addClass: (classData: Omit<ClassInfo, 'id' | 'createdAt' | 'studentCount'>) => void;
  updateClass: (id: string, classData: Partial<ClassInfo>) => void;
  deleteClass: (id: string) => void;

  // CRUD Operations - Students
  addStudent: (studentData: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, studentData: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // CRUD Operations - Assignments
  addAssignment: (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, assignmentData: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  saveSubmissionGrade: (assignmentId: string, studentId: string, score: number, status: 'submitted' | 'late', feedback?: string) => void;
  saveAssignmentSubmission: (submission: { assignmentId: string; studentId: string; score: number; status?: 'submitted' | 'late'; feedback?: string; submittedDate?: string }) => void;

  // CRUD Operations - Exams
  addExam: (examData: Omit<Exam, 'id' | 'createdAt'>) => void;
  updateExam: (id: string, examData: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  saveExamScores: (examId: string, scores: { studentId: string; studentName: string; classId: string; score: number; notes?: string }[]) => void;
  saveExamScore: (scoreData: { examId: string; studentId: string; studentName?: string; classId?: string; className?: string; grade?: GradeLevel; score: number; teacherFeedback?: string; notes?: string; gradedDate?: string }) => void;

  // Settings & Profile
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  resetToDemoData: () => void;
  resetToMockData: () => void;
  clearAllData: () => void;
  exportBackupData: () => void;
  importBackupData: (jsonData: string) => boolean;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Computed Aggregations
  stats: {
    totalClasses: number;
    totalStudents: number;
    totalAssignments: number;
    totalExams: number;
    overallAverageScore: number;
    grade10: { classCount: number; studentCount: number; avgScore: number };
    grade11: { classCount: number; studentCount: number; avgScore: number };
    grade12: { classCount: number; studentCount: number; avgScore: number };
    performanceDistribution: { name: string; value: number; count: number; color: string }[];
    classAverageScores: { className: string; grade: GradeLevel; avgScore: number; studentCount: number }[];
  };

  // Helper functions
  getStudentStats: (studentId: string) => {
    avgScore: number;
    overallAverage: string;
    examCount: number;
    examsTaken: number;
    assignmentCount: number;
    assignmentsDone: number;
    completedAssignments: number;
    pendingAssignments: number;
    examScores: ExamScore[];
    assignmentSubmissions: AssignmentSubmission[];
    scoreHistory: { date: string; title: string; type: 'assignment' | 'exam'; score: number }[];
  };
  getClassDetails: (classId: string) => {
    classInfo?: ClassInfo;
    students: Student[];
    assignments: Assignment[];
    exams: Exam[];
    avgScore: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLASSES: 'pt_classes_v1',
  STUDENTS: 'pt_students_v1',
  ASSIGNMENTS: 'pt_assignments_v1',
  SUBMISSIONS: 'pt_submissions_v1',
  EXAMS: 'pt_exams_v1',
  EXAM_SCORES: 'pt_exam_scores_v1',
  LOGS: 'pt_logs_v1',
  TEACHER: 'pt_teacher_v1',
  NOTIFICATIONS: 'pt_notifications_v1'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Read initial data from localStorage with fallback
  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [examScores, setExamScores] = useState<ExamScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAM_SCORES);
      return saved ? JSON.parse(saved) : INITIAL_EXAM_SCORES;
    } catch {
      return INITIAL_EXAM_SCORES;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER);
      return saved ? JSON.parse(saved) : INITIAL_TEACHER_PROFILE;
    } catch {
      return INITIAL_TEACHER_PROFILE;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // UI state
  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Toasts and Confirm Modal
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmDialogState, setConfirmDialogState] = useState<(ConfirmDialogOptions & { isOpen: boolean }) | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAM_SCORES, JSON.stringify(examScores));
  }, [examScores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacherProfile));
  }, [teacherProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Keep studentCount accurate on classes
  useEffect(() => {
    setClasses(prevClasses =>
      prevClasses.map(cls => ({
        ...cls,
        studentCount: students.filter(s => s.classId === cls.id).length
      }))
    );
  }, [students.length]);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    // Smooth scroll to top when changing tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Confirm Modal Helpers
  const showConfirmDialog = (options: ConfirmDialogOptions) => {
    setConfirmDialogState({ ...options, isOpen: true });
  };

  const closeConfirmDialog = () => {
    setConfirmDialogState(null);
  };

  const logActivity = (type: ActivityLog['type'], title: string, description: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 20)]);
  };

  // CRUD Classes
  const addClass = (classData: Omit<ClassInfo, 'id' | 'createdAt' | 'studentCount'>) => {
    const id = `cls-${Date.now().toString(36)}`;
    const newClass: ClassInfo = {
      ...classData,
      id,
      studentCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClasses(prev => [newClass, ...prev]);
    logActivity('class_update', `Đã tạo lớp ${newClass.name}`, `Khối ${newClass.grade} • Giáo viên: ${newClass.teacher}`);
    addToast(`Đã thêm lớp ${newClass.name} thành công!`, 'success');
  };

  const updateClass = (id: string, classData: Partial<ClassInfo>) => {
    setClasses(prev =>
      prev.map(c => (c.id === id ? { ...c, ...classData } : c))
    );
    // Update corresponding students' className if name changed
    if (classData.name) {
      setStudents(prev =>
        prev.map(s => (s.classId === id ? { ...s, className: classData.name! } : s))
      );
    }
    logActivity('class_update', `Đã cập nhật thông tin lớp`, `Cập nhật dữ liệu lớp ${classData.name || id}`);
    addToast('Cập nhật thông tin lớp học thành công!', 'success');
  };

  const deleteClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    const clsName = cls ? cls.name : 'lớp học';
    setClasses(prev => prev.filter(c => c.id !== id));
    // Cascade remove students in this class
    setStudents(prev => prev.filter(s => s.classId !== id));
    logActivity('class_update', `Đã xóa lớp ${clsName}`, `Đã xóa toàn bộ dữ liệu liên quan đến lớp ${clsName}`);
    addToast(`Đã xóa ${clsName} thành công!`, 'info');
  };

  // CRUD Students
  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    const id = `std-${Date.now().toString(36)}`;
    const newStudent: Student = {
      ...studentData,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStudents(prev => [newStudent, ...prev]);
    logActivity('student_add', `Đã thêm học sinh ${newStudent.name}`, `Mã HS: ${newStudent.code} • Lớp ${newStudent.className}`);
    addToast(`Đã thêm học sinh ${newStudent.name} (${newStudent.className}) thành công!`, 'success');
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, ...studentData } : s))
    );
    addToast('Đã cập nhật hồ sơ học sinh!', 'success');
  };

  const deleteStudent = (id: string) => {
    const std = students.find(s => s.id === id);
    const name = std ? std.name : 'học sinh';
    setStudents(prev => prev.filter(s => s.id !== id));
    setSubmissions(prev => prev.filter(sub => sub.studentId !== id));
    setExamScores(prev => prev.filter(sc => sc.studentId !== id));
    addToast(`Đã xóa học sinh ${name} khỏi hệ thống!`, 'info');
  };

  // CRUD Assignments
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const id = `asg-${Date.now().toString(36)}`;
    const newAssignment: Assignment = {
      ...assignmentData,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAssignment, ...prev]);

    // Pre-create blank/pending submissions for students in the assigned classes
    const targetStudents = students.filter(s => newAssignment.classIds.includes(s.classId));
    const newSubmissions: AssignmentSubmission[] = targetStudents.map(s => ({
      id: `sub-${Date.now()}-${s.id}`,
      assignmentId: id,
      studentId: s.id,
      studentName: s.name,
      classId: s.classId,
      status: 'not_submitted'
    }));
    setSubmissions(prev => [...newSubmissions, ...prev]);

    logActivity('assignment_create', `Đã giao bài tập mới`, `${newAssignment.title} (Khối ${newAssignment.grade})`);
    addToast(`Đã tạo và giao bài tập "${newAssignment.title}"!`, 'success');
  };

  const updateAssignment = (id: string, assignmentData: Partial<Assignment>) => {
    setAssignments(prev =>
      prev.map(a => (a.id === id ? { ...a, ...assignmentData } : a))
    );
    addToast('Đã cập nhật thông tin bài tập!', 'success');
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    setSubmissions(prev => prev.filter(sub => sub.assignmentId !== id));
    addToast('Đã xóa bài tập!', 'info');
  };

  const saveSubmissionGrade = (
    assignmentId: string,
    studentId: string,
    score: number,
    status: 'submitted' | 'late',
    feedback?: string
  ) => {
    setSubmissions(prev => {
      const existing = prev.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
      if (existing) {
        return prev.map(s =>
          s.id === existing.id
            ? {
                ...s,
                score,
                status,
                feedback,
                submittedAt: s.submittedAt || new Date().toISOString().replace('T', ' ').substring(0, 16)
              }
            : s
        );
      } else {
        const student = students.find(s => s.id === studentId);
        return [
          ...prev,
          {
            id: `sub-${Date.now()}-${studentId}`,
            assignmentId,
            studentId,
            studentName: student?.name || 'Học sinh',
            classId: student?.classId || '',
            status,
            score,
            feedback,
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        ];
      }
    });
    logActivity('score_entry', 'Đã chấm điểm bài tập', `Điểm: ${score} điểm`);
    addToast('Đã lưu điểm bài tập!', 'success');
  };

  const saveAssignmentSubmission = (data: {
    assignmentId: string;
    studentId: string;
    score: number;
    status?: 'submitted' | 'late';
    feedback?: string;
    submittedDate?: string;
  }) => {
    saveSubmissionGrade(
      data.assignmentId,
      data.studentId,
      data.score,
      data.status || 'submitted',
      data.feedback
    );
  };

  // CRUD Exams
  const addExam = (examData: Omit<Exam, 'id' | 'createdAt'>) => {
    const id = `ex-${Date.now().toString(36)}`;
    const newExam: Exam = {
      ...examData,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setExams(prev => [newExam, ...prev]);
    logActivity('exam_create', `Đã tạo đề kiểm tra mới [${newExam.code}]`, `${newExam.title} (${newExam.durationMinutes} phút)`);
    addToast(`Đã tạo đề kiểm tra "${newExam.title}"!`, 'success');
  };

  const updateExam = (id: string, examData: Partial<Exam>) => {
    setExams(prev =>
      prev.map(e => (e.id === id ? { ...e, ...examData } : e))
    );
    addToast('Đã cập nhật thông tin đề kiểm tra!', 'success');
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    setExamScores(prev => prev.filter(sc => sc.examId !== id));
    addToast('Đã xóa đề kiểm tra!', 'info');
  };

  const saveExamScore = (data: {
    examId: string;
    studentId: string;
    studentName?: string;
    classId?: string;
    className?: string;
    grade?: GradeLevel;
    score: number;
    teacherFeedback?: string;
    notes?: string;
    gradedDate?: string;
  }) => {
    setExamScores(prev => {
      const filtered = prev.filter(sc => !(sc.examId === data.examId && sc.studentId === data.studentId));
      const newScore: ExamScore = {
        id: `sc-${data.examId}-${data.studentId}`,
        examId: data.examId,
        studentId: data.studentId,
        studentName: data.studentName,
        classId: data.classId,
        className: data.className,
        grade: data.grade,
        score: data.score,
        notes: data.notes || data.teacherFeedback,
        teacherFeedback: data.teacherFeedback,
        gradedAt: data.gradedDate || new Date().toISOString().split('T')[0],
        gradedDate: data.gradedDate || new Date().toISOString().split('T')[0]
      };
      return [...filtered, newScore];
    });
  };

  const saveExamScores = (
    examId: string,
    newScores: { studentId: string; studentName: string; classId: string; score: number; notes?: string }[]
  ) => {
    setExamScores(prev => {
      const filtered = prev.filter(sc => sc.examId !== examId);
      const gradedScores: ExamScore[] = newScores.map(sc => ({
        id: `sc-${examId}-${sc.studentId}`,
        examId,
        studentId: sc.studentId,
        studentName: sc.studentName,
        classId: sc.classId,
        score: sc.score,
        notes: sc.notes,
        gradedAt: new Date().toISOString().split('T')[0]
      }));
      return [...filtered, ...gradedScores];
    });

    // Mark exam status as completed
    setExams(prev =>
      prev.map(e => (e.id === examId ? { ...e, status: 'completed' } : e))
    );

    const exam = exams.find(e => e.id === examId);
    logActivity('score_entry', `Đã nhập điểm đề [${exam?.code || 'KT'}]`, `Đã lưu bảng điểm cho ${newScores.length} học sinh`);
    addToast(`Đã lưu bảng điểm cho ${newScores.length} học sinh!`, 'success');
  };

  // Settings & Profile
  const updateTeacherProfile = (profile: Partial<TeacherProfile>) => {
    setTeacherProfile(prev => ({ ...prev, ...profile }));
    addToast('Đã cập nhật thông tin giáo viên!', 'success');
  };

  const resetToDemoData = () => {
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setExams(INITIAL_EXAMS);
    setExamScores(INITIAL_EXAM_SCORES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setTeacherProfile(INITIAL_TEACHER_PROFILE);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    addToast('Đã khôi phục dữ liệu mẫu ban đầu!', 'success');
  };

  const resetToMockData = () => {
    resetToDemoData();
  };

  const clearAllData = () => {
    setClasses([]);
    setStudents([]);
    setAssignments([]);
    setSubmissions([]);
    setExams([]);
    setExamScores([]);
    setActivityLogs([]);
    setNotifications([]);
    localStorage.clear();
    addToast('Đã xóa toàn bộ dữ liệu hệ thống!', 'info');
  };

  const exportBackupData = () => {
    const backup = {
      classes,
      students,
      assignments,
      submissions,
      exams,
      examScores,
      activityLogs,
      teacherProfile,
      version: '1.0',
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `physics_teacher_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Đã xuất bản sao lưu dữ liệu JSON thành công!', 'success');
  };

  const importBackupData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data.classes) && Array.isArray(data.students)) {
        if (data.classes) setClasses(data.classes);
        if (data.students) setStudents(data.students);
        if (data.assignments) setAssignments(data.assignments);
        if (data.submissions) setSubmissions(data.submissions);
        if (data.exams) setExams(data.exams);
        if (data.examScores) setExamScores(data.examScores);
        if (data.teacherProfile) setTeacherProfile(data.teacherProfile);
        addToast('Đã nhập dữ liệu sao lưu thành công!', 'success');
        return true;
      }
      throw new Error('Định dạng dữ liệu không hợp lệ');
    } catch (e) {
      addToast('Tệp sao lưu không đúng cấu trúc!', 'error');
      return false;
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('Đã đánh dấu tất cả thông báo là đã đọc', 'info');
  };

  // Aggregated Stats
  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const totalStudents = students.length;
    const totalAssignments = assignments.length;
    const totalExams = exams.length;

    // Average calculation
    const allScores: number[] = [
      ...examScores.map(s => s.score),
      ...submissions.filter(s => s.score !== undefined).map(s => s.score as number)
    ];
    const overallAverageScore =
      allScores.length > 0
        ? Math.round((allScores.reduce((acc, s) => acc + s, 0) / allScores.length) * 10) / 10
        : 7.5;

    // By Grade
    const getGradeStats = (grade: GradeLevel) => {
      const gradeClasses = classes.filter(c => c.grade === grade);
      const gradeStudents = students.filter(s => s.grade === grade);
      const studentIds = new Set(gradeStudents.map(s => s.id));
      const gradeScores = [
        ...examScores.filter(s => studentIds.has(s.studentId)).map(s => s.score),
        ...submissions.filter(s => studentIds.has(s.studentId) && s.score !== undefined).map(s => s.score as number)
      ];
      const avgScore =
        gradeScores.length > 0
          ? Math.round((gradeScores.reduce((acc, s) => acc + s, 0) / gradeScores.length) * 10) / 10
          : 7.5;
      return {
        classCount: gradeClasses.length,
        studentCount: gradeStudents.length,
        avgScore
      };
    };

    const grade10 = getGradeStats(10);
    const grade11 = getGradeStats(11);
    const grade12 = getGradeStats(12);

    // Performance distribution (Xuất sắc >= 8.5, Tốt 7.0-8.4, Đạt 5.0-6.9, Chưa đạt < 5.0)
    // Based on individual student overall averages
    const studentAvgs = students.map(student => {
      const stdScores = [
        ...examScores.filter(sc => sc.studentId === student.id).map(sc => sc.score),
        ...submissions.filter(sub => sub.studentId === student.id && sub.score !== undefined).map(sub => sub.score as number)
      ];
      return stdScores.length > 0
        ? stdScores.reduce((a, b) => a + b, 0) / stdScores.length
        : 7.5;
    });

    let xsatCount = 0;
    let totCount = 0;
    let datCount = 0;
    let chuaDatCount = 0;

    studentAvgs.forEach(score => {
      if (score >= 8.5) xsatCount++;
      else if (score >= 7.0) totCount++;
      else if (score >= 5.0) datCount++;
      else chuaDatCount++;
    });

    const totalGradedStudents = studentAvgs.length || 1;
    const performanceDistribution = [
      { name: 'Xuất sắc (≥8.5)', value: Math.round((xsatCount / totalGradedStudents) * 100), count: xsatCount, color: '#10b981' },
      { name: 'Tốt (7.0 - 8.4)', value: Math.round((totCount / totalGradedStudents) * 100), count: totCount, color: '#3b82f6' },
      { name: 'Đạt (5.0 - 6.9)', value: Math.round((datCount / totalGradedStudents) * 100), count: datCount, color: '#f59e0b' },
      { name: 'Chưa đạt (<5.0)', value: Math.round((chuaDatCount / totalGradedStudents) * 100), count: chuaDatCount, color: '#ef4444' }
    ];

    // Class average scores for Bar Chart
    const classAverageScores = classes.map(cls => {
      const clsStudentIds = new Set(students.filter(s => s.classId === cls.id).map(s => s.id));
      const clsScores = [
        ...examScores.filter(sc => clsStudentIds.has(sc.studentId)).map(sc => sc.score),
        ...submissions.filter(sub => clsStudentIds.has(sub.studentId) && sub.score !== undefined).map(sub => sub.score as number)
      ];
      const avg =
        clsScores.length > 0
          ? Math.round((clsScores.reduce((a, b) => a + b, 0) / clsScores.length) * 10) / 10
          : 7.2;
      return {
        className: cls.name,
        grade: cls.grade,
        avgScore: avg,
        studentCount: clsStudentIds.size
      };
    });

    return {
      totalClasses,
      totalStudents,
      totalAssignments,
      totalExams,
      overallAverageScore,
      grade10,
      grade11,
      grade12,
      performanceDistribution,
      classAverageScores
    };
  }, [classes, students, assignments, exams, examScores, submissions]);

  // Helper function for individual student stats
  const getStudentStats = (studentId: string) => {
    const studentExamScores = examScores.filter(sc => sc.studentId === studentId);
    const studentSubmissions = submissions.filter(sub => sub.studentId === studentId);

    const scoresList: number[] = [
      ...studentExamScores.map(s => s.score),
      ...studentSubmissions.filter(s => s.score !== undefined).map(s => s.score as number)
    ];

    const avgScore =
      scoresList.length > 0
        ? Math.round((scoresList.reduce((a, b) => a + b, 0) / scoresList.length) * 10) / 10
        : 0;

    const completedAssignments = studentSubmissions.filter(s => s.status === 'submitted' || s.status === 'late').length;
    const pendingAssignments = studentSubmissions.filter(s => s.status === 'not_submitted').length;

    // Score history array
    const history: { date: string; title: string; type: 'assignment' | 'exam'; score: number }[] = [];

    studentSubmissions.forEach(sub => {
      if (sub.score !== undefined) {
        const asg = assignments.find(a => a.id === sub.assignmentId);
        history.push({
          date: sub.submittedAt?.split(' ')[0] || asg?.assignedDate || '2026-08-25',
          title: asg?.title || 'Bài tập Vật lý',
          type: 'assignment',
          score: sub.score
        });
      }
    });

    studentExamScores.forEach(sc => {
      const ex = exams.find(e => e.id === sc.examId);
      history.push({
        date: sc.gradedAt || ex?.examDate || '2026-08-26',
        title: ex?.title || 'Kiểm tra Vật lý',
        type: 'exam',
        score: sc.score
      });
    });

    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      avgScore,
      overallAverage: avgScore.toFixed(1),
      examCount: studentExamScores.length,
      examsTaken: studentExamScores.length,
      assignmentCount: studentSubmissions.length,
      assignmentsDone: completedAssignments,
      completedAssignments,
      pendingAssignments,
      examScores: studentExamScores,
      assignmentSubmissions: studentSubmissions,
      scoreHistory: history
    };
  };

  // Helper for Class details
  const getClassDetails = (classId: string) => {
    const classInfo = classes.find(c => c.id === classId);
    const classStudents = students.filter(s => s.classId === classId);
    const classAssignments = assignments.filter(a => a.classIds.includes(classId));
    const classExams = exams.filter(e => e.classIds.includes(classId));

    const clsStudentIds = new Set(classStudents.map(s => s.id));
    const clsScores = [
      ...examScores.filter(sc => clsStudentIds.has(sc.studentId)).map(sc => sc.score),
      ...submissions.filter(sub => clsStudentIds.has(sub.studentId) && sub.score !== undefined).map(sub => sub.score as number)
    ];
    const avgScore =
      clsScores.length > 0
        ? Math.round((clsScores.reduce((a, b) => a + b, 0) / clsScores.length) * 10) / 10
        : 7.0;

    return {
      classInfo,
      students: classStudents,
      assignments: classAssignments,
      exams: classExams,
      avgScore
    };
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        classes,
        students,
        assignments,
        submissions,
        exams,
        examScores,
        activityLogs,
        teacherProfile,
        notifications,

        selectedClassId,
        setSelectedClassId,
        selectedStudentId,
        setSelectedStudentId,
        selectedAssignmentId,
        setSelectedAssignmentId,
        selectedExamId,
        setSelectedExamId,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,

        toasts,
        addToast,
        removeToast,
        confirmDialogState,
        showConfirmDialog,
        closeConfirmDialog,

        addClass,
        updateClass,
        deleteClass,

        addStudent,
        updateStudent,
        deleteStudent,

        addAssignment,
        updateAssignment,
        deleteAssignment,
        saveSubmissionGrade,

        addExam,
        updateExam,
        deleteExam,
        saveExamScores,

        updateTeacherProfile,
        resetToDemoData,
        clearAllData,
        exportBackupData,
        importBackupData,

        markNotificationAsRead,
        markAllNotificationsAsRead,

        stats,
        getStudentStats,
        getClassDetails
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
