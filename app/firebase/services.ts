"use server"
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from "@/app/firebase/firebase"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Tracker } from "@/app/lib/types";



//Add new tracker
export const addTracker = async () => {
    const session = await getServerSession(authOptions);

    const currentTime = serverTimestamp();

    if (session?.user) {
        await addDoc(collection(db, "trackers"), {
            desc: '',
            createdAt: currentTime,
            startedAt: null,
            runTime: 0,
            stopped: false,
            paused: true,
            trashed: false,
            indices: [''],
            user: session.user.uid
        } as Tracker)
    }
}

// Pause all trackers
export const pauseAllUnpausedTrackers = async () => {

    const trackersCollection = collection(db, 'trackers');
    // Query to get all documents where paused is false
    const unpausedTrackersQuery = query(trackersCollection, where('paused', '==', false));

    try {
        // Get the documents that match the query
        const querySnapshot = await getDocs(unpausedTrackersQuery);
        const currentTime = Math.ceil(new Date().getTime() / 1000);

        querySnapshot.forEach(async (snap) => {
            const docRef = doc(trackersCollection, snap.id);
            const snapData = snap.data() as Tracker;
            if (snapData.startedAt) {
                // Update the document to pause it
                await updateDoc(docRef, {
                    paused: true,
                    runTime: snapData.runTime + currentTime - snapData.startedAt?.seconds,
                    startedAt: null,
                } as Partial<Tracker>);

                console.log(`Document ${snapData.id} successfully paused!`);
            }
        });
    } catch (error) {
        console.error('Error pausing documents: ', error);
    }
};

//Stop all trackers
export const stopAllTrackers = async () => {
    const trackersCollection = collection(db, 'trackers');
    // Query to get all documents where paused is false
    const trackersQuery = query(trackersCollection, where('stopped', '==', false));
    let runTime;
    try {
        // Get the documents that match the query
        const querySnapshot = await getDocs(trackersQuery);
        const currentTime = Math.ceil(new Date().getTime() / 1000);

        querySnapshot.forEach(async (snap) => {
            const docRef = doc(trackersCollection, snap.id);
            const snapData = snap.data() as Tracker;
            if (snapData.startedAt) {
                runTime = snapData.runTime + currentTime - snapData.startedAt?.seconds;
            }
            else {
                runTime = snapData.runTime
            }
            // Update the document to pause it
            await updateDoc(docRef, {
                paused: true,
                runTime: runTime,
                stopped: true,
                startedAt: null,
            } as Partial<Tracker>);

            console.log(`Document ${snapData.id} successfully paused!`);
        });
    } catch (error) {
        console.error('Error pausing documents: ', error);
    }
};

// Start a tracker
export const start = async (json: string) => {

    const data: Tracker = JSON.parse(json);

    const docRef = doc(collection(db, 'trackers'), data.id);
    try {
        await pauseAllUnpausedTrackers();
        console.log('Trackers successfully stopped!');
        await updateDoc(docRef, {
            paused: false,
            startedAt: serverTimestamp()
        } as Partial<Tracker>);
        console.log('Tracker successfully started!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}

//Pause a tracker
export const pause = async (json: string) => {

    const data: Tracker = JSON.parse(json);

    const docRef = doc(collection(db, 'trackers'), data.id);
    if (data.startedAt) {
        try {
            await updateDoc(docRef, {
                paused: true,
                runTime: data.runTime + Math.ceil(new Date().getTime() / 1000) - data.startedAt?.seconds,
                startedAt: null,
            } as Partial<Tracker>);
            console.log('Document successfully updated!');
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    }
}

//Stop a tracker
export const stop = async (json: string) => {

    const data: Tracker = JSON.parse(json);

    const docRef = doc(collection(db, 'trackers'), data.id);
    let runTime;
    if (data.startedAt) {
        runTime = data.runTime + Math.floor(new Date().getTime() / 1000) - data.startedAt?.seconds;
    }
    else {
        runTime = data.runTime
    }
    try {
        await updateDoc(docRef, {
            stopped: true,
            paused: true,
            runTime: runTime,
            startedAt: null,
        } as Partial<Tracker>);
        console.log('Tracker successfully stopped!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}

//Update tracker description
export const updateDesc = async (id: string, desc: string) => {

    // Splitting the description into searchable pieces to avoid text query plugins
    let explodedIndices: string[] = [];

    desc.split(" ").forEach(word => {
        for (let i = 0; i < word.length; i++) {
            explodedIndices.push(word.substr(0, i + 1).toLowerCase());
        }
    });

    let indices = explodedIndices.filter((element, index) => {
        return explodedIndices.indexOf(element) === index;
    });

    const docRef = doc(collection(db, 'trackers'), id);
    try {
        await updateDoc(docRef, {
            desc: desc,
            indices: indices,
        } as Partial<Tracker>);
        console.log('Description successfully updated!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}

//Trash tracker
export const trash = async (json: string) => {

    const data: Tracker = JSON.parse(json);

    const docRef = doc(collection(db, 'trackers'), data.id);
    try {
        await updateDoc(docRef, {
            paused: true,
            runTime: data.runTime + Math.ceil(new Date().getTime() / 1000) - (data.startedAt?.seconds || 0),
            startedAt: null,
            trashed: true,
            stopped: true,
        } as Partial<Tracker>);
        console.log('Tracker successfully trashed!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }

}
