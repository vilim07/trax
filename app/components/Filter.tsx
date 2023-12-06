'use client'
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { FilterState } from '../lib/types';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';


export default function Filter({ filter, setFilter }: { filter: FilterState; setFilter: (value: FilterState) => void }) {

    const [keywords, setKeywords] = useState<string>('');

    const calendarIcon = () => {
        return <Image
            src="/icons/calendar.svg"
            width="24"
            height="24"
            alt="calendar icon"
        />
    }

    //Idealy there would be a debounce here like this but it was causing stuff to rerender

/* 
    const debouncedChangeHandler = useMemo(() => _debounce(()=>{setFilter({ ...filter, keywords: keywords, primed: true })}, 1000), [keywords]);

    useEffect(() => {
        debouncedChangeHandler();
        return () => {
            // Cleanup the debounced function on component unmount
            debouncedChangeHandler.cancel();
        };
    }, [keywords, debouncedChangeHandler]); */


    useEffect(() => {
        setFilter({ ...filter, keywords: keywords, primed: true })
    }, [keywords]);


    return (
        <div className='flex mb-[42px] px-[50px] py-[22px] bg-white-lilac justify-between'>
            <div className="flex flex-col basis-[330px]">
                <label className='text-lynch text-sm'>Start date</label>
                <Calendar value={filter.start} inputClassName='border-none focus:shadow-none' clearButtonClassName='hidden' onChange={(e) => setFilter({ ...filter, start: e.value as Date, primed: true })} showIcon
                    icon={calendarIcon}
                />
            </div>
            <div className="flex flex-col basis-[330px]">
                <label className='text-lynch text-sm'>End date</label>
                <Calendar value={filter.end} inputClassName='border-none focus:shadow-none' clearButtonClassName='hidden' onChange={(e) => setFilter({ ...filter, end: e.value as Date, primed: true })} showIcon
                    icon={calendarIcon}
                />
            </div>
            <div className="flex flex-col basis-[330px] relative">
                <label className='text-lynch text-sm'>Description contains</label>
                <InputText value={keywords} className='border-none' onChange={(e) => setKeywords(e.target.value)} />
                <button type='button' className='absolute right-0 bottom-0 p-[10px]' onClick={() => { if (keywords) { setKeywords('') } }}>
                    {keywords &&
                     <Image
                        src="/icons/close.svg"
                        width="24"
                        height="24"
                        alt="close icon"
                        />
                    }
                </button>
            </div>
        </div >
    );
};

