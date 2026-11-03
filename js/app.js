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


// Создание шапки приложения
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


// Создание основной области приложения
const main = createElement('main', 'app-main');


// Создание секции со списком задач
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
    'Здесь будут отображаться твои задачи.'
);

sectionHeader.append(sectionTitle, sectionDescription);


// Контейнер для будущего списка задач
const taskList = createElement('div', 'task-list');
taskList.id = 'task-list';


// Сообщение, которое будет отображаться при отсутствии задач
const emptyState = createElement('div', 'empty-state');

const emptyStateTitle = createElement(
    'h3',
    'empty-state-title',
    'Пока здесь пусто'
);

const emptyStateDescription = createElement(
    'p',
    'empty-state-description',
    'Добавленные задачи появятся в этом разделе.'
);

emptyState.append(emptyStateTitle, emptyStateDescription);


// Область для уведомлений приложения
const notificationArea = createElement('div', 'notification-area');
notificationArea.id = 'notification-area';
notificationArea.setAttribute('role', 'status');
notificationArea.setAttribute('aria-live', 'polite');


// Сборка секции со списком задач
tasksSection.append(
    sectionHeader,
    taskList,
    emptyState
);


// Сборка основной области
main.append(tasksSection);


// Сборка приложения
app.append(header, main, notificationArea);


// Добавление приложения на страницу
document.body.append(app);