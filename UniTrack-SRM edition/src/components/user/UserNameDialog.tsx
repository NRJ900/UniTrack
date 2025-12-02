import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from 'lucide-react';

const UserNameDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        // Check if running in standalone mode (PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // Check if name is already saved
        const savedName = localStorage.getItem('user_name');

        if (isStandalone && !savedName) {
            // Add a small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSave = () => {
        if (name.trim()) {
            localStorage.setItem('user_name', name.trim());
            setIsOpen(false);
            // Reload to update components that might need the name immediately, 
            // though for reports reading from localStorage is fine.
            // window.location.reload(); 
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Welcome to UniTrack!
                    </DialogTitle>
                    <DialogDescription>
                        Since you've installed the app, let's personalize your experience.
                        Enter your name to have it appear on your GPA reports.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={!name.trim()}>
                        Save Name
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserNameDialog;
