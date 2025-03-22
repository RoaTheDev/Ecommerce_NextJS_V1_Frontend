import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {jwtDecode} from 'jwt-decode';

const protectedPaths = ['/admin/dashboard', '/user/profile', '/user/settings'];
const authPaths = ['/auth/login', '/auth/register', '/auth/verify-email'];

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get('AuthToken')?.value;

    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) || isAdminPath;
    const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

    let isAuthenticated = false;
    let userRole: string | null = null;

    if (currentUser) {
        try {
            const decodedToken = jwtDecode<{ exp: number; role: string }>(currentUser);
            const currentTime = Date.now() / 1000;
            isAuthenticated = decodedToken.exp > currentTime;
            userRole = decodedToken.role;
            console.log(userRole)
        } catch (error) {
            console.error('Error decoding auth token:', error);
        }
    }

    if (isProtectedPath && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (isAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL(userRole === 'Admin' ? '/admin/dashboard' : '/', request.url));
    }
    if (isAdminPath && isAuthenticated && userRole !== 'Admin') {
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
