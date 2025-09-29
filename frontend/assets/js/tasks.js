const todoInput = document.querySelector('.task-input');
const eTodoInput = document.querySelector('#taskInput');
const todoButton = document.querySelector('.task-button');
const myTasks = document.querySelector('.myTasks');
const toggleDarkLight = document.querySelector('.toggle-dark-light');
const container = document.querySelector('.container');
const filterButtons = document.querySelectorAll('.filter-btn');
document.addEventListener("DOMContentLoaded", () => {
    checkDarkMode();
    fetchTasks();
});
function getToken() {
    return localStorage.getItem("token");
}

function getUserId() {
    return localStorage.getItem("userId");
}
toggleDarkLight.addEventListener('click', function(){
    container.classList.toggle('dark');
    localStorage.setItem('darkMode', container.classList.contains('dark'));
})
function checkDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        container.classList.add('dark');
    }
}
todoButton.addEventListener('click', function() {
    if (validateInput()) {
        addTodo();
    }
})
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && validateInput()) {
        addTodo();
    }
});

todoInput.addEventListener('input', function() {
    if (todoInput.value.trim() !== '') {
        document.querySelector('.error-txt').classList.remove('show-error');
        todoInput.classList.remove('input-error');
    }
});
function validateInput() {
    if (todoInput.value.trim() === '') {
        showError('Campo vazio', 'Por favor, digite uma tarefa antes de adicionar');
        todoInput.classList.add('input-error');
        return false;
    }
    todoInput.classList.remove('input-error');
    return true;
}
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
    const editBtn = document.createElement('button');
    trashBtn.innerHTML = `<img src="../images/icons/trash-icon.svg" alt="Trash Icon">`;
    editBtn.innerHTML = `<img src="../images/icons/edit-icon.svg" alt="Edit Icon">`;
    trashBtn.classList.add('trash-btn');
    editBtn.classList.add('edit-btn');
    trashBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showEditPopup(task.id, task.title);
    });
    if (task.completed) {
        editBtn.disabled = true;
        editBtn.style.opacity = "0.5";
        editBtn.style.cursor = "not-allowed";
    }
    todoDiv.appendChild(editBtn);
    todoDiv.appendChild(trashBtn);
    todoDiv.addEventListener('click', (e) => {
        if (e.target.closest('.trash-btn') || e.target.closest('.edit-btn')) return; 
        updateTask(task.id, { completed: !task.completed });
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
async function updateTask(id, data) {
    const token = getToken();
    if (!token) {
        showError("Erro", "Token não encontrado.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            showError("Erro ao atualizar", error.message || "Não foi possível atualizar a tarefa.");
            return;
        }
        fetchTasks(getActiveFilter());
    } catch (err) {
        console.error("Erro ao atualizar tarefa:", err);
        showError("Erro de Conexão", "Não foi possível conectar ao servidor para atualizar a tarefa.");
    }
}
function showEditPopup(id, currentTitle) {
    Swal.fire({
        title: 'Editar Tarefa',
        input: 'text',
        inputValue: currentTitle,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2fa1ff',
        cancelButtonColor: '#24292d',
        inputValidator: (value) => {
            if (!value.trim()) {
                return 'Você precisa escrever algo!'
            }
        }
    }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== currentTitle) {
            updateTask(id, { title: result.value.trim() });
        }
    });
}

async function editTask(id, title) {
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
            body: JSON.stringify({ title })
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
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter');
        const value = button.getAttribute('data-filter');
        fetchTasks(getActiveFilter());
    });
});

function getActiveFilter() {
    const activeButton = document.querySelector('.filter-btn.active-filter');
    const filterValue = activeButton.getAttribute('data-filter');
    
    if (filterValue === 'true') return true;
    if (filterValue === 'false') return false;
    return null;
}
