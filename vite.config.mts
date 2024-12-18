/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react-swc";
import { gadget } from "gadget-server/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [gadget(), react()],
  clearScreen: false,
  test: {
    // reset mocks between tests
    mockReset: true,
  },
});
