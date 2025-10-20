import { NextRequest, NextResponse } from "next/server";
import { getJson } from "serpapi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = searchParams.get("ijn") || "0";

    if (!query) {
      return NextResponse.json(
        { error: "Parâmetro de busca é obrigatório" },
        { status: 400 }
      );
    }

    const response = await getJson({
      engine: "google_images",
      q: query,
      location: "Brazil",
      ijn: page, // Página de resultados (0, 1, 2, etc)
      api_key: process.env.SERPAPI_API_KEY,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro na busca SERPAPI:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
