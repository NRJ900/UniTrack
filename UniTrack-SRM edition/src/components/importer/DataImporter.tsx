import React, { useState, useEffect } from 'react';
import { Upload, Check, AlertCircle, Info, Copy, Terminal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const DataImporter = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [scriptContent, setScriptContent] = useState('Loading script...');

    // Fetch the script content from the public folder
    useEffect(() => {
        fetch('/import-script.js')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load script');
                return response.text();
            })
            .then(text => setScriptContent(text))
            .catch(err => {
                console.error(err);
                setScriptContent('// Error: Could not load import-script.js. Please ensure the file exists in the public folder.');
            });
    }, []);

    const handleCopyScript = () => {
        navigator.clipboard.writeText(scriptContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(jsonInput);

            let imported = false;

            // Validate and save subjects for GPA
            if (data.subjects && Array.isArray(data.subjects)) {
                // Ensure each subject has at least id, credit, grade
                const validSubjects = data.subjects.filter((s: any) => s.id && s.credit && s.grade);
                if (validSubjects.length > 0) {
                    localStorage.setItem('gpa_subjects', JSON.stringify(validSubjects));
                    imported = true;
                }
            }

            // Validate and save semesters for CGPA
            if (data.semesters && Array.isArray(data.semesters)) {
                localStorage.setItem('cgpa_semesters', JSON.stringify(data.semesters));
                imported = true;
            }

            if (imported) {
                setSuccess(true);
                setError('');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setError('No valid data found in JSON. Expected "subjects" or "semesters" array.');
            }
        } catch (e) {
            setError('Invalid JSON format. Please copy the data correctly.');
            setSuccess(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 relative">
                                <Upload className="w-4 h-4" />
                                Import Data
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
                                    Beta
                                </Badge>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This feature is currently in Beta. Please report any issues.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        Import from SRM Portal
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 text-[10px] px-1.5 py-0 h-5">Beta</Badge>
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Follow these steps to import your grades automatically.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-2">
                    {/* Step 1: Copy Script */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs shrink-0">1</span>
                                Copy Extraction Script
                            </h4>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 ml-auto" onClick={handleCopyScript}>
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </Button>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gray-900 rounded-md opacity-5 group-hover:opacity-10 transition-opacity" />
                            <pre className="p-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[10px] font-mono overflow-x-auto max-h-[100px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
                                {scriptContent}
                            </pre>
                        </div>
                        <p className="text-[10px] text-gray-500">
                            Run this in the <strong>Console</strong> (F12) of your SRM Portal page.
                        </p>
                    </div>

                    {/* Step 2: Paste Data */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs shrink-0">2</span>
                            Paste Result Here
                        </h4>
                        <Textarea
                            placeholder='Paste the JSON output here...'
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="h-[100px] font-mono text-xs resize-none"
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-xs font-bold">Error</AlertTitle>
                            <AlertDescription className="text-xs">{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 py-2">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertTitle className="text-xs font-bold">Success</AlertTitle>
                            <AlertDescription className="text-xs">Data imported! Reloading...</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button onClick={handleImport} disabled={!jsonInput || success} className="w-full sm:w-auto">
                        Import Data
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DataImporter;
