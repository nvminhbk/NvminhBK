import { PhysicsTopic, GradeLevel } from '../types';

export const PHYSICS_TOPICS: PhysicsTopic[] = [
  // KHỐI 10
  {
    id: 'top-10-01',
    grade: 10,
    chapter: 'Chương 1: Mở đầu & Động học',
    name: 'Mô tả chuyển động & Vận tốc',
    description: 'Độ dịch chuyển, quãng đường, vận tốc trung bình, đồ thị độ dịch chuyển - thời gian.'
  },
  {
    id: 'top-10-02',
    grade: 10,
    chapter: 'Chương 1: Mở đầu & Động học',
    name: 'Chuyển động thẳng biến đổi đều',
    description: 'Gia tốc, các phương trình chuyển động thẳng biến đổi đều, đồ thị vận tốc.'
  },
  {
    id: 'top-10-03',
    grade: 10,
    chapter: 'Chương 1: Mở đầu & Động học',
    name: 'Sự rơi tự do & Chuyển động ném',
    description: 'Gia tốc trọng trường, công thức rơi tự do, chuyển động ném ngang và ném xiên.'
  },
  {
    id: 'top-10-04',
    grade: 10,
    chapter: 'Chương 2: Động lực học',
    name: 'Các định luật Newton về chuyển động',
    description: 'Định luật I, II, III Newton, khối lượng, quán tính và các ứng dụng.'
  },
  {
    id: 'top-10-05',
    grade: 10,
    chapter: 'Chương 2: Động lực học',
    name: 'Một số lực trong thực tiễn',
    description: 'Trọng lực, lực ma sát (trượt, lăn, nghỉ), lực căng dây, lực đẩy Archimedes.'
  },
  {
    id: 'top-10-06',
    grade: 10,
    chapter: 'Chương 3: Công, Năng lượng & Công suất',
    name: 'Công cơ học và Công suất',
    description: 'Định nghĩa công, công phát động, công cản, công suất và hiệu suất.'
  },
  {
    id: 'top-10-07',
    grade: 10,
    chapter: 'Chương 3: Công, Năng lượng & Công suất',
    name: 'Động năng, Thế năng & Bảo toàn cơ năng',
    description: 'Định lý động năng, thế năng trọng trường, thế năng đàn hồi, định luật bảo toàn cơ năng.'
  },
  {
    id: 'top-10-08',
    grade: 10,
    chapter: 'Chương 4: Động lượng',
    name: 'Động lượng & Định luật bảo toàn động lượng',
    description: 'Xung lượng của lực, va chạm mềm, va chạm đàn hồi, chuyển động bằng phản lực.'
  },
  {
    id: 'top-10-09',
    grade: 10,
    chapter: 'Chương 5: Chuyển động tròn & Biến dạng',
    name: 'Chuyển động tròn đều & Gia tốc hướng tâm',
    description: 'Tốc độ góc, chu kì, tần số, lực hướng tâm.'
  },
  {
    id: 'top-10-10',
    grade: 10,
    chapter: 'Chương 5: Chuyển động tròn & Biến dạng',
    name: 'Biến dạng của vật rắn & Định luật Hooke',
    description: 'Biến dạng kéo, nén, ứng suất, độ giãn dài, hệ số đàn hồi.'
  },

  // KHỐI 11
  {
    id: 'top-11-01',
    grade: 11,
    chapter: 'Chương 1: Dao động',
    name: 'Dao động điều hòa',
    description: 'Phương trình dao động, li độ, vận tốc, gia tốc, pha ban đầu, đồ thị dao động.'
  },
  {
    id: 'top-11-02',
    grade: 11,
    chapter: 'Chương 1: Dao động',
    name: 'Con lắc lò xo và Con lắc đơn',
    description: 'Chu kì, tần số riêng, lực kéo về, năng lượng trong dao động điều hòa.'
  },
  {
    id: 'top-11-03',
    grade: 11,
    chapter: 'Chương 1: Dao động',
    name: 'Dao động tắt dần, Dao động cưỡng bức & Hiện tượng cộng hưởng',
    description: 'Ma sát cản trở dao động, cộng hưởng cơ học và các ứng dụng thực tế.'
  },
  {
    id: 'top-11-04',
    grade: 11,
    chapter: 'Chương 2: Sóng',
    name: 'Mô tả sóng & Phương trình sóng',
    description: 'Sóng ngang, sóng dọc, bước sóng, tốc độ truyền sóng, đồ thị sóng hình sin.'
  },
  {
    id: 'top-11-05',
    grade: 11,
    chapter: 'Chương 2: Sóng',
    name: 'Giao thoa sóng & Sóng dừng',
    description: 'Điều kiện giao thoa, cực đại cực tiểu giao thoa, nút sóng, bụng sóng.'
  },
  {
    id: 'top-11-06',
    grade: 11,
    chapter: 'Chương 2: Sóng',
    name: 'Sóng điện từ & Sóng âm',
    description: 'Đặc trưng vật lý và sinh lý của âm, thang sóng điện từ, truyền thông tin vô tuyến.'
  },
  {
    id: 'top-11-07',
    grade: 11,
    chapter: 'Chương 3: Điện trường',
    name: 'Điện tích & Định luật Coulomb',
    description: 'Lực tương tác tĩnh điện, hằng số điện môi, nguyên lý chồng chất điện trường.'
  },
  {
    id: 'top-11-08',
    grade: 11,
    chapter: 'Chương 3: Điện trường',
    name: 'Điện thế, Hiệu điện thế & Tụ điện',
    description: 'Công của lực điện trường, điện dung, năng lượng điện trường trong tụ điện.'
  },
  {
    id: 'top-11-09',
    grade: 11,
    chapter: 'Chương 4: Dòng điện không đổi & Từ trường',
    name: 'Định luật Ohm cho toàn mạch & Năng lượng điện',
    description: 'Suất điện động, điện trở trong, công và công suất nguồn điện, định luật Joule-Lenz.'
  },
  {
    id: 'top-11-10',
    grade: 11,
    chapter: 'Chương 4: Dòng điện không đổi & Từ trường',
    name: 'Từ trường, Cảm ứng từ & Cảm ứng điện từ',
    description: 'Lực từ tác dụng lên đoạn dây, lực Lorentz, từ thông, suất điện động cảm ứng, định luật Faraday.'
  },

  // KHỐI 12
  {
    id: 'top-12-01',
    grade: 12,
    chapter: 'Chương 1: Vật lý nhiệt',
    name: 'Nhiệt độ & Thang nhiệt độ',
    description: 'Khái niệm nhiệt độ, thang Kelvin, thang Celsius, sự nở vì nhiệt.'
  },
  {
    id: 'top-12-02',
    grade: 12,
    chapter: 'Chương 1: Vật lý nhiệt',
    name: 'Nhiệt dung riêng, Nhiệt nóng chảy & Nhiệt hóa hơi',
    description: 'Công thức tính nhiệt lượng trao đổi, phương trình cân bằng nhiệt.'
  },
  {
    id: 'top-12-03',
    grade: 12,
    chapter: 'Chương 2: Khí lý tưởng',
    name: 'Mô hình động học phân tử chất khí',
    description: 'Cấu tạo chất khí, chuyển động hỗn loạn Brown, áp suất chất khí lên thành bình.'
  },
  {
    id: 'top-12-04',
    grade: 12,
    chapter: 'Chương 2: Khí lý tưởng',
    name: 'Phương trình trạng thái khí lý tưởng',
    description: 'Định luật Boyle, Charles, phương trình Clapeyron - Mendeleev, đồ thị p-V, p-T.'
  },
  {
    id: 'top-12-05',
    grade: 12,
    chapter: 'Chương 3: Từ trường & Dòng điện xoay chiều',
    name: 'Đại cương về dòng điện xoay chiều',
    description: 'Điện áp xoay chiều, giá trị hiệu dụng, mạch RLC mắc nối tiếp, hệ số công suất cosφ.'
  },
  {
    id: 'top-12-06',
    grade: 12,
    chapter: 'Chương 4: Lượng tử ánh sáng',
    name: 'Hiện tượng quang điện & Thuyết lượng tử ánh sáng',
    description: 'Giới hạn quang điện, photon, phương trình Einstein, pin quang điện, quang trở.'
  },
  {
    id: 'top-12-07',
    grade: 12,
    chapter: 'Chương 4: Lượng tử ánh sáng',
    name: 'Mẫu nguyên tử Bohr & Quang phổ nguyên tử Hydro',
    description: 'Các tiên đề Bohr, mức năng lượng, quang phổ phát xạ và hấp thụ.'
  },
  {
    id: 'top-12-08',
    grade: 12,
    chapter: 'Chương 5: Vật lý hạt nhân',
    name: 'Cấu trúc hạt nhân & Năng lượng liên kết',
    description: 'Proton, neutron, đồng vị, độ hụt khối, năng lượng liên kết riêng.'
  },
  {
    id: 'top-12-09',
    grade: 12,
    chapter: 'Chương 5: Vật lý hạt nhân',
    name: 'Hiện tượng phóng xạ & Phản ứng hạt nhân',
    description: 'Phóng xạ alpha, beta, gamma, chu kì bán rã, phản ứng phân hạch, nhiệt hạch.'
  },
  {
    id: 'top-12-10',
    grade: 12,
    chapter: 'Chương 6: Ôn tập & Luyện đề THPT',
    name: 'Chuyên đề Tổng ôn kiến thức Vật lý THPT',
    description: 'Bộ câu hỏi tích hợp lý thuyết, bài tập vận dụng cao, bám sát đề thi tốt nghiệp THPT.'
  }
];

export interface CurriculumChapter {
  id: string;
  name: string;
  topics: string[];
}

export interface CurriculumGrade {
  grade: GradeLevel;
  chapters: CurriculumChapter[];
}

export const physicsCurriculum: CurriculumGrade[] = [
  {
    grade: 10,
    chapters: [
      {
        id: 'c10-1',
        name: 'Chương 1: Mở đầu & Động học',
        topics: ['Mô tả chuyển động', 'Chuyển động thẳng biến đổi đều', 'Sự rơi tự do & Chuyển động ném']
      },
      {
        id: 'c10-2',
        name: 'Chương 2: Động lực học',
        topics: ['Ba định luật Newton', 'Các lực cơ học trong thực tiễn', 'Cân bằng lực']
      },
      {
        id: 'c10-3',
        name: 'Chương 3: Năng lượng & Công',
        topics: ['Công và công suất', 'Động năng & Thế năng', 'Định luật bảo toàn cơ năng']
      },
      {
        id: 'c10-4',
        name: 'Chương 4: Động lượng',
        topics: ['Động lượng', 'Bảo toàn động lượng', 'Chuyển động phản lực & Va chạm']
      }
    ]
  },
  {
    grade: 11,
    chapters: [
      {
        id: 'c11-1',
        name: 'Chương 1: Dao động cơ',
        topics: ['Dao động điều hòa', 'Con lắc đơn & lò xo', 'Cộng hưởng & Tắt dần']
      },
      {
        id: 'c11-2',
        name: 'Chương 2: Sóng & Âm',
        topics: ['Mô tả sóng', 'Giao thoa sóng', 'Sóng dừng & Sóng âm']
      },
      {
        id: 'c11-3',
        name: 'Chương 3: Điện trường',
        topics: ['Định luật Coulomb', 'Điện thế & Hiệu điện thế', 'Tụ điện & Năng lượng điện']
      },
      {
        id: 'c11-4',
        name: 'Chương 4: Dòng điện & Từ trường',
        topics: ['Định luật Ohm toàn mạch', 'Cảm ứng từ', 'Hiện tượng cảm ứng điện từ']
      }
    ]
  },
  {
    grade: 12,
    chapters: [
      {
        id: 'c12-1',
        name: 'Chương 1: Vật lý nhiệt',
        topics: ['Mô hình phân tử', 'Nhiệt dung riêng & Cân bằng nhiệt', 'Chuyển thể']
      },
      {
        id: 'c12-2',
        name: 'Chương 2: Khí lý tưởng',
        topics: ['Phương trình trạng thái', 'Định luật Boyle - Charles', 'Áp suất khí']
      },
      {
        id: 'c12-3',
        name: 'Chương 3: Từ trường & Dòng xoay chiều',
        topics: ['Mạch RLC nối tiếp', 'Công suất & Hệ số cosφ', 'Máy phát & Truyền tải']
      },
      {
        id: 'c12-4',
        name: 'Chương 4: Lượng tử & Hạt nhân',
        topics: ['Hiện tượng quang điện', 'Mẫu Bohr', 'Phóng xạ & Năng lượng hạt nhân']
      }
    ]
  }
];

