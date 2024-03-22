import network from "./network.json";
import axios from "axios";
const url = `http://${network.host}:${network.port}`;

/**
 * @description 获取语言文件请求
 * @param {"en_us"|"zh_cn"|"auto"} params
 * @returns {Promise<AxiosResponse<JSON>>}
 */
async function getLangFileRequest(params) {
  const uri = new URL(url);
  uri.pathname = "/resource";
  uri.searchParams.set("lang", params);
  return axios.get(uri.href);
}

export { getLangFileRequest };
