import { build, emptyDir } from "/dev_deps.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",

  shims: {
    deno: true,
  },

  package: {
    name: "typeguardkit",
    version: Deno.args[0],

    description:
      "A TypeScript module to help create a type and its guards from a single source definition.",

    license: "MIT",

    repository: {
      type: "git",
      url: "git+https://github.com/antonebbage/typeguardkit.git",
    },

    bugs: {
      url: "https://github.com/antonebbage/typeguardkit/issues",
    },
  },
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
