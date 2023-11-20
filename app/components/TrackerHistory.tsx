'use client'
import HistoryRow from '@/app/components/common/HistoryRow';
import { collection, getCountFromServer, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { FilterState, Tracker } from '../lib/types';
import Filter from '@/app/components/Filter';
import { useSession } from 'next-auth/react';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

export default function TrackerHistory() {

    const [trackers, setTrackers] = useState<{ [key: string]: Tracker }>({});
    const [editing, setEditing] = useState<null | string>(null)
    const [filter, setFilter] = useState<FilterState>({ start: null, end: null, keywords: '' })

    const [page, setPage] = useState<number>(0);
    const [count, setCount] = useState<number>(0)
    const [pagedTrackers, setPagedTrackers] = useState<Tracker[]>([])

    const { data: session, status } = useSession();

    const pageSize = 5;


    useEffect(() => {
        if (status === 'authenticated' && session && session.user) {
            //setup query
            let q = query(
                collection(db, "trackers"),
                orderBy("createdAt", "asc"),
                where("trashed", "==", false),
                where("stopped", "==", true),
                where("user", "==", session.user.uid),
                limit((page + 1) * pageSize),
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

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let trackerDocs: { [key: string]: Tracker } = {};

                querySnapshot.forEach((doc) => {
                    trackerDocs[doc.id] = { id: doc.id, ...doc.data() } as Tracker;
                });

                setTrackers(trackerDocs)
            });
            return () => { unsubscribe() };
        }

    }, [session, page, status, filter]);


    useEffect(() => {
        setPagedTrackers(Object.values(trackers).slice(page * pageSize, (page + 1) * pageSize))
    }, [trackers, page])

    //Fetching of document count
    useEffect(() => {
        const fetchCount = async () => {
            try {
                if (status === 'authenticated' && session && session.user) {

                    let q = query(
                        collection(db, "trackers"),
                        where("trashed", "==", false),
                        where("stopped", "==", false),
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
    }, [session, status, trackers, filter]);


    const onPageChange = async (event: PaginatorPageChangeEvent) => {
        setPage(event.page)
        setPagedTrackers(Object.values(trackers).slice(event.page * pageSize, (event.page + 1) * pageSize))
    };

    return (
        <div>
            <Filter filter={filter} setFilter={setFilter} />

            <div className='pb-[160px]'>
                <div className='rounded-t-lg border-whisper border-[0.5px]'>

                    <div className='flex bg-white-lilac text-lg leading-none font-bold text-ebony'>
                        <div className='basis-[221px] grow px-[30px] pt-[32px] pb-[21px]'>Date</div>
                        <div className='basis-[482px] grow px-[30px] pt-[32px] pb-[21px]'>Description</div>
                        <div className='basis-[233px] grow px-[30px] pt-[32px] pb-[21px]'>Time tracked</div>
                        <div className='basis-[233px] grow px-[30px] pt-[32px] pb-[21px]'>Actions</div>
                    </div>

                    <div>
                        {pagedTrackers.map((tracker) => (
                            <HistoryRow key={tracker.id} data={tracker} editing={editing} setEditing={setEditing} />
                        ))}

                    </div>
                </div>
            </div>

            {pagedTrackers.length ?
                <Paginator first={page * pageSize} totalRecords={count} rows={pageSize} onPageChange={onPageChange} />
                : null
            }

        </div>
    );
};

