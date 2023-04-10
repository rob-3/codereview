#!/usr/bin/env node

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { mkdirSync, writeFileSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.ACCESS_KEY || !process.env.SECRET_ACCESS_KEY || !process.env.WORKERS_URL) {
	console.log("Missing environment variables");
	process.exit(1);
}

if (!process.argv[2]) {
	console.log("Usage: reviewer <path>");
	process.exit(1);
}

const s3 = new S3Client({
	region: "auto",
	endpoint: process.env.WORKERS_URL,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
});

(async () => {
	const rsp = await s3.send(new GetObjectCommand({ Bucket: "uploads", Key: "test" }));
	const files: Record<string, string> = JSON.parse(await rsp.Body?.transformToString() ?? "{}");
	for (const [path, value] of Object.entries(files)) {
		mkdirSync(process.argv[2] + "/" + path.split("/").slice(0, -1).join("/"), { recursive: true });
		writeFileSync(`${process.argv[2]}/${path}`, value);
	}
})();
