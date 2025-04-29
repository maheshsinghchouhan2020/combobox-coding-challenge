import "./App.css";
import ComboBox from "./components/ComboBox";

function App() {
  const animals = [
    "Lion",
    "Tiger",
    "Elephant",
    "Giraffe",
    "Zebra",
    "Kangaroo",
    "Panda",
    "Penguin",
    "Dolphin",
    "Cheetah",
    "Koala",
    "Gorilla",
    "Hippopotamus",
    "Rhinoceros",
    "Polar Bear",
    "Wolf",
    "Fox",
    "Deer",
    "Rabbit",
    "Squirrel",
  ];

  return (
    <>
      <div>
        <h1>Animal Selection Combobox</h1>
        <ComboBox options={animals} label="Animals" />
      </div>
    </>
  );
}

export default App;
