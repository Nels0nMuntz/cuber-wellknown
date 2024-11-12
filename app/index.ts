import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
  path: path.join(__dirname, "..", `.env.${process.env.NODE_ENV}`),
});

const APPLE_TEAM_ID = "APPLE_TEAM_ID";
const IOS_BUNDLE_ID = "com.eugenechekerdes.cuber";
const ANDROID_PACKAGE_NAME = "com.eugene_chekerdes.cuber";
const STATICS_PATH =
  process.env.MODE === "production" ? "../../public/" : "../public/";



const app = express();
app.use(express.static("public"));
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
            "06:AD:ED:DF:15:C4:B2:4F:A7:14:12:85:F2:8C:44:07:76:3C:07:F7:55:CC:A4:8A:F3:44:CE:DE:1E:E4:D7:99",
          ],
        },
      },
    ])
  );
  res.end();
});

app.get("/", (req, res, next) => {
  const title = "Cuber";
  const subtitle = "Find out more about Cuber app";
  const image = `${STATICS_PATH}images/cuber-web-image.webp`;

  const templatePath = path.join(__dirname, `${STATICS_PATH}html/index.html`);

  var source = fs
    .readFileSync(templatePath, { encoding: "utf-8" })
    .replaceAll("{{title}}", title)
    .replaceAll("{{subtitle}}", subtitle)
    .replaceAll("{{image}}", image);

  res.send(source);
  return;
});

app.get("*", (req, res) => {
  res.send("Welcome!");
});

export default app;
