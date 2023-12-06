'use client'

import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

type ToastContextProps = {
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
    showWarn: (message: string) => void;
    showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => useContext<any>(ToastContext);


export const ToastContextProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {

    const toast = useRef<Toast>(null);

    const showSuccess = (message:string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail:message, life: 5000});
    }

    const showInfo = (message:string) => {
        toast.current?.show({severity:'info', summary: 'Info', detail:message, life: 5000});
    }

    const showWarn = (message:string) => {
        toast.current?.show({severity:'warn', summary: 'Warning', detail:message, life: 5000});
    }

    const showError = (message:string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail:message, life: 5000});
    }

    return (
        <ToastContext.Provider value={{ showSuccess, showInfo, showWarn, showError }}>
            <Toast ref={toast} />
            {children}
        </ToastContext.Provider>
    );
};