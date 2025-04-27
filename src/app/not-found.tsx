import Link from "next/link";

export default function NotFound() {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-text-default text-center">
        <h1 className="mb-4 font-bold text-4xl">404 - Página não encontrada</h1>
        <p className="text-text-secundary">Desculpe, não conseguimos encontrar o que você procura.</p>
        <Link href={'/'}><span className="text-pink-default text-xs">Ir para Página Principal</span></Link>
      </div>
    );
  }