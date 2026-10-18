# 🌐 THÔNG TIN TRIỂN KHAI & LIÊN KẾT HỆ THỐNG HAITECH CRM

Tài liệu này lưu lại toàn bộ liên kết, thông số triển khai và tài khoản quản trị của hệ thống **HAITECH CRM - AI All-in-One Omnichannel CRM Platform**.

---

## 📌 1. Các Đường Dẫn Chính

| Hạng mục | Đường dẫn liên kết | Mô tả |
| :--- | :--- | :--- |
| **Vercel Production (Tên miền chính)** | [https://haitech-crm.vercel.app](https://haitech-crm.vercel.app) | Trang web CRM chính thức, hoạt động trực tiếp 24/7 trên Vercel CDN toàn cầu |
| **GitHub Repository** | [https://github.com/vanhaitech86-lab/haitech-crm](https://github.com/vanhaitech86-lab/haitech-crm) | Toàn bộ mã nguồn dự án, quản lý phiên bản trên GitHub |
| **Vercel Deployment URL** | [https://haitech-o1b33eb8a-vps-group-team.vercel.app](https://haitech-o1b33eb8a-vps-group-team.vercel.app) | Link build snapshot phiên bản hiện tại |
| **Vercel Project Dashboard** | [https://vercel.com/vps-group-team/haitech-crm](https://vercel.com/vps-group-team/haitech-crm) | Trang quản trị dự án, xem log, biến môi trường và thiết lập tên miền riêng |

---

## ⚙️ 2. Thông Số Cấu Hình

- **GitHub Account:** `vanhaitech86-lab`
- **Repository Name:** `haitech-crm`
- **Branch chính:** `master`
- **Vercel Team:** `vps-group-team` (Account: `vanthedam318-9473`)
- **Framework:** Next.js 14.2 (App Router) + React 18 + Tailwind CSS + TypeScript
- **Kênh triển khai:** Vercel Edge Serverless & Production CI/CD

---

## 🚀 3. Hướng Dẫn Cập Nhật Sau Này

Khi có thay đổi mã nguồn ở máy local, bạn chỉ cần chạy các lệnh sau:

```bash
# 1. Đẩy code lên GitHub
git add .
git commit -m "Cập nhật tính năng mới"
git push origin master

# 2. Cập nhật bản chạy trên Vercel
npx vercel deploy --prod --yes
```

---
*Ngày lưu trữ: 18/10/2026 - HAITECH AI Team*
