export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateTimeString: string): string {
  if (!dateTimeString) return '-';
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateTimeString;
  }
}

export function formatScore(score: number | undefined | null): string {
  if (score === undefined || score === null || isNaN(score)) return '-';
  return (Math.round(score * 10) / 10).toFixed(1);
}

export type PerformanceTier = 'Xuất sắc' | 'Tốt' | 'Đạt' | 'Chưa đạt';

export function getPerformanceTier(score: number): PerformanceTier {
  if (score >= 8.5) return 'Xuất sắc';
  if (score >= 7.0) return 'Tốt';
  if (score >= 5.0) return 'Đạt';
  return 'Chưa đạt';
}

export function getPerformanceBadgeColor(tier: PerformanceTier): {
  bg: string;
  text: string;
  border: string;
} {
  switch (tier) {
    case 'Xuất sắc':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Tốt':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Đạt':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'Chưa đạt':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  }
}

export function getExamTypeLabel(type: string): string {
  switch (type) {
    case '15_min':
      return 'Kiểm tra 15 phút';
    case '45_min':
      return 'Kiểm tra 45 phút';
    case 'regular':
      return 'Kiểm tra thường xuyên';
    case 'mid_term':
      return 'Kiểm tra giữa kỳ';
    case 'final':
      return 'Kiểm tra cuối kỳ';
    case 'mock_exam':
      return 'Thi thử';
    case 'review':
      return 'Đề ôn tập';
    default:
      return type;
  }
}

export function getQuestionLevelLabel(level: string): { label: string; color: string } {
  switch (level) {
    case 'nhan_biet':
      return { label: 'Nhận biết', color: 'bg-sky-100 text-sky-800' };
    case 'thong_hieu':
      return { label: 'Thông hiểu', color: 'bg-emerald-100 text-emerald-800' };
    case 'van_dung':
      return { label: 'Vận dụng', color: 'bg-amber-100 text-amber-800' };
    case 'van_dung_cao':
      return { label: 'Vận dụng cao', color: 'bg-rose-100 text-rose-800' };
    default:
      return { label: level, color: 'bg-slate-100 text-slate-800' };
  }
}

export function calculateMedian(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
