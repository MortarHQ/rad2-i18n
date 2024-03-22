import network from "./network.json";
import axios from "axios";

/**
 * @description 获取语言文件请求
 * @param {"en_us"|"zh_cn"|"auto"} params
 * @returns {Promise<AxiosResponse<JSON>>}
 */
async function getLangFileRequest(params) {
  const url = new URL(`http://${network.host}:${network.port}`);
  url.searchParams.set("lang", params);
  return axios.get(url.href);
}

export { getLangFileRequest };
