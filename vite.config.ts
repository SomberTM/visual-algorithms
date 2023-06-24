import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: "@/context",
				replacement: path.resolve(__dirname, "src/components/context"),
			},
			{
				find: "@",
				replacement: path.resolve(__dirname, "src"),
			},
		],
	},
});
