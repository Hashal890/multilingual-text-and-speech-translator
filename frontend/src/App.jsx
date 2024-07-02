import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Select,
  Textarea,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaStopCircle } from "react-icons/fa";
import LanguagesSelect from "./components/LanguagesSelect";

const App = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();
  const { speak, voices } = useSpeechSynthesis();

  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
    }
  }, [transcript]);

  const handleTranslate = async () => {
    try {
      const response = await axios.post(
        "https://multilingual-text-and-speech-translator.onrender.com/translate-text",
        {
          text: sourceText,
          sourceLang,
          targetLang,
        }
      );
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleSpeechToText = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening();
    }
  };

  const handleTextToSpeech = () => {
    const voice = voices.find((voice) => voice.lang.startsWith(targetLang));
    speak({ text: translatedText, voice });
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <Box p={5} maxW="container.md" mx="auto">
      <VStack spacing={5} w="100%">
        <Textarea
          placeholder="Enter text to translate"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          size="sm"
          resize="vertical"
        />
        <HStack spacing={5} w="100%" flexWrap="wrap">
          <Select
            placeholder="Select source language"
            onChange={(e) => setSourceLang(e.target.value)}
            key="source-lang"
            value={sourceLang}
            flexBasis={{ base: "100%", md: "48%" }}
          >
            <LanguagesSelect />
          </Select>
          <Select
            placeholder="Select target language"
            onChange={(e) => setTargetLang(e.target.value)}
            key="target-lang"
            value={targetLang}
            flexBasis={{ base: "100%", md: "48%" }}
          >
            <LanguagesSelect />
          </Select>
        </HStack>
        <Button
          onClick={handleTranslate}
          w={{ base: "100%", md: "48%" }}
          colorScheme="linkedin"
        >
          Translate
        </Button>
        <Text>Translated Text:</Text>
        <Textarea value={translatedText} readOnly size="sm" resize="vertical" />
        <Button
          onClick={handleTextToSpeech}
          w={{ base: "100%", md: "48%" }}
          colorScheme="linkedin"
        >
          Play Translated Text
        </Button>
        <Button
          aria-label="Toggle listening"
          onClick={handleSpeechToText}
          rightIcon={listening ? <FaStopCircle /> : <HiSpeakerWave />}
          colorScheme="linkedin"
          w={{ base: "100%", md: "48%" }}
        >
          {listening ? "Stop Listening" : "Start Listening"}
        </Button>
      </VStack>
    </Box>
  );
};

export default App;
