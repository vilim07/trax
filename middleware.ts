import { withAuth } from "next-auth/middleware"

export default withAuth;

export const config = {
    matcher: ["/((?!register|login|icons|images).*)"],
};
