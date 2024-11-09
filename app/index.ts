import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const APPLE_TEAM_ID = "APPLE_TEAM_ID";
const IOS_BUNDLE_ID = "com.eugenechekerdes.cuber";
const ANDROID_PACKAGE_NAME = "com.eugene_chekerdes.cuber";

dotenv.config({
  path: path.join(__dirname, "..", `.env.${process.env.NODE_ENV}`),
});

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/.well-known/apple-app-site-association", (req, res) => {
  const applicationID = `${APPLE_TEAM_ID}.${IOS_BUNDLE_ID}`;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(
    JSON.stringify({
      applinks: {
        apps: [],
        details: [
          {
            appID: applicationID,
            paths: ["*"],
          },
        ],
      },
      webcredentials: {
        apps: [applicationID],
      },
    })
  );
  res.end();
});

app.get("/.well-known/assetlinks.json", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(
    JSON.stringify([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: ANDROID_PACKAGE_NAME,
          sha256_cert_fingerprints: [
            "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C",
          ],
        },
      },
    ])
  );
  res.end();
});

app.use(express.static('public'))
app.get("*", (req, res, next) => {
  const title = "Cuber";
  const subtitle = "Find out more about Cuber app";
  const image = "../../public/images/cuber-web-image.webp";

  const templatePath = path.join(__dirname, "../../public/html/index.html");

  var source = fs
    .readFileSync(templatePath, { encoding: "utf-8" })
    .replaceAll("{{title}}", title)
    .replaceAll("{{subtitle}}", subtitle)
    .replaceAll("{{image}}", image);

  res.send(source);
  return;
});

export default app;
