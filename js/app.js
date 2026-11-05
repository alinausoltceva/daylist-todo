// Подключение CSS
const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = './css/styles.css';
document.head.appendChild(stylesheet);

// Вспомогательная функция для создания HTML-элементов
function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (textContent !== undefined && textContent !== null) {
        element.textContent = textContent;
    }

    return element;
}

// Ссылка для перехода к основному содержимому
const skipLink = createElement(
    'a',
    'skip-link',
    'Перейти к основному содержимому'
);
skipLink.href = '#main-content';

// Шапка приложения
const header = createElement('header', 'app-header');

const brand = createElement('div', 'app-brand');
const brandTitle = createElement('h1', 'app-title', 'Daylist');
const brandSubtitle = createElement(
    'p',
    'app-subtitle',
    'Пространство для твоих планов'
);

brand.append(brandTitle, brandSubtitle);
header.append(brand);

// Основная часть приложения
const main = createElement('main', 'app-main');
main.id = 'main-content';

// Форма добавления задачи
const taskForm = createElement('form', 'task-form');

const taskTitleLabel = createElement(
    'label',
    'form-label',
    'Название задачи'
);
taskTitleLabel.htmlFor = 'task-title';

const taskTitleInput = createElement('input', 'form-input');
taskTitleInput.type = 'text';
taskTitleInput.id = 'task-title';
taskTitleInput.name = 'title';
taskTitleInput.placeholder = 'Например, прочитать главу';
taskTitleInput.required = true;
taskTitleInput.maxLength = 100;

const taskDateLabel = createElement(
    'label',
    'form-label',
    'Срок выполнения'
);
taskDateLabel.htmlFor = 'task-date';

const taskDateInput = createElement('input', 'form-input');
taskDateInput.type = 'date';
taskDateInput.id = 'task-date';
taskDateInput.name = 'date';

const submitButton = createElement(
    'button',
    'button button-primary',
    'Добавить задачу'
);
submitButton.type = 'submit';

const titleField = createElement('div', 'form-field');
titleField.append(taskTitleLabel, taskTitleInput);

const dateField = createElement('div', 'form-field');
dateField.append(taskDateLabel, taskDateInput);

taskForm.append(titleField, dateField, submitButton);

// Панель поиска, фильтрации и сортировки
const controls = createElement('div', 'task-controls');

// Поиск
const searchInput = createElement('input', 'form-input search-input');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск задач...';
searchInput.setAttribute('aria-label', 'Поиск задач по названию');

// Фильтр
const filterSelect = createElement('select', 'form-input');
filterSelect.setAttribute('aria-label', 'Фильтр задач');

const filterOptions = [
    { value: 'all', text: 'Все задачи' },
    { value: 'active', text: 'Активные' },
    { value: 'completed', text: 'Выполненные' }
];

filterOptions.forEach(option => {
    const optionElement = createElement('option', '', option.text);
    optionElement.value = option.value;
    filterSelect.append(optionElement);
});

// Сортировка
const sortSelect = createElement('select', 'form-input');
sortSelect.setAttribute('aria-label', 'Сортировка задач');

const sortOptions = [
    { value: 'default', text: 'По умолчанию' },
    { value: 'date-asc', text: 'Сначала ближайшие' },
    { value: 'date-desc', text: 'Сначала дальние' }
];

sortOptions.forEach(option => {
    const optionElement = createElement('option', '', option.text);
    optionElement.value = option.value;
    sortSelect.append(optionElement);
});

controls.append(searchInput, filterSelect, sortSelect);

// Секция со списком задач
const tasksSection = createElement('section', 'tasks-section');

const sectionTitle = createElement(
    'h2',
    'section-title',
    'Мои задачи'
);

const taskStats = createElement('p', 'task-stats');
const taskList = createElement('div', 'task-list');
taskList.setAttribute('aria-live', 'polite');

const emptyState = createElement(
    'div',
    'empty-state',
    'Пока здесь нет задач. Добавь первую!'
);

// Область уведомлений
const notificationArea = createElement('div', 'notification-area');
notificationArea.setAttribute('role', 'status');
notificationArea.setAttribute('aria-live', 'polite');

// Собираем интерфейс
tasksSection.append(
    sectionTitle,
    taskStats,
    taskList,
    emptyState
);

main.append(taskForm, controls, tasksSection);

document.body.append(
    skipLink,
    header,
    main,
    notificationArea
);


// Ключ для хранения задач в localStorage
const STORAGE_KEY = 'daylist-tasks';

// Загрузка задач из localStorage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.filter(task => {
            return (
                task !== null &&
                typeof task === 'object' &&
                Number.isFinite(task.id) &&
                typeof task.title === 'string' &&
                task.title.trim() !== '' &&
                typeof task.date === 'string' &&
                (task.date === '' || /^\d{4}-\d{2}-\d{2}$/.test(task.date)) &&
                typeof task.completed === 'boolean'
            );
        });

    } catch (error) {
        console.error('Не удалось загрузить задачи:', error);
        return [];
    }
}

// Сохранение задач в localStorage
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Не удалось сохранить задачи:', error);
    }
}

// Массив задач загружается при запуске приложения
const tasks = loadTasks();
let draggedTaskId = null;

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) {
        return 'Без срока';
    }

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Проверка, является ли задача просроченной
function isTaskOverdue(task) {
    if (!task.date || task.completed) {
        return false;
    }

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('-');

    return task.date < todayString;
}

// Создание формы редактирования задачи
function createEditForm(task) {
    const editForm = createElement('form', 'task-edit-form');

    // Поле названия
    const titleField = createElement('div', 'form-field');

    const titleLabel = createElement(
        'label',
        'form-label',
        'Название задачи'
    );

    const titleInput = createElement('input', 'form-input');
    titleInput.type = 'text';
    titleInput.value = task.title;
    titleInput.maxLength = 100;
    titleInput.required = true;

    titleLabel.htmlFor = `edit-title-${task.id}`;
    titleInput.id = `edit-title-${task.id}`;

    titleField.append(titleLabel, titleInput);

    // Поле даты
    const dateField = createElement('div', 'form-field');

    const dateLabel = createElement(
        'label',
        'form-label',
        'Срок выполнения'
    );

    const dateInput = createElement('input', 'form-input');
    dateInput.type = 'date';
    dateInput.value = task.date;
    dateLabel.htmlFor = `edit-date-${task.id}`;
    dateInput.id = `edit-date-${task.id}`;

    dateField.append(dateLabel, dateInput);

    // Кнопки формы
    const actions = createElement('div', 'task-edit-actions');

    const saveButton = createElement(
        'button',
        'button button-primary',
        'Сохранить'
    );
    saveButton.type = 'submit';

    const cancelButton = createElement(
        'button',
        'button task-edit-cancel',
        'Отмена'
    );
    cancelButton.type = 'button';

    actions.append(saveButton, cancelButton);
    editForm.append(titleField, dateField, actions);

    // Сохранение изменений
    editForm.addEventListener('submit', event => {
        event.preventDefault();

        const newTitle = titleInput.value.trim();

        if (!newTitle) {
            titleInput.focus();
            return;
        }

        task.title = newTitle;
        task.date = dateInput.value;

        saveTasks();
        renderTasks();
    });

    // Отмена редактирования
    cancelButton.addEventListener('click', () => {
        renderTasks();
    });

    return editForm;
}


// Создание карточки задачи
function createTaskElement(task) {
    const taskCard = createElement('article', 'task-card');
    taskCard.dataset.taskId = task.id;

    taskCard.draggable = canReorderTasks();

    if (task.completed) {
        taskCard.classList.add('task-card--completed');
    }

    if (isTaskOverdue(task)) {
        taskCard.classList.add('task-card--overdue');
    }

    const taskContent = createElement('div', 'task-card-content');

    const taskTitle = createElement(
        'h3',
        'task-card-title',
        task.title
    );

    const taskDateText = isTaskOverdue(task)
        ? `Просрочено · ${formatDate(task.date)}`
        : formatDate(task.date);

    const taskDate = createElement(
        'p',
        'task-card-date',
        taskDateText
    );

    taskContent.append(taskTitle, taskDate);

    const taskActions = createElement('div', 'task-card-actions');

    // Чекбокс выполнения
    const completionContainer = createElement(
        'div',
        'task-completion'
    );

    const completionCheckbox = createElement(
        'input',
        'task-checkbox'
    );

    completionCheckbox.type = 'checkbox';
    completionCheckbox.id = `task-completion-${task.id}`;
    completionCheckbox.checked = task.completed;

    const completionLabel = createElement(
        'label',
        'task-completion-label',
        task.completed ? 'Выполнена' : 'Выполнить'
    );

    completionLabel.htmlFor = completionCheckbox.id;

    completionCheckbox.addEventListener('change', () => {
        task.completed = completionCheckbox.checked;

        saveTasks();
        renderTasks();
    });

    completionContainer.append(
        completionCheckbox,
        completionLabel
    );

    // Кнопка редактирования
    const editButton = createElement(
        'button',
        'button task-edit-button',
        'Изменить'
    );

    editButton.type = 'button';

    editButton.addEventListener('click', () => {
        const editForm = createEditForm(task);

        taskCard.replaceChildren(editForm);

        editForm.querySelector('input[type="text"]').focus();
    });

    // Кнопка удаления
    const deleteButton = createElement(
        'button',
        'button task-delete-button',
        'Удалить'
    );

    deleteButton.type = 'button';

    deleteButton.addEventListener('click', () => {
        deleteTask(task.id);
    });

    taskActions.append(
        completionContainer,
        editButton,
        deleteButton
    );

    taskCard.append(taskContent, taskActions);

    taskCard.addEventListener('dragstart', event => {
        if (!canReorderTasks()) {
            event.preventDefault();
            return;
        }

        draggedTaskId = String(task.id);

        event.dataTransfer.setData(
            'text/plain',
            draggedTaskId
        );

        event.dataTransfer.effectAllowed = 'move';

        taskCard.classList.add('task-card--dragging');
    });

    taskCard.addEventListener('dragover', event => {
        if (draggedTaskId === null) {
            return;
        }

        event.preventDefault();

        event.dataTransfer.dropEffect = 'move';

        taskCard.classList.add('task-card--drag-over');
    });

    taskCard.addEventListener('dragleave', event => {
        if (!taskCard.contains(event.relatedTarget)) {
            taskCard.classList.remove('task-card--drag-over');
        }
    });

    taskCard.addEventListener('drop', event => {
        event.preventDefault();

        const draggedId = event.dataTransfer.getData('text/plain');

        if (!draggedId || draggedId === String(task.id)) {
            return;
        }

        const cardMiddle = taskCard.getBoundingClientRect().top +
            taskCard.getBoundingClientRect().height / 2;

        const insertAfter = event.clientY > cardMiddle;

        moveTask(draggedId, task.id, insertAfter);
    });

    taskCard.addEventListener('dragend', () => {
        draggedTaskId = null;
        taskCard.classList.remove('task-card--dragging');
    });

    return taskCard;
}


// Отрисовка списка задач
function renderTasks() {
    taskList.replaceChildren();

    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    taskStats.textContent =
        `Всего задач: ${tasks.length} · Выполнено: ${completedCount}`;

    const searchQuery = searchInput.value.trim().toLowerCase();

    const selectedStatus = filterSelect.value;

    const selectedSort = sortSelect.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery);

        const matchesStatus =
            selectedStatus === 'all' ||
            (selectedStatus === 'active' && !task.completed) ||
            (selectedStatus === 'completed' && task.completed);

        return matchesSearch && matchesStatus;
    });

    if (tasks.length === 0) {
        emptyState.hidden = false;
        emptyState.textContent = 'Пока здесь нет задач. Добавь первую!';
        return;
    }

    if (filteredTasks.length === 0) {
        emptyState.hidden = false;
        emptyState.textContent = 'Задачи не найдены.';
        return;
    }

    const sortedTasks = [...filteredTasks];

    if (selectedSort === 'date-asc') {
        sortedTasks.sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;

            return a.date.localeCompare(b.date);
        });

    } else if (selectedSort === 'date-desc') {
        sortedTasks.sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;

            return b.date.localeCompare(a.date);
        });
    }


    emptyState.hidden = true;

    sortedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.append(taskElement);
    });
}

// Добавление новой задачи
function addTask(title, date) {
    const task = {
        id: Date.now(),
        title: title,
        date: date,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();
}

// Удаление задачи
function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return;
    }

    tasks.splice(taskIndex, 1);

    saveTasks();
    renderTasks();
}

// Проверка возможности изменения порядка задач
function canReorderTasks() {
    return (
        searchInput.value.trim() === '' &&
        filterSelect.value === 'all' &&
        sortSelect.value === 'default'
    );
}

// Изменение порядка задач
function moveTask(draggedId, targetId, insertAfter) {
    const draggedIndex = tasks.findIndex(
        task => String(task.id) === draggedId
    );

    const targetIndex = tasks.findIndex(
        task => String(task.id) === String(targetId)
    );

    if (
        draggedIndex === -1 ||
        targetIndex === -1 ||
        draggedIndex === targetIndex
    ) {
        return;
    }

    const [draggedTask] = tasks.splice(draggedIndex, 1);

    const newTargetIndex = tasks.findIndex(
        task => String(task.id) === String(targetId)
    );

    const insertIndex = insertAfter
        ? newTargetIndex + 1
        : newTargetIndex;

    tasks.splice(insertIndex, 0, draggedTask);

    saveTasks();

    draggedTaskId = null;
    renderTasks();
}

// Обработка отправки формы добавления задачи
taskForm.addEventListener('submit', event => {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const date = taskDateInput.value;

    if (!title) {
        taskTitleInput.focus();
        return;
    }

    addTask(title, date);

    taskForm.reset();
    taskTitleInput.focus();
});

// Обработка поиска задач
searchInput.addEventListener('input', () => {
    renderTasks();
});

// Обработка фильтрации задач по статусу
filterSelect.addEventListener('change', () => {
    renderTasks();
});

// Обработка сортировки задач по дате
sortSelect.addEventListener('change', () => {
    renderTasks();
});

renderTasks();
