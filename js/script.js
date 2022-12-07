const todoInput = document.querySelector('.task-input');
const eTodoInput = document.querySelector('#taskInput');
const todoButton = document.querySelector('.task-button');
const myTasks = document.querySelector('.myTasks');
const toggle = document.querySelector('.toggle');
const sec = document.querySelector('.sec');

// modo dark
toggle.onclick = function(){
     sec.classList.toggle('dark');
}

// verificar campos vazios
todoButton.onclick = function(){
    // campo do input estiver vazio dispare um alert
    if(todoInput.value.length == 0){
        validation();
    }else{
        // função para adicionar to do
        addTodo();
    }
}
// validar o input
function validation(){
    const eInput = document.querySelector('.error-txt')
    eInput.classList.add('show-error');
    todoInput.classList.add('input-error');
    todoInput.addEventListener('keydown',function(){
        eInput.classList.remove('show-error');
        todoInput.classList.remove('input-error');
    })
}

//clique do enter para adicionar ou não tarefa
eTodoInput.addEventListener('keypress', captureEnter);
function captureEnter(e){
    if(e.keyCode === 13) {
        if (!todoInput.value) return;
        addTodo(todoInput.value);    
    }  
}
// mostrar e formatar a data atual
let newDate = new Date();
function showDate(){

    let n_week = newDate.getDay();
    let n_day = newDate.getDate();
    let n_month = newDate.getMonth();
    let n_year = newDate.getFullYear();

    if(n_day.toString().length==1) n_day = '0' + n_day;
    if(n_month.toString().length==1) n_day = '0' + n_month;

    let fDate = `${n_day}/${n_month + 1}/${n_year}`;
    document.querySelector('#s_date').innerHTML = fDate;

    switch(n_week){
        case 0:
            n_week = 'DOM,';
            break;
        case 1:
            n_week = 'SEG,';
            break; 
        case 2:
            n_week = 'TER,';
            break;  
        case 3:
            n_week = 'QUA,';
            break;  
        case 4:
            n_week = 'QUI,';
            break; 
        case 5:
            n_week = 'SEX,';
            break; 
        case 6:
            n_week = 'SAB,';
            break;                 
    }
    document.querySelector('#s_week').innerHTML =  n_week;

}
showDate();

// funcao para adicionar elementos
function addTodo(){
    // criar elementos
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('taskDiv');

    const todoSpan = document.createElement('span');
    todoSpan.classList.add('taskname')
    todoSpan.innerText = todoInput.value;
    todoDiv.appendChild(todoSpan);


    const trashBtn = document.createElement('button');
    trashBtn.innerHTML = '<i class="fa fa-trash"></i>';
    trashBtn.classList.add('trash-btn');
    todoDiv.appendChild(trashBtn);

    myTasks.appendChild(todoDiv);
    todoInput.value = '';

    let current_tasks = document.querySelectorAll(".trash-btn");
    for ( let i = 0; i < current_tasks.length; i++) {
    current_tasks[i].onclick = function() {
         this.parentElement.remove();
        }
    }
    let tasks = document.querySelectorAll(".taskDiv");
    for ( let i = 0; i < tasks.length; i++) {
        tasks[i].onclick = function() {
         this.classList.toggle('completed');
        }
    } 

}





