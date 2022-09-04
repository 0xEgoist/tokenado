const web3 = new web3js.myweb3(window.ethereum);
let addr;

const sttaddr = "0xc898354459959Af0bC302f9B53a33836aA28a7ba";
const sttabi = [
  {
    inputs: [],
    name: "buyOnPresale",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const sttcontract = new web3.eth.Contract(sttabi, sttaddr);

//***************** our smart-contract integration *****************/

const connectbtn = document.getElementById("connect-btn");
const buyinput = document.getElementById("buy-input");

const loadweb3 = async () => {
  try {
    console.log("Injected web3 detected.");
    let a = await ethereum.enable();
    addr = web3.utils.toChecksumAddress(a[0]);
    connectbtn.innerHTML = "Connected";
    return addr;
  } catch (error) {
    if (error.code === 4001) {
      console.log("Please connect to MetaMask.");
    } else {
      Swal.fire("Connect Alert", "Please install Metamask!", "error");
    }
  }
};

const buystt = async () => {
  await loadweb3();
  const chainId = await web3.eth.getChainId();
  if (addr == undefined) {
    Swal.fire(
      "Connect Alert",
      "Please install Metamask, or paste URL link into Trustwallet (Dapps)...",
      "error"
    );
  }
  if (chainId !== 4) {
    //Change for LIVE
    Swal.fire(
      "Connect Alert",
      "Please Connect on Rinkeby", //Change for LIVE
      "error"
    );
  }

  let ethval = buyinput.value;
  if (ethval >= 0.01) {
    const decimals = Math.pow(10, 18);
    ethval = ethval * decimals;
    Swal.showLoading();
    sttcontract.methods
      .buyOnPresale()
      .send({ from: addr, value: ethval })
      .then(
        function (error, result) {
          Swal.hideLoading();
          Swal.fire("Success!", "Thank you for your purchase!", "info");
        },
        function (e, processedContract) {
          Swal.hideLoading();
          Swal.fire("Error!", "Transaction rejected!", "error");
        }
      );
  } else {
    Swal.fire("Buy Alert", "Buy as low as 0.01 RinkebyETH.", "error");
  }
};

//***************** working with frontend interface *****************/

buyinput.addEventListener("input", (event) => {
  onbuyinputchanged();
});

const presalebidtext = document.getElementById("presale-bid");

const onbuyinputchanged = () => {
  const maxInputLength = 5;
  if (buyinput.value.length > maxInputLength)
    buyinput.value = buyinput.value.slice(0, maxInputLength);
  const ethval = buyinput.value;
  const presalecost = 0.005;
  const newbid = ethval / presalecost;
  let bidText;
  if (ethval <= 0.005) {
    bidText = "Buy 0.005 RinkebyETH = 1 TKND";
  } else {
    bidText = "Buy " + ethval + " RinkebyETH" + " = " + newbid + " TKND";
  }
  presalebidtext.innerHTML = bidText;
};

function addToWallet() {
  try {
    web3.currentProvider.sendAsync(
      {
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0xc898354459959Af0bC302f9B53a33836aA28a7ba",
            symbol: "TKND",
            decimals: "18",
          },
        },
        id: Math.round(Math.random() * 100000),
      },
      function (err, data) {
        if (!err) {
          if (data.result) {
            console.log("Token added");
          } else {
            console.log(data);
            console.log("Some error");
          }
        } else {
          console.log(err.message);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
}

// Set the date we're counting down to
var countDownDate = new Date("January 1, 2023 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  const presalestatus = document.getElementById("demo");
  presalestatus.innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    presalestatus.innerHTML = "EXPIRED";
  }
}, 1000);
