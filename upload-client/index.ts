#!/usr/bin/env node

import { readFileSync } from "fs";
import { globby } from "globby";
import { packageDirectory } from "pkg-dir";

const WORKER_URL = "https://help-worker.rob-3.workers.dev";

(async () => {
	const dir = await packageDirectory();
	if (!dir) {
		console.error("Cannot find a package.json in a parent directory");
		process.exit(1);
	}
	const filenames = await globby("**", { gitignore: true });

	const files: Record<string, string> = {};
	for (const filename of filenames) {
		const file = readFileSync(filename);
		files[filename] = file.toString();
	}
	await fetch(WORKER_URL, {
		method: "POST",
		body: JSON.stringify(files),
	});
	console.log("Success!");
})();
