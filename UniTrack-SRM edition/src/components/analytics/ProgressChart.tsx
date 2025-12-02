import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Semester } from '@/types';

const ProgressChart = () => {
    const [data, setData] = useState<Semester[]>([]);

    const loadData = () => {
        const savedSemesters = localStorage.getItem('cgpa_semesters');
        if (savedSemesters) {
            try {
                const parsed = JSON.parse(savedSemesters);
                // Filter out semesters with 0 GPA for cleaner chart
                const validData = parsed.filter((s: Semester) => s.gpa > 0);
                setData(validData);
            } catch (e) {
                console.error("Failed to parse saved semesters", e);
            }
        }
    };

    useEffect(() => {
        loadData();
        // Add event listener for storage updates to sync across tabs/components
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        GPA Progress
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={loadData} className="text-gray-500">
                        <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                    </Button>
                </div>
                <CardDescription>
                    Visualize your academic performance over time
                </CardDescription>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis
                                    dataKey="id"
                                    label={{ value: 'Semester', position: 'insideBottom', offset: -5 }}
                                    tickFormatter={(value) => `Sem ${value}`}
                                />
                                <YAxis
                                    domain={[0, 10]}
                                    label={{ value: 'GPA', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    labelFormatter={(label) => `Semester ${label}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="gpa"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: "#2563eb" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                        <p>Add semester GPA data in the CGPA Calculator to see your progress</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ProgressChart;
