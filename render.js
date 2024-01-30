import { comments, saveButtons, listElement, likes, handleEdit, handleSave, editButtonsComment, commentElementsQuoted } from "./main.js";


const renderComments = (comments) => {
	const commentsHtml = comments
	.map((comment, index) => {
		 if (comment.isEdit) {  
	return`
  
	  <li class="comment" data-index="${index}" >
	<div class="comment-header">
	  <div>${comment.name}</div>
	  <div>${comment.date}</div>
	  
	</div>
	<div class="comment-body">
					  <div class="comment-text" >
						 <textarea data-index="${index}" class="comment-input add-text" rows="4">${comment.comment}</textarea>
						 <button type="submit" data-index='${index}' class="save-buttons add-form-button saving post-button">Сохранить</button> 
					  </div>
					</div>
				 </li>
			  `;
	} else {
				 return `
			 
			  <li class="comment" data-index="${index}">
				 <div class="comment-header">
					<div class="comment-name" >${comment.name}</div>
					<div>${comment.date}</div>     
			  </div>
				 <div class="comment-body">
					<div class="comment-text" data-index="${index}">
					  <span data-index='${index}' class="comment-content">${comment.comment}</span>
					  <button class="edit-button add-form-button">Редактировать</button> <!-- новая кнопка -->
					</div>        
				 </div>
			
				 <div class="comment-footer">
					<div class="likes">
					  <span class="likes-counter">${comment.like}</span>
					  <button data-index='${index}' class="like-button ${comment.userLike ? "-active-like" : ""}"></button>
					</div>  
				 </div>
			  </li>
			 
			  `;
		 }
			})
			.join("");
			listElement.innerHTML = commentsHtml;
 
		 likes(comments);
		 handleEdit(comments);
		 handleSave(comments);
		 editButtonsComment(comments);
		 commentElementsQuoted(comments);
		 saveButtons(comments);
};

export { renderComments };