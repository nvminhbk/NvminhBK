export type GradeLevel = 10 | 11 | 12;

export interface ClassInfo {
  id: string;
  name: string; // e.g., '10A1', '11A2', '12A1'
  grade: GradeLevel;
  academicYear: string; // e.g., '2026–2027'
  studentCount: number;
  teacher: string;
  room: string;
  notes?: string;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Student {
  id: string;
  code: string; // e.g., 'HS10-001'
  name: string;
  dob: string; // YYYY-MM-DD
  gender: 'male' | 'female';
  classId: string;
  className: string;
  grade: GradeLevel;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  address: string;
  notes?: string;
  avatar?: string;
  createdAt: string;
}

export interface PhysicsTopic {
  id: string;
  grade: GradeLevel;
  chapter: string;
  name: string;
  description?: string;
}

export interface Assignment {
  id: string;
  title: string;
  grade: GradeLevel;
  classIds: string[]; // Classes assigned to
  targetClassIds?: string[];
  chapter: string;
  topic: string;
  content?: string;
  description?: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  numQuestions: number;
  maxScore: number;
  attachmentName?: string;
  status: 'draft' | 'published' | 'closed' | 'active';
  submissions?: AssignmentSubmission[];
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  classId: string;
  status: 'submitted' | 'late' | 'not_submitted';
  score?: number;
  submittedAt?: string;
  feedback?: string;
}

export type ExamType = 
  | '15_min'
  | '45_min'
  | 'regular'
  | 'midterm'
  | 'mid_term'
  | 'final'
  | 'mock_exam'
  | 'review';

export type QuestionLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export interface ExamQuestion {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  level: QuestionLevel;
  topic: string;
  explanation?: string;
}

export interface Exam {
  id: string;
  code: string; // e.g., 'KT10-01'
  title: string;
  grade: GradeLevel;
  classIds?: string[];
  targetClassIds?: string[];
  type: ExamType;
  topic: string;
  durationMinutes: number;
  examDate: string; // YYYY-MM-DD
  numQuestions?: number;
  totalQuestions?: number;
  maxScore?: number;
  semester?: 'HK1' | 'HK2' | 'both';
  notes?: string;
  description?: string;
  questions?: ExamQuestion[];
  status?: 'draft' | 'scheduled' | 'completed';
  fileAttachment?: string;
  solutionAttachment?: string;
  createdAt?: string;
}

export interface ExamScore {
  id: string;
  examId: string;
  studentId: string;
  studentName?: string;
  classId?: string;
  className?: string;
  grade?: GradeLevel;
  score: number;
  notes?: string;
  teacherFeedback?: string;
  gradedAt?: string;
  gradedDate?: string;
}


export interface ActivityLog {
  id: string;
  type: 'student_add' | 'assignment_create' | 'score_entry' | 'exam_create' | 'class_update';
  title: string;
  description: string;
  timestamp: string;
}

export interface TeacherProfile {
  name: string;
  email: string;
  subject: string;
  school: string;
  academicYear: string;
  phone?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'warning' | 'info' | 'success';
  linkTab?: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'assignments'
  | 'exams'
  | 'results'
  | 'settings';
