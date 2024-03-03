import { setUser } from '../render.js'
import { loginUser, registerUser } from '../api.js'

export function renderLoginComponent({ setToken, fetchAndRenderComments }) {
    let isLoginMode = true

    function renderForm() {
        const appHtml = `<div class="container" id="register">

	<div class="add-form">
		<h3 class="add-form-title">Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
		${
            isLoginMode
                ? ''
                : `<input type="text" class="add-form-name add-name add-name" placeholder="Введите имя" id="name-input"/>`
        }
		<input
		  type="text"
		  class="add-form-name add-name"
		  placeholder="Введите логин"
		  id="login-input"
		/>
		<input
		  type="password"
		  class="add-form-text add-name"
		  placeholder="Введите пароль"
		  rows="4"
		  id="password-input"
		/>
	 
		<div class="add-form-row">
		 <button type="submit" id="login-button" class="add-form-button post-button">${
             isLoginMode ? 'Войти' : 'Зарегистрироваться'
         }</button>
		  
		</div>
		<div class="add-form-row">
		 <button type="submit" id="toggle-button" class="add-form-button post-button">${
             isLoginMode ? 'Зарегистрироваться ' : 'Войти'
         }</button>
		</div>
</div>`

        const appEl = document.getElementById('app')

        appEl.innerHTML = appHtml

        document
            .getElementById('login-button')
            .addEventListener('click', () => {
                if (isLoginMode) {
                    const login = document.getElementById('login-input').value
                    const password =
                        document.getElementById('password-input').value
                    // setToken("Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k");
                    if (!login) {
                        alert('Введите логин')
                        return
                    }
                    if (!password) {
                        alert('Введите пароль')
                        return
                    }

                    loginUser({
                        login: login,
                        password: password,
                    })
                        .then((user) => {
                            localStorage.setItem('user', user.user.name)
                            setToken(`Bearer ${user.user.token}`)
                            setUser(user.user.name)
                            fetchAndRenderComments()
                        })
                        .catch((error) => {
                            alert(error.message)
                        })
                } else {
                    const name = document.getElementById('name-input').value
                    const login = document.getElementById('login-input').value
                    const password =
                        document.getElementById('password-input').value

                    if (!name) {
                        alert('Введите имя')
                        return
                    }
                    if (!login) {
                        alert('Введите логин')
                        return
                    }
                    if (!password) {
                        alert('Введите пароль')
                        return
                    }

                    registerUser({
                        name: name,
                        login: login,
                        password: password,
                    })
                        .then((user) => {
                            setToken(`Bearer ${user.user.token}`)
                            fetchAndRenderComments()
                        })
                        .catch((error) => {
                            alert(error.message)
                        })
                }
            })

        document
            .getElementById('toggle-button')
            .addEventListener('click', () => {
                isLoginMode = !isLoginMode
                renderForm()
            })
    }
    renderForm()
}
