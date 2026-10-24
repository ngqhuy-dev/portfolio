import type { Localized } from '@/i18n';

export interface ExperienceHighlight {
  /** Bold lead-in, e.g. the product name. */
  lead?: string;
  text: Localized;
}

export interface Experience {
  period: Localized;
  organization: Localized;
  role: Localized;
  summary?: Localized;
  highlights: ExperienceHighlight[];
}

export const experiences: Experience[] = [
  {
    period: { en: '03/2026 – present', vi: '03/2026 – hiện tại' },
    organization: { en: 'AntBuddy JSC', vi: 'AntBuddy JSC' },
    role: { en: 'Frontend Developer', vi: 'Frontend Developer' },
    summary: {
      en: 'Working on a production CRM omni-channel mobile app (iOS + Android) used by customer support teams across Vietnam.',
      vi: 'Phát triển ứng dụng CRM omni-channel mobile production (iOS + Android) được các đội chăm sóc khách hàng trên khắp Việt Nam sử dụng.',
    },
    highlights: [
      {
        lead: 'CRM Mobile App',
        text: {
          en: '— call system (VoIP/PJSIP, CRM call history, customer name display); resolved push notification token lifecycle across login, logout, and account switching; TikTok channel integration (messaging, filters, lead Q&A rendering); omni-channel inbox action menu (channel-aware reply/forward, copy text); Tickets screen navigation.',
          vi: '— hệ thống cuộc gọi (VoIP/PJSIP, lịch sử cuộc gọi CRM, hiển thị tên khách hàng); xử lý vòng đời token push notification khi đăng nhập, đăng xuất và chuyển tài khoản; tích hợp kênh TikTok (nhắn tin, bộ lọc, hiển thị Q&A của lead); menu thao tác hộp thư omni-channel (trả lời/chuyển tiếp theo kênh, sao chép văn bản); điều hướng màn hình Tickets.',
        },
      },
      {
        lead: 'Automation Test Framework',
        text: {
          en: '(Playwright + Appium + WebDriverIO) — built UAT specs for Zalo OA FlowBot on real iOS/Android devices; dual-layer verification (UI + backend API); OCR via Tesseract.js for screenshot text extraction; custom utility modules for keyword matching, Vietnamese text normalization, and platform-specific UI handling; report pipeline (HTML, Excel, dashboard, ZIP).',
          vi: '(Playwright + Appium + WebDriverIO) — viết UAT spec cho Zalo OA FlowBot trên thiết bị iOS/Android thật; xác minh hai lớp (UI + API backend); OCR bằng Tesseract.js để trích văn bản từ ảnh chụp màn hình; module tiện ích cho so khớp từ khoá, chuẩn hoá tiếng Việt và xử lý UI theo nền tảng; pipeline báo cáo (HTML, Excel, dashboard, ZIP).',
        },
      },
    ],
  },
  {
    period: { en: '03/2025 – 12/2025', vi: '03/2025 – 12/2025' },
    organization: { en: 'Platinum Technology', vi: 'Platinum Technology' },
    role: { en: 'Frontend Developer Intern', vi: 'Thực tập sinh Frontend' },
    summary: {
      en: 'Shipped React and React Native features across four client products. Closed 80+ QC issues; reported crash rate dropped by 40% on the main social product.',
      vi: 'Phát triển tính năng React và React Native cho bốn sản phẩm khách hàng. Xử lý hơn 80 issue QC; tỉ lệ crash của sản phẩm mạng xã hội chính giảm 40%.',
    },
    highlights: [
      {
        lead: 'Linora',
        text: {
          en: '(social) — resolved UI state and crash issues; implemented media upload, realtime like/comment, social connection, and Zalo OTP authentication.',
          vi: '(mạng xã hội) — xử lý lỗi UI state và crash; phát triển upload media, like/comment realtime, kết nối xã hội và xác thực Zalo OTP.',
        },
      },
      {
        lead: 'Gas Thánh Giong',
        text: {
          en: '(operations) — built mobile technician workflows and OTP identity verification; deployed realtime KTV location tracking and Firebase Cloud Messaging for order-status push notifications.',
          vi: '(vận hành) — xây dựng luồng nghiệp vụ mobile cho kỹ thuật viên và xác minh danh tính bằng OTP; triển khai theo dõi vị trí KTV realtime và Firebase Cloud Messaging cho thông báo trạng thái đơn hàng.',
        },
      },
      {
        lead: 'Event Flow',
        text: {
          en: '(events) — fullstack feature work with React.js + Node.js; built QR check-in flow, submission management, and automatic digital invitation generation.',
          vi: '(sự kiện) — phát triển tính năng fullstack với React.js + Node.js; xây dựng luồng check-in QR, quản lý bài nộp và tự động tạo thiệp mời điện tử.',
        },
      },
      {
        lead: 'Kyn Group',
        text: {
          en: '(internal tools) — integrated Rocket.Chat API for in-app chat; managed conversation state with Redux Toolkit for large-volume message handling.',
          vi: '(công cụ nội bộ) — tích hợp Rocket.Chat API cho chat trong app; quản lý state hội thoại bằng Redux Toolkit để xử lý lượng tin nhắn lớn.',
        },
      },
    ],
  },
  {
    period: { en: '02/2025 – present', vi: '02/2025 – hiện tại' },
    organization: { en: 'Personal project', vi: 'Dự án cá nhân' },
    role: {
      en: 'JinStore — Cross-platform Sales System',
      vi: 'JinStore — Hệ thống bán hàng đa nền tảng',
    },
    highlights: [
      {
        text: {
          en: 'Built web and mobile commerce flows end-to-end with React, React Native, Node.js, Express, and MongoDB.',
          vi: 'Xây dựng trọn vẹn luồng thương mại web và mobile với React, React Native, Node.js, Express và MongoDB.',
        },
      },
      {
        text: {
          en: 'Integrated Google login, OTP verification, VNPay payment gateway, Cloudinary image storage, and WebSocket for realtime updates.',
          vi: 'Tích hợp đăng nhập Google, xác minh OTP, cổng thanh toán VNPay, lưu trữ ảnh Cloudinary và WebSocket cho cập nhật realtime.',
        },
      },
      {
        text: {
          en: 'State managed with Redux Toolkit (mobile) and Zustand (web).',
          vi: 'Quản lý state bằng Redux Toolkit (mobile) và Zustand (web).',
        },
      },
    ],
  },
];
