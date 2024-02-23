import { renderApp, token } from './render.js'

const host = 'https://wedev-api.sky.pro/api/v2/elena-uvarova/comments'

export function fetchAndRenderComments(renderLoginComponent) {
    fetch(host, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }
            return response.json()
        })
        .then((responseData) => {
            let appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date)
                        .toLocaleTimeString('sm', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        .replace(', ', ' '),
                    comment: comment.text,
                    like: comment.likes,
                    user: comment.user,
                    userLike: false,
                    isEdit: false,
                    id: comment.id,
                }
            })

            let comments = appComments
            return renderApp(comments)
        })
}

export function addTodo(savedUserName, commentInputElement, buttonElement) {
    fetch(host, {
        method: 'POST',
        body: JSON.stringify({
            name: savedUserName.value,
            text: commentInputElement.value
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll(' ', '&nbsp;'),
            forceError: true,
        }),
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Ошибка сервера. Повторите позже')
            }

            if (response.status === 400) {
                throw new Error(
                    alert(
                        'Имя и комментарий должны быть не короче 3-х символов',
                    ),
                )
            }

            if (response.status === 201) {
                return response.json()
            }
        })

        .then((response) => {
            return fetchAndRenderComments()
        })
        .then(() => {
            buttonElement.disabled = false
            buttonElement.textContent = 'Написать'
            commentInputElement.value = ''
            commentInputElement.disabled = false
            buttonElement.disabled = false
        })
        .catch((error) => {
            buttonElement.disabled = false
            buttonElement.textContent = 'Написать'
            commentInputElement.disabled = false
            buttonElement.disabled = false
            console.warn(error)

            if (error.message === 'Ошибка сервера. Повторите позже') {
                alert('Ошибка сервера.')
                addTodo(text)
            } else {
                alert(
                    'Пожалуйста, проверьте подключение к сети и попробуйте снова.',
                )
            }
            postMessage(error)
        })
}

export function loginUser({ login, password }) {
    return fetch('https://wedev-api.sky.pro/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error('Неверный логин или пароль')
            }
            return response.json()
        })

        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                alert('Кажется, у вас сломался интернет, попробуйте позже')
            }
            return loginUser({ login, password })
        })
}

export function registerUser({ name, login, password }) {
    return fetch('https://wedev-api.sky.pro/api/user', {
        method: 'POST',
        body: JSON.stringify({
            name,
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Такой пользователь уже существует')
        }
        return response.json()
    })
}
