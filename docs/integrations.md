# HAITECH CRM — Hướng Dẫn Tích Hợp Đa Nền Tảng (Integrations Guide)

Tài liệu hướng dẫn cấu hình kết nối thật cho 8 kênh giao tiếp chính thức trong HAITECH CRM.

---

## 1. Telegram Bot

1. Mở Telegram, tìm kiếm bot chính thức `@BotFather`.
2. Gõ `/newbot`, đặt tên bot (ví dụ: `HaitechCrmBot`) và username kết thúc bằng `_bot`.
3. Nhận mã `TELEGRAM_BOT_TOKEN`.
4. Đăng ký Webhook bằng lệnh HTTPS:
   ```bash
   curl -F "url=https://your-domain.com/api/v1/webhooks/telegram/your-account-id" \
        -F "secret_token=YOUR_WEBHOOK_SECRET" \
        https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook
   ```
5. Nhập Token vào trang **Cài Đặt** trong HAITECH CRM.

---

## 2. Meta (Facebook Messenger & Instagram Direct)

1. Truy cập [Meta for Developers](https://developers.facebook.com/).
2. Tạo App thuộc loại **Business**. Thêm sản phẩm **Messenger** và **Instagram Graph API**.
3. Kết nối Fanpage Facebook và tài khoản Instagram Professional.
4. Cấp các quyền (`permissions`): `pages_messaging`, `pages_manage_metadata`, `instagram_basic`, `instagram_manage_messages`.
5. Tạo Page Access Token dài hạn.
6. Cấu hình Webhook Callback URL: `https://your-domain.com/api/v1/webhooks/facebook/:accountId` và Verify Token.
7. Đăng ký các trường sự kiện: `messages`, `messaging_postbacks`.

---

## 3. Zalo Official Account (Zalo OA)

1. Đăng nhập [Zalo for Developers](https://developers.zalo.me/).
2. Tạo ứng dụng liên kết với tài khoản Zalo OA đã được xác thực (Tích vàng).
3. Xin cấp quyền các API: Gửi tin nhắn CSKH, nhận tin nhắn Webhook, Zalo Notification Service (ZNS).
4. Thiết lập Webhook URL và Secret Key xác thực trong trang cấu hình Zalo OA.
*Lưu ý đối với "Zalo cá nhân": Tuân thủ chính sách bảo mật của Zalo, chỉ triển khai qua các giải pháp API doanh nghiệp được cấp phép.*

---

## 4. TikTok Shop Messaging

1. Truy cập [TikTok for Developers](https://developers.tiktok.com/) và đăng ký tài khoản TikTok Business.
2. Đăng ký quyền sử dụng API tin nhắn chăm sóc khách hàng TikTok Shop.
3. Nhập App ID và App Secret vào HAITECH CRM.
4. Cấu hình nhận webhook đơn hàng và tin nhắn tư vấn từ người mua hàng.

---

## 5. Website Livechat Widget

Nhúng mã JavaScript vào thẻ `<head>` hoặc `<body>` của website:
```html
<script 
  src="https://cdn.haitech.vn/widget/v1/sdk.js" 
  data-workspace-id="ws-haitech-01" 
  data-app-key="ht-web-widget-992" 
  async>
</script>
```
Hỗ trợ WebSockets thời gian thực, chống spam bằng cookie consent và nhận diện khách hàng tự động.
