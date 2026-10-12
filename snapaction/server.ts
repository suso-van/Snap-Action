import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), hasApiKey: !!process.env.GEMINI_API_KEY });
  });

  // Multimodal Screenshot Analysis Endpoint
  app.post('/api/analyze-screenshot', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', filename, sampleId } = req.body;

      if (!imageBase64 && !sampleId) {
        return res.status(400).json({ error: 'No image data or sampleId provided' });
      }

      const ai = getGenAI();

      if (!ai) {
        return res.status(200).json({
          status: 'simulated',
          message: 'Running in high-fidelity mock extraction mode (GEMINI_API_KEY not set)',
          result: null
        });
      }

      // If base64 image data is provided, analyze it with Gemini
      const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '') : null;

      const systemPrompt = `You are SnapAction's visual AI engine. Analyze the provided screenshot with multimodal vision and OCR.
Identify the core intent, extract all meaningful entities (dates, times, reference codes, names, amounts, locations, tasks), categorize it accurately into one of the specialized categories, mark the provenance of each extracted field (whether it was directly found in the screenshot, inferred by AI, or verified), and suggest practical high-leverage user actions.

Supported Categories:
- "ticket": Flights, trains, boarding passes, cinema/concert tickets, hotel reservations.
- "event": Calendar appointments, meetings, webinars, conferences, scheduled sessions.
- "task": To-dos, deadlines, sprint tickets, Slack/chat action items, work requests.
- "payment": Bills, utility fees, invoices, payment due dates, bank transfers.
- "receipt": Shopping receipts, store purchase slips, warranties (ONLY include warranty date if explicitly on receipt or verified standard policy).
- "package": Courier delivery, shipping updates, tracking numbers, carriers (Amazon, FedEx, UPS, DHL, etc.).
- "address": Places, venues, restaurants, physical store locations, navigation targets.
- "contact": Business cards, people profiles, contact cards (name, phone, email, title, company).
- "link": Web links, articles, blogs, online resources, newsletter links.
- "github": GitHub repositories, open-source projects, code snippets, issue trackers.
- "document": General documents, contracts, notes, certificates, reference sheets.
- "unclear": Blurry, corrupt, or unreadable screenshots.
- "none": Landscape or photo with no actionable information.

Provenance Rules:
- "extracted": Value is directly visible in the text/pixels of the screenshot.
- "inferred": Value is logically deduced/calculated by the AI (e.g. check-in cutoff 1h before departure, priority inferred from urgent tone).
- "verified": Value conforms to a known standard or verified format (e.g. valid tracking number format, standard airport code CCU).

Warnings:
If any critical field is missing or ambiguous (e.g. payment due date unclear, warranty period assumed, carrier unknown), include an informative warning string in the warnings array.

Suggested Actions:
Provide 2 to 4 contextual actions tailored to the category. actionType must be one of:
"calendar", "reminder", "map", "pay", "track", "task", "copy", "share", "call", "email", "contact", "open_link", "open_github".`;

      let parts: any[] = [];
      if (cleanBase64) {
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || 'image/jpeg',
          },
        });
      }
      parts.push({
        text: `Analyze this screenshot thoroughly. Extract all entities and output strictly valid JSON matching the following schema.
File reference: ${filename || 'user_screenshot.png'}`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              warnings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              extractedEntities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    key: { type: Type.STRING },
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                    type: { type: Type.STRING },
                    isEditable: { type: Type.BOOLEAN },
                    provenance: { type: Type.STRING, description: '"extracted" | "inferred" | "verified"' },
                    confidence: { type: Type.NUMBER },
                    isWarning: { type: Type.BOOLEAN },
                    warningMessage: { type: Type.STRING },
                  },
                  required: ['key', 'label', 'value', 'type'],
                },
              },
              suggestedActions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    riskLevel: { type: Type.STRING },
                    isPrimary: { type: Type.BOOLEAN },
                    iconName: { type: Type.STRING },
                    details: {
                      type: Type.OBJECT,
                      properties: {
                        eventTitle: { type: Type.STRING },
                        datetime: { type: Type.STRING },
                        endDate: { type: Type.STRING },
                        location: { type: Type.STRING },
                        amount: { type: Type.STRING },
                        currency: { type: Type.STRING },
                        merchant: { type: Type.STRING },
                        dueDate: { type: Type.STRING },
                        paymentRef: { type: Type.STRING },
                        trackingNumber: { type: Type.STRING },
                        carrier: { type: Type.STRING },
                        destination: { type: Type.STRING },
                        orderNumber: { type: Type.STRING },
                        taskTitle: { type: Type.STRING },
                        priority: { type: Type.STRING },
                        project: { type: Type.STRING },
                        address: { type: Type.STRING },
                        placeName: { type: Type.STRING },
                        phone: { type: Type.STRING },
                        email: { type: Type.STRING },
                        contactName: { type: Type.STRING },
                        organization: { type: Type.STRING },
                        titleRole: { type: Type.STRING },
                        productName: { type: Type.STRING },
                        warrantyDate: { type: Type.STRING },
                        url: { type: Type.STRING },
                        repoName: { type: Type.STRING },
                        repoOwner: { type: Type.STRING },
                        cloneUrl: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                    },
                  },
                  required: ['id', 'title', 'subtitle', 'actionType', 'riskLevel'],
                },
              },
              ocrText: { type: Type.STRING },
              boundingBoxes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    box: {
                      type: Type.ARRAY,
                      items: { type: Type.NUMBER },
                      description: '[ymin, xmin, ymax, xmax] 0-1000 scale',
                    },
                  },
                },
              },
            },
            required: ['category', 'title', 'summary', 'confidenceScore', 'extractedEntities', 'suggestedActions'],
          },
        },
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);

      return res.json({
        status: 'success',
        result: parsed,
      });
    } catch (error: any) {
      console.error('Error analyzing screenshot with Gemini:', error);
      return res.status(500).json({
        error: error.message || 'Failed to analyze screenshot',
        status: 'error',
      });
    }
  });

  // Contextual "Ask AI about this screenshot" endpoint
  app.post('/api/ask-screenshot', async (req, res) => {
    try {
      const { question, screenshotData, imageBase64, mimeType = 'image/jpeg' } = req.body;

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const ai = getGenAI();

      if (!ai) {
        // Fallback intelligent response based on provided context
        const contextStr = screenshotData ? JSON.stringify(screenshotData) : '';
        let answer = `Based on this screenshot, `;
        if (question.toLowerCase().includes('deadline') || question.toLowerCase().includes('due')) {
          answer += `the key deadline is identified as ${screenshotData?.extractedEntities?.find((e: any) => e.key.toLowerCase().includes('date') || e.key.toLowerCase().includes('due'))?.value || 'indicated in the details'}.`;
        } else if (question.toLowerCase().includes('who') || question.toLowerCase().includes('from')) {
          answer += `this appears to be from ${screenshotData?.extractedEntities?.find((e: any) => e.key.toLowerCase().includes('merchant') || e.key.toLowerCase().includes('carrier') || e.key.toLowerCase().includes('from'))?.value || screenshotData?.title || 'the source organization'}.`;
        } else {
          answer += `here is the summary: ${screenshotData?.summary || 'The screenshot has been processed and relevant action triggers are available.'}`;
        }

        return res.json({
          answer,
          suggestedFollowups: [
            'What action should I take next?',
            'Is there any hidden cost?',
            'Add this to my reminders'
          ]
        });
      }

      const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '') : null;
      const parts: any[] = [];

      if (cleanBase64) {
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || 'image/jpeg',
          },
        });
      }

      const promptText = `The user is asking a specific contextual question about this screenshot.
Extracted context: ${JSON.stringify(screenshotData || {})}

User Question: "${question}"

Respond concisely (2-4 sentences max), direct, and actionable. Do not be conversational or use marketing fluff.
Also suggest 2-3 short relevant follow-up questions.`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          systemInstruction: 'You are SnapAction Context Assistant. Provide precise, fact-based answers exclusively based on the screenshot content.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              suggestedFollowups: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['answer', 'suggestedFollowups'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error asking about screenshot:', error);
      return res.status(500).json({
        error: error.message || 'Failed to answer question',
      });
    }
  });

  // Vite middleware in dev mode / static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SnapAction server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
