import TranscriptionForm from '@/components/TransriptionForm'

export default function Home() {
  return (
    <main className='bg-black h-full'>
      <div className='flex flex-col justify-center items-center gap-4 text-gray-100 py-10'>
        <h2 className='text-xl font-semibold uppercase'>Speech To Text with Whisper Recognize</h2>
        <p className='text-gray-300'>This is a small application to test the Whisper Recognize function from OpenAI.</p>
      </div>
      <div className='relative flex justify-center items-center w-full'>
        <TranscriptionForm />
      </div>
    </main>
  );
}
