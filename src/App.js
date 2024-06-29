import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import emojiData from './emoji.json';
import fuzzysort from 'fuzzysort';
import morse from 'morse';
import Enchant from 'enchantment-table';

function App() {
  const [inputText, setInputText] = useState('');
  const [transformationType, setTransformationType] = useState('none');

  function fuzzyMatch(word) {
    // Find matches for the word among all keys (tags, descriptions, aliases)
    const results = fuzzysort.go(word.toLowerCase(), emojiData, {
      keys: [
        obj => obj.tags?.join(),
      ],
      all: true
    });
    if (!results.length)
      return emojiData[Math.floor(Math.random() * emojiData.length)].emoji; // Fallback to a random emoji if no results
    else
      return results[Math.floor(Math.random() * results.length)].obj.emoji;
    return results[0].obj.emoji;
  }

  const addEmojiToEveryWord = (text) => {
    const regex = /\b\w+'\w+|\w+|[^\w\s]/g;
    const words = text.match(regex);
    if (!words) return '';

    const wordsWithEmojis = words.map(word => {
      const emoji = fuzzyMatch(word);
      return emoji ? `${word} ${emoji}` : word;
    });
    return wordsWithEmojis.join(' ');
  };

  const transformText = useMemo(() => {
    switch (transformationType) {
      case 'sarcasm':
        return inputText.split('').map((char, index) => index % 2 !== 0 ? char.toLowerCase() : char.toUpperCase()).join('');
      case 'emoji':
        return addEmojiToEveryWord(inputText);
      case 'uwu':
        return inputText
          .toLowerCase()
          .replace(/\by(?=[a-zA-Z])/, "y-y")
          .replace(/\bs(?=[a-zA-Z])/, "s-s")
          .replace(/\bw(?=[a-zA-Z])/, "w-w")
          .replace(/r(?=[a-zA-Z])|l/gi, 'w')
          .replace(/or/gi, 'ow')
          .replace(/R(?=[a-zA-Z])|L/g, 'W')
          .replace(/n([aeiou])/gi, 'ny$1')
          .replace(/N([aeiou])/g, 'Ny$1')
          .replace(/ove/gi, 'uv')
          .replace(/OVE/g, 'UV');
      case 'encryption':
        // shuffle all letters of each word except the first and last letters
        return inputText.split(' ').map(word => {
          if (word.length <= 2) return word;
          const shuffledWord = word.split('').slice(1, -1).sort(() => Math.random() - 0.5).join('');
          return word[0] + shuffledWord + word[word.length - 1];
        }).join(' ');
      case 'leetspeak':
        return inputText
          .replace(/a/gi, '4')
          .replace(/e/gi, '3')
          .replace(/i/gi, '1')
          .replace(/o/gi, '0')
          .replace(/s/gi, '5')
          .replace(/t/gi, '7')
          .replace(/b/gi, '8')
          .replace(/g/gi, '9')
          .replace(/l/gi, '1')
          .replace(/z/gi, '2');
      case 'morse':
        return morse.encode(inputText);
      case 'enchantmenttable':
        return Enchant.translate(inputText);
      default:
        return inputText;
    }
  }, [inputText, transformationType]);

  useEffect(() => {
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    });
  }, [transformText]);

  return (
    <div className="App">
      <header className="App-header"> {/* Reduced padding/margin for the header */}
        <h1 style={{ marginBottom: '10px' }}>Cringe Speak</h1> {/* Reduced space below the heading */}
        <select
          value={transformationType}
          onChange={(e) => setTransformationType(e.target.value)}
          style={{ marginBottom: '20px' }} // Add space between select and textareas
        >
          <option value="none">None</option>
          <option value="sarcasm">Sarcasm</option>
          <option value="emoji">Emoji</option>
          <option value="uwu">UwU</option>
          <option value="encryption">Eycpnroitn</option>
          <option value="leetspeak">1337 5p34k</option>
          <option value="morse">-- --- .-. ... .</option>
          <option value="enchantmenttable">ᒷリᓵ⍑ᔑリℸᒲᒷリℸ ℸᔑʖꖎᒷ</option>
          {/* Add more options for different transformations as needed */}
        </select>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <div style={{ width: '50%', padding: '2%' }}> {/* Reduced padding */}
            <h2>Input</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type here..."
              style={{ width: '100%', border: '1px solid black', resize: 'vertical', fontSize: '24px' }} // Increased font size
            />
          </div>
          <div style={{ width: '50%', padding: '2%' }}> {/* Reduced padding */}
            <h2>Output</h2>
            <textarea
              value={transformText}
              readOnly
              style={{ width: '100%', border: '1px solid black', resize: 'vertical', backgroundColor: '#f0f0f0', fontSize: '24px' }} // Increased font size
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;