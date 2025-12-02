import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calculator, Trash2, RotateCcw, Download, History, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Subject, GPAHistoryItem } from '@/types';
import { GRADE_POINTS } from '@/lib/constants';
import { calculateGPA } from '@/lib/calculations';

import DataImporter from '@/components/importer/DataImporter';

const GPACalculator = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 1, name: '', credit: 0, grade: '' },
        { id: 2, name: '', credit: 0, grade: '' },
        { id: 3, name: '', credit: 0, grade: '' }
    ]);
    const [history, setHistory] = useState<GPAHistoryItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const savedSubjects = localStorage.getItem('gpa_subjects');
        if (savedSubjects) {
            try {
                setSubjects(JSON.parse(savedSubjects));
            } catch (e) {
                console.error("Failed to parse saved subjects", e);
            }
        }

        const savedHistory = localStorage.getItem('gpa_history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('gpa_subjects', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('gpa_history', JSON.stringify(history));
    }, [history]);

    const addSubject = () => {
        const newId = Math.max(...subjects.map(s => s.id), 0) + 1;
        setSubjects([...subjects, { id: newId, name: '', credit: 0, grade: '' }]);
    };

    const removeSubject = (id: number) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter(s => s.id !== id));
        }
    };

    const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
        setSubjects(subjects.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const resetCalculator = () => {
        setSubjects([
            { id: 1, name: '', credit: 0, grade: '' },
            { id: 2, name: '', credit: 0, grade: '' },
            { id: 3, name: '', credit: 0, grade: '' }
        ]);
    };

    const handleSaveToHistory = () => {
        const gpa = calculateGPA(subjects);
        if (gpa === '0.00') return;

        const newItem: GPAHistoryItem = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            gpa,
            totalCredits: subjects.reduce((acc, s) => acc + (s.grade ? s.credit : 0), 0),
            subjects: [...subjects]
        };

        setHistory([newItem, ...history]);
    };
    const deleteHistoryItem = (id: string) => {
        setHistory(history.filter(item => item.id !== id));
    };

    const handleDownload = async () => {
        // Save to history first
        handleSaveToHistory();

        // Wait for render
        setTimeout(async () => {
            const reportElement = document.getElementById('gpa-report-template');
            if (reportElement) {
                const canvas = await html2canvas(reportElement, {
                    scale: 2, // Higher quality
                    backgroundColor: '#ffffff'
                });
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `UniTrack_GPA_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
                link.href = url;
                link.click();
            }
        }, 100);
    };

    return (
        <div className="space-y-8">
            {/* Hidden Report Template for Image Generation */}
            <div id="gpa-report-template" className="fixed left-[-9999px] top-0 w-[600px] bg-white p-8 text-black">
                <div className="border-b-2 border-blue-600 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">UniTrack</h1>
                    <p className="text-gray-500">Academic Progress Report</p>
                </div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Subjects</p>
                        <p className="font-medium">{subjects.filter(s => s.grade).length}</p>
                    </div>
                </div>

                <table className="w-full mb-8 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-2 text-gray-600 font-semibold">Subject</th>
                            <th className="text-center py-2 text-gray-600 font-semibold">Credit</th>
                            <th className="text-center py-2 text-gray-600 font-semibold">Grade</th>
                            <th className="text-right py-2 text-gray-600 font-semibold">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.filter(s => s.grade).map((s, i) => (
                            <tr key={i} className="border-b border-gray-100">
                                <td className="py-3 text-gray-800">{s.name || `Subject ${i + 1}`}</td>
                                <td className="py-3 text-center text-gray-600">{s.credit}</td>
                                <td className="py-3 text-center font-medium text-blue-600">{s.grade}</td>
                                <td className="py-3 text-right text-gray-600">{GRADE_POINTS[s.grade] * s.credit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="bg-blue-50 p-6 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-blue-800 font-medium">Semester GPA</p>
                        <p className="text-sm text-blue-600">Total Credits: {subjects.reduce((acc, s) => acc + (s.grade ? s.credit : 0), 0)}</p>
                    </div>
                    <div className="text-4xl font-bold text-blue-600">
                        {calculateGPA(subjects)}
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    Generated by UniTrack - SRM Edition
                </div>
            </div>

            <Card ref={cardRef}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-600" />
                            GPA Calculator
                        </CardTitle>
                        <div className="flex gap-1 md:gap-2">
                            <DataImporter />
                            <Button variant="ghost" size="sm" onClick={resetCalculator} className="text-gray-500 hover:text-red-500 px-2 md:px-4">
                                <RotateCcw className="w-4 h-4 md:mr-1" />
                                <span className="hidden md:inline">Reset</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-green-600 hover:text-green-700 px-2 md:px-4">
                                <Download className="w-4 h-4 md:mr-1" />
                                <span className="hidden md:inline">Download</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {subjects.map((subject, index) => (
                            <div key={subject.id} className={`grid grid-cols-1 md:grid-cols-${subjects.some(s => s.name) ? '4' : '3'} gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50`}>
                                {subjects.some(s => s.name) && (
                                    <div>
                                        <Label htmlFor={`subject-${subject.id}`} className="text-sm font-medium">Subject {index + 1}</Label>
                                        <Input
                                            id={`subject-${subject.id}`}
                                            value={subject.name || ''}
                                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                                            placeholder="Subject Name"
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                                {!subjects.some(s => s.name) && (
                                    <div>
                                        <Label className="text-sm font-medium">Subject {index + 1}</Label>
                                        <div className="text-sm text-gray-500 mt-1">Subject {index + 1}</div>
                                    </div>
                                )}
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
                                            {Object.keys(GRADE_POINTS).map((grade) => (
                                                <SelectItem key={grade} value={grade}>{grade} ({GRADE_POINTS[grade]} points)</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeSubject(subject.id)}
                                        disabled={subjects.length === 1}
                                        className="w-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
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

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Your GPA</h3>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{calculateGPA(subjects)}</div>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            Based on {subjects.filter(s => s.credit > 0 && s.grade !== '').length} subjects
                        </p>
                    </div>
                </CardContent>
            </Card >

            {/* History Section */}
            {
                history.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <History className="w-5 h-5 text-gray-500" />
                                Saved Calculations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {history.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <div>
                                            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{item.gpa} GPA</div>
                                            <div className="text-sm text-gray-500">
                                                {item.date} • {item.totalCredits} Credits • {item.subjects.length} Subjects
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => deleteHistoryItem(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div >
    );
};

export default GPACalculator;
