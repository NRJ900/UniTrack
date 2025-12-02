import React, { useState, useEffect, useRef } from 'react';
import { Plus, GraduationCap, Trash2, RotateCcw, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Semester } from '@/types';
import { calculateCGPA } from '@/lib/calculations';

const CGPACalculator = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [semesters, setSemesters] = useState<Semester[]>([
        { id: 1, gpa: 0 }
    ]);

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
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('cgpa_semesters', JSON.stringify(semesters));
    }, [semesters]);

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

    const handleDownload = async () => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'cgpa-report.png';
            link.href = url;
            link.click();
        }
    };

    return (
        <Card ref={cardRef}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                        CGPA Calculator
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={resetCalculator} className="text-gray-500 hover:text-red-500">
                            <RotateCcw className="w-4 h-4 mr-1" /> Reset
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownload} className="text-green-600 hover:text-green-700">
                            <Download className="w-4 h-4 mr-1" /> Save
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
    );
};

export default CGPACalculator;
