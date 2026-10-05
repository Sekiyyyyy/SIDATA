export type Role = 'admin' | 'operator' | 'wali_kelas';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  teacher_id?: number;
  teacher_nip?: string;
}

export interface SchoolProfile {
  id: number;
  name: string;
  npsn: string;
  address: string;
  district: string;
  regency: string;
  province: string;
  postal_code: string;
  phone?: string;
  email?: string;
  website?: string;
  principal_name: string;
  principal_nip: string;
  logo_url?: string;
}

export interface AcademicYear {
  id: number;
  name: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface Semester {
  id: number;
  academic_year_id: number;
  type: 'Ganjil' | 'Genap';
  is_active: boolean;
  academic_year?: AcademicYear;
}

export interface Teacher {
  id: number;
  user_id?: number;
  nip: string;
  name: string;
  gender: string;
  phone?: string;
  email?: string;
  specialty?: string;
  is_active: boolean;
}

export interface SchoolClass {
  id: number;
  academic_year_id: number;
  name: string;
  grade_level: 'X' | 'XI' | 'XII';
  major: string;
  current_wali_kelas_id?: number;
  is_active: boolean;
  wali_kelas?: Teacher;
  academic_year?: AcademicYear;
  students_count?: number;
}

export interface StudentParent {
  id: number;
  student_id: number;
  father_name?: string;
  father_nik?: string;
  father_education?: string;
  father_job?: string;
  father_income?: string;
  father_phone?: string;
  mother_name?: string;
  mother_nik?: string;
  mother_education?: string;
  mother_job?: string;
  mother_income?: string;
  mother_phone?: string;
  parent_address?: string;
}

export interface EducationHistory {
  id: number;
  student_id: number;
  previous_school_type: string;
  school_name: string;
  graduation_year: string;
  certificate_number?: string;
}

export interface HealthRecord {
  id: number;
  student_id: number;
  academic_year_id: number;
  semester_id: number;
  height: number;
  weight: number;
  head_circumference?: number;
  medical_history?: string;
  special_condition?: string;
  physical_disability?: string;
  notes?: string;
  academic_year?: AcademicYear;
  semester?: Semester;
}

export interface StudentClassHistory {
  id: number;
  student_id: number;
  academic_year_id: number;
  semester_id: number;
  class_id: number;
  wali_kelas_id?: number;
  status: 'Active' | 'Completed' | 'Promoted' | 'Retained' | 'Graduated' | 'Transferred' | 'Dropped';
  promotion_status?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  academic_year?: AcademicYear;
  semester?: Semester;
  school_class?: SchoolClass;
  wali_kelas?: Teacher;
}

export interface Subject {
  id: number;
  code?: string;
  name: string;
  category: 'Umum' | 'Kejuruan' | 'Muatan Lokal' | 'Pilihan';
  grade_level: string;
  default_kktp: number;
  order_num: number;
}

export interface StudentSubjectScore {
  id: number;
  student_id: number;
  subject_id: number;
  academic_year_id: number;
  semester_id: number;
  class_id: number;
  score: number;
  kktp: number;
  competency_achievement?: string;
  subject?: Subject;
  academic_year?: AcademicYear;
  semester?: Semester;
}

export interface Attendance {
  id: number;
  student_id: number;
  academic_year_id: number;
  semester_id: number;
  class_id: number;
  sick_days: number;
  permitted_days: number;
  unexcused_days: number;
  notes?: string;
  academic_year?: AcademicYear;
  semester?: Semester;
}

export interface Achievement {
  id: number;
  student_id: number;
  type: string;
  level: string;
  title: string;
  year: string;
  organizer?: string;
  rank?: string;
  notes?: string;
}

export interface Extracurricular {
  id: number;
  name: string;
  coach_name?: string;
  description?: string;
}

export interface StudentExtracurricular {
  id: number;
  student_id: number;
  extracurricular_id: number;
  academic_year_id: number;
  semester_id: number;
  grade: string;
  notes?: string;
  extracurricular?: Extracurricular;
}

export interface P5Project {
  id: number;
  title: string;
  description?: string;
}

export interface P5Assessment {
  id: number;
  p5_project_id: number;
  student_id: number;
  dimension: string;
  element?: string;
  sub_element?: string;
  target_achievement: 'Mulai Berkembang' | 'Sedang Berkembang' | 'Berkembang Sesuai Harapan' | 'Sangat Berkembang';
  notes?: string;
  project?: P5Project;
}

export interface Mutation {
  id: number;
  student_id: number;
  date: string;
  mutation_type: string;
  from_to: string;
  reason?: string;
  notes?: string;
}

export interface Graduation {
  id: number;
  student_id: number;
  graduation_year: string;
  certificate_number?: string;
  graduation_date?: string;
}

export interface Student {
  id: number;
  nomor_urut?: string;
  nis: string;
  nisn: string;
  nik?: string;
  name: string;
  nickname?: string;
  gender: 'Laki-laki' | 'Perempuan';
  birth_place: string;
  birth_date: string;
  religion: string;
  citizenship: string;
  child_order?: string;
  siblings_count: number;
  daily_language: string;
  blood_type?: string;
  address: string;
  village?: string;
  district?: string;
  regency?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  residence_type?: string;
  distance_to_school?: string;
  status: 'Aktif' | 'Lulus' | 'Pindah' | 'Keluar' | 'Tidak Aktif';
  photo_url?: string;
  current_class_id?: number;
  current_class?: SchoolClass;
  parents?: StudentParent;
  guardian?: any;
  education_history?: EducationHistory;
  health_records?: HealthRecord[];
  class_histories?: StudentClassHistory[];
  subject_scores?: StudentSubjectScore[];
  attendances?: Attendance[];
  achievements?: Achievement[];
  student_extracurriculars?: StudentExtracurricular[];
  p5_assessments?: P5Assessment[];
  mutations?: Mutation[];
  graduation?: Graduation;
  data_completion_percentage?: number;
  missing_fields?: string[];
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_name?: string;
  role?: string;
  action: string;
  model_type?: string;
  record_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface SharedProps {
  auth: {
    user: User | null;
  };
  school?: SchoolProfile;
  activeAcademicYear?: AcademicYear;
  activeSemester?: Semester;
  flash?: {
    success?: string;
    error?: string;
  };
}
