import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// AUTH TEMPORARILY DISABLED FOR TESTING
export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
