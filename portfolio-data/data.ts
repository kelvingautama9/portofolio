/**
 * ============================================================================
 * DATA PORTOFOLIO & CV — KELVIN (MULTILINGUAL: ID / EN / JPN / ZH)
 * ============================================================================
 * File ini sengaja ditaruh di folder `/portfolio-data/data.ts` (di root project)
 * agar paling mudah dicari dan di-update langsung melalui GitHub web editor.
 * Setiap perubahan yang di-commit ke GitHub akan otomatis ter-deploy di Vercel.
 * ============================================================================
 */

export type LanguageCode = 'id' | 'en' | 'jp' | 'zh';

export type LocalizedText = Record<LanguageCode, string>;
export type LocalizedList = Record<LanguageCode, string[]>;

export interface ProjectItem {
  id: string;
  index: string;
  /** Nama proyek / tool tetap dipertahankan atau disesuaikan konteks */
  title: string;
  url: string;
  displayUrl: string;
  category: LocalizedText;
  impactMetric: LocalizedText;
  description: LocalizedText;
  highlights: LocalizedList;
}

export interface ExperienceItem {
  id: string;
  role: LocalizedText;
  /** Nama perusahaan adalah data penting yang tidak diterjemahkan */
  company: string;
  period: LocalizedText;
  points: LocalizedList;
}

export interface EducationItem {
  major: LocalizedText;
  /** Nama institusi adalah data penting yang tidak diterjemahkan */
  institution: string;
  period: string;
  finalProjects: LocalizedList;
}

export interface UILabels {
  nav: {
    portfolio: string;
    experience: string;
    qualifications: string;
    contact: string;
  };
  downloadCv: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  langLabel: string;
  emailCopied: string;
  urlCopied: string;
  copyUrl: string;
  openApp: string;
  openAppNow: string;
  detail: string;
  contactLabels: {
    location: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
  };
  section01: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterAutomation: string;
    filterDocument: string;
  };
  section02: {
    title: string;
    subtitle: string;
  };
  section03: {
    title: string;
    finalProjectLabel: string;
  };
  section04: {
    title: string;
    technicalSkills: string;
    interpersonalSkills: string;
    languages: string;
    certifications: string;
    sideActivities: string;
  };
  section05: {
    title: string;
    subtitle: string;
    sendEmail: string;
    whatsapp: string;
  };
  modal: {
    projectPrefix: string;
    implementationDesc: string;
    scopeAndSpecs: string;
    redirectUrlLabel: string;
    closeAria: string;
  };
}

export interface ProfileData {
  /** Data identitas penting yang tidak berubah */
  name: string;
  location: string;
  phone: string;
  phoneLink: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
  cvPdfPath: string;

  /** Konten teks yang berubah dinamis mengikuti bahasa (ID/EN/JPN/ZH) */
  roleTitle: LocalizedText;
  summary: LocalizedText;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  additionalInfo: {
    technicalSkills: LocalizedList;
    interpersonalSkills: LocalizedList;
    languages: LocalizedText;
    certifications: string[];
    sideActivities: LocalizedList;
  };
  ui: Record<LanguageCode, UILabels>;
}

export const LANGUAGE_OPTIONS: { code: LanguageCode; shortLabel: string; fullName: string }[] = [
  { code: 'id', shortLabel: 'ID', fullName: 'Bahasa Indonesia' },
  { code: 'en', shortLabel: 'EN', fullName: 'English' },
  { code: 'jp', shortLabel: 'JPN', fullName: '日本語' },
  { code: 'zh', shortLabel: 'CHN', fullName: '中文' }
];

export const PORTFOLIO_DATA: ProfileData = {
  name: "KELVIN",
  location: "Cikarang",
  phone: "0812-2931-8126",
  phoneLink: "https://wa.me/6281229318126",
  email: "kelvingautama99@gmail.com",
  linkedin: "linkedin.com/in/kelvin-vinns",
  linkedinUrl: "https://www.linkedin.com/in/kelvin-vinns",
  github: "github.com/kelvingautama9",
  githubUrl: "https://github.com/kelvingautama9",
  cvPdfPath: "/assets/aistudio/CV-Kelvin_58d193b4.pdf",

  roleTitle: {
    id: "Operasional Marketing & Otomasi Alur Kerja",
    en: "Marketing Operations & Workflow Automation",
    jp: "マーケティングオペレーション＆業務自動化",
    zh: "营销运营与工作流自动化"
  },

  summary: {
    id: "Pengalaman 4 tahun sebagai Staff Marketing di industri manufaktur dengan fokus pada operasional penjualan B2B, efisiensi proses, dan kepuasan pelanggan. Terbukti berinisiatif memodernisasi sistem kerja melalui pengembangan web/AI automation tools yang meningkatkan efisiensi dan kecepatan respon operasional hingga 90%.",
    en: "4 years of experience as a Marketing Staff in the manufacturing industry focusing on B2B sales operations, process efficiency, and customer satisfaction. Proven initiative in modernizing workflows by developing web and AI automation tools that increase operational efficiency and response speed by up to 90%.",
    jp: "製造業のマーケティングスタッフとして4年間の経験を持ち、B2B営業オペレーション、プロセス効率化、顧客満足度向上に従事。WebおよびAI自動化ツールの独自開発により業務システムを近代化し、オペレーション効率と顧客対応速度を最大90%向上させた実績を持つ。",
    zh: "拥有4年制造业营销专员经验，专注于B2B销售运营、流程效率与客户满意度。主动通过开发Web与AI自动化工具推进工作系统现代化，使运营效率与客户响应速度提升高达90%。"
  },

  projects: [
    {
      id: "automation-pricing-tools",
      index: "01",
      title: "Automation Pricing Tools",
      url: "https://pricing-tools.vercel.app/",
      displayUrl: "pricing-tools.vercel.app",
      category: {
        id: "Kalkulator Web · Integrasi AI Chatbot",
        en: "Web Calculator · AI Chatbot Integration",
        jp: "Web価格計算ツール · AIチャットボット連携",
        zh: "Web计算器 · AI聊天机器人集成"
      },
      impactMetric: {
        id: "90% Respon Mobile Lebih Cepat",
        en: "90% Faster Mobile Response",
        jp: "モバイル対応速度 90%向上",
        zh: "移动端响应速度提升 90%"
      },
      description: {
        id: "Mengembangkan kalkulator harga, MOQ, dan berat order berbasis web dan terintegrasi langsung dengan AI Chatbot yang meningkatkan kecepatan respon ke pelanggan hingga 90% secara mobile.",
        en: "Developed a web-based price, MOQ, and order weight calculator directly integrated with an AI Chatbot, increasing mobile customer response speed by up to 90%.",
        jp: "価格、最小発注数量（MOQ）、注文重量を計算するWebツールを開発し、AIチャットボットと直接連携させることで、モバイルでの顧客対応速度を最大90%向上。",
        zh: "开发了基于Web的价格、最小起订量（MOQ）与订单重量计算器，并直接集成AI聊天机器人，将移动端客户响应速度提升高达90%。"
      },
      highlights: {
        id: [
          "Kalkulasi Harga, MOQ & Berat Order",
          "Integrasi AI Chatbot Mobile",
          "Efisiensi Respon Pelanggan 90%"
        ],
        en: [
          "Price, MOQ & Order Weight Calculation",
          "Mobile AI Chatbot Integration",
          "90% Customer Response Efficiency"
        ],
        jp: [
          "価格・MOQ・注文重量の自動算出",
          "モバイルAIチャットボット統合",
          "顧客対応効率 90%向上"
        ],
        zh: [
          "价格、MOQ与订单重量计算",
          "移动端AI聊天机器人集成",
          "客户响应效率提升90%"
        ]
      }
    },
    {
      id: "excel-erp-data-converter",
      index: "02",
      title: "Excel ERP Data Converter",
      url: "https://symix-converter.vercel.app/",
      displayUrl: "symix-converter.vercel.app",
      category: {
        id: "Otomasi ERP · Pipeline Data FIFO",
        en: "ERP Automation · FIFO Data Pipeline",
        jp: "ERPデータ自動化 · FIFOデータ処理",
        zh: "ERP自动化 · FIFO数据管道"
      },
      impactMetric: {
        id: "Efisiensi 90% vs Rekap Manual",
        en: "90% Efficiency vs Manual Recap",
        jp: "手動集計比 90%の効率化",
        zh: "相比人工汇总效率提升 90%"
      },
      description: {
        id: "Membangun converter otomatis data mentah ERP menjadi data jadi yang sudah tersusun rapi kedalam bentuk file excel atau format laporan text yang siap dikirim ke whatsapp (berupa rekap data : PO, stok, delivery, intake, order vs pengiriman, sisa os) sesuai prinsip FIFO dengan tingkat efisiensi 90% dibanding rekap manual.",
        en: "Built an automated converter transforming raw ERP data into structured Excel files or formatted text reports ready for WhatsApp distribution (covering PO, stock, delivery, intake, order vs shipment, and remaining OS) following FIFO principles with 90% higher efficiency than manual recaps.",
        jp: "ERPの生データを整理されたExcelファイルやWhatsApp送信用のテキストレポート（発注書PO、在庫、納品、入庫、注文対出荷、未納残OSの集計）へ自動変換するシステムを構築。先入れ先出し（FIFO）原則に基づき、手作業と比較して90%の効率化を達成。",
        zh: "构建自动化转换工具，将原始ERP数据按先进先出（FIFO）原则自动整理为结构化Excel文件或可直接发送至WhatsApp的文本报告（涵盖PO、库存、交付、入库、订单与发货对比、未结订单余额OS），相比人工汇总效率提升90%。"
      },
      highlights: {
        id: [
          "Output Excel & Format Laporan WhatsApp",
          "Rekap PO, Stok, Delivery, Intake & Sisa OS",
          "Alokasi Otomatis Prinsip FIFO"
        ],
        en: [
          "Excel Output & WhatsApp Report Formatting",
          "PO, Stock, Delivery, Intake & Remaining OS Recap",
          "Automated FIFO Allocation Logic"
        ],
        jp: [
          "Excel出力＆WhatsAppレポート自動整形",
          "PO・在庫・納品・入庫・未納残OSの一括集計",
          "FIFO（先入れ先出し）自動割当ロジック"
        ],
        zh: [
          "Excel输出与WhatsApp报告格式化",
          "PO、库存、交付、入库与未结OS汇总",
          "基于FIFO原则的自动分配逻辑"
        ]
      }
    },
    {
      id: "secure-pdf-converter",
      index: "03",
      title: "PDF Converter",
      url: "https://kelvingautama9.github.io/secure-pdf-converter/#/image-to-pdf",
      displayUrl: "kelvingautama9.github.io/secure-pdf-converter",
      category: {
        id: "Pemrosesan Dokumen Client-Side · Tanpa Database",
        en: "Client-Side Document Processing · Zero-Database",
        jp: "クライアント側PDF処理 · データベース不要",
        zh: "客户端文档处理 · 零数据库架构"
      },
      impactMetric: {
        id: "100% Privasi Browser Lokal",
        en: "100% Local Browser Privacy",
        jp: "100% ローカルブラウザ完結・機密保護",
        zh: "100% 本地浏览器隐私安全"
      },
      description: {
        id: "Tools pengolahan PDF (convert, kompres, pisah/gabung) yang berjalan full client-side tanpa database demi menjaga keamanan dan privasi dokumen sensitif.",
        en: "PDF processing suite (convert, compress, split/merge) running 100% client-side without any database to guarantee security and privacy for sensitive documents.",
        jp: "機密文書のセキュリティとプライバシーを保護するため、データベースを一切使用せず100%クライアントサイド（ブラウザ内）で動作するPDF処理ツール（変換・圧縮・分割・結合）。",
        zh: "完全在客户端本地运行的PDF处理工具（转换、压缩、拆分/合并），无需数据库存储，全方位保障敏感文档的安全性与隐私。"
      },
      highlights: {
        id: [
          "Convert, Kompres, Pisah & Gabung PDF",
          "100% Eksekusi Client-Side",
          "Tanpa Database untuk Privasi Dokumen"
        ],
        en: [
          "Convert, Compress, Split & Merge PDFs",
          "100% Client-Side Execution",
          "Database-Free for Document Privacy"
        ],
        jp: [
          "PDFの変換・圧縮・分割・結合",
          "100% クライアントサイド実行",
          "データベース不使用による機密文書保護"
        ],
        zh: [
          "PDF转换、压缩、拆分与合并",
          "100% 客户端本地执行",
          "无数据库架构保障文档隐私"
        ]
      }
    }
  ],

  experiences: [
    {
      id: "prokemas",
      role: {
        id: "Marketing Staff",
        en: "Marketing Staff",
        jp: "マーケティングスタッフ",
        zh: "营销专员 (Marketing Staff)"
      },
      company: "PT Prokemas Adhikari Kreasi",
      period: {
        id: "Juni 2022 - Sekarang",
        en: "June 2022 - Present",
        jp: "2022年6月 - 現在",
        zh: "2022年6月 - 至今"
      },
      points: {
        id: [
          "Mengelola dan memproses Purchase Order, Planning Produksi, Mengatur Pengiriman, dan menjaga akurasi data OS.",
          "Berkoordinasi dengan tim PPIC, Produksi, Gudang, dan Logistik untuk memastikan proses fulfillment berjalan lancar dan mencapai target On-Time Delivery (OTD).",
          "Menjaga serta memperkuat hubungan baik dan meminimalisir komplain dari customers.",
          "Mengatasi kendala operasional dan administrasi pesanan guna meminimalisasi risiko keterlambatan pengiriman."
        ],
        en: [
          "Manage and process Purchase Orders, Production Planning, Shipment Scheduling, and maintain Outstanding Order (OS) data accuracy.",
          "Coordinate with PPIC, Production, Warehouse, and Logistics teams to ensure smooth order fulfillment and achieve On-Time Delivery (OTD) targets.",
          "Maintain and strengthen client relationships while minimizing customer complaints.",
          "Resolve operational and order administration bottlenecks to minimize delivery delay risks."
        ],
        jp: [
          "発注書（PO）の処理、生産計画の調整、出荷手配、および未納残（OS）データの正確性を管理。",
          "PPIC（生産管理）、製造、倉庫、物流チームと連携し、円滑なフルフィルメントと納期遵守率（OTD）目標の達成を推進。",
          "顧客との良好なリレーションシップを維持・強化し、クレーム発生を最小限に抑える。",
          "受注管理およびオペレーション上の課題を解決し、納品遅延リスクを最小化。"
        ],
        zh: [
          "管理并处理采购订单（PO）、生产计划、发货安排，并确保未结订单（OS）数据的准确性。",
          "与PPIC、生产、仓库及物流团队紧密协调，确保订单履约顺畅并达成准时交货率（OTD）目标。",
          "维护并深化客户关系，最大限度减少客户投诉。",
          "解决运营与订单行政流程中的瓶颈，降低交货延迟风险。"
        ]
      }
    },
    {
      id: "kao",
      role: {
        id: "Operator Produksi Converting Machine",
        en: "Converting Machine Production Operator",
        jp: "コンバーティングマシン製造オペレーター",
        zh: "转换机生产操作员 (Converting Machine Operator)"
      },
      company: "PT KAO Indonesia",
      period: {
        id: "Maret 2021 - Februari 2022",
        en: "March 2021 - February 2022",
        jp: "2021年3月 - 2022年2月",
        zh: "2021年3月 - 2022年2月"
      },
      points: {
        id: [
          "Set Up mesin, dan mengontrol selama proses berjalannya produksi.",
          "Maintenance mesin dan peralatan keperluan produksi.",
          "Menyuplai dan set up bahan baku ke mesin sesuai kebutuhan produksi.",
          "Troubleshooting kerusakan ringan terhadap mesin.",
          "Melakukan pengecekan barang hasil produksi secara berkala untuk menjamin kualitas barang."
        ],
        en: [
          "Set up converting machinery and monitored operations throughout the production run.",
          "Performed routine maintenance on production machines and auxiliary equipment.",
          "Supplied and configured raw materials into machinery according to production schedules.",
          "Executed troubleshooting and minor repairs on machine malfunctions.",
          "Conducted periodic quality inspections on finished goods to ensure product standards."
        ],
        jp: [
          "製造マシンのセットアップおよび稼働中の生産プロセス監視を実施。",
          "生産機械および関連設備の定期メンテナンスを担当。",
          "生産計画に応じた原材料の供給およびマシンへのセッティング。",
          "機械の軽微な不具合に対するトラブルシューティングと復旧対応。",
          "製品品質を保証するため、生産品の定期的な品質検査を実施。"
        ],
        zh: [
          "负责机器设置（Set Up），并在生产运行过程中进行全程监控。",
          "对生产机器及配套设备进行日常维护保养。",
          "根据生产需求向机器供应并配置原材料。",
          "处理机器运行中的轻度故障与快速排查。",
          "定期对产成品进行质量抽检，确保符合产品品质标准。"
        ]
      }
    },
    {
      id: "rpt",
      role: {
        id: "Operator Produksi Injection Molding",
        en: "Injection Molding Production Operator",
        jp: "射出成形（インジェクション）製造オペレーター",
        zh: "注塑成型生产操作员 (Injection Molding Operator)"
      },
      company: "PT Resin Plating Technology",
      period: {
        id: "Agustus 2019 - Agustus 2020",
        en: "August 2019 - August 2020",
        jp: "2019年8月 - 2020年8月",
        zh: "2019年8月 - 2020年8月"
      },
      points: {
        id: [
          "Set Up dan cleaning mesin beserta mold (Dandori), mengontrol selama proses berjalannya produksi.",
          "Maintenance mesin dan peralatan keperluan produksi.",
          "Mensupply dan set up bahan baku ke mesin sesuai kebutuhan produksi.",
          "Troubleshooting kerusakan ringan terhadap mesin, melakukan aktivitas kaizen dan 5R.",
          "Memproduksi item sesuai kanban/permintaan produksi, dan melakukan pengecekan kualitas item."
        ],
        en: [
          "Performed machine and mold setup and cleaning (Dandori), monitoring operations throughout production.",
          "Maintained production machinery and supporting tooling.",
          "Supplied and configured raw materials according to production requirements.",
          "Troubleshot minor machine issues and actively participated in Kaizen and 5S/5R initiatives.",
          "Produced items according to Kanban production orders and conducted item quality checks."
        ],
        jp: [
          "金型および成形機の段取り替え（ダンドリ）・清掃、および生産稼働中のプロセス管理。",
          "生産機械および製造設備のメンテナンス。",
          "生産要件に応じた原材料の供給とセットアップ。",
          "機械の軽微なトラブルシューティング、およびカイゼン（改善）・5S活動の実施。",
          "かんばん（生産指示）に基づく製造と完成品の品質検査。"
        ],
        zh: [
          "负责机器与模具的安装调试与清洁（Dandori/换模），并监控生产全过程。",
          "维护生产机器与配套工艺设备。",
          "根据生产需求供应并设置原材料。",
          "排查机器轻微故障，积极执行改善（Kaizen）与5S/5R现场管理活动。",
          "按照看板（Kanban）生产指令制造产品并执行质量检验。"
        ]
      }
    }
  ],

  education: [
    {
      major: {
        id: "Teknik Komputer Jaringan",
        en: "Computer & Network Engineering",
        jp: "コンピュータ・ネットワーク工学専攻",
        zh: "计算机与网络工程"
      },
      institution: "SMK Negeri 2 Cikarang Barat",
      period: "2016 - 2019",
      finalProjects: {
        id: [
          "Implementasi Infrastruktur Networking Mikrotik",
          "Instalasi private server berbasis sistem operasi Linux"
        ],
        en: [
          "MikroTik Network Infrastructure Implementation",
          "Linux-Based Private Server Installation & Configuration"
        ],
        jp: [
          "MikroTikネットワークインフラの構築・実装",
          "Linux OSベースのプライベートサーバー構築・導入"
        ],
        zh: [
          "MikroTik网络基础设施部署与实现",
          "基于Linux操作系统的私有服务器安装与配置"
        ]
      }
    }
  ],

  additionalInfo: {
    technicalSkills: {
      id: [
        "ERP",
        "Ms.Excel (Beginner)",
        "CRM",
        "Network Configuration",
        "AI Prompt Engineering & Automation Tools"
      ],
      en: [
        "ERP Systems",
        "MS Excel (Beginner)",
        "CRM",
        "Network Configuration",
        "AI Prompt Engineering & Automation Tools"
      ],
      jp: [
        "ERPシステム",
        "MS Excel (初級)",
        "CRM",
        "ネットワーク構築",
        "AIプロンプトエンジニアリング＆自動化ツール開発"
      ],
      zh: [
        "ERP系统",
        "MS Excel (基础)",
        "CRM客户关系管理",
        "网络配置",
        "AI提示词工程与自动化工具开发"
      ]
    },
    interpersonalSkills: {
      id: [
        "Komunikasi",
        "Negosiasi",
        "Manajemen Waktu",
        "Problem Solving",
        "Adaptasi"
      ],
      en: [
        "Communication",
        "Negotiation",
        "Time Management",
        "Problem Solving",
        "Adaptability"
      ],
      jp: [
        "コミュニケーション",
        "交渉力",
        "時間管理",
        "問題解決（プロブレムソルビング）",
        "適応力"
      ],
      zh: [
        "沟通协调",
        "商务谈判",
        "时间管理",
        "问题解决",
        "环境适应力"
      ]
    },
    languages: {
      id: "Indonesia, English (Reading = Aktif, Speaking = Pasif, Listening = Aktif)",
      en: "Indonesian (Native), English (Reading: Active, Speaking: Passive, Listening: Active)",
      jp: "インドネシア語（母国語）、英語（リーディング：実務レベル、スピーキング：日常会話、リスニング：実務レベル）",
      zh: "印尼语（母语），英语（阅读：熟练，口语：基础，听力：熟练）"
    },
    certifications: ["Technical Analysis Master Class (Udemy)"],
    sideActivities: {
      id: [
        "Pengelola Komunitas / Analyst Pasar Crypto dan Saham (pencapaian 2.500+ Followers) di platform asing (Binance)",
        "Penyedia Layanan Servis Hardware/Software & Penjual Aksesori IT (HP, PC, Laptop)"
      ],
      en: [
        "Community Manager / Crypto & Stock Market Analyst (achieved 2,500+ followers) on Binance global platform",
        "Hardware/Software Repair Service Provider & IT Accessories Retailer (Mobile, PC, Laptop)"
      ],
      jp: [
        "グローバル取引所プラットフォーム（Binance）にて暗号資産・株式市場アナリストおよびコミュニティ運営（フォロワー2,500名以上達成）",
        "PC・スマートフォン・ノートPCのハードウェア／ソフトウェア修理サービスおよびITアクセサリー販売"
      ],
      zh: [
        "在全球交易平台（Binance）担任加密货币与股票市场分析师及社区管理（累计2,500+关注者）",
        "提供硬件/软件维修服务及IT配件零售（手机、台式机、笔记本电脑）"
      ]
    }
  },

  ui: {
    id: {
      nav: {
        portfolio: "Portofolio",
        experience: "Pengalaman",
        qualifications: "Kualifikasi",
        contact: "Kontak"
      },
      downloadCv: "Unduh CV (PDF)",
      themeLabel: "Tema",
      themeLight: "Terang",
      themeDark: "Gelap",
      langLabel: "Bahasa",
      emailCopied: "Email Tersalin",
      urlCopied: "Tersalin",
      copyUrl: "Salin URL",
      openApp: "Buka Aplikasi",
      openAppNow: "Buka Aplikasi Sekarang",
      detail: "Detail",
      contactLabels: {
        location: "Lokasi",
        phone: "Telepon",
        email: "Email",
        linkedin: "LinkedIn",
        github: "GitHub"
      },
      section01: {
        title: "01. Portofolio & Sistem Otomasi",
        subtitle: "Klik baris aplikasi atau tekan tombol angka (1–3) untuk membuka tautan langsung",
        filterAll: "Semua (3)",
        filterAutomation: "Otomasi (2)",
        filterDocument: "Dokumen (1)"
      },
      section02: {
        title: "02. Pengalaman Kerja",
        subtitle: "Rekam jejak profesional di industri manufaktur & operasional B2B"
      },
      section03: {
        title: "03. Pendidikan",
        finalProjectLabel: "Tugas Akhir:"
      },
      section04: {
        title: "04. Keahlian & Informasi Tambahan",
        technicalSkills: "Keahlian Teknis",
        interpersonalSkills: "Interpersonal",
        languages: "Bahasa",
        certifications: "Sertifikasi",
        sideActivities: "Aktivitas Sampingan"
      },
      section05: {
        title: "05. Kontak & Tautan Langsung",
        subtitle: "Tersedia untuk diskusi peluang kerja penuh waktu maupun implementasi sistem otomasi operasional.",
        sendEmail: "Kirim Email",
        whatsapp: "WhatsApp"
      },
      modal: {
        projectPrefix: "PROYEK",
        implementationDesc: "Deskripsi Implementasi",
        scopeAndSpecs: "Cakupan & Spesifikasi",
        redirectUrlLabel: "URL Tujuan Redirect",
        closeAria: "Tutup detail proyek"
      }
    },
    en: {
      nav: {
        portfolio: "Portfolio",
        experience: "Experience",
        qualifications: "Qualifications",
        contact: "Contact"
      },
      downloadCv: "Download CV (PDF)",
      themeLabel: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      langLabel: "Language",
      emailCopied: "Email Copied",
      urlCopied: "Copied",
      copyUrl: "Copy URL",
      openApp: "Launch App",
      openAppNow: "Launch Application",
      detail: "Details",
      contactLabels: {
        location: "Location",
        phone: "Phone",
        email: "Email",
        linkedin: "LinkedIn",
        github: "GitHub"
      },
      section01: {
        title: "01. Portfolio & Automation Systems",
        subtitle: "Click any application row or press number keys (1–3) to open the live deployment",
        filterAll: "All (3)",
        filterAutomation: "Automation (2)",
        filterDocument: "Document (1)"
      },
      section02: {
        title: "02. Work Experience",
        subtitle: "Professional track record in manufacturing & B2B sales operations"
      },
      section03: {
        title: "03. Education",
        finalProjectLabel: "Final Projects:"
      },
      section04: {
        title: "04. Skills & Additional Information",
        technicalSkills: "Technical Skills",
        interpersonalSkills: "Interpersonal",
        languages: "Languages",
        certifications: "Certification",
        sideActivities: "Side Activities"
      },
      section05: {
        title: "05. Contact & Direct Links",
        subtitle: "Available for full-time opportunities and operational workflow automation projects.",
        sendEmail: "Send Email",
        whatsapp: "WhatsApp"
      },
      modal: {
        projectPrefix: "PROJECT",
        implementationDesc: "Implementation Overview",
        scopeAndSpecs: "Scope & Specifications",
        redirectUrlLabel: "Destination Redirect URL",
        closeAria: "Close project details"
      }
    },
    jp: {
      nav: {
        portfolio: "実績・ツール",
        experience: "職務経歴",
        qualifications: "学歴・スキル",
        contact: "連絡先"
      },
      downloadCv: "履歴書 (PDF)",
      themeLabel: "テーマ",
      themeLight: "ライト",
      themeDark: "ダーク",
      langLabel: "言語",
      emailCopied: "コピー完了",
      urlCopied: "コピー済",
      copyUrl: "URLをコピー",
      openApp: "アプリを開く",
      openAppNow: "アプリケーションを開く",
      detail: "詳細",
      contactLabels: {
        location: "所在地",
        phone: "電話",
        email: "メール",
        linkedin: "LinkedIn",
        github: "GitHub"
      },
      section01: {
        title: "01. ポートフォリオ＆業務自動化システム",
        subtitle: "各プロジェクトをクリックするか、数字キー（1〜3）を押すと公開アプリへ移動します",
        filterAll: "すべて (3)",
        filterAutomation: "自動化 (2)",
        filterDocument: "文書処理 (1)"
      },
      section02: {
        title: "02. 職務経歴",
        subtitle: "製造業およびB2B営業オペレーションにおける実務経歴"
      },
      section03: {
        title: "03. 学歴",
        finalProjectLabel: "卒業制作・最終課題:"
      },
      section04: {
        title: "04. スキル＆補足情報",
        technicalSkills: "技術スキル",
        interpersonalSkills: "対人スキル",
        languages: "言語能力",
        certifications: "資格・認定",
        sideActivities: "その他の活動"
      },
      section05: {
        title: "05. お問い合わせ・各種リンク",
        subtitle: "フルタイムの採用選考や業務自動化システムの導入に関するご相談を受け付けております。",
        sendEmail: "メールを送信",
        whatsapp: "WhatsApp"
      },
      modal: {
        projectPrefix: "プロジェクト",
        implementationDesc: "実装概要",
        scopeAndSpecs: "主な機能と仕様",
        redirectUrlLabel: "リダイレクト先URL",
        closeAria: "詳細を閉じる"
      }
    },
    zh: {
      nav: {
        portfolio: "作品集",
        experience: "工作经历",
        qualifications: "学历与技能",
        contact: "联系方式"
      },
      downloadCv: "下载简历 (PDF)",
      themeLabel: "主题",
      themeLight: "浅色",
      themeDark: "深色",
      langLabel: "语言",
      emailCopied: "邮箱已复制",
      urlCopied: "已复制",
      copyUrl: "复制链接",
      openApp: "打开应用",
      openAppNow: "立即打开应用",
      detail: "详情",
      contactLabels: {
        location: "所在地",
        phone: "电话",
        email: "邮箱",
        linkedin: "LinkedIn",
        github: "GitHub"
      },
      section01: {
        title: "01. 作品集与自动化系统",
        subtitle: "点击任意项目行或按数字键（1–3）可直接打开线上应用",
        filterAll: "全部 (3)",
        filterAutomation: "自动化 (2)",
        filterDocument: "文档工具 (1)"
      },
      section02: {
        title: "02. 工作经历",
        subtitle: "制造业与B2B销售运营领域的专业履历"
      },
      section03: {
        title: "03. 教育背景",
        finalProjectLabel: "毕业项目:"
      },
      section04: {
        title: "04. 专业技能与附加信息",
        technicalSkills: "技术能力",
        interpersonalSkills: "软技能",
        languages: "语言能力",
        certifications: "专业认证",
        sideActivities: "副业与社区活动"
      },
      section05: {
        title: "05. 联系方式与直达链接",
        subtitle: "欢迎就全职工作机会或企业运营自动化系统方案与我联系。",
        sendEmail: "发送邮件",
        whatsapp: "WhatsApp"
      },
      modal: {
        projectPrefix: "项目",
        implementationDesc: "项目实现概述",
        scopeAndSpecs: "功能范围与规格",
        redirectUrlLabel: "目标跳转链接",
        closeAria: "关闭项目详情"
      }
    }
  }
};
