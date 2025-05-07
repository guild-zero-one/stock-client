import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const jwt = request.cookies.get('token');
    const isAuth = jwt !== undefined;

    if (!isAuth) {
        console.error("token não encontrado.")
    }
    console.log("token recuperado: ", jwt)

    const protectedPaths = [
        '/estoque',         // Rota principal de estoque
        '/estoque/.*',      // Qualquer sub-rota dentro de /estoque
      
        '/clientes',        // Rota principal de clientes
        '/clientes/.*',     // Qualquer sub-rota dentro de /clientes
        
        '/pedidos',         // Rota principal de pedidos
        '/pedidos/.*',      // Qualquer sub-rota dentro de /pedidos
      
        '/relatorio',       // Rota principal de relatorio
        '/relatorio/.*',    // Qualquer sub-rota dentro de /relatorio
      
        '/usuario',          // Rota principal de perfil
        '/usuario/.*',       // Qualquer sub-rota dentro de /perfil
      
        '/dashboard'        // Rota principal de dashboard
      ];
      
    const path = request.nextUrl.pathname;

    // Definir um conjunto de rotas públicas
    const publicPaths = ['/login', '/_next', '/favicon.ico'];

    // Permitir acesso livre às rotas públicas
    const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath));

    // Redirecionar usuários não autenticados que tentam acessar rotas privadas
    if (!isAuth && protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se o usuário estiver autenticado e tentar acessar /login, redireciona para o painel ou raiz
    if (isAuth && path === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // Continua o processamento normalmente
}
