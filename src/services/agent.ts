import { ApiService } from './api';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AgentService extends ApiService {
  constructor() {
    const apiKey = process.env.NVIDIA_API_KEY;
    const baseURL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    
    super(baseURL, apiKey);
  }

  async analyzeExposure(statement: string, markets: any[]): Promise<string> {
    const prompt = `
      Analyze the following risk exposure and recommend hedging strategies using the available markets:
      
      Risk Statement: ${statement}
      
      Available Markets:
      ${markets.map(m => `- ${m.title} (${m.currentPrice}): ${m.ruleText}`).join('\n')}
      
      Please provide:
      1. An analysis of the key risks in the statement
      2. Recommendations for which markets to use for hedging
      3. Suggested weights/allocations for each market
      4. Expected coverage percentage
      5. Any residual risks that would remain
    `;

    try {
      const response = await this.post<ChatCompletionResponse>('/chat/completions', {
        model: process.env.NVIDIA_MODEL || 'qwen/qwen3-next-80b-a3b-thinking',
        messages: [
          {
            role: 'system',
            content: 'You are a financial risk analyst expert in hedging strategies. Provide concise, actionable recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing exposure with AI agent:', error);
      return 'Unable to analyze exposure at this time. Please try again later.';
    }
  }

  async scoreMarketFit(exposure: string, market: any): Promise<{ fit: number; explanation: string }> {
    const prompt = `
      Score how well this market fits as a hedge for the given exposure:
      
      Exposure: ${exposure}
      Market: ${market.title}
      Description: ${market.ruleText}
      Current Price: ${market.currentPrice}
      
      Please provide:
      1. A fit score between 0-1 (where 1 is perfect fit)
      2. A brief explanation of why this score was given
    `;

    try {
      const response = await this.post<ChatCompletionResponse>('/chat/completions', {
        model: process.env.NVIDIA_MODEL || 'qwen/qwen3-next-80b-a3b-thinking',
        messages: [
          {
            role: 'system',
            content: 'You are a financial risk analyst expert in hedging strategies. Provide concise, actionable recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      // Extract fit score from response (this is a simplified approach)
      const content = response.choices[0].message.content;
      const fitScoreMatch = content.match(/fit score.*?(\d+(\.\d+)?)/i);
      const fit = fitScoreMatch ? parseFloat(fitScoreMatch[1]) : 0.5;

      return {
        fit: Math.min(Math.max(fit, 0), 1), // Ensure fit is between 0 and 1
        explanation: content
      };
    } catch (error) {
      console.error('Error scoring market fit with AI agent:', error);
      return {
        fit: 0.5,
        explanation: 'Unable to score market fit at this time. Using default score of 0.5.'
      };
    }
  }
}