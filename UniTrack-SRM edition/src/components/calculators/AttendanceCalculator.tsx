import React, { useState, useEffect } from 'react';
import { Calendar, Info, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AttendanceData } from '@/types';
import { COURSE_TYPES } from '@/lib/constants';
import { calculateAttendance } from '@/lib/calculations';

const AttendanceCalculator = () => {
    const [attendanceData, setAttendanceData] = useState<AttendanceData>({
        credit: '',
        hoursAttended: '',
        courseType: 'Theory'
    });

    // Load from local storage
    useEffect(() => {
        const savedData = localStorage.getItem('attendance_data');
        if (savedData) {
            try {
                setAttendanceData(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse saved attendance data", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('attendance_data', JSON.stringify(attendanceData));
    }, [attendanceData]);

    const resetCalculator = () => {
        setAttendanceData({
            credit: '',
            hoursAttended: '',
            courseType: 'Theory'
        });
    };

    const attendanceResult = calculateAttendance(attendanceData);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        Attendance Calculator
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetCalculator} className="text-gray-500 hover:text-red-500">
                        <RotateCcw className="w-4 h-4 mr-1" /> Reset
                    </Button>
                </div>
                <CardDescription>
                    Calculate your attendance percentage and allowable leaves
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> Attendance for joint and practical courses may vary, so it shouldn't be assumed as consistent.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="credit" className="text-sm font-medium">Credit (1-5)</Label>
                        <Input
                            id="credit"
                            type="number"
                            min="1"
                            max="5"
                            value={attendanceData.credit}
                            onChange={(e) => setAttendanceData({ ...attendanceData, credit: e.target.value })}
                            placeholder="Enter credits"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="hours" className="text-sm font-medium">Hours Attended</Label>
                        <div className="flex gap-2 mt-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    const current = parseInt(attendanceData.hoursAttended) || 0;
                                    if (current > 0) {
                                        setAttendanceData({ ...attendanceData, hoursAttended: (current - 1).toString() });
                                    }
                                }}
                                className="h-10 w-10 shrink-0"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                id="hours"
                                type="number"
                                min="0"
                                value={attendanceData.hoursAttended}
                                onChange={(e) => setAttendanceData({ ...attendanceData, hoursAttended: e.target.value })}
                                placeholder="Hours"
                                className="text-center"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    const current = parseInt(attendanceData.hoursAttended) || 0;
                                    setAttendanceData({ ...attendanceData, hoursAttended: (current + 1).toString() });
                                }}
                                className="h-10 w-10 shrink-0"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Course Type</Label>
                        <Select
                            value={attendanceData.courseType}
                            onValueChange={(value: any) => setAttendanceData({ ...attendanceData, courseType: value })}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={COURSE_TYPES.THEORY}>Theory</SelectItem>
                                <SelectItem value={COURSE_TYPES.PRACTICAL}>Practical</SelectItem>
                                <SelectItem value={COURSE_TYPES.JOINT}>Joint</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg border-l-4 ${attendanceResult.status === 'Good' ? 'bg-green-50 dark:bg-green-900/30 border-green-500' : 'bg-red-50 dark:bg-red-900/30 border-red-500'}`}>
                        <h3 className={`text-lg font-semibold mb-2 ${attendanceResult.status === 'Good' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            Attendance Status
                        </h3>
                        <div className={`text-3xl font-bold ${attendanceResult.status === 'Good' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {attendanceResult.percentage}%
                        </div>
                        <p className={`text-sm mt-1 ${attendanceResult.status === 'Good' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {attendanceResult.status === 'Good' ? 'Good Standing' : 'Above 75% Required'}
                        </p>
                        {attendanceResult.status === 'Low' && attendanceResult.hoursNeeded && attendanceResult.hoursNeeded > 0 && (
                            <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/50 rounded text-xs font-medium text-red-800 dark:text-red-200">
                                You need to attend <strong>{attendanceResult.hoursNeeded}</strong> more hours to reach 75%.
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">Course Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-blue-600 dark:text-blue-400">Total Hours:</span>
                                <span className="font-semibold text-blue-800 dark:text-blue-200">{attendanceResult.totalHours}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-600 dark:text-blue-400">Hours Attended:</span>
                                <span className="font-semibold text-blue-800 dark:text-blue-200">{attendanceData.hoursAttended || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-600 dark:text-blue-400">Max Leave Hours:</span>
                                <span className="font-semibold text-blue-800 dark:text-blue-200">{attendanceResult.allowableLeave}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AttendanceCalculator;
