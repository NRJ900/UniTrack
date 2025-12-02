import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calculator, Trash2, RotateCcw, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Subject } from '@/types';
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
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('gpa_subjects', JSON.stringify(subjects));
    }, [subjects]);

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

    const handleDownload = async () => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'gpa-report.png';
            link.href = url;
            link.click();
        }
    };

    return (
        <Card ref={cardRef}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-600" />
                        GPA Calculator
                    </CardTitle>
                    <div className="flex gap-2">
                        <DataImporter />
                        <Button variant="ghost" size="sm" onClick={resetCalculator} className="text-gray-500 hover:text-red-500">
                            <RotateCcw className="w-4 h-4 mr-1" /> Reset
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownload} className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4 mr-1" /> Save
                        </Button>
                    </div>
                </div>
                <CardDescription>
                    Calculate your Grade Point Average based on subjects and credits
                </CardDescription>
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
        </Card>
    );
};

export default GPACalculator;
