import { hashAdminPassword } from "../lib/applications/password";

const password = process.argv[2] || "";
if (!password) {
  console.error("Usage: npx tsx scripts/hash-admin-password.ts <password>");
  process.exit(1);
}

hashAdminPassword(password)
  .then((hash) => {
    console.log(hash);
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Unable to hash password.");
    process.exit(1);
  });
