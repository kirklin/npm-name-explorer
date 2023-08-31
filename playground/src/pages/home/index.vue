<script setup lang="ts">
import { checkNpmName } from "~/apis/check-npm-name";

const state = reactive({
  packageName: "",
  result: null,
});

const checkPackageExistence = async () => {
  try {
    state.result = await checkNpmName(state.packageName);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md p-6">
      <h1 class="text-2xl font-semibold mb-4">
        Check NPM Package Existence
      </h1>
      <input
        v-model="state.packageName"
        class="w-full border p-2 rounded"
        placeholder="Enter package name"
      >
      <button
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="checkPackageExistence"
      >
        Check Existence
      </button>
      <div v-if="state.result !== null" class="mt-4">
        <p v-if="state.result" class="text-green-600 font-semibold">
          Package exists!
        </p>
        <p v-else class="text-red-600 font-semibold">
          Package does not exist.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Add your Tailwind CSS styles here */
</style>
