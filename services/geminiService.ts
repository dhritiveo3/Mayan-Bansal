
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Please set it to use Gemini API.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const chatModel = 'gemini-2.5-flash';
const liveModel = 'gemini-2.5-flash-native-audio-preview-09-2025';

const chat = ai.chats.create({
    model: chatModel,
    config: {
        systemInstruction: 'You are a helpful assistant for a lead management tool. Be concise and helpful.',
    },
});

export const getChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const result = await chat.sendMessage({ message: newMessage });
        return result.text;
    } catch (error) {
        console.error("Gemini chat error:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: chatModel,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini image analysis error:", error);
        return "Sorry, I couldn't analyze the image. Please try again.";
    }
}

// --- Live API Helper Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}
// --- End Live API Helper Functions ---


export const startLiveSession = (
    onMessage: (message: LiveServerMessage) => void,
    onError: (error: ErrorEvent) => void,
    onClose: (event: CloseEvent) => void,
    // FIX: Changed LiveSession to any as it's not exported from @google/genai
    onOpen: (sessionPromise: Promise<any>) => void,
) => {
    const sessionPromise = ai.live.connect({
        model: liveModel,
        callbacks: {
            onopen: () => onOpen(sessionPromise),
            onmessage: onMessage,
            onerror: onError,
            onclose: onClose,
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: 'You are a friendly and helpful assistant for managing sales leads.',
        },
    });

    return sessionPromise;
};

export { createBlob, decode, decodeAudioData };