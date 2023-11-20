import IconButton from '@/app/components/common/IconButton'
import { trash, updateDesc } from '@/app/firebase/services';
import { Tracker } from '@/app/lib/types';
import { InputText } from 'primereact/inputtext';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function HistoryRow({ data, editing, setEditing }: { data: Tracker; editing: null | string; setEditing: (value: null | string) => void }) {

    const [desc, setDesc] = useState(data.desc)

    //If tracker running set interval to update timer. Otherwise just set the timer

    const formattedRunTime = new Date(data.runTime * 1000).toISOString().slice(11, 19);

    const dateMilis = data.createdAt.toMillis();
    const formatter = new Intl.DateTimeFormat('en-GB');
    const formattedDate = formatter.format(new Date(dateMilis)).replace(/\//g, '.') + ".";



    const submit = async () => {
        await updateDesc(data.id, desc);
        return setEditing(null);
    }

    const edit = () => {
        return setEditing(data.id);
    }

    return (
        <div className='flex leadin-none text-lynch'>
            <div className='basis-[221px] grow flex items-center px-[30px] py-[24px] border-whisper border-[0.5px] text-lg font-semibold'>{formattedDate}</div>
            <div className={`basis-[482px] grow flex items-center px-[30px] ${editing != data.id && " py-[24px]"} border-whisper border-[0.5px]`}>
                {editing == data.id ?
                    <form className="w-full" onSubmit={(e) => { e.preventDefault(); submit() }}>
                        <InputText value={desc} className='w-full' onChange={(e) => setDesc(e.target.value)} placeholder='Press enter or click the save button on the right to save' />
                    </form>
                    : data.desc}
            </div>
            <div className='basis-[233px] grow flex items-center px-[30px] py-[24px] border-whisper border-[0.5px]'>{formattedRunTime}</div>
            <div className='basis-[233px] grow flex items-center px-[30px] py-[24px] border-whisper border-[0.5px] gap-x-[15px]'>
                <IconButton src={editing == data.id ? "/icons/save.svg" : "/icons/edit.svg"} alt="edit icon" func={() => { editing == data.id ? submit() : edit(); }} />
                <IconButton src="/icons/trash.svg" alt="trash icon" func={() => { trash(JSON.stringify(data)) }} />
            </div>
        </div>
    )
}