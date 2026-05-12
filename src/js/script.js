// DECLARAÇÔES DOS ELEMENTOS USANDO DOM(DOCUMENT OBJECT MODEL)
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-txt");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//FUNÇÂO QUE VAI HABILITAR A CÂMERA

async function configurarCamera() {
    try {
        const midia = await navigator.mediaDevices.getUserMedia({
            video:{facingMode: "environment"}, //habilitando a camera traseira
            audio: false
        })
        videoElemento.srcObject = midia;
        videoElemento.play(); // garante que o video comece
    }catch (erro) {
        resultado.innerText = "Erro ao Acessar a câmera ", erro 
    }
}
//Executa a função da câmera
configurarCamera();

//função para ler o texto da imagem e mostrar na tela

botaoScanear.onclick() = async()=>{ //função anônima (arrow function)
    botaoScanear.disable = true;
    resultado.innerText = "Fazendo Leitura...aguarde";

    //chama a estrutura do canvas
    const context = canvas.getContext("2d");

    //ajusta o tamanho da tela
    canvas.width = videoElemento.videoWidth; // largura 
    canvas.height = videoElemento.videoHeight; // altura

    //reset de qualquer transformação para garantir que a foto não
    //fique invertida
    context.setTransform(1, 0, 1, 0, 0);

    //aplica o filtro de contraste e escala de cinza no canvas antes de
    //tirar a foto ( ajusta a evitar letras aleatorias)
    context.filter = "contrast(1.2) grayscale(1)";

    //construindo a tela para tirar a foto
    context.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);
    try {
        const {data: { text }} = await Tesseract.recognize(
            canvas,
            "por"
        );
        //remove os espaços excessivos e caracteres especiais
        const textoFinal = text.trim();

        //estrutura condicional ternaria ? if : else
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possivel Identificar o texto!";

    }catch (erro) {
        console.error(erro);
        resultado.innerText = "Erro ao processar", erro;
    }finally {
        //Desabilita o botão para começar nova leitura
        botaoScanear.disable = false;
    }


}