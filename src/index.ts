import isUrl from "is-url-superb";
import axios from "axios";
import isScoped from "is-scoped";
import registryUrl from "registry-url";
import registryAuthToken from "registry-auth-token";
import validate from "validate-npm-package-name";
import orgRegex from "org-regex";

/**
 * Check if an npm package exists based on the given name.
 * @param name - The name of the npm package to check.
 * @param options - Additional options.
 * @returns A boolean indicating whether the package exists or not.
 * @throws Error if package name is not provided or if the `registryUrl` option is not a valid string URL.
 */
export default async function checkNpmNameExists(name: string, options: { registryUrl?: string } = {}): Promise<boolean> {
  if (!(name.length > 0)) {
    throw new Error("Package name required");
  }

  if (typeof options.registryUrl !== "undefined" && !(isUrl(options.registryUrl))) {
    throw new Error("The `registryUrl` option must be a valid string URL");
  }

  const configuredRegistryUrl: string = registryUrl();
  const organizationRegex = orgRegex({ exact: true });

  // Ensure the URL always ends in a `/`
  const normalizeUrl = (url: string): string => `${url.replace(/\/$/, "")}/`;

  const npmOrganizationUrl = "https://www.npmjs.com/org/";

  const request = async (packageName: string, requestOptions: { registryUrl?: string }): Promise<boolean> => {
    const registryUrl: string = normalizeUrl(requestOptions.registryUrl || configuredRegistryUrl);

    const isOrganization: boolean = organizationRegex.test(packageName);
    if (isOrganization) {
      packageName = packageName.replace(/[@/]/g, "");
    }

    const isValid = validate(packageName);

    if (!isValid.validForNewPackages) {
      const notices = [...isValid.warnings || [], ...isValid.errors || []].map((v: string) => `- ${v}`);
      notices.unshift(`Invalid package name: ${packageName}`);
      const error = new InvalidNameError(notices.join("\n"));
      error.warnings = isValid.warnings;
      error.errors = isValid.errors;
      throw error;
    }

    let urlName = packageName;
    const isScopedPackage = isScoped(packageName);
    if (isScopedPackage) {
      urlName = packageName.replace(/\//g, "%2f");
    }

    const authInfo = registryAuthToken(registryUrl, { recursive: true });
    const headers: { [key: string]: string } = {};

    if (authInfo?.type && authInfo.token) {
      headers.authorization = `${authInfo.type} ${authInfo.token}`;
    }

    try {
      if (isOrganization) {
        await axios.head(npmOrganizationUrl + urlName.toLowerCase(), { timeout: 10000 });
      } else {
        await axios.head(registryUrl + urlName.toLowerCase(), { timeout: 10000, headers });
      }

      return true;
    } catch (error) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      const { status } = error.response || {};

      if (status === 404) {
        return false;
      }

      throw error;
    }
  };

  return request(name, options);
}

export class InvalidNameError extends Error {
  warnings: any;
  errors: any;
}
