import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({});

export const config = {
    // Protects all routes under /protected/ and /admin/
    // Adjust the matcher to your specific needs
    matcher: ["/protected/:path*", "/admin/:path*"],
};
