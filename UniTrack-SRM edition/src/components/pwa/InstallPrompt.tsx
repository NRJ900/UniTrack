import React, { useEffect, useState } from 'react';
import { Download, Smartphone, MoreVertical, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if already installed/standalone
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsStandalone(isStandaloneMode);

        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Listen for install prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            setIsOpen(true); // Open manual instructions
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    // Don't show if already installed
    if (isStandalone) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button
                onClick={handleInstall}
                variant="outline"
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
            </Button>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Install UniTrack</DialogTitle>
                    <DialogDescription>
                        Install this app on your home screen for quick access and offline use.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {isIOS ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <Share className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm">1. Tap the <strong>Share</strong> button in your browser bar.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <Smartphone className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm">2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <MoreVertical className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm">1. Tap the <strong>three dots</strong> menu in your browser.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <Smartphone className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm">2. Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                    Note: If you don't see the option, try opening this page in Chrome.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InstallPrompt;
