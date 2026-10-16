# HAITECH CRM — Đặc Tả API Hợp Đồng (REST API v1 Contract)

Tất cả các API tuân theo chuẩn RESTful `/api/v1`, định dạng JSON UTF-8.

## 1. Hộp thư & Hội thoại (Inbox & Conversations)

### `GET /api/v1/inbox/conversations`
Lấy danh sách hội thoại có phân trang và bộ lọc.
- **Query Params:**
  - `status`: `all` | `unread` | `needs_you` | `ai_active` | `open` | `closed`
  - `channel`: `all` | `website` | `facebook` | `instagram` | `telegram` | `tiktok` | `zalo_personal` | `zalo_oa`
  - `search`: Chuỗi tìm kiếm tên khách, số điện thoại, nội dung
- **Response:**
```json
{
  "data": [
    {
      "id": "conv-1",
      "customerId": "ct-1",
      "customerName": "Lắp Đặt Máy Lọc Nước Dakrong",
      "channel": "zalo_personal",
      "status": "open",
      "aiAutoReply": false,
      "unreadCount": 0,
      "lastMessageSnippet": "Trần Thị Hồng Nhung: Dạ vâng ạ",
      "lastMessageTime": "1 phút trước"
    }
  ],
  "total": 142,
  "unreadTotal": 9
}
```

---

### `GET /api/v1/conversations/:id/messages`
Lấy lịch sử tin nhắn của một hội thoại cụ thể và đánh dấu đã đọc.

### `POST /api/v1/conversations/:id/messages`
Gửi tin nhắn hoặc ghi chú nội bộ.
- **Request Body:**
```json
{
  "text": "Dạ em đã gửi bảng kiểm định QCVN 6-1 qua rồi ạ!",
  "isInternalNote": false,
  "senderType": "agent",
  "clientMessageId": "uuid-v4-here"
}
```
- **Response:**
```json
{
  "data": {
    "id": "msg-12345",
    "text": "...",
    "status": "mock_simulated",
    "createdAt": "11:20"
  },
  "status": "mock_simulated"
}
```

---

### `POST /api/v1/conversations/:id/ai/suggest`
Kích hoạt AI Subagent phân tích ngữ cảnh và đề xuất câu trả lời.
- **Response:**
```json
{
  "data": {
    "suggestion": "Dạ chào anh/chị, bên em có đầy đủ hồ sơ kiểm định theo QCVN 6-1:2010/BYT...",
    "confidence": 0.96,
    "source": "KB-02: Tiêu chuẩn Kỹ thuật Máy Lọc Nước Dakrong"
  },
  "hasApiKey": false
}
```

---

### `POST /api/v1/conversations/:id/ai/approve`
Phê duyệt câu trả lời của AI và chuyển tiếp trực tiếp vào kênh của khách.

---

## 2. Quản Lý Cơ Hội Bán Hàng (Pipeline & Deals)

### `GET /api/v1/deals`
Lấy toàn bộ danh sách deal và các cột giai đoạn kanban.

### `POST /api/v1/deals`
Tạo cơ hội mới liên kết trực tiếp với khách hàng hoặc hội thoại.
- **Request Body:**
```json
{
  "title": "Hợp đồng 50 bộ lọc tổng khu đô thị mới",
  "value": 145000000,
  "stageId": "stage-lead",
  "contactId": "ct-1",
  "contactName": "Lắp Đặt Máy Lọc Nước Dakrong",
  "expectedCloseDate": "2026-10-31"
}
```

### `PATCH /api/v1/deals/:id/stage`
Cập nhật giai đoạn cơ hội khi kéo thả trên Kanban.
- **Request Body:**
```json
{
  "stageId": "stage-survey"
}
```

---

## 3. Webhook Đa Nền Tảng (Inbound Webhooks)

### `POST /api/v1/webhooks/:provider/:accountId`
Đầu mối tiếp nhận sự kiện webhook chính thức từ Meta, Telegram, Zalo OA, TikTok, Website.
- **Header:** `X-Hub-Signature-256`, `X-Telegram-Bot-Api-Secret-Token`
- **Xử lý:** Kiểm tra xác thực chữ ký -> Tìm hoặc tạo contact -> Lưu tin nhắn -> Áp rule gán đội -> Kích hoạt AI nếu bật chế độ `AI tự trả lời`.

---

## 4. Hệ Thống & Kiểm Toán (System & Audit)

### `GET /api/v1/audit-logs`
Lấy danh sách nhật ký kiểm toán hành vi người dùng và AI.

### `POST /api/v1/system/seed`
Khôi phục dữ liệu seed ban đầu (142 hội thoại, deals, nhiệm vụ, kiến thức).
