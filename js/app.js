// Подключение таблицы стилей

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = './css/styles.css';
document.head.appendChild(stylesheet);


// Вспомогательная функция создания элементов

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


// Создание основного контейнера

const app = createElement('div', 'app');
app.id = 'app';

// Ссылка для быстрого перехода к содержимому
const skipLink = createElement(
    'a',
    'skip-link',
    'Перейти к основному содержимому'
);

skipLink.href = '#main-content';


// Шапка приложения

const header = createElement('header', 'app-header');

const brand = createElement('div', 'brand');

const title = createElement('h1', 'brand-title', 'Daylist');

const subtitle = createElement(
    'p',
    'brand-subtitle',
    'Планируй день. Выполняй задуманное.'
);

brand.append(title, subtitle);
header.append(brand);


// Основная область приложения

const main = createElement('main', 'app-main');
main.id = 'main-content';


const tasksSection = createElement('section', 'tasks-section');

tasksSection.setAttribute('aria-labelledby', 'tasks-heading');

const sectionHeader = createElement('div', 'section-header');

const sectionTitle = createElement(
    'h2',
    'section-title',
    'Мои задачи'
);

sectionTitle.id = 'tasks-heading';

const sectionDescription = createElement(
    'p',
    'section-description',
    'Все дела в одном месте — ничего не забудь.'
);

sectionHeader.append(sectionTitle, sectionDescription);


// Форма добавления задачи
const taskForm = createElement('form', 'task-form');
taskForm.id = 'task-form';

const taskTitleGroup = createElement('div', 'form-group');

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
taskTitleInput.placeholder = 'Например, подготовить презентацию';
taskTitleInput.required = true;
taskTitleInput.maxLength = 100;

taskTitleGroup.append(taskTitleLabel, taskTitleInput);


// Поле даты выполнения
const taskDateGroup = createElement('div', 'form-group');

const taskDateLabel = createElement(
    'label',
    'form-label',
    'Дата выполнения'
);

taskDateLabel.htmlFor = 'task-date';

const taskDateInput = createElement('input', 'form-input');

taskDateInput.type = 'date';
taskDateInput.id = 'task-date';
taskDateInput.name = 'date';

taskDateGroup.append(taskDateLabel, taskDateInput);


// Кнопка добавления задачи
const addTaskButton = createElement(
    'button',
    'add-task-button',
    'Добавить задачу'
);

addTaskButton.type = 'submit';


// Сборка формы
taskForm.append(
    taskTitleGroup,
    taskDateGroup,
    addTaskButton
);


// Панель поиска, фильтрации и сортировки

const taskControls = createElement('div', 'task-controls');


// Поле поиска
const searchGroup = createElement('div', 'control-group search-group');

const searchLabel = createElement(
    'label',
    'control-label',
    'Поиск'
);

searchLabel.htmlFor = 'task-search';

const searchInput = createElement('input', 'form-input');

searchInput.type = 'search';
searchInput.id = 'task-search';
searchInput.name = 'search';
searchInput.placeholder = 'Найти задачу...';
searchInput.setAttribute(
    'aria-label',
    'Поиск задач по названию'
);

searchGroup.append(searchLabel, searchInput);


// Фильтр задач
const filterGroup = createElement('div', 'control-group');

const filterLabel = createElement(
    'label',
    'control-label',
    'Показать'
);

filterLabel.htmlFor = 'task-filter';

const filterSelect = createElement('select', 'form-input');

filterSelect.id = 'task-filter';
filterSelect.name = 'filter';

const filterOptions = [
    { value: 'all', text: 'Все задачи' },
    { value: 'active', text: 'Активные' },
    { value: 'completed', text: 'Выполненные' }
];

filterOptions.forEach(optionData => {
    const option = createElement('option', '', optionData.text);

    option.value = optionData.value;

    filterSelect.append(option);
});

filterGroup.append(filterLabel, filterSelect);


// Сортировка задач
const sortGroup = createElement('div', 'control-group');

const sortLabel = createElement(
    'label',
    'control-label',
    'Сортировка'
);

sortLabel.htmlFor = 'task-sort';

const sortSelect = createElement('select', 'form-input');

sortSelect.id = 'task-sort';
sortSelect.name = 'sort';

const sortOptions = [
    { value: 'default', text: 'По умолчанию' },
    { value: 'date-asc', text: 'Сначала ближайшие' },
    { value: 'date-desc', text: 'Сначала поздние' }
];

sortOptions.forEach(optionData => {
    const option = createElement('option', '', optionData.text);

    option.value = optionData.value;

    sortSelect.append(option);
});

sortGroup.append(sortLabel, sortSelect);


// Сборка панели управления
taskControls.append(
    searchGroup,
    filterGroup,
    sortGroup
);


// Контейнер списка задач
const taskList = createElement('div', 'task-list');
taskList.id = 'task-list';

taskList.setAttribute('aria-live', 'polite');


// Пустое состояние
const emptyState = createElement('div', 'empty-state');

const emptyStateTitle = createElement(
    'h3',
    'empty-state-title',
    'Пока здесь пусто'
);

const emptyStateDescription = createElement(
    'p',
    'empty-state-description',
    'Добавь первую задачу, чтобы начать планировать свой день.'
);

emptyState.append(
    emptyStateTitle,
    emptyStateDescription
);


// Область уведомлений
const notificationArea = createElement('div', 'notification-area');

notificationArea.id = 'notification-area';

notificationArea.setAttribute('role', 'status');
notificationArea.setAttribute('aria-live', 'polite');


// Сборка интерфейса
tasksSection.append(
    sectionHeader,
    taskForm,
    taskControls,
    taskList,
    emptyState
);

main.append(tasksSection);

app.append(
    skipLink,
    header,
    main,
    notificationArea
);

document.body.append(app);


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


// Создание карточки задачи

function createTaskElement(task) {
    const taskCard = createElement('article', 'task-card');

    taskCard.dataset.taskId = task.id;


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


    taskCard.append(
        taskTitle,
        taskDate
    );

    return taskCard;
}


// Отображение списка задач

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


// Обработка отправки формы

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