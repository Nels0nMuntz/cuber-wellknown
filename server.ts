import app from "./app";

const port = process.env.PORT || 5005;

function main() {
  try {
    app.listen(port, () => {
      console.log(`[server]: Server is running at ${process.env.API_URL}:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
