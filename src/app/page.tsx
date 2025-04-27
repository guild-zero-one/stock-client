'use client'

import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import Link from 'next/link';
import Image from 'next/image'
import MenuLink from '@/components/menu-link';

export default function Home() {
  return (
    <div className="flex flex-col w-full h-dvh">

      {/* Banner */}
      <header className="relative h-[45vh] text-white">

        {/* Imagem de fundo */}
        <Image className="z-0 object-center object-cover" src="/assets/images/people.jpg" alt="Pessoas" fill priority />

        {/* Filtro de cor */}
        <div className="absolute inset-0 bg-pink-default/65" />

        {/* Conteúdo */}
        <div className="z-10 relative p-4">
          <h1 className="font-bold text-2xl">Bem-vinde</h1>
        </div>

      </header>

      {/* Painel de Navegação */}
      <main className="z-10 relative flex bg-white-default -mt-5 p-4 rounded-t-3xl w-full h-full overflow-hidden grow">

        {/* Grid */}
        <div className="gap-2 grid grid-cols-2 w-full h-fit">

          {/* Dashboard View */}
          <div className="flex flex-col justify-center items-start col-span-2 bg-gray-default p-4 rounded-xl w-full h-[10vh] min-h-[120px] max-h-[300px]">
            <span className='text-text-secondary text-sm'>Total em $ de vendas este mês</span>
            <span className="font-bold text-text-default text-3xl">R$ 0,00</span>
          </div>

          {/* Clientes */}
          <div className="h-fit">
            <Link href={"/clientes"}>
              <MenuLink
                label="Clientes"
                icon={<PeopleAltOutlinedIcon />}
              />
            </Link>
          </div>

          {/* Estoque */}
          <div className="h-fit">
            <Link href={"/estoque/marcas/"}>
              <MenuLink
                label="Estoque"
                icon={<Inventory2OutlinedIcon />}
              />
            </Link>
          </div>

          {/* Pedidos */}
          <div className="h-fit">
            <Link href={"/pedidos"}>
              <MenuLink
                label="Pedidos"
                icon={<ShoppingBagOutlinedIcon />}
              />
            </Link>
          </div>

          {/* Relatório */}
          <div className="h-fit">
            <Link href={"/relatorio"}>
              <MenuLink
                label="Relatório"
                icon={<InsertChartOutlinedIcon />}
              />
            </Link>
          </div>

        </div>
      </main >
    </div>
  )
};