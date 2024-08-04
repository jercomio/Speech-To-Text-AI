import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Recordings, RecordingsToStore } from '../../TransriptionForm';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../../ui/drawer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

type Props = {
    recordings: RecordingsToStore[]
}

const HistoryMobile: React.FC<Props> = ({recordings}) => {
    return (
        <div className=''>
            <Drawer>
                <DrawerTrigger className={cn('text-xs text-zinc-300 border border-zinc-500/30 hover:border-zinc-500 bg-zinc-950 rounded-lg p-2 cursor-default')}>
                    <History className='size-4' />
                </DrawerTrigger>
                <DrawerContent className='bg-black w-full border border-zinc-500'>
                    <DrawerHeader>
                    <DrawerTitle className='text-zinc-300'>History of audio recordings</DrawerTitle>
                    <DrawerDescription className='text-zinc-500'>
                        List of audio recordings made with OpenAI Whisper Recognize API.
                    </DrawerDescription>
                    </DrawerHeader>
                        <div className='text-zinc-500 w-full'>
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
                                            // const formattedDate = new Date(recording.file.lastModified).toLocaleString('en-EN')
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
                        <DrawerFooter>
                            <DrawerClose>
                                <Button variant="outline" className='text-xs m-0 px-4 h-7'>Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>

    );
};

export default HistoryMobile;