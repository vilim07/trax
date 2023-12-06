import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/app/firebase/firebase";


const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '')
          .then(userCredential => {
            if (userCredential.user) {
              return userCredential.user;
            }
            return null;
          })
          .catch(error => (console.log(error)))
      }
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.uid = token.uid;
      }
      return session
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.uid = user.uid
      }
      return token
    }
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }
