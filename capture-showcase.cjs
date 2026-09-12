const fs = require("fs");

const ws = new WebSocket(
  "ws://127.0.0.1:9224/devtools/page/8E76B1F1B327A61E8D8FFC073AA5973B"
);
let nextId = 0;
const pending = new Map();

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const item = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) item.reject(new Error(JSON.stringify(message.error)));
  else item.resolve(message.result);
};

ws.onerror = (error) => {
  throw error;
};

ws.onopen = async () => {
  try {
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1536,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Runtime.evaluate", {
      expression: `new Promise(resolve => {
        const section = document.getElementById("trading-showcase");
        window.scrollTo(0, section.offsetTop);
        const done = () => Promise.race([
          Promise.all(Array.from(section.querySelectorAll("img")).map(img =>
          img.complete ? Promise.resolve() : new Promise(r => {
            img.addEventListener("load", r, { once: true });
            img.addEventListener("error", r, { once: true });
          })
          )),
          new Promise(r => setTimeout(r, 8000))
        ]).then(() => setTimeout(resolve, 1500));
        setTimeout(done, 250);
      })`,
      awaitPromise: true,
    });
    const measured = await send("Runtime.evaluate", {
      expression: `(() => {
        const element = document.getElementById("trading-showcase");
        if (!element) throw new Error("showcase missing");
        const stickyHeader = document.querySelector("body > header");
        if (stickyHeader) stickyHeader.style.visibility = "hidden";
        const rect = element.getBoundingClientRect();
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const fonts = ["Poppins", "Arial", "Helvetica", "Segoe UI", "Inter"];
        return {
          section: {
            x: rect.left + scrollX,
            y: rect.top + scrollY,
            width: rect.width,
            height: rect.height,
          },
          articles: Array.from(element.querySelectorAll("article")).map(article => {
            const box = article.getBoundingClientRect();
            return {
              x: box.left - rect.left,
              y: box.top - rect.top,
              width: box.width,
              height: box.height,
            };
          }),
          fontWidths: Object.fromEntries(fonts.map(font => {
            context.font = "700 48px " + font;
            return [font, {
              first: context.measureText("Trade with").width,
              second: context.measureText("Better Conditions").width,
            }];
          })),
        };
      })()`,
      returnByValue: true,
    });
    const details = measured.result.value;
    const rect = details.section;
    const shot = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { ...rect, scale: 1 },
    });
    fs.writeFileSync(
      "C:\\Projects\\main-landing-page\\bytefx-landing2\\showcase-element.png",
      Buffer.from(shot.data, "base64")
    );
    process.stdout.write(JSON.stringify(details));
    ws.close();
  } catch (error) {
    process.stderr.write(error.stack);
    process.exitCode = 1;
    ws.close();
  }
};
