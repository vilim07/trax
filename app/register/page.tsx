'use client'

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import Image from 'next/image'
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Button from '@/app/components/common/Button';
import { useAuth } from "@/app/contexts/AuthContext";
import { signIn } from 'next-auth/react';
import { useToast } from '@/app/contexts/ToastContext';
import { UserCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Register() {

  const { signUp } = useAuth();
  const { showError, showSuccess } = useToast();
  const router = useRouter()


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passValid, setPassValid] = useState(true);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    //Validate password
    if (!(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/.test(password))) {
      console.log("Password is not valid")
      setPassValid(false)
    }

    signUp(email, password)
      .then(() => {
        signIn('credentials', { email, password, redirect: false, callbackUrl: "/" })
        .then(response => {
          // Check if the response is defined
          if (response) {
              const { ok, error } = response;
  
              if (ok) {
                  showSuccess("Welcome user!");

                  router.push("/");
              }
          } else {
              console.error("SignIn response is undefined");
          }
      })
      })
      .catch((error: any) => {
        if (error.code == "auth/email-already-in-use") {
          showError("The email address is already in use");
        } else if (error.code == "auth/invalid-email") {
          showError("The email address is not valid.");
        } else if (error.code == "auth/operation-not-allowed") {
          showError("Operation not allowed.");
        } else if (error.code == "auth/weak-password") {
          showError("The password is too weak.");
        }
      })
      .then(async () => {
      })
    setIsLoading(false)
  }

  return (
    <div className='my-auto w-[400px] mx-[15px]'>
      <div className='card flex flex-col items-center pt-[44px] px-[35px] pb-[60px] mb-[30px]'>
        <h2 className='text-2xl text-ebony font-bold'>Register</h2>
        <form onSubmit={submit} className='flex flex-col w-full mt-[50px] gap-y-[30px]'>

          <InputText placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="border-0 text-lg py-[12px] leading-none rounded-[3px] px-[20px]" />

          <Password placeholder='Password' toggleMask
            onChange={(e) => setPassword(e.target.value)}
            required
            mediumRegex="^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})."
            className={!passValid ? "p-invalid" : ""}
            inputClassName="w-full border-0 text-lg leading-none py-[12px] rounded-[3px] px-[20px]" />

          <Button className={'bg-orange w-full ' + (isLoading && "opacity-75	")} disabled={isLoading} type={'submit'}>Register</Button>

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
          <h3 className='text-lynch text-lg font-semibold'>Have an account?</h3>
          <Link href='/login' className='text-sm text-orange underline font-bold'> Login here </Link>
        </div>
      </div>
    </div>
  )
}
