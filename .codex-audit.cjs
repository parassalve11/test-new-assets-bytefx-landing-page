const fs = require("fs");

async function main() {
  const pages = await fetch("http://127.0.0.1:9230/json").then((response) => response.json());
  const page = pages.find((item) => item.type === "page" && item.url.includes("localhost:3000"));
  if (!page) throw new Error("Local ByteFX page was not found");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let nextId = 0;
  const pending = new Map();

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const item = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) item.reject(new Error(JSON.stringify(message.error)));
    else item.resolve(message.result);
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send("Runtime.evaluate", {
    expression: `new Promise(resolve => {
      document.documentElement.style.scrollBehavior = "auto";
      const ready = () => setTimeout(resolve, 1500);
      if (document.readyState === "complete") ready();
      else addEventListener("load", ready, { once: true });
    })`,
    awaitPromise: true,
  });

  const captures = [
    ["audit-ticker-section.png", 'section[aria-labelledby="live-market-prices"]', 80],
    ["audit-download-section.png", '#download-app', 0],
    ["audit-final-section.png", '#start-trading', 0],
  ];

  for (const [name, selector, pad] of captures) {
    await send("Runtime.evaluate", {
      expression: `new Promise(resolve => {
        const target = document.querySelector(${JSON.stringify(selector)});
        if (!target) throw new Error("Missing ${selector}");
        window.scrollTo(0, target.getBoundingClientRect().top + scrollY - ${pad});
        setTimeout(resolve, 1800);
      })`,
      awaitPromise: true,
    });

    const measured = await send("Runtime.evaluate", {
      expression: `(() => {
        const target = document.querySelector(${JSON.stringify(selector)});
        const rect = target.getBoundingClientRect();
        return {
          x: Math.max(0, rect.left + scrollX),
          y: Math.max(0, rect.top + scrollY - ${pad}),
          width: rect.width,
          height: Math.min(rect.height + ${pad * 2}, 1400),
        };
      })()`,
      returnByValue: true,
    });

    const shot = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { ...measured.result.value, scale: 1 },
    });
    fs.writeFileSync(name, Buffer.from(shot.data, "base64"));
  }

  const ticker = await send("Runtime.evaluate", {
    expression: `(() => {
      const shell = document.querySelector('section[aria-labelledby="live-market-prices"]');
      const frame = shell?.querySelector("iframe");
      return {
        shell: shell?.outerHTML,
        frameSource: frame?.src,
      };
    })()`,
    returnByValue: true,
  });
  process.stdout.write(`${JSON.stringify(ticker.result.value, null, 2)}\n`);

  ws.close();
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
