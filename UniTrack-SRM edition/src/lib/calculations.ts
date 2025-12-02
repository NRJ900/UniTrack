import { Subject, Semester, AttendanceData, AttendanceResult } from '@/types';
import { GRADE_POINTS, COURSE_TYPES } from '@/lib/constants';

export const calculateGPA = (subjects: Subject[]): string => {
    const validSubjects = subjects.filter(s => s.credit > 0 && s.grade !== '');
    if (validSubjects.length === 0) return '0.00';

    const totalPoints = validSubjects.reduce((sum, subject) =>
        sum + (GRADE_POINTS[subject.grade] * subject.credit), 0);
    const totalCredits = validSubjects.reduce((sum, subject) => sum + subject.credit, 0);

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0';
};

export const calculateCGPA = (semesters: Semester[]): string => {
    const validSemesters = semesters.filter(s => s.gpa > 0);
    if (validSemesters.length === 0) return '0.00';

    const totalGPA = validSemesters.reduce((sum, semester) => sum + semester.gpa, 0);
    return (totalGPA / validSemesters.length).toFixed(2);
};

export const calculateAttendance = (data: AttendanceData): AttendanceResult => {
    const credit = parseInt(data.credit) || 0;
    const hoursAttended = parseInt(data.hoursAttended) || 0;
    const { courseType } = data;

    let totalHours = credit * 15;

    if (courseType === COURSE_TYPES.PRACTICAL || courseType === COURSE_TYPES.JOINT) {
        totalHours += 15;
    }

    const attendancePercentage = totalHours > 0 ? (hoursAttended / totalHours) * 100 : 0;
    const requiredHours = totalHours * 0.75;
    const allowableLeave = totalHours - requiredHours;
    const status = attendancePercentage >= 75 ? 'Good' : 'Low';

    // Calculate hours needed for 75%
    // Formula: (Attended + x) / (Total + x) >= 0.75
    // Attended + x >= 0.75*Total + 0.75x
    // 0.25x >= 0.75*Total - Attended
    // x >= (0.75*Total - Attended) / 0.25
    // x >= 3*Total - 4*Attended

    let hoursNeeded = 0;
    if (status === 'Low') {
        hoursNeeded = Math.ceil((0.75 * totalHours - hoursAttended) / 0.25);
        if (hoursNeeded < 0) hoursNeeded = 0;
    }

    return {
        percentage: attendancePercentage.toFixed(2),
        totalHours,
        allowableLeave: allowableLeave.toFixed(0),
        status,
        hoursNeeded
    };
};

export const calculateRequiredGPA = (
    currentCGPA: number,
    completedCredits: number,
    targetCGPA: number,
    nextSemCredits: number
): string | null => {
    if (isNaN(currentCGPA) || isNaN(completedCredits) || isNaN(targetCGPA) || isNaN(nextSemCredits) || nextSemCredits === 0) {
        return null;
    }

    // Formula: (Target * (Total Credits) - Current * Completed) / Next Credits
    // Total Credits = Completed + Next
    const totalCredits = completedCredits + nextSemCredits;
    const requiredPoints = (targetCGPA * totalCredits) - (currentCGPA * completedCredits);
    const reqGPA = requiredPoints / nextSemCredits;

    return reqGPA.toFixed(2);
};
