import React from 'react';
import StudentShow from './Show';
import { AcademicYear, SchoolClass, Semester, Student, Subject } from '@/Types';

interface Props {
  student: Student;
  classes?: SchoolClass[];
  subjects?: Subject[];
  activeYear?: AcademicYear | null;
  activeSem?: Semester | null;
}

export default function StudentEdit(props: Props) {
  return <StudentShow {...props} />;
}
