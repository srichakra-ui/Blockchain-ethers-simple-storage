const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  //http://127.0.0.1:7545
  //console.log(process.env.PRIVATE_KEY);
  //console.log(process.env.RPC_URL);
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // script connection to blockchain
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // connecting wallet to sign transactions
  //const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
  //let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  // encryptedJson,
  //process.env.PRIVATE_KEY_PASSWORD
  //);
  //wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8"); // abi file connection
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  ); // binary file connection
  // In ethers we use contract factory to deploy contracts
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1); //what you get when you wait for a confirmation
  console.log(`contract address =${contract.address}`);
  const currentFavouriteNumber = await contract.retrieve();
  console.log(`Current favourite number: ${currentFavouriteNumber}`);
  const transactionResponse = await contract.store("7");
  const transactionReciept = await transactionResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();
  console.log(`updated favourite number: ${updatedFavouriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
