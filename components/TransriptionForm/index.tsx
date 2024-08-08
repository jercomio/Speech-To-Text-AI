'use client'
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Github, Trash2 } from 'lucide-react';
import { openai } from '@/lib/openai';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import HistoryDesktop from '../History/Desktop/desktop';
import HistoryMobile from '../History/Mobile/mobile';
import SettingsButton from '../Buttons/SettingsButton';
import VoiceAi from '../Icons/voice-ai';

export type Recordings = {
    file: File; 
    transcription: string;
}
export type RecordingsToStore = {
    transcription: string;
    fileName: string;
    fileType: string;
    date: string | null;
    file: File;
}

const FormSchema = z.object({
    openaiKey: z.string().min(2, {
      message: "OpenAI Key must be valid !",
    }).regex(/^[^<>?!\/\(\)\{\}\[\]\*]*$/, {
        message: "Error: Invalid characters detected."
    }),
})


const TranscriptionForm = () => {
    const [keyValue, setKeyValue, removeKeyValue] = useLocalStorage<string>('openai-key', '')
    const [transcription, setTranscription] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [isMediaDevicesAvailable, setIsMediaDevicesAvailable] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const [recordings, setRecordings] = useState<Recordings[]>([]); // Add a state to save the recordings
    const [HistoryBackup, setHistoryBackup, removeHistoryBackup] = useLocalStorage<RecordingsToStore[]>('history', [])

    const matches = useMediaQuery('(min-width: 768px)');


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => setIsMediaDevicesAvailable(true))
            .catch(() => setIsMediaDevicesAvailable(false));
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          openaiKey: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setKeyValue(data.openaiKey)
    }


    const handleSpeechRecognition = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' });
                
                try {
                    const response = await openai(keyValue).audio.transcriptions.create({
                        file: audioFile,
                        model: 'whisper-1',
                    })
                    setTranscription(response.text);
                    
                    setRecordings(prev => [...prev, { file: audioFile, transcription: response.text }]); // Save the recording
                    
                } catch (error) {
                    console.error('Error during transcription:', error);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        }
    }

    useEffect(() => {
        const recordingsToStore: RecordingsToStore[] = recordings.map(recording => ({
            transcription: recording.transcription,
            fileName: recording.file?.name || 'Unknown',
            fileType: recording.file?.type || 'Unknown',
            date: recording.file ? new Date(recording.file.lastModified).toISOString() : null,
            file: recording.file // Add the file property here
        }));
        setHistoryBackup(recordingsToStore);

    }, [recordings, setHistoryBackup])


    return (
        <div className='flex flex-col gap-8 w-full px-4 md:w-1/2'>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="openaiKey"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className='text-zinc-300'>Enter your private OpenAI Key</FormLabel>
                        <div className='flex gap-2'>
                            <FormControl>
                                <Input 
                                    type='password' 
                                    id='password'
                                    placeholder="OpenAI Key" 
                                    className='w-full'
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e)
                                    }} 
                                />
                            </FormControl>
                            <Button onClick={() => {
                                removeKeyValue()
                                field.onChange('')
                            }} className='text-zinc-300 border border-black/0 hover:border hover:border-zinc-600'><Trash2 className='size-4' /></Button>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className='flex gap-4'>
                        <Button type="submit" className='border border-black/0 hover:border hover:border-zinc-600'>Validate</Button>
                    </div>
                </form>
            </Form>

            {
                keyValue !== '' ? (
                    <div className='flex justify-center items-center gap-4'>
                        <Input type='text' value={transcription} readOnly className='w-full' />
                        <Button 
                            onClick={handleSpeechRecognition} 
                            disabled={!isMediaDevicesAvailable} 
                            className={cn(
                                'group border',
                                isRecording ? 'border-red-500 hover:border-red-900 hover:bg-red-500' : 'border-black/0 hover:border-zinc-600'
                            )}
                        >
                            {isRecording ? 
                                <VoiceAi width='24' height='24' fill='currentColor' className='animate-pulse group-hover:fill-red-500' />
                                : <VoiceAi width='24' height='24' />
                            }
                        </Button>
                    </div>
                ) : null
            }
            {
                recordings.length > 0 ? (
                    <div className='flex flex-row justify-end items-center gap-2 w-full'>
                        {matches ? <HistoryDesktop recordings={HistoryBackup} /> : <HistoryMobile recordings={HistoryBackup} />}
                        <SettingsButton />
                    </div>
                ) : null
            }
        </div>
    );
};

export default TranscriptionForm;