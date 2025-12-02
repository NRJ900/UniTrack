import { describe, it, expect } from 'vitest';
import { calculateGPA, calculateCGPA, calculateAttendance, calculateRequiredGPA } from './calculations';
import { Subject, Semester, AttendanceData } from '@/types';
import { COURSE_TYPES } from './constants';

describe('Calculations', () => {
    describe('calculateGPA', () => {
        it('should calculate GPA correctly for valid inputs', () => {
            const subjects: Subject[] = [
                { id: 1, credit: 4, grade: 'O' }, // 10 points
                { id: 2, credit: 3, grade: 'A+' }, // 9 points
            ];
            // Total points: (4*10) + (3*9) = 40 + 27 = 67
            // Total credits: 4 + 3 = 7
            // GPA: 67 / 7 = 9.5714... -> 9.57
            expect(calculateGPA(subjects)).toBe('9.57');
        });

        it('should return 0.00 if no subjects have credits or grades', () => {
            const subjects: Subject[] = [
                { id: 1, credit: 0, grade: '' },
            ];
            expect(calculateGPA(subjects)).toBe('0.00');
        });

        it('should ignore subjects with 0 credit or empty grade', () => {
            const subjects: Subject[] = [
                { id: 1, credit: 4, grade: 'O' },
                { id: 2, credit: 0, grade: 'A' },
                { id: 3, credit: 3, grade: '' },
            ];
            expect(calculateGPA(subjects)).toBe('10.00');
        });
    });

    describe('calculateCGPA', () => {
        it('should calculate CGPA correctly', () => {
            const semesters: Semester[] = [
                { id: 1, gpa: 9.0 },
                { id: 2, gpa: 8.0 },
            ];
            // (9 + 8) / 2 = 8.5
            expect(calculateCGPA(semesters)).toBe('8.50');
        });

        it('should return 0.00 if no semesters have GPA', () => {
            const semesters: Semester[] = [
                { id: 1, gpa: 0 },
            ];
            expect(calculateCGPA(semesters)).toBe('0.00');
        });
    });

    describe('calculateAttendance', () => {
        it('should calculate attendance percentage correctly', () => {
            const data: AttendanceData = {
                credit: '4',
                hoursAttended: '40',
                courseType: COURSE_TYPES.THEORY,
            };
            // For Theory 4 credits: Total hours = 4 * 15 = 60
            // Percentage: (40 / 60) * 100 = 66.67
            const result = calculateAttendance(data);
            expect(result.percentage).toBe('66.67');
            expect(result.totalHours).toBe(60);
        });

        it('should calculate allowable leave correctly', () => {
            const data: AttendanceData = {
                credit: '4',
                hoursAttended: '60', // 100% attendance
                courseType: COURSE_TYPES.THEORY,
            };
            // Total 60. 75% is 45.
            // Allowable leave = 60 - 45 = 15.
            const result = calculateAttendance(data);
            expect(result.allowableLeave).toBe('15');
        });

        it('should handle Practical courses correctly', () => {
            const data: AttendanceData = {
                credit: '2',
                hoursAttended: '20',
                courseType: COURSE_TYPES.PRACTICAL,
            };
            // Practical 2 credits: Total hours = (2 * 15) + 15 = 45
            // Percentage: (20 / 45) * 100 = 44.44
            const result = calculateAttendance(data);
            expect(result.percentage).toBe('44.44');
            expect(result.totalHours).toBe(45);
        });
    });

    describe('calculateRequiredGPA', () => {
        it('should calculate required GPA correctly', () => {
            // Current CGPA: 8.0, Completed Credits: 100
            // Target CGPA: 8.2
            // Next Sem Credits: 20
            // Total Credits = 120
            // Target Points = 8.2 * 120 = 984
            // Current Points = 8.0 * 100 = 800
            // Required Points = 984 - 800 = 184
            // Required GPA = 184 / 20 = 9.2
            expect(calculateRequiredGPA(8.0, 100, 8.2, 20)).toBe('9.20');
        });

        it('should return null if inputs are invalid', () => {
            expect(calculateRequiredGPA(NaN, 100, 8.2, 20)).toBeNull();
        });
    });
});
