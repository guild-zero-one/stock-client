'use client'

import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import Link from 'next/link';
import MenuLink from '@/components/menu-link';

export default function Home() {
  return (
    <div className="flex flex-col bg-(pink-default) w-full h-dvh">

      {/* Banner */}
      <header className="relative h-[45vh] text-white">

        {/* Imagem de fundo */}
        <div className="absolute inset-0 bg-[url(/assets/images/people.jpg)] bg-cover bg-no-repeat object-cover" />

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
        <div className="gap-2 grid grid-cols-2 grid-rows-[repeat(auto-fill,_25%)] w-full md:[grid-template-rows:repeat(auto-fill,_150px)] grow">

          {/* Dashboard View */}
          <div className="flex flex-col justify-center items-start col-span-2 bg-gray-default p-4 rounded-2xl w-full h-[95%]">
              <span className='text-text-secondary text-sm'>Total em $ de vendas este mês</span>
              <span className="font-bold text-text-default text-3xl">R$ 0,00</span>
          </div>

          {/* Clientes */}
          <Link href={"/clientes"}>
            <MenuLink
              label="Clientes"
              icon={<PeopleAltOutlinedIcon />}
            />
          </Link>

          {/* Estoque */}
          <Link href={"/estoque"}>
            <MenuLink
              label="Estoque"
              icon={<Inventory2OutlinedIcon />}
            />
          </Link>

          {/* Pedidos */}
          <Link href={"/pedidos"}>
            <MenuLink
              label="Pedidos"
              icon={<ShoppingBagOutlinedIcon />}
            />
          </Link>

          {/* Relatório */}
          <Link href={"/relatorio"}>
            <MenuLink
              label="Relatório"
              icon={<InsertChartOutlinedIcon />}
            />
          </Link>

        </div>
      </main >
    </div>
  )
};