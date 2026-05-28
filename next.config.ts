// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  // Ngăn chặn clickjacking — chỉ cho phép trang embed chính nó
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Ngăn trình duyệt đoán sai MIME type → tránh MIME-sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Bật XSS filter của trình duyệt cũ (legacy — vẫn hữu ích với IE/Edge cũ)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Kiểm soát thông tin referrer gửi khi navigate sang trang khác
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Ngăn chia sẻ dữ liệu cross-origin không mong muốn (Spectre mitigation)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Chỉ cho phép fetch resource từ cùng origin hoặc explicit CORS
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  // Buộc trình duyệt dùng HTTPS trong 1 năm (bao gồm subdomain)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy — cho phép script/style từ các nguồn cần thiết
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Script: cho phép inline và eval (Next.js cần), CDN fonts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com",
      // Style: cho phép inline (Tailwind cần) và Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      // Font: Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Ảnh: cho phép từ các CDN bạn đang dùng
      "img-src 'self' data: blob: https://res.cloudinary.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://assets.leetcode.com https://fpt.edu.vn https://images.unsplash.com",
      // API & WebSocket (cho phép cả localhost khi phát triển)
      `connect-src 'self' https://api.lawoh.click wss://api.lawoh.click http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:*`,
      // Không cho phép nhúng plugin (Flash, PDF embed...)
      "object-src 'none'",
      // Base URI chỉ được là chính nó
      "base-uri 'self'",
      // Form chỉ submit lên chính nó hoặc API
      "form-action 'self' https://api.lawoh.click http://localhost:* http://127.0.0.1:*",
    ].join("; "),
  },
  // Giới hạn quyền truy cập API browser nguy hiểm
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  devIndicators: {
    // @ts-ignore
    appIsrStatus: false,
  },
  experimental: {
    useLightningcss: true, // Lightning CSS cho Tailwind v4 + Next.js 15+
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.leetcode.com" },
      { protocol: "https", hostname: "fpt.edu.vn" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        // Áp dụng security headers cho tất cả routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
