import { ChannelType, Message } from '../../types/crm';

export interface SendMessageOptions {
  recipientId: string;
  text: string;
  attachments?: { type: string; url: string; name: string }[];
  replyToMessageId?: string;
  idempotencyKey?: string;
}

export interface SendMessageResult {
  success: boolean;
  messageId: string;
  isMock: boolean;
  provider: ChannelType;
  timestamp: string;
  error?: string;
}

export interface IChannelAdapter {
  provider: ChannelType;
  isConfigured(): boolean;
  sendMessage(options: SendMessageOptions): Promise<SendMessageResult>;
  verifyWebhook(headers: Record<string, string>, body: any): boolean;
  handleInboundWebhook(body: any): Promise<{ customerId: string; customerName: string; text: string }>;
}

/**
 * Base Mock Adapter used when credentials are not configured
 */
export class MockChannelAdapter implements IChannelAdapter {
  constructor(public provider: ChannelType) {}

  isConfigured(): boolean {
    return false; // Running in Mock/Demo mode
  }

  async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    // Simulate real network delay between 150ms and 350ms
    await new Promise((res) => setTimeout(res, 200));

    return {
      success: true,
      messageId: `mock_${this.provider}_${Date.now()}`,
      isMock: true,
      provider: this.provider,
      timestamp: new Date().toISOString(),
    };
  }

  verifyWebhook(_headers: Record<string, string>, _body: any): boolean {
    return true;
  }

  async handleInboundWebhook(body: any) {
    return {
      customerId: body.sender_id || 'mock-customer',
      customerName: body.sender_name || 'Khách Hàng Thử Nghiệm',
      text: body.message?.text || 'Tin nhắn mô phỏng từ webhook test',
    };
  }
}

/**
 * Telegram Production Adapter
 */
export class TelegramChannelAdapter implements IChannelAdapter {
  public provider: ChannelType = 'telegram';
  private botToken: string;

  constructor(token?: string) {
    this.botToken = token || process.env.TELEGRAM_BOT_TOKEN || '';
  }

  isConfigured(): boolean {
    return Boolean(this.botToken && this.botToken.length > 20);
  }

  async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    if (!this.isConfigured()) {
      return new MockChannelAdapter('telegram').sendMessage(options);
    }

    try {
      const res = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: options.recipientId,
          text: options.text,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.description || 'Telegram API Error');
      }

      return {
        success: true,
        messageId: String(data.result.message_id),
        isMock: false,
        provider: 'telegram',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        success: false,
        messageId: '',
        isMock: false,
        provider: 'telegram',
        timestamp: new Date().toISOString(),
        error: err.message,
      };
    }
  }

  verifyWebhook(headers: Record<string, string>, body: any): boolean {
    return true;
  }

  async handleInboundWebhook(body: any) {
    const msg = body.message || body.edited_message;
    return {
      customerId: String(msg?.from?.id || 'unknown'),
      customerName: `${msg?.from?.first_name || ''} ${msg?.from?.last_name || ''}`.trim() || 'Người dùng Telegram',
      text: msg?.text || '',
    };
  }
}

/**
 * Meta (Facebook / Instagram) Production Adapter
 */
export class MetaChannelAdapter implements IChannelAdapter {
  constructor(
    public provider: 'facebook' | 'instagram',
    private pageAccessToken: string = process.env.META_PAGE_ACCESS_TOKEN || ''
  ) {}

  isConfigured(): boolean {
    return Boolean(this.pageAccessToken && this.pageAccessToken.length > 10);
  }

  async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    if (!this.isConfigured()) {
      return new MockChannelAdapter(this.provider).sendMessage(options);
    }

    try {
      const endpoint = `https://graph.facebook.com/v19.0/me/messages?access_token=${this.pageAccessToken}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: options.recipientId },
          message: { text: options.text },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Meta Graph API Error');
      }

      return {
        success: true,
        messageId: data.message_id,
        isMock: false,
        provider: this.provider,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        success: false,
        messageId: '',
        isMock: false,
        provider: this.provider,
        timestamp: new Date().toISOString(),
        error: err.message,
      };
    }
  }

  verifyWebhook(headers: Record<string, string>, body: any): boolean {
    return true;
  }

  async handleInboundWebhook(body: any) {
    const entry = body.entry?.[0];
    const messaging = entry?.messaging?.[0];
    return {
      customerId: messaging?.sender?.id || 'unknown',
      customerName: 'Người dùng Meta',
      text: messaging?.message?.text || '',
    };
  }
}

/**
 * Zalo OA Adapter
 */
export class ZaloOaAdapter implements IChannelAdapter {
  public provider: ChannelType = 'zalo_oa';
  private accessToken: string = process.env.ZALO_REFRESH_TOKEN || '';

  isConfigured(): boolean {
    return Boolean(this.accessToken);
  }

  async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    if (!this.isConfigured()) {
      return new MockChannelAdapter('zalo_oa').sendMessage(options);
    }

    // Call Zalo Open API
    return {
      success: true,
      messageId: `zalo_oa_${Date.now()}`,
      isMock: true,
      provider: 'zalo_oa',
      timestamp: new Date().toISOString(),
    };
  }

  verifyWebhook(): boolean {
    return true;
  }

  async handleInboundWebhook(body: any) {
    return {
      customerId: body.sender?.id || 'zalo-user',
      customerName: body.sender?.name || 'Khách Zalo OA',
      text: body.message?.text || '',
    };
  }
}

/**
 * Channel Adapter Factory
 */
export function getChannelAdapter(channel: ChannelType): IChannelAdapter {
  switch (channel) {
    case 'telegram':
      return new TelegramChannelAdapter();
    case 'facebook':
      return new MetaChannelAdapter('facebook');
    case 'instagram':
      return new MetaChannelAdapter('instagram');
    case 'zalo_oa':
      return new ZaloOaAdapter();
    default:
      return new MockChannelAdapter(channel);
  }
}
