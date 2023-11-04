import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleButtonHover = (event) => {
    event.target.style.color = "green";
  };
  
  const handleButtonUnhover = (event) => {
    event.target.style.color = "black";
  };

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const fund = async() => {
    const confirmFund = window.confirm("Funding 1 ETH. Are you sure?");
    if (confirmFund) {
        if (atm) {  
          const tx = await atm.fund(1);
          await tx.wait();
          getBalance();

          // Show a success message to the user.
          alert("Successfully funded 1 ETH!");
        }
      }
  }

  const redeem = async() => {
    const confirmRedeem = window.confirm("Redeeming 1 ETH. Are you sure?");

    if (confirmRedeem) {
        if (atm) {
            let tx = await atm.redeem(1);
            await tx.wait();
            getBalance();

            // Show a success message to the user.
            alert("Successfully redeemed 1 ETH!");
        }
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={fund} style={{ margin: "0 10px" }} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonUnhover}>Fund 1 ETH</button>
        <button onClick={redeem} style={{ margin: "0 10px" }} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonUnhover}>Redeem 1 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container" style={{ color: 'purple', backgroundColor: 'lightblue' }}>
      <header><h1>Welcome to DJ's Mutual Fund!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
