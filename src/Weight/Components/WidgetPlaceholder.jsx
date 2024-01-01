import React from 'react';

const WidgetPlaceholder = () => {
  return (
    <div role="status" class="w-full p-4 border border-gray-700 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
        <div class="h-2.5 bg-gray-700 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
        <div class="w-48 h-2 mb-10 bg-gray-700 rounded-full dark:bg-gray-700"></div>
        <div class="flex items-baseline mt-4">
            <div class="w-full bg-gray-700 rounded-t-lg h-72 dark:bg-gray-700"></div>
            <div class="w-full h-56 ms-6 bg-gray-700 rounded-t-lg dark:bg-gray-700"></div>
            <div class="w-full bg-gray-700 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
            <div class="w-full h-64 ms-6 bg-gray-700 rounded-t-lg dark:bg-gray-700"></div>
            <div class="w-full bg-gray-700 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
            <div class="w-full bg-gray-700 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
            <div class="w-full bg-gray-700 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
        </div>
        <span class="sr-only">Loading...</span>
    </div>
  );
};

export default WidgetPlaceholder;

