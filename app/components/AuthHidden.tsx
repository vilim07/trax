'use client'
import { useSession } from 'next-auth/react';
import { ReactElement } from 'react';



export default function AuthHidden({ children }: { children: ReactElement  }) {

    const { data: session } = useSession();

    if (session?.user) {
      return <>{children}</>;
    }
  
    return null;

};

