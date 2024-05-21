import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

// 读取当前文件以及路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 读取配置文件 */
const daemonConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, "api/network.json"), "utf-8")
);
const webConfig = getServerConfig(
  fs.readFileSync(path.join(__dirname, "..", "vite.config.js"), "utf-8")
);

const app = express();
/* 后端配置 */
const port = daemonConfig.port;
const host = daemonConfig.host;
const processArgs = process.argv.slice(2);
const isPreview = processArgs.includes("--preview");

/* 导入本地化文件 */
// 文件路径
const localesPath = path.join(__dirname, "ftbqkeys/kubejs/assets/kubejs/lang");

const locales = {
  en_us: null,
  manual: null,
  zh_cn: null,
};

try {
  locales.en_us = JSON.parse(
    fs.readFileSync(`${localesPath}/en_us.json`, "utf-8")
  );
  locales.manual = JSON.parse(
    fs.readFileSync(`${localesPath}/manual.json`, "utf-8")
  );
  locales.zh_cn = JSON.parse(
    fs.readFileSync(`${localesPath}/zh_cn.json`, "utf-8")
  );
} catch (error) {
  console.log(error);
  console.log("请检查本地化文件");
  // 关闭程序
  process.exit(1);
}

// 设置 CORS 相关的头信息
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // 允许的方法包括 OPTIONS
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// 设置解析中间件
app.use(bodyParser.json());

// 预览设置
if (isPreview) {
  // 设置静态资源目录
  app.use(express.static(path.join(__dirname, "..", "dist")));
} else {
  // 静态资源重定向"resource"路径
  app.get("/", (req, res) => {
    res.redirect(`http://${webConfig.host}:${webConfig.port}`);
  });
}

// 处理预检请求
app.options("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/resource", (req, res) => {
  switch (req.query.lang) {
    case "en_us":
      res.send(locales.en_us);
      break;
    case "zh_cn":
      res.send(locales.manual);
      break;
    case "auto":
      res.send(locales.zh_cn);
      break;
    default:
      // 发送提示
      res.send(
        `此为后端页面，请访问VITE前端服务。
    <br/>
    一般是<a href="http://localhost:5173">http://localhost:5173</a>`
      );
  }

  // 日志：记录时间 访问IP 访问参数
  log(null, req, res);
});

// 根据传入的key-value，修改zh_cn中的对应文本
app.put("/", (req, res) => {
  // tip 提示
  let tip;
  // 允许body数据
  res.header("Content-Type", "application/json;charset=utf-8");
  // 数据检验
  if (!req.body || !req.body.key) {
    tip = "key不能为空";
    res.status(400).send(tip);
    log(tip, req, res);
    return;
  }
  const { key, value } = req.body;
  // 不允许新增key
  if (!key in locales.manual) {
    tip = "key不存在";
    res.status(400).send(tip);
    log(tip, req, res);
    return;
  }

  const originValue = locales.manual[key];
  // 值校验
  if (originValue === value) {
    // 值相同，不用更改
    tip = "值相同";
    res.status(400).send(tip);
    log(tip, req, res);
    return;
  }

  locales.manual[key] = value;

  fs.writeFileSync(
    `${localesPath}/zh_cn.json`,
    JSON.stringify(locales.manual, null, 2)
  );
  res.status(200).send("修改成功");

  // 日志：记录本次操作
  tip = `${key}："${originValue}" ==> "${value}"`;
  log(tip, req, res);
});

app.listen(port, () => {
  console.log(`Express app listening on http://${host}:${port}`);
});

// 日志函数
function log(message, req = undefined, res = undefined) {
  const date = new Date();
  const timestamp = date.toLocaleString();
  let ip;
  let method;
  let url;
  let status;
  let length;
  if (typeof req !== "undefined" && typeof res !== "undefined") {
    ip = req.ip;
    method = req.method;
    url = req.url;
    status = res.statusCode;
    length = res._headers["content-length"];
  }

  console.log(
    `${timestamp} ${ip} ${method} URL:${url} Status:${status} Length:${length} Message:${message}`
  );
}

// vite配置提取出server配置函数
function getServerConfig(text) {
  const serverObject = {};
  let regex;
  let match;
  regex = /host[\s:]+"(\w*)"/;
  match = text.match(regex);
  serverObject.host = match[1];

  // 匹配端口，可能是文本也可能是数字
  regex = /port[\s]*:[\s]*(\d*)/;
  match = text.match(regex);
  serverObject.port = match[1];

  return serverObject;
}
