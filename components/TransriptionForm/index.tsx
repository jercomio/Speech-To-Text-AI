'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { openai } from '@/lib/openai';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';

const FormSchema = z.object({
    openaiKey: z.string().min(2, {
      message: "OpenAI Key must be valid !",
    }),
})


const index = () => {
    const [value, setValue, removeValue] = useLocalStorage<string>('openai-key', '')
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
        setValue(data.openaiKey)
      }

    // let openaiKey = localStorage.getItem("openai-key") ?? ""

    // if (!openaiKey) {
    //     const newKey = window.prompt("Please enter your OpenAI API key:")

    //     if (!newKey) {
    //     return
    //     }
        
    //     localStorage.setItem("openai-key", newKey)
    //     openaiKey = newKey
        
    // }

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
                    const response = await openai(value).audio.transcriptions.create({
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
                        <FormControl>
                            <Input type='password' placeholder="OpenAI Key" {...field} className='w-72' />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className='flex gap-4'>
                        <Button type="submit">Validate</Button>
                        <Button
                            onClick={() => {
                            removeValue()
                            }}
                        >
                            Remove OpenAI Key
                        </Button>
                    </div>
                    <p className='text-xs text-orange-500'>To remove your key, empty the field then click on the button Remove</p>
                </form>
            </Form>

            {
                value !== '' ? (
                    <div className='flex justify-center items-center gap-4'>
                        <Input type='text' value={transcription} readOnly className='w-72' />
                        <Button onClick={handleSpeechRecognition} disabled={!isMediaDevicesAvailable}>
                            {isRecording ? 'Stop' : 'Speech'}
                        </Button>
                    </div>
                ) : null
            }
        </div>
    );
};

export default index;