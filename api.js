import { renderApp, token } from './render.js'
import { format } from 'date-fns'
const host = 'https://wedev-api.sky.pro/api/v2/elena-uvarova/comments'

export function fetchAndRenderComments() {
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
                const formattedDate = format(
                    new Date(comment.date),
                    'dd.MM.yyyy hh:mm:ss',
                )

                return {
                    name: comment.author.name,
                    date: formattedDate,
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

        .then(() => {
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
                addTodo()
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
                throw new Error(
                    'Кажется, у вас сломался интернет, попробуйте позже',
                )
            }
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
