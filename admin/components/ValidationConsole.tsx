'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, CheckCircle, XCircle, 
  ScanLine, Loader2, ShieldCheck, 
  Camera, X, Terminal, Copy, Activity
} from 'lucide-react';
import { cn } from '../utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent } from './ui/dialog';
import { Html5Qrcode } from "https://esm.sh/html5-qrcode";
import { ticketsApi } from '../services/tickets/tickets.api';

interface ValidationConsoleProps {
  isDarkMode: boolean;
  onValidated?: () => void;
  totalCount?: number;
  countLabel?: string;
  className?: string;
}

const ValidationConsole: React.FC<ValidationConsoleProps> = ({ 
  isDarkMode, 
  onValidated, 
  totalCount, 
  countLabel = "Registry Nodes",
  className
}) => {
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error' | 'info', message: string, ticket?: any } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = "qr-reader-region-shared";

  const handleValidate = async (codeOverride?: string) => {
    const codeToUse = (codeOverride || scanCode).trim();
    if (!codeToUse) return;
    
    setIsProcessing(true);
    setScanResult(null);

    try {
        const res = (await ticketsApi.validate(codeToUse)).data;
        
        let detailedTicket = null;
        if (res.ticketId) {
            try {
                detailedTicket = await ticketsApi.getById(res.ticketId);
            } catch (e) {
                console.warn("Could not fetch details for validated ticket", e);
            }
        }

        setScanResult({ 
            status: 'success', 
            message: res.message || 'Ticket verified successfully', 
            ticket: detailedTicket ? {
                id: detailedTicket.id,
                eventName: detailedTicket.event?.title || 'Event Access',
                status: detailedTicket.status,
                holderName: detailedTicket.user?.email || detailedTicket.userId || 'Guest',
                date: detailedTicket.event?.date ? new Date(detailedTicket.event.date).toLocaleDateString() : 'N/A',
            } : {
                id: res.ticketId || 'N/A',
                eventName: 'Platform Access',
                status: res.status || 'CONFIRMED',
                holderName: res.userId || 'User Node'
            }
        });
        
        if (onValidated) onValidated();
    } catch (error: any) {
        const msg = error.response?.data?.message || 'Invalid token or server error.';
        const status = error.response?.data?.status;
        
        setScanResult({ 
            status: 'error', 
            message: msg,
            ticket: status === 'USED' ? { status: 'USED' } : undefined
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const startScanner = () => setIsScannerOpen(true);
  const stopScanner = async () => {
    if (scannerRef.current) {
        try {
            await scannerRef.current.stop();
            scannerRef.current = null;
            // Remove the video element that html5-qrcode leaves behind to avoid ID conflicts
            const container = document.getElementById(scannerRegionId);
            if (container) container.innerHTML = '';
        } catch (e) {
            console.error("Scanner Stop Error", e);
        }
    }
    setIsScannerOpen(false);
  };

  useEffect(() => {
    if (isScannerOpen) {
        const initScanner = async () => {
            try {
                const scanner = new Html5Qrcode(scannerRegionId);
                scannerRef.current = scanner;
                
                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    (decodedText) => {
                        setScanCode(decodedText);
                        stopScanner();
                        handleValidate(decodedText);
                    },
                    () => {}
                );
            } catch (err) {
                console.error("Camera Init Error", err);
                setIsScannerOpen(false);
            }
        };
        
        const timeout = setTimeout(initScanner, 300);
        return () => {
            clearTimeout(timeout);
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }
  }, [isScannerOpen]);

  return (
    <div className={cn("space-y-6", className)}>
        <Card className="border-none shadow-2xl bg-white dark:bg-zinc-900 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-gray-50/50 dark:bg-zinc-950/50 border-b border-gray-100 dark:border-zinc-800 p-8">
                <CardTitle className="flex items-center gap-2 font-black text-xl">
                    <ScanLine className="text-blue-500" /> Validation Console
                </CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-gray-400">Entry Authentication Node</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-6">
                    <div className="relative group">
                        <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                        <Input 
                            placeholder="Enter Access Token..." 
                            className="pl-12 pr-24 text-lg font-mono tracking-wider h-16 rounded-2xl bg-gray-50 dark:bg-zinc-950 border-2 border-transparent focus:border-blue-500/50 transition-all shadow-inner" 
                            value={scanCode} 
                            onChange={(e) => setScanCode(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleValidate()} 
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {scanCode && (
                                <button 
                                    onClick={() => setScanCode('')}
                                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    title="Clear Input"
                                >
                                    <X size={20} />
                                </button>
                            )}
                            <button 
                                onClick={startScanner}
                                className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                title="Open Camera Scanner"
                            >
                                <Camera size={24} />
                            </button>
                        </div>
                    </div>
                    <Button className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white" size="lg" onClick={() => handleValidate()} disabled={isProcessing || !scanCode}>
                        {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />} Validate Entry
                    </Button>
                </div>
                {scanResult && (
                    <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className={cn(
                            "p-6 rounded-[2rem] border-2 flex flex-col gap-4",
                            scanResult.status === 'success' ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/20" :
                            scanResult.status === 'info' ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/20" :
                            "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/20"
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {scanResult.status === 'success' ? <CheckCircle size={20} className="text-emerald-500"/> : <XCircle size={20} className="text-red-500"/>}
                                    <h4 className="text-sm font-black uppercase">{scanResult.status}</h4>
                                </div>
                                <button onClick={() => setScanResult(null)} className="p-1 hover:bg-black/5 rounded-full transition-colors"><X size={16}/></button>
                            </div>
                            <div className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                                {scanResult.message}
                            </div>
                            {scanResult.ticket && scanResult.ticket.id && (
                                <div className="space-y-2 text-[10px] pt-2 border-t border-gray-100 dark:border-zinc-800">
                                    <div className="flex justify-between pb-1"><span>Holder:</span><span className="font-bold">{scanResult.ticket.holderName}</span></div>
                                    <div className="flex justify-between pb-1"><span>Event:</span><span className="font-bold truncate max-w-[150px]">{scanResult.ticket.eventName}</span></div>
                                    <div className="flex justify-between pb-1"><span>Status:</span><span className="font-black text-blue-500 uppercase">{scanResult.ticket.status}</span></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {totalCount !== undefined && (
            <div className="grid grid-cols-1 gap-4">
                <Card className="p-6 rounded-[2rem] bg-emerald-50/30 dark:bg-emerald-900/10 border-none">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg"><Activity size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{countLabel}</p>
                            <p className="text-xl font-black">{totalCount} Entries</p>
                        </div>
                    </div>
                </Card>
            </div>
        )}

        <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black rounded-[2.5rem] border-none" onClose={stopScanner}>
                <div className="relative aspect-square w-full">
                    <div id={scannerRegionId} className="w-full h-full"></div>
                    
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-blue-500 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_blue] animate-[scan_2s_linear_infinite]" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={stopScanner}
                        className="absolute top-6 right-6 p-2 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="absolute bottom-10 left-0 w-full text-center">
                        <p className="text-white text-xs font-black uppercase tracking-widest bg-black/40 inline-block px-4 py-2 rounded-full backdrop-blur-md">
                            Align QR code within the frame
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scan {
                0% { top: 0; }
                50% { top: 100%; }
                100% { top: 0; }
            }
            #${scannerRegionId} video {
                object-fit: cover !important;
            }
        `}} />
    </div>
  );
};

export default ValidationConsole;
