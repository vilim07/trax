import IconButton from '@/app/components/common/IconButton'
import { pause, start, stop, trash, updateDesc } from '@/app/firebase/services';
import { Tracker } from '@/app/lib/types';
import { InputText } from 'primereact/inputtext';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function TrackerRow({ data, editing, setEditing }: { data: Tracker; editing: null | string; setEditing: (value: null | string) => void }) {


    const [desc, setDesc] = useState(data.desc)
    const [timer, setTimer] = useState<string>('00:00:00');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    //If tracker running set interval to update timer. Otherwise just set the timer
    useEffect(() => {

        const updateTimer = () => {
            const currentClientTime = Math.ceil(new Date().getTime() / 1000);
            if (data.startedAt) {
                const startedAtDate = data.startedAt.seconds;
                let timeDifferenceSeconds = currentClientTime - startedAtDate + data.runTime;
                if (timeDifferenceSeconds < 0) {
                    timeDifferenceSeconds = 0;
                }
                const formattedDiff = new Date(timeDifferenceSeconds * 1000).toISOString().slice(11, 19);
                return setTimer(formattedDiff);
            } else {
                const formattedDiff = new Date(data.runTime * 1000).toISOString().slice(11, 19);
                return setTimer(formattedDiff);
            }
        };
        updateTimer();

        if (!data.paused) {
            // If not paused, increment the timer every second
            intervalRef.current = setInterval(() => {
                updateTimer();
            }, 1000);
        }

        // Cleanup function to clear the interval when the component is unmounted or paused
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [data.paused, data.runTime, data.startedAt]);



    const submit = async () => {
        await updateDesc(data.id, desc);
        return setEditing(null);
    }

    const edit = () => {
        return setEditing(data.id);
    }

    return (
        <div className='flex leadin-none text-lynch'>
            <div className='basis-[221px] flex items-center px-[30px] py-[24px] border-whisper border-[0.5px] font-bold'>{timer}</div>
            <div className={`basis-[715px] flex items-center px-[30px] ${editing != data.id && " py-[24px] font-semibold"} border-whisper border-[0.5px]`}>
                {editing==data.id ? 
                    <form className="w-full" onSubmit={(e) => {e.preventDefault(); submit()}}>
                        <InputText value={desc} className='w-full' onChange={(e) => setDesc(e.target.value)} placeholder='Press enter or click the save button on the right to save'/>
                    </form>
                    : data.desc}
            </div>
            <div className='basis-[233px] flex items-center px-[30px] py-[24px] border-whisper border-[0.5px] gap-x-[15px]'>
                <IconButton src={data.paused ? "/icons/play.svg" : "/icons/pause.svg"} alt="play icon" func={() => { data.paused ? start(JSON.stringify(data)) : pause(JSON.stringify(data)) }} />
                <IconButton src="/icons/stop.svg" alt="stop icon" func={() => { stop(JSON.stringify(data)) }} />
                <IconButton src={editing==data.id ? "/icons/save.svg" : "/icons/edit.svg"} alt="edit icon" func={() => { editing==data.id ? submit() : edit(); }} />
                <IconButton src="/icons/trash.svg" alt="trash icon" func={() => { trash(JSON.stringify(data)) }} />
            </div>
        </div>
    )
}