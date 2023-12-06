'use client'
import HistoryRow from '@/app/components/common/HistoryRow';
import { collection, getCountFromServer, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useEffect, useRef, useState } from 'react';
import { FilterState, Tracker } from '@/app/lib/types';
import Filter from '@/app/components/Filter';
import { useSession } from 'next-auth/react';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import Pagination from '@/app/components/common/Pagination';

export default function TrackerHistory() {

    const [filter, setFilter] = useState<FilterState>({ start: null, end: null, keywords: '', primed: false })
    const [trackers, setTrackers] = useState<{ [key: string]: Tracker }>({});
    const [pagedTrackers, setPagedTrackers] = useState<Tracker[]>([])
    const [count, setCount] = useState<number>(0)
    const [fetching, setFetching] = useState(true);
    const listeners = useRef<any>([]);
    const [lastTracker, setLastTracker] = useState<any>(null);
    const [init, setInit] = useState<boolean>(false);


    const [editing, setEditing] = useState<null | string>(null)
    const [page, setPage] = useState<number>(0);

    const { data: session, status } = useSession();

    const pageSize = 5;

    const reset = () => {
        listeners.current.map((listener: () => void) => listener())
        listeners.current = [];
        setTrackers({})
        setLastTracker({})

    }

    //Unsubscribe all listeners on unmount
    useEffect(() => () => listeners.current.map((listener: () => void) => listener()), []);

    //Fetching of document count
    useEffect(() => {
        const fetchCount = async () => {
            try {
                if (status === 'authenticated' && session.user) {
                    let q = query(
                        collection(db, "trackers"),
                        where("trashed", "==", false),
                        where("stopped", "==", true),
                        where("user", "==", session.user.uid),
                    );

                    if (filter.start && filter.end) {
                        q = query(
                            q,
                            where('createdAt', '>=', filter.start),
                            where('createdAt', '<=', filter.end),
                        );
                    }

                    if (filter.keywords) {
                        const keywords = filter.keywords.split(' ');
                        q = query(
                            q,
                            where("indices", "array-contains-any", keywords)
                        );
                    }

                    const snapshot = await getCountFromServer(q);
                    setCount(snapshot.data().count);
                }
            } catch (error) {
                console.error('Error fetching count:', error);
            }
        };

        fetchCount();
    }, [filter, session?.user, status, trackers]);

    //Fetching of documents
    useEffect(() => {
        if (status === 'authenticated' && session.user && fetching) {
            let q = query(
                collection(db, "trackers"),
                orderBy("createdAt", "desc"),
                where("trashed", "==", false),
                where("stopped", "==", true),
                where("user", "==", session.user.uid),
                limit(pageSize),
            );

            if (lastTracker) {
                q = query(q, startAfter(lastTracker));
            }

            if (filter.start && filter.end) {
                q = query(
                    q,
                    where('createdAt', '>=', filter.start),
                    where('createdAt', '<=', filter.end),
                );
            }

            if (filter.keywords) {
                const keywords = filter.keywords.split(' ');
                q = query(
                    q,
                    where("indices", "array-contains-any", keywords)
                );
            }


            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let trackerDocs: { [key: string]: Tracker } = {};

                querySnapshot.forEach((doc) => {
                    trackerDocs[doc.id] = { id: doc.id, ...doc.data() } as Tracker;
                });
                console.log('call')
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
            setFetching(false);

            console.log(listeners.current.length);

        } else {
            return
        }

    }, [fetching, filter, lastTracker, session?.user, status]);

    useEffect(() => {
        setPagedTrackers(Object.values(trackers).slice(page * pageSize, (page + 1) * pageSize))
    }, [trackers, page])

    useEffect(() => {
        if (fetching == false){
            setInit(true)
        }
    }, [fetching])

    //If the user skips pages then data gets loaded up to that page since firebase pagination only works with cursors
    useEffect(() => {
        if (pagedTrackers.length == 0 && Object.keys(trackers).length < count) {
            setFetching(true);
        }
    }, [count, pagedTrackers.length, trackers, page])

    useEffect(() => {
        console.log(filter)
        if (filter.end && filter.start || !filter.end && !filter.start && filter.primed) {
            reset();
        }
    }, [filter]) 


    const onPageChange = async (event: PaginatorPageChangeEvent) => {
        setPage(event.page)
        if (Object.keys(trackers).length < count && event.page >= Object.keys(trackers).length / pageSize) {
            setFetching(true);
        }
    };

    return (
        <div className='pb-[160px]'>
            <Filter filter={filter} setFilter={setFilter} />

            <div className='mb-[120px]'>
                <div className='rounded-t-lg border-whisper border-[0.5px]'>

                    <div className='flex bg-white-lilac text-lg leading-none font-bold text-ebony'>
                        <div className='basis-[221px] grow px-[30px] pt-[32px] pb-[21px]'>Date</div>
                        <div className='basis-[482px] grow px-[30px] pt-[32px] pb-[21px]'>Description</div>
                        <div className='basis-[233px] grow px-[30px] pt-[32px] pb-[21px]'>Time tracked</div>
                        <div className='basis-[233px] grow px-[30px] pt-[32px] pb-[21px]'>Actions</div>
                    </div>

                    <div>
                        {init ?
                            (!pagedTrackers.length ?
                                 <div className='py-[30px] text-center font-semibold text-2xl text-lynch'>No trackers found</div>
                                :  
                                pagedTrackers.map((tracker) => (
                                <HistoryRow key={tracker.id} data={tracker} editing={editing} setEditing={setEditing} />
                                ))
                            )
                            : <div>-</div> //Skeletons
                        }
                    </div>
                </div>
            </div>

            {pagedTrackers.length ?
                <Pagination page={page} pageSize={pageSize} count={count} onChange={onPageChange} />
                : null
            }

        </div>
    );
};

