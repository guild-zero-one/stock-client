export interface ClienteResponse {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  celular: string;
  ativo: boolean;
  permissao: string;
  qtdPedidos: number;
  criadoEm: Date;
}
