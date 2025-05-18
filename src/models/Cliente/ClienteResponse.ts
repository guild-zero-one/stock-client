import { ContatoResponse } from "../Contato/ContatoResponse";

export interface ClienteResponse {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  ativo: boolean;
  urlImagem: string;
  permissao: string;
  qtdPedidos: number;
  contato: ContatoResponse;
  criadoEm: Date;
}
