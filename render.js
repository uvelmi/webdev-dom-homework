import {
    saveButtons,
    likes,
    handleEdit,
    handleSave,
    editButtonsComment,
    commentElementsQuoted,
} from './main.js'
import { addTodo, fetchAndRenderComments } from './api.js'
import { renderLoginComponent } from './components/login-components.js'
export const buttonElement = document.getElementById('add-button')
export const nameInputElement = document.getElementById('name-input')

export let token =
    'Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k'
token = null
export let user = localStorage.getItem('user')

export function setUser(newUser) {
    user = newUser
}

const renderApp = (comments) => {
    const appEl = document.getElementById('app')

    const commentsHtml = comments
        .map((comment, index) => {
            if (comment.isEdit) {
                return `
	  <li class="comment" data-index="${index}" >
	<div class="comment-header">
	  <div>${comment.name} </div>
	  <div>${comment.date}</div>
	  
	</div>
	<div class="comment-body">
					  <div class="comment-text" >
						 <textarea data-index="${index}" class="comment-input add-text" rows="4">${comment.comment}</textarea>
						 <button type="submit" data-index='${index}' class="save-buttons add-form-button saving post-button">Сохранить</button> 
					  </div>
					</div>
				 </li>
			  `
            } else {
                return `
			  <li class="comment" data-index="${index}">
				 <div class="comment-header">
					<div class="comment-name" data-index='${index}'>${comment.name}</div>
					<div>${comment.date}</div>     
			  </div>
				 <div class="comment-body">
					<div class="comment-text" data-index="${index}">
					  <span data-index='${index}' class="comment-content">${comment.comment}</span>
					  ${
                          !token
                              ? ''
                              : `<button class="edit-button add-form-button">Редактировать</button>`
                      }
					</div>        
				 </div>
				 <div class="comment-footer">
				 ${
                     !token
                         ? `<div class="likes">
					  <span disabled class="likes-counter">${comment.like}</span>
					  <button disabled data-index='${index}' class="like-button ${
                          comment.userLike ? '-active-like' : ''
                      }"></button>
					</div> `
                         : `<div class="likes">
					  <span class="likes-counter">${comment.like}</span>
					  <button data-index='${index}' class="like-button ${
                          comment.userLike ? '-active-like' : ''
                      }"></button>
					</div>`
                 }  
				 </div>
			  </li>
			  `
            }
        })
        .join('')

    const appHtml = `
	<div class="container">
	<div id="add-sign"></div>

	<ul class="comments" id="list">
	  <!-- Список рендерится из Js -->
	  ${commentsHtml}
	</ul>
	${
        !token
            ? `<div class="form-registration">
		<p>Чтобы добавить комментарий <a id="login-link" 
		class="form-registration-text" href="#" >авторизуйтесь</a></p>
	  </div>`
            : `<div class="add-form">
	  <input disabled
		 type="text"
		 class="add-form-name user-name"
		 placeholder="${user}" 
		 id="name-input"
	  />
	  <textarea
		 type="textarea"
		 class="add-form-text"
		 placeholder="Введите ваш коментарий"
		 rows="4"
		 id="comment-input"
	  ></textarea>
	  <div class="add-form-row">
		 <button type="submit" id="add-button" class="add-form-button post-button">Написать</button>
		 <button id="delete-button" class="delete-button add-form-button">Удалить</button>
	  </div>
	</div>
	`
    }
	</div>
 </div>`
    appEl.innerHTML = appHtml

    document.addEventListener('DOMContentLoaded', () => {
        const nameInputElement = document.getElementById('name-input')
        const savedUsername = localStorage.getItem('user')

        if (savedUsername) {
            nameInputElement.value = savedUsername
        }
        renderApp(comments)
    })

    const linkToLogin = document.getElementById('login-link')
    linkToLogin?.addEventListener('click', () => {
        renderLoginComponent({
            appEl,
            setToken: (newToken) => {
                token = newToken
            },
            fetchAndRenderComments,
        })
        return
    })

    likes(comments)
    handleEdit(comments)
    handleSave(comments)
    editButtonsComment(comments)
    commentElementsQuoted(comments)
    saveButtons(comments)

    const buttonElement = document.getElementById('add-button')
    const nameInputElement = document.getElementById('name-input')
    buttonElement?.addEventListener('click', () => {
        const commentInputElement = document.getElementById('comment-input')
        commentInputElement.addEventListener('input', function () {
            commentInputElement.classList.remove('error')
        })
        let savedUserName = localStorage.getItem('user')

        if (commentInputElement.value.trim() === '') {
            commentInputElement.classList.add('error')
            return
        }
        if (savedUserName) {
            nameInputElement.value = savedUserName
        }
        nameInputElement.classList.remove('error')
        commentInputElement.classList.remove('error')

        buttonElement.disabled = true
        buttonElement.textContent = 'Комментарий добавляется...'
        addTodo(savedUserName, commentInputElement, buttonElement)
    })

    const deleteButtons = document.querySelectorAll('.delete-button')
    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation()
            if (comments.length > 0) {
                comments.pop()
                renderApp(comments)
            }
        })
    }
}

export { renderApp }
