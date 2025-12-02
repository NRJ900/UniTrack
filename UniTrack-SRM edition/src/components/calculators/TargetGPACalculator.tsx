import React, { useState, useEffect } from 'react';
import { Target, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { calculateRequiredGPA } from '@/lib/calculations';

const TargetGPACalculator = () => {
    const [currentCGPA, setCurrentCGPA] = useState<string>('');
    const [completedCredits, setCompletedCredits] = useState<string>('');
    const [targetCGPA, setTargetCGPA] = useState<string>('');
    const [nextSemCredits, setNextSemCredits] = useState<string>('');
    const [requiredGPA, setRequiredGPA] = useState<string | null>(null);

    // Load from local storage
    useEffect(() => {
        const savedData = localStorage.getItem('target_gpa_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setCurrentCGPA(parsed.currentCGPA || '');
                setCompletedCredits(parsed.completedCredits || '');
                setTargetCGPA(parsed.targetCGPA || '');
                setNextSemCredits(parsed.nextSemCredits || '');
            } catch (e) {
                console.error("Failed to parse saved target gpa data", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('target_gpa_data', JSON.stringify({
            currentCGPA,
            completedCredits,
            targetCGPA,
            nextSemCredits
        }));
    }, [currentCGPA, completedCredits, targetCGPA, nextSemCredits]);

    const handleCalculate = () => {
        const result = calculateRequiredGPA(
            parseFloat(currentCGPA),
            parseFloat(completedCredits),
            parseFloat(targetCGPA),
            parseFloat(nextSemCredits)
        );
        setRequiredGPA(result);
    };

    const resetCalculator = () => {
        setCurrentCGPA('');
        setCompletedCredits('');
        setTargetCGPA('');
        setNextSemCredits('');
        setRequiredGPA(null);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Target GPA Calculator
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetCalculator} className="text-gray-500 hover:text-red-500">
                        <RotateCcw className="w-4 h-4 mr-1" /> Reset
                    </Button>
                </div>
                <CardDescription>
                    Calculate what GPA you need in the next semester to reach your target CGPA
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="current-cgpa" className="text-sm font-medium">Current CGPA</Label>
                        <Input
                            id="current-cgpa"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={currentCGPA}
                            onChange={(e) => setCurrentCGPA(e.target.value)}
                            placeholder="e.g. 8.5"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="completed-credits" className="text-sm font-medium">Completed Credits</Label>
                        <Input
                            id="completed-credits"
                            type="number"
                            min="0"
                            value={completedCredits}
                            onChange={(e) => setCompletedCredits(e.target.value)}
                            placeholder="e.g. 60"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="target-cgpa" className="text-sm font-medium">Target CGPA</Label>
                        <Input
                            id="target-cgpa"
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={targetCGPA}
                            onChange={(e) => setTargetCGPA(e.target.value)}
                            placeholder="e.g. 9.0"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="next-credits" className="text-sm font-medium">Next Semester Credits</Label>
                        <Input
                            id="next-credits"
                            type="number"
                            min="1"
                            value={nextSemCredits}
                            onChange={(e) => setNextSemCredits(e.target.value)}
                            placeholder="e.g. 20"
                            className="mt-1"
                        />
                    </div>
                </div>

                <Button onClick={handleCalculate} className="w-full bg-purple-600 hover:bg-purple-700">
                    Calculate Required GPA
                </Button>

                {requiredGPA !== null && (
                    <div className={`p-6 rounded-lg border-l-4 ${parseFloat(requiredGPA) <= 10 ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500' : 'bg-red-50 dark:bg-red-900/20 border-red-500'}`}>
                        <h3 className={`text-lg font-semibold mb-2 ${parseFloat(requiredGPA) <= 10 ? 'text-purple-800 dark:text-purple-300' : 'text-red-800 dark:text-red-300'}`}>
                            Required GPA
                        </h3>
                        <div className={`text-3xl font-bold ${parseFloat(requiredGPA) <= 10 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                            {requiredGPA}
                        </div>
                        <p className={`text-sm mt-1 ${parseFloat(requiredGPA) <= 10 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                            {parseFloat(requiredGPA) <= 10
                                ? 'You can achieve your target!'
                                : 'This target is mathematically impossible with the given credits.'}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TargetGPACalculator;
