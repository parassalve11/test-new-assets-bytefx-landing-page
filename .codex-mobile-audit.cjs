const fs = require("fs");
const http = require("http");

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(JSON.parse(body)));
    }).on("error", reject);
  });
}

async function main() {
  const pages = await getJson("http://127.0.0.1:9230/json");
  const page = pages.find((item) => item.type === "page");
  if (!page) throw new Error("No Chrome page target found");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const requestId = ++id;
      pending.set(requestId, { resolve, reject });
      ws.send(JSON.stringify({ id: requestId, method, params }));
    });

  ws.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const task = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) task.reject(new Error(JSON.stringify(message.error)));
    else task.resolve(message.result);
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/" });
  await new Promise((resolve) => setTimeout(resolve, 4500));
  await send("Runtime.evaluate", {
    expression: `Promise.all(Array.from(document.images).map(img => img.complete ? null : new Promise(resolve => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); }))).then(() => document.fonts.ready).then(() => new Promise(resolve => setTimeout(resolve, 800)))`,
    awaitPromise: true,
  });

  const targets = [
    ["trading-showcase", "audit-showcase-mobile.png"],
    ["download-app", "audit-download-mobile.png"],
  ];
  const report = {};
  for (const [targetId, filename] of targets) {
    const result = await send("Runtime.evaluate", {
      expression: `(() => {
        const section = document.getElementById(${JSON.stringify(targetId)});
        section.scrollIntoView({ block: 'start' });
        const rect = section.getBoundingClientRect();
        return {
          clip: { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height },
          images: Array.from(section.querySelectorAll('img')).map(img => {
            const r = img.getBoundingClientRect();
            return { src: img.getAttribute('src'), x: r.left - rect.left, y: r.top - rect.top, width: r.width, height: r.height, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
          }),
          cards: Array.from(section.querySelectorAll('article')).map(card => {
            const r = card.getBoundingClientRect();
            return { x: r.left - rect.left, y: r.top - rect.top, width: r.width, height: r.height };
          })
        };
      })()`,
      returnByValue: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const details = result.result.value;
    report[targetId] = details;
    const shot = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { ...details.clip, scale: 1 },
    });
    fs.writeFileSync(filename, Buffer.from(shot.data, "base64"));
  }
  process.stdout.write(JSON.stringify(report, null, 2));
  ws.close();
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
