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
    const changeHandler = () => {
        setFilter({ ...filter, keywords: keywords })
    };

    const debouncedChangeHandler = useMemo(() => _debounce(changeHandler, 500), [keywords]);

    useEffect(() => {
        debouncedChangeHandler();
        return () => {
            // Cleanup the debounced function on component unmount
            debouncedChangeHandler.cancel();
        };
    }, [keywords, debouncedChangeHandler]);


    return (
        <div className='flex mb-[42px] px-[50px] py-[22px] bg-white-lilac justify-between'>
            <div className="flex flex-col basis-[330px]">
                <label className='text-lynch text-sm'>Start date</label>
                <Calendar value={filter.start} inputClassName='border-none focus:shadow-none' onChange={(e) => setFilter({ ...filter, start: e.value as Date })} showIcon
                    icon={calendarIcon}
                />
            </div>
            <div className="flex flex-col basis-[330px]">
                <label className='text-lynch text-sm'>End date</label>
                <Calendar value={filter.end} inputClassName='border-none focus:shadow-none' onChange={(e) => setFilter({ ...filter, end: e.value as Date })} showIcon
                    icon={calendarIcon}
                />
            </div>
            <div className="flex flex-col basis-[330px] relative">
                <label className='text-lynch text-sm'>Description contains</label>
                <InputText value={keywords} className='border-none' onChange={(e) => setKeywords(e.target.value)} />
                <button type='button' className='absolute right-0 bottom-0 p-[10px]' onClick={() => { setFilter({ ...filter, keywords: '' }); setKeywords('') }}>
                    <Image
                        src="/icons/close.svg"
                        width="24"
                        height="24"
                        alt="close icon"
                    />
                </button>
            </div>
        </div >
    );
};

