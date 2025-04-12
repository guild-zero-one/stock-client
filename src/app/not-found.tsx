import Link from "next/link";

export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-(--text-default)">
        <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
        <p className="text-(--text-secundary)">Desculpe, não conseguimos encontrar o que você procura.</p>
        <Link href={'/'}><span className="text-xs text-(--pink-default)">Ir para Página Principal</span></Link>
      </div>
    );
  }