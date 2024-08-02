import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Recordings } from '../TransriptionForm';

type Props = {
    recordings: Recordings[]
}

const TranscriptionHistory: React.FC<Props> = ({recordings}) => {
    return (
        <div className='text-gray-500 w-full'>
            <Table className='text-xs'>
                <TableCaption>Recordings list</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Transcription</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        recordings.map((recording, idx) => {
                            const formattedDate = new Date(recording.file.lastModified).toLocaleDateString('fr-FR')
                            return (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{recording.transcription}</TableCell>
                                    <TableCell className="text-right">{formattedDate}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default TranscriptionHistory;