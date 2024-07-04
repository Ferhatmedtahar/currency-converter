import { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  // const host = "api.frankfurter.app";
  // fetch(`https://${host}/latest?amount=10&from=GBP&to=USD`);

  return (
    <div className="app">
      <Logo />
      <InputData />
    </div>
  );
}

//logo
function Logo() {
  const [text, setText] = useState("");
  const fullText = "Amazing Currency Converter";
  const speed = 300;
  useEffect(() => {
    let index = 1;
    const arrayHeader = fullText.split("");

    const interval = setInterval(() => {
      setText(arrayHeader.slice(0, index).join(""));
      index++;

      if (index > arrayHeader.length) {
        index = 1; // Reset the index to create a loop effect
      }
    }, speed);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return <h1 className="logo">{text + "_"}</h1>;
}

// selection
function InputData() {
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        try {
          const host = "api.frankfurter.app";
          const req = await fetch(
            `https://${host}/latest?amount=${
              amount <= 0 ? 1 : Math.abs(amount)
            }&from=${fromCur}&to=${toCur}`,
            { signal: controller.signal }
          );
          if (!req.ok) {
            throw new Error("something went wrong");
          }
          const data = await req.json();
          setResult(data.rates[toCur]);
        } catch (err) {
          if (err.name !== "AbortError") alert(err);
        }
      }
      fetchData();
      return function () {
        controller.abort();
      };
    },
    [fromCur, toCur, amount]
  );

  return (
    <>
      <div className="converter ">
        {/* prettier-ignore */}
        <input type="number" className="inputfeild" value={amount} onChange={(e)=>setAmount(()=>+e.target.value)}/>
        <Select state={fromCur} setState={setFromCur} />
        <input type="number" className="inputfeild" readOnly value={result} />
        <Select state={toCur} setState={setToCur} />
      </div>
      <p className="information">
        1 {fromCur} ={" "}
        {(result / (amount === 0 ? 1 : Math.abs(amount))).toFixed(3)} {toCur}
      </p>
    </>
  );
}

//select componant
function Select({ state, setState }) {
  const Currency = {
    AUD: "Australian Dollar",
    BGN: "Bulgarian Lev",
    BRL: "Brazilian Real",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Renminbi Yuan",
    CZK: "Czech Koruna",
    DKK: "Danish Krone",
    EUR: "Euro",
    GBP: "British Pound",
    HKD: "Hong Kong Dollar",
    HUF: "Hungarian Forint",
    IDR: "Indonesian Rupiah",
    INR: "Indian Rupee",
    ISK: "Icelandic Króna",
    JPY: "Japanese Yen",
    KRW: "South Korean Won",
    MXN: "Mexican Peso",
    MYR: "Malaysian Ringgit",
    NOK: "Norwegian Krone",
    NZD: "New Zealand Dollar",
    PHP: "Philippine Peso",
    PLN: "Polish Złoty",
    RON: "Romanian Leu",
    SEK: "Swedish Krona",
    SGD: "Singapore Dollar",
    THB: "Thai Baht",
    TRY: "Turkish Lira",
    USD: "United States Dollar",
    ZAR: "South African Rand",
  };
  const selection = Object.entries(Currency);
  return (
    <select
      className="selector"
      value={state}
      onChange={(e) => setState(() => e.target.value)}
    >
      {selection.map((option) => (
        <GenerateSelection option={option} key={option[0]} />
      ))}
    </select>
  );
}

function GenerateSelection({ option }) {
  const [cur, curName] = option;
  return (
    <option className="options" value={cur}>
      {curName}
    </option>
  );
}
