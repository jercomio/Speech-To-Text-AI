'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mic, Square, Trash2 } from 'lucide-react';
import { openai } from '@/lib/openai';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
    openaiKey: z.string().min(2, {
      message: "OpenAI Key must be valid !",
    }).regex(/^[^<>?!\/\(\)\{\}\[\]\*]*$/, {
        message: "Error: Invalid characters detected."
    }),
})


const index = () => {
    const [keyValue, setKeyValue, removeKeyValue] = useLocalStorage<string>('openai-key', '')
    const [transcription, setTranscription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isMediaDevicesAvailable, setIsMediaDevicesAvailable] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

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
                } catch (error) {
                    console.error('Error during transcription:', error);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    return (
        <div className='flex flex-col justify-start items-start gap-4'>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                    control={form.control}
                    name="openaiKey"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className='text-gray-300'>Enter your private OpenAI Key</FormLabel>
                        <div className='flex gap-2'>
                            <FormControl>
                                <Input 
                                    type='password' 
                                    id='password'
                                    placeholder="OpenAI Key" 
                                    className='w-96'
                                    value={field.value}
                                    onChange={(e) => {
                                        // const value = e.target.value
                                        // if (!/[<>?!/]/.test(value)) {
                                            field.onChange(e)
                                        // }
                                    }}
                                    // {...field}  
                                />
                            </FormControl>
                            <Button onClick={() => {
                                removeKeyValue()
                                field.onChange('')
                            }} className='text-gray-300 border border-black/0 hover:border hover:border-gray-600'><Trash2 className='size-4' /></Button>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className='flex gap-4'>
                        <Button type="submit" className='border border-black/0 hover:border hover:border-gray-600'>Validate</Button>
                        <Button
                            onClick={() => {
                            removeKeyValue()
                            }}
                            className='border border-black/0 hover:border hover:border-gray-600'
                        >
                            Remove OpenAI Key
                        </Button>
                    </div>
                </form>
            </Form>

            {
                keyValue !== '' ? (
                    <div className='flex justify-center items-center gap-4'>
                        <Input type='text' value={transcription} readOnly className='w-72' />
                        <Button 
                            onClick={handleSpeechRecognition} 
                            disabled={!isMediaDevicesAvailable} 
                            className={cn(
                                'group border',
                                isRecording ? 'border-red-500 hover:border-red-900 hover:bg-red-500' : 'border-black/0 hover:border-gray-600'
                            )}
                        >
                            {isRecording ? 
                                <Square 
                                    className={cn(
                                        isRecording ? 'text-red-500 group-hover:text-gray-300' : 'text-red-500'
                                    )} 
                                /> 
                                : <Mic />
                            }
                        </Button>
                    </div>
                ) : null
            }
        </div>
    );
};

export default index;