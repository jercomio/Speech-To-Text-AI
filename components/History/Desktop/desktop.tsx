import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Recordings, RecordingsToStore } from '../../TransriptionForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { cn } from '@/lib/utils';
import { History } from 'lucide-react';

type Props = {
    recordings: RecordingsToStore[]
}

const HistoryDesktop: React.FC<Props> = ({recordings}) => {
    // console.log(recordings)
    return (
        <div className=''>
            <Dialog>
                <DialogTrigger className={cn('text-xs text-zinc-300 border border-zinc-500/30 hover:border-zinc-500 bg-zinc-950 rounded-lg p-2 cursor-default')}>
                    <History className='size-4' />
                </DialogTrigger>
                <DialogContent className='bg-black w-full border border-zinc-500'>
                    <DialogHeader>
                    <DialogTitle className='text-zinc-300'>History of audio recordings</DialogTitle>
                    <DialogDescription className='text-zinc-500'>
                        List of audio recordings made with OpenAI Whisper Recognize API.
                    </DialogDescription>
                    </DialogHeader>
                        <div className='text-gray-500 w-full'>
                            <Table className='text-xs'>
                                <TableCaption className='text-xs'>Recordings list</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead className="w-[100px]">Transcription</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        recordings.map((recording, idx) => {
                                            const formattedDate = new Date(recording.date!).toLocaleString('en-EN')
                            
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-medium w-1/2">{recording.transcription}</TableCell>
                                                    <TableCell className="text-right w-1/2">{formattedDate}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </div>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default HistoryDesktop;