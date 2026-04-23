const btn = document.getElementById('callBtn');
const statusEl = document.getElementById('status');
const errorEl = document.getElementById('error');

// Загружаем Web SDK динамически
async function loadRetellSDK() {
  if (window.RetellWebClient) return window.RetellWebClient;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.retellai.com/web-client/latest/retell-web-client.js";
    script.onload = () => resolve(window.RetellWebClient);
    script.onerror = () => reject("Не удалось загрузить Web SDK");
    document.body.appendChild(script);
  });
}

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

    statusEl.textContent = 'Подключаюсь к агенту...';

    // Загружаем SDK
    const RetellWebClient = await loadRetellSDK();

    // Создаём клиент
    const client = new RetellWebClient({
      callId: data.call_id,
      clientToken: data.client_token
    });

    // Подключаемся
    await client.connect();

    statusEl.textContent = 'Соединение установлено. Говорите!';
  } catch (err) {
    console.error(err);
    errorEl.textContent = err.message;
    statusEl.textContent = '';
  }
};
