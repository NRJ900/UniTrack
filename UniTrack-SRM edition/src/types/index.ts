export interface Subject {
    id: number;
    name?: string;
    code?: string;
    credit: number;
    grade: string;
}

export interface Semester {
    id: number;
    gpa: number;
}

export interface AttendanceData {
    credit: string;
    hoursAttended: string;
    courseType: 'Theory' | 'Practical' | 'Joint';
}

export interface AttendanceResult {
    percentage: string;
    totalHours: number;
    allowableLeave: string;
    status: 'Good' | 'Low';
    hoursNeeded?: number;
}

export interface GPAHistoryItem {
    id: string;
    date: string;
    gpa: string;
    totalCredits: number;
    subjects: Subject[];
}

export interface CGPAHistoryItem {
    id: string;
    date: string;
    cgpa: string;
    totalSemesters: number;
    semesters: Semester[];
}
