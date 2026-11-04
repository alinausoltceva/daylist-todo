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
tasksSection.append(sectionTitle, taskList, emptyState);
main.append(taskForm, controls, tasksSection);

document.body.append(
    skipLink,
    header,
    main,
    notificationArea
);

// Массив задач
const tasks = [];

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

        renderTasks();
    });

    // Отмена редактирования
    cancelButton.addEventListener('click', () => {
        renderTasks();
    });

    return editForm;
}

// Создание карточки задачи

// Создание карточки задачи
function createTaskElement(task) {
    const taskCard = createElement('article', 'task-card');
    taskCard.dataset.taskId = task.id;

    // Если задача выполнена, добавляем соответствующий класс
    if (task.completed) {
        taskCard.classList.add('task-card--completed');
    }

    // Содержимое карточки
    const taskContent = createElement('div', 'task-card-content');

    const taskTitle = createElement(
        'h3',
        'task-card-title',
        task.title
    );

    const taskDate = createElement(
        'p',
        'task-card-date',
        formatDate(task.date)
    );

    taskContent.append(taskTitle, taskDate);

    // Блок действий
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

        taskCard.classList.toggle(
            'task-card--completed',
            task.completed
        );

        completionLabel.textContent = task.completed
            ? 'Выполнена'
            : 'Выполнить';
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

    // Собираем блок действий
    taskActions.append(
        completionContainer,
        editButton,
        deleteButton
    );

    // Собираем карточку
    taskCard.append(taskContent, taskActions);

    return taskCard;
}


// Отрисовка списка задач
function renderTasks() {
    taskList.replaceChildren();

    emptyState.hidden = tasks.length > 0;

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.append(taskElement);
    });
}

// Добавление новой задачи
function addTask(title, date) {
    const newTask = {
        id: Date.now(),
        title: title,
        date: date,
        completed: false
    };

    tasks.push(newTask);

    renderTasks();
}

// Удаление задачи
function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return;
    }

    tasks.splice(taskIndex, 1);

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

renderTasks();
