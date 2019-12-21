import { exec } from "child-process-promise";

const cmd = "exec mysqldump -uroot -ppassword wordpress";

(async () => {
  await exec(`docker-compose exec -T db sh -c "${cmd}"  > "data/db.sql"`);
})();
