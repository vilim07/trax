'use client'
import Image from 'next/image';
import TrackerRow from '@/app/components/common/TrackerRow';
import Button from '@/app/components/common/Button';
import { addTracker, stopAllTrackers } from '@/app/firebase/services';
import { collection, onSnapshot, orderBy, query, where, limit, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import StopIcon from '@/app/components/icons/StopIcon';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useSession } from 'next-auth/react';
import { Tracker } from '@/app/lib/types';

export default function TrackerTable() {

    const [trackers, setTrackers] = useState<{ [key: string]: Tracker }>({});
    const [pagedTrackers, setPagedTrackers] = useState<Tracker[]>([])
    const [count, setCount] = useState<number>(0)

    const [editing, setEditing] = useState<null | string>(null)
    const [page, setPage] = useState<number>(0);

    const { data: session, status } = useSession();

    const pageSize = 5;

    //Pagination is done badly
    useEffect(() => {
        if (status === 'authenticated' && session && session.user) {
            //setup query
            let q = query(
                collection(db, "trackers"),
                orderBy("createdAt", "desc"),
                where("trashed", "==", false),
                where("stopped", "==", false),
                where("user", "==", session.user.uid),
                limit((page + 1) * pageSize),
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let trackerDocs: { [key: string]: Tracker } = {};

                querySnapshot.forEach((doc) => {
                    trackerDocs[doc.id] = { id: doc.id, ...doc.data() } as Tracker;
                });

                setTrackers((prev) => {
                    return {
                        ...prev,
                        ...trackerDocs
                    }
                })
            });
            return () => { unsubscribe() };
        }

    }, [session, page, status]);

    useEffect(() => {
        setPagedTrackers(Object.values(trackers).slice(page * pageSize, (page + 1) * pageSize))
    }, [trackers, page])

    //Fetching of document count
    useEffect(() => {
        const fetchCount = async () => {
            try {
                if (status === 'authenticated' && session && session.user) {

                    const q = query(
                        collection(db, "trackers"),
                        where("trashed", "==", false),
                        where("stopped", "==", false),
                        where("user", "==", session.user.uid),
                    );
                    const snapshot = await getCountFromServer(q);
                    setCount(snapshot.data().count);
                }
            } catch (error) {
                console.error('Error fetching count:', error);
            }
        };

        fetchCount();
    }, [session, status, trackers]);


    const onPageChange = async (event: PaginatorPageChangeEvent) => {
        setPage(event.page)
        setPagedTrackers(Object.values(trackers).slice(event.page * pageSize, (event.page + 1) * pageSize))
    };

    return (
        <div className='pb-[160px] mb-[120px]'>
            <div className='flex mb-[36px] gap-x-[15px] justify-end'>
                <Button className='bg-orange flex pl-[10px] pr-[20px] items-center' type={'button'} onClick={() => { addTracker(); }}>
                    <Image
                        src='/icons/stopwatch.svg'
                        width="24"
                        height="24"
                        alt='stopwatch icon'
                        className='mr-[10px]'
                    />
                    Start new timer
                </Button>
                <Button className='bg-port-gore flex pl-[10px] pr-[20px] items-center' type={'button'} onClick={() => (stopAllTrackers())}>
                    <StopIcon
                        className="w-[24px] h-[24px] mr-[10px] fill-white"
                    />
                    Stop all
                </Button>
            </div>

            <div className='rounded-t-lg border-whisper border-[0.5px]'>

                <div className='flex bg-white-lilac text-lg leading-none font-bold text-ebony'>
                    <div className='basis-[221px] px-[30px] pt-[32px] pb-[21px]'>Time logged</div>
                    <div className='basis-[715px] px-[30px] pt-[32px] pb-[21px]'>Description</div>
                    <div className='basis-[233px] px-[30px] pt-[32px] pb-[21px]'>Actions</div>
                </div>

                <div>
                    {pagedTrackers.map((tracker) => (
                        <TrackerRow key={tracker.id} data={tracker} editing={editing} setEditing={setEditing} />
                    ))}

                </div>

            </div>

            {pagedTrackers.length ?
                <Paginator first={page * pageSize} totalRecords={count} rows={pageSize} onPageChange={onPageChange} />
                : null
            }

        </div>
    );
};

