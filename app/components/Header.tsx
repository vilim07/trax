import Image from 'next/image'
import AuthHidden from '@/app/components/AuthHidden';
import Navigation from '@/app/components/Navigation';
export default function Header() {
    return (
        <div className="w-full h-[112px] bg-port-gore px-[45px] rounded-b-[22px] fixed top-0 z-10">
            <div className="w-full h-full flex justify-between">
                <div className="flex items-end py-[34px]">
                    <Image
                        src="/images/logo.png"
                        width={250}
                        height={250}
                        alt="Devot logo"
                        priority
                        className='h-full w-auto mr-[9px]'
                    />
                    <h1 className="text-2xl text-white whitespace-nowrap leading-none pb-[9px]">Tracking tool</h1>
                </div>
                <AuthHidden>
                    <Navigation />
                </AuthHidden>
            </div>
        </div>
    )
}