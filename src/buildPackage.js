// 创建一个zip压缩包，为了将目标文件打包到指定路径
// 文件夹: src/ftbqkeys/backup --> package.zip中backup
// 文件夹：src/ftbqkeys/kubejs --> package.zip中kubejs
// 文件夹：src/ftbqkeys/config/ftbquests --> package.zip中config/ftbquests/quests

// 文件夹路径和目标路径的数组
const directories = [
  { path: "src/ftbqkeys/backup/", target: "backup" },
  { path: "src/ftbqkeys/kubejs/", target: "kubejs" },
  { path: "src/ftbqkeys/config/ftbquests/", target: "config/ftbquests/quests" },
];

import fs from "fs";
import archiver from "archiver";

// 创建一个文件以写入压缩包数据
const output = fs.createWriteStream("dist/package.zip");
const archive = archiver("zip", {
  zlib: { level: 9 }, // 设置压缩级别
});

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
  throw err;
});

// 将文件流与压缩包关联
archive.pipe(output);

// 遍历数组并添加每个文件夹到压缩包
directories.forEach((directory) => {
  archive.directory(directory.path, directory.target);
});

// 完成文件添加后，关闭压缩包
archive.finalize();
