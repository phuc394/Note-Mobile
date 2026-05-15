import bcryptjs from "bcryptjs";

const password = "123456";

const hash = await bcryptjs.hash(password, 10);

console.log(hash);
