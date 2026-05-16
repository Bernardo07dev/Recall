import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("recall-session")?.value;

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  if (request.nextUrl.pathname === '/log-in' && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }
}

export const config = {
  matcher: ['/', '/log-in'],
};
