import { fetchAndRenderComments, addTodo } from "./api.js";
import { renderComments } from "./render.js";

export const buttonElement = document.getElementById("add-button");
export const listElement = document.getElementById("list");
export const commentElement = document.querySelector(".comments");
export const nameInputElement = document.getElementById("name-input");
export const commentInputElement = document.getElementById("comment-input");
const deleteButtonElement = document.getElementById("delete-button");
export const addSignElement = document.getElementById("add-sign"); 


window.addEventListener('load', function() {
const addSign = document.getElementById('add-sign');
const list = document.getElementById('list');
addSign.innerHTML = "Пожалуйста, подождите, загружаются комментарии...";

list.value = "";
list.style.display = "none";
return delayForSecond()
.then(() => {
	addSign.style.display = "none";
	list.style.display = "flex";
	});
});

function delayForSecond(){
	delay(3000);
	return delay();

}
function delay(interval = 2000) {
	return new Promise((resolve) => {
	setTimeout(() => {
		resolve();
	}, interval);
	});
}

export let comments = [];

fetchAndRenderComments();
// export function fetchAndRenderComments () { 

// fetch("https://wedev-api.sky.pro/api/v1/elena-uvarova/comments", {
// 	method: 'GET',
// })
// .then(response => {
//     if (!response.ok) {
//       throw new Error("Проблема с интернетом. Пожалуйста, проверьте подключение к сети");
//     }
//     return response.json();
//   })
// .then(responseData => {
// let appComments = responseData.comments.map((comment) => {
// return {
// 	name: comment.author.name,
// 	date: new Date(comment.date).toLocaleTimeString('sm', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(", ", " "),
// 	comment: comment.text,
// 	like: comment.likes,
// 	userLike: false,
// 	isEdit: false,
// 	forceError: false,
// 	};
// });

// 	comments = appComments;
// 	return renderComments(comments);
// 	})
// 	.catch(error => {
//   if (error instanceof TypeError && error.message === "NetworkError when attempting to fetch resource") {
//     alert("Похоже, у вас проблемы с интернет-соединением. Пожалуйста, проверьте подключение к сети и попробуйте снова.");
//   } else {
//     alert("Проблема с интернетом");
// 	 console.warn(error);
//   }
//   renderComments();
//   });

// }




// function addTodo() {
// 	fetch("https://wedev-api.sky.pro/api/v1/elena-uvarova/comments", {
//     method: "POST",
//     body: JSON.stringify({
//       name: nameInputElement.value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll(" ", "&nbsp;"),
//       text: commentInputElement.value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll(" ", "&nbsp;"),
//       forceError: true,
//     }),
//   })
// 		.then((response) => {
// 			if (response.status === 500) {
// 				throw new Error("Ошибка сервера. Повторите позже");
// 			}
			
// 			if (response.status === 400) {
// 				throw new Error(alert("Имя и комментарий должны быть не короче 3-х символов"));
// 			}

// 			if (response.status === 201) {
// 				return response.json();
// 			}
// 		})

// 		.then((responseData) => {
// 		return fetchAndRenderComments();
// 	})
// 		.then((data) => {
// 			buttonElement.disabled = false;
// 			buttonElement.textContent = "Написать";
// 			nameInputElement.value = "";
// 			commentInputElement.value = "";
// 			nameInputElement.disabled = false;
// 			commentInputElement.disabled = false;
// 			buttonElement.disabled = false;
// 			nameInputElement.focus();
// 		}).catch((error) => {
// 			buttonElement.disabled = false;
// 			buttonElement.textContent = "Написать";
			
// 			nameInputElement.disabled = false;
// 			commentInputElement.disabled = false;
// 			buttonElement.disabled = false;
// 			nameInputElement.focus();

// 			console.warn(error);

// 			if (error.message === "Ошибка сервера. Повторите позже"){
// 				alert("Ошибка сервера.");
// 				addTodo();
// 			}

// 		fetchAndRenderComments();
				
// 			postMessage();
			
// 				nameInputElement.value = "";
// 				commentInputElement.value = "";

				
// renderComments();
// 		})
		
// 	}
	nameInputElement.addEventListener('input', function() {
  nameInputElement.classList.remove("error");
});

commentInputElement.addEventListener('input', function() {
  commentInputElement.classList.remove("error");
});

buttonElement.addEventListener("click", () => {
  nameInputElement.classList.remove("error");
  commentInputElement.classList.remove("error");
  

  if (nameInputElement.value.trim() === "") { 
    nameInputElement.classList.add("error");
    return;
  }
  if (commentInputElement.value.trim() === "") {
    commentInputElement.classList.add("error");
    return;
  }

 

	buttonElement.disabled = true;
	buttonElement.textContent = "Комментарий добавляется...";
	addTodo();
	renderComments(comments);
});
// fetchAndRenderComments();




export function likes (comments) {
  function delay2(interval = 300) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  }

  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = likeButton.dataset.index;
      const comment = comments[index];

      likeButton.classList.add("animating"); 

      delay2(2000) 
        .then(() => {
          likeButton.classList.remove("animating");

          if (!comment.userLike) {
            comment.filling = "-active-like";
            comment.like += 1;
            comment.userLike = true;
          } else {
            comment.filling = "";
            comment.like -= 1;
            comment.userLike = false;
          }
          renderComments(comments);
        });
    });
  }
};
likes(comments);
// renderComments(comments);

export function handleEdit (comments) {
	const handleEditElements = document.querySelectorAll(".editing");
	for ( const handleEditElement of handleEditElements) {
		handleEditElement.addEventListener("click" , (event) => {
		event.stopPropagation();
  comments[index].isEdit = true;
  renderComments(comments);
  // Показываем кнопку "Сохранить"
  listElement.querySelectorAll('.comment')[index].querySelector('.save-button').style.display = "block";
  renderComments(comments);
	});
  }
};


function isCommentEmpty(comment) {
  const isEmpty = comment.trim() === "";
  if (isEmpty) {
    // Если комментарий пуст, добавляем класс "error" к соответствующему элементу формы
    commentInputElement.classList.add("error");
  } else {
    // Если комментарий не пуст, удаляем класс "error"
    commentInputElement.classList.remove("error");
  }
  return isEmpty;
}

export function handleSave (comments) {
	const handleSaveElements = document.querySelectorAll(".saving");
	for ( const handleSaveElement of handleSaveElements) {
		handleSaveElement.addEventListener("click" , (event) => {
			event.stopPropagation();
			const index = handleSaveElement.dataset.index;
      const comment = comments[index];
	const editedComment = listElement.querySelectorAll('.comment')[handleSaveElement.dataset.index].querySelector('.comment-input').value;
	if (isCommentEmpty(editedComment)) {
		        // Обработка ошибки или уведомление пользователю о невозможности отправить пустой комментарий
        return;
      }
	
	
	comments[index].comment = editedComment; // Обновляем комментарий в массиве
  comments[index].isEdit = false; // Устанавливаем флаг редактирования в false
  
  // Скрываем кнопку "Сохранить" после сохранения
  listElement.querySelectorAll('.comment')[index].querySelector('.save-buttons').style.display = "none";
	renderComments(comments); // Перерисовываем комментарии
		});
	}
};

// const renderComments = () => {
//   const commentsHtml = comments
//   .map((comment, index) => {
//       if (comment.isEdit) {  
//   return`
 
//     <li class="comment" data-index="${index}" >
//   <div class="comment-header">
//     <div>${comment.name}</div>
//     <div>${comment.date}</div>
    
//   </div>
//   <div class="comment-body">
//                 <div class="comment-text" >
//                   <textarea data-index="${index}" class="comment-input add-text" rows="4">${comment.comment}</textarea>
// 						<button type="submit" data-index='${index}' class="save-buttons add-form-button saving post-button">Сохранить</button> 
//                 </div>
//               </div>
//             </li>
//           `;
//   } else {
//             return `
			
//           <li class="comment">
//             <div class="comment-header">
//               <div class="comment-name">${comment.name}</div>
//               <div>${comment.date}</div>     
//           </div>
//             <div class="comment-body">
//               <div class="comment-text" data-index="${index}">
//                 <span data-index='${index}' class="comment-content">${comment.comment}</span>
// 					 <button class="edit-button add-form-button">Редактировать</button> <!-- новая кнопка -->
//               </div>        
//             </div>
        
//             <div class="comment-footer">
//               <div class="likes">
//                 <span class="likes-counter">${comment.like}</span>
//                 <button data-index='${index}' class="like-button ${comment.userLike ? "-active-like" : ""}"></button>
//               </div>  
//             </div>
//           </li>
			
//           `;
//       }
//         })
//         .join("");
//       listElement.innerHTML = commentsHtml;

//       likes();
// 		handleEdit();
// 		handleSave();
// 		editButtonsComment();
// 		commentElementsQuoted();
		
    
// };
// renderComments(comments);

export function editButtonsComment(comments) { 
const editButtons = document.querySelectorAll(".edit-button");
      editButtons.forEach((button, index) => {
        button.addEventListener("click", (event) => {
      event.stopPropagation();
          comments[index].isEdit = true;
          renderComments(comments);
        });
      });
}

export function commentElementsQuoted(comments) { 
		const commentElements = document.querySelectorAll(".comment");
commentElements.forEach((comment) => {
  comment.addEventListener('click', () => {
	
    // Получаем имя автора и текст комментария
    const author = comment.querySelector('.comment-header .comment-name').textContent;
    const text = comment.querySelector('.comment-text .comment-content').textContent;
	 	 
    // Формируем ответную цитату для вставки в поле комментария
    const quotedText = `> ${text}\n\n @${author}, `; 
    document.getElementById('comment-input').value = quotedText;
	 renderComments(comments);
		}); 
	});
}
// addCommentListener();
  
export const saveButtons = document.querySelectorAll(".save-button");
      saveButtons.forEach((button, index) => {
        button.addEventListener("click", (event) => {
      event.stopPropagation();
          const editedComment = button.parentNode.nextElementSibling.children[0].children[0].value;
          comments[index].comment = editedComment;
          comments[index].isEdit = false;
			 renderComments(comments);
        });
      });
// renderComments(comments);


export function dateData(){ 
let currentDate = new Date(formattedDate);

  let day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
  let month = currentDate.getMonth() < 10 ? '0' + currentDate.getMonth() : currentDate.getMonth();
  let year = currentDate.getFullYear().toString().slice(-2);
  let hours = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours();
  let minutes = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
	let formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
}  

export function deleteButtonElementComment() { 
  deleteButtonElement.addEventListener("click", () => {
const comments = Array.from(listElement.querySelectorAll(".comment"));

if (comments.length > 0) {
listElement.removeChild(comments[comments.length - 1]);
comments.pop(); // Удаляем последний комментарий из массива
		}
	});
}
deleteButtonElementComment()
nameInputElement.value = "";
commentInputElement.value = "";
nameInputElement.value.trim() === "" || commentInputElement.value.trim() === "";
renderComments(comments);
    document.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        buttonElement.click();
      }
    });


