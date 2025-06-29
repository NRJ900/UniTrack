import React, { useState, useEffect } from 'react';
import { Plus, Calculator, GraduationCap, Calendar, Trash2, Sun, Moon, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Subject {
  id: number;
  credit: number;
  grade: string;
}

interface Semester {
  id: number;
  gpa: number;
}

const Index = () => {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // GPA Calculator State
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, credit: 0, grade: '' },
    { id: 2, credit: 0, grade: '' },
    { id: 3, credit: 0, grade: '' }
  ]);

  // CGPA Calculator State
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, gpa: 0 }
  ]);

  // Attendance Calculator State
  const [attendanceData, setAttendanceData] = useState({
    credit: '',
    hoursAttended: '',
    courseType: 'Theory'
  });

  const gradePoints: { [key: string]: number } = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'F': 0
  };

  // GPA Calculator Functions
  const addSubject = () => {
    const newId = Math.max(...subjects.map(s => s.id)) + 1;
    setSubjects([...subjects, { id: newId, credit: 0, grade: '' }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: number, field: string, value: string | number) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateGPA = () => {
    const validSubjects = subjects.filter(s => s.credit > 0 && s.grade !== '');
    if (validSubjects.length === 0) return 0;
    
    const totalPoints = validSubjects.reduce((sum, subject) => 
      sum + (gradePoints[subject.grade] * subject.credit), 0);
    const totalCredits = validSubjects.reduce((sum, subject) => sum + subject.credit, 0);
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  // CGPA Calculator Functions
  const addSemester = () => {
    const newId = Math.max(...semesters.map(s => s.id)) + 1;
    setSemesters([...semesters, { id: newId, gpa: 0 }]);
  };

  const removeSemester = (id: number) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: number, gpa: number) => {
    setSemesters(semesters.map(s => 
      s.id === id ? { ...s, gpa } : s
    ));
  };

  const calculateCGPA = () => {
    const validSemesters = semesters.filter(s => s.gpa > 0);
    if (validSemesters.length === 0) return 0;
    
    const totalGPA = validSemesters.reduce((sum, semester) => sum + semester.gpa, 0);
    return (totalGPA / validSemesters.length).toFixed(2);
  };

  // Attendance Calculator Functions
  const calculateAttendance = () => {
    const credit = parseInt(attendanceData.credit) || 0;
    const hoursAttended = parseInt(attendanceData.hoursAttended) || 0;
    const { courseType } = attendanceData;
    
    let totalHours = credit * 15;
    
    if (courseType === 'Practical' || courseType === 'Joint') {
      totalHours += 15;
    }
    
    const attendancePercentage = totalHours > 0 ? (hoursAttended / totalHours) * 100 : 0;
    const requiredHours = totalHours * 0.75;
    const allowableLeave = totalHours - requiredHours;
    
    return {
      percentage: attendancePercentage.toFixed(2),
      totalHours,
      allowableLeave: allowableLeave.toFixed(0),
      status: attendancePercentage >= 75 ? 'Good' : 'Low'
    };
  };

  const attendanceResult = calculateAttendance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 dark:from-blue-800 dark:to-orange-600 text-white py-8 relative">
        <div className="container mx-auto px-4">
          {/* Dark Mode Toggle */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-white/20"
            />
            <Moon className="w-4 h-4" />
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">UniTrack – SRM Edition</h1>
            <p className="text-xl opacity-90">Your Academic Progress Companion</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="gpa" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="gpa" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              GPA Calculator
            </TabsTrigger>
            <TabsTrigger value="cgpa" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              CGPA Calculator
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Attendance Calculator
            </TabsTrigger>
          </TabsList>

          {/* GPA Calculator */}
          <TabsContent value="gpa">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  GPA Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your Grade Point Average based on subjects and credits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {subjects.map((subject, index) => (
                    <div key={subject.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <Label className="text-sm font-medium">Subject {index + 1}</Label>
                        <div className="text-sm text-gray-500 mt-1">Subject {index + 1}</div>
                      </div>
                      <div>
                        <Label htmlFor={`credit-${subject.id}`} className="text-sm font-medium">Credit</Label>
                        <Input
                          id={`credit-${subject.id}`}
                          type="number"
                          min="1"
                          max="10"
                          value={subject.credit || ''}
                          onChange={(e) => updateSubject(subject.id, 'credit', parseInt(e.target.value) || 0)}
                          placeholder="Enter credits"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Grade</Label>
                        <Select value={subject.grade} onValueChange={(value) => updateSubject(subject.id, 'grade', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="O">O (10 points)</SelectItem>
                            <SelectItem value="A+">A+ (9 points)</SelectItem>
                            <SelectItem value="A">A (8 points)</SelectItem>
                            <SelectItem value="B+">B+ (7 points)</SelectItem>
                            <SelectItem value="B">B (6 points)</SelectItem>
                            <SelectItem value="C">C (5 points)</SelectItem>
                            <SelectItem value="F">F (0 points)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSubject(subject.id)}
                          disabled={subjects.length === 1}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={addSubject} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Subject
                </Button>

                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Your GPA</h3>
                  <div className="text-3xl font-bold text-blue-600">{calculateGPA()}</div>
                  <p className="text-sm text-blue-600 mt-1">
                    Based on {subjects.filter(s => s.credit > 0 && s.grade !== '').length} subjects
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CGPA Calculator */}
          <TabsContent value="cgpa">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  CGPA Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your Cumulative Grade Point Average across semesters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {semesters.map((semester, index) => (
                    <div key={semester.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <Label className="text-sm font-medium">Semester {index + 1}</Label>
                        <div className="text-sm text-gray-500 mt-1">Semester {index + 1}</div>
                      </div>
                      <div>
                        <Label htmlFor={`gpa-${semester.id}`} className="text-sm font-medium">GPA</Label>
                        <Input
                          id={`gpa-${semester.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={semester.gpa || ''}
                          onChange={(e) => updateSemester(semester.id, parseFloat(e.target.value) || 0)}
                          placeholder="Enter GPA"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSemester(semester.id)}
                          disabled={semesters.length === 1}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={addSemester} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Semester
                </Button>

                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Your CGPA</h3>
                  <div className="text-3xl font-bold text-green-600">{calculateCGPA()}</div>
                  <p className="text-sm text-green-600 mt-1">
                    Based on {semesters.filter(s => s.gpa > 0).length} semesters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Calculator */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Attendance Calculator
                </CardTitle>
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
                      onChange={(e) => setAttendanceData({...attendanceData, credit: e.target.value})}
                      placeholder="Enter credits"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hours" className="text-sm font-medium">Hours Attended</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      value={attendanceData.hoursAttended}
                      onChange={(e) => setAttendanceData({...attendanceData, hoursAttended: e.target.value})}
                      placeholder="Enter hours attended"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Course Type</Label>
                    <Select value={attendanceData.courseType} onValueChange={(value) => setAttendanceData({...attendanceData, courseType: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theory">Theory</SelectItem>
                        <SelectItem value="Practical">Practical</SelectItem>
                        <SelectItem value="Joint">Joint</SelectItem>
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">UniTrack – SRM Edition | Built for SRM Students</p>
          <p className="text-sm text-gray-400 mt-1">All calculations are performed client-side for privacy</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
