import VoiceAi from '@/components/Icons/voice-ai';
import TranscriptionForm from '@/components/TransriptionForm'
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className='flex flex-col min-h-screen bg-zinc-950 p-2'>
      <div className='flex flex-col justify-center items-center gap-2 w-full'>
        <div className='flex justify-center items-center gap-4 w-full md:w-1/2'>
          <div className='text-zinc-300'>
            <VoiceAi width='72' height='72' />
          </div>
          <div className='flex flex-col justify-center items-start gap-4 text-zinc-100 py-10 px-4 md:items-center'>
            <h2 className='text-xl font-semibold uppercase'>Voice Transcript</h2>
            <p className='text-zinc-300 text-sm'>Speech To Text with Whisper Recognize</p>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center bg-black border border-zinc-800 rounded-lg py-10 w-full md:w-1/2'>
          <TranscriptionForm />
        </div>
      </div>
      <div className='flex-grow'></div>
      <Footer />
    </main>
  );
}
