'use client'

import ALink from "@/app/components/common/ALink";
import { signOut } from 'next-auth/react';
import Image from "next/image";
import HistoryIcon from '@/app/components/icons/HistoryIcon';
import StopwatchIcon from "@/app/components/icons/StopwatchIcon";
import LogoutIcon from "./icons/LogoutIcon";

export default function Navigation() {

    return (
        <nav className='flex text-ghost'>
            <ul className='flex h-full'>
                <li className='flex text-center w-[180px] h-full hover:text-white-lilac transition'>
                    <ALink href='/' className="flex w-full h-full text-ghost justify-center items-center" activeClass='text-white-lilac'>
                        <div>
                            <StopwatchIcon
                                className="w-[24px] h-[24px] mr-[8px] fill-ghost"
                            />
                            Trackers
                        </div>
                    </ALink>
                </li>
                <li className='flex text-center w-[180px] h-full hover:text-white-lilac transition'>
                    <ALink href='/history' className="flex w-full h-full text-ghost justify-center items-center" activeClass='text-white-lilac fill-lime-600	'>
                        <div>
                            <HistoryIcon
                                className="w-[24px] h-[24px] mr-[8px] fill-ghost"
                            />
                            History
                        </div>
                    </ALink>
                </li>
            </ul>
            <button onClick={() => signOut()} className='flex text-ghost justify-center items-center text-center w-[180px] h-full hover:text-white-lilac transition'>
                <div>
                    <LogoutIcon
                        className="w-[24px] h-[24px] mr-[8px] fill-ghost"
                    />
                    Logout
                </div>
            </button>
        </nav>
    )
}