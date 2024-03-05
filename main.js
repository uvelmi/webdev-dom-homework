import { fetchAndRenderComments } from './api.js'
import { renderApp } from './render.js'

import './api.js'
import './render.js'
import './webpack.config.js'
import './components/login-components.js'

export const listElement = document.getElementById('list')
export const commentElement = document.querySelector('.comments')
export const nameInputElement = document.getElementById('name-input')
export const commentInputElement = document.getElementById('comment-input')

export const addSignElement = document.getElementById('add-sign')

window.addEventListener('load', function () {
    const addSign = document.getElementById('add-sign')
    const list = document.getElementById('list')
    if (addSign && list) {
        addSign.innerHTML = 'Пожалуйста, подождите, загружаются комментарии...'
        list.value = ''
        list.style.display = 'none'

        return delayForSecond().then(() => {
            addSign.style.display = 'none'
            list.style.display = 'flex'
        })
    }
})

function delayForSecond() {
    return delay(3000)
}

function delay(interval = 2000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

export let comments = []

fetchAndRenderComments()

export function likes(comments) {
    function delay2(interval = 300) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, interval)
        })
    }

    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const index = likeButton.dataset.index
            const comment = comments[index]

            likeButton.classList.add('animating')

            delay2(2000).then(() => {
                likeButton.classList.remove('animating')

                if (!comment.userLike) {
                    comment.filling = '-active-like'
                    comment.like += 1
                    comment.userLike = true
                } else {
                    comment.filling = ''
                    comment.like -= 1
                    comment.userLike = false
                }
                renderApp(comments)
            })
        })
    }
}
likes(comments)

export function handleEdit(comments, index) {
    const handleEditElements = document.querySelectorAll('.editing')
    for (const handleEditElement of handleEditElements) {
        handleEditElement.addEventListener('click', (event) => {
            event.stopPropagation()
            comments[index].isEdit = true
            renderApp(comments)
            listElement
                .querySelectorAll('.comment')
                [index].querySelector('.save-button').style.display = 'block'
            renderApp(comments)
        })
    }
}

function isCommentEmpty(comment) {
    const commentInputElement = document.getElementById('comment-input')
    const isEmpty = comment.trim() === ''
    if (isEmpty) {
        commentInputElement.classList.add('error')
    } else {
        commentInputElement.classList.remove('error')
    }
    return isEmpty
}

export function handleSave(comments) {
    const handleSaveElements = document.querySelectorAll('.saving')
    for (const handleSaveElement of handleSaveElements) {
        handleSaveElement.addEventListener('click', (event) => {
            event.stopPropagation()
            const index = handleSaveElement.dataset.index
            // const comment = comments[index]
            const listElement = document.getElementById('list')
            const editedComment = listElement
                .querySelectorAll('.comment')
                [
                    handleSaveElement.dataset.index
                ].querySelector('.comment-input').value
            if (isCommentEmpty(editedComment)) {
                return
            }
            comments[index].comment = editedComment
            comments[index].isEdit = false

            listElement
                .querySelectorAll('.comment')
                [index].querySelector('.save-buttons').style.display = 'none'
            renderApp(comments)
        })
    }
}

export function editButtonsComment(comments) {
    const editButtons = document.querySelectorAll('.edit-button')
    editButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation()
            comments[index].isEdit = true
            renderApp(comments)
        })
    })
}

export function commentElementsQuoted(comments, token) {
    let commentElements = document.querySelectorAll('.comment')

    for (const commentsElement of commentElements) {
        commentsElement.addEventListener('click', () => {
            const indexQuoted = commentsElement.dataset.index
            const commentInputElement = document.getElementById('comment-input')
            if (!token) {
                if (commentInputElement) {
                    if (!comments[indexQuoted].isEdit) {
                        commentInputElement.value = `${comments[
                            indexQuoted
                        ].comment.replaceAll('&nbsp;', ' ')}\n\n @ ${comments[
                            indexQuoted
                        ].name.replaceAll('&nbsp;', ' ')},`
                    }
                }
            }
            return
        })
    }
}

export function saveButtons(comments) {
    const saveButtons = document.querySelectorAll('.save-button')
    saveButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation()
            const editedComment =
                button.parentNode.nextElementSibling.querySelector(
                    '.comment-input',
                ).value
            comments[index].comment = editedComment
            comments[index].isEdit = false
            renderApp(comments)
        })
    })
}
document.addEventListener('keyup', (event, buttonElement) => {
    if (event.key === 'Enter') {
        buttonElement.click()
    }
})
