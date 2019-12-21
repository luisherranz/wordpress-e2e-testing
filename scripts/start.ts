import { spawn } from "child-process-promise";
import config from "../data/config.json";

(async () => {
  // Stop containers in case they are still running.
  await spawn("docker-compose", ["down", "-v"], { stdio: "inherit" });
  // Start containers.
  await spawn("docker-compose", ["up", "-d"], { stdio: "inherit" });
  // Wait until server is ready.
  await spawn("npx", ["wait-on", "http-get://localhost:8080"], {
    stdio: "inherit"
  });
  // Change permissions to the wp-content folder because volumes have root
  // permissions by default.
  await spawn("docker-compose", [
    "run",
    "wp",
    "/bin/bash",
    "-c",
    "chown -R www-data:www-data /var/www/html/wp-content/"
  ]);
  // Install plugins.
  await Promise.all(
    config.plugins.map(plugin =>
      spawn(
        "docker-compose",
        [
          "run",
          "--user",
          "33:33",
          "--rm",
          "wpcli",
          "plugin",
          "install",
          ...plugin.split(" ")
        ],
        { stdio: "inherit" }
      )
    )
  );
})();
