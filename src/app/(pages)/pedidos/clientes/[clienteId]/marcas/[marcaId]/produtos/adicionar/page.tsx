import Header from "@/components/header";
import Input from "@/components/input";

import SearchIcon from "@mui/icons-material/Search";

export default function AdicionarPedido() {
  return (
    <div className="flex flex-col w-full min-h-dvh">
      <Header title="Adicionar Pedido" subtitle="Escolher Produto" />

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full bg-white-default">
        <Input
          name="search"
          label="Pesquisar"
          iconSymbol={<SearchIcon />}
          size="small"
          handleChange={(e) => console.log(e.target.value)}
        />
      </div>
    </div>
  );
}
