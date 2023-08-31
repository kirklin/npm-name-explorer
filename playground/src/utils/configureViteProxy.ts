import type { ProxyOptions } from "vite";

export function configureProxy(proxyList: [string, string][] = []) {
  // 创建一个空的代理对象
  // Create an empty proxy object
  const proxyConfig: Record<string, ProxyOptions> = {};
  // 遍历代理列表中的每一对前缀和目标地址
  // Iterate over each pair of prefix and target address in the proxy list
  for (const [prefix, target] of proxyList) {
    // 判断目标地址是否是https协议
    // Determine if the target address is https protocol
    const isHttps = /^https:\/\//.test(target);
    // 根据前缀和目标地址设置代理选项，参考https://github.com/http-party/node-http-proxy#options
    // Set proxy options according to prefix and target address, refer to https://github.com/http-party/node-http-proxy#options
    proxyConfig[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      // 使用正则表达式替换路径中的前缀为空字符串，实现重写路径的功能
      // Use regular expression to replace the prefix in the path with an empty string, to achieve the function of rewriting the path
      rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ""),
      // 如果目标地址是https协议，需要设置secure为false，否则不需要设置该选项
      // If the target address is https protocol, need to set secure to false, otherwise do not need to set this option
      ...(isHttps ? { secure: false } : {}),
    };
  }
  // 返回代理对象
  // Return the proxy object
  return proxyConfig;
}
