import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import network from "./api/network.json" assert { type: "json" };

const app = express();
/* 后端配置 */
const port = network.port;
const host = network.host;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 导入本地化文件 */
// 文件路径
const localesPath = path.join(__dirname, "ftbqkeys/kubejs/assets/kubejs/lang");

const locales = {
  en_us: null,
  zh_cn: null,
  auto: null,
};

try {
  locales.en_us = JSON.parse(
    fs.readFileSync(`${localesPath}/en_us.json`, "utf-8")
  );
  locales.zh_cn = JSON.parse(
    fs.readFileSync(`${localesPath}/zh_cn.json`, "utf-8")
  );
  locales.auto = JSON.parse(
    fs.readFileSync(`${localesPath}/auto.json`, "utf-8")
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

// 处理预检请求
app.options("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  switch (req.query.lang) {
    case "en_us":
      res.send(locales.en_us);
      break;
    case "zh_cn":
      res.send(locales.zh_cn);
      break;
    case "auto":
      res.send(locales.auto);
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
  // 允许body数据
  res.header("Content-Type", "application/json;charset=utf-8");
  // 日志：记录收到参数
  log(null, req, res);
  // 数据检验
  if (!req.body || !req.body.key || !req.body.value) {
    res.status(400).send("key和value不能为空");
    return;
  }
  const { key, value } = req.body;
  // 不允许新增key
  if (!key in locales.zh_cn) {
    res.status(400).send("key不存在");
    return;
  }

  locales.zh_cn[key] = value;

  fs.writeFileSync(
    `${localesPath}/zh_cn.json`,
    JSON.stringify(locales.zh_cn, null, 2)
  );
  res.status(200).send("修改成功");
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
    `${timestamp} ${ip} ${method} ${url} ${status} ${length} ${message}`
  );
}
