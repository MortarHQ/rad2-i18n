// 创建一个zip压缩包，为了将目标文件打包到指定路径
// 文件夹: src/ftbqkeys/backup --> package.zip中backup
// 文件夹：src/ftbqkeys/config/ftbquests --> package.zip中config/ftbquests/quests
// 文件: src/ftbqkeys/kubejs/assets/kubejs/lang/en_us.json --> package.zip中kubejs/assets/kubejs/lang/en_us.json
// 文件：处理完毕的zh_cn.json --> package.zip中kubejs/assets/kubejs/lang/zh_cn.json

import fs from "fs";
import archiver from "archiver";
import { fileURLToPath } from "url";
import path from "path";

// 当前文件路径与文件夹路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文件夹路径和目标路径的数组
const directories = [
  { path: "src/ftbqkeys/backup/", target: "backup" },
  { path: "src/ftbqkeys/config/ftbquests/", target: "config/ftbquests/quests" },
];

// 文件路径和目标路径的数组
const files = [
  {
    file: "src/ftbqkeys/kubejs/assets/kubejs/lang/en_us.json",
    target: "kubejs/assets/kubejs/lang/en_us.json",
  },
];

// 创建一个文件以写入压缩包数据
const output = fs.createWriteStream("dist/package.zip");
const archive = archiver("zip", {
  zlib: { level: 9 }, // 设置压缩级别
});

// 下面开始处理zh_cn.json
// 读取zh_cn.json, en_us.json , auto.json
const manual = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "ftbqkeys/kubejs/assets/kubejs/lang/manual.json"),
    "utf-8"
  )
);
const en_us = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "ftbqkeys/kubejs/assets/kubejs/lang/en_us.json"),
    "utf-8"
  )
);
const zh_cn = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "ftbqkeys/kubejs/assets/kubejs/lang/zh_cn.json"),
    "utf-8"
  )
);
// 合并zh_cn.json与en_us.json
for (let key in en_us) {
  if (!/^[\s]*$/.test(manual[key])) continue; // zh_cn已有非空内容
  let value = en_us[key]; // 原文内容
  if (key in zh_cn) value += "\n\n" + zh_cn[key]; // 自动补充机翻内容
  manual[key] = value; // 修改zh_cn.json
}

output.on("close", function () {
  const byteSize = archive.pointer();
  const kilobytes = (byteSize / 1024).toFixed(2);
  const megabytes = (kilobytes / 1024).toFixed(2);
  console.log(
    "压缩包大小: " +
      byteSize +
      " bytes | " +
      kilobytes +
      " KB | " +
      megabytes +
      " MB"
  );
});

archive.on("error", function (err) {
  console.log("压缩出错");
  throw err;
});

// 将文件流与压缩包关联
archive.pipe(output);

// 遍历数组并添加每个文件夹到压缩包
directories.forEach((directory) => {
  archive.directory(directory.path, directory.target);
});

// 遍历数组并添加每个文件到压缩包
files.forEach((file) => {
  archive.file(file.file, { name: file.target });
});

// 添加合并完成的zh_cn.json到压缩包
const zhCnContent = JSON.stringify(manual, null, 2);
archive.append(zhCnContent, { name: "kubejs/assets/kubejs/lang/zh_cn.json" });

// 完成文件添加后，关闭压缩包
archive.finalize();
