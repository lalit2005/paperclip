/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';

export default function hotkeys() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === 'C' || event.key === 'c')) {
        event.preventDefault();
        document.getElementById('bold-btn').click();
      }
    };
    // const handleKeyDown = (event) => {
    //   if (event.ctrlKey && (event.key === "C" || event.key === "c")) {
    //     event.preventDefault();
    //     document.getElementById("bold-btn").click();
    //   }
    // };
    // const handleKeyDown = (event) => {
    //   if (event.ctrlKey && (event.key === "C" || event.key === "c")) {
    //     event.preventDefault();
    //     document.getElementById("bold-btn").click();
    //   }
    // };
    // const handleKeyDown = (event) => {
    //   if (event.ctrlKey && (event.key === "C" || event.key === "c")) {
    //     event.preventDefault();
    //     document.getElementById("bold-btn").click();
    //   }
    // };

    // window.addEventListener("keydown", handleKeyDown);
    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown);
    // };
  }, []);
}
