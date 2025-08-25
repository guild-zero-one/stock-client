import Link from "next/link";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { aplicarMascaraTelefone } from "@/utils/masks";

import CardCustomer from "../card-customer";

interface ListaClientesProps {
  clientes: ClienteResponse[];
  uri: (cliente: ClienteResponse) => string;
}

export default function CustomersList({ clientes, uri }: ListaClientesProps) {
  if (clientes.length === 0) {
    return (
      <p className="text-center text-gray-500">Nenhum cliente encontrado :(</p>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {clientes.map(cliente => (
        <Link key={cliente.id} href={uri(cliente)}>
          <CardCustomer
            nome={cliente.nome}
            sobrenome={cliente.sobrenome}
            contato={
              cliente.contato?.celular
                ? aplicarMascaraTelefone(cliente.contato.celular)
                : "Celular não informado"
            }
            qtdPedidos={cliente.qtdPedidos}
          />
        </Link>
      ))}
    </div>
  );
}
