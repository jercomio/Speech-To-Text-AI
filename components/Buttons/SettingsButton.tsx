'use client'
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from 'usehooks-ts';
import { Recordings } from '../TransriptionForm';


const SettingsButton = () => {
    const [HistoryBackup, setHistoryBackup, removeHistoryBackup] = useLocalStorage<Recordings[]>('history', [])

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className={cn('text-xs text-zinc-300 border border-zinc-500/30 hover:border-zinc-500 bg-zinc-950 rounded-lg p-2 cursor-default')}>
                    <Settings className='size-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-black w-full border border-zinc-500'>
                    <DropdownMenuLabel className='text-zinc-300 text-xs'>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => removeHistoryBackup()} className='text-zinc-300 text-xs'>
                        <History className='size-3 mr-2' />
                        Clear history
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default SettingsButton;