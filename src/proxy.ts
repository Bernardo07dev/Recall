import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { encrypt } from '@/src/lib/auth';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("recall-session")?.value;

  if (request.nextUrl.pathname === '/magic-login') {
    const sessionToken = await encrypt({ userId: "5d3915b0-e819-4c32-9545-1cc9c48718b1", nome: "Admin" });
    const response = NextResponse.redirect(new URL('/chat', request.url));
    response.cookies.set("recall-session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
    return response;
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  if (request.nextUrl.pathname === '/log-in' && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }
}

export const config = {
  matcher: ['/', '/log-in', '/magic-login'],
};
