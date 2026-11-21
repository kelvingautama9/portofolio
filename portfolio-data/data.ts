/**
 * ============================================================================
 * DATA PORTOFOLIO & CV — KELVIN
 * ============================================================================
 * File ini sengaja ditaruh di folder `/portfolio-data/data.ts` (di root project)
 * agar paling mudah dicari dan di-update langsung melalui GitHub web editor.
 * Setiap perubahan yang di-commit ke GitHub akan otomatis ter-deploy di Vercel.
 * ============================================================================
 */

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  url: string;
  displayUrl: string;
  category: string;
  impactMetric: string;
  description: string;
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  points: string[];
}

export interface EducationItem {
  major: string;
  institution: string;
  period: string;
  finalProjects: string[];
}

export interface ProfileData {
  name: string;
  roleTitle: string;
  location: string;
  phone: string;
  phoneLink: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
  cvPdfPath: string;
  summary: string;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  additionalInfo: {
    technicalSkills: string[];
    interpersonalSkills: string[];
    languages: string;
    certifications: string[];
    sideActivities: string[];
  };
}

export const PORTFOLIO_DATA: ProfileData = {
  name: "KELVIN",
  roleTitle: "Marketing Operations & Workflow Automation",
  location: "Cikarang",
  phone: "0812-2931-8126",
  phoneLink: "https://wa.me/6281229318126",
  email: "kelvingautama99@gmail.com",
  linkedin: "linkedin.com/in/kelvin-vinns",
  linkedinUrl: "https://www.linkedin.com/in/kelvin-vinns",
  github: "github.com/kelvingautama9",
  githubUrl: "https://github.com/kelvingautama9",
  cvPdfPath: "/assets/aistudio/CV-Kelvin_58d193b4.pdf",

  summary:
    "Pengalaman 4 tahun sebagai Staff Marketing di industri manufaktur dengan fokus pada operasional penjualan B2B, efisiensi proses, dan kepuasan pelanggan. Terbukti berinisiatif memodernisasi sistem kerja melalui pengembangan web/AI automation tools yang meningkatkan efisiensi dan kecepatan respon operasional hingga 90%.",

  projects: [
    {
      id: "automation-pricing-tools",
      index: "01",
      title: "Automation Pricing Tools",
      url: "https://pricing-tools.vercel.app/",
      displayUrl: "pricing-tools.vercel.app",
      category: "Web Calculator · AI Chatbot Integration",
      impactMetric: "90% Faster Mobile Response",
      description:
        "Mengembangkan kalkulator harga, MOQ, dan berat order berbasis web dan terintegrasi langsung dengan AI Chatbot yang meningkatkan kecepatan respon ke pelanggan hingga 90% secara mobile.",
      highlights: [
        "Kalkulasi Harga, MOQ & Berat Order",
        "Integrasi AI Chatbot Mobile",
        "Efisiensi Respon Pelanggan 90%"
      ]
    },
    {
      id: "excel-erp-data-converter",
      index: "02",
      title: "Excel ERP Data Converter",
      url: "https://symix-converter.vercel.app/",
      displayUrl: "symix-converter.vercel.app",
      category: "ERP Automation · FIFO Data Pipeline",
      impactMetric: "90% Efficiency vs Manual Recap",
      description:
        "Membangun converter otomatis data mentah ERP menjadi data jadi yang sudah tersusun rapi kedalam bentuk file excel atau format laporan text yang siap dikirim ke whatsapp (berupa rekap data : PO, stok, delivery, intake, order vs pengiriman, sisa os) sesuai prinsip FIFO dengan tingkat efisiensi 90% dibanding rekap manual.",
      highlights: [
        "Output Excel & Format Laporan WhatsApp",
        "Rekap PO, Stok, Delivery, Intake & Sisa OS",
        "Alokasi Otomatis Prinsip FIFO"
      ]
    },
    {
      id: "secure-pdf-converter",
      index: "03",
      title: "PDF Converter",
      url: "https://kelvingautama9.github.io/secure-pdf-converter/#/image-to-pdf",
      displayUrl: "kelvingautama9.github.io/secure-pdf-converter",
      category: "Client-Side Document Processing · Zero-Database",
      impactMetric: "100% Local Browser Privacy",
      description:
        "Tools pengolahan PDF (convert, kompres, pisah/gabung) yang berjalan full client-side tanpa database demi menjaga keamanan dan privasi dokumen sensitif.",
      highlights: [
        "Convert, Kompres, Pisah & Gabung PDF",
        "100% Client-Side Execution",
        "Tanpa Database untuk Privasi Dokumen"
      ]
    }
  ],

  experiences: [
    {
      id: "prokemas",
      role: "Marketing Staff",
      company: "PT Prokemas Adhikari Kreasi",
      period: "Juni 2022 - Sekarang",
      points: [
        "Mengelola dan memproses Purchase Order, Planning Produksi, Mengatur Pengiriman, dan menjaga akurasi data OS.",
        "Berkoordinasi dengan tim PPIC, Produksi, Gudang, dan Logistik untuk memastikan proses fulfillment berjalan lancar dan mencapai target On-Time Delivery (OTD).",
        "Menjaga serta memperkuat hubungan baik dan meminimalisir komplain dari customers.",
        "Mengatasi kendala operasional dan administrasi pesanan guna meminimalisasi risiko keterlambatan pengiriman."
      ]
    },
    {
      id: "kao",
      role: "Operator Produksi Converting Machine",
      company: "PT KAO Indonesia",
      period: "Maret 2021 - Februari 2022",
      points: [
        "Set Up mesin, dan mengontrol selama proses berjalannya produksi.",
        "Maintenance mesin dan peralatan keperluan produksi.",
        "Menyuplai dan set up bahan baku ke mesin sesuai kebutuhan produksi.",
        "Troubleshooting kerusakan ringan terhadap mesin.",
        "Melakukan pengecekan barang hasil produksi secara berkala untuk menjamin kualitas barang."
      ]
    },
    {
      id: "rpt",
      role: "Operator Produksi Injection Molding",
      company: "PT Resin Plating Technology",
      period: "Agustus 2019 - Agustus 2020",
      points: [
        "Set Up dan cleaning mesin beserta mold (Dandori), mengontrol selama proses berjalannya produksi.",
        "Maintenance mesin dan peralatan keperluan produksi.",
        "Mensupply dan set up bahan baku ke mesin sesuai kebutuhan produksi.",
        "Troubleshooting kerusakan ringan terhadap mesin, melakukan aktivitas kaizen dan 5R.",
        "Memproduksi item sesuai kanban/permintaan produksi, dan melakukan pengecekan kualitas item."
      ]
    }
  ],

  education: [
    {
      major: "Teknik Komputer Jaringan",
      institution: "SMK Negeri 2 Cikarang Barat",
      period: "2016 - 2019",
      finalProjects: [
        "Implementasi Infrastruktur Networking Mikrotik",
        "Instalasi private server berbasis sistem operasi Linux"
      ]
    }
  ],

  additionalInfo: {
    technicalSkills: [
      "ERP",
      "Ms.Excel (Beginner)",
      "CRM",
      "Network Configuration",
      "AI Prompt Engineering & Automation Tools"
    ],
    interpersonalSkills: [
      "Komunikasi",
      "Negosiasi",
      "Manajemen Waktu",
      "Problem Solving",
      "Adaptasi"
    ],
    languages: "Indonesia, English (Reading = Aktif, Speaking = Pasif, Listening = Aktif)",
    certifications: ["Technical Analysis Master Class (Udemy)"],
    sideActivities: [
      "Pengelola Komunitas / Analyst Pasar Crypto dan Saham (pencapaian 2.500+ Followers) di platform asing (Binance)",
      "Penyedia Layanan Servis Hardware/Software & Penjual Aksesori IT (HP, PC, Laptop)"
    ]
  }
};
