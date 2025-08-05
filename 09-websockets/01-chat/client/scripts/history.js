document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return;
  }
 

  try {
    const res = await fetch('/chat/history', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      window.location.href = '/';
      return;
    }

    const messages = await res.json();
    const messagesDiv = document.getElementById('messages');
    if (Array.isArray(messages) && messages.length > 0) {
      messagesDiv.innerHTML = messages.map(msg => `
        <div class="message">
          <b>${msg.username}</b>: ${msg.text} <span class="date">${new Date(msg.date).toLocaleString()}</span>
        </div>
      `).join('');
    } else {
      messagesDiv.textContent = 'Сообщений нет.';
    }
  } catch (err) {
    alert('Ошибка загрузки истории чата');
  }
});