# HAITECH CRM — Bảo Mật, Quyền Riêng Tư & An Toàn AI (Security & AI Safety)

## 1. Ma trận phân quyền vai trò (RBAC)

HAITECH CRM áp dụng kiểm tra quyền đa tầng (cả Server-side API và Client UI):

| Vai trò (Role) | Xem Hộp thư | Trả lời tin nhắn | Sửa hồ sơ Khách | Kéo Deal Pipeline | Quản trị Subagent | Cấu hình API Keys | Xem Audit Logs |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Agent** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 2. Quản lý khóa bảo mật & Secrets

- **Không lưu Secret trên Frontend:** Toàn bộ API Token (Meta, Telegram, Zalo, OpenAI, Claude) được quản lý qua biến môi trường máy chủ và lưu trữ mã hóa trong cơ sở dữ liệu.
- **Minh bạch trạng thái Sandbox/Demo:**
  - Nếu thiếu API Key, hệ thống **không bao giờ giả vờ đã gửi tin nhắn thành công qua mạng ngoài**.
  - Hiển thị nhãn `DEMO / MOCK` rõ ràng trên từng kênh và tin nhắn.
  - Hiển thị banner cảnh báo: *"AI chưa trả lời được vì chưa có Claude API key. Nhập ở Cài đặt."*

---

## 3. Rào chắn an toàn AI (Guardrails & Prompt-Injection Defense)

1. **Human-in-the-Loop:** Chế độ mặc định của AI là tạo bản thảo gợi ý (`AI gợi ý`), chuyên viên xem xét và bấm `Duyệt & Gửi` trước khi tin nhắn thực sự gửi đến khách hàng.
2. **Confidence Threshold Guardrail:** Có thể cấu hình ngưỡng tin cậy từ 50% đến 99%. Nếu mô hình không chắc chắn (< ngưỡng đã đặt), hệ thống tự động gắn cờ chuyển giao cho người thật xử lý.
3. **Phòng chống bịa giá:** Subagent chỉ được phép trích dẫn thông tin đã xuất bản trong Kho Tri thức (`KnowledgeBase`). Nếu tài liệu không đề cập, AI trả lời lịch sự là chưa có thông tin và kết nối chuyên viên.
4. **Prompt Injection Defense:** Toàn bộ tin nhắn đến từ khách hàng và tài liệu bên ngoài đều được coi là dữ liệu không tin cậy (*Untrusted Data*). Kịch bản chỉ đạo (System Prompt) có chỉ thị nghiêm ngặt không thực thi lệnh hệ thống từ nội dung trò chuyện.

---

## 4. Nhật ký kiểm toán (Audit Logging)

Mọi thao tác quan trọng:
- Đăng nhập, thay đổi quyền thành viên
- Gửi tin nhắn đa kênh
- AI phê duyệt câu trả lời
- Cập nhật giai đoạn Deal trong Pipeline
- Thay đổi cấu hình kết nối kênh
Đều được ghi lại trong bảng `AuditLog` với dấu thời gian, diễn giải, mã định danh người dùng và địa chỉ IP.
