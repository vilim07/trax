'use client'

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import Image from 'next/image'
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/common/Button';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';



export default function Login() {

    const {useRouteAuth} = useAuth();
    const {showError, showSuccess} = useToast();
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        try {
            signIn('credentials', { email, password, redirect: false, callbackUrl: "/"})
            .then(response => {
                // Check if the response is defined
                if (response) {
                    const { ok, error } = response;
        
                    if (ok) {
                        showSuccess("Welcome user!");

                        router.push("/");
                    } else {
                        console.log(error);
                        showError("Credentials do not match!");
                    }
                } else {
                    console.error("SignIn response is undefined");
                }
            })
            .catch(error => {
                console.error("Error during signIn:", error);
            });
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className='my-auto w-[400px] mx-[15px]'>
            <div className='card flex flex-col items-center pt-[44px] px-[35px] pb-[60px] mb-[30px]'>
                <h2 className='text-2xl text-ebony font-bold'>Login</h2>
                <form onSubmit={submit} className='flex flex-col w-full mt-[50px] gap-y-[30px]'>

                    <InputText placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                        className="border-0 text-lg py-[12px] leading-none rounded-[3px] px-[20px]" />

                    <Password placeholder='Password' toggleMask
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        feedback={false}
                        inputClassName="w-full border-0 text-lg leading-none py-[12px] rounded-[3px] px-[20px]" />

                    <Button className={'bg-orange w-full ' + (isLoading && "opacity-75	")} disabled={isLoading} type={'submit'}>Login</Button>

                </form>
            </div>
            <div className='card px-[28px] flex items-center'>
                <Image
                    src="/icons/user.svg"
                    width="95"
                    height="95"
                    alt="user icon"
                    className='mr-[34px]'
                />
                <div>
                    <h3 className='text-lynch text-lg font-semibold'>Need an account?</h3>
                    <Link href='/register' className='text-sm text-orange underline font-bold'> Register here </Link>
                </div>
            </div>
        </div>
    )
}