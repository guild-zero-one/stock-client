export interface VendaResponse {
  id: number;
  valorTotal: number;
  desconto: number;
  pagamentoRealizado: boolean;
  dataVenda: Date;
}
