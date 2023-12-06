'use client'
import Image from 'next/image';
import TrackerRow from '@/app/components/common/TrackerRow';
import Button from '@/app/components/common/Button';
import { addTracker, stopAllTrackers } from '@/app/firebase/services';
import { collection, onSnapshot, orderBy, query, where, limit, getCountFromServer, getDocs, startAfter, DocumentData } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useEffect, useRef, useState } from 'react';
import StopIcon from '@/app/components/icons/StopIcon';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { useSession } from 'next-auth/react';
import { Tracker } from '@/app/lib/types';
import Pagination from '@/app/components/common/Pagination';

export default function TrackerTable() {

    const [trackers, setTrackers] = useState<{ [key: string]: Tracker }>({});
    const [pagedTrackers, setPagedTrackers] = useState<Tracker[]>([])
    const [count, setCount] = useState<number>(0)
    const [fetching, setFetching] = useState(true);
    const listeners = useRef<any>([]);
    const [lastTracker, setLastTracker] = useState<DocumentData | null>(null);



    const [editing, setEditing] = useState<null | string>(null)
    const [page, setPage] = useState<number>(0);

    const { data: session, status } = useSession();

    const pageSize = 5;

    //Unsubscribe all listeners on unmount
    useEffect(() => () => listeners.current.map((listener: () => void) => listener()), []);

    //Fetching of document count
    useEffect(() => {
        const fetchCount = async () => {
            try {
                if (status === 'authenticated' && session.user) {
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
    }, [session?.user, status, trackers]);

    //Fetching of documents
    useEffect(() => {
        if (status === 'authenticated' && session.user && fetching) {
            setFetching(false);

            let q = query(
                collection(db, "trackers"),
                orderBy("createdAt", "desc"),
                where("trashed", "==", false),
                where("stopped", "==", false),
                where("user", "==", session.user.uid),
                limit(pageSize),
            );

            if (lastTracker) {
                q = query(q, startAfter(lastTracker));
            }


            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let trackerDocs: { [key: string]: Tracker } = {};

                querySnapshot.forEach((doc) => {
                    trackerDocs[doc.id] = { id: doc.id, ...doc.data() } as Tracker;
                });

                querySnapshot.docChanges().forEach(function (change) {
                    if (change.type == 'removed') {
                        setTrackers((prev) => {
                            const updatedTrackers = { ...prev };
                            delete updatedTrackers[change.doc.id];
                            return updatedTrackers;
                        });
                    }
                });

                setLastTracker(querySnapshot.docs[querySnapshot.docs.length - 1])
                setTrackers((prev) => {
                    return {
                        ...prev,
                        ...trackerDocs
                    }
                })
            });

            listeners.current = [...listeners.current, unsubscribe]
        } else {
            return
        }

    }, [fetching, lastTracker, session?.user, status]);

    useEffect(() => {
        setPagedTrackers(Object.values(trackers).slice(page * pageSize, (page + 1) * pageSize))
    }, [trackers, page])

    //If the user skips pages then data gets loaded up to that page since firebase pagination only works with cursors
    useEffect(() => {
        if (pagedTrackers.length == 0 && Object.keys(trackers).length < count) {
            setFetching(true);
        }
    }, [count, pagedTrackers.length, trackers])

    const onPageChange = async (event: PaginatorPageChangeEvent) => {
        setPage(event.page)
        if (Object.keys(trackers).length < count && event.page >= Object.keys(trackers).length / pageSize) {
            setFetching(true);
        }
    };

    return (
        <div className='pb-[160px]'>
            <div className='flex mb-[36px] gap-x-[15px] justify-end'>
                <Button className='bg-orange flex pl-[10px] pr-[20px] items-center' type={'button'} onClick={() => { addTracker() }}>
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

            <div className='rounded-t-lg border-whisper border-[0.5px]  mb-[120px]'>

                <div className='flex bg-white-lilac text-lg leading-none font-bold text-ebony'>
                    <div className='basis-[221px] px-[30px] pt-[32px] pb-[21px]'>Time logged</div>
                    <div className='basis-[715px] px-[30px] pt-[32px] pb-[21px]'>Description</div>
                    <div className='basis-[233px] px-[30px] pt-[32px] pb-[21px]'>Actions</div>
                </div>

                <div>
                    {!fetching ?
                        pagedTrackers.length ?
                            pagedTrackers.map((tracker) => (
                                <TrackerRow key={tracker.id} data={tracker} editing={editing} setEditing={setEditing} />
                            ))
                            : <div className='py-[30px] text-center font-semibold text-2xl text-lynch'>No trackers yet</div>
                        : <div>-</div> //Skeletons
                    }
                </div>

            </div>

            {pagedTrackers.length ?
                <Pagination page={page} pageSize={pageSize} count={count} onChange={onPageChange} />
                : null
            }

        </div>
    );
};

