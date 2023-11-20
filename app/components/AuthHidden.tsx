import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { ReactElement } from 'react';



export default async function AuthHidden({ children }: { children: ReactElement  }) {

    //Using getServerSession because it loads user data before useSession
    const session = await getServerSession(authOptions)
    
    if (session?.user) {
        return children;
    }

    return null

};

