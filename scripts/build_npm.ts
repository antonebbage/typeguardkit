import { build, emptyDir } from "dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  importMap: "./import_map.json",
  outDir: "./npm",

  shims: {
    deno: true,
  },

  package: {
    name: "typeguardkit",
    version: Deno.args[0],

    description:
      "A TypeScript module to help construct type assertion functions and type guards.",

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
