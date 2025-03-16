import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {jwtDecode} from 'jwt-decode';

const protectedPaths = ['/admin/dashboard', '/account/profile', '/account/settings'];

const authPaths = ['/auth/login', '/auth/register', '/auth/verify-email'];

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get('auth-storage')?.value;

    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

    const isProtectedPath =
        protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) || isAdminPath;

    const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

    let isAuthenticated = false;
    let userRole: string | null = null;

    if (currentUser) {
        try {
            const parsedUser = JSON.parse(decodeURIComponent(currentUser));
            if (parsedUser?.state?.currentUser?.token?.token) {
                const token = parsedUser.state.currentUser.token.token;
                const decodedToken = jwtDecode<{ exp: number; role: string }>(token);
                const currentTime = Date.now() / 1000;

                isAuthenticated = decodedToken.exp > currentTime;
                userRole = decodedToken.role;
            }
        } catch (error) {
            console.error('Error parsing auth token:', error);
        }
    }

    if (isProtectedPath && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (isAdminPath && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    if (isAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
