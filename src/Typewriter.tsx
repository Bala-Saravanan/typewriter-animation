import React, { useEffect, useRef, useState } from "react";
import "./index.css";

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  repeat?: boolean;
  className?: string;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  speed = 100,
  delay = 1500,
  repeat = true,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const words = useRef<string[]>(text.split(",").map((word) => word.trim()));
  const isMounted = useRef(true);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getWidestWord = (words: string[]) =>
    words.reduce((a, b) => (a.length > b.length ? a : b), "");
  const typeWord = async (word: string) => {
    setIsTyping(true);
    for (let char of word) {
      if (!isMounted.current) return;
      setDisplayedText((prev) => prev + char);
      await wait(speed);
    }

    setIsTyping(false);
    await wait(delay);

    setIsTyping(true);
    for (let i = word.length; i > 0; i--) {
      if (!isMounted.current) return;
      setDisplayedText((prev) => prev.slice(0, -1));
      await wait(speed);
    }

    setIsTyping(false);
    await wait(delay);
  };

  const runTypingLoop = async () => {
    do {
      for (const word of words.current) {
        await typeWord(word);
      }
    } while (repeat && isMounted.current);
  };

  useEffect(() => {
    runTypingLoop();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <span
      className={className}
      style={{ display: "inline-block", position: "relative" }}
    >
      {/* Visible Text */}
      <span
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          position: "relative",
        }}
        className={!isTyping ? "typing" : ""}
      >
        {displayedText}
      </span>

      {/* Invisible placeholder to prevent layout shift */}
      <span
        style={{
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          whiteSpace: "nowrap",
        }}
      >
        {getWidestWord(words.current)}
      </span>
    </span>
  );
};

export default TypeWriter;
