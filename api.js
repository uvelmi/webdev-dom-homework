import {comments, buttonElement, nameInputElement, commentInputElement} from "./main.js"
import { renderComments } from "./render.js";

export function fetchAndRenderComments () { 

	fetch("https://wedev-api.sky.pro/api/v1/elena-uvarova/comments", {
		method: 'GET',
	})
	.then((response) => {
		 const jsonPromise = response.json();
		 jsonPromise.then((responseData) => {
	let appComments = responseData.comments.map((comment) => {
	return {
		name: comment.author.name,
		date: new Date(comment.date).toLocaleTimeString('sm', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(", ", " "),
		comment: comment.text,
		like: comment.likes,
		userLike: false,
		isEdit: false,
		// forceError: false,
		}
	});
	
		let comments = appComments;
		return renderComments(comments);
		})
	})	
		.catch((error) => {
		 alert("Похоже, у вас проблемы с интернет-соединением. Пожалуйста, проверьте подключение к сети и попробуйте снова.");
		 console.warn(error);
	});
}	
	
export function addTodo(text) {
	 fetch("https://wedev-api.sky.pro/api/v1/elena-uvarova/comments", {
		 method: "POST",
		 body: JSON.stringify({
			name: nameInputElement.value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll(" ", "&nbsp;"),
			text: commentInputElement.value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll(" ", "&nbsp;"),
			forceError: true,
		 }),
	  })
			.then((response) => {
				if (response.status === 500) {
					throw new Error("Ошибка сервера. Повторите позже");
				}
				
				if (response.status === 400) {
					throw new Error(alert("Имя и комментарий должны быть не короче 3-х символов"));
				}
	
				if (response.status === 201) {
					return response.json();
				}
			})
	
			.then((response) => {
			return fetchAndRenderComments();
		})
			.then(() => {
				buttonElement.disabled = false;
				buttonElement.textContent = "Написать";
				nameInputElement.value = "";
				commentInputElement.value = "";
				nameInputElement.disabled = false;
				commentInputElement.disabled = false;
				buttonElement.disabled = false;
				nameInputElement.focus();
			}).catch((error) => {
				buttonElement.disabled = false;
				buttonElement.textContent = "Написать";
				
				nameInputElement.disabled = false;
				commentInputElement.disabled = false;
				buttonElement.disabled = false;
				nameInputElement.focus();
	
				console.warn(error);
	
				if (error.message === "Ошибка сервера. Повторите позже"){
					alert("Ошибка сервера.");
					addTodo(text);
				} else {
					alert('Пожалуйста, проверьте подключение к сети и попробуйте снова.');
				}
				postMessage(error);
	})
}