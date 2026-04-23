const btn = document.getElementById('callBtn');
const statusEl = document.getElementById('status');
const errorEl = document.getElementById('error');

btn.onclick = async () => {
  errorEl.textContent = '';
  statusEl.textContent = 'Запрашиваю микрофон...';

  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    errorEl.textContent = 'Разрешите доступ к микрофону.';
    return;
  }

  statusEl.textContent = 'Создаю звонок...';

  try {
    const resp = await fetch('/api/register-call', { method: 'POST' });
    const data = await resp.json();

    if (!resp.ok) throw new Error(data.error || 'Ошибка сервера');

    statusEl.textContent = `Звонок создан! call_id: ${data.call_id}`;

    // Здесь позже подключим Web SDK Retell
  } catch (err) {
    errorEl.textContent = err.message;
    statusEl.textContent = '';
  }
};
