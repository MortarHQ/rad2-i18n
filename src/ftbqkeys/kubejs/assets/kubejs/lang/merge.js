// 下面是node脚本，非vue模板
// 使用了esmodule，非commonjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 获取当前文件以及路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取other.json与zh_cn.json
const other = JSON.parse(
  fs.readFileSync(path.join(__dirname, "other.json"), "utf-8")
);
const zh_cn = JSON.parse(
  fs.readFileSync(path.join(__dirname, "zh_cn.json"), "utf-8")
);

// 将other中对应的key与value赋值给zh中对应的key与value
const error = {};
for (let key in other) {
  // 如果zh中没有other中对应的key，则将key与value保存在一个异常对象error中
  if (key in zh_cn) {
    // 如果zh_cn中没有值则进行修改
    if (/^[\s]*$/.test(zh_cn[key])) zh_cn[key] = other[key];
  } else {
    error[key] = other[key];
  }
}

// 导出合并后的zh_cn，改名为merged.json
fs.writeFileSync(
  path.join(__dirname, "merged.json"),
  JSON.stringify(zh_cn, null, 2)
);

// 导出合并错误信息error，改名为error.json
fs.writeFileSync(
  path.join(__dirname, "error.json"),
  JSON.stringify(error, null, 2)
);
