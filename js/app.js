// Подключение таблицы стилей
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

    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}


// Создание основного контейнера приложения
const app = createElement('div', 'app');
app.id = 'app';


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


// Секция со списком задач
const tasksSection = createElement('section', 'tasks-section');
tasksSection.setAttribute('aria-labelledby', 'tasks-heading');


// Заголовок секции
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


// Поле названия задачи
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
searchInput.setAttribute('aria-label', 'Поиск задач по названию');

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
    const option = createElement(
        'option',
        '',
        optionData.text
    );

    option.value = optionData.value;
    filterSelect.append(option);
});

filterGroup.append(filterLabel, filterSelect);


// Сортировка задач по дате
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
    const option = createElement(
        'option',
        '',
        optionData.text
    );

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


// Контейнер будущего списка задач
const taskList = createElement('div', 'task-list');
taskList.id = 'task-list';


// Сообщение при отсутствии задач
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


// Область для уведомлений приложения
const notificationArea = createElement('div', 'notification-area');
notificationArea.id = 'notification-area';
notificationArea.setAttribute('role', 'status');
notificationArea.setAttribute('aria-live', 'polite');


// Сборка секции задач
tasksSection.append(
    sectionHeader,
    taskForm,
    taskControls,
    taskList,
    emptyState
);


// Сборка основной области
main.append(tasksSection);


// Сборка приложения
app.append(
    header,
    main,
    notificationArea
);


// Добавление приложения на страницу
document.body.append(app);


// Предотвращение перезагрузки страницы при отправке формы
taskForm.addEventListener('submit', event => {
    event.preventDefault();
});