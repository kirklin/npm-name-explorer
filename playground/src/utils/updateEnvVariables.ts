import process from "node:process";

export interface GlobEnvConfig extends ImportMetaEnv {
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;

  VITE_USER_NODE_ENV: string;
  // Service interface url
  VITE_GLOB_API_URL: string;
  // Basic interface address SSR
  VITE_GLOB_API_URL_SSR: string;
  // Basic interface address prefix
  VITE_GLOB_API_URL_PREFIX: string;
}

// App Environment Variables
// 应用程序环境变量
export interface ViteEnvVariables extends GlobEnvConfig {

  // Node environment type
  // Node环境类型
  NODE_ENV: string;

  // Vite configuration port number
  // Vite配置端口号
  VITE_PORT: number;

  // Whether to enable PWA
  // 是否开启 PWA
  VITE_USE_PWA: boolean;

  // The public path when deployed
  // 部署时的公共路径
  VITE_PUBLIC_PATH: string;

  // Proxy configuration
  // 代理配置
  VITE_PROXY: [string, string][];
}

/**
 * 读取所有环境变量配置文件，并将它们添加到process.env中
 * Read all environment variable configuration files and add them to process.env
 *
 * @param envConf 包含环境变量配置的对象 Object containing environment variable configuration
 * @returns 包含更新后的环境变量的对象 Object with the updated environment variables
 */
export function updateEnvVariables(envConf: Recordable<string>): Partial<ViteEnvVariables> {
  // 创建一个空的对象，用于存储Vite环境变量
  // Create an empty object to store Vite environment variables
  const viteEnv: Partial<ViteEnvVariables> = {};

  // 遍历envConf中的所有键值对
  // Iterate over all key-value pairs in envConf
  for (const [key, value] of Object.entries(envConf)) {
    // 将值转换为字符串，并替换换行符为\n
    // Convert the value to a string and replace line breaks with \n
    let realValue: string | number | boolean | Recordable = String(value).replace(/\\n/g, "\n");

    // 根据键名和值类型进行特殊处理
    // Perform special handling according to key name and value type
    switch (key) {
      case "VITE_PORT":
        realValue = Number(realValue) || 8888;
        break;
      case "VITE_PROXY":
        if (realValue) {
          try {
            // 将VITE_PROXY转换为JSON对象，并替换单引号为双引号，如果失败则设置为空对象
            // Convert VITE_PROXY to a JSON object and replace single quotes with double quotes, if it fails then set it to an empty object
            realValue = JSON.parse(realValue.replace(/'/g, "\""));
          } catch (error) {
            realValue = {};
          }
        }
        break;
      default:
        // 将字符串"true"和"false"转换为布尔值，其他情况不变
        // Convert string "true" and "false" to boolean values, otherwise keep unchanged
        realValue = realValue === "true" ? true : realValue === "false" ? false : realValue;
    }

    // 设置环境变量的值，如果是字符串类型则直接赋值，否则转换为JSON字符串赋值，并将其添加到viteEnv对象中
    // Set the value of the environment variable, if it is a string type then assign directly, otherwise convert to JSON string and assign, and add it to the viteEnv object
    if (realValue) {
      viteEnv[key] = realValue;
      process.env[key] = typeof realValue === "string" ? realValue : JSON.stringify(realValue);
    }
  }

  return viteEnv;
}
