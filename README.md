# HAITECH CRM — AI ALL-IN-ONE OMNICHANNEL CRM PLATFORM

<div align="center">
  <h2>Hệ Thống Quản Lý Đa Kênh & Trợ Lý Trí Tuệ Nhân Tạo Hợp Nhất</h2>
  <p><strong>Thương hiệu: HAITECH AI</strong> · Bộ màu nhận diện: <strong>Ocean Blue</strong></p>
  <p>Tích hợp sẵn 4 kênh kết nối: <strong>Zalo (098739896)</strong>, <strong>Facebook (Haitech.AISystem)</strong>, <strong>Website (haitech-ai.vercel.app)</strong>, <strong>TikTok (@vanhaitech.ai)</strong>.</p>
</div>

---

## 🌟 Điểm Nổi Bật Của HAITECH CRM

1. **Bố cục 3 cột chuẩn Omnichannel (Tối ưu màn hình 1440px / 1280px / Tablet):**
   - **Thanh bên trái (~104px):** Biểu tượng chữ **H** HAITECH, Tổng quan, Hộp thư, Tương tác, Khách (CRM), Pipeline, Subagent, Kiến thức, Nhắc việc, Kênh, Quản trị Admin.
   - **Cột danh sách hội thoại (~440px):** Tìm kiếm toàn văn ("Tìm tên, SĐT, nội dung..."), lọc theo nguồn kênh và tài khoản kết nối, 4 tab trạng thái (*Tất cả, Chưa đọc, Cần bạn, AI đang trực*).
   - **Khung hội thoại trung tâm:** Tiêu đề khách/nhóm, công tắc `AI tự trả lời`, `Tự điều phối`, màu sắc tin nhắn phân biệt nhân viên, khách hàng, ghi chú nội bộ và AI Subagent.
   - **Panel hồ sơ khách hàng bên phải (~340px):** Hồ sơ contact 360°, giai đoạn pipeline, thẻ, **AI Memory ghi nhớ về khách**, và danh sách **Nhắc việc** theo thời gian thực.

2. **4 Kênh Kết Nối Hoạt Động:**
   - **Zalo:** Số điện thoại `098739896` (Zalo Cá Nhân & OA, link https://zalo.me/098739896).
   - **Facebook Fanpage:** `Haitech.AISystem` (fb.com/Haitech.AISystem).
   - **Website Live Widget:** Trang sản phẩm `haitech-ai.vercel.app/san-pham.html` (có mã nhúng JavaScript tiện lợi).
   - **TikTok:** Kênh `@vanhaitech.ai` (tiktok.com/@vanhaitech.ai).

3. **Trang Quản Trị Hệ Thống Admin (HAITECH Control Center):**
   - 6 tab quản trị toàn diện: Cấu hình kết nối đa kênh, Khóa API AI & Mô hình (Claude 3.7 + GPT-4o + Gemini 2.0 Flash), Thành viên & Phân quyền, Quy tắc phân bổ & SLA, Giám sát Webhook & Kiểm toán, Quản lý toàn bộ Data & Google Drive.

4. **Cổng Đăng Nhập, Đăng Ký & Cho Thuê CRM Thương Mại (SaaS Multi-Tenant):**
   - Nút **"Đăng Nhập"**, **"Đăng Ký"** và **"Thuê CRM"** trên Header.
   - 3 gói cước cho thuê: **Gói Dùng Thử 14 ngày (0đ)**, **Gói Chuyên Nghiệp PRO (990.000đ/tháng)**, **Gói Doanh Nghiệp (2.490.000đ/tháng)**.
   - Hệ thống tự động phân tách dữ liệu cho từng khách hàng thuê CRM.

5. **Quản Lý Toàn Bộ Dữ Liệu Khách Hàng Đưa Về Google Drive & Google Sheets:**
   - Khách hàng thuê CRM có toàn quyền sở hữu data (**Chủ quyền dữ liệu 100%**).
   - Cấu hình ID thư mục Google Drive riêng (`HAITECH_CRM_DATABASE_BACKUPS`).
   - Đường dẫn mở trực tiếp Google Sheets Online.
   - Nút đồng bộ tức thì với thanh tiến trình real-time (0% → 100%).
   - Tải file CSV hỗ trợ định dạng tiếng Việt chuẩn **UTF-8 BOM (`\uFEFF`)**, mở bằng Excel không bao giờ bị lỗi font.
   - Bảng nhật ký sao lưu (Backup Logs) theo dõi lịch sử và link xem file trên Drive.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Tone màu:** Ocean Blue (`#0A2239`, `#0284C7`, `#0369A1`, `#0EA5E9`, `#38BDF8`, `#F0F6FA`).
- **Data & State:** Reactive Store với cơ chế Event-driven Subscription và LocalStorage Persistence.
- **Omnichannel Adapters:** Meta Graph API, Zalo Open API, TikTok Partner API, Website Widget Embed.
- **LLM Adapters:** Claude 3.7 Sonnet, OpenAI GPT-4o, Google Gemini 2.0 Flash.
- **Cloud & Storage:** Google Drive API v4, Google Sheets v4, UTF-8 BOM CSV Engine.

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Chạy kiểm thử tự động (8 kịch bản)
```bash
npm test
# hoặc
npx tsx scripts/run-tests.mjs
```

### 3. Khởi chạy máy chủ phát triển
```bash
npm run dev
```

### 4. Build và chạy máy chủ sản xuất (Production)
```bash
npm run build
npm start
```
Ứng dụng đang phục vụ tại: **http://localhost:3005** (hoặc port được chỉ định).

---

## 📄 Tài Liệu Bổ Sung

- [HAITECH_CRM_FULL_HANDOVER.md](./HAITECH_CRM_FULL_HANDOVER.md): Toàn bộ tài liệu bàn giao dự án.
- [docs/architecture.md](./docs/architecture.md): Thiết kế kiến trúc 3 vùng và Reactive Store.
- [docs/api.md](./docs/api.md): Đặc tả hợp đồng API Inbound/Outbound.
- [docs/security.md](./docs/security.md): Rào chắn an toàn AI và phân quyền RBAC.
- [docs/integrations.md](./docs/integrations.md): Hướng dẫn kết nối các kênh mạng xã hội.
