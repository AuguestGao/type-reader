import { FormEvent, useEffect, useState } from "react";
import Textile from "../components/Textile";
import Typable from "../components/Typable";
import { Entry } from "../components/Entry";
import { demoBook } from "../utils/demoBook";
import { acceptables } from "../utils/acceptables";

const Demo = () => {
  const [currentIndex, setCurretnIndex] = useState(0);
  const [entries, setEntries] = useState(demoBook);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const pressedKey = e.key;

      const getEntryState = (incomingKey: string) => {
        return incomingKey === entries[currentIndex]["char"]
          ? "correct"
          : "incorrect";
      };

      if (pressedKey === "Backspace" && currentIndex > 0) {
        setEntries((entries) =>
          entries.map((entry) => {
            return entry.index === currentIndex
              ? { ...entry, state: "default" }
              : entry;
          })
        );
        setCurretnIndex(currentIndex - 1);
      }

      if (acceptables.includes(pressedKey)) {
        // console.log(pressedKey);

        setEntries((entries) =>
          entries.map((entry) => {
            return entry.index === currentIndex
              ? { ...entry, state: getEntryState(pressedKey) }
              : entry;
          })
        );
        setCurretnIndex(currentIndex + 1);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentIndex]);

  // useEffect(() => {});

  return (
    <Textile>
      <h1>Demo</h1>
      <Typable>
        {entries.map(({ char, state, index }) => {
          return (
            <Entry
              key={index}
              char={char}
              state={index === currentIndex ? "current" : state}
            />
          );
        })}
      </Typable>
    </Textile>
  );
};

export default Demo;
