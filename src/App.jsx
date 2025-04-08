import { useState, useRef } from 'react';

function App() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleToggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsListening(!isListening);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy.");
    }
  };

  const handleReset = () => {
    setTranscript('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Voice to Text AI App</h1>

      <textarea
        value={transcript}
        readOnly
        className="w-full max-w-xl h-48 p-4 border border-gray-300 rounded-md shadow resize-none text-lg"
        placeholder="Speak and your words will appear here..."
      />

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          onClick={handleToggleListening}
          className={`px-6 py-2 rounded text-white text-lg transition ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>

        <button
          onClick={handleCopy}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded"
        >
          Copy Text
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white text-lg rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
