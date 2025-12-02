import React, { useState, useEffect } from 'react';
import { Calculator, GraduationCap, Calendar, Sun, Moon, Target, TrendingUp, Home, LayoutDashboard, Github } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from 'react-helmet-async';
import GPACalculator from '@/components/calculators/GPACalculator';
import CGPACalculator from '@/components/calculators/CGPACalculator';
import AttendanceCalculator from '@/components/calculators/AttendanceCalculator';
import TargetGPACalculator from '@/components/calculators/TargetGPACalculator';
import ProgressChart from '@/components/analytics/ProgressChart';

import Dashboard from '@/components/dashboard/Dashboard';

import InstallPrompt from '@/components/pwa/InstallPrompt';

const Index = () => {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Disable zoom in standalone mode (PWA)
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>UniTrack - SRM Edition | GPA, CGPA & Attendance Calculator</title>
        <meta name="description" content="Calculate your GPA, CGPA, and Attendance easily with UniTrack - SRM Edition. The best academic companion for SRM students." />
        <meta name="keywords" content="SRM, GPA Calculator, CGPA Calculator, Attendance Calculator, UniTrack" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 dark:from-blue-800 dark:to-orange-600 text-white py-8 relative">
        <div className="container mx-auto px-4">
          {/* Dark Mode Toggle & Install Button */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <InstallPrompt />
            <Sun className="w-4 h-4" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-white/20"
            />
            <Moon className="w-4 h-4" />
          </div>

          <div className="text-center pt-12 md:pt-0">
            <h1 className="text-4xl font-bold mb-2">UniTrack – SRM Edition</h1>
            <p className="text-xl opacity-90 mb-4">Your Academic Progress Companion</p>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Desktop Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-6 mb-8 h-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="gpa" className="flex items-center gap-2 py-3">
              <Calculator className="w-4 h-4" />
              <span className="hidden md:inline">GPA Calculator</span>
              <span className="md:hidden">GPA</span>
            </TabsTrigger>
            <TabsTrigger value="cgpa" className="flex items-center gap-2 py-3">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden md:inline">CGPA Calculator</span>
              <span className="md:hidden">CGPA</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2 py-3">
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Attendance Calculator</span>
              <span className="md:hidden">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="target" className="flex items-center gap-2 py-3">
              <Target className="w-4 h-4" />
              <span className="hidden md:inline">Target GPA</span>
              <span className="md:hidden">Target</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">Progress</span>
              <span className="md:hidden">Trends</span>
            </TabsTrigger>
          </TabsList>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
            <TabsList className="flex w-full justify-between bg-transparent h-16 px-2">
              <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
                <Home className="w-5 h-5" />
                <span className="text-[10px]">Home</span>
              </TabsTrigger>
              <TabsTrigger value="gpa" className="flex flex-col items-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
                <Calculator className="w-5 h-5" />
                <span className="text-[10px]">GPA</span>
              </TabsTrigger>
              <TabsTrigger value="cgpa" className="flex flex-col items-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px]">CGPA</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex flex-col items-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
                <Calendar className="w-5 h-5" />
                <span className="text-[10px]">Attend</span>
              </TabsTrigger>
              <TabsTrigger value="target" className="flex flex-col items-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
                <Target className="w-5 h-5" />
                <span className="text-[10px]">Target</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex flex-col items-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px]">Trends</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Content */}
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          {/* GPA Calculator */}
          <TabsContent value="gpa">
            <GPACalculator />
          </TabsContent>

          {/* CGPA Calculator */}
          <TabsContent value="cgpa">
            <CGPACalculator />
          </TabsContent>

          {/* Attendance Calculator */}
          <TabsContent value="attendance">
            <AttendanceCalculator />
          </TabsContent>

          {/* Target GPA Calculator */}
          <TabsContent value="target">
            <TargetGPACalculator />
          </TabsContent>

          {/* Progress Chart */}
          <TabsContent value="progress">
            <ProgressChart />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-6 pb-24 md:pb-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">UniTrack – SRM Edition | Built for SRM Students</p>
          <p className="text-sm text-gray-400 mt-1">All calculations are performed client-side for privacy</p>
          <a
            href="https://github.com/NRJ900/UniTrack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
