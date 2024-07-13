import { ResultConstants } from "../constants/requestConstants";

/**
 * Request data format for API calls.
 */
export interface RequestParams<T = any, Q = Record<string, any>> {
  method: string;
  body: T;
  headers?: { authorization?: string };
  query: Q;
}

/**
 * Success response format for API calls.
 */
export interface SuccessResponse<T = any> {
  code: number;
  data: T;
  message: string;
  type: "success";
}

/**
 * Error response format for API calls.
 */
export interface ErrorResponse<T = any> {
  code: number;
  data: T | null;
  message: string;
  type: "error";
}

/**
 * Paginates a list of items.
 * @param pageNo The page number of the items.
 * @param pageSize The number of items per page.
 * @param array The list of items to be paginated.
 * @returns The paginated list of items.
 */
export function paginate<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const startIndex = (pageNo - 1) * Number(pageSize);
  const endIndex = startIndex + Number(pageSize);
  return array.slice(startIndex, endIndex);
}

/**
 * Returns a successful response with a data.
 * @param data The result to be returned.
 * @param message The message to be included in the response.
 * @returns A successful response with a data.
 */
export function createSuccessResponse<T = any>(data: T, message = "ok"): SuccessResponse<T> {
  return {
    code: ResultConstants.SUCCESS,
    data,
    message,
    type: "success",
  };
}

/**
 * Returns a successful response with a paginated list of results.
 * @param page The page number of the results.
 * @param pageSize The number of results per page.
 * @param list The list of results to be paginated.
 * @param message The message to be included in the response.
 * @returns A successful response with a paginated list of results.
 */
export function createPaginatedSuccessResponse<T = any>(page: number, pageSize: number, list: T[], message = "ok"): SuccessResponse<{ items: T[]; total: number }> {
  const paginatedList = paginate(page, pageSize, list);

  return {
    ...createSuccessResponse({
      items: paginatedList,
      total: list.length,
    }, message),
  };
}

/**
 * Returns an error response with a message and optional code and data.
 * @param message The error message to be included in the response.
 * @param code The error code to be included in the response.
 * @param data The optional error result to be included in the response.
 * @returns An error response with a message and optional code and data.
 */
export function createErrorResponse<T = any>(message = "Request failed.", code = ResultConstants.ERROR, data: T | null = null): ErrorResponse<T> {
  return {
    code,
    data,
    message,
    type: "error",
  };
}

/**
 * Extracts the authorization token from the request headers.
 * @param headers The request headers.
 * @returns The authorization token, if present.
 */
export function extractAuthorizationToken(headers): string {
  return getRequestHeader(headers, "authorization");
}

/**
 * Get error message from an error object. If the error object is not an instance of Error,
 * it will be converted to string and returned.
 * 从错误对象中获取错误信息。如果错误对象不是 Error 的实例，
 * 则会将其转换为字符串并返回。
 *
 * @param error The error object to extract error message from. 用于提取错误信息的错误对象。
 * @returns The error message string. 错误信息字符串。
 */
export function getErrorMessage(error): string {
  if (error instanceof Error) {
    return error.message;
  } else {
    return String(error);
  }
}
