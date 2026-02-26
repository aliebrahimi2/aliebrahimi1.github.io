// comments.js

document.addEventListener('DOMContentLoaded', function() {
    const commentsPerPage = 5;
    let currentPage = 1;

    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    const paginationDiv = document.getElementById('commentsPagination');

    function renderComments() {
        const comments = auth.getComments().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const totalPages = Math.ceil(comments.length / commentsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage - 1) * commentsPerPage;
        const end = start + commentsPerPage;
        const pageComments = comments.slice(start, end);

        let html = '';
        pageComments.forEach(comment => {
            html += `
                <div class="comment-item" data-id="${comment.id}">
                    <div class="comment-header">
                        <strong>${comment.name}</strong> 
                        <span class="comment-date">${new Date(comment.timestamp).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div class="comment-body">${comment.text}</div>
                    ${comment.replies && comment.replies.length ? '<div class="comment-replies">' : ''}
                    ${comment.replies ? comment.replies.map(reply => `
                        <div class="reply-item">
                            <strong>${reply.adminName} (ادمین):</strong> ${reply.text}
                            <span class="reply-date">${new Date(reply.timestamp).toLocaleDateString('fa-IR')}</span>
                        </div>
                    `).join('') : ''}
                    ${comment.replies && comment.replies.length ? '</div>' : ''}
                    ${auth.isAdmin() ? `
                        <div class="comment-admin-actions">
                            <button class="btn-reply" data-id="${comment.id}">پاسخ</button>
                            <button class="btn-delete-comment" data-id="${comment.id}">حذف نظر</button>
                        </div>
                        <div class="reply-form-${comment.id}" style="display:none; margin-top:10px;">
                            <textarea id="replyText-${comment.id}" rows="2" placeholder="پاسخ شما..."></textarea>
                            <button class="btn-submit-reply" data-id="${comment.id}">ارسال پاسخ</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        commentsList.innerHTML = html || '<p>هیچ نظری ثبت نشده است. اولین نفر باشید!</p>';

        let paginationHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        paginationDiv.innerHTML = paginationHtml;

        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.dataset.page);
                renderComments();
            });
        });

        if (auth.isAdmin()) {
            document.querySelectorAll('.btn-reply').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    document.querySelector(`.reply-form-${id}`).style.display = 'block';
                });
            });
            document.querySelectorAll('.btn-submit-reply').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const replyText = document.getElementById(`replyText-${id}`).value.trim();
                    if (!replyText) return;
                    const adminUser = auth.getCurrentUser();
                    const adminName = adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'ادمین';
                    if (auth.addReply(id, replyText, adminName)) {
                        alert('پاسخ ثبت شد');
                        renderComments();
                    }
                });
            });
            document.querySelectorAll('.btn-delete-comment').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    if (confirm('آیا از حذف این نظر اطمینان دارید؟')) {
                        auth.deleteComment(id);
                        renderComments();
                    }
                });
            });
        }
    }

    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('commentName').value.trim();
            const email = document.getElementById('commentEmail').value.trim();
            const text = document.getElementById('commentText').value.trim();
            if (!name || !email || !text) return;

            auth.addComment({ name, email, text });
            commentForm.reset();
            currentPage = 1;
            renderComments();
        });
    }

    renderComments();
});