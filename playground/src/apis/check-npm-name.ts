import axios from "axios";

enum API {
  checkNpmName = "/api/check-npm-name",
}

// Define functions to call the APIs
export async function checkNpmName(packageName: string): Promise<boolean> {
  const response = await axios.get(`/api${API.checkNpmName}/${packageName}`);
  return response.data.exists;
}
