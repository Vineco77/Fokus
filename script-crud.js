//Adicionar o formulario

const adicionarNovaTarefaBt = document.querySelector('.app__button--add-task');
const formDeNovaTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const cancelarBt = document.querySelector('.app__form-footer__button--cancel');
const limparTarefasConcluidasBt = document.querySelector('#btn-remover-concluidas');
const limparTodasTarefasBt = document.querySelector('#btn-remover-todas');


let pDescricaoTarefa = document.querySelector('.app__section-active-task-description');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [] ;
let unicaTarefa = JSON.parse(localStorage.getItem('tarefa')) || [] ;

let tarefaSelecionada = null;
let liTarefaSelecionada = null;


function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `    

    const p = document.createElement('p');
    p.textContent = tarefa.descricao
    p.classList.add('app__section-task-list-item-description');

    let trash = document.createElement('button');
    trash.classList.add('app_button-edit');


    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

 
    botao.onclick = () =>{
        const novaDescricao = prompt('Escreva sua nova tarefa 🤓');
        if (novaDescricao) {
            
            p.textContent = novaDescricao;
            tarefa.descricao = novaDescricao
            atualizarTarefas();
            
        }
        
    }
 
    
    trash.onclick = () =>{
        const index = tarefas.indexOf(tarefa); 
        if (index !== -1) { 
            tarefas.splice(index, 1);
            li.remove(); 
            atualizarTarefas(); 
            pDescricaoTarefa.textContent = "";
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    botao.append(imagemBotao);

    const imagemLixeira = document.createElement('img');
    imagemLixeira.setAttribute('src', '/imagens/trash.png');
    trash.append(imagemLixeira);
    

    

    li.append(svg);
    li.append(p);
    li.append(trash);
    li.append(botao);


    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    }else{
        
        li.onclick = ()=>{
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                });
                
                if (tarefaSelecionada == tarefa) {
                    pDescricaoTarefa.textContent = "";
                    tarefaSelecionada = null;
                    liTarefaSelecionada = null;
                    return
                }
    
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            pDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li
}

adicionarNovaTarefaBt.addEventListener('click', () => {
    formDeNovaTarefa.classList.toggle('hidden');
})



formDeNovaTarefa.addEventListener('submit', (evento)=>{
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textArea.value = '';
    formDeNovaTarefa.classList.add('hidden');
})


tarefas.forEach(tarefa => {

   const elementoTarefa = criarElementoTarefa(tarefa);

   ulTarefas.append(elementoTarefa)
});


const limparFormulario = () => {
    formDeNovaTarefa.classList.add('hidden');  
}
cancelarBt.addEventListener('click', limparFormulario);


document.addEventListener('FocoFinalizado', ()=>{
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
});


const removerTarefas = (somenteCompletas) =>{
    pDescricaoTarefa.textContent = "";
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento =>{
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefas => !tarefas.completa) : []
    atualizarTarefas();
}

limparTarefasConcluidasBt.onclick = () => removerTarefas(true); 
limparTodasTarefasBt.onclick = () => removerTarefas(false);

