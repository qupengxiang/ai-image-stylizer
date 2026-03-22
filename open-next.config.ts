import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  name: "ai-image-stylizer",
  regions: ["hkg1"],
  buildCommand: "npm run build",
  outputDirectory: ".next",
  framework: {
    name: "nextjs"
  }
});