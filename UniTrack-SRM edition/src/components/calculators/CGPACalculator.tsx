import React, { useState, useEffect, useRef } from 'react';
import { Plus, GraduationCap, Trash2, RotateCcw, Download, History, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Semester, CGPAHistoryItem } from '@/types';
import { calculateCGPA } from '@/lib/calculations';

const CGPACalculator = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [semesters, setSemesters] = useState<Semester[]>([
        { id: 1, gpa: 0 }
    ]);
    const [history, setHistory] = useState<CGPAHistoryItem[]>([]);

    // Load from local storage
    useEffect(() => {
        const savedSemesters = localStorage.getItem('cgpa_semesters');
        if (savedSemesters) {
            try {
                setSemesters(JSON.parse(savedSemesters));
            } catch (e) {
                console.error("Failed to parse saved semesters", e);
            }
        }

        const savedHistory = localStorage.getItem('cgpa_history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('cgpa_semesters', JSON.stringify(semesters));
    }, [semesters]);

    useEffect(() => {
        localStorage.setItem('cgpa_history', JSON.stringify(history));
    }, [history]);

    const addSemester = () => {
        const newId = Math.max(...semesters.map(s => s.id), 0) + 1;
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

    const resetCalculator = () => {
        setSemesters([{ id: 1, gpa: 0 }]);
    };

    const handleSaveToHistory = () => {
        const cgpa = calculateCGPA(semesters);
        if (cgpa === '0.00') return;

        const newItem: CGPAHistoryItem = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            cgpa,
            totalSemesters: semesters.filter(s => s.gpa > 0).length,
            semesters: [...semesters]
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
            const reportElement = document.getElementById('cgpa-report-template');
            if (reportElement) {
                const canvas = await html2canvas(reportElement, {
                    scale: 2, // Higher quality
                    backgroundColor: '#ffffff'
                });
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `UniTrack_CGPA_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
                link.href = url;
                link.click();
            }
        }, 100);
    };

    return (
        <div className="space-y-8">
            {/* Hidden Report Template for Image Generation */}
            <div id="cgpa-report-template" className="fixed left-[-9999px] top-0 w-[600px] bg-white p-8 text-black">
                <div className="border-b-2 border-green-600 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-green-600">UniTrack</h1>
                    <p className="text-gray-500">CGPA Progress Report</p>
                </div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Student Name</p>
                        <p className="font-medium text-lg">{localStorage.getItem('user_name') || 'Student'}</p>
                        <p className="text-sm text-gray-500 mt-2">Date</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Semesters</p>
                        <p className="font-medium">{semesters.filter(s => s.gpa > 0).length}</p>
                    </div>
                </div>

                <table className="w-full mb-8 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-2 text-gray-600 font-semibold">Semester</th>
                            <th className="text-right py-2 text-gray-600 font-semibold">GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semesters.filter(s => s.gpa > 0).map((s, i) => (
                            <tr key={i} className="border-b border-gray-100">
                                <td className="py-3 text-gray-800">Semester {i + 1}</td>
                                <td className="py-3 text-right font-medium text-green-600">{s.gpa.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="bg-green-50 p-6 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-green-800 font-medium">Cumulative GPA</p>
                        <p className="text-sm text-green-600">Across {semesters.filter(s => s.gpa > 0).length} Semesters</p>
                    </div>
                    <div className="text-4xl font-bold text-green-600">
                        {calculateCGPA(semesters)}
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
                            <GraduationCap className="w-5 h-5 text-green-600" />
                            CGPA Calculator
                        </CardTitle>
                        <div className="flex gap-1 md:gap-2">
                            <Button variant="ghost" size="sm" onClick={resetCalculator} className="text-gray-500 hover:text-red-500 px-2 md:px-4">
                                <RotateCcw className="w-4 h-4 md:mr-1" />
                                <span className="hidden md:inline">Reset</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-green-600 hover:text-green-700 px-2 md:px-4">
                                <Download className="w-4 h-4 md:mr-1" />
                                <span className="hidden md:inline">Save</span>
                            </Button>
                        </div>
                    </div>
                    <CardDescription>
                        Calculate your Cumulative Grade Point Average across semesters
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {semesters.map((semester, index) => (
                            <div key={semester.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
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
                                        className="w-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
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

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Your CGPA</h3>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{calculateCGPA(semesters)}</div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Based on {semesters.filter(s => s.gpa > 0).length} semesters
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* History Section */}
            {history.length > 0 && (
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
                                        <div className="font-bold text-lg text-green-600 dark:text-green-400">{item.cgpa} CGPA</div>
                                        <div className="text-sm text-gray-500">
                                            {item.date} • {item.totalSemesters} Semesters
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
            )}
        </div>
    );
};

export default CGPACalculator;
