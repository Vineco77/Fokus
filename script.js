const html = document.querySelector('html');
const focobt = document.querySelector('.app__card-button--foco');
const curtobt = document.querySelector('.app__card-button--curto');
const longobt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const texto = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const mostrarTempoNaTela = document.querySelector('#timer');
const startPauseBt = document.querySelector('#start-pause');
const comecarPausarBt = document.querySelector('#start-pause span');
const playMusica = document.querySelector('#alternar-musica');
const musicaPlay = new Audio('/sons/play.wav');
const musicaPause = new Audio('/sons/pause.mp3');
const musicaAcabou = new Audio('./sons/beep.mp3');
const musica = new Audio('/sons/luna-rise-part-one.mp3');


musica.loop = true;
musicaPlay.pause = true;

let tempoDecorridoEmSegundos = 2400;
let intervaloId = null;


playMusica.addEventListener('change', ()=>{
    if (musica.paused) {
        musica.play()
        musica.volume = 0.2;
    } else {
        musica.pause()
    }
})

focobt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 2400;
    alterarPaginas('foco');
    focobt.classList.add('active');
})

curtobt.addEventListener('click',() => {
    tempoDecorridoEmSegundos = 300;
    alterarPaginas('descanso-curto');
    curtobt.classList.add('active');
} )

longobt.addEventListener('click', () =>{
    tempoDecorridoEmSegundos = 900;
    alterarPaginas('descanso-longo');
    longobt.classList.add('active');
})

function alterarPaginas(pagina) {
    mostrarTempo();
    botoes.forEach(function (pagina) {
        pagina.classList.remove('active');
    })
    html.setAttribute('data-contexto', pagina);
    banner.setAttribute('src', `/imagens/${pagina}.png`);
    switch (pagina) {
        case 'foco':
            texto.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">desbrave o que importa.</strong>
            `
            break;
        case 'descanso-curto':
            texto.innerHTML =  `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case 'descanso-longo':
            texto.innerHTML =  `
            Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa</strong>
            `
        default:
            break;
    }
}

const contagemRegressiva = () =>{
    if (tempoDecorridoEmSegundos <= 0) {
        musicaAcabou.play();
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento);
        }
        zerar();
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar )

function iniciarOuPausar() {
    if (intervaloId) {
        musicaPause.play();
        zerar();
        return
    }
    musicaPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000)
    comecarPausarBt.textContent = 'Pausar';
    comecarPausarBt.previousElementSibling.setAttribute('src','/imagens/pause.png');
}

function zerar() {
    clearInterval(intervaloId)
    intervaloId = null;
    comecarPausarBt.textContent = 'Começar';
    comecarPausarBt.previousElementSibling.setAttribute('src','/imagens/play_arrow.png');
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    mostrarTempoNaTela.innerHTML = `${tempoFormatado}`;

}

mostrarTempo();


