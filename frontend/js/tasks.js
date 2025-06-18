const todoInput = document.querySelector('.task-input');
const eTodoInput = document.querySelector('#taskInput');
const todoButton = document.querySelector('.task-button');
const myTasks = document.querySelector('.myTasks');
const toggleDarkLight = document.querySelector('.toggle-dark-light');
const container = document.querySelector('.container');
const filterButtons = document.querySelectorAll('.filter-btn');

document.addEventListener("DOMContentLoaded", () => {
    showDate();
    checkDarkMode();
    fetchTasks();
});

// Helpers
function getToken() {
    return localStorage.getItem("token");
}

function getUserId() {
    return localStorage.getItem("userId");
}

// Modo dark/light
toggleDarkLight.addEventListener('click', function(){
    container.classList.toggle('dark');
    localStorage.setItem('darkMode', container.classList.contains('dark'));
})

// Verificar modo ao carregar a página
function checkDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        container.classList.add('dark');
    }
}

// verificar campos vazios
todoButton.addEventListener('click', function() {
    if (validateInput()) {
        addTodo();
    }
})

// Enter para adicionar
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && validateInput()) {
        addTodo();
    }
});

// Evento de input para remover erro ao digitar
todoInput.addEventListener('input', function() {
    if (todoInput.value.trim() !== '') {
        document.querySelector('.error-txt').classList.remove('show-error');
        todoInput.classList.remove('input-error');
    }
});


// Mostrar e formatar a data atual
function showDate() {
    const newDate = new Date();
    let weekDay = newDate.getDay();
    let day = newDate.getDate();
    let month = newDate.getMonth();
    const year = newDate.getFullYear();

    // Formatar dia e mês com zero à esquerda
    day = day < 10 ? '0' + day : day;
    month = month < 9 ? '0' + (month + 1) : (month + 1); 

    document.querySelector('#s_date').textContent = `${day}/${month}/${year}`;

    // Dias da semana em português
    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    document.querySelector('#s_week').textContent = weekDays[weekDay] + ',';
}

showDate();

// Função para validar input
function validateInput() {
    if (todoInput.value.trim() === '') {
        showError('Campo vazio', 'Por favor, digite uma tarefa antes de adicionar');
        todoInput.classList.add('input-error');
        return false;
    }
    todoInput.classList.remove('input-error');
    return true;
}

// funcao para adicionar elementos
async function addTodo() {
    const title = todoInput.value.trim();
    const userId = getUserId();

    if (!userId) {
        showError("Erro", "Usuário não autenticado");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/create-tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, userId })
        });
        if (!response.ok) {
            const error = await response.json();
            showError("Erro ao criar", error.message || "Erro desconhecido");
            return;
        }

        const newTask = await response.json();
        renderTask(newTask);
        todoInput.value = "";
    } catch (err) {
       console.error("Erro:", err); 
       showError("Erro", "Erro ao conectar com o servidor");
    }
}
function renderTask(task){
    // criar elementos
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('taskDiv');
    if (task.completed) todoDiv.classList.add('completed');

    const todoSpan = document.createElement('span');
    todoSpan.classList.add('taskname')
    todoSpan.innerText = task.title;
    if (task.completed) {
        todoSpan.classList.add("completed-task");
    }
    todoDiv.appendChild(todoSpan);


    const trashBtn = document.createElement('button');
    trashBtn.innerHTML = '<i class="fa fa-trash"></i>';
    trashBtn.classList.add('trash-btn');
    trashBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    todoDiv.appendChild(trashBtn);

    todoDiv.addEventListener('click', (e) => {
        if (e.target.closest('.trash-btn')) return; 
        toggleTaskCompleted(task.id, !task.completed);
    });
    myTasks.appendChild(todoDiv);
}

async function fetchTasks(completed = null) {
    const userId = getUserId();
    if (!userId) {
        showError("Erro", "Usuário não autenticado.");
        return;
    }

    let url = `http://localhost:3000/api/tasks?userId=${userId}&sortBy=createdAt`;
    if (completed !== null) {
        url += `&completed=${completed}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.json();
            showError("Erro ao carregar tarefas", error.message || "Erro desconhecido");
            return;
        }
        const tasks = await response.json();
        myTasks.innerHTML = "";
        tasks.forEach(renderTask);
    } catch (err) {
        console.error("Erro ao carregar tarefas:", err);
    }
}

async function deleteTask(id) {
    const token = getToken();
    if (!token) {
        showError("Erro", "Token não encontrado.");
        return;
    }

    try {
        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        fetchTasks();
    } catch (err) {
        console.error("Erro ao deletar tarefa:", err);
    }
}

async function toggleTaskCompleted(id, completed) {
    const token = getToken();
    if (!token) {
        showError("Erro", "Token não encontrado.");
        return;
    }

    try {
        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });
        fetchTasks();
    } catch (err) {
        console.error("Erro ao atualizar tarefa:", err);
    }
}
// Função para mostrar erros com SweetAlert2
function showError(title, text) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        showClass: {
            popup: 'swal2-show swal2-slide-in-right'
        },
        hideClass: {
            popup: 'swal2-hide swal2-slide-out-right'
        },
        didOpen: (toast) => {
            const progressBar = toast.querySelector('.swal2-timer-progress-bar');
            if (progressBar) {
                progressBar.style.background = '#f27474';
                progressBar.style.opacity = '1';
                progressBar.style.height = '4px';
            }
        }
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover classe ativa de todos
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        // Adicionar classe ativa ao clicado
        button.classList.add('active-filter');

        // Verifica qual botão foi clicado
        const value = button.getAttribute('data-filter');
        let completed = null;
        if (value === 'true') completed = true;
        else if (value === 'false') completed = false;
        else completed = null;

        fetchTasks(completed);
    });
});



