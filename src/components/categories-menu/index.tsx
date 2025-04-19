export default function CategoriesMenu() {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-shrink-0 bg-white p-4 rounded-2xl w-full h-[35vh] min-h-[160px] max-h-[300px]">

                {/* Descrição Textual Categoria */}
                <div className="flex flex-col w-full">
                    {/* Titulo e Subtitulo*/}
                    <div className="flex flex-col w-full">
                        <h2 className="font-lexend font-medium text-xl/8">Categoria</h2>
                        <span className="text-text-secondary text-xs">Utensilios em Geral</span>
                    </div>
                    {/* Quantidade de Produtos na categoria */}
                    <span className="mt-auto text-text-secondary text-xs">0 produtos registrados</span>
                </div>

                {/* Imagem Categoria */}
                <div className="flex justify-center items-center w-full h-full">
                    <img className="w-full h-full object-contain" src="https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/B2025040611/052a6cee-4403-494e-95e6-be70a33db324-bot-2025040611.jpg" alt="Imagem Categoria"  />
                </div>
            </div>
        </div>
    );
}