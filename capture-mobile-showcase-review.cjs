const fs = require("fs");

async function main() {
  const targets = await fetch("http://127.0.0.1:9230/json/list").then((response) =>
    response.json(),
  );
  const target = targets.find(
    (item) => item.type === "page" && item.url.includes(":3000/"),
  );

  if (!target) throw new Error("ByteFX browser target not found");

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
    const request = pending.get(message.id);
    if (!request) return;
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

  const result = await send("Runtime.evaluate", {
    expression: `(async () => {
      const section = document.getElementById("trading-showcase");
      if (!section) throw new Error("Showcase section missing");
      section.scrollIntoView({ block: "start" });
      await new Promise((resolve) => setTimeout(resolve, 800));
      await document.fonts.ready;
      await Promise.race([
        Promise.all(Array.from(section.querySelectorAll("img")).map((img) =>
          img.complete ? Promise.resolve() : new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          })
        )),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
      const rect = section.getBoundingClientRect();
      return {
        clip: {
          x: rect.left + scrollX,
          y: rect.top + scrollY,
          width: rect.width,
          height: rect.height,
        },
        cards: Array.from(section.querySelectorAll("article")).map((card) => {
          const cardRect = card.getBoundingClientRect();
          const image = card.querySelector("img");
          const imageRect = image.getBoundingClientRect();
          return {
            card: { width: cardRect.width, height: cardRect.height },
            image: {
              left: imageRect.left - cardRect.left,
              top: imageRect.top - cardRect.top,
              right: cardRect.right - imageRect.right,
              bottom: cardRect.bottom - imageRect.bottom,
              width: imageRect.width,
              height: imageRect.height,
            },
          };
        }),
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  const details = result.result.value;
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { ...details.clip, scale: 1 },
  });

  fs.writeFileSync(
    "C:\\Projects\\main-landing-page\\bytefx-landing2\\mobile-showcase-review.png",
    Buffer.from(screenshot.data, "base64"),
  );
  process.stdout.write(JSON.stringify(details.cards, null, 2));
  socket.close();
}

main().catch((error) => {
  process.stderr.write(error.stack);
  process.exitCode = 1;
});
