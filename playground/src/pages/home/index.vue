<script setup lang="ts">
import { checkNpmName } from "~/apis/check-npm-name";

interface Result {
  packageName: string;
  exists: boolean;
  error: string | null; // Add an error property to store the error message
}
const state = reactive<{
  packageNames: string;
  results: Result[];
}>({
  packageNames: "",
  results: [],
});
const checkNpmNameExists = async (packageName: string) => {
  const result: Result = {
    packageName,
    exists: false,
    error: null,
  };

  try {
    const { packageExists } = await checkNpmName(packageName); // Replace with your API endpoint
    result.exists = packageExists;
  } catch (error) {
    console.error(`Error checking package ${packageName}: ${error.message}`);
    result.error = "Network request failed"; // Set a descriptive error message
  }

  return result;
};
const checkPackages = async () => {
  // Split package names by line and remove any leading/trailing whitespace
  const names = state.packageNames.split("\n").map(name => name.trim()).filter(Boolean);
  // Reset results
  state.results = [];
  state.results = await Promise.all(names.map(name => checkNpmNameExists(name)));
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-3xl font-semibold mb-4">
        NPM Package Checker
      </h1>
      <div class="mb-4">
        <textarea v-model="state.packageNames" class="w-full p-2 border rounded" placeholder="Enter package names (one per line)" />
      </div>
      <div class="mb-4">
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" @click="checkPackages">
          Check Packages
        </button>
      </div>
      <div v-if="state.results.length > 0">
        <h2 class="text-xl font-semibold mb-2">
          Results:
        </h2>
        <ul>
          <li v-for="result in state.results" :key="result.packageName" class="mb-2">
            <span class="font-semibold">{{ result.packageName }}</span>
            <template v-if="result.error">
              <span class="text-red-500"> - Error: {{ result.error }}</span>
            </template>
            <template v-else>
              is <span v-if="result.exists" class="text-red-500">not available</span><span v-else class="text-green-500">available</span>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
