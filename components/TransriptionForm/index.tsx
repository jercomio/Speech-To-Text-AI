'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { openai } from '@/lib/openai';


const index = () => {
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

    let openaiKey = localStorage.getItem("openai-key") ?? ""

    if (!openaiKey) {
        const newKey = window.prompt("Please enter your OpenAI API key:")

        if (!newKey) {
        return
        }
        
        localStorage.setItem("openai-key", newKey)
        openaiKey = newKey
        
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
                    const response = await openai(openaiKey).audio.transcriptions.create({
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
        <div className='flex justify-center items-center gap-4'>
            <Input type='text' value={transcription} readOnly className='w-72' />
            <Button onClick={handleSpeechRecognition} disabled={!isMediaDevicesAvailable}>
                {isRecording ? 'Stop' : 'Speech'}
            </Button>
        </div>
    );
};

export default index;