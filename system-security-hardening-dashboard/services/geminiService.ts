import { GoogleGenAI } from "@google/genai";
import type { GenerateContentParameters } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const textModel = 'gemini-2.5-flash';

/**
 * Generates a detailed explanation and remediation advice for a given security check.
 * @param checkTitle The title of the security check (e.g., "Kernel Parameter Hardening").
 * @param checkDescription The description of what the check does.
 * @returns A promise that resolves to a string containing the AI-generated advice.
 */
export const getRemediationInfo = async (checkTitle: string, checkDescription: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("AI features are disabled because the API key is not configured.");
  }
  
  const prompt = `
    Act as a senior cybersecurity analyst providing advice on system hardening for a Linux-based desktop, specifically for an Arch Linux user.
    A security scan has produced the following finding:

    **Finding Title:** "${checkTitle}"
    **Description:** "${checkDescription}"

    Based on this finding, please provide the following in clear, concise language:

    1.  **Threat Explanation:** Briefly explain the security risk associated with this finding in simple terms. What could an attacker do if this is misconfigured?
    2.  **Remediation Steps:** Provide clear, actionable, step-by-step instructions on how to remediate this issue on an Arch Linux system. Include specific commands and file paths where applicable.
    3.  **Verification:** Explain how the user can verify that the issue has been successfully resolved.

    Format your response cleanly. Use Markdown for formatting, such as bolding for emphasis and code blocks for commands.
    `;

  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error(`Error calling Gemini API for check "${checkTitle}":`, error);
    throw new Error('Failed to get remediation information from AI service.');
  }
};

/**
 * Generates a chat response from the AI model, potentially including an image.
 * @param textPrompt The text prompt from the user.
 * @param imageBase64 Optional base64 encoded image string.
 * @param imageMimeType Mime type of the image if provided.
 * @returns A promise that resolves to the AI's text response.
 */
export const generateChatResponse = async (
    textPrompt: string, 
    imageBase64?: string, 
    imageMimeType?: string
): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("AI features are disabled. Please configure your API key.");
    }

    const contents: GenerateContentParameters['contents'] = { parts: [] };
    
    // Add image part if it exists
    if (imageBase64 && imageMimeType) {
        contents.parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: imageMimeType,
            },
        });
    }

    // Add text part
    contents.parts.push({ text: textPrompt });

    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: contents,
            config: {
                systemInstruction: "You are CyberSphere's AI assistant. You are a helpful, creative, and highly intelligent expert in cybersecurity, software development, and data analysis. Provide clear, accurate, and professional answers. When asked to create a diagram, use mermaidjs syntax.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for chat:", error);
        return "Sorry, an error occurred while communicating with the AI. Please check the console for details.";
    }
};