<script setup lang="ts">
import { checkNpmName } from "~/apis/check-npm-name";

interface Result {
  packageName: string;
  exists: boolean;
  error: string | null;
}

const state = reactive({
  packageNames: "",
  results: [] as Result[],
  isLoading: false,
});

async function checkNpmNameExists(packageName: string): Promise<Result> {
  try {
    const { packageExists } = await checkNpmName(packageName);
    return { packageName, exists: packageExists, error: null };
  } catch (error) {
    console.error(`Error checking package ${packageName}:`, error);
    return { packageName, exists: false, error: "Network request failed" };
  }
}

async function checkPackages() {
  state.isLoading = true;
  const names = state.packageNames.split("\n").map(name => name.trim()).filter(Boolean);
  state.results = await Promise.all(names.map(checkNpmNameExists));
  state.isLoading = false;
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
        NPM Package Checker
      </h1>
      <div class="mb-6">
        <textarea
          v-model="state.packageNames"
          class="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          rows="5"
          placeholder="Enter package names (one per line)"
        />
      </div>
      <div class="mb-6 flex justify-center">
        <button
          :disabled="state.isLoading"
          class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
          :class="{ 'opacity-50 cursor-not-allowed': state.isLoading }"
          @click="checkPackages"
        >
          <span v-if="!state.isLoading">Check Packages</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Checking...
          </span>
        </button>
      </div>
      <div v-if="state.results.length > 0" class="bg-gray-50 p-4 rounded-2xl">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">
          Results:
        </h2>
        <ul class="space-y-2">
          <li
            v-for="result in state.results" :key="result.packageName"
            class="p-3 rounded-xl"
            :class="{
              'bg-green-100': !result.exists && !result.error,
              'bg-red-100': result.exists || result.error,
            }"
          >
            <span class="font-medium">{{ result.packageName }}</span>
            <template v-if="result.error">
              <span class="text-red-600 ml-2">Error: {{ result.error }}</span>
            </template>
            <template v-else>
              <span v-if="result.exists" class="text-red-600 ml-2">is not available</span>
              <span v-else class="text-green-600 ml-2">is available</span>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
