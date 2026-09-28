self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {}
  const { title = "AI Exam Result", body = "New update available", url = "https://www.aiexamresult.com" } = data;
  const options = { body, icon: "/favicon.ico", badge: "/favicon.ico", data: { url }, vibrate: [200, 100, 200] };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "https://www.aiexamresult.com";
  event.waitUntil(clients.openWindow(url));
});
