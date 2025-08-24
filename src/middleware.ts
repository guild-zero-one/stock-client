import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login", "/_next", "/favicon.ico"];
  const protectedPaths = ["/estoque", "/clientes", "/pedidos", "/relatorio", "/usuario", "/dashboard", "/"];

  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath));
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath));

  // Se for rota pública → segue normal
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Se não for rota protegida → segue normal
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // A partir daqui, só entra quem precisa de autenticação
  if (!token) {
    console.error("Token não encontrado.");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    await jwtVerify(token, secret);

    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Token inválido ou expirado.");
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
