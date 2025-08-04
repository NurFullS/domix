'use client';

import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

const TopHeader = () => {
    const navigate = useRouter();

    return (
        <div className="w-full bg-[#E6D8C3] h-[60px] shadow-md flex items-center justify-between px-6 sm:px-12">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate.push('/main')}>
                <span className="text-xl sm:text-2xl font-bold text-gray-800">DomiX</span>
                <img src="/iconsite.png" alt="logo" className="w-7 sm:w-9" />
            </div>

            <div>
                <p>
                    <a
                        href="mailto:nurzhenishov10@mail.com"
                        target='_blank'
                        className="font-normal border-b-2 border-transparent hover:border-black transition-colors"
                    >
                        Служба поддержки: nurzhenishov10@gmail.com
                    </a>
                </p>
            </div>


            <button
                onClick={() => navigate.push('/announcement')}
                className="bg-green-600 hover:bg-green-700 cursor-pointer text-white font-medium sm:font-semibold py-2 px-4 rounded-xl flex items-center gap-2 transition duration-200"
            >
                <AddIcon style={{ fontSize: 20 }} />
                <span className="hidden sm:inline">Создать объявление</span>
            </button>
        </div>
    );
};

export default TopHeader;