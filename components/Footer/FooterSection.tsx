import { Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const FooterSection = () => {
    const year = new Date().getFullYear()

    return (
        <div className='flex gap-2 text-zinc-300 text-xs m-4'>
            <Link href='https://github.com/jercomio/Voice-Transcript-AI'>
                <Github className='size-4 text-zinc-300' />
            </Link> {year}
        </div>
    );
};

export default FooterSection;