'use client'

import React, { createContext, useContext } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase/firebase';
import { useRouter } from 'next/navigation';
import { SessionProvider as Provider } from 'next-auth/react';
import { useSession } from 'next-auth/react';

// User data type interface
interface UserType {
    email: string | null;
    uid: string | null;
}

const AuthContext = createContext({});

export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {

    // Redirect if logged in
    const useRouteAuth = () => {
        const router = useRouter();
        const { status } = useSession()

        if (status === 'authenticated') {
            router.push('/')
        }
    }

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };


    return (
        <Provider>
            <AuthContext.Provider value={{ signUp, useRouteAuth }}>
                {children}
            </AuthContext.Provider>
        </Provider>

    );
};