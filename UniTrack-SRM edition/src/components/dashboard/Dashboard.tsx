import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Calendar, Award } from 'lucide-react';
import { calculateGPA, calculateCGPA, calculateAttendance } from '@/lib/calculations';
import { Subject, Semester, AttendanceData } from '@/types';

const Dashboard = () => {
    const [gpa, setGpa] = useState<string>('0.00');
    const [cgpa, setCgpa] = useState<string>('0.00');
    const [attendance, setAttendance] = useState<string>('0%');
    const [totalCredits, setTotalCredits] = useState<number>(0);

    useEffect(() => {
        // Load GPA Data
        const savedSubjects = localStorage.getItem('gpa_subjects');
        if (savedSubjects) {
            try {
                const subjects: Subject[] = JSON.parse(savedSubjects);
                setGpa(calculateGPA(subjects));
            } catch (e) {
                console.error("Failed to parse GPA data");
            }
        }

        // Load CGPA Data
        const savedSemesters = localStorage.getItem('cgpa_semesters');
        if (savedSemesters) {
            try {
                const semesters: Semester[] = JSON.parse(savedSemesters);
                setCgpa(calculateCGPA(semesters));

                // Calculate total credits from semesters if available, otherwise 0
                // Note: The current Semester type might not have credits explicitly summed up globally, 
                // but we can try to sum them if they were part of the data. 
                // Actually, let's just count completed semesters for now or sum credits if we had them.
                // For now, let's just show the number of semesters tracked.
            } catch (e) {
                console.error("Failed to parse CGPA data");
            }
        }

        // Load Attendance Data
        const savedAttendance = localStorage.getItem('attendance_data');
        if (savedAttendance) {
            try {
                const data: AttendanceData = JSON.parse(savedAttendance);
                const result = calculateAttendance(data);
                setAttendance(`${result.percentage}%`);
            } catch (e) {
                console.error("Failed to parse Attendance data");
            }
        }
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CGPA Card - Main Highlight */}
                <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-none shadow-lg md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" /> Overall CGPA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold">{cgpa}</div>
                        <p className="text-sm opacity-80 mt-2">Cumulative Grade Point Average</p>
                    </CardContent>
                </Card>

                {/* Current GPA */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" /> Current GPA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{gpa}</div>
                        <p className="text-xs text-gray-500 mt-1">Latest Semester Performance</p>
                    </CardContent>
                </Card>

                {/* Attendance */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-500" /> Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{attendance}</div>
                        <p className="text-xs text-gray-500 mt-1">Current Subject Status</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4" /> Academic Tip
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                    {parseFloat(cgpa) >= 9.0
                        ? "You're doing excellent! Keep maintaining this momentum for a distinction."
                        : parseFloat(cgpa) >= 8.0
                            ? "Great job! A little push in the next semester could get you to the 9.0 club."
                            : "Consistency is key. Focus on your internal marks to boost your overall grade."}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
