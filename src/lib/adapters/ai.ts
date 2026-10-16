// ========================================================
// HAITECH CRM - AI PROVIDER ADAPTERS
// ========================================================

export interface AiPromptRequest {
  systemPrompt?: string;
  userMessage: string;
  conversationHistory?: { role: 'user' | 'assistant' | 'system'; content: string }[];
  contextDocuments?: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface AiPromptResponse {
  text: string;
  model: string;
  provider: 'openai' | 'anthropic' | 'gemini' | 'mock';
  confidence: number;
  tokensUsed: number;
  latencyMs: number;
  isMock: boolean;
  citationSources?: string[];
}

export interface IAiAdapter {
  providerName: string;
  isConfigured(): boolean;
  generateReply(req: AiPromptRequest): Promise<AiPromptResponse>;
}

export class MockAiAdapter implements IAiAdapter {
  public providerName = 'Mock AI Engine';

  isConfigured(): boolean {
    return false;
  }

  async generateReply(req: AiPromptRequest): Promise<AiPromptResponse> {
    const start = Date.now();
    await new Promise((res) => setTimeout(res, 350));

    const promptLower = req.userMessage.toLowerCase();
    let reply =
      'Dạ chào anh/chị, em là AI Trợ lý của HAITECH CRM. Em đã ghi nhận nội dung trao đổi và sẽ chuyển thông tin cho chuyên viên hỗ trợ ngay ạ!';
    let confidence = 0.9;
    let source = 'HAITECH SOP-01';

    if (promptLower.includes('giá') || promptLower.includes('báo giá') || promptLower.includes('chi phí')) {
      reply =
        'Dạ chào anh/chị, giải pháp HAITECH CRM hiện cung cấp 3 gói: Startup (1.500.000đ/tháng), Growth (3.800.000đ/tháng) và Enterprise. Bên em đang có chính sách ưu đãi chiết khấu 15% khi thanh toán theo năm ạ!';
      confidence = 0.95;
      source = 'KB-01: Bảng giá dịch vụ HAITECH CRM';
    } else if (promptLower.includes('tiêu chuẩn') || promptLower.includes('qcvn') || promptLower.includes('thử nghiệm')) {
      reply =
        'Dạ máy lọc nước Dakrong đạt đầy đủ chứng nhận QCVN 6-1:2010/BYT từ Viện Sức khỏe Nghề nghiệp & Môi trường, sẵn sàng cung cấp phiếu kiểm định nước uống trực tiếp cho hồ sơ thầu dự án ạ!';
      confidence = 0.98;
      source = 'KB-02: Tiêu chuẩn Kỹ thuật Máy Lọc Nước Dakrong';
    }

    return {
      text: reply,
      model: 'haitech-mock-ai-v1',
      provider: 'mock',
      confidence,
      tokensUsed: 128,
      latencyMs: Date.now() - start,
      isMock: true,
      citationSources: [source],
    };
  }
}

export class OpenAiAdapter implements IAiAdapter {
  public providerName = 'OpenAI';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.startsWith('sk-'));
  }

  async generateReply(req: AiPromptRequest): Promise<AiPromptResponse> {
    if (!this.isConfigured()) {
      return new MockAiAdapter().generateReply(req);
    }

    const start = Date.now();
    try {
      const messages = [
        { role: 'system', content: req.systemPrompt || 'Bạn là trợ lý CRM tiếng Việt chuyên nghiệp.' },
        ...(req.conversationHistory || []),
        { role: 'user', content: req.userMessage },
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          temperature: req.temperature || 0.7,
        }),
      });

      const data = await res.json();
      return {
        text: data.choices[0].message.content,
        model: 'gpt-4o',
        provider: 'openai',
        confidence: 0.96,
        tokensUsed: data.usage?.total_tokens || 150,
        latencyMs: Date.now() - start,
        isMock: false,
      };
    } catch (err) {
      console.error('OpenAI generation error, falling back to mock', err);
      return new MockAiAdapter().generateReply(req);
    }
  }
}

export class AnthropicAdapter implements IAiAdapter {
  public providerName = 'Anthropic Claude';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.startsWith('sk-ant-'));
  }

  async generateReply(req: AiPromptRequest): Promise<AiPromptResponse> {
    if (!this.isConfigured()) {
      return new MockAiAdapter().generateReply(req);
    }

    const start = Date.now();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: req.maxTokens || 1024,
          system: req.systemPrompt,
          messages: [{ role: 'user', content: req.userMessage }],
        }),
      });

      const data = await res.json();
      return {
        text: data.content[0].text,
        model: 'claude-3-7-sonnet',
        provider: 'anthropic',
        confidence: 0.98,
        tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        latencyMs: Date.now() - start,
        isMock: false,
      };
    } catch (err) {
      console.error('Anthropic API error, falling back to mock', err);
      return new MockAiAdapter().generateReply(req);
    }
  }
}

export function getAiAdapter(preferredModel?: string): IAiAdapter {
  if (process.env.ANTHROPIC_API_KEY) return new AnthropicAdapter();
  if (process.env.OPENAI_API_KEY) return new OpenAiAdapter();
  return new MockAiAdapter();
}
