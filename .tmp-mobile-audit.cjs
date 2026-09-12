const fs = require("fs");

async function main() {
  const targets = await fetch("http://127.0.0.1:9231/json/list").then((res) =>
    res.json()
  );
  const target = targets.find(
    (item) => item.type === "page" && item.url.startsWith("http://localhost:3000")
  );

  if (!target) throw new Error("ByteFX browser target was not found");

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 0;

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  };

  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await send("Page.reload", { ignoreCache: true });
  await new Promise((resolve) => setTimeout(resolve, 2500));

  await send("Runtime.evaluate", {
    expression: `new Promise(resolve => {
      const section = document.getElementById("download-app");
      section.scrollIntoView({ block: "center" });
      Promise.all(Array.from(section.querySelectorAll("img")).map(img =>
        img.complete ? Promise.resolve() : new Promise(done => {
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        })
      )).then(() => setTimeout(resolve, 1000));
    })`,
    awaitPromise: true,
  });

  const result = await send("Runtime.evaluate", {
    expression: `(() => {
      const section = document.getElementById("download-app");
      const card = section.querySelector(".md\\:hidden");
      const image = card.querySelector('img[alt="Mobile account dashboard and live trading chart"]');
      const sectionRect = section.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      return {
        section: { x: sectionRect.x, y: sectionRect.y, width: sectionRect.width, height: sectionRect.height },
        card: { x: cardRect.x, y: cardRect.y, width: cardRect.width, height: cardRect.height },
        image: { x: imageRect.x, y: imageRect.y, width: imageRect.width, height: imageRect.height },
        natural: { width: image.naturalWidth, height: image.naturalHeight },
        viewport: { width: innerWidth, height: innerHeight },
      };
    })()`,
    returnByValue: true,
  });

  const card = result.result.value.card;
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: {
      x: card.x + scrollX,
      y: card.y + scrollY,
      width: card.width,
      height: card.height,
      scale: 1,
    },
  });

  fs.writeFileSync("mobile-download-check.png", Buffer.from(shot.data, "base64"));
  process.stdout.write(JSON.stringify(result.result.value));
  socket.close();
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
