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
