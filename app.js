/**
 * FactoryCost - Forecast & Analytics Application Logic
 * Pure client-side JavaScript, localStorage state, reactive calculations, and SVG charts.
 */

// ==========================================================================
// 1. Initial Mock Data & State Configuration
// ==========================================================================

const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwoheq43Jz30MQWTkDqzC6KJ7zdOKUJDlWAyk75oI39q8YNesK-NYzKqqVhyZP1oNqF/exec";

const ROLE_DEFINITIONS = {
  admin: {
    id: "admin",
    name: "Quản Trị Viên (Admin)",
    badge: "👑 Admin",
    color: "#38bdf8",
    permissions: ["dashboard", "calculator", "calculator_edit", "forecast", "order_cost", "capex", "monthly_report", "settings"]
  },
  sales: {
    id: "sales",
    name: "Kinh Doanh / Seller",
    badge: "💼 Sales",
    color: "#10b981",
    permissions: ["dashboard", "calculator", "order_cost"]
  },
  production: {
    id: "production",
    name: "Quản Lý Sản Xuất",
    badge: "🏭 Sản Xuất",
    color: "#f59e0b",
    permissions: ["dashboard", "calculator", "calculator_edit", "forecast", "capex"]
  },
  finance: {
    id: "finance",
    name: "Kế Toán / Tài Chính",
    badge: "📊 Kế Toán",
    color: "#8b5cf6",
    permissions: ["dashboard", "calculator", "order_cost", "capex", "monthly_report"]
  },
  viewer: {
    id: "viewer",
    name: "Khách Xem (Chỉ đọc)",
    badge: "👁️ Khách Xem",
    color: "#94a3b8",
    permissions: ["dashboard", "calculator"]
  },
  custom: {
    id: "custom",
    name: "Tùy Chỉnh",
    badge: "⚙️ Tùy Chỉnh",
    color: "#ec4899",
    permissions: []
  }
};

const DEFAULT_SETTINGS = {
  hrVersion: "2026-10-20-dept-v2",
  electricityPrice: 3000,   // đ/kWh
  defaultOverhead: 10,      // %
  standardHours: 208,       // Giờ công chuẩn/tháng
  defaultProfitMargin: 20,  // % Lợi nhuận mặc định
  passcode: "123456",       // Mật khẩu truy cập mặc định
  users: [
    {
      id: "usr_admin",
      username: "admin",
      name: "Quản Trị Viên (Admin)",
      passcode: "123456",
      role: "admin",
      permissions: ["dashboard", "calculator", "calculator_edit", "forecast", "order_cost", "capex", "monthly_report", "settings"],
      createdAt: "2026-10-31"
    }
  ],
  monthlyElectricity: {
    In: 8000000,
    Thêu: 11000000
  },
  monthlyRecords: {
    "7": { name: "Tháng 7/2026", electricity: { In: 8000000, Thêu: 11000000 }, salary: { In: 89898804, Thêu: 200738932 }, otherFixedCost: 0 },
    "8": { name: "Tháng 8/2026", electricity: { In: 8500000, Thêu: 11500000 }, salary: { In: 89898804, Thêu: 200738932 }, otherFixedCost: 0 },
    "9": { name: "Tháng 9/2026", electricity: { In: 8000000, Thêu: 11000000 }, salary: { In: 89898804, Thêu: 200738932 }, otherFixedCost: 0 },
    "10": { name: "Tháng 10/2026", electricity: { In: 8000000, Thêu: 11000000 }, salary: { In: 89898804, Thêu: 200738932 }, otherFixedCost: 0 },
    "11": { name: "Tháng 11/2026", electricity: { In: 8000000, Thêu: 11000000 }, salary: { In: 89898804, Thêu: 200738932 }, otherFixedCost: 0 },
    "12": { name: "Tháng 12/2026", electricity: { In: 8000000, Thêu: 11000000 }, salary: { In: 89898804, Thêu: 200738932 }, otherFixedCost: 0 }
  },
  hr: {
    In: {
      designer: [
        { name: "Đỗ Thành Trung (NV138)", salary: 923000 },
        { name: "Đỗ Cường Quý (NV113)", salary: 12365865 },
        { name: "Đặng Thanh Uyên Nhi (NV85)", salary: 14161288 },
        { name: "Vũ Quang Hoà (NV82)", salary: 13460808 },
        { name: "TRẦN VŨ QUỲNH MAI (NV016)", salary: 14493545 },
        { name: "TRẦN HỒ HỒNG HÂN (NV12)", salary: 13289045 },
        { name: "NGUYỄN THỊ HẰNG NGA (NV09)", salary: 10252237 }
      ],
      production: [
        { name: "Nguyễn Hoàng Minh Nhật (TT01)", salary: 5073000 },
        { name: "Vũ Đình Quân (NV133)", salary: 10312462 },
        { name: "Nguyễn Hữu Chiến (NV132)", salary: 13621385 },
        { name: "Phạm Ngọc Thạch (NV131)", salary: 9811202 },
        { name: "Phạm Anh Phúc (NV126)", salary: 8698538 },
        { name: "Nguyễn Hữu Anh Tú (NV90)", salary: 10138365 },
        { name: "Trần Thị Bích Ngọc (NV83)", salary: 11992587 },
        { name: "Ngụy Bùi Phước Sang (NV81)", salary: 12562965 }
      ],
      qc: [
        { name: "THÂN KIM TRANG (NV121)", salary: 7893604 },
        { name: "Nguyễn Ngọc Quỳnh Hương (NV119)", salary: 9793279 },
        { name: "Phạm Thị Minh Thư (NV108)", salary: 10840718 },
        { name: "Đoàn Thị Thiên Lý (NV101)", salary: 11200649 }
      ]
    },
    Thêu: {
      designer: [
        { name: "Lâm Thúy Vi (NV96)", salary: 915000 },
        { name: "Vũ Thị Hoàng Thu Thảo (HV17)", salary: 10588513 },
        { name: "Phạm Ngọc Minh Quyên (HV16)", salary: 11307410 },
        { name: "Đinh Thùy Diễm Hằng (HV15)", salary: 11047128 },
        { name: "Phạm Ý Diệu Ngân (HV14)", salary: 10029910 },
        { name: "Nguyễn Kim Điền (HV12)", salary: 11983564 },
        { name: "Trần Tiến Đạt (HV11)", salary: 10001500 },
        { name: "Trần Thị Kim Ngân (HV10)", salary: 10987256 },
        { name: "Nguyễn Quỳnh Như (HV04)", salary: 2315577 },
        { name: "Đoàn Như Quỳnh (HV03)", salary: 9885782 },
        { name: "Vũ Thị Xuân Hồng (NV95)", salary: 14022817 },
        { name: "Phạm Thị Thuý Hằng (NV93)", salary: 11010731 },
        { name: "Nguyễn Kiều Trinh (NV91)", salary: 14253889 },
        { name: "Vũ Minh Hoàng (NV80)", salary: 11228202 },
        { name: "Trần Hoàng Hải (NV63)", salary: 10408487 },
        { name: "Nguyễn Hồng Thương (NV62)", salary: 15327506 },
        { name: "Vũ Phạm Quốc Tiến (NV51)", salary: 8197077 }
      ],
      laser: [
        { name: "Phạm Phát Đạt (NV134 - Laser cắt vải)", salary: 10020433 }
      ],
      production: [
        { name: "Nguyễn Vinh Hiền (NV127)", salary: 8832385 },
        { name: "Nguyễn Ngọc Ánh (NV107)", salary: 8701433 },
        { name: "Vũ Đức Huy (NV106)", salary: 8759487 },
        { name: "Nguyễn Triệu Huy (HV08)", salary: 9109923 },
        { name: "Trần Nguyễn Hoàng Quân (HV07)", salary: 11806462 },
        { name: "VŨ THANH LIÊM (NV71)", salary: 8676423 },
        { name: "Vũ Ngọc Thiện (NV69)", salary: 9356399 },
        { name: "Vũ Ngọc Phương Uyên (NV68)", salary: 11238356 },
        { name: "Tô Thị Thuỳ Trang (NV66)", salary: 14223869 },
        { name: "Phạm Xuân Thạch (NV27 - Quản lý xưởng)", salary: 19120231 },
        { name: "HOÀNG THANH DŨNG (NV03 - Quản lý kỹ thuật)", salary: 14832827 }
      ],
      qc: [
        { name: "Ngô Thị Mỹ Hạnh (NV137)", salary: 2454000 },
        { name: "Nguyễn Minh Nhật (NV128)", salary: 8101385 },
        { name: "Đinh Thị Kim Hồng (NV123)", salary: 9439385 },
        { name: "Đinh Trần Trúc Loan (NV115)", salary: 6307365 },
        { name: "Trần Ngọc Phương Oanh (NV114)", salary: 7347338 },
        { name: "Nguyễn Thị Lệ Quyên (NV109)", salary: 8596216 },
        { name: "Trần Võ Trâm Anh (HV02)", salary: 8328026 },
        { name: "TRẦN TRÚC THƯ (NV33)", salary: 11565295 }
      ]
    }
  },
  machinesVersion: "2026-10-28-capex-74mach-v1",
  machines: [
    // 1. NHÓM THÊU & LASER (25 máy - 2.995.000.000 VNĐ)
    {
      id: "mach-bai-mirror",
      name: "Máy thêu Bai The Mirror (17 máy)",
      category: "Thêu & Laser",
      factoryType: "Thêu",
      quantity: 17,
      unitPrice: 110000000,
      investment: 1870000000,
      paybackYears: 3,
      expectedVolumePerYear: 30000,
      currentVolume: 12000,
      surchargePerUnit: 20778,
      discountAfter3Years: 80,
      unitType: "Cái"
    },
    {
      id: "mach-bai-old-vision",
      name: "Máy thêu Bai Old Vision (2 máy)",
      category: "Thêu & Laser",
      factoryType: "Thêu",
      quantity: 2,
      unitPrice: 150000000,
      investment: 300000000,
      paybackYears: 3,
      expectedVolumePerYear: 10000,
      currentVolume: 4000,
      surchargePerUnit: 10000,
      discountAfter3Years: 80,
      unitType: "Cái"
    },
    {
      id: "mach-bai-vision",
      name: "Máy thêu Bai The Vision (3 máy)",
      category: "Thêu & Laser",
      factoryType: "Thêu",
      quantity: 3,
      unitPrice: 165000000,
      investment: 495000000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 6000,
      surchargePerUnit: 11000,
      discountAfter3Years: 80,
      unitType: "Cái"
    },
    {
      id: "mach-bai-vision-2",
      name: "Máy thêu Bai The Vision-2 (1 máy)",
      category: "Thêu & Laser",
      factoryType: "Thêu",
      quantity: 1,
      unitPrice: 220000000,
      investment: 220000000,
      paybackYears: 3,
      expectedVolumePerYear: 8000,
      currentVolume: 3000,
      surchargePerUnit: 9167,
      discountAfter3Years: 80,
      unitType: "Cái"
    },
    {
      id: "mach-laser-4060",
      name: "Laser bàn 40 × 60 (mua mới)",
      category: "Thêu & Laser",
      factoryType: "Thêu",
      quantity: 1,
      unitPrice: 50000000,
      investment: 50000000,
      paybackYears: 3,
      expectedVolumePerYear: 10000,
      currentVolume: 4000,
      surchargePerUnit: 1667,
      discountAfter3Years: 80,
      unitType: "Lần cắt"
    },
    {
      id: "mach-laser-1610",
      name: "Laser bàn 1610 (mua lại)",
      category: "Thêu & Laser",
      factoryType: "Thêu",
      quantity: 1,
      unitPrice: 60000000,
      investment: 60000000,
      paybackYears: 3,
      expectedVolumePerYear: 10000,
      currentVolume: 4000,
      surchargePerUnit: 2000,
      discountAfter3Years: 80,
      unitType: "Lần cắt"
    },

    // 2. NHÓM IN, CẮT & HOÀN THIỆN (25 máy - 5.450.214.182 VNĐ)
    {
      id: "mach-dlican",
      name: "Dlican (kèm PC + UPS)",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 1065000000,
      investment: 1065000000,
      paybackYears: 3,
      expectedVolumePerYear: 25000,
      currentVolume: 10000,
      surchargePerUnit: 14200,
      discountAfter3Years: 80,
      unitType: "Mét"
    },
    {
      id: "mach-uvdtf-grando",
      name: "UV DTF Grando (2 máy)",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 2,
      unitPrice: 297000000,
      investment: 594000000,
      paybackYears: 3,
      expectedVolumePerYear: 20000,
      currentVolume: 8000,
      surchargePerUnit: 9900,
      discountAfter3Years: 80,
      unitType: "Mét"
    },
    {
      id: "mach-pet-xkeda",
      name: "Máy in PET Xkeda",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 270000000,
      investment: 270000000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 5000,
      surchargePerUnit: 6000,
      discountAfter3Years: 80,
      unitType: "Mét"
    },
    {
      id: "mach-roland-vg3-640",
      name: "Roland VG3-640",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 321840000,
      investment: 321840000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 6000,
      surchargePerUnit: 7152,
      discountAfter3Years: 80,
      unitType: "Mét"
    },
    {
      id: "mach-roland-lg-640",
      name: "Roland LG-640 (2 máy)",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 2,
      unitPrice: 561600000,
      investment: 1123200000,
      paybackYears: 3,
      expectedVolumePerYear: 25000,
      currentVolume: 10000,
      surchargePerUnit: 14976,
      discountAfter3Years: 80,
      unitType: "Mét"
    },
    {
      id: "mach-jwei-graphtec",
      name: "Máy cắt Jwei + Graphtec (Trọn bộ 2 máy)",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 2,
      unitPrice: 100000000,
      investment: 200000000,
      paybackYears: 3,
      expectedVolumePerYear: 30000,
      currentVolume: 12000,
      surchargePerUnit: 2222,
      discountAfter3Years: 80,
      unitType: "Lần cắt"
    },
    {
      id: "mach-graphtec-fc9000",
      name: "Graphtec FC9000",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 157640000,
      investment: 157640000,
      paybackYears: 3,
      expectedVolumePerYear: 25000,
      currentVolume: 10000,
      surchargePerUnit: 2102,
      discountAfter3Years: 80,
      unitType: "Lần cắt"
    },
    {
      id: "mach-graphtec-ce8000-130",
      name: "Graphtec CE8000-130",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 78840000,
      investment: 78840000,
      paybackYears: 3,
      expectedVolumePerYear: 20000,
      currentVolume: 8000,
      surchargePerUnit: 1314,
      discountAfter3Years: 80,
      unitType: "Lần cắt"
    },
    {
      id: "mach-graphtec-ce8000-60",
      name: "Graphtec CE8000-60 (2 máy)",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 2,
      unitPrice: 34020000,
      investment: 68040000,
      paybackYears: 3,
      expectedVolumePerYear: 20000,
      currentVolume: 8000,
      surchargePerUnit: 1134,
      discountAfter3Years: 80,
      unitType: "Lần cắt"
    },
    {
      id: "mach-graphtec-ce8000-40",
      name: "Graphtec CE8000-40 (kèm bộ nạp tự động)",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 50024000,
      investment: 50024000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 6000,
      surchargePerUnit: 1112,
      discountAfter3Years: 80,
      unitType: "Lần cắt"
    },
    {
      id: "mach-in-napkin",
      name: "Máy in Napkin",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 324000000,
      investment: 324000000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 5000,
      surchargePerUnit: 7200,
      discountAfter3Years: 80,
      unitType: "Cái"
    },
    {
      id: "mach-konica",
      name: "Máy in Konica",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 657818182,
      investment: 657818182,
      paybackYears: 3,
      expectedVolumePerYear: 60000,
      currentVolume: 25000,
      surchargePerUnit: 3655,
      discountAfter3Years: 80,
      unitType: "Click"
    },
    {
      id: "mach-cat-be-5",
      name: "Máy cắt bế (5 máy)",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 5,
      unitPrice: 55000000,
      investment: 275000000,
      paybackYears: 3,
      expectedVolumePerYear: 50000,
      currentVolume: 20000,
      surchargePerUnit: 1833,
      discountAfter3Years: 80,
      unitType: "Lần bế"
    },
    {
      id: "mach-can-mang-nho",
      name: "Máy cán màng nhỏ",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 45000000,
      investment: 45000000,
      paybackYears: 3,
      expectedVolumePerYear: 20000,
      currentVolume: 8000,
      surchargePerUnit: 750,
      discountAfter3Years: 80,
      unitType: "Lần cán"
    },
    {
      id: "mach-can-mang",
      name: "Máy cán màng",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 95000000,
      investment: 95000000,
      paybackYears: 3,
      expectedVolumePerYear: 30000,
      currentVolume: 12000,
      surchargePerUnit: 1056,
      discountAfter3Years: 80,
      unitType: "Lần cán"
    },
    {
      id: "mach-can-mang-cuon",
      name: "Máy cán màng cuộn",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 38500000,
      investment: 38500000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 6000,
      surchargePerUnit: 856,
      discountAfter3Years: 80,
      unitType: "Mét"
    },
    {
      id: "mach-epson-roll",
      name: "Máy in roll Epson + Roll",
      category: "In, Cắt & Hoàn Thiện",
      factoryType: "In",
      quantity: 1,
      unitPrice: 86312000,
      investment: 86312000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 6000,
      surchargePerUnit: 1918,
      discountAfter3Years: 80,
      unitType: "Cuộn"
    },

    // 3. NHÓM MÁY IN 3D (24 máy - 730.376.000 VNĐ)
    {
      id: "mach-bambu-a1",
      name: "Bambu Lab A1 (16 máy)",
      category: "Máy in 3D",
      factoryType: "In 3D",
      quantity: 16,
      unitPrice: 11499000,
      investment: 183984000,
      paybackYears: 3,
      expectedVolumePerYear: 20000,
      currentVolume: 8000,
      surchargePerUnit: 3066,
      discountAfter3Years: 80,
      unitType: "Cái"
    },
    {
      id: "mach-bambu-h2c",
      name: "Bambu Lab H2C (8 máy)",
      category: "Máy in 3D",
      factoryType: "In 3D",
      quantity: 8,
      unitPrice: 68299000,
      investment: 546392000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 5000,
      surchargePerUnit: 12142,
      discountAfter3Years: 80,
      unitType: "Cái"
    }
  ],
  materialsCatalog: [
    // Giấy & Decal
    { id: "mat-giay-c300-a4", name: "Giấy Couche 300gsm (C300) A4", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 477, factoryType: "In", sheetSize: "A4", notes: "Khổ A4 in lịch để bàn" },
    { id: "mat-giay-c300-33x48", name: "Giấy Couche 300gsm (C300) 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1084, factoryType: "In", sheetSize: "33×48cm", notes: "In bài cards, ruột sổ gift card" },
    { id: "mat-giay-ivory-300-33x48", name: "Giấy Ivory 300gsm 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1264, factoryType: "In", sheetSize: "33×48cm", notes: "Làm bìa sổ thẻ, hộp bài Ivory" },
    { id: "mat-decal-sua-33x48", name: "Decal sữa mờ Fasson 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1571, factoryType: "In", sheetSize: "33×48cm", notes: "Decal sữa mờ đế trắng Fasson" },
    { id: "mat-decal-trong-33x48", name: "Decal trong suốt Fasson 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1600, factoryType: "In", sheetSize: "33×48cm", notes: "Decal trong dán ly cốc, bao bì kính" },
    { id: "mat-decal-bac-33x35", name: "Decal bạc xé không rách 33×35.4cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 2200, factoryType: "In", sheetSize: "33×35.4cm", notes: "Decal xi bạc dán tem thiết bị, máy móc" },
    { id: "mat-decal-kraft-33x35", name: "Decal Kraft nâu da bò 33×35.4cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1800, factoryType: "In", sheetSize: "33×35.4cm", notes: "Decal giấy Kraft vintage dán chai lọ" },
    { id: "mat-decal-dai-cuon", name: "Decal sữa dải cuốn hộp bài 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 6000, factoryType: "In", sheetSize: "33×48cm", notes: "Cắt 9 dải cuộn dán nắp hộp bài" },
    { id: "mat-giay-couche-250", name: "Giấy Couche 250gsm (C250) 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1050, factoryType: "In", sheetSize: "33×48cm", notes: "In brochure, catalogue, kẹp file" },
    { id: "mat-giay-couche-150", name: "Giấy Couche 150gsm (C150) 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 750, factoryType: "In", sheetSize: "33×48cm", notes: "In tờ rơi flyer, ruột tạp chí" },
    { id: "mat-giay-ivory-350", name: "Giấy Ivory 350gsm làm hộp 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1800, factoryType: "In", sheetSize: "33×48cm", notes: "In vỏ hộp bài, hộp quà tặng cứng cáp" },
    { id: "mat-giay-kraft-250", name: "Giấy Kraft Nhật 250gsm 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 1300, factoryType: "In", sheetSize: "33×48cm", notes: "In tag mác quần áo, thiệp handmade" },
    { id: "mat-giay-ford-100", name: "Giấy Ford trắng 100gsm A4", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 250, factoryType: "In", sheetSize: "A4", notes: "In tài liệu văn phòng, tiêu đề thư" },
    { id: "mat-decal-skin-atm", name: "Phôi Decal Skin Card ATM 33×48cm", category: "Giấy & Decal", unit: "Tờ", defaultPrice: 2000, factoryType: "In", sheetSize: "33×48cm", notes: "21 con/tờ phôi dán thẻ ngân hàng" },
    { id: "mat-decal-cuon-sieutrong-127", name: "Decal siêu trong suốt mực dầu cuộn (1.27×1m)", category: "Giấy & Decal", unit: "Mét", defaultPrice: 37211, factoryType: "In", sheetSize: "1.27 x 1m", notes: "Cuộn 1.27×50m (1.860.550đ chưa VAT), 37.211đ/m dài" },
    { id: "mat-decal-cuon-bacbong-127", name: "Decal bạc bóng cuộn (1.27×1m)", category: "Giấy & Decal", unit: "Mét", defaultPrice: 54610, factoryType: "In", sheetSize: "1.27 x 1m", notes: "Cuộn 1.27×50m (2.730.500đ chưa VAT), 54.610đ/m dài" },
    { id: "mat-decal-cuon-vangbong-122", name: "Decal vàng bóng cuộn (1.22×1m)", category: "Giấy & Decal", unit: "Mét", defaultPrice: 35990, factoryType: "In", sheetSize: "1.22 x 1m", notes: "Cuộn 1.22×50m (1.799.500đ chưa VAT), 35.990đ/m dài" },
    { id: "mat-decal-cuon-hologram-127", name: "Decal hologram tia laser cuộn (1.27×1m)", category: "Giấy & Decal", unit: "Mét", defaultPrice: 54610, factoryType: "In", sheetSize: "1.27 x 1m", notes: "Cuộn 1.27×50m (2.730.500đ chưa VAT), 54.610đ/m dài" },
    { id: "mat-decal-cuon-mccal-120", name: "Decal mccal trắng sữa cuộn (1.2×1m)", category: "Giấy & Decal", unit: "Mét", defaultPrice: 39610, factoryType: "In", sheetSize: "1.2 x 1m", notes: "Cuộn 1.2×100m (3.961.000đ chưa VAT), 39.610đ/m dài" },
    { id: "mat-decal-cuon-proton-127", name: "Decal proton trong cuộn (1.27×1m)", category: "Giấy & Decal", unit: "Mét", defaultPrice: 35180, factoryType: "In", sheetSize: "1.27 x 1m", notes: "Cuộn 1.27×50m (1.759.000đ chưa VAT), 35.180đ/m dài" },

    // Màng & Phủ
    { id: "mat-mang-hologram", name: "Màng cán 7 màu Hologram 33×48cm", category: "Màng & Phủ", unit: "Tờ", defaultPrice: 21975, factoryType: "In", sheetSize: "33×48cm", notes: "Cán bìa sổ thẻ cao cấp lấp lánh" },
    { id: "mat-mang-mo-28mic", name: "Màng cán mờ nhiệt 28mic 33×48cm", category: "Màng & Phủ", unit: "Tờ", defaultPrice: 859, factoryType: "In", sheetSize: "33×48cm", notes: "Cán thẻ bài, bìa sổ bảo vệ chống xước" },
    { id: "mat-mang-mo-nhiet", name: "Màng cán mờ nhiệt BOPP 33cm", category: "Màng & Phủ", unit: "Tờ", defaultPrice: 429, factoryType: "In", notes: "Cán mờ bảo vệ bề mặt chống trầy" },
    { id: "mat-mang-bong-nhiet", name: "Màng cán bóng nhiệt BOPP 33cm", category: "Màng & Phủ", unit: "Tờ", defaultPrice: 380, factoryType: "In", notes: "Cán bóng tăng độ tươi màu" },
    { id: "mat-mang-can-sunrise", name: "Màng cán tem Sunrise bóng/mờ cuộn (1.2×1m)", category: "Màng & Phủ", unit: "Mét", defaultPrice: 31250, factoryType: "In", sheetSize: "1.2 x 1m", notes: "Cuộn Sunrise làm tròn 1.5tr/cuộn trừ hao 2m hiệu dụng 48m (= 31.250đ/m)" },
    { id: "mat-mang-a-uvdtf", name: "Màng A in UV-DTF (Cuộn khổ 0.62m)", category: "Màng & Phủ", unit: "Mét", defaultPrice: 40000, factoryType: "In", sheetSize: "0.62 x 1m", notes: "Màng A có keo phủ nền in phun UV" },
    { id: "mat-mang-b-uvdtf", name: "Màng B định hình UV-DTF (Cuộn 0.62m)", category: "Màng & Phủ", unit: "Mét", defaultPrice: 15000, factoryType: "In", sheetSize: "0.62 x 1m", notes: "Màng B cán ép lột dán chuyển nhiệt lạnh" },

    // Lượt In & Mực
    { id: "mat-click-konica-700", name: "Click in màu Konica Minolta (A3/33×48)", category: "Lượt In & Mực", unit: "Click", defaultPrice: 700, factoryType: "In", notes: "Lượt in màu chuẩn 700đ/click" },
    { id: "mat-click-konica-1400", name: "Click in hộp / bìa Konica (1.400đ)", category: "Lượt In & Mực", unit: "Click", defaultPrice: 1400, factoryType: "In", notes: "Lượt in bìa/hộp chuẩn 1.400đ/click" },
    { id: "mat-click-konica", name: "Click in màu máy Konica C4000", category: "Lượt In & Mực", unit: "Click", defaultPrice: 1000, factoryType: "In", notes: "Đơn giá 1 lượt in màu A3 chuẩn" },
    { id: "mat-muc-in-decal-cuon", name: "Mực in phun Decal cuộn khổ lớn (Mực dầu/Eco-Solvent)", category: "Lượt In & Mực", unit: "Mét", defaultPrice: 12000, factoryType: "In", notes: "Mực in phun kỹ thuật số cuộn khổ lớn" },
    { id: "mat-muc-uvdtf", name: "Mực in UV cuộn (CMYK + W + Varnish)", category: "Lượt In & Mực", unit: "Mét", defaultPrice: 25000, factoryType: "In", notes: "Mực in UV cao cấp bóng nổi 3D" },

    // Vật Tư Thêu
    { id: "mat-chi-theu-polyester", name: "Chỉ thêu Polyester bóng cao cấp", category: "Vật Tư Thêu", unit: "Cuộn", defaultPrice: 18000, factoryType: "Thêu", notes: "Cuộn 1.000m màu chuẩn sắc nét" },
    { id: "mat-keo-theu-mech", name: "Keo thêu xé / Mếch giấy lót thêu", category: "Vật Tư Thêu", unit: "Mét", defaultPrice: 5000, factoryType: "Thêu", notes: "Lót cố định form vải khi thêu" },
    { id: "mat-keo-tan", name: "Keo tan nước lót thêu vi tính", category: "Vật Tư Thêu", unit: "Mét", defaultPrice: 9000, factoryType: "Thêu", notes: "Dùng cho vải xù, len, khăn bông" },

    // Bao Bì & Đóng Gói
    { id: "mat-lo-xo-lich-a4", name: "Lò xo kẽm đóng lịch A4", category: "Bao Bì & Đóng Gói", unit: "Cái", defaultPrice: 1600, factoryType: "In", notes: "Lò xo xỏ lịch bàn 13 tờ" },
    { id: "mat-lo-xo-gift-book", name: "Lò xo kẽm đóng sổ Gift Card Book", category: "Bao Bì & Đóng Gói", unit: "Cái", defaultPrice: 2300, factoryType: "In", notes: "Lò xo gáy xoắn sổ thẻ quà tặng" },
    { id: "mat-bang-keo-cham", name: "Băng keo chấm tròn 2 mặt", category: "Bao Bì & Đóng Gói", unit: "Dải", defaultPrice: 2000, factoryType: "In", notes: "Dán cố định gift card trong sổ" },
    { id: "mat-hop-nhua-card", name: "Hộp nhựa đựng bài Poker / Card (50g)", category: "Bao Bì & Đóng Gói", unit: "Hộp", defaultPrice: 25000, factoryType: "In", notes: "Hộp nhựa cứng trong suốt cao cấp" },
    { id: "mat-tui-opp", name: "Túi OPP dán miệng bọc sản phẩm", category: "Bao Bì & Đóng Gói", unit: "Cái", defaultPrice: 150, factoryType: "Chung", notes: "Túi kiếng trong suốt bảo vệ thành phẩm" },
    { id: "mat-hop-giay-ivory", name: "Hộp giấy Ivory in offset nắp gài", category: "Bao Bì & Đóng Gói", unit: "Cái", defaultPrice: 1200, factoryType: "In", notes: "Hộp chứa bộ bài hoặc quà tặng" }
  ]
};

const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Bộ bài Playing Cards (Hộp giấy Ivory)",
    code: "PLC-01",
    category: "Bài in (Playing Cards)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "playing-cards",
      sheetSize: "33x48cm",
      itemSize: "Bài chuẩn 54 lá",
      itemsPerSheet: 0.333333,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 3, unit: "Tờ", price: 1084 },
      { name: "In Konica (2 mặt) - Click", qty: 12, unit: "Click", price: 700 },
      { name: "Màng cán mờ nhiệt 28mic 33×48cm", qty: 6, unit: "Lần", price: 859 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.25, unit: "Tờ", price: 1264 },
      { name: "In hộp (Konica) - Click", qty: 0.25, unit: "Click", price: 1400 },
      { name: "Cán màng mờ 28mic hộp", qty: 0.25, unit: "Lần", price: 859 }
    ],
    labor: { designer: 0.02, production: 0.15, qc: 0.05 },
    electricity: { power: 2.5, runTime: 0.2 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 1000,
      actualSales: 920,
      currentStock: 100,
      safetyStock: 200
    }
  },
  {
    id: "prod-2",
    name: "Bộ bài Playing Cards (Hộp nhựa & Dải cuốn)",
    code: "PLC-02",
    category: "Bài in (Playing Cards)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "playing-cards",
      sheetSize: "33x48cm",
      itemSize: "Bài chuẩn 54 lá",
      itemsPerSheet: 0.333333,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 3, unit: "Tờ", price: 1084 },
      { name: "In Konica (2 mặt) - Click", qty: 12, unit: "Click", price: 700 },
      { name: "Màng cán mờ nhiệt 28mic 33×48cm", qty: 6, unit: "Lần", price: 859 },
      { name: "Hộp nhựa đựng bài Poker / Card (50g)", qty: 1, unit: "Hộp", price: 25000 },
      { name: "Decal sữa dải cuốn hộp bài 33×48cm", qty: 0.111, unit: "Tờ", price: 6000 },
      { name: "In dải cuốn (Konica) - Click", qty: 0.222, unit: "Click", price: 700 }
    ],
    labor: { designer: 0.02, production: 0.12, qc: 0.04 },
    electricity: { power: 2.5, runTime: 0.15 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 600,
      actualSales: 550,
      currentStock: 40,
      safetyStock: 120
    }
  },
  {
    id: "prod-plc2-01",
    name: "Bộ bài Playing Cards V.2 (Chưa cấu hình chi phí)",
    code: "PLC2-01",
    category: "Bài in & Cards (Playing / Uno)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "playing-cards",
      sheetSize: "33x48cm",
      itemSize: "Bài chuẩn 54 lá V.2",
      itemsPerSheet: 0.333333,
      unitType: "Tờ"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-calendar-a4",
    name: "Lịch Để Bàn A4 (Lò xo 13 tờ)",
    code: "CAL-A4-01",
    category: "Lịch để bàn (Calendar)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "calendar-a4",
      sheetSize: "A4 (21x29.7cm)",
      itemSize: "Lịch 13 tờ lò xo",
      itemsPerSheet: 0.076923,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) A4", qty: 13, unit: "Tờ", price: 477 },
      { name: "In Konica (2 mặt) - Click", qty: 26, unit: "Click", price: 700 },
      { name: "Lò xo kẽm đóng lịch A4", qty: 1, unit: "Cái", price: 1600 }
    ],
    labor: { designer: 0.02, production: 0.15, qc: 0.05 },
    electricity: { power: 2.5, runTime: 0.2 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 800,
      actualSales: 720,
      currentStock: 80,
      safetyStock: 150
    }
  },
  {
    id: "prod-cal-02",
    name: "Lịch Để Bàn A5 / Bàn Mini (Chưa cấu hình chi phí)",
    code: "CAL-02",
    category: "Lịch để bàn (Calendar)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "A5",
      itemSize: "Lịch 13 tờ",
      itemsPerSheet: 1,
      unitType: "Cuốn"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-giftcard-5p-matte",
    name: "Sổ Thẻ Gift Card Book (5 trang - Bìa Mờ)",
    code: "GCB-05P-MATTE",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 5 trang + 2 bìa",
      itemsPerSheet: 0.5,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 1.5, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 3, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán mờ nhiệt 28mic 33×48cm", qty: 0.5, unit: "Tờ", price: 859 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.02, production: 0.15, qc: 0.05 },
    electricity: { power: 2.5, runTime: 0.18 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 400,
      actualSales: 350,
      currentStock: 30,
      safetyStock: 80
    }
  },
  {
    id: "prod-giftcard-5p-holo",
    name: "Sổ Thẻ Gift Card Book (5 trang - Bìa Hologram)",
    code: "GCB-05P-HOLO",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 5 trang + 2 bìa",
      itemsPerSheet: 0.5,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 1.5, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 3, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán 7 màu Hologram 33×48cm", qty: 0.5, unit: "Tờ", price: 21975 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.02, production: 0.15, qc: 0.05 },
    electricity: { power: 2.5, runTime: 0.18 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 500,
      actualSales: 450,
      currentStock: 40,
      safetyStock: 100
    }
  },
  {
    id: "prod-giftcard-10p-matte",
    name: "Sổ Thẻ Quà Tặng Gift Card Book (10 trang - Bìa Mờ)",
    code: "GCB-10P-MATTE",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 10 trang + 2 bìa",
      itemsPerSheet: 0.333333,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 2.5, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 5, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán mờ nhiệt 28mic 33×48cm", qty: 0.5, unit: "Tờ", price: 859 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.03, production: 0.18, qc: 0.06 },
    electricity: { power: 2.5, runTime: 0.22 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 500,
      actualSales: 460,
      currentStock: 50,
      safetyStock: 100
    }
  },
  {
    id: "prod-giftcard-10p-holo",
    name: "Sổ Thẻ Quà Tặng Gift Card Book (10 trang - Bìa Hologram)",
    code: "GCB-10P-HOLO",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 10 trang + 2 bìa",
      itemsPerSheet: 0.333333,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 2.5, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 5, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán 7 màu Hologram 33×48cm", qty: 0.5, unit: "Tờ", price: 21975 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.03, production: 0.18, qc: 0.06 },
    electricity: { power: 2.5, runTime: 0.22 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 600,
      actualSales: 550,
      currentStock: 60,
      safetyStock: 120
    }
  },
  {
    id: "prod-giftcard-15p-matte",
    name: "Sổ Thẻ Gift Card Book (15 trang - Bìa Mờ)",
    code: "GCB-15P-MATTE",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 15 trang + 2 bìa",
      itemsPerSheet: 0.22,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 4, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 8, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán mờ nhiệt 28mic 33×48cm", qty: 0.5, unit: "Tờ", price: 859 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.03, production: 0.2, qc: 0.06 },
    electricity: { power: 2.5, runTime: 0.25 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 450,
      actualSales: 400,
      currentStock: 40,
      safetyStock: 90
    }
  },
  {
    id: "prod-giftcard-15p-holo",
    name: "Sổ Thẻ Gift Card Book (15 trang - Bìa Hologram)",
    code: "GCB-15P-HOLO",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 15 trang + 2 bìa",
      itemsPerSheet: 0.22,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 4, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 8, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán 7 màu Hologram 33×48cm", qty: 0.5, unit: "Tờ", price: 21975 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.03, production: 0.2, qc: 0.06 },
    electricity: { power: 2.5, runTime: 0.25 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 500,
      actualSales: 460,
      currentStock: 50,
      safetyStock: 100
    }
  },
  {
    id: "prod-giftcard-20p-matte",
    name: "Sổ Thẻ Gift Card Book (20 trang - Bìa Mờ)",
    code: "GCB-20P-MATTE",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 20 trang + 2 bìa",
      itemsPerSheet: 0.18,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 5, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 10, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán mờ nhiệt 28mic 33×48cm", qty: 0.5, unit: "Tờ", price: 859 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.04, production: 0.22, qc: 0.07 },
    electricity: { power: 2.5, runTime: 0.28 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 350,
      actualSales: 320,
      currentStock: 30,
      safetyStock: 70
    }
  },
  {
    id: "prod-giftcard-20p-holo",
    name: "Sổ Thẻ Quà Tặng Gift Card Book (20 trang - Bìa Hologram)",
    code: "GCB-20P-HOLO",
    category: "Sổ thẻ (Gift Card Book)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "gift-card-book",
      sheetSize: "33x48cm",
      itemSize: "Sổ 20 trang + 2 bìa",
      itemsPerSheet: 0.18,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy Couche 300gsm (C300) 33×48cm", qty: 5, unit: "Tờ", price: 1084 },
      { name: "In Konica ruột (1 mặt) - Click", qty: 10, unit: "Click", price: 700 },
      { name: "Giấy Ivory 300gsm 33×48cm (Bìa/Hộp)", qty: 0.5, unit: "Tờ", price: 1264 },
      { name: "In Konica bìa (1 mặt) - Click", qty: 0.5, unit: "Click", price: 1400 },
      { name: "Màng cán 7 màu Hologram 33×48cm", qty: 0.5, unit: "Tờ", price: 21975 },
      { name: "Lò xo kẽm đóng sổ Gift Card Book", qty: 1, unit: "Cái", price: 2300 },
      { name: "Băng keo chấm tròn 2 mặt", qty: 1, unit: "Dải", price: 2000 }
    ],
    labor: { designer: 0.04, production: 0.22, qc: 0.07 },
    electricity: { power: 2.5, runTime: 0.28 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 400,
      actualSales: 380,
      currentStock: 40,
      safetyStock: 80
    }
  },
  {
    id: "prod-3",
    name: "Bộ bài Uno Cards (Hộp giấy gộp)",
    code: "PLC-UNO-01",
    category: "Bài in (Uno Cards)",
    factoryType: "In",
    layout: {
      preset: "playing-cards",
      sheetSize: "A3 (29.7x42cm)",
      itemSize: "Bài Uno Cards",
      itemsPerSheet: 0.142857,
      unitType: "Tờ"
    },
    materials: [
      { name: "Giấy C300gsm A3 (Thẻ + Hộp)", qty: 7, unit: "Tờ", price: 900 },
      { name: "In Konica (2 mặt) - Click", qty: 28, unit: "Click", price: 600 },
      { name: "Cán màng MỜ (OPAM)", qty: 14, unit: "Lần", price: 1008 }
    ],
    labor: { designer: 0.03, production: 0.25, qc: 0.08 },
    electricity: { power: 2.5, runTime: 0.35 },
    overheadPercentage: 10,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 2,
    forecast: {
      salesForecast: 800,
      actualSales: 750,
      currentStock: 150,
      safetyStock: 150
    }
  },
  {
    id: "prod-scard-01",
    name: "Skin Card (Miếng dán thẻ ATM / Ngân hàng - Chưa cấu hình chi phí)",
    code: "SCARD-01",
    category: "Bài in & Cards (Playing / Uno)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "33x48cm",
      itemSize: "8.5 x 5.4cm (Thẻ ATM)",
      itemsPerSheet: 24,
      unitType: "Tờ"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-graphtec-ce8000-60",
    paybackMachineQty: 0.041667,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-sticker-01",
    name: "Sticker Decal Tiêu Chuẩn (Chưa cấu hình chi phí)",
    code: "STICKER-01",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "Tùy chỉnh",
      itemSize: "Theo yêu cầu",
      itemsPerSheet: 1,
      unitType: "Cái"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-cat-be-5",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-st-sua-33x48",
    name: "Sticker Decal Sữa Mờ (Fasson 33×48cm)",
    code: "STICKER-SUA-33x48",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-33x48",
      sheetSize: "33x48cm",
      itemSize: "2.0 inch",
      itemsPerSheet: 40,
      unitType: "Tờ"
    },
    materials: [
      { name: "Decal sữa mờ Fasson 33×48cm", qty: 0.025, unit: "Tờ", price: 1571 },
      { name: "Click in màu Konica Minolta (A3/33×48)", qty: 0.025, unit: "Click", price: 700 }
    ],
    labor: { designer: 0.005, production: 0.03, qc: 0.01 },
    electricity: { power: 1.5, runTime: 0.05 },
    overheadPercentage: 5,
    paybackMachineId: "mach-konica",
    paybackMachineQty: 0.025,
    forecast: {
      salesForecast: 5000,
      actualSales: 4800,
      currentStock: 1200,
      safetyStock: 1500
    }
  },
  {
    id: "prod-csticker-01",
    name: "Custom Sticker (Nhãn dán theo yêu cầu - Chưa cấu hình chi phí)",
    code: "CSTICKER-01",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "Tùy chỉnh",
      itemSize: "Theo yêu cầu",
      itemsPerSheet: 1,
      unitType: "Cái"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-roland-lg-640",
    paybackMachineQty: 0.003289,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-st-cuon-vang-122",
    name: "Sticker Decal Vàng Bóng (Cuộn 1.22×1m)",
    code: "CSTICKER-VANG-122",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-cuon-120",
      sheetSize: "1.22 x 1m",
      itemSize: "2.0 inch",
      itemsPerSheet: 304,
      unitType: "Mét"
    },
    materials: [
      { name: "Decal vàng bóng cuộn (1.22×1m)", qty: 0.003289, unit: "Mét", price: 35990 },
      { name: "Mực in phun Decal cuộn khổ lớn (Mực dầu/Eco-Solvent)", qty: 0.003289, unit: "Mét", price: 12000 }
    ],
    labor: { designer: 0.005, production: 0.04, qc: 0.015 },
    electricity: { power: 2.2, runTime: 0.08 },
    overheadPercentage: 6,
    paybackMachineId: "mach-roland-lg-640",
    paybackMachineQty: 0.003289,
    forecast: {
      salesForecast: 2500,
      actualSales: 2200,
      currentStock: 300,
      safetyStock: 600
    }
  },
  {
    id: "prod-st-cuon-holo-127",
    name: "Sticker Decal Hologram Tia Laser (Cuộn 1.27×1m)",
    code: "CSTICKER-HOLO-127",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-cuon-127",
      sheetSize: "1.27 x 1m",
      itemSize: "2.0 inch",
      itemsPerSheet: 304,
      unitType: "Mét"
    },
    materials: [
      { name: "Decal hologram tia laser cuộn (1.27×1m)", qty: 0.003289, unit: "Mét", price: 54610 },
      { name: "Mực in phun Decal cuộn khổ lớn (Mực dầu/Eco-Solvent)", qty: 0.003289, unit: "Mét", price: 12000 }
    ],
    labor: { designer: 0.005, production: 0.04, qc: 0.015 },
    electricity: { power: 2.2, runTime: 0.08 },
    overheadPercentage: 6,
    paybackMachineId: "mach-roland-lg-640",
    paybackMachineQty: 0.003289,
    forecast: {
      salesForecast: 3000,
      actualSales: 2700,
      currentStock: 350,
      safetyStock: 700
    }
  },
  {
    id: "prod-clear-csticker-01",
    name: "Clear Sticker Decal Trong Tùy Chỉnh (Chưa cấu hình chi phí)",
    code: "CLEAR-CSTICKER-01",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "Tùy chỉnh",
      itemSize: "Theo yêu cầu",
      itemsPerSheet: 1,
      unitType: "Cái"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-graphtec-fc9000",
    paybackMachineQty: 0.025,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-st-trong-33x48",
    name: "Sticker Decal Trong (Clear) (Fasson 33×48cm)",
    code: "CLEAR-CSTICKER-33x48",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-33x48",
      sheetSize: "33x48cm",
      itemSize: "2.0 inch",
      itemsPerSheet: 40,
      unitType: "Tờ"
    },
    materials: [
      { name: "Decal trong suốt Fasson 33×48cm", qty: 0.025, unit: "Tờ", price: 1600 },
      { name: "Click in màu Konica Minolta (A3/33×48)", qty: 0.025, unit: "Click", price: 700 }
    ],
    labor: { designer: 0.005, production: 0.03, qc: 0.01 },
    electricity: { power: 1.5, runTime: 0.05 },
    overheadPercentage: 5,
    paybackMachineId: "mach-graphtec-fc9000",
    paybackMachineQty: 0.025,
    forecast: {
      salesForecast: 3500,
      actualSales: 3200,
      currentStock: 600,
      safetyStock: 1000
    }
  },
  {
    id: "prod-st-cuon-trong-127",
    name: "Sticker Decal Siêu Trong Suốt Mực Dầu (Cuộn 1.27×1m)",
    code: "CLEAR-CSTICKER-CUON-127",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-cuon-127",
      sheetSize: "1.27 x 1m",
      itemSize: "2.0 inch",
      itemsPerSheet: 304,
      unitType: "Mét"
    },
    materials: [
      { name: "Decal siêu trong suốt mực dầu cuộn (1.27×1m)", qty: 0.003289, unit: "Mét", price: 37211 },
      { name: "Mực in phun Decal cuộn khổ lớn (Mực dầu/Eco-Solvent)", qty: 0.003289, unit: "Mét", price: 12000 }
    ],
    labor: { designer: 0.005, production: 0.04, qc: 0.015 },
    electricity: { power: 2.2, runTime: 0.08 },
    overheadPercentage: 6,
    paybackMachineId: "mach-dlican",
    paybackMachineQty: 0.003289,
    forecast: {
      salesForecast: 4000,
      actualSales: 3700,
      currentStock: 500,
      safetyStock: 1000
    }
  },
  {
    id: "prod-st-cuon-proton-127",
    name: "Sticker Decal Proton Trong Cán Màng (Cuộn 1.27×1m)",
    code: "CLEAR-CSTICKER-PROTON-127",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-cuon-127",
      sheetSize: "1.27 x 1m",
      itemSize: "2.0 inch",
      itemsPerSheet: 304,
      unitType: "Mét"
    },
    materials: [
      { name: "Decal proton trong cuộn (1.27×1m)", qty: 0.003289, unit: "Mét", price: 35180 },
      { name: "Màng cán tem Sunrise bóng/mờ cuộn (1.2×1m)", qty: 0.003289, unit: "Mét", price: 31250 },
      { name: "Mực in phun Decal cuộn khổ lớn (Mực dầu/Eco-Solvent)", qty: 0.003289, unit: "Mét", price: 12000 }
    ],
    labor: { designer: 0.005, production: 0.05, qc: 0.015 },
    electricity: { power: 2.4, runTime: 0.09 },
    overheadPercentage: 6,
    paybackMachineId: "mach-dlican",
    paybackMachineQty: 0.003289,
    forecast: {
      salesForecast: 3000,
      actualSales: 2800,
      currentStock: 400,
      safetyStock: 800
    }
  },
  {
    id: "prod-6",
    name: "Sticker UV-DTF (Màng A + B - Khổ 0.62×1m)",
    code: "UV-CSTICKER-01",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "uv-dtf-roll",
      sheetSize: "0.62 x 1m",
      itemSize: "2.0 inch",
      itemsPerSheet: 84,
      unitType: "Mét"
    },
    materials: [
      { name: "Màng A in UV-DTF (Cuộn khổ 0.62m)", qty: 0.011905, unit: "Mét", price: 40000 },
      { name: "Màng B định hình UV-DTF (Cuộn 0.62m)", qty: 0.011905, unit: "Mét", price: 15000 },
      { name: "Mực in UV cuộn (CMYK + W + Varnish)", qty: 0.011905, unit: "Mét", price: 25000 }
    ],
    labor: { designer: 0.01, production: 0.08, qc: 0.02 },
    electricity: { power: 3.0, runTime: 0.12 },
    overheadPercentage: 8,
    paybackMachineId: "mach-uvdtf-grando",
    paybackMachineQty: 0.011905,
    forecast: {
      salesForecast: 2000,
      actualSales: 1850,
      currentStock: 100,
      safetyStock: 300
    }
  },
  {
    id: "prod-uv-csticker-02",
    name: "UV DTF Sticker Tùy Chỉnh (Chưa cấu hình chi phí)",
    code: "UV-CSTICKER-02",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "0.62 x 1m",
      itemSize: "Theo yêu cầu",
      itemsPerSheet: 1,
      unitType: "Mét"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-uvdtf-grando",
    paybackMachineQty: 0.011905,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-st-kraft-33x35",
    name: "Sticker Decal Kraft (ThaiKK 33×35.4cm)",
    code: "KRAFT-CSTICKER-01",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-33x35",
      sheetSize: "33x35.4cm",
      itemSize: "2.0 inch",
      itemsPerSheet: 30,
      unitType: "Tờ"
    },
    materials: [
      { name: "Decal Kraft nâu da bò 33×35.4cm", qty: 0.033333, unit: "Tờ", price: 1800 },
      { name: "Click in màu Konica Minolta (A3/33×48)", qty: 0.033333, unit: "Click", price: 700 }
    ],
    labor: { designer: 0.005, production: 0.03, qc: 0.01 },
    electricity: { power: 1.5, runTime: 0.05 },
    overheadPercentage: 5,
    paybackMachineId: "mach-graphtec-ce8000-130",
    paybackMachineQty: 0.033333,
    forecast: {
      salesForecast: 2000,
      actualSales: 1800,
      currentStock: 300,
      safetyStock: 500
    }
  },
  {
    id: "prod-kraft-csticker-02",
    name: "Custom Kraft Sticker Cuộn / Tùy Chỉnh (Chưa cấu hình chi phí)",
    code: "KRAFT-CSTICKER-02",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "Tùy chỉnh",
      itemSize: "Theo yêu cầu",
      itemsPerSheet: 1,
      unitType: "Cái"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-graphtec-ce8000-130",
    paybackMachineQty: 0.033333,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-st-bac-33x35",
    name: "Sticker Decal Bạc Bóng (ThaiKK 33×35.4cm)",
    code: "SILVER-CSTICKER-01",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-33x35",
      sheetSize: "33x35.4cm",
      itemSize: "2.0 inch",
      itemsPerSheet: 30,
      unitType: "Tờ"
    },
    materials: [
      { name: "Decal bạc xé không rách 33×35.4cm", qty: 0.033333, unit: "Tờ", price: 2200 },
      { name: "Click in màu Konica Minolta (A3/33×48)", qty: 0.033333, unit: "Click", price: 700 }
    ],
    labor: { designer: 0.005, production: 0.035, qc: 0.012 },
    electricity: { power: 1.5, runTime: 0.05 },
    overheadPercentage: 5,
    paybackMachineId: "mach-graphtec-ce8000-40",
    paybackMachineQty: 0.033333,
    forecast: {
      salesForecast: 2500,
      actualSales: 2300,
      currentStock: 400,
      safetyStock: 600
    }
  },
  {
    id: "prod-st-cuon-bac-127",
    name: "Sticker Decal Bạc Bóng (Cuộn 1.27×1m)",
    code: "SILVER-CSTICKER-CUON-127",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-cuon-127",
      sheetSize: "1.27 x 1m",
      itemSize: "2.0 inch",
      itemsPerSheet: 304,
      unitType: "Mét"
    },
    materials: [
      { name: "Decal bạc bóng cuộn (1.27×1m)", qty: 0.003289, unit: "Mét", price: 54610 },
      { name: "Mực in phun Decal cuộn khổ lớn (Mực dầu/Eco-Solvent)", qty: 0.003289, unit: "Mét", price: 12000 }
    ],
    labor: { designer: 0.005, production: 0.04, qc: 0.015 },
    electricity: { power: 2.2, runTime: 0.08 },
    overheadPercentage: 6,
    paybackMachineId: "mach-roland-vg3-640",
    paybackMachineQty: 0.003289,
    forecast: {
      salesForecast: 3000,
      actualSales: 2800,
      currentStock: 400,
      safetyStock: 800
    }
  },
  {
    id: "prod-silver-csticker-02",
    name: "Custom Silver Sticker Tùy Chỉnh (Chưa cấu hình chi phí)",
    code: "SILVER-CSTICKER-02",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    profitPercentage: 20,
    layout: {
      preset: "custom",
      sheetSize: "Tùy chỉnh",
      itemSize: "Theo yêu cầu",
      itemsPerSheet: 1,
      unitType: "Cái"
    },
    materials: [],
    labor: { designer: 0, production: 0, qc: 0 },
    electricity: { power: 0, runTime: 0 },
    overheadPercentage: 0,
    paybackMachineId: "mach-graphtec-ce8000-40",
    paybackMachineQty: 0.033333,
    forecast: {
      salesForecast: 0,
      actualSales: 0,
      currentStock: 0,
      safetyStock: 0
    }
  },
  {
    id: "prod-st-cuon-mccal-120",
    name: "Sticker Decal Mccal Trắng Sữa Cán Màng (Cuộn 1.2×1m)",
    code: "STICKER-MCCAL-120",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    layout: {
      preset: "decal-cuon-120",
      sheetSize: "1.2 x 1m",
      itemSize: "2.0 inch",
      itemsPerSheet: 304,
      unitType: "Mét"
    },
    materials: [
      { name: "Decal mccal trắng sữa cuộn (1.2×1m)", qty: 0.003289, unit: "Mét", price: 39610 },
      { name: "Màng cán tem Sunrise bóng/mờ cuộn (1.2×1m)", qty: 0.003289, unit: "Mét", price: 31250 },
      { name: "Mực in phun Decal cuộn khổ lớn (Mực dầu/Eco-Solvent)", qty: 0.003289, unit: "Mét", price: 12000 }
    ],
    labor: { designer: 0.005, production: 0.05, qc: 0.015 },
    electricity: { power: 2.4, runTime: 0.09 },
    overheadPercentage: 6,
    paybackMachineId: "mach-roland-vg3-640",
    paybackMachineQty: 0.003289,
    forecast: {
      salesForecast: 4500,
      actualSales: 4100,
      currentStock: 800,
      safetyStock: 1200
    }
  },
  {
    id: "prod-7",
    name: "Áo hoodie thêu nổi chữ kí Signature",
    code: "HD-EMB-01",
    category: "Thời trang đông xuân",
    factoryType: "Thêu",
    materials: [
      { name: "Phôi áo hoodie nỉ bông 380gsm", qty: 1, unit: "Cái", price: 110000 },
      { name: "Chỉ thêu polyester màu (cuộn nhỏ)", qty: 0.35, unit: "Cuộn", price: 15000 },
      { name: "Dựng giấy lót thêu & vải lót xé", qty: 0.2, unit: "m2", price: 20000 }
    ],
    labor: { designer: 0.05, laser: 0.02, production: 0.3, qc: 0.08 },
    electricity: { power: 1.8, runTime: 0.3 },
    overheadPercentage: 12,
    paybackMachineId: "mach-bai-mirror",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 600,
      actualSales: 580,
      currentStock: 80,
      safetyStock: 150
    }
  },
  {
    id: "prod-8",
    name: "Mũ lưỡi trai Classic thêu logo 3D",
    code: "CAP-EMB-02",
    category: "Phụ kiện thời trang",
    factoryType: "Thêu",
    materials: [
      { name: "Phôi nón kaki trơn đứng form", qty: 1, unit: "Cái", price: 28000 },
      { name: "Form xốp lót thêu 3D (dày 3mm)", qty: 0.05, unit: "m2", price: 35000 },
      { name: "Chỉ thêu metal ánh kim cao cấp", qty: 0.2, unit: "Cuộn", price: 25000 }
    ],
    labor: { designer: 0.03, laser: 0.01, production: 0.2, qc: 0.06 },
    electricity: { power: 1.2, runTime: 0.18 },
    overheadPercentage: 8,
    paybackMachineId: "mach-bai-vision",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 1500,
      actualSales: 1420,
      currentStock: 450,
      safetyStock: 350
    }
  },
  {
    id: "prod-3d-bambu-a1",
    name: "Mô hình in 3D Bambu Lab A1 (FDM đa màu - Mẫu)",
    code: "3D-BAMBU-A1",
    category: "In 3D (3D Printing)",
    factoryType: "In 3D",
    profitPercentage: 25,
    layout: {
      preset: "custom",
      sheetSize: "Khay 256x256mm",
      itemSize: "Mô hình decor",
      itemsPerSheet: 1,
      unitType: "Cái"
    },
    materials: [
      { name: "Cuộn nhựa in 3D PLA Basic Bambu (1kg)", qty: 0.1, unit: "Cuộn", price: 350000 }
    ],
    labor: { designer: 0.05, production: 0.1, qc: 0.03 },
    electricity: { power: 0.35, runTime: 2.5 },
    overheadPercentage: 10,
    paybackMachineId: "mach-bambu-a1",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 500,
      actualSales: 450,
      currentStock: 50,
      safetyStock: 100
    }
  },
  {
    id: "prod-3d-bambu-h2c",
    name: "Chi tiết kỹ thuật in 3D Bambu Lab H2C (Chính xác cao - Mẫu)",
    code: "3D-BAMBU-H2C",
    category: "In 3D (3D Printing)",
    factoryType: "In 3D",
    profitPercentage: 25,
    layout: {
      preset: "custom",
      sheetSize: "Khay 256x256mm",
      itemSize: "Chi tiết cơ khí",
      itemsPerSheet: 1,
      unitType: "Cái"
    },
    materials: [
      { name: "Cuộn nhựa kỹ thuật PETG/ABS Bambu (1kg)", qty: 0.15, unit: "Cuộn", price: 450000 }
    ],
    labor: { designer: 0.08, production: 0.15, qc: 0.05 },
    electricity: { power: 0.5, runTime: 3.5 },
    overheadPercentage: 10,
    paybackMachineId: "mach-bambu-h2c",
    paybackMachineQty: 1,
    forecast: {
      salesForecast: 300,
      actualSales: 280,
      currentStock: 30,
      safetyStock: 60
    }
  }
];

class AppStateManager {
  constructor() {
    this.settings = this.loadSettings();
    this.products = this.loadProducts();
    this.activeTab = "dashboard";
    this.selectedProductId = null;
    this.orderCostState = {
      rawRows: [],
      filterPrefix: "all",
      filterStatus: "all",
      searchQuery: "",
      viewMode: "order"
    };
    this.capexState = {
      filterCategory: "all",
      searchQuery: ""
    };
    
    const savedUrl = localStorage.getItem("factory_sheet_url_v2");
    if (savedUrl === "none") {
      this.googleSheetUrl = "";
    } else {
      this.googleSheetUrl = savedUrl || DEFAULT_GOOGLE_SHEET_URL;
    }
  }

  loadSettings() {
    const saved = localStorage.getItem("factory_settings_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Migrate HR settings: if hrVersion is outdated, overwrite with official T9 breakdown
        let migratedHr;
        if (!parsed.hrVersion || parsed.hrVersion !== DEFAULT_SETTINGS.hrVersion) {
          migratedHr = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.hr));
          parsed.hrVersion = DEFAULT_SETTINGS.hrVersion;
        } else {
          const migrateHrDepartment = (dept, deptKey, defaultDeptList) => {
            if (!dept || !dept[deptKey]) return defaultDeptList;
            const data = dept[deptKey];
            if (Array.isArray(data)) {
              const isPlaceholder = data.length > 0 && data.some(emp => emp.name && (emp.name.startsWith("Nhân viên In -") || emp.name.startsWith("Nhân viên Thêu -")));
              if (isPlaceholder) return defaultDeptList;
              return data;
            }
            return defaultDeptList;
          };

          migratedHr = {
            In: {
              designer: migrateHrDepartment(parsed.hr?.In, 'designer', DEFAULT_SETTINGS.hr.In.designer),
              production: migrateHrDepartment(parsed.hr?.In, 'production', DEFAULT_SETTINGS.hr.In.production),
              qc: migrateHrDepartment(parsed.hr?.In, 'qc', DEFAULT_SETTINGS.hr.In.qc)
            },
            Thêu: {
              designer: migrateHrDepartment(parsed.hr?.Thêu, 'designer', DEFAULT_SETTINGS.hr.Thêu.designer),
              laser: migrateHrDepartment(parsed.hr?.Thêu, 'laser', DEFAULT_SETTINGS.hr.Thêu.laser),
              production: migrateHrDepartment(parsed.hr?.Thêu, 'production', DEFAULT_SETTINGS.hr.Thêu.production),
              qc: migrateHrDepartment(parsed.hr?.Thêu, 'qc', DEFAULT_SETTINGS.hr.Thêu.qc)
            }
          };
        }

        let mergedMachines = [];
        if (!parsed.machinesVersion || parsed.machinesVersion !== DEFAULT_SETTINGS.machinesVersion) {
          // Bảo lưu toàn bộ máy móc do người dùng tự tạo thêm (không có trong 74 máy mặc định)
          const customMachines = Array.isArray(parsed.machines)
            ? parsed.machines.filter(m => !DEFAULT_SETTINGS.machines.some(dm => dm.id === m.id))
            : [];
          mergedMachines = [
            ...JSON.parse(JSON.stringify(DEFAULT_SETTINGS.machines)),
            ...customMachines
          ];
          parsed.machinesVersion = DEFAULT_SETTINGS.machinesVersion;
        } else if (Array.isArray(parsed.machines)) {
          mergedMachines = parsed.machines.map(m => ({
            paybackYears: 3,
            discountAfter3Years: 80,
            currentVolume: 0,
            unitType: "Cái",
            ...m
          }));
        } else {
          mergedMachines = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.machines));
        }

        const rawCatalog = parsed.materialsCatalog || [];
        const mergedCatalog = [...rawCatalog];
        DEFAULT_SETTINGS.materialsCatalog.forEach(defMat => {
          const existingIdx = mergedCatalog.findIndex(m => m.id === defMat.id || m.name.toLowerCase() === defMat.name.toLowerCase());
          if (existingIdx === -1) {
            mergedCatalog.push(defMat);
          } else {
            // Update to latest standard price if it was an older default
            if (defMat.defaultPrice && !mergedCatalog[existingIdx].customized) {
              mergedCatalog[existingIdx].defaultPrice = defMat.defaultPrice;
            }
          }
        });

        const mergedMonthlyRecords = {
          ...DEFAULT_SETTINGS.monthlyRecords,
          ...(parsed.monthlyRecords || {})
        };

        // Khởi tạo và bảo lưu danh sách người dùng (Users)
        let mergedUsers = parsed.users && Array.isArray(parsed.users) && parsed.users.length > 0
          ? parsed.users
          : JSON.parse(JSON.stringify(DEFAULT_SETTINGS.users));
        
        let adminUser = mergedUsers.find(u => u.username === "admin" || u.id === "usr_admin");
        if (!adminUser) {
          adminUser = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.users[0]));
          mergedUsers.unshift(adminUser);
        }
        if (parsed.passcode && adminUser) {
          adminUser.passcode = parsed.passcode;
        }

        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          machinesVersion: DEFAULT_SETTINGS.machinesVersion,
          monthlyRecords: mergedMonthlyRecords,
          hr: migratedHr,
          machines: mergedMachines,
          materialsCatalog: mergedCatalog,
          users: mergedUsers
        };
      } catch (e) { 
        console.error("Error parsing settings", e); 
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  saveSettings(newSettings) {
    this.settings = { ...newSettings };
    localStorage.setItem("factory_settings_v2", JSON.stringify(this.settings));
    this.syncToCloud();
  }

  loadProducts() {
    const processProduct = p => {
      if (p.labor && (p.labor.designer === undefined || p.labor.production === undefined || p.labor.qc === undefined)) {
        const mockMatch = MOCK_PRODUCTS.find(mp => mp.id === p.id || mp.code === p.code);
        if (mockMatch) {
          p.labor = { ...mockMatch.labor };
        } else if (p.factoryType === "In") {
          p.labor = { designer: 0.02, production: 0.15, qc: 0.05 };
        } else {
          p.labor = { designer: 0.03, laser: 0.01, production: 0.2, qc: 0.06 };
        }
      }
      if (!p.paybackMachines || !Array.isArray(p.paybackMachines)) {
        if (p.paybackMachineId) {
          p.paybackMachines = [{ machineId: p.paybackMachineId, qty: p.paybackMachineQty !== undefined ? p.paybackMachineQty : 1 }];
        } else {
          const mockMatch = MOCK_PRODUCTS.find(mp => mp.id === p.id || mp.code === p.code);
          if (mockMatch && mockMatch.paybackMachines && Array.isArray(mockMatch.paybackMachines)) {
            p.paybackMachines = JSON.parse(JSON.stringify(mockMatch.paybackMachines));
          } else if (mockMatch && mockMatch.paybackMachineId) {
            p.paybackMachines = [{ machineId: mockMatch.paybackMachineId, qty: mockMatch.paybackMachineQty || 1 }];
          } else {
            p.paybackMachines = [];
          }
        }
      }
      if (!p.paybackMachineId && p.paybackMachines && p.paybackMachines.length > 0) {
        p.paybackMachineId = p.paybackMachines[0].machineId;
        p.paybackMachineQty = p.paybackMachines[0].qty;
      }
      if (!p.layout && (p.factoryType === "In" || p.factoryType === "In 3D")) {
        const mockMatch = MOCK_PRODUCTS.find(mp => mp.id === p.id || mp.code === p.code);
        if (mockMatch && mockMatch.layout) {
          p.layout = { ...mockMatch.layout };
        } else {
          p.layout = {
            preset: "decal-33x48",
            sheetSize: "33x48cm",
            itemSize: "2.0 inch",
            itemsPerSheet: 40,
            unitType: "Tờ"
          };
        }
      }
      if (p.forecast) {
        if (p.forecast.actualSales === undefined) {
          const mockMatch = MOCK_PRODUCTS.find(mp => mp.id === p.id || mp.code === p.code);
          p.forecast.actualSales = mockMatch?.forecast?.actualSales !== undefined ? mockMatch.forecast.actualSales : Math.round((p.forecast.salesForecast || 0) / 1.1);
        }
      }
      return p;
    };

    const getDeletedProductIds = () => {
      try {
        const raw = localStorage.getItem("factory_deleted_product_ids");
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    };
    const deletedIds = getDeletedProductIds();

    const SKU_MIGRATION_MAP = {
      "CALENDAR-A4-01": "CAL-A4-01",
      "PC-PAPER-01": "PLC-01",
      "PC-PLASTIC-02": "PLC-02",
      "UNO-PAPER-01": "PLC-UNO-01",
      "ST-SUA-33x48": "STICKER-SUA-33x48",
      "ST-TRONG-33x48": "CLEAR-CSTICKER-33x48",
      "ST-BAC-33x35": "SILVER-CSTICKER-01",
      "ST-KRAFT-33x35": "KRAFT-CSTICKER-01",
      "ST-CUON-TRONG-127": "CLEAR-CSTICKER-CUON-127",
      "ST-CUON-BAC-127": "SILVER-CSTICKER-CUON-127",
      "ST-CUON-VANG-122": "CSTICKER-VANG-122",
      "ST-CUON-HOLO-127": "CSTICKER-HOLO-127",
      "ST-CUON-MCCAL-120": "STICKER-MCCAL-120",
      "ST-CUON-PROTON-127": "CLEAR-CSTICKER-PROTON-127",
      "ST-UV-DTF-04": "UV-CSTICKER-01"
    };

    const CURRENT_VERSION = "v24.1_update_74_machines_capex";
    const migratedVer = localStorage.getItem("factory_version_migrated");
    if (migratedVer !== CURRENT_VERSION) {
      localStorage.setItem("factory_version_migrated", CURRENT_VERSION);
      let customProducts = [];
      const saved = localStorage.getItem("factory_products_v2");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          customProducts = parsed.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(p.code) && p.id !== 'prod-4' && p.id !== 'prod-5' && !MOCK_PRODUCTS.some(mp => mp.id === p.id || mp.code === p.code || SKU_MIGRATION_MAP[p.code] === mp.code));
          customProducts.forEach(p => {
            if (SKU_MIGRATION_MAP[p.code]) p.code = SKU_MIGRATION_MAP[p.code];
          });
        } catch (e) {}
      }
      const freshProducts = [
        ...JSON.parse(JSON.stringify(MOCK_PRODUCTS)).filter(mp => !deletedIds.includes(mp.id) && !deletedIds.includes(mp.code)),
        ...customProducts
      ];
      localStorage.setItem("factory_products_v2", JSON.stringify(freshProducts));
      return freshProducts.map(processProduct);
    }

    const saved = localStorage.getItem("factory_products_v2");
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Strictly filter out any deleted products
          parsed = parsed.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(p.code));

          // Migrate SKU codes
          parsed.forEach(p => {
            if (SKU_MIGRATION_MAP[p.code]) p.code = SKU_MIGRATION_MAP[p.code];
          });

          // Ensure new mock products are automatically merged ONLY if not deleted
          MOCK_PRODUCTS.forEach(mp => {
            if (deletedIds.includes(mp.id) || deletedIds.includes(mp.code)) {
              return; // Explicitly deleted by user, do not resurrect
            }
            const existingIdx = parsed.findIndex(p => p.id === mp.id || p.code === mp.code || SKU_MIGRATION_MAP[p.code] === mp.code);
            if (existingIdx === -1) {
              parsed.push(JSON.parse(JSON.stringify(mp)));
            } else {
              // Always force synchronize official code & name
              parsed[existingIdx].name = mp.name;
              parsed[existingIdx].code = mp.code;
              parsed[existingIdx].category = mp.category;
              // Chỉ đồng bộ nguyên vật liệu và thông số từ MOCK nếu sản phẩm chưa có
              if (mp.materials && mp.materials.length > 0 && (!parsed[existingIdx].materials || parsed[existingIdx].materials.length === 0)) {
                parsed[existingIdx].materials = JSON.parse(JSON.stringify(mp.materials));
              }
              if (mp.labor && !parsed[existingIdx].labor) parsed[existingIdx].labor = JSON.parse(JSON.stringify(mp.labor));
              if (mp.layout && !parsed[existingIdx].layout) parsed[existingIdx].layout = JSON.parse(JSON.stringify(mp.layout));
              if (!parsed[existingIdx].factoryType) parsed[existingIdx].factoryType = mp.factoryType;
              if (parsed[existingIdx].profitPercentage === undefined && mp.profitPercentage !== undefined) parsed[existingIdx].profitPercentage = mp.profitPercentage;
              if (parsed[existingIdx].overheadPercentage === undefined && mp.overheadPercentage !== undefined) parsed[existingIdx].overheadPercentage = mp.overheadPercentage;

              // BẢO LƯU CẤU HÌNH MÁY MÓC DO NGƯỜI DÙNG ĐÃ LƯU
              const userHasMachines = (parsed[existingIdx].paybackMachines && Array.isArray(parsed[existingIdx].paybackMachines) && parsed[existingIdx].paybackMachines.length > 0) || parsed[existingIdx].paybackMachineId;
              if (!userHasMachines) {
                if (mp.paybackMachines && Array.isArray(mp.paybackMachines)) {
                  parsed[existingIdx].paybackMachines = JSON.parse(JSON.stringify(mp.paybackMachines));
                }
                if (mp.paybackMachineId) {
                  parsed[existingIdx].paybackMachineId = mp.paybackMachineId;
                  parsed[existingIdx].paybackMachineQty = mp.paybackMachineQty;
                }
              }
            }
          });
          localStorage.setItem("factory_products_v2", JSON.stringify(parsed));
          return parsed.map(processProduct);
        }
      } catch (e) {
        console.error("Error parsing products", e);
      }
    }
    return JSON.parse(JSON.stringify(MOCK_PRODUCTS)).filter(mp => !deletedIds.includes(mp.id) && !deletedIds.includes(mp.code)).map(processProduct);
  }

  saveProducts() {
    localStorage.setItem("factory_products_v2", JSON.stringify(this.products));
    this.syncToCloud();
  }

  async syncFromCloud(force = false) {
    if (!this.googleSheetUrl) return false;
    try {
      updateCloudStatus("syncing");
      const res = await fetch(this.googleSheetUrl);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      
      if (data && data.products && data.settings) {
        // Sync deleted products blacklist from cloud
        if (Array.isArray(data.deletedProductIds)) {
          try {
            const raw = localStorage.getItem("factory_deleted_product_ids");
            const localDeleted = raw ? JSON.parse(raw) : [];
            data.deletedProductIds.forEach(id => {
              if (!localDeleted.includes(id)) localDeleted.push(id);
            });
            localStorage.setItem("factory_deleted_product_ids", JSON.stringify(localDeleted));
          } catch (e) {}
        }

        // Nếu không ép buộc (force = false) và máy hiện tại đã có dữ liệu hợp lệ: KHÔNG tự ý ghi đè
        if (!force && this.products && this.products.length > 0) {
          console.log("Dữ liệu trên máy đang sẵn sàng, không tự động ghi đè từ Google Sheets khi khởi động.");
          updateCloudStatus("synced");
          return true;
        }

        const deletedList = (() => {
          try {
            const raw = localStorage.getItem("factory_deleted_product_ids");
            return raw ? JSON.parse(raw) : [];
          } catch (e) { return []; }
        })();

        this.products = (data.products || []).filter(p => !deletedList.includes(p.id) && !deletedList.includes(p.code));
        this.settings = data.settings;
        localStorage.setItem("factory_settings_v2", JSON.stringify(this.settings));
        localStorage.setItem("factory_products_v2", JSON.stringify(this.products));
        updateCloudStatus("synced");
        return true;
      }
      throw new Error("Invalid data format");
    } catch (e) {
      console.error("Failed to sync from cloud:", e);
      updateCloudStatus("error");
      return false;
    }
  }

  async syncToCloud(showToast = false) {
    if (!this.googleSheetUrl) {
      updateCloudStatus("local");
      return false;
    }
    try {
      updateCloudStatus("syncing");
      const deletedList = (() => {
        try {
          const raw = localStorage.getItem("factory_deleted_product_ids");
          return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
      })();

      const stateData = {
        products: this.products,
        settings: this.settings,
        deletedProductIds: deletedList,
        saved: new Date().toISOString(),
        savedFormatted: new Date().toLocaleString('vi-VN')
      };
      
      await fetch(this.googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(stateData)
      });
      
      updateCloudStatus("synced");
      if (showToast) {
        alert("✅ Đã đẩy toàn bộ dữ liệu từ Web App lên Google Sheets thành công!\n\nNếu bạn đã cập nhật mã Apps Script mới nhất trong Bảng tính, dữ liệu đã được đồng bộ trực tiếp vào các tab: 3_KHAU_HAO_MAY, 2_NHAN_SU_LUONG và 1_CAU_HINH.");
      }
      return true;
    } catch (e) {
      console.error("Failed to sync to cloud:", e);
      updateCloudStatus("error");
      if (showToast) {
        alert("❌ Lỗi: Không thể kết nối để đẩy dữ liệu lên Google Sheets. Vui lòng kiểm tra lại URL hoặc quyền Deploy!");
      }
      return false;
    }
  }

  resetData() {
    localStorage.removeItem("factory_settings_v2");
    localStorage.removeItem("factory_products_v2");
    localStorage.removeItem("factory_deleted_product_ids");
    this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.products = JSON.parse(JSON.stringify(MOCK_PRODUCTS));
    this.selectedProductId = null;
    this.saveSettings(this.settings);
    this.saveProducts();
  }
}

const state = new AppStateManager();

// ==========================================================================
// 2. Calculations Helpers & Formulas
// ==========================================================================

/**
 * Định dạng tiền tệ VND
 */
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(value)
    .replace('₫', '')
    .trim() + ' ₫';
}

/**
 * Chuyển đổi chuỗi tiền tệ (ví dụ "50.000") sang số nguyên
 */
function parseCurrencyInput(value) {
  if (typeof value === 'number') return value;
  const clean = String(value).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/**
 * Cập nhật giao diện trạng thái đồng bộ hóa đám mây
 */
function updateCloudStatus(status) {
  const statusEl = document.getElementById("cloud-sync-status");
  if (!statusEl) return;
  
  const dot = statusEl.querySelector(".status-dot");
  const label = statusEl.querySelector("span:not(.status-dot)");
  
  if (status === "synced") {
    statusEl.style.color = "#34d399";
    statusEl.style.backgroundColor = "rgba(52,211,153,0.1)";
    statusEl.style.borderColor = "rgba(52,211,153,0.2)";
    if (dot) dot.style.backgroundColor = "#34d399";
    if (label) label.textContent = "Google Sheets";
  } else if (status === "syncing") {
    statusEl.style.color = "#f59e0b";
    statusEl.style.backgroundColor = "rgba(245,158,11,0.1)";
    statusEl.style.borderColor = "rgba(245,158,11,0.2)";
    if (dot) dot.style.backgroundColor = "#f59e0b";
    if (label) label.textContent = "Đang đồng bộ...";
  } else if (status === "error") {
    statusEl.style.color = "#f87171";
    statusEl.style.backgroundColor = "rgba(248,113,113,0.1)";
    statusEl.style.borderColor = "rgba(248,113,113,0.2)";
    if (dot) dot.style.backgroundColor = "#f87171";
    if (label) label.textContent = "Lỗi kết nối";
  } else {
    statusEl.style.color = "var(--text-secondary)";
    statusEl.style.backgroundColor = "rgba(255,255,255,0.04)";
    statusEl.style.borderColor = "rgba(255,255,255,0.08)";
    if (dot) dot.style.backgroundColor = "var(--text-secondary)";
    if (label) label.textContent = "Ngoại tuyến (Local)";
  }
}

/**
 * Tính toán đơn giá lương theo giờ của một bộ phận dựa trên danh sách nhân sự
 */
function getDepartmentHourlyRate(departmentEmployees, standardHours) {
  if (!departmentEmployees || !Array.isArray(departmentEmployees) || departmentEmployees.length === 0) {
    return 0;
  }
  const totalSalaries = departmentEmployees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
  return totalSalaries / (departmentEmployees.length * standardHours);
}

/**
 * Tính toán đơn giá điện năng phân bổ cho từng nhà máy dựa trên tổng tiền điện và sản lượng dự báo
 */
function getElectricityRateForFactory(factoryType, settings, products) {
  const budget = factoryType === "In" 
    ? (settings.monthlyElectricity?.In || 0) 
    : (settings.monthlyElectricity?.Thêu || 0);

  if (budget <= 0) {
    return settings.electricityPrice || 3000;
  }

  let totalKwh = 0;
  const productArray = products || (typeof state !== 'undefined' ? state.products : []);
  
  if (productArray && Array.isArray(productArray)) {
    productArray.forEach(p => {
      if (p.factoryType === factoryType) {
        const sales = p.forecast ? (p.forecast.salesForecast || 0) : 0;
        const power = p.electricity ? (p.electricity.power || 0) : 0;
        const runTime = p.electricity ? (p.electricity.runTime || 0) : 0;
        totalKwh += sales * power * runTime;
      }
    });
  }

  if (totalKwh <= 0) {
    return settings.electricityPrice || 3000; // Fallback
  }

  return budget / totalKwh;
}

/**
 * Tính toán chi tiết giá vốn của một sản phẩm
 */
function calculateProductCost(product, settings) {
  // 1. Nguyên vật liệu trực tiếp (Direct Materials)
  const materialsCost = (product.materials || []).reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);

  // 2. Nhân công trực tiếp (Direct Labor)
  let laborCost = 0;
  const stdHours = settings.standardHours || 208;
  const factoryType = product.factoryType;

  let designerCost = 0;
  let productionCost = 0;
  let qcCost = 0;
  let laserCost = 0;

  if (factoryType === "In" || factoryType === "In 3D") {
    const desHourly = getDepartmentHourlyRate(settings.hr?.In?.designer, stdHours);
    const prodHourly = getDepartmentHourlyRate(settings.hr?.In?.production, stdHours);
    const qcHourly = getDepartmentHourlyRate(settings.hr?.In?.qc, stdHours);

    designerCost = (product.labor?.designer || 0) * desHourly;
    productionCost = (product.labor?.production || 0) * prodHourly;
    qcCost = (product.labor?.qc || 0) * qcHourly;

    laborCost = designerCost + productionCost + qcCost;
  } else {
    const desHourly = getDepartmentHourlyRate(settings.hr.Thêu.designer, stdHours);
    const laserHourly = getDepartmentHourlyRate(settings.hr.Thêu.laser, stdHours);
    const prodHourly = getDepartmentHourlyRate(settings.hr.Thêu.production, stdHours);
    const qcHourly = getDepartmentHourlyRate(settings.hr.Thêu.qc, stdHours);

    designerCost = (product.labor?.designer || 0) * desHourly;
    laserCost = (product.labor?.laser || 0) * laserHourly;
    productionCost = (product.labor?.production || 0) * prodHourly;
    qcCost = (product.labor?.qc || 0) * qcHourly;

    laborCost = designerCost + laserCost + productionCost + qcCost;
  }

  // 3. Biến phí (Variable Cost = NVL + Nhân công)
  // Điện năng trực tiếp trên từng sản phẩm được bỏ qua (0₫) vì chưa có công suất thực tế
  const electricityCost = 0;
  const variableCost = Math.round(materialsCost + laborCost);

  // 4. Chi phí quản lý chung phân bổ (Overheads - Định phí phân bổ theo % Biến phí)
  const overheadPercentage = product.overheadPercentage !== undefined ? product.overheadPercentage : (settings.defaultOverhead || 10);
  const overheadCost = Math.round(variableCost * (overheadPercentage / 100));

  // 5. Giá vốn cơ bản (Base Cost tiêu chuẩn khi không trích khấu hao máy)
  const baseCost = variableCost + overheadCost;

  // 6. Biên lợi nhuận đề xuất cho Seller (%)
  const profitPercentage = product.profitPercentage !== undefined ? product.profitPercentage : (settings.defaultProfitMargin !== undefined ? settings.defaultProfitMargin : 20);
  const sellerPrice = Math.round(baseCost * (1 + profitPercentage / 100));

  // 7. Khấu hao máy móc 2 giai đoạn (3 năm đầu & Sau 3 năm) - Hỗ trợ phân bổ nhiều máy
  let paybackSurchargeFirst3Years = 0;
  let paybackSurchargeAfter3Years = 0;
  let machineNames = [];
  let isMachineActive = false;

  const allocatedMachines = (product.paybackMachines && Array.isArray(product.paybackMachines) && product.paybackMachines.length > 0)
    ? product.paybackMachines
    : (product.paybackMachineId ? [{ machineId: product.paybackMachineId, qty: product.paybackMachineQty !== undefined ? product.paybackMachineQty : 1 }] : []);

  if (settings.machines && allocatedMachines.length > 0) {
    allocatedMachines.forEach(pm => {
      if (!pm || !pm.machineId) return;
      const machine = settings.machines.find(m => m.id === pm.machineId);
      if (machine) {
        if (!machineNames.includes(machine.name)) machineNames.push(machine.name);
        const targetVolume = (machine.paybackYears || 3) * (machine.expectedVolumePerYear || 1);
        const unitRate = machine.surchargePerUnit || (machine.investment / targetVolume);
        const machineQty = pm.qty !== undefined ? pm.qty : 1;
        
        const itemFirst3 = Math.round(machineQty * unitRate);
        paybackSurchargeFirst3Years += itemFirst3;
        
        const discountPct = machine.discountAfter3Years !== undefined ? machine.discountAfter3Years : 80;
        paybackSurchargeAfter3Years += Math.round(itemFirst3 * (1 - discountPct / 100));

        if ((machine.currentVolume || 0) < targetVolume) {
          isMachineActive = true;
        }
      }
    });
  }
  const machineName = machineNames.join(", ");

  // Giai đoạn 1 (3 năm đầu - khấu hao cao)
  const paybackBaseCost = baseCost + paybackSurchargeFirst3Years;
  const paybackSellerPrice = Math.round(paybackBaseCost * (1 + profitPercentage / 100));

  // Giai đoạn 2 (Sau 3 năm - khấu hao giảm 80%)
  const postPaybackBaseCost = baseCost + paybackSurchargeAfter3Years;
  const postPaybackSellerPrice = Math.round(postPaybackBaseCost * (1 + profitPercentage / 100));

  // Số dư đảm phí (Contribution Margin = Giá bán - Biến phí)
  const contributionMargin = paybackSellerPrice - variableCost;
  const contributionMarginRatio = paybackSellerPrice > 0 ? Math.round((contributionMargin / paybackSellerPrice) * 100) : 0;

  return {
    materialsCost: Math.round(materialsCost),
    laborCost: Math.round(laborCost),
    variableCost,
    electricityCost: 0,
    overheadCost,
    baseCost,
    sellerPrice,
    paybackSurcharge: paybackSurchargeFirst3Years,
    paybackSurchargeFirst3Years,
    paybackSurchargeAfter3Years,
    paybackBaseCost,
    paybackSellerPrice,
    postPaybackBaseCost,
    postPaybackSellerPrice,
    contributionMargin,
    contributionMarginRatio,
    isMachineActive,
    machineName,
    profitPercentage,
    breakdown: {
      designerCost: Math.round(designerCost),
      laserCost: Math.round(laserCost),
      productionCost: Math.round(productionCost),
      qcCost: Math.round(qcCost)
    }
  };
}

/**
 * Tính toán dự báo mua hàng tháng tới cho sản phẩm
 */
function calculateProductForecast(product, baseCost) {
  const { salesForecast, currentStock, safetyStock } = product.forecast;
  // Cần mua = Dự báo doanh số + Tồn an toàn - Tồn hiện tại
  const neededQty = Math.max(0, salesForecast + safetyStock - currentStock);
  const totalBudget = neededQty * baseCost;

  return {
    neededQty,
    totalBudget
  };
}

// ==========================================================================
// 2.1 SMART SKU PREFIX MATCHING & ORDER COST ENGINE (v24.0)
// ==========================================================================

const PREFIX_DEFINITIONS = [
  { 
    prefix: "CLEAR-CSTICKER", 
    name: "Clear Sticker", 
    color: "#06b6d4", 
    bg: "rgba(6, 182, 212, 0.15)", 
    border: "rgba(6, 182, 212, 0.35)",
    defaultCode: "CLEAR-CSTICKER-01", 
    description: "Decal trong suốt" 
  },
  { 
    prefix: "SILVER-CSTICKER", 
    name: "Silver Sticker", 
    color: "#94a3b8", 
    bg: "rgba(148, 163, 184, 0.15)", 
    border: "rgba(148, 163, 184, 0.35)",
    defaultCode: "SILVER-CSTICKER-01", 
    description: "Decal xi bạc bóng" 
  },
  { 
    prefix: "KRAFT-CSTICKER", 
    name: "Kraft Sticker", 
    color: "#d97706", 
    bg: "rgba(217, 119, 6, 0.15)", 
    border: "rgba(217, 119, 6, 0.35)",
    defaultCode: "KRAFT-CSTICKER-01", 
    description: "Decal Kraft nâu da bò" 
  },
  { 
    prefix: "UV-CSTICKER", 
    name: "UV DTF Sticker", 
    color: "#8b5cf6", 
    bg: "rgba(139, 92, 246, 0.15)", 
    border: "rgba(139, 92, 246, 0.35)",
    defaultCode: "UV-CSTICKER-01", 
    description: "Sticker in UV-DTF chuyển nhiệt" 
  },
  { 
    prefix: "CSTICKER", 
    name: "Custom Sticker", 
    color: "#ec4899", 
    bg: "rgba(236, 72, 153, 0.15)", 
    border: "rgba(236, 72, 153, 0.35)",
    defaultCode: "CSTICKER-01", 
    description: "Decal vàng/hologram cuộn" 
  },
  { 
    prefix: "STICKER", 
    name: "Sticker Tiêu Chuẩn", 
    color: "#10b981", 
    bg: "rgba(16, 185, 129, 0.15)", 
    border: "rgba(16, 185, 129, 0.35)",
    defaultCode: "STICKER-SUA-33x48", 
    description: "Decal sữa Fasson/Mccal" 
  },
  { 
    prefix: "PLC2", 
    name: "Playing Card V.2", 
    color: "#3b82f6", 
    bg: "rgba(59, 130, 246, 0.15)", 
    border: "rgba(59, 130, 246, 0.35)",
    defaultCode: "PLC2-01", 
    description: "Bộ bài Playing Cards V.2" 
  },
  { 
    prefix: "PLC", 
    name: "Playing Card", 
    color: "#6366f1", 
    bg: "rgba(99, 102, 241, 0.15)", 
    border: "rgba(99, 102, 241, 0.35)",
    defaultCode: "PLC-01", 
    description: "Bộ bài Playing Cards / Uno" 
  },
  { 
    prefix: "GCB", 
    name: "Gift Card Book", 
    color: "#f59e0b", 
    bg: "rgba(245, 158, 11, 0.15)", 
    border: "rgba(245, 158, 11, 0.35)",
    defaultCode: "GCB-05P-MATTE", 
    description: "Sổ thẻ Gift Card Book (5-20 trang)" 
  },
  { 
    prefix: "SCARD", 
    name: "Skin Card ATM", 
    color: "#14b8a6", 
    bg: "rgba(20, 184, 166, 0.15)", 
    border: "rgba(20, 184, 166, 0.35)",
    defaultCode: "SCARD-01", 
    description: "Miếng dán thẻ ATM Skin Card" 
  },
  { 
    prefix: "CAL", 
    name: "Lịch Để Bàn (Calendar)", 
    color: "#ef4444", 
    bg: "rgba(239, 68, 68, 0.15)", 
    border: "rgba(239, 68, 68, 0.35)",
    defaultCode: "CAL-A4-01", 
    description: "Lịch để bàn A4 / A5 / Mini" 
  },
  { 
    prefix: "HD-EMB", 
    name: "Áo Hoodie Thêu", 
    color: "#a855f7", 
    bg: "rgba(168, 85, 247, 0.15)", 
    border: "rgba(168, 85, 247, 0.35)",
    defaultCode: "HD-EMB-01", 
    description: "Áo hoodie thêu vi tính" 
  },
  { 
    prefix: "CAP-EMB", 
    name: "Nón Thêu Vi Tính", 
    color: "#f97316", 
    bg: "rgba(249, 115, 22, 0.15)", 
    border: "rgba(249, 115, 22, 0.35)",
    defaultCode: "CAP-EMB-02", 
    description: "Mũ lưỡi trai thêu logo 3D" 
  },
  { 
    prefix: "3D-BAMBU", 
    name: "In 3D Bambu Lab", 
    color: "#059669", 
    bg: "rgba(5, 150, 105, 0.15)", 
    border: "rgba(5, 150, 105, 0.35)",
    defaultCode: "3D-BAMBU-A1", 
    description: "Sản phẩm in 3D Bambu Lab A1 / H2C" 
  }
];

const SAMPLE_ORDERS_RAW = [
  { orderId: "#ORD-2026-001", sku: "CLEAR-CSTICKER-CUSTOM-09", name: "Decal Trong Suốt 5cm (Clear Sticker)", variant: "5cm Tròn", qty: 25, price: 12000 },
  { orderId: "#ORD-2026-001", sku: "GCB-05P-MATTE", name: "Sổ Thẻ Gift Card Book (5 trang bìa mờ)", variant: "5 trang Mờ", qty: 2, price: 85000 },
  { orderId: "#ORD-2026-002", sku: "CAL-2026-DESK", name: "Lịch Để Bàn A4 Lò Xo 13 Tờ", variant: "Khổ A4", qty: 5, price: 95000 },
  { orderId: "#ORD-2026-003", sku: "UV-CSTICKER-GOLD-99", name: "Sticker UV DTF Logo Nổi Chuyển Nhiệt", variant: "Khổ cuộn 0.62m", qty: 30, price: 15000 },
  { orderId: "#ORD-2026-004", sku: "PLC2-DELUXE-01", name: "Bộ Bài Playing Cards V.2 Cao Cấp", variant: "Bản V.2", qty: 3, price: 120000 },
  { orderId: "#ORD-2026-005", sku: "SCARD-ATM-PAY", name: "Skin Card ATM / Ngân Hàng Hologram", variant: "Chuẩn ATM", qty: 50, price: 25000 },
  { orderId: "#ORD-2026-006", sku: "STICKER-FASSON-SUA", name: "Sticker Decal Sữa Fasson Chống Nước", variant: "33x48cm", qty: 40, price: 10000 },
  { orderId: "#ORD-2026-007", sku: "SILVER-CSTICKER-SHINE", name: "Custom Silver Sticker Decal Xi Bạc Bóng", variant: "Tem bạc máy móc", qty: 15, price: 35000 },
  { orderId: "#ORD-2026-008", sku: "KRAFT-CSTICKER-RETRO", name: "Custom Kraft Sticker Decal Giấy Da Bò", variant: "Vintage Kraft", qty: 20, price: 20000 },
  { orderId: "#ORD-2026-009", sku: "CSTICKER-HOLO-127", name: "Decal Hologram Tia Laser 7 Màu", variant: "Cuộn 1.27m", qty: 10, price: 45000 },
  { orderId: "#ORD-2026-010", sku: "GCB-15P-HOLO-VIP", name: "Sổ Thẻ Quà Tặng Gift Card Book (15 trang bìa Holo)", variant: "15 trang Holo", qty: 4, price: 150000 },
  { orderId: "#ORD-2026-011", sku: "HD-EMB-BLACK-XL", name: "Áo Hoodie Nỉ Bông Thêu Vi Tính Nổi Chữ Kí", variant: "Size XL Đen", qty: 2, price: 380000 },
  { orderId: "#ORD-2026-012", sku: "CAP-EMB-NAVY-01", name: "Mũ Lưỡi Trai Classic Thêu Logo 3D Nổi", variant: "Màu Navy", qty: 6, price: 125000 }
];

function matchProductBySkuPrefix(skuRaw, nameRaw = '', variationRaw = '') {
  const cleanSku = String(skuRaw || '').trim().toUpperCase();
  const cleanName = String(nameRaw || '').trim();
  const cleanVar = String(variationRaw || '').trim();
  const fullText = `${cleanSku} ${cleanName} ${cleanVar}`.toUpperCase();

  // 1. Exact Match on product.code
  if (cleanSku) {
    const exact = state.products.find(p => p.code && p.code.toUpperCase() === cleanSku);
    if (exact) {
      const pref = PREFIX_DEFINITIONS.find(d => cleanSku.startsWith(d.prefix)) || null;
      return {
        product: exact,
        prefixDef: pref,
        matchType: "EXACT",
        matchLabel: "Khớp chính xác mã SKU",
        score: 100,
        isMatched: true
      };
    }
  }

  // 2. Prefix Match (longest prefix checked first)
  for (const pref of PREFIX_DEFINITIONS) {
    const pStr = pref.prefix;
    const isPrefixHit = cleanSku === pStr ||
      cleanSku.startsWith(pStr + "-") ||
      cleanSku.startsWith(pStr + ":") ||
      cleanSku.startsWith(pStr + "_") ||
      cleanSku.startsWith(pStr);

    if (isPrefixHit) {
      const candidates = state.products.filter(p => p.code && p.code.toUpperCase().startsWith(pStr));
      if (candidates.length === 1) {
        return {
          product: candidates[0],
          prefixDef: pref,
          matchType: "PREFIX",
          matchLabel: `Khớp tiền tố ${pref.prefix}`,
          score: 95,
          isMatched: true
        };
      }

      if (candidates.length > 1) {
        let bestCandidate = null;
        let maxScore = -1;

        candidates.forEach(cand => {
          let score = 0;
          const candCodeTokens = cand.code.toUpperCase().split(/[-_:]/);
          candCodeTokens.forEach(token => {
            if (token && token !== pStr && fullText.includes(token)) {
              score += 15;
            }
          });

          if (pStr === "GCB") {
            ["5P", "05P", "10P", "15P", "20P"].forEach(pCount => {
              if (cand.code.includes(pCount) && fullText.includes(pCount.replace(/^0/, ''))) score += 20;
            });
            if (cand.code.includes("HOLO") && (fullText.includes("HOLO") || fullText.includes("7 MÀU") || fullText.includes("LẤP LÁNH"))) score += 25;
            if (cand.code.includes("MATTE") && (fullText.includes("MATTE") || fullText.includes("MỜ"))) score += 25;
          }

          if (cand.code.includes("33X48") && fullText.includes("33X48")) score += 20;
          if (cand.code.includes("CUON") && (fullText.includes("CUỘN") || fullText.includes("CUON") || fullText.includes("ROLL"))) score += 20;
          if (cand.code.includes("VANG") && (fullText.includes("VÀNG") || fullText.includes("GOLD"))) score += 20;
          if (cand.code.includes("BAC") && (fullText.includes("BẠC") || fullText.includes("SILVER"))) score += 20;
          if (cand.code.includes("KRAFT") && (fullText.includes("KRAFT") || fullText.includes("DA BÒ"))) score += 20;
          if (cand.code.includes("PROTON") && fullText.includes("PROTON")) score += 20;
          if (cand.code.includes("MCCAL") && fullText.includes("MCCAL")) score += 20;
          if (cand.code.includes("UNO") && fullText.includes("UNO")) score += 30;
          if (cand.code.includes("A4") && fullText.includes("A4")) score += 20;
          if (cand.code.includes("A5") && fullText.includes("A5")) score += 20;

          if (cand.code === pref.defaultCode) score += 2;

          if (score > maxScore) {
            maxScore = score;
            bestCandidate = cand;
          }
        });

        return {
          product: bestCandidate || candidates[0],
          prefixDef: pref,
          matchType: "PREFIX",
          matchLabel: `Khớp tiền tố ${pref.prefix} (Biến thể tối ưu)`,
          score: 90,
          isMatched: true
        };
      }
    }
  }

  // 3. Fallback Fuzzy Name / Keyword Match
  const keywordMappings = [
    { keys: ["LỊCH", "CALENDAR"], prefix: "CAL" },
    { keys: ["BÀI V.2", "BÀI V2", "PLAYING CARD V2", "PLAYING CARD V.2"], prefix: "PLC2" },
    { keys: ["BỘ BÀI", "PLAYING CARD", "UNO"], prefix: "PLC" },
    { keys: ["GIFT CARD", "SỔ THẺ", "SỔ QUÀ"], prefix: "GCB" },
    { keys: ["SKIN CARD", "DÁN THẺ", "THẺ ATM"], prefix: "SCARD" },
    { keys: ["UV DTF", "UV-DTF", "UVDTF"], prefix: "UV-CSTICKER" },
    { keys: ["CLEAR STICKER", "TRONG SUỐT", "DECAL TRONG"], prefix: "CLEAR-CSTICKER" },
    { keys: ["KRAFT", "DA BÒ"], prefix: "KRAFT-CSTICKER" },
    { keys: ["XI BẠC", "BẠC BÓNG", "SILVER STICKER"], prefix: "SILVER-CSTICKER" },
    { keys: ["HOODIE", "ÁO THÊU"], prefix: "HD-EMB" },
    { keys: ["NÓN", "MŨ LƯỠI TRAI", "MŨ THÊU", "CAP"], prefix: "CAP-EMB" },
    { keys: ["CUSTOM STICKER", "TEM CUỘN"], prefix: "CSTICKER" },
    { keys: ["STICKER", "DECAL"], prefix: "STICKER" }
  ];

  for (const km of keywordMappings) {
    if (km.keys.some(k => fullText.includes(k))) {
      const pref = PREFIX_DEFINITIONS.find(d => d.prefix === km.prefix);
      if (pref) {
        const prod = state.products.find(p => p.code === pref.defaultCode) ||
                     state.products.find(p => p.code && p.code.startsWith(pref.prefix));
        if (prod) {
          return {
            product: prod,
            prefixDef: pref,
            matchType: "FUZZY",
            matchLabel: `Khớp từ khóa tên [${km.prefix}]`,
            score: 75,
            isMatched: true
          };
        }
      }
    }
  }

  // 4. No Match
  return {
    product: null,
    prefixDef: null,
    matchType: "UNMATCHED",
    matchLabel: "Không nhận diện được SKU",
    score: 0,
    isMatched: false
  };
}

function calculateOrderItemCosts(item) {
  let product = null;
  let prefixDef = null;
  let matchType = "UNMATCHED";
  let matchLabel = "Chưa khớp";
  let isMatched = false;

  if (item.manualProductId) {
    product = state.products.find(p => p.id === item.manualProductId);
    if (product) {
      prefixDef = PREFIX_DEFINITIONS.find(d => product.code && product.code.startsWith(d.prefix)) || null;
      matchType = "MANUAL";
      matchLabel = "Chỉ định thủ công";
      isMatched = true;
    }
  } else {
    const matchResult = matchProductBySkuPrefix(item.sku, item.name, item.variant);
    product = matchResult.product;
    prefixDef = matchResult.prefixDef;
    matchType = matchResult.matchType;
    matchLabel = matchResult.matchLabel;
    isMatched = matchResult.isMatched;
  }

  const qty = parseFloat(item.qty) || 0;
  const inputPrice = parseFloat(item.price) || 0;

  if (!product) {
    return {
      ...item,
      product: null,
      prefixDef,
      matchType,
      matchLabel,
      isMatched: false,
      unitVariableCost: 0,
      unitOverheadCost: 0,
      unitPaybackSurcharge: 0,
      unitFullCost: 0,
      unitSellerPrice: 0,
      effectiveUnitPrice: inputPrice,
      lineVariableCost: 0,
      lineFullCost: 0,
      lineRevenue: Math.round(inputPrice * qty),
      lineProfit: Math.round(inputPrice * qty),
      profitMargin: 0
    };
  }

  const cost = calculateProductCost(product, state.settings);
  const unitVariableCost = cost.variableCost || 0;
  const unitOverheadCost = cost.overheadCost || 0;
  const unitPaybackSurcharge = cost.paybackSurchargeFirst3Years || 0;
  const unitFullCost = cost.paybackBaseCost || (cost.baseCost + unitPaybackSurcharge);
  const unitSellerPrice = cost.paybackSellerPrice || cost.sellerPrice || 0;

  const effectiveUnitPrice = inputPrice > 0 ? inputPrice : unitSellerPrice;
  const lineVariableCost = Math.round(unitVariableCost * qty);
  const lineFullCost = Math.round(unitFullCost * qty);
  const lineRevenue = Math.round(effectiveUnitPrice * qty);
  const lineProfit = lineRevenue - lineFullCost;
  const profitMargin = lineRevenue > 0 ? Math.round((lineProfit / lineRevenue) * 100) : 0;

  return {
    ...item,
    product,
    prefixDef,
    matchType,
    matchLabel,
    isMatched: true,
    unitVariableCost,
    unitOverheadCost,
    unitPaybackSurcharge,
    unitFullCost,
    unitSellerPrice,
    effectiveUnitPrice,
    lineVariableCost,
    lineFullCost,
    lineRevenue,
    lineProfit,
    profitMargin
  };
}

function groupAndCalculateOrders(rawItems) {
  const ordersMap = new Map();
  const flatItems = [];

  rawItems.forEach((raw, idx) => {
    const orderId = String(raw.orderId || `ĐƠN-#${idx + 1}`).trim();
    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        orderId,
        items: [],
        totalQty: 0,
        totalVariableCost: 0,
        totalFullCost: 0,
        totalRevenue: 0,
        totalProfit: 0,
        profitMargin: 0,
        prefixes: new Set(),
        isAllMatched: true,
        hasWarning: false
      });
    }

    const calculatedItem = calculateOrderItemCosts(raw);
    calculatedItem.itemIndex = idx;
    flatItems.push(calculatedItem);

    const order = ordersMap.get(orderId);
    order.items.push(calculatedItem);
    order.totalQty += calculatedItem.qty;
    order.totalVariableCost += calculatedItem.lineVariableCost;
    order.totalFullCost += calculatedItem.lineFullCost;
    order.totalRevenue += calculatedItem.lineRevenue;
    order.totalProfit += calculatedItem.lineProfit;

    if (calculatedItem.prefixDef) {
      order.prefixes.add(calculatedItem.prefixDef.prefix);
    }
    if (!calculatedItem.isMatched) {
      order.isAllMatched = false;
      order.hasWarning = true;
    }
  });

  const orders = Array.from(ordersMap.values()).map(order => {
    order.profitMargin = order.totalRevenue > 0 ? Math.round((order.totalProfit / order.totalRevenue) * 100) : 0;
    order.prefixesList = Array.from(order.prefixes);
    return order;
  });

  return { orders, flatItems };
}

// ==========================================================================
// 3. Tab Routing & Views Rendering
// ==========================================================================

function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update sidebar activation
  document.querySelectorAll(".nav-item").forEach(btn => {
    const active = btn.getAttribute("data-tab") === tabId;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  // Update panel displays
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.toggle("active", pane.id === `tab-${tabId}`);
  });

  // Update Top Bar titles
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");
  
  if (tabId === "dashboard") {
    pageTitle.textContent = "Tổng Quan Dashboard";
    pageSubtitle.textContent = "Thống kê chi phí sản xuất & Kế hoạch mua hàng tháng tới";
    renderDashboard();
  } else if (tabId === "calculator") {
    pageTitle.textContent = "Tính Toán Giá Thành";
    pageSubtitle.textContent = "Xây dựng định mức chi phí sản phẩm chi tiết theo nhà máy";
    renderCalculator();
  } else if (tabId === "forecast") {
    pageTitle.textContent = "Dự Báo Mua Hàng";
    pageSubtitle.textContent = "Lên kế hoạch đặt hàng dự phòng dựa trên dữ liệu tồn kho";
    renderForecast();
  } else if (tabId === "order-cost") {
    pageTitle.textContent = "Dò Giá Cost Đơn Hàng (Smart SKU Engine)";
    pageSubtitle.textContent = "Tự động phân tích tiền tố SKU, xác định chi phí giá vốn (Cost) và lợi nhuận cho từng đơn hàng";
    renderOrderCostInspector();
  } else if (tabId === "capex") {
    pageTitle.textContent = "Quản Lý Vốn Đầu Tư Máy Móc (CAPEX) & Khấu Hao Đường Thẳng";
    pageSubtitle.textContent = "Thống kê 74 thiết bị máy móc (9.17 tỷ đ), thời hạn hoàn vốn 3 năm (36 tháng) và chi phí hao mòn cố định từng tháng";
    renderCapexView();
  } else if (tabId === "monthly-report") {
    pageTitle.textContent = "Báo Cáo Chi Phí & Doanh Thu Từng Tháng";
    pageSubtitle.textContent = "Phân tích Biến phí (VC), Số dư đảm phí, Định phí xưởng (FC) và Lợi nhuận ròng";
    renderMonthlyReport();
  } else if (tabId === "settings") {
    pageTitle.textContent = "Cấu Hình Hệ Thống";
    pageSubtitle.textContent = "Quản lý đơn giá định mức, nhập xuất dữ liệu dự phòng";
    renderSettings();
  }
}

// Update clock in top header
function updateClock() {
  const display = document.getElementById("current-datetime");
  if (!display) return;
  const now = new Date();
  const formatNum = (n) => String(n).padStart(2, '0');
  const day = formatNum(now.getDate());
  const month = formatNum(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = formatNum(now.getHours());
  const minutes = formatNum(now.getMinutes());
  display.textContent = `${day}/${month}/${year} ${hours}:${minutes}`;
}
setInterval(updateClock, 30000);
updateClock();

// ==========================================================================
// 4. Tab 1: Dashboard Rendering & Dynamic SVG Charts
// ==========================================================================

function renderDashboard() {
  let totalForecastCost = 0;
  let totalForecastQty = 0;
  let printForecastCost = 0;
  let printForecastQty = 0;
  let embroidForecastCost = 0;
  let embroidForecastQty = 0;

  const lowStockProducts = [];

  state.products.forEach(p => {
    const costDetails = calculateProductCost(p, state.settings);
    const forecastDetails = calculateProductForecast(p, costDetails.baseCost);

    totalForecastCost += forecastDetails.totalBudget;
    totalForecastQty += forecastDetails.neededQty;

    if (p.factoryType === "In") {
      printForecastCost += forecastDetails.totalBudget;
      printForecastQty += forecastDetails.neededQty;
    } else {
      embroidForecastCost += forecastDetails.totalBudget;
      embroidForecastQty += forecastDetails.neededQty;
    }

    // Check alert (Current Stock lower than Safety Stock)
    if (p.forecast.currentStock < p.forecast.safetyStock) {
      lowStockProducts.push({
        product: p,
        gap: p.forecast.safetyStock - p.forecast.currentStock
      });
    }
  });

  // Render Metric Cards
  document.getElementById("dashboard-total-purchase-cost").textContent = formatVND(totalForecastCost);
  document.getElementById("dashboard-total-qty-badge").textContent = `${totalForecastQty.toLocaleString('vi-VN')} cái`;

  document.getElementById("dashboard-print-cost").textContent = formatVND(printForecastCost);
  const printPct = totalForecastCost > 0 ? Math.round((printForecastCost / totalForecastCost) * 100) : 0;
  document.getElementById("dashboard-print-qty-badge").textContent = `${printForecastQty.toLocaleString('vi-VN')} cái (${printPct}%)`;

  document.getElementById("dashboard-embroid-cost").textContent = formatVND(embroidForecastCost);
  const embroidPct = totalForecastCost > 0 ? Math.round((embroidForecastCost / totalForecastCost) * 100) : 0;
  document.getElementById("dashboard-embroid-qty-badge").textContent = `${embroidForecastQty.toLocaleString('vi-VN')} cái (${embroidPct}%)`;

  document.getElementById("dashboard-total-products").textContent = state.products.length;

  // Render Alerts
  const alertsList = document.getElementById("dashboard-alerts-list");
  alertsList.innerHTML = "";
  if (lowStockProducts.length === 0) {
    alertsList.innerHTML = `<div class="no-data">Tất cả sản phẩm đều ở mức tồn an toàn.</div>`;
  } else {
    // Sort by severity (biggest gap first)
    lowStockProducts.sort((a, b) => b.gap - a.gap);
    lowStockProducts.forEach(item => {
      const p = item.product;
      const alertBox = document.createElement("div");
      alertBox.className = "alert-item-box";
      alertBox.innerHTML = `
        <span class="alert-icon-warning">⚠️</span>
        <div class="alert-content-text">
          <h5>${p.name} (${p.code || 'N/A'})</h5>
          <p>Tồn: <strong>${p.forecast.currentStock}</strong> / An toàn: <strong>${p.forecast.safetyStock}</strong> (Thiếu ${item.gap} cái)</p>
        </div>
      `;
      alertsList.appendChild(alertBox);
    });
  }

  // Render Charts
  renderDonutChart(printForecastCost, embroidForecastCost);
  renderBarChart();

  // Render Top Budget Products Table
  const topTable = document.getElementById("dashboard-top-products-table");
  topTable.innerHTML = "";
  
  // Calculate budget for all products, sort descending
  const productsWithBudget = state.products.map(p => {
    const { baseCost } = calculateProductCost(p, state.settings);
    const { neededQty, totalBudget } = calculateProductForecast(p, baseCost);
    return { product: p, baseCost, neededQty, totalBudget };
  }).sort((a, b) => b.totalBudget - a.totalBudget);

  if (productsWithBudget.length === 0) {
    topTable.innerHTML = `<tr><td colspan="6" class="no-data">Không có sản phẩm nào.</td></tr>`;
  } else {
    productsWithBudget.slice(0, 5).forEach(item => {
      const p = item.product;
      const row = document.createElement("tr");
      
      const stockStatusClass = p.forecast.currentStock < p.forecast.safetyStock ? "status-warning" : "status-safe";
      const stockStatusText = p.forecast.currentStock < p.forecast.safetyStock ? "Tồn thấp" : "An toàn";

      row.innerHTML = `
        <td>
          <div class="font-semibold">${p.name}</div>
          <div class="text-secondary text-xs">${p.code || 'SKU trống'}</div>
        </td>
        <td>
          <span class="table-row-factory type-${p.factoryType === "In" ? "print" : "embroid"}">
            ${p.factoryType === "In" ? "In ấn" : "Thêu dệt"}
          </span>
        </td>
        <td>${formatVND(item.baseCost)}</td>
        <td>${item.neededQty.toLocaleString('vi-VN')} cái</td>
        <td class="row-total-cost">${formatVND(item.totalBudget)}</td>
        <td>
          <span class="table-row-status ${stockStatusClass}">${stockStatusText}</span>
        </td>
      `;
      topTable.appendChild(row);
    });
  }
}

/**
 * Render dynamic SVG Donut Chart (Printing vs Embroidery budget)
 */
function renderDonutChart(printVal, embroidVal) {
  const container = document.getElementById("donut-chart-container");
  const legend = document.getElementById("donut-legend");
  container.innerHTML = "";
  legend.innerHTML = "";

  const total = printVal + embroidVal;
  
  if (total === 0) {
    container.innerHTML = `<div class="no-data">Không có ngân sách mua hàng.</div>`;
    return;
  }

  const printPct = (printVal / total) * 100;
  const embroidPct = (embroidVal / total) * 100;

  // SVG parameters
  const size = 160;
  const center = size / 2;
  const radius = 55;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  // Embroidery slice (starts at top -90deg, or 0 position)
  const embroidOffset = 0;
  const embroidStrokeDash = (embroidPct / 100) * circumference;

  // Printing slice starts where Embroidery ends
  const printOffset = -embroidStrokeDash;
  const printStrokeDash = (printPct / 100) * circumference;

  const svgHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <!-- Background Circle -->
      <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent" stroke="var(--border-glass)" stroke-width="${strokeWidth}" />
      
      <!-- Embroidery Arc -->
      <circle class="chart-donut-segment" cx="${center}" cy="${center}" r="${radius}" 
              fill="transparent" 
              stroke="var(--color-embroid)" 
              stroke-width="${strokeWidth}" 
              stroke-dasharray="${embroidStrokeDash} ${circumference}" 
              stroke-dashoffset="0"
              transform="rotate(-90 ${center} ${center})" />
              
      <!-- Printing Arc -->
      <circle class="chart-donut-segment" cx="${center}" cy="${center}" r="${radius}" 
              fill="transparent" 
              stroke="var(--color-print)" 
              stroke-width="${strokeWidth}" 
              stroke-dasharray="${printStrokeDash} ${circumference}" 
              stroke-dashoffset="${printOffset}"
              transform="rotate(-90 ${center} ${center})" />
              
      <!-- Center Text -->
      <text x="${center}" y="${center - 2}" text-anchor="middle" fill="var(--text-secondary)" font-size="10" font-weight="600">TỔNG NGÂN SÁCH</text>
      <text x="${center}" y="${center + 14}" text-anchor="middle" fill="var(--text-primary)" font-size="13" font-weight="700">${formatVND(total).split(',')[0]}K</text>
    </svg>
  `;

  container.innerHTML = svgHTML;

  // Legend
  legend.innerHTML = `
    <div class="legend-item">
      <div class="legend-label-color">
        <span class="color-dot" style="background-color: var(--color-print);"></span>
        <span>Nhà máy In</span>
      </div>
      <strong>${formatVND(printVal)} (${printPct.toFixed(1)}%)</strong>
    </div>
    <div class="legend-item">
      <div class="legend-label-color">
        <span class="color-dot" style="background-color: var(--color-embroid);"></span>
        <span>Nhà máy Thêu</span>
      </div>
      <strong>${formatVND(embroidVal)} (${embroidPct.toFixed(1)}%)</strong>
    </div>
  `;
}

/**
 * Render dynamic SVG Bar Chart (Average Cost Components breakdown across all products)
 */
function renderBarChart() {
  const container = document.getElementById("bar-chart-container");
  const legend = document.getElementById("bar-legend");
  container.innerHTML = "";
  legend.innerHTML = "";

  if (state.products.length === 0) {
    container.innerHTML = `<div class="no-data">Không có sản phẩm để phân tích.</div>`;
    return;
  }

  // Calculate averages
  let sumMaterials = 0;
  let sumLabor = 0;
  let sumElectricity = 0;
  let sumOverhead = 0;
  let count = state.products.length;

  state.products.forEach(p => {
    const cost = calculateProductCost(p, state.settings);
    sumMaterials += cost.materialsCost;
    sumLabor += cost.laborCost;
    sumElectricity += cost.electricityCost;
    sumOverhead += cost.overheadCost;
  });

  const avgMaterials = Math.round(sumMaterials / count);
  const avgLabor = Math.round(sumLabor / count);
  const avgElectricity = Math.round(sumElectricity / count);
  const avgOverhead = Math.round(sumOverhead / count);
  const avgTotal = avgMaterials + avgLabor + avgElectricity + avgOverhead;

  if (avgTotal === 0) {
    container.innerHTML = `<div class="no-data">Chi phí sản phẩm bằng 0.</div>`;
    return;
  }

  const matPct = (avgMaterials / avgTotal) * 100;
  const labPct = (avgLabor / avgTotal) * 100;
  const elePct = (avgElectricity / avgTotal) * 100;
  const ovhPct = (avgOverhead / avgTotal) * 100;

  // SVG parameters
  const w = 240;
  const h = 28;
  const r = 6; // border radius

  const svgHTML = `
    <svg width="100%" height="60" viewBox="0 0 ${w} 60" preserveAspectRatio="none" style="overflow: visible;">
      <g transform="translate(0, 10)">
        <!-- Background pill -->
        <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="var(--bg-glass)" stroke="var(--border-glass)" />
        
        <!-- Mask for rounded corners of segments -->
        <defs>
          <clipPath id="bar-clip">
            <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" />
          </clipPath>
        </defs>
        
        <g clip-path="url(#bar-clip)">
          <!-- Materials Bar -->
          <rect x="0" y="0" width="${(matPct/100)*w}" height="${h}" fill="var(--color-primary)" />
          
          <!-- Labor Bar -->
          <rect x="${(matPct/100)*w}" y="0" width="${(labPct/100)*w}" height="${h}" fill="#a855f7" />
          
          <!-- Electricity Bar -->
          <rect x="${((matPct+labPct)/100)*w}" y="0" width="${(elePct/100)*w}" height="${h}" fill="var(--color-print)" />
          
          <!-- Overhead Bar -->
          <rect x="${((matPct+labPct+elePct)/100)*w}" y="0" width="${(ovhPct/100)*w}" height="${h}" fill="var(--color-success)" />
        </g>
      </g>
      <!-- Center text indicating Average Base Cost -->
      <text x="0" y="55" fill="var(--text-primary)" font-size="10" font-weight="600">Giá vốn TB: ${formatVND(avgTotal)}/sản phẩm</text>
    </svg>
  `;

  container.innerHTML = svgHTML;

  // Legend
  legend.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem;">
      <div class="legend-item" style="justify-content: flex-start; gap: 0.5rem;">
        <span class="color-dot" style="background-color: var(--color-primary);"></span>
        <span>Vật liệu: <strong>${matPct.toFixed(0)}%</strong></span>
      </div>
      <div class="legend-item" style="justify-content: flex-start; gap: 0.5rem;">
        <span class="color-dot" style="background-color: #a855f7;"></span>
        <span>Nhân công: <strong>${labPct.toFixed(0)}%</strong></span>
      </div>
      <div class="legend-item" style="justify-content: flex-start; gap: 0.5rem;">
        <span class="color-dot" style="background-color: var(--color-print);"></span>
        <span>Điện: <strong>${elePct.toFixed(0)}%</strong></span>
      </div>
      <div class="legend-item" style="justify-content: flex-start; gap: 0.5rem;">
        <span class="color-dot" style="background-color: var(--color-success);"></span>
        <span>Chi phí chung: <strong>${ovhPct.toFixed(0)}%</strong></span>
      </div>
    </div>
  `;
}

// ==========================================================================
// Category Definitions & Grouping Helpers
// ==========================================================================

const PRODUCT_CATEGORIES = [
  { id: "calendar", name: "Lịch để bàn (Calendar)", icon: "📅", match: (c) => /lịch|calendar/i.test(c || '') },
  { id: "giftbook", name: "Sổ thẻ (Gift Card Book)", icon: "🎁", match: (c) => /sổ|gift.*card|book/i.test(c || '') },
  { id: "cards", name: "Bài in & Cards (Playing / Uno)", icon: "🃏", match: (c) => /bài|card|uno|playing/i.test(c || '') },
  { id: "sticker", name: "Nhãn dán & Decal (Sticker)", icon: "🏷️", match: (c) => /nhãn|sticker|decal|uv/i.test(c || '') },
  { id: "embroidery", name: "Thêu vi tính & May mặc", icon: "🧵", match: (c) => /thêu|thời trang|phụ kiện|áo|mũ|hoodie/i.test(c || '') },
];

function getCategoryInfo(categoryStr) {
  if (!categoryStr) return { id: "other", name: "Khác / Chưa phân loại", icon: "📁" };
  const matched = PRODUCT_CATEGORIES.find(cat => cat.match(categoryStr));
  if (matched) return matched;
  const cleanId = String(categoryStr).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return { id: cleanId || "other", name: categoryStr, icon: "📁" };
}

const collapsedCategoryMap = {};

// ==========================================================================
// 5. Tab 2: Cost Calculator View Rendering & Interactions
// ==========================================================================

function renderCalculator() {
  const searchVal = document.getElementById("calc-search").value.toLowerCase();
  const filterFactory = document.getElementById("calc-filter-factory").value;
  const filterCategory = document.getElementById("calc-filter-category") ? document.getElementById("calc-filter-category").value : "all";

  // Filter products list
  const filteredProducts = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || 
                          (p.code && p.code.toLowerCase().includes(searchVal)) ||
                          (p.category && p.category.toLowerCase().includes(searchVal));
    const matchesFactory = filterFactory === "all" || p.factoryType === filterFactory;
    const catInfo = getCategoryInfo(p.category);
    const matchesCategory = filterCategory === "all" || catInfo.id === filterCategory;
    return matchesSearch && matchesFactory && matchesCategory;
  });

  // Render Category Filter Pills
  const pillsContainer = document.getElementById("calc-category-pills");
  if (pillsContainer) {
    pillsContainer.innerHTML = "";
    
    // Total count under current factory & search
    const baseListForPills = state.products.filter(p => {
      const matchesSearch = !searchVal || p.name.toLowerCase().includes(searchVal) || 
                            (p.code && p.code.toLowerCase().includes(searchVal)) ||
                            (p.category && p.category.toLowerCase().includes(searchVal));
      const matchesFactory = filterFactory === "all" || p.factoryType === filterFactory;
      return matchesSearch && matchesFactory;
    });

    const allPill = document.createElement("button");
    allPill.type = "button";
    allPill.className = `category-pill-btn ${filterCategory === 'all' ? 'active' : ''}`;
    allPill.innerHTML = `<span>Tất cả</span> <span class="category-pill-count">${baseListForPills.length}</span>`;
    allPill.addEventListener("click", () => {
      const sel = document.getElementById("calc-filter-category");
      if (sel) sel.value = "all";
      renderCalculator();
    });
    pillsContainer.appendChild(allPill);

    PRODUCT_CATEGORIES.forEach(cat => {
      const count = baseListForPills.filter(p => cat.match(p.category)).length;
      if (count > 0) {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = `category-pill-btn ${filterCategory === cat.id ? 'active' : ''}`;
        pill.innerHTML = `<span>${cat.icon} ${cat.name.split('(')[0].trim()}</span> <span class="category-pill-count">${count}</span>`;
        pill.addEventListener("click", () => {
          const sel = document.getElementById("calc-filter-category");
          if (sel) sel.value = (filterCategory === cat.id ? 'all' : cat.id);
          renderCalculator();
        });
        pillsContainer.appendChild(pill);
      }
    });
  }

  // Render Left Column Grouped Product Cards
  const cardsList = document.getElementById("product-cards-list");
  cardsList.innerHTML = "";
  
  document.getElementById("product-count-badge").textContent = `${filteredProducts.length} sản phẩm`;

  if (filteredProducts.length === 0) {
    cardsList.innerHTML = `<div class="no-data">Không tìm thấy sản phẩm nào.</div>`;
  } else {
    // Group products by category
    const groups = {};
    filteredProducts.forEach(p => {
      const catInfo = getCategoryInfo(p.category);
      if (!groups[catInfo.id]) {
        groups[catInfo.id] = { info: catInfo, products: [] };
      }
      groups[catInfo.id].products.push(p);
    });

    // Ensure category of selected product is not collapsed
    if (state.selectedProductId) {
      const selProd = state.products.find(x => x.id === state.selectedProductId);
      if (selProd) {
        const selCatInfo = getCategoryInfo(selProd.category);
        collapsedCategoryMap[selCatInfo.id] = false;
      }
    }

    Object.keys(groups).forEach(catId => {
      const group = groups[catId];
      const isCollapsed = !!collapsedCategoryMap[catId];

      const section = document.createElement("div");
      section.className = `category-group-section ${isCollapsed ? 'collapsed' : ''}`;
      section.dataset.catId = catId;

      const countLabel = catId === 'giftbook' ? `${group.products.length} biến thể` : `${group.products.length} SP`;

      section.innerHTML = `
        <div class="category-group-header">
          <div class="category-group-header-left">
            <span class="category-group-icon">${group.info.icon}</span>
            <span class="category-group-title">${group.info.name}</span>
            <span class="category-group-badge">${countLabel}</span>
          </div>
          <span class="category-group-chevron">▼</span>
        </div>
        <div class="category-group-items"></div>
      `;

      // Collapse toggle
      const headerEl = section.querySelector(".category-group-header");
      headerEl.addEventListener("click", () => {
        const nowCollapsed = !section.classList.contains("collapsed");
        if (nowCollapsed) {
          section.classList.add("collapsed");
          collapsedCategoryMap[catId] = true;
        } else {
          section.classList.remove("collapsed");
          collapsedCategoryMap[catId] = false;
        }
      });

      const itemsContainer = section.querySelector(".category-group-items");
      group.products.forEach(p => {
        const card = document.createElement("div");
        card.className = `product-card-item ${state.selectedProductId === p.id ? 'selected' : ''}`;
        card.dataset.id = p.id;
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        
        const { baseCost, sellerPrice, paybackBaseCost, paybackSellerPrice, paybackSurchargeFirst3Years } = calculateProductCost(p, state.settings);
        const finalBase = paybackSurchargeFirst3Years > 0 ? paybackBaseCost : baseCost;
        const finalSeller = paybackSurchargeFirst3Years > 0 ? paybackSellerPrice : sellerPrice;
        
        card.innerHTML = `
          <div class="product-card-item-header">
            <div class="product-card-name">${p.name}</div>
            <div style="display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0;">
              <span class="table-row-factory type-${p.factoryType === "In" ? "print" : "embroid"}">
                ${p.factoryType}
              </span>
              <button type="button" class="btn-card-delete" title="Xóa sản phẩm này" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.25); color: #f87171; border-radius: 4px; padding: 2px 5px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; line-height: 1;">🗑️</button>
            </div>
          </div>
          <div class="product-card-sku">${p.code || 'N/A'}</div>
          <div class="product-card-footer">
            <span class="text-secondary text-xs" style="color: #34d399; font-weight: 500;">Bán: ${formatVND(finalSeller)}</span>
            <div class="product-card-price" style="font-size: 0.85rem;">Vốn: ${formatVND(finalBase)}</div>
          </div>
        `;

        card.addEventListener("click", (e) => {
          if (!e.target.closest(".btn-card-delete")) {
            selectProduct(p.id);
          }
        });

        const cardDelBtn = card.querySelector(".btn-card-delete");
        if (cardDelBtn) {
          cardDelBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteProductById(p.id);
          });
        }

        itemsContainer.appendChild(card);
      });

      cardsList.appendChild(section);
    });

    const selectedCard = cardsList.querySelector(".product-card-item.selected");
    if (selectedCard) {
      setTimeout(() => {
        selectedCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 50);
    }
  }

  const listPanel = document.querySelector(".product-list-panel");
  const cardsContainer = document.getElementById("product-cards-list");
  if (listPanel && cardsContainer && !listPanel.dataset.wheelBound) {
    listPanel.dataset.wheelBound = "true";
    listPanel.addEventListener("wheel", (e) => {
      if (!e.target.closest("#product-cards-list")) {
        cardsContainer.scrollTop += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Render Right Column Calculator Form details
  const formPanel = document.getElementById("product-cost-form");
  const noSelectView = document.getElementById("no-product-selected-view");

  if (!state.selectedProductId) {
    formPanel.classList.add("hidden");
    noSelectView.classList.remove("hidden");
    return;
  }

  const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
  if (!selectedProduct) {
    state.selectedProductId = null;
    formPanel.classList.add("hidden");
    noSelectView.classList.remove("hidden");
    return;
  }

  noSelectView.classList.add("hidden");
  formPanel.classList.remove("hidden");

  // Populate basic inputs
  document.getElementById("form-product-id").value = selectedProduct.id;
  document.getElementById("product-name").value = selectedProduct.name;
  document.getElementById("product-code").value = selectedProduct.code || "";
  document.getElementById("product-category").value = selectedProduct.category || "";

  if (selectedProduct.factoryType === "In") {
    document.getElementById("factory-print").checked = true;
  } else {
    document.getElementById("factory-embroid").checked = true;
  }

  // Adjust labor view block based on factory
  toggleFactoryInputs(selectedProduct.factoryType);

  // Populate materials table rows
  renderMaterialsRows(selectedProduct.materials);

  // Populate Labor & Utilities
  if (selectedProduct.factoryType === "In") {
    document.getElementById("labor-print-designer").value = selectedProduct.labor.designer || 0;
    document.getElementById("labor-print-production").value = selectedProduct.labor.production || 0;
    document.getElementById("labor-print-qc").value = selectedProduct.labor.qc || 0;
  } else {
    document.getElementById("labor-embroid-designer").value = selectedProduct.labor.designer || 0;
    document.getElementById("labor-embroid-laser").value = selectedProduct.labor.laser || 0;
    document.getElementById("labor-embroid-production").value = selectedProduct.labor.production || 0;
    document.getElementById("labor-embroid-qc").value = selectedProduct.labor.qc || 0;
  }

  document.getElementById("utility-machine-power").value = selectedProduct.electricity.power || 0;
  document.getElementById("utility-run-time").value = selectedProduct.electricity.runTime || 0;
  document.getElementById("utility-electricity-price").value = selectedProduct.electricity.rate ? selectedProduct.electricity.rate.toLocaleString('vi-VN') : "";
  const allocatedRate = getElectricityRateForFactory(selectedProduct.factoryType, state.settings, state.products);
  document.getElementById("utility-electricity-price").placeholder = `Phân bổ: ${Math.round(allocatedRate).toLocaleString('vi-VN')} đ/kWh`;

  document.getElementById("overhead-rate-percentage").value = selectedProduct.overheadPercentage !== undefined ? selectedProduct.overheadPercentage : state.settings.defaultOverhead;
  document.getElementById("profit-margin-percentage").value = selectedProduct.profitPercentage !== undefined ? selectedProduct.profitPercentage : (state.settings.defaultProfitMargin !== undefined ? state.settings.defaultProfitMargin : 20);

  // Populate multi-machine payback rows
  const assignedMachines = (selectedProduct.paybackMachines && Array.isArray(selectedProduct.paybackMachines) && selectedProduct.paybackMachines.length > 0)
    ? selectedProduct.paybackMachines
    : (selectedProduct.paybackMachineId ? [{ machineId: selectedProduct.paybackMachineId, qty: selectedProduct.paybackMachineQty !== undefined ? selectedProduct.paybackMachineQty : 1 }] : []);
  selectedProduct.paybackMachines = assignedMachines;
  renderProductMachineRows(assignedMachines);

  // Bind add machine buttons
  const btnAddMachRow = document.getElementById("btn-add-product-machine-row");
  if (btnAddMachRow && !btnAddMachRow.dataset.bound) {
    btnAddMachRow.dataset.bound = "true";
    btnAddMachRow.addEventListener("click", () => addNewProductMachineRow());
  }
  const btnQuickCreateMach = document.getElementById("btn-quick-create-machine");
  if (btnQuickCreateMach && !btnQuickCreateMach.dataset.bound) {
    btnQuickCreateMach.dataset.bound = "true";
    btnQuickCreateMach.addEventListener("click", () => openEditCapexModal(null));
  }

  // Populate Imposition Layout specs for printing products
  const hasLayout = !!(selectedProduct.hasLayout || (selectedProduct.layout && selectedProduct.layout.itemsPerSheet));
  const productHasLayoutCheck = document.getElementById("product-has-layout");
  const layoutDetails = document.getElementById("imposition-layout-details");
  const layoutDisabledMsg = document.getElementById("imposition-layout-disabled-msg");
  const layoutBadge = document.getElementById("product-layout-status-badge");

  if (productHasLayoutCheck) {
    productHasLayoutCheck.checked = hasLayout;
  }
  if (layoutDetails && layoutDisabledMsg && layoutBadge) {
    if (hasLayout) {
      layoutDetails.style.display = "block";
      layoutDisabledMsg.style.display = "none";
      layoutBadge.textContent = "Đang áp dụng";
      layoutBadge.style.color = "#34d399";
      layoutBadge.style.borderColor = "rgba(52, 211, 153, 0.4)";
      layoutBadge.style.background = "rgba(52, 211, 153, 0.15)";
    } else {
      layoutDetails.style.display = "none";
      layoutDisabledMsg.style.display = "block";
      layoutBadge.textContent = "Không áp dụng";
      layoutBadge.style.color = "var(--text-muted)";
      layoutBadge.style.borderColor = "rgba(255, 255, 255, 0.1)";
      layoutBadge.style.background = "rgba(255, 255, 255, 0.05)";
    }
  }

  const layout = selectedProduct.layout || {};
  const layoutPreset = document.getElementById("layout-preset");
  const layoutSheetSize = document.getElementById("layout-sheet-size");
  const layoutItemSize = document.getElementById("layout-item-size");
  const layoutItemSizeSelect = document.getElementById("layout-item-size-select");
  const layoutItemsPerSheet = document.getElementById("layout-items-per-sheet");

  if (layoutPreset) layoutPreset.value = layout.preset || "";
  if (layoutSheetSize) layoutSheetSize.value = layout.sheetSize || (selectedProduct.name.includes("UV") ? "0.62 x 1m" : "33x48cm");
  if (layoutItemSize) layoutItemSize.value = layout.itemSize || "2.0 inch";
  if (layoutItemSizeSelect) {
    layoutItemSizeSelect.value = ["1.5 inch", "2.0 inch", "3.0 inch", "4.0 inch", "5.0 inch"].includes(layout.itemSize) ? layout.itemSize : "custom";
  }
  if (layoutItemsPerSheet) {
    layoutItemsPerSheet.value = layout.itemsPerSheet !== undefined ? layout.itemsPerSheet : 40;
  }

  updateImpositionOrderCalc();

  // Run calculation & update displays
  triggerLiveCalculation();

  // Enforce permissions (e.g. read-only guard) for current user
  const activeUser = getCurrentUser();
  if (activeUser) {
    applyUserPermissions(activeUser);
  }
}

function selectProduct(id) {
  if (state.selectedProductId && state.selectedProductId !== id) {
    const curProd = state.products.find(p => p.id === state.selectedProductId);
    if (curProd) {
      syncProductMachinesFromDom(curProd);
      syncProductMaterialsFromDom(curProd);
      syncProductLaborFromDom(curProd);
      syncProductElectricityFromDom(curProd);
      const overheadInput = document.getElementById("overhead-rate-percentage");
      if (overheadInput) curProd.overheadPercentage = parseFloat(overheadInput.value) || 0;
      const profitInput = document.getElementById("profit-margin-percentage");
      if (profitInput) curProd.profitPercentage = parseFloat(profitInput.value) || 0;
      state.saveProducts();
    }
  }
  state.selectedProductId = id;
  renderCalculator();
}

function toggleFactoryInputs(factoryType) {
  const printBlock = document.getElementById("labor-print-block");
  const embroidBlock = document.getElementById("labor-embroid-block");
  const badgeResult = document.getElementById("form-result-factory-badge");
  const layoutControlContainer = document.getElementById("layout-control-container");

  if (factoryType === "In") {
    printBlock.style.display = "block";
    embroidBlock.style.display = "none";
    if (layoutControlContainer) layoutControlContainer.style.display = "block";
    badgeResult.textContent = "Nhà máy In";
    badgeResult.className = "badge-factory-type";
  } else {
    printBlock.style.display = "none";
    embroidBlock.style.display = "block";
    if (layoutControlContainer) layoutControlContainer.style.display = "none";
    badgeResult.textContent = "Nhà máy Thêu";
    badgeResult.className = "badge-factory-type type-embroid";
  }
}

function detectSheetUnit(sheetSize) {
  const s = String(sheetSize || "").trim().toLowerCase();
  if (s.includes("mét") || s.includes("met") || s.includes("cuộn") || s.includes("roll")) {
    return "Mét";
  }
  if (s.includes("cm") || s.includes("mm") || s.includes("tờ") || s.includes("sheet") || s.includes("a3") || s.includes("a4")) {
    return "Tờ";
  }
  if (/\b\d+(\.\d+)?\s*m\b/.test(s) || /x\s*\d+(\.\d+)?m/i.test(s) || /x\s*1m/i.test(s)) {
    return "Mét";
  }
  return "Tờ";
}

function updateImpositionOrderCalc() {
  const itemsPerSheetInput = document.getElementById("layout-items-per-sheet");
  if (!itemsPerSheetInput) return;
  const itemsPerSheet = parseFloat(itemsPerSheetInput.value) || 1;
  const sheetSizeInput = document.getElementById("layout-sheet-size");
  const sheetSize = sheetSizeInput ? sheetSizeInput.value : "";
  const unit = detectSheetUnit(sheetSize);

  const yieldLabel = document.getElementById("layout-yield-label");
  if (yieldLabel) yieldLabel.textContent = itemsPerSheet.toLocaleString('vi-VN');

  const unitLabel = document.getElementById("layout-unit-label");
  if (unitLabel) unitLabel.textContent = unit;

  const unitBadge = document.getElementById("imposition-unit-badge");
  if (unitBadge) unitBadge.textContent = `Khổ ${unit}`;

  const consumption = itemsPerSheet > 0 ? (1 / itemsPerSheet) : 0;
  const unitConsumptionEl = document.getElementById("layout-unit-consumption");
  if (unitConsumptionEl) unitConsumptionEl.textContent = consumption.toFixed(6).replace(/\.?0+$/, '');
}

function syncYieldToBOM() {
  const itemsPerSheetInput = document.getElementById("layout-items-per-sheet");
  const itemsPerSheet = parseFloat(itemsPerSheetInput?.value) || 1;
  const consumption = parseFloat((1 / itemsPerSheet).toFixed(6));
  const sheetSize = document.getElementById("layout-sheet-size")?.value || "";
  const unit = detectSheetUnit(sheetSize);

  let synced = false;
  const rows = document.querySelectorAll("#materials-tbody tr:not(.empty-materials-row)");
  rows.forEach((row, idx) => {
    const nameInput = row.querySelector(".row-mat-name");
    const name = (nameInput?.value || "").toLowerCase();
    const qtyInput = row.querySelector(".row-mat-qty");
    const unitInput = row.querySelector(".row-mat-unit");

    // Match primary sheet/meter materials (Decal, Giấy, Màng, Click, Mực) or first row
    if (name.includes("decal") || name.includes("màng") || name.includes("giấy") || name.includes("click") || name.includes("mực") || idx === 0) {
      if (qtyInput) qtyInput.value = consumption;
      if (unitInput && (name.includes("decal") || name.includes("màng") || name.includes("giấy") || (unit === "Mét" && name.includes("mực")))) {
        unitInput.value = unit;
      }
      synced = true;
    }
  });

  if (synced) {
    triggerLiveCalculation();
    updateImpositionOrderCalc();
    alert(`Đã cập nhật hệ số định mức ${consumption} ${unit}/sản phẩm (1 ÷ ${itemsPerSheet} con) vào bảng nguyên vật liệu!`);
  } else {
    alert("Chưa tìm thấy dòng vật tư phù hợp để đồng bộ. Vui lòng thêm vật tư vào bảng trước!");
  }
}

function renderMaterialsRows(materials) {
  const tbody = document.getElementById("materials-tbody");
  tbody.innerHTML = "";

  if (!materials || materials.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-materials-row">
        <td colspan="6" class="no-data" style="padding: 1rem 0;">Chưa thêm nguyên vật liệu nào. Click nút bên phải để thêm.</td>
      </tr>
    `;
    return;
  }

  materials.forEach((mat, idx) => {
    const tr = document.createElement("tr");
    tr.dataset.index = idx;
    
    tr.innerHTML = `
      <td>
        <input type="text" value="${mat.name || ''}" list="materials-catalog-datalist" placeholder="Tên vật tư (hoặc chọn từ Thư viện)..." class="form-input row-mat-name" required style="min-height:38px;">
      </td>
      <td>
        <input type="number" step="any" min="0" value="${mat.qty !== undefined ? mat.qty : 1}" placeholder="0" class="form-input text-center row-mat-qty calc-trigger" required style="min-height:38px;">
      </td>
      <td>
        <input type="text" value="${mat.unit || ''}" placeholder="m2, cái, kg..." class="form-input text-center row-mat-unit" style="min-height:38px;">
      </td>
      <td>
        <input type="text" value="${(mat.price || 0).toLocaleString('vi-VN')}" placeholder="0" class="form-input row-mat-price currency-input calc-trigger" required style="min-height:38px;">
      </td>
      <td class="text-right font-semibold row-mat-total" style="padding: 0 0.5rem; text-align: right; min-width: 120px;">
        ${formatVND((mat.qty || 0) * (mat.price || 0))}
      </td>
      <td>
        <button type="button" class="btn-remove-row btn-remove-material" title="Xóa vật tư này">&times;</button>
      </td>
    `;
    
    const nameInput = tr.querySelector(".row-mat-name");
    const qtyInput = tr.querySelector(".row-mat-qty");
    const unitInput = tr.querySelector(".row-mat-unit");
    const priceInput = tr.querySelector(".row-mat-price");

    const onMatRowChange = () => {
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (selectedProduct) {
        syncProductMaterialsFromDom(selectedProduct);
        state.saveProducts();
      }
      triggerLiveCalculation();
    };

    if (nameInput) {
      nameInput.addEventListener("input", onMatRowChange);
      nameInput.addEventListener("change", onMatRowChange);

      const handleCatalogLookup = (e) => {
        const val = (e.target.value || "").trim().toLowerCase();
        if (!val) return;
        const catalog = state.settings.materialsCatalog || [];
        const match = catalog.find(item => item.name.toLowerCase() === val);
        if (match) {
          if (unitInput) unitInput.value = match.unit;
          if (priceInput) priceInput.value = match.defaultPrice.toLocaleString('vi-VN');
          const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
          if (selectedProduct) {
            syncProductMaterialsFromDom(selectedProduct);
            state.saveProducts();
          }
          triggerLiveCalculation();
        }
      };
      nameInput.addEventListener("input", handleCatalogLookup);
      nameInput.addEventListener("change", handleCatalogLookup);
    }

    if (qtyInput) {
      qtyInput.addEventListener("input", onMatRowChange);
      qtyInput.addEventListener("change", onMatRowChange);
    }

    if (unitInput) {
      unitInput.addEventListener("input", onMatRowChange);
      unitInput.addEventListener("change", onMatRowChange);
    }

    if (priceInput) {
      priceInput.addEventListener("input", onMatRowChange);
      priceInput.addEventListener("change", onMatRowChange);
    }

    // Add remove handler
    tr.querySelector(".btn-remove-material").addEventListener("click", () => {
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (selectedProduct) {
        syncProductMaterialsFromDom(selectedProduct);
        selectedProduct.materials.splice(idx, 1);
        state.saveProducts();
        renderMaterialsRows(selectedProduct.materials);
      } else {
        materials.splice(idx, 1);
        renderMaterialsRows(materials);
      }
      bindDynamicRowEvents();
      triggerLiveCalculation();
    });

    tbody.appendChild(tr);
  });
}

function addNewMaterialRow() {
  const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
  if (!selectedProduct) return;

  // 1. Đồng bộ các giá trị đang có trên DOM vào selectedProduct trước để không mất dữ liệu đang gõ dở
  syncProductMaterialsFromDom(selectedProduct);

  if (!selectedProduct.materials) {
    selectedProduct.materials = [];
  }

  selectedProduct.materials.push({
    name: "",
    qty: 1,
    unit: "Cái",
    price: 0
  });

  // 2. Lưu ngay vào state và localStorage
  state.saveProducts();

  // 3. Render lại danh sách và gắn sự kiện
  renderMaterialsRows(selectedProduct.materials);
  bindDynamicRowEvents();
  triggerLiveCalculation();
}

function buildMachineSelectOptions(selectedId) {
  let html = `<option value="">-- Chọn máy khấu hao --</option>`;
  if (!state.settings.machines) return html;
  const groups = {};
  state.settings.machines.forEach(m => {
    const cat = m.category || (m.factoryType === "Thêu" ? "Thêu & Laser" : (m.factoryType === "In 3D" ? "Máy in 3D" : "In, Cắt & Hoàn Thiện"));
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(m);
  });
  Object.keys(groups).forEach(catName => {
    html += `<optgroup label="📁 ${catName} (${groups[catName].length} mục)">`;
    groups[catName].forEach(m => {
      const isSel = m.id === selectedId ? "selected" : "";
      html += `<option value="${m.id}" ${isSel}>${m.name} (+${(m.surchargePerUnit || 0).toLocaleString('vi-VN')} đ/${m.unitType || 'đv'})</option>`;
    });
    html += `</optgroup>`;
  });
  return html;
}

function syncProductMaterialsFromDom(product) {
  if (!product) return [];
  const rows = document.querySelectorAll("#materials-tbody tr:not(.empty-materials-row)");
  const materials = [];
  rows.forEach(row => {
    const name = (row.querySelector(".row-mat-name")?.value || "").trim();
    const qty = parseFloat(row.querySelector(".row-mat-qty")?.value) || 0;
    const unit = (row.querySelector(".row-mat-unit")?.value || "").trim() || "Cái";
    const priceStr = row.querySelector(".row-mat-price")?.value || "0";
    const price = parseCurrencyInput(priceStr);
    materials.push({ name, qty, unit, price });
  });
  product.materials = materials;
  return materials;
}

function syncProductLaborFromDom(product) {
  if (!product) return;
  product.labor = product.labor || {};
  const factoryType = document.querySelector('input[name="factoryType"]:checked')?.value || product.factoryType;
  if (factoryType === "In") {
    product.labor.designer = parseFloat(document.getElementById("labor-print-designer")?.value) || 0;
    product.labor.production = parseFloat(document.getElementById("labor-print-production")?.value) || 0;
    product.labor.qc = parseFloat(document.getElementById("labor-print-qc")?.value) || 0;
  } else {
    product.labor.designer = parseFloat(document.getElementById("labor-embroid-designer")?.value) || 0;
    product.labor.laser = parseFloat(document.getElementById("labor-embroid-laser")?.value) || 0;
    product.labor.production = parseFloat(document.getElementById("labor-embroid-production")?.value) || 0;
    product.labor.qc = parseFloat(document.getElementById("labor-embroid-qc")?.value) || 0;
  }
}

function syncProductElectricityFromDom(product) {
  if (!product) return;
  product.electricity = product.electricity || {};
  const powerEl = document.getElementById("utility-machine-power");
  const timeEl = document.getElementById("utility-run-time");
  const rateEl = document.getElementById("utility-electricity-price");
  if (powerEl) product.electricity.power = parseFloat(powerEl.value) || 0;
  if (timeEl) product.electricity.runTime = parseFloat(timeEl.value) || 0;
  if (rateEl && rateEl.value) product.electricity.rate = parseCurrencyInput(rateEl.value);
}

function updateProductCardInList(product) {
  if (!product) return;
  const card = document.querySelector(`.product-card-item[data-id="${product.id}"]`) || document.querySelector(".product-card-item.selected");
  if (!card) return;
  const { baseCost, sellerPrice, paybackBaseCost, paybackSellerPrice, paybackSurchargeFirst3Years } = calculateProductCost(product, state.settings);
  const finalBase = paybackSurchargeFirst3Years > 0 ? paybackBaseCost : baseCost;
  const finalSeller = paybackSurchargeFirst3Years > 0 ? paybackSellerPrice : sellerPrice;
  
  const priceEl = card.querySelector(".product-card-price");
  if (priceEl) priceEl.textContent = `Vốn: ${formatVND(finalBase)}`;
  const sellerEl = card.querySelector(".product-card-footer span");
  if (sellerEl) sellerEl.textContent = `Bán: ${formatVND(finalSeller)}`;
}

function syncProductMachinesFromDom(product) {
  if (!product) return [];
  const machineRows = document.querySelectorAll("#product-machines-list-container .product-machine-row");
  const paybackMachines = [];
  machineRows.forEach(row => {
    const sel = row.querySelector(".product-machine-select");
    const qtyInput = row.querySelector(".product-machine-qty");
    if (sel && sel.value) {
      paybackMachines.push({
        machineId: sel.value,
        qty: parseFloat(qtyInput?.value) || 0
      });
    }
  });
  product.paybackMachines = paybackMachines;
  product.paybackMachineId = paybackMachines.length > 0 ? paybackMachines[0].machineId : null;
  product.paybackMachineQty = paybackMachines.length > 0 ? paybackMachines[0].qty : 0;
  return paybackMachines;
}

function renderProductMachineRows(machinesList) {
  const container = document.getElementById("product-machines-list-container");
  if (!container) return;
  container.innerHTML = "";

  if (!machinesList || machinesList.length === 0) {
    container.innerHTML = `
      <div class="product-machines-empty-state" style="padding: 0.85rem; text-align: center; color: var(--text-secondary); font-size: 0.75rem; border: 1px dashed rgba(255,255,255,0.12); border-radius: 6px; background: rgba(0,0,0,0.15);">
        Chưa gán máy móc khấu hao nào cho sản phẩm này. Bấm <strong>"➕ Bổ Sung Máy Khấu Hao"</strong> để liên kết máy hoặc <strong>"➕ Tạo Máy Mới Vào Hệ Thống"</strong>.
      </div>
    `;
    return;
  }

  machinesList.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "product-machine-row glass-card";
    row.dataset.index = idx;
    row.style.cssText = "display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-radius: 6px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.08); flex-wrap: wrap;";

    const machine = state.settings.machines?.find(m => m.id === item.machineId);
    const unitLabel = machine ? (machine.unitType || "Cái") : "Cái";
    const targetVol = machine ? ((machine.paybackYears || 3) * (machine.expectedVolumePerYear || 1)) : 1;
    const unitRate = machine ? (machine.surchargePerUnit || Math.round(machine.investment / targetVol)) : 0;
    const itemQty = item.qty !== undefined ? item.qty : 1;
    const itemCost = Math.round(itemQty * unitRate);
    const discountPct = machine?.discountAfter3Years !== undefined ? machine.discountAfter3Years : 80;
    const itemCostAfter = Math.round(itemCost * (1 - discountPct / 100));

    row.innerHTML = `
      <div style="flex: 2; min-width: 220px;">
        <select class="product-machine-select form-input calc-trigger" style="width: 100%; font-size: 0.8rem; margin: 0; background: var(--bg-input); border-color: var(--border-glass); color: var(--text-primary);">
          ${buildMachineSelectOptions(item.machineId)}
        </select>
      </div>
      <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 130px;">
        <input type="number" step="0.0001" min="0" class="product-machine-qty form-input calc-trigger" value="${itemQty}" style="width: 85px; font-size: 0.8rem; text-align: right; margin: 0; background: var(--bg-input); border-color: var(--border-glass); color: var(--text-primary);">
        <span class="product-machine-unit-label" style="font-size: 0.72rem; color: var(--text-secondary); white-space: nowrap;">${unitLabel}/sp</span>
      </div>
      <div style="min-width: 120px; text-align: right;">
        <span class="product-machine-cost" style="font-size: 0.82rem; font-weight: 700; color: #f59e0b;">+${formatVND(itemCost)}</span>
        <span class="product-machine-cost-after" style="display: block; font-size: 0.68rem; color: #34d399;">(sau 3n: +${formatVND(itemCostAfter)})</span>
      </div>
      <div>
        <button type="button" class="btn btn-xs btn-outline product-machine-del-btn" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.3); padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px;" title="Xóa máy này khỏi sản phẩm">✕</button>
      </div>
    `;

    // Listeners for select change and input
    const sel = row.querySelector(".product-machine-select");
    const qtyInput = row.querySelector(".product-machine-qty");
    const unitEl = row.querySelector(".product-machine-unit-label");

    const onRowInputChange = () => {
      item.machineId = sel.value;
      item.qty = parseFloat(qtyInput.value) || 0;

      const selectedM = state.settings.machines?.find(m => m.id === sel.value);
      if (selectedM && unitEl) {
        unitEl.textContent = `${selectedM.unitType || 'Cái'}/sp`;
      }

      // Tự động đồng bộ và lưu ngay vào sản phẩm đang chọn
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (selectedProduct) {
        syncProductMachinesFromDom(selectedProduct);
        state.saveProducts();
      }

      triggerLiveCalculation();
    };

    sel.addEventListener("change", onRowInputChange);
    qtyInput.addEventListener("input", onRowInputChange);

    // Delete row listener
    row.querySelector(".product-machine-del-btn").addEventListener("click", () => {
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (selectedProduct) syncProductMachinesFromDom(selectedProduct);

      machinesList.splice(idx, 1);

      if (selectedProduct) {
        selectedProduct.paybackMachines = machinesList;
        selectedProduct.paybackMachineId = machinesList.length > 0 ? machinesList[0].machineId : null;
        selectedProduct.paybackMachineQty = machinesList.length > 0 ? machinesList[0].qty : 0;
        state.saveProducts();
      }

      renderProductMachineRows(machinesList);
      triggerLiveCalculation();
    });

    container.appendChild(row);
  });
}

function addNewProductMachineRow(machineId = null, qty = 1) {
  const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
  if (!selectedProduct) return;

  // 1. Đồng bộ các giá trị đang chọn trên DOM vào selectedProduct trước để không bị mất máy vừa chọn
  syncProductMachinesFromDom(selectedProduct);

  if (!selectedProduct.paybackMachines) {
    selectedProduct.paybackMachines = [];
  }

  const defaultMachineId = machineId || (state.settings.machines && state.settings.machines.length > 0 ? state.settings.machines[0].id : "");

  selectedProduct.paybackMachines.push({
    machineId: defaultMachineId,
    qty: qty
  });
  selectedProduct.paybackMachineId = selectedProduct.paybackMachines[0].machineId;
  selectedProduct.paybackMachineQty = selectedProduct.paybackMachines[0].qty;

  // 2. Lưu ngay lập tức vào localStorage
  state.saveProducts();

  // 3. Render lại danh sách
  renderProductMachineRows(selectedProduct.paybackMachines);
  triggerLiveCalculation();
}

/**
 * Chạy tính toán giá trị trực tiếp dựa trên form nhập liệu hiện tại và cập nhật UI kết quả
 */
function triggerLiveCalculation() {
  const factoryRadio = document.querySelector('input[name="factoryType"]:checked');
  const factoryType = factoryRadio ? factoryRadio.value : "In";

  // Đồng bộ và tự động lưu trạng thái sản phẩm hiện tại vào state & localStorage
  const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
  if (selectedProduct) {
    syncProductMaterialsFromDom(selectedProduct);
    syncProductLaborFromDom(selectedProduct);
    syncProductMachinesFromDom(selectedProduct);
    syncProductElectricityFromDom(selectedProduct);

    const overheadInput = document.getElementById("overhead-rate-percentage");
    if (overheadInput) {
      selectedProduct.overheadPercentage = parseFloat(overheadInput.value) || 0;
    }
    const profitInput = document.getElementById("profit-margin-percentage");
    if (profitInput) {
      selectedProduct.profitPercentage = parseFloat(profitInput.value) || 0;
    }
    state.saveProducts();
  }
  
  // 1. Nguyên vật liệu
  let materialsCost = 0;
  const rows = document.querySelectorAll("#materials-tbody tr:not(.empty-materials-row)");
  
  rows.forEach(row => {
    const qtyInput = row.querySelector(".row-mat-qty");
    const priceInput = row.querySelector(".row-mat-price");
    
    if (qtyInput && priceInput) {
      const qty = parseFloat(qtyInput.value) || 0;
      const price = parseCurrencyInput(priceInput.value);
      
      const total = qty * price;
      row.querySelector(".row-mat-total").textContent = formatVND(total);
      materialsCost += total;
    }
  });

  document.getElementById("summary-materials-cost").textContent = formatVND(materialsCost);

  // 2. Nhân công
  let laborCost = 0;
  const stdHours = state.settings.standardHours || 208;

  if (factoryType === "In") {
    const desHourly = getDepartmentHourlyRate(state.settings.hr.In.designer, stdHours);
    const prodHourly = getDepartmentHourlyRate(state.settings.hr.In.production, stdHours);
    const qcHourly = getDepartmentHourlyRate(state.settings.hr.In.qc, stdHours);

    const desHours = parseFloat(document.getElementById("labor-print-designer").value) || 0;
    const prodHours = parseFloat(document.getElementById("labor-print-production").value) || 0;
    const qcHours = parseFloat(document.getElementById("labor-print-qc").value) || 0;

    const desCost = desHours * desHourly;
    const prodCost = prodHours * prodHourly;
    const qcCost = qcHours * qcHourly;

    document.getElementById("rate-print-designer").textContent = formatVND(desHourly) + "/h";
    document.getElementById("rate-print-production").textContent = formatVND(prodHourly) + "/h";
    document.getElementById("rate-print-qc").textContent = formatVND(qcHourly) + "/h";

    document.getElementById("cost-print-designer").textContent = formatVND(desCost);
    document.getElementById("cost-print-production").textContent = formatVND(prodCost);
    document.getElementById("cost-print-qc").textContent = formatVND(qcCost);

    laborCost = desCost + prodCost + qcCost;
    document.getElementById("calc-labor-print-cost").textContent = formatVND(laborCost);
  } else {
    const desHourly = getDepartmentHourlyRate(state.settings.hr.Thêu.designer, stdHours);
    const laserHourly = getDepartmentHourlyRate(state.settings.hr.Thêu.laser, stdHours);
    const prodHourly = getDepartmentHourlyRate(state.settings.hr.Thêu.production, stdHours);
    const qcHourly = getDepartmentHourlyRate(state.settings.hr.Thêu.qc, stdHours);

    const desHours = parseFloat(document.getElementById("labor-embroid-designer").value) || 0;
    const laserHours = parseFloat(document.getElementById("labor-embroid-laser").value) || 0;
    const prodHours = parseFloat(document.getElementById("labor-embroid-production").value) || 0;
    const qcHours = parseFloat(document.getElementById("labor-embroid-qc").value) || 0;

    const desCost = desHours * desHourly;
    const laserCost = laserHours * laserHourly;
    const prodCost = prodHours * prodHourly;
    const qcCost = qcHours * qcHourly;

    document.getElementById("rate-embroid-designer").textContent = formatVND(desHourly) + "/h";
    document.getElementById("rate-embroid-laser").textContent = formatVND(laserHourly) + "/h";
    document.getElementById("rate-embroid-production").textContent = formatVND(prodHourly) + "/h";
    document.getElementById("rate-embroid-qc").textContent = formatVND(qcHourly) + "/h";

    document.getElementById("cost-embroid-designer").textContent = formatVND(desCost);
    document.getElementById("cost-embroid-laser").textContent = formatVND(laserCost);
    document.getElementById("cost-embroid-production").textContent = formatVND(prodCost);
    document.getElementById("cost-embroid-qc").textContent = formatVND(qcCost);

    laborCost = desCost + laserCost + prodCost + qcCost;
    document.getElementById("calc-labor-embroid-cost").textContent = formatVND(laborCost);
  }

  // 3. Điện năng (Bỏ qua trực tiếp theo chỉ đạo, đưa vào định phí xưởng hàng tháng)
  const electricityCost = 0;
  const elElec = document.getElementById("calc-electricity-cost");
  if (elElec) elElec.textContent = "₫0 (Định phí xưởng)";

  // 4. Biến phí (Variable Cost = NVL + Nhân công)
  const variableCost = Math.round(materialsCost + laborCost);

  // 5. Chi phí quản lý chung phân bổ (Overheads - Định phí tính theo % Biến phí)
  const overheadPercentage = parseFloat(document.getElementById("overhead-rate-percentage").value) || 0;
  const overheadCost = Math.round(variableCost * (overheadPercentage / 100));
  const elOvh = document.getElementById("calc-overhead-cost");
  if (elOvh) elOvh.textContent = formatVND(overheadCost);

  // 6. Tổng Base Cost cơ bản
  const baseCost = variableCost + overheadCost;
  const elBaseCost = document.getElementById("calculated-base-cost");
  if (elBaseCost) elBaseCost.textContent = baseCost.toLocaleString('vi-VN');
  const elStickyBase = document.getElementById("sticky-base-cost");
  if (elStickyBase) elStickyBase.textContent = baseCost.toLocaleString('vi-VN');

  // 7. Giá bán đề xuất tiêu chuẩn
  const profitPercentage = parseFloat(document.getElementById("profit-margin-percentage").value) || 0;
  const sellerPrice = Math.round(baseCost * (1 + profitPercentage / 100));
  const elSellerPrice = document.getElementById("calculated-seller-price");
  if (elSellerPrice) elSellerPrice.textContent = sellerPrice.toLocaleString('vi-VN');
  const elStickySeller = document.getElementById("sticky-seller-price");
  if (elStickySeller) elStickySeller.textContent = sellerPrice.toLocaleString('vi-VN');
  const elBottomProfit = document.getElementById("bottom-profit-percentage");
  if (elBottomProfit) elBottomProfit.textContent = profitPercentage;

  // 8. Tính khấu hao máy móc 2 giai đoạn (3 năm đầu & Sau 3 năm) - Đa máy
  const machineRows = document.querySelectorAll("#product-machines-list-container .product-machine-row");
  const paybackSurchargeEl = document.getElementById("calc-payback-surcharge");
  const paybackSurchargeAfter3yEl = document.getElementById("calc-payback-surcharge-after3y");
  const paybackInfoEl = document.getElementById("calc-payback-info-banner");

  let paybackSurchargeFirst3Years = 0;
  let paybackSurchargeAfter3Years = 0;
  const activeAllocatedList = [];

  machineRows.forEach(row => {
    const sel = row.querySelector(".product-machine-select");
    const qtyInput = row.querySelector(".product-machine-qty");
    const costBadge = row.querySelector(".product-machine-cost");
    const costAfterBadge = row.querySelector(".product-machine-cost-after");
    const unitLabel = row.querySelector(".product-machine-unit-label");

    if (sel && sel.value && state.settings.machines) {
      const machine = state.settings.machines.find(m => m.id === sel.value);
      if (machine) {
        if (unitLabel) unitLabel.textContent = `${machine.unitType || 'Cái'}/sp`;
        const targetVolume = (machine.paybackYears || 3) * (machine.expectedVolumePerYear || 1);
        const unitRate = machine.surchargePerUnit || (machine.investment / targetVolume);
        const qty = parseFloat(qtyInput?.value) || 0;

        const itemFirst3 = Math.round(qty * unitRate);
        const discountPct = machine.discountAfter3Years !== undefined ? machine.discountAfter3Years : 80;
        const itemAfter3 = Math.round(itemFirst3 * (1 - discountPct / 100));

        paybackSurchargeFirst3Years += itemFirst3;
        paybackSurchargeAfter3Years += itemAfter3;

        if (costBadge) costBadge.textContent = `+${formatVND(itemFirst3)}`;
        if (costAfterBadge) costAfterBadge.textContent = `(sau 3n: +${formatVND(itemAfter3)})`;

        activeAllocatedList.push({
          machine,
          qty,
          targetVolume,
          itemFirst3,
          itemAfter3
        });
      }
    }
  });

  if (paybackSurchargeEl) {
    paybackSurchargeEl.textContent = formatVND(paybackSurchargeFirst3Years);
  }
  if (paybackSurchargeAfter3yEl) {
    paybackSurchargeAfter3yEl.textContent = formatVND(paybackSurchargeAfter3Years);
  }

  if (paybackInfoEl) {
    if (activeAllocatedList.length > 0) {
      paybackInfoEl.style.display = "block";
      let bannerHtml = `<div style="font-weight: 600; margin-bottom: 0.35rem; color: #34d399;">⚙️ Phân bổ khấu hao ${activeAllocatedList.length} thiết bị máy móc vào sản phẩm:</div>`;
      bannerHtml += `<ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem;">`;
      activeAllocatedList.forEach(item => {
        const progress = ((item.machine.currentVolume || 0) / item.targetVolume * 100).toFixed(1);
        bannerHtml += `<li><strong>${item.machine.name}</strong> (${item.qty} ${item.machine.unitType}/sp): <span style="color: #f59e0b; font-weight: 600;">+${formatVND(item.itemFirst3)}</span>/sp (Sau 3 năm: <span style="color: #34d399;">+${formatVND(item.itemAfter3)}</span>) — Đã thu hồi vốn: <strong>${progress}%</strong></li>`;
      });
      bannerHtml += `</ul>`;
      paybackInfoEl.innerHTML = bannerHtml;
    } else {
      paybackInfoEl.style.display = "none";
    }
  }

  // Giai đoạn 1 & Giai đoạn 2
  const paybackBaseCost = baseCost + paybackSurchargeFirst3Years;
  const paybackSellerPrice = Math.round(paybackBaseCost * (1 + profitPercentage / 100));

  const postPaybackBaseCost = baseCost + paybackSurchargeAfter3Years;
  const postPaybackSellerPrice = Math.round(postPaybackBaseCost * (1 + profitPercentage / 100));

  const contributionMargin = paybackSellerPrice - variableCost;
  const marginRatio = paybackSellerPrice > 0 ? Math.round((contributionMargin / paybackSellerPrice) * 100) : 0;

  // 9. Cập nhật 3 Thẻ Phân Loại Chi Phí (Cost Classification Pillars)
  const elSumVC = document.getElementById("calc-summary-variable-cost");
  if (elSumVC) elSumVC.textContent = formatVND(variableCost);
  const elSumVCDesc = document.getElementById("calc-summary-variable-desc");
  if (elSumVCDesc) elSumVCDesc.textContent = `NVL: ${formatVND(materialsCost)} | Nhân công: ${formatVND(laborCost)}`;

  const elSumFC = document.getElementById("calc-summary-fixed-cost");
  if (elSumFC) elSumFC.textContent = formatVND(overheadCost);
  const elSumFCDesc = document.getElementById("calc-summary-fixed-desc");
  if (elSumFCDesc) elSumFCDesc.textContent = `Quản lý chung Overhead (${overheadPercentage}%)`;

  const elSumCapEx = document.getElementById("calc-summary-capex-cost");
  if (elSumCapEx) elSumCapEx.textContent = formatVND(paybackSurchargeFirst3Years);
  const elSumCapExDesc = document.getElementById("calc-summary-capex-desc");
  if (elSumCapExDesc) elSumCapExDesc.textContent = `3 năm đầu: ${formatVND(paybackSurchargeFirst3Years)} | Sau 3 năm: ${formatVND(paybackSurchargeAfter3Years)} (-80%)`;

  // 10. Cập nhật Biểu Giá 2 Giai Đoạn (Two-stage Parallel Pricing Cards)
  const elPbBase = document.getElementById("calculated-payback-base-cost");
  if (elPbBase) elPbBase.textContent = paybackBaseCost.toLocaleString('vi-VN');
  const elPbSeller = document.getElementById("calculated-payback-seller-price");
  if (elPbSeller) elPbSeller.textContent = paybackSellerPrice.toLocaleString('vi-VN');

  const elPostBase = document.getElementById("calculated-post-payback-base-cost");
  if (elPostBase) elPostBase.textContent = postPaybackBaseCost.toLocaleString('vi-VN');
  const elPostSeller = document.getElementById("calculated-post-payback-seller-price");
  if (elPostSeller) elPostSeller.textContent = postPaybackSellerPrice.toLocaleString('vi-VN');

  const elContrib = document.getElementById("calculated-contribution-margin");
  if (elContrib) elContrib.textContent = `${formatVND(contributionMargin)} (Đảm phí: ${marginRatio}%)`;

  // Sticky Bar Badges
  const stickyPaybackBaseCostBadge = document.getElementById("sticky-payback-base-cost-badge");
  const stickyPaybackSellerPriceBadge = document.getElementById("sticky-payback-seller-price-badge");
  if (paybackSurchargeFirst3Years > 0) {
    if (stickyPaybackBaseCostBadge) {
      stickyPaybackBaseCostBadge.style.display = "inline";
      stickyPaybackBaseCostBadge.textContent = `(3 năm đầu: ₫${paybackBaseCost.toLocaleString('vi-VN')})`;
    }
    if (stickyPaybackSellerPriceBadge) {
      stickyPaybackSellerPriceBadge.style.display = "inline";
      stickyPaybackSellerPriceBadge.textContent = `(3 năm đầu: ₫${paybackSellerPrice.toLocaleString('vi-VN')})`;
    }
  } else {
    if (stickyPaybackBaseCostBadge) stickyPaybackBaseCostBadge.style.display = "none";
    if (stickyPaybackSellerPriceBadge) stickyPaybackSellerPriceBadge.style.display = "none";
  }

  // Breakdown percentages
  if (paybackBaseCost > 0) {
    const matPct = Math.round((materialsCost / paybackBaseCost) * 100);
    const labPct = Math.round((laborCost / paybackBaseCost) * 100);
    const ovhPct = Math.round((overheadCost / paybackBaseCost) * 100);
    const capexPct = 100 - matPct - labPct - ovhPct;

    document.getElementById("breakdown-materials").textContent = `${formatVND(materialsCost)} (${matPct}%)`;
    document.getElementById("breakdown-labor").textContent = `${formatVND(laborCost)} (${labPct}%)`;
    document.getElementById("breakdown-electricity").textContent = `₫0 (Đã tính vào Định phí xưởng)`;
    document.getElementById("breakdown-overhead").textContent = `${formatVND(overheadCost)} (${ovhPct}%)`;
  } else {
    document.getElementById("breakdown-materials").textContent = "₫0 (0%)";
    document.getElementById("breakdown-labor").textContent = "₫0 (0%)";
    document.getElementById("breakdown-electricity").textContent = "₫0 (0%)";
    document.getElementById("breakdown-overhead").textContent = "₫0 (0%)";
  }

  // Đồng bộ khối tính toán đơn hàng theo quy cách xếp khổ
  updateImpositionOrderCalc();

  // Cập nhật thẻ sản phẩm bên danh sách trái theo thời gian thực
  if (selectedProduct) {
    updateProductCardInList(selectedProduct);
  }
}

/**
 * Lưu dữ liệu của sản phẩm đang chỉnh sửa
 */
function saveProductCostForm(e) {
  e.preventDefault();
  
  const id = document.getElementById("form-product-id").value;
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  // Cập nhật thông tin cơ bản
  product.name = document.getElementById("product-name").value;
  product.code = document.getElementById("product-code").value;
  product.category = document.getElementById("product-category").value;
  product.factoryType = document.querySelector('input[name="factoryType"]:checked').value;

  // Cập nhật nguyên vật liệu, nhân công, điện năng, máy móc
  syncProductMaterialsFromDom(product);
  syncProductLaborFromDom(product);
  syncProductElectricityFromDom(product);
  syncProductMachinesFromDom(product);

  // Cập nhật overhead
  product.overheadPercentage = parseFloat(document.getElementById("overhead-rate-percentage").value) || 0;

  // Cập nhật tỷ lệ lợi nhuận
  product.profitPercentage = parseFloat(document.getElementById("profit-margin-percentage").value) || 0;

  // Cập nhật quy cách xếp khổ in nếu là Nhà máy In và có bật tùy chọn xếp khổ
  const hasLayoutChecked = document.getElementById("product-has-layout")?.checked;
  if (product.factoryType === "In" && hasLayoutChecked) {
    product.hasLayout = true;
    product.layout = {
      preset: document.getElementById("layout-preset")?.value || "",
      sheetSize: document.getElementById("layout-sheet-size")?.value || "",
      itemSize: document.getElementById("layout-item-size")?.value || "",
      itemsPerSheet: parseFloat(document.getElementById("layout-items-per-sheet")?.value) || 1,
      unitType: detectSheetUnit(document.getElementById("layout-sheet-size")?.value || "")
    };
  } else {
    product.hasLayout = false;
    product.layout = null;
  }

  // Lưu vào localStorage
  state.saveProducts();
  
  // Reload view
  renderCalculator();
  alert("Lưu thông tin sản phẩm thành công!");
}

function getDeletedProductIds() {
  try {
    const raw = localStorage.getItem("factory_deleted_product_ids");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function addDeletedProductId(id, code) {
  const list = getDeletedProductIds();
  if (id && !list.includes(id)) list.push(id);
  if (code && !list.includes(code)) list.push(code);
  localStorage.setItem("factory_deleted_product_ids", JSON.stringify(list));
}

function deleteProductById(productId) {
  if (!productId) return;
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const skuText = product.code ? `\n- Mã SKU: ${product.code}` : "";
  const confirmMsg = `Bạn có chắc chắn muốn xóa sản phẩm:\n"${product.name}"${skuText}\n\nSau khi xóa, sản phẩm này sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống và không tự động xuất hiện lại khi làm mới trang.`;
  if (confirm(confirmMsg)) {
    // 1. Add to permanent blacklist
    addDeletedProductId(product.id, product.code);

    // 2. Remove from state.products
    state.products = state.products.filter(p => p.id !== productId);

    // 3. Update selectedProductId: switch to first available product or null
    if (state.selectedProductId === productId) {
      state.selectedProductId = state.products.length > 0 ? state.products[0].id : null;
    }

    // 4. Save and sync
    state.saveProducts();

    // 5. Re-render views
    renderCalculator();
    if (typeof renderForecast === "function") renderForecast();
    if (typeof renderDashboard === "function") renderDashboard();
    if (typeof renderMonthlyReport === "function") renderMonthlyReport();

    alert(`Đã xóa thành công sản phẩm "${product.name}"!`);
  }
}

function deleteCurrentProduct() {
  if (!state.selectedProductId) {
    alert("Vui lòng chọn một sản phẩm trước khi xóa!");
    return;
  }
  deleteProductById(state.selectedProductId);
}

function cancelEditCalculator() {
  renderCalculator();
}

// ==========================================================================
// 6. Tab 3: Purchase Forecast & Planner View Rendering
// ==========================================================================

const SUPPLIER_CATALOG = [
  // Giấy
  { key: "Giấy Coucher A3 300gsm", name: "Giấy Coucher A3 300gsm", type: "giay", ncc: "Hoàng Kim Phát", packSize: 500, packUnit: "Tờ", packPrice: 450000 },
  { key: "Giấy Coucher A3 250gsm", name: "Giấy Coucher A3 250gsm", type: "giay", ncc: "Hoàng Kim Phát", packSize: 500, packUnit: "Tờ", packPrice: 396000 },
  { key: "Giấy Coucher A4 300gsm", name: "Giấy Coucher A4 300gsm", type: "giay", ncc: "Hoàng Kim Phát", packSize: 500, packUnit: "Tờ", packPrice: 230000 },
  { key: "Giấy Irovy 33x48cm 300gsm", name: "Giấy Irovy 33x48cm 300gsm", type: "giay", ncc: "Hoàng Kim Phát", packSize: 500, packUnit: "Tờ", packPrice: 470000 },
  
  // Decal
  { key: "Decal Sữa Mờ ThaiKK", name: "Decal Sữa Mờ ThaiKK 33x48cm", type: "decal", ncc: "ThaiKK", packSize: 5000, packUnit: "Tờ", packPrice: 14130072 },
  { key: "Decal Trong ThaiKK", name: "Decal Trong (Clear) ThaiKK 33x48cm", type: "decal", ncc: "ThaiKK", packSize: 2000, packUnit: "Tờ", packPrice: 5417280 },
  { key: "Decal Bạc Bóng ThaiKK", name: "Decal Bạc Bóng ThaiKK 33x35.4cm", type: "decal", ncc: "ThaiKK", packSize: 2000, packUnit: "Tờ", packPrice: 4626000 },
  { key: "Decal Kraft ThaiKK", name: "Decal Kraft ThaiKK 33x35.4cm", type: "decal", ncc: "ThaiKK", packSize: 2000, packUnit: "Tờ", packPrice: 2290000 },
  { key: "Decal Sữa Mờ An Nam", name: "Decal Sữa Mờ An Nam 33x48cm", type: "decal", ncc: "An Nam", packSize: 3000, packUnit: "Tờ", packPrice: 18000000 },
  { key: "Decal Trong An Nam", name: "Decal Trong (Clear) An Nam 33x48cm", type: "decal", ncc: "An Nam", packSize: 3000, packUnit: "Tờ", packPrice: 18000000 },

  // UV-DTF
  { key: "Màng A (pet in UV-DTF)", name: "Màng A (pet in UV-DTF)", type: "uv", ncc: "SBC", packSize: 100, packUnit: "Mét", packPrice: 1444600 },
  { key: "Màng B (cán định hình UV-DTF)", name: "Màng B (cán định hình UV-DTF)", type: "uv", ncc: "SBC", packSize: 100, packUnit: "Mét", packPrice: 1444600 },

  // Màng cán
  { key: "Màng Nhiệt Bóng 20MIC", name: "Màng Nhiệt Bóng 20MIC", type: "mang_can", ncc: "An Nhân", packSize: 1500, packUnit: "Mét", packPrice: 980000 },
  { key: "Màng Nhiệt Mờ 20MIC", name: "Màng Nhiệt Mờ 20MIC", type: "mang_can", ncc: "An Nhân", packSize: 1500, packUnit: "Mét", packPrice: 1020000 },
  { key: "Màng Nguội Bóng OPAT", name: "Màng Nguội Bóng OPAT", type: "mang_can", ncc: "An Nhân", packSize: 500, packUnit: "Mét", packPrice: 800000 },
  { key: "Màng Nguội Mờ OPAM", name: "Màng Nguội Mờ OPAM", type: "mang_can", ncc: "An Nhân", packSize: 400, packUnit: "Mét", packPrice: 800000 },
  { key: "Màng Nhiệt Mờ Chống Xước 28MIC", name: "Màng Nhiệt Mờ Chống Xước 28MIC", type: "mang_can", ncc: "An Nhân", packSize: 1000, packUnit: "Mét", packPrice: 1500000 },
  { key: "Màng Kim Tuyến", name: "Màng Kim Tuyến", type: "mang_can", ncc: "An Nam", packSize: 50, packUnit: "Mét", packPrice: 600000 },
  { key: "Màng Hologram Ngôi Sao Nổ", name: "Màng Hologram Ngôi Sao Nổ", type: "mang_can", ncc: "Vương Yến", packSize: 50, packUnit: "Mét", packPrice: 445000 }
];

function findSupplierProduct(bomMatName) {
  const name = bomMatName.toLowerCase();
  
  if (name.includes("c300gsm") || name.includes("coucher a3 300gsm")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Giấy Coucher A3 300gsm");
  }
  if (name.includes("c250gsm") || name.includes("coucher a3 250gsm")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Giấy Coucher A3 250gsm");
  }
  if (name.includes("coucher a4")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Giấy Coucher A4 300gsm");
  }
  if (name.includes("irovy") || name.includes("ivory")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Giấy Irovy 33x48cm 300gsm");
  }
  if (name.includes("decal sữa") && name.includes("thai")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Decal Sữa Mờ ThaiKK");
  }
  if (name.includes("decal sữa") && name.includes("nam")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Decal Sữa Mờ An Nam");
  }
  if (name.includes("decal sữa") && !name.includes("thai") && !name.includes("nam")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Decal Sữa Mờ ThaiKK");
  }
  if (name.includes("decal trong") && name.includes("thai")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Decal Trong ThaiKK");
  }
  if (name.includes("decal trong") && name.includes("nam")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Decal Trong An Nam");
  }
  if (name.includes("màng a")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng A (pet in UV-DTF)");
  }
  if (name.includes("màng b")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng B (cán định hình UV-DTF)");
  }
  if (name.includes("opam") || name.includes("màng nguội mờ opam")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng Nguội Mờ OPAM");
  }
  if (name.includes("opat")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng Nguội Bóng OPAT");
  }
  if (name.includes("bóng 20mic")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng Nhiệt Bóng 20MIC");
  }
  if (name.includes("mờ 20mic")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng Nhiệt Mờ 20MIC");
  }
  if (name.includes("chống xước")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng Nhiệt Mờ Chống Xước 28MIC");
  }
  if (name.includes("kim tuyến")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng Kim Tuyến");
  }
  if (name.includes("hologram")) {
    return SUPPLIER_CATALOG.find(p => p.key === "Màng Hologram Ngôi Sao Nổ");
  }
  
  for (let item of SUPPLIER_CATALOG) {
    if (name.includes(item.key.toLowerCase())) {
      return item;
    }
  }
  return null;
}

function renderMaterialRequirements() {
  const tbody = document.getElementById("mrp-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const materialMap = {};

  // Explode BOM for all products
  state.products.forEach(p => {
    const costDetails = calculateProductCost(p, state.settings);
    const actual = p.forecast.actualSales || 0;
    const salesForecast = Math.round(actual * 1.1);
    const neededQty = Math.max(0, salesForecast + (p.forecast.safetyStock || 0) - (p.forecast.currentStock || 0));

    if (neededQty > 0 && p.materials && Array.isArray(p.materials)) {
      p.materials.forEach(mat => {
        const key = mat.name.trim();
        if (!key) return;

        const reqQty = mat.qty * neededQty;

        if (!materialMap[key]) {
          materialMap[key] = {
            name: mat.name,
            unit: mat.unit,
            price: mat.price,
            totalQty: 0
          };
        }
        materialMap[key].totalQty += reqQty;
      });
    }
  });

  const materialsList = Object.values(materialMap);
  let totalMrpCost = 0;

  if (materialsList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="no-data">Không có nhu cầu nguyên vật liệu nào (chưa có sản phẩm nào cần đặt mua).</td></tr>`;
    document.getElementById("mrp-summary-total-cost").textContent = formatVND(0);
    return;
  }

  const processedList = materialsList.map(mat => {
    const nameLower = mat.name.toLowerCase();
    const isClick = nameLower.includes("click") || nameLower.includes("in konica") || nameLower.includes("in hộp") || nameLower.includes("in dải cuốn");
    
    let ncc = "Nhà CC khác";
    let packSize = 1;
    let packUnit = mat.unit;
    let packPrice = mat.price;
    
    if (isClick) {
      ncc = "Nội bộ (Click máy)";
      packSize = 1;
      packUnit = mat.unit;
      packPrice = mat.price;
    } else {
      const match = findSupplierProduct(mat.name);
      if (match) {
        ncc = match.ncc;
        packSize = match.packSize;
        packUnit = match.packUnit;
        packPrice = match.packPrice;
      }
    }

    const numPacks = Math.ceil(mat.totalQty / packSize);
    const roundedQty = numPacks * packSize;
    const matTotalCost = numPacks * packPrice;

    return {
      name: mat.name,
      unit: mat.unit,
      totalQty: mat.totalQty,
      ncc,
      packSize,
      packUnit,
      packPrice,
      numPacks,
      roundedQty,
      matTotalCost
    };
  });

  processedList.sort((a, b) => b.matTotalCost - a.matTotalCost);

  processedList.forEach(mat => {
    totalMrpCost += mat.matTotalCost;
    
    let specStr = `${mat.packSize.toLocaleString('vi-VN')} ${mat.packUnit}`;
    if (mat.packSize === 1) specStr = `Mua lẻ (${mat.packUnit})`;
    
    let orderStr = "";
    if (mat.packSize === 1) {
      orderStr = `<span class="badge" style="background: rgba(147, 51, 234, 0.1); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${Math.round(mat.totalQty).toLocaleString('vi-VN')} ${mat.unit}</span>`;
    } else {
      const unitLabel = mat.packUnit === 'Tờ' ? 'Lô' : 'Cuộn';
      orderStr = `<span class="badge" style="background: rgba(52, 211, 153, 0.1); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${mat.numPacks.toLocaleString('vi-VN')} ${unitLabel}</span>
                  <span style="font-size: 0.72rem; color: var(--text-secondary); display: block; margin-top: 0.15rem;">(= ${mat.roundedQty.toLocaleString('vi-VN')} ${mat.unit})</span>`;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <strong style="color: #f8fafc;">${mat.name}</strong>
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.15rem;">ĐVT gốc: ${mat.unit}</div>
      </td>
      <td><span style="font-size: 0.85rem; color: #a5b4fc; font-weight: 500;">${mat.ncc}</span></td>
      <td class="text-center" style="text-align: center; font-size: 0.85rem; color: #cbd5e1;">${specStr}</td>
      <td class="text-right" style="text-align: right; font-size: 0.85rem;">${mat.totalQty.toLocaleString('vi-VN', {maximumFractionDigits:2})} ${mat.unit}</td>
      <td class="text-center" style="text-align: center;">${orderStr}</td>
      <td class="text-right" style="text-align: right; font-size: 0.85rem; color: #cbd5e1;">${formatVND(mat.packPrice)}</td>
      <td class="text-right font-bold" style="text-align: right; color: #f8fafc; font-size: 0.9rem;">${formatVND(mat.matTotalCost)}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("mrp-summary-total-cost").textContent = formatVND(totalMrpCost);
}

function renderActualMaterialConsumption() {
  const tbody = document.getElementById("consumption-table-tbody");
  if (!tbody) return 0;
  tbody.innerHTML = "";

  const materialMap = {};

  // Explode BOM based on July actualSales
  state.products.forEach(p => {
    const actual = p.forecast.actualSales || 0;
    if (actual > 0 && p.materials && Array.isArray(p.materials)) {
      p.materials.forEach(mat => {
        const key = mat.name.trim();
        if (!key) return;

        const reqQty = mat.qty * actual;

        if (!materialMap[key]) {
          materialMap[key] = {
            name: mat.name,
            unit: mat.unit,
            price: mat.price,
            totalQty: 0
          };
        }
        materialMap[key].totalQty += reqQty;
      });
    }
  });

  const materialsList = Object.values(materialMap);
  let totalSpentCost = 0;

  if (materialsList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="no-data">Không có tiêu hao nguyên vật liệu nào (chưa nhập sản lượng bán tháng này).</td></tr>`;
    const sumEl = document.getElementById("consumption-summary-total-cost");
    if (sumEl) sumEl.textContent = formatVND(0);
    return 0;
  }

  const processedList = materialsList.map(mat => {
    const nameLower = mat.name.toLowerCase();
    const isClick = nameLower.includes("click") || nameLower.includes("in konica") || nameLower.includes("in hộp") || nameLower.includes("in dải cuốn");
    
    let ncc = "Nhà CC khác";
    if (isClick) {
      ncc = "Nội bộ (Click máy)";
    } else {
      const match = findSupplierProduct(mat.name);
      if (match) {
        ncc = match.ncc;
      }
    }

    const matTotalCost = mat.totalQty * mat.price;

    return {
      name: mat.name,
      unit: mat.unit,
      totalQty: mat.totalQty,
      ncc,
      price: mat.price,
      matTotalCost
    };
  });

  processedList.sort((a, b) => b.matTotalCost - a.matTotalCost);

  processedList.forEach(mat => {
    totalSpentCost += mat.matTotalCost;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <strong style="color: #f8fafc;">${mat.name}</strong>
      </td>
      <td><span style="font-size: 0.85rem; color: #a5b4fc; font-weight: 500;">${mat.ncc}</span></td>
      <td class="text-center" style="text-align: center; font-size: 0.85rem; color: #cbd5e1;">${mat.unit}</td>
      <td class="text-right" style="text-align: right; font-size: 0.85rem; font-weight: 600; color: #f59e0b;">${mat.totalQty.toLocaleString('vi-VN', {maximumFractionDigits:4})}</td>
      <td class="text-right" style="text-align: right; font-size: 0.85rem; color: #cbd5e1;">${formatVND(mat.price)}</td>
      <td class="text-right font-bold" style="text-align: right; color: #f8fafc; font-size: 0.9rem;">${formatVND(mat.matTotalCost)}</td>
    `;
    tbody.appendChild(tr);
  });

  const sumEl = document.getElementById("consumption-summary-total-cost");
  if (sumEl) sumEl.textContent = formatVND(totalSpentCost);
  
  return totalSpentCost;
}

function renderForecast() {
  const searchVal = document.getElementById("forecast-search").value.toLowerCase();
  const filterFactory = document.getElementById("forecast-filter-factory").value;
  const filterCategory = document.getElementById("forecast-filter-category") ? document.getElementById("forecast-filter-category").value : "all";

  const tbody = document.getElementById("forecast-table-tbody");
  tbody.innerHTML = "";

  const filteredProducts = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || 
                          (p.code && p.code.toLowerCase().includes(searchVal)) ||
                          (p.category && p.category.toLowerCase().includes(searchVal));
    const matchesFactory = filterFactory === "all" || p.factoryType === filterFactory;
    const catInfo = getCategoryInfo(p.category);
    const matchesCategory = filterCategory === "all" || catInfo.id === filterCategory;
    return matchesSearch && matchesFactory && matchesCategory;
  });

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="no-data">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
    recalculateForecastTotals();
    return;
  }

  filteredProducts.forEach(p => {
    const costDetails = calculateProductCost(p, state.settings);
    const catInfo = getCategoryInfo(p.category);
    const actualSales = p.forecast.actualSales || 0;
    const salesForecast = Math.round(actualSales * 1.1); // Auto grow by 10%
    p.forecast.salesForecast = salesForecast; // Sync in memory
    
    const neededQty = Math.max(0, salesForecast + (p.forecast.safetyStock || 0) - (p.forecast.currentStock || 0));
    const totalBudget = neededQty * costDetails.baseCost;

    const tr = document.createElement("tr");
    tr.dataset.productId = p.id;

    tr.innerHTML = `
      <td>
        <div class="font-semibold" style="color: #f8fafc;">${p.name}</div>
        <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.15rem;">
          <span class="text-secondary text-xs" style="font-family: monospace;">${p.code || 'SKU trống'}</span>
          <span style="font-size: 0.65rem; padding: 0.05rem 0.35rem; border-radius: 4px; background: rgba(99,102,241,0.15); color: #a5b4fc;">${catInfo.icon} ${catInfo.name.split('(')[0].trim()}</span>
        </div>
      </td>
      <td>
        <span class="table-row-factory type-${p.factoryType === "In" ? "print" : "embroid"}">
          ${p.factoryType === "In" ? "In ấn" : "Thêu dệt"}
        </span>
      </td>
      <td>
        <div style="font-size:0.75rem; color:var(--text-secondary);">Vốn: <strong>${formatVND(costDetails.baseCost)}</strong></div>
        <div style="font-size:0.75rem; color:#34d399;">Seller: <strong>${formatVND(costDetails.sellerPrice)}</strong></div>
      </td>
      <td>
        <input type="number" min="0" value="${actualSales}" class="form-input text-center row-actual-sales" style="min-height:36px; max-width:90px; margin: 0 auto;">
      </td>
      <td class="font-semibold text-center row-sales-forecast" style="text-align: center; color: #a5b4fc;">
        ${salesForecast.toLocaleString('vi-VN')}
      </td>
      <td>
        <input type="number" min="0" value="${p.forecast.currentStock || 0}" class="form-input text-center row-current-stock" style="min-height:36px; max-width:90px; margin: 0 auto;">
      </td>
      <td>
        <input type="number" min="0" value="${p.forecast.safetyStock || 0}" class="form-input text-center row-safety-stock" style="min-height:36px; max-width:90px; margin: 0 auto;">
      </td>
      <td class="font-semibold text-center row-buy-qty" style="text-align: center;">
        ${neededQty.toLocaleString('vi-VN')}
      </td>
      <td class="font-bold text-right row-buy-total" style="text-align: right; min-width:120px;">
        ${formatVND(totalBudget)}
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.35rem; justify-content: flex-end;">
          <button type="button" class="btn btn-xs btn-outline btn-go-calc" title="Sửa chi tiết giá thành">Sửa giá</button>
          <button type="button" class="btn btn-xs btn-outline btn-delete-row-product" title="Xóa sản phẩm" style="color: #f87171; border-color: rgba(239,68,68,0.35); padding: 0.2rem 0.45rem;">🗑️</button>
        </div>
      </td>
    `;

    // Go to Cost calculator tab for that product
    tr.querySelector(".btn-go-calc").addEventListener("click", () => {
      state.selectedProductId = p.id;
      switchTab("calculator");
    });

    // Delete product from table
    tr.querySelector(".btn-delete-row-product").addEventListener("click", () => {
      deleteProductById(p.id);
    });

    // Reactive input listeners inside Table
    const actualInput = tr.querySelector(".row-actual-sales");
    const currentInput = tr.querySelector(".row-current-stock");
    const safetyInput = tr.querySelector(".row-safety-stock");

    const updateRowCalc = () => {
      const actual = Math.max(0, parseInt(actualInput.value, 10) || 0);
      const current = Math.max(0, parseInt(currentInput.value, 10) || 0);
      const safety = Math.max(0, parseInt(safetyInput.value, 10) || 0);

      // Auto-grow forecast by 10% (rounded)
      const forecast = Math.round(actual * 1.1);

      // Save to state in memory
      p.forecast.actualSales = actual;
      p.forecast.salesForecast = forecast;
      p.forecast.currentStock = current;
      p.forecast.safetyStock = safety;
      state.saveProducts();

      // Recalculate row quantities
      const qtyNeeded = Math.max(0, forecast + safety - current);
      const budget = qtyNeeded * costDetails.baseCost;

      // Update cells
      tr.querySelector(".row-sales-forecast").textContent = forecast.toLocaleString('vi-VN');
      tr.querySelector(".row-buy-qty").textContent = qtyNeeded.toLocaleString('vi-VN');
      tr.querySelector(".row-buy-total").textContent = formatVND(budget);

      // Recalculate totals
      recalculateForecastTotals();
    };

    actualInput.addEventListener("input", updateRowCalc);
    currentInput.addEventListener("input", updateRowCalc);
    safetyInput.addEventListener("input", updateRowCalc);

    tbody.appendChild(tr);
  });

  // Calculate and update metrics
  recalculateForecastTotals();
}

function updateDynamicForecastMonths() {
  const currentDate = new Date();
  const currentMonthNum = currentDate.getMonth() + 1;
  const lastMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1;
  
  const labelFactory = document.getElementById("label-factory-revenue");
  if (labelFactory) labelFactory.textContent = `Doanh Thu Nhà Máy (Tháng ${lastMonthNum})`;
  
  const labelSeller = document.getElementById("label-seller-revenue");
  if (labelSeller) labelSeller.textContent = `Doanh Thu Seller (Tháng ${lastMonthNum})`;
  
  const labelSpent = document.getElementById("label-spent-materials");
  if (labelSpent) labelSpent.textContent = `Vật tư đã tiêu hao (Tháng ${lastMonthNum})`;
  
  const labelForecast = document.getElementById("label-forecast-budget");
  if (labelForecast) labelForecast.textContent = `Tổng Ngân Sách Mua (Tháng ${currentMonthNum})`;
  
  const thActualSales = document.getElementById("th-actual-sales");
  if (thActualSales) thActualSales.textContent = `Sản lượng bán (Tháng ${lastMonthNum})`;
  
  const thForecastSales = document.getElementById("th-forecast-sales");
  if (thForecastSales) thForecastSales.textContent = `Dự báo bán (Tháng ${currentMonthNum})`;
  
  const titleConsumption = document.getElementById("title-consumption-report");
  if (titleConsumption) titleConsumption.textContent = `Báo Cáo Vật Tư Tiêu Hao Thực Tế (Tháng ${lastMonthNum})`;
  
  const titleMRP = document.getElementById("title-mrp-report");
  if (titleMRP) titleMRP.textContent = `Kế Hoạch Mua Hàng Chuẩn Bị Cho Tháng ${currentMonthNum} (MRP)`;

  const alertBannerText = document.getElementById("alert-banner-text");
  if (alertBannerText) {
    alertBannerText.innerHTML = `Hôm nay là <strong>Tháng ${currentMonthNum}/${currentDate.getFullYear()}</strong>. Vui lòng nhập <strong>Sản lượng bán thực tế của Tháng ${lastMonthNum}</strong> vào bảng bên dưới để hệ thống tính toán chi tiêu nguyên liệu và dự đoán mua thêm vật liệu cho <strong>Tháng ${currentMonthNum}</strong>.`;
  }
}

function recalculateForecastTotals() {
  updateDynamicForecastMonths();
  let totalFactoryRevenue = 0;
  let totalSellerRevenue = 0;
  let totalForecastBudget = 0;
  let totalForecastQty = 0;
  let totalActualSalesQty = 0;
  let itemsCount = 0;

  let factoryRevenueIn = 0;
  let factoryRevenueEmb = 0;
  let sellerRevenueIn = 0;
  let sellerRevenueEmb = 0;

  state.products.forEach(p => {
    const costDetails = calculateProductCost(p, state.settings);
    
    // Revenue calculations (based on actualSales)
    const actual = p.forecast.actualSales || 0;
    const prodFactoryRev = actual * costDetails.baseCost;
    const prodSellerRev = actual * costDetails.sellerPrice;

    totalFactoryRevenue += prodFactoryRev;
    totalSellerRevenue += prodSellerRev;
    totalActualSalesQty += actual;

    if (p.factoryType === "In") {
      factoryRevenueIn += prodFactoryRev;
      sellerRevenueIn += prodSellerRev;
    } else {
      factoryRevenueEmb += prodFactoryRev;
      sellerRevenueEmb += prodSellerRev;
    }

    // Purchase calculations (based on salesForecast grown by 10%)
    const salesForecast = Math.round(actual * 1.1);
    const neededQty = Math.max(0, salesForecast + (p.forecast.safetyStock || 0) - (p.forecast.currentStock || 0));
    totalForecastBudget += neededQty * costDetails.baseCost;
    totalForecastQty += neededQty;
    itemsCount++;
  });

  // Update Metric Cards
  document.getElementById("forecast-factory-revenue").textContent = formatVND(totalFactoryRevenue);
  document.getElementById("forecast-factory-revenue-print-emb").textContent = `In: ${formatVND(factoryRevenueIn)} | Thêu: ${formatVND(factoryRevenueEmb)}`;

  document.getElementById("forecast-seller-revenue").textContent = formatVND(totalSellerRevenue);
  document.getElementById("forecast-seller-revenue-print-emb").textContent = `In: ${formatVND(sellerRevenueIn)} | Thêu: ${formatVND(sellerRevenueEmb)}`;

  // Render actual material consumption
  const spentMaterialsCost = renderActualMaterialConsumption();
  const spentCard = document.getElementById("forecast-spent-materials-cost");
  if (spentCard) spentCard.textContent = formatVND(spentMaterialsCost);
  const spentCountCard = document.getElementById("forecast-spent-materials-items-count");
  if (spentCountCard) spentCountCard.textContent = `Tổng bán: ${totalActualSalesQty.toLocaleString('vi-VN')} cái`;

  document.getElementById("forecast-summary-total-cost").textContent = formatVND(totalForecastBudget);
  document.getElementById("forecast-summary-items-count").textContent = `(${itemsCount} sản phẩm, ${totalForecastQty.toLocaleString('vi-VN')} cái)`;
  
  // Render material requirements list
  renderMaterialRequirements();
}

// ==========================================================================
// 6.4. Tab: Capex & Straight-Line Depreciation Engine (v24.1)
// ==========================================================================

/**
 * Tính toán khấu hao đường thẳng (Straight-Line Depreciation) cho 1 thiết bị máy móc
 * Công thức: Khấu hao tháng = Vốn đầu tư / (Số năm * 12 tháng)
 */
function calculateStraightLineDepreciation(machine) {
  const years = parseFloat(machine.paybackYears) || 3;
  const months = Math.round(years * 12);
  const investment = parseFloat(machine.investment) || 0;
  const monthlyDepreciation = months > 0 ? Math.round(investment / months) : 0;
  const dailyDepreciation = Math.round(monthlyDepreciation / 26); // 26 ngày làm việc/tháng
  const standardHours = state.settings.standardHours || 208;
  const hourlyDepreciation = Math.round(monthlyDepreciation / standardHours); // 208 giờ công/tháng

  return {
    years,
    months,
    investment,
    monthlyDepreciation,
    yearlyDepreciation: monthlyDepreciation * 12,
    dailyDepreciation,
    hourlyDepreciation
  };
}

function renderCapexView() {
  const tbody = document.getElementById("capex-table-tbody");
  if (!tbody) return;

  const machines = state.settings.machines || [];
  
  // 1. Tính toán tổng toàn bộ máy móc (74 máy - 9.175.590.182 đ)
  const totalMachines = machines.reduce((sum, m) => sum + (parseInt(m.quantity) || 1), 0);
  const totalInvestment = machines.reduce((sum, m) => sum + (parseFloat(m.investment) || 0), 0);
  const totalMonthly = machines.reduce((sum, m) => sum + calculateStraightLineDepreciation(m).monthlyDepreciation, 0);
  const totalYearly = totalMonthly * 12;
  const totalDaily = Math.round(totalMonthly / 26);
  const standardHours = state.settings.standardHours || 208;
  const totalHourly = Math.round(totalMonthly / standardHours);

  // Update Top KPI Cards
  const kpiTotalInv = document.getElementById("capex-kpi-total-inv");
  if (kpiTotalInv) kpiTotalInv.textContent = formatVND(totalInvestment);

  const kpiTotalMachines = document.getElementById("capex-kpi-total-machines");
  if (kpiTotalMachines) kpiTotalMachines.textContent = `${totalMachines} thiết bị`;

  const kpiMonthly = document.getElementById("capex-kpi-monthly");
  if (kpiMonthly) kpiMonthly.textContent = formatVND(totalMonthly);

  const kpiYearly = document.getElementById("capex-kpi-yearly");
  if (kpiYearly) kpiYearly.textContent = formatVND(totalYearly);

  const kpiDaily = document.getElementById("capex-kpi-daily");
  if (kpiDaily) kpiDaily.textContent = formatVND(totalDaily);

  // 2. Tính toán phân bổ 3 phân xưởng
  const theuMachines = machines.filter(m => m.factoryType === "Thêu" || m.category === "Thêu & Laser");
  const theuMonthly = theuMachines.reduce((sum, m) => sum + calculateStraightLineDepreciation(m).monthlyDepreciation, 0);
  const elTheuMonthly = document.getElementById("capex-workshop-theu-monthly");
  if (elTheuMonthly) {
    elTheuMonthly.innerHTML = `${formatVND(theuMonthly)}<span style="font-size: 0.72rem; font-weight: 400; color: var(--text-secondary);">/tháng</span>`;
  }

  const inMachines = machines.filter(m => m.factoryType === "In" || m.category === "In, Cắt & Hoàn Thiện");
  const inMonthly = inMachines.reduce((sum, m) => sum + calculateStraightLineDepreciation(m).monthlyDepreciation, 0);
  const elInMonthly = document.getElementById("capex-workshop-in-monthly");
  if (elInMonthly) {
    elInMonthly.innerHTML = `${formatVND(inMonthly)}<span style="font-size: 0.72rem; font-weight: 400; color: var(--text-secondary);">/tháng</span>`;
  }

  const bambuMachines = machines.filter(m => m.factoryType === "In 3D" || m.category === "Máy in 3D");
  const bambuMonthly = bambuMachines.reduce((sum, m) => sum + calculateStraightLineDepreciation(m).monthlyDepreciation, 0);
  const elBambuMonthly = document.getElementById("capex-workshop-3d-monthly");
  if (elBambuMonthly) {
    elBambuMonthly.innerHTML = `${formatVND(bambuMonthly)}<span style="font-size: 0.72rem; font-weight: 400; color: var(--text-secondary);">/tháng</span>`;
  }

  // 3. Lọc danh sách máy theo Tab filter & Ô tìm kiếm
  const activeCategory = state.capexState.filterCategory || "all";
  const searchQuery = (state.capexState.searchQuery || "").trim().toLowerCase();

  let filtered = machines.filter(m => {
    const cat = m.category || (m.factoryType === "Thêu" ? "Thêu & Laser" : (m.factoryType === "In 3D" ? "Máy in 3D" : "In, Cắt & Hoàn Thiện"));
    if (activeCategory !== "all" && cat !== activeCategory) {
      return false;
    }
    if (searchQuery) {
      const matchName = (m.name || "").toLowerCase().includes(searchQuery);
      const matchId = (m.id || "").toLowerCase().includes(searchQuery);
      const matchCat = cat.toLowerCase().includes(searchQuery);
      if (!matchName && !matchId && !matchCat) return false;
    }
    return true;
  });

  // Render Table Rows
  tbody.innerHTML = "";
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          Không tìm thấy máy móc nào phù hợp với bộ lọc hiện tại.
        </td>
      </tr>
    `;
  } else {
    let filteredQty = 0;
    let filteredInv = 0;
    let filteredMonthly = 0;
    let filteredDaily = 0;
    let filteredHourly = 0;

    filtered.forEach((m, idx) => {
      const dep = calculateStraightLineDepreciation(m);
      const qty = parseInt(m.quantity) || 1;
      filteredQty += qty;
      filteredInv += dep.investment;
      filteredMonthly += dep.monthlyDepreciation;
      filteredDaily += dep.dailyDepreciation;
      filteredHourly += dep.hourlyDepreciation;

      const cat = m.category || (m.factoryType === "Thêu" ? "Thêu & Laser" : (m.factoryType === "In 3D" ? "Máy in 3D" : "In, Cắt & Hoàn Thiện"));
      let badgeStyle = "background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);";
      if (cat === "Thêu & Laser") {
        badgeStyle = "background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);";
      } else if (cat === "Máy in 3D") {
        badgeStyle = "background: rgba(52, 211, 153, 0.15); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3);";
      }

      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid rgba(255,255,255,0.04)";
      tr.style.transition = "background-color 0.15s ease";
      tr.onmouseenter = () => tr.style.backgroundColor = "rgba(255,255,255,0.02)";
      tr.onmouseleave = () => tr.style.backgroundColor = "transparent";

      tr.innerHTML = `
        <td style="padding: 0.75rem 0.6rem; text-align: center; color: var(--text-muted); font-size: 0.75rem;">${idx + 1}</td>
        <td style="padding: 0.75rem 0.6rem;">
          <strong style="color: #fff; font-size: 0.82rem;">${m.name}</strong>
          ${m.unitPrice ? `<div style="font-size: 0.7rem; color: var(--text-secondary);">Đơn giá: ${formatVND(m.unitPrice)} / máy</div>` : ""}
        </td>
        <td style="padding: 0.75rem 0.6rem;">
          <span style="display: inline-block; padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.7rem; font-weight: 500; ${badgeStyle}">
            ${cat}
          </span>
        </td>
        <td style="padding: 0.75rem 0.6rem; text-align: center; font-weight: 600; color: #fff;">
          ${qty}
        </td>
        <td style="padding: 0.75rem 0.6rem; text-align: right; font-weight: 600; color: #e2e8f0;">
          ${formatVND(dep.investment)}
        </td>
        <td style="padding: 0.75rem 0.6rem; text-align: center; font-size: 0.75rem; color: var(--text-secondary);">
          ${dep.years} năm (${dep.months} th)
        </td>
        <td style="padding: 0.75rem 0.6rem; text-align: right; font-weight: 700; color: #fbbf24; font-size: 0.85rem;">
          ${formatVND(dep.monthlyDepreciation)}
        </td>
        <td style="padding: 0.75rem 0.6rem; text-align: right; color: #34d399; font-size: 0.78rem;">
          ${formatVND(dep.dailyDepreciation)}
        </td>
        <td style="padding: 0.75rem 0.6rem; text-align: right; color: #a78bfa; font-size: 0.78rem;">
          ${formatVND(dep.hourlyDepreciation)}
        </td>
        <td style="padding: 0.75rem 0.6rem; text-align: center;">
          <div style="display: flex; gap: 0.35rem; justify-content: center;">
            <button type="button" class="btn btn-xs btn-primary capex-table-edit-btn" data-id="${m.id}" title="Sửa thông số hoặc cộng dồn vốn máy" style="padding: 0.2rem 0.45rem; font-size: 0.7rem; background: #4f46e5; border-color: #6366f1;">
              ✏️ Sửa
            </button>
            <button type="button" class="btn btn-xs btn-danger capex-table-del-btn" data-id="${m.id}" title="Xóa máy này khỏi hệ thống" style="padding: 0.2rem 0.4rem; font-size: 0.7rem;">
              🗑️
            </button>
          </div>
        </td>
      `;

      tr.querySelector(".capex-table-edit-btn").addEventListener("click", () => {
        openEditCapexModal(m);
      });

      tr.querySelector(".capex-table-del-btn").addEventListener("click", () => {
        if (confirm(`Bạn có chắc chắn muốn xóa máy móc "${m.name}" không?\n\nSau khi xóa, máy này sẽ bị gỡ bỏ khỏi hệ thống CAPEX và đồng bộ lên Cloud.`)) {
          state.settings.machines = state.settings.machines.filter(x => x.id !== m.id);
          
          let productsModified = false;
          state.products.forEach(p => {
            if (p.paybackMachines && Array.isArray(p.paybackMachines)) {
              const beforeLen = p.paybackMachines.length;
              p.paybackMachines = p.paybackMachines.filter(item => item.machineId !== m.id);
              if (p.paybackMachines.length !== beforeLen) {
                productsModified = true;
                p.paybackMachineId = p.paybackMachines[0]?.machineId || null;
                p.paybackMachineQty = p.paybackMachines[0]?.qty || 0;
              }
            } else if (p.paybackMachineId === m.id) {
              p.paybackMachineId = null;
              productsModified = true;
            }
          });
          if (productsModified) {
            state.saveProducts();
          }

          state.saveSettings(state.settings);
          renderCapexView();
          renderSettingsPaybackList();
          renderCalculator();
          recalculateForecastTotals();
          updateDashboard();
        }
      });

      tbody.appendChild(tr);
    });

    // Update Footers
    const footQty = document.getElementById("capex-foot-qty");
    if (footQty) footQty.textContent = `${filteredQty} máy`;

    const footInv = document.getElementById("capex-foot-total-inv");
    if (footInv) footInv.textContent = formatVND(filteredInv);

    const footMonthly = document.getElementById("capex-foot-monthly");
    if (footMonthly) footMonthly.textContent = formatVND(filteredMonthly);

    const footDaily = document.getElementById("capex-foot-daily");
    if (footDaily) footDaily.textContent = formatVND(filteredDaily);

    const footHourly = document.getElementById("capex-foot-hourly");
    if (footHourly) footHourly.textContent = formatVND(filteredHourly);
  }

  // Bind Toolbar Event Handlers (Only once or update state)
  const filterBtns = document.querySelectorAll(".capex-tab-filter");
  filterBtns.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-cat") === activeCategory);
    btn.onclick = () => {
      state.capexState.filterCategory = btn.getAttribute("data-cat");
      renderCapexView();
    };
  });

  const searchInput = document.getElementById("capex-search-input");
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = "true";
    searchInput.value = state.capexState.searchQuery || "";
    searchInput.addEventListener("input", (e) => {
      state.capexState.searchQuery = e.target.value;
      renderCapexView();
    });
  }

  const btnAdd = document.getElementById("btn-add-new-machine");
  if (btnAdd && !btnAdd.dataset.bound) {
    btnAdd.dataset.bound = "true";
    btnAdd.addEventListener("click", () => {
      openEditCapexModal(null);
    });
  }
}

// ==========================================================================
// 6.5. Tab: Monthly Financial Report (Báo Cáo Chi Phí & Doanh Thu Từng Tháng)
// ==========================================================================

function getStandardPayrollTotals() {
  const inHr = state.settings.hr?.In || {};
  const embHr = state.settings.hr?.Thêu || {};
  const sumSalary = (deptList) => (Array.isArray(deptList) ? deptList.reduce((acc, emp) => acc + (parseFloat(emp.salary) || 0), 0) : 0);
  const inSalaryTotal = sumSalary(inHr.designer) + sumSalary(inHr.production) + sumSalary(inHr.qc);
  const embSalaryTotal = sumSalary(embHr.designer) + sumSalary(embHr.laser) + sumSalary(embHr.production) + sumSalary(embHr.qc);
  return { inSalaryTotal, embSalaryTotal };
}

function renderMonthlyReport(isLiveInput = false) {
  const monthSelect = document.getElementById("monthly-report-select");
  const month = monthSelect ? monthSelect.value : "7";
  const filterFactory = document.getElementById("monthly-report-filter-factory")?.value || "all";
  const tbody = document.getElementById("monthly-report-tbody");
  if (!tbody) return;

  // 1. Lấy hoặc khởi tạo monthlyRecord cho tháng này
  if (!state.settings.monthlyRecords) {
    state.settings.monthlyRecords = {};
  }
  const stdPayroll = getStandardPayrollTotals();
  const defaultInElec = state.settings.monthlyElectricity?.In !== undefined ? state.settings.monthlyElectricity.In : 8000000;
  const defaultEmbElec = state.settings.monthlyElectricity?.Thêu !== undefined ? state.settings.monthlyElectricity.Thêu : 11000000;

  if (!state.settings.monthlyRecords[month]) {
    state.settings.monthlyRecords[month] = {
      name: `Tháng ${month}/2026`,
      electricity: { In: defaultInElec, Thêu: defaultEmbElec },
      salary: { In: stdPayroll.inSalaryTotal, Thêu: stdPayroll.embSalaryTotal },
      otherFixedCost: 0
    };
  }
  const mRecord = state.settings.monthlyRecords[month];

  let inElec = 0;
  let embElec = 0;
  let inSalary = 0;
  let embSalary = 0;
  let otherFixed = 0;

  const elInputElecPrint = document.getElementById("mr-input-elec-print");
  const elInputElecEmb = document.getElementById("mr-input-elec-emb");
  const elInputSalaryPrint = document.getElementById("mr-input-salary-print");
  const elInputSalaryEmb = document.getElementById("mr-input-salary-emb");
  const elInputOtherFixed = document.getElementById("mr-input-other-fixed");
  const activeLabel = document.getElementById("mr-active-month-label");

  if (activeLabel) {
    activeLabel.textContent = `Tháng ${month}/2026`;
  }

  if (isLiveInput) {
    inElec = parseCurrencyInput(elInputElecPrint?.value || "0");
    embElec = parseCurrencyInput(elInputElecEmb?.value || "0");
    inSalary = parseCurrencyInput(elInputSalaryPrint?.value || "0");
    embSalary = parseCurrencyInput(elInputSalaryEmb?.value || "0");
    otherFixed = parseCurrencyInput(elInputOtherFixed?.value || "0");
  } else {
    inElec = (mRecord.electricity?.In !== undefined && mRecord.electricity?.In !== null) ? parseFloat(mRecord.electricity.In) : defaultInElec;
    embElec = (mRecord.electricity?.Thêu !== undefined && mRecord.electricity?.Thêu !== null) ? parseFloat(mRecord.electricity.Thêu) : defaultEmbElec;
    inSalary = (mRecord.salary?.In !== undefined && mRecord.salary?.In !== null) ? parseFloat(mRecord.salary.In) : stdPayroll.inSalaryTotal;
    embSalary = (mRecord.salary?.Thêu !== undefined && mRecord.salary?.Thêu !== null) ? parseFloat(mRecord.salary.Thêu) : stdPayroll.embSalaryTotal;
    otherFixed = parseFloat(mRecord.otherFixedCost) || 0;

    if (elInputElecPrint) elInputElecPrint.value = Math.round(inElec).toLocaleString('vi-VN');
    if (elInputElecEmb) elInputElecEmb.value = Math.round(embElec).toLocaleString('vi-VN');
    if (elInputSalaryPrint) elInputSalaryPrint.value = Math.round(inSalary).toLocaleString('vi-VN');
    if (elInputSalaryEmb) elInputSalaryEmb.value = Math.round(embSalary).toLocaleString('vi-VN');
    if (elInputOtherFixed) elInputOtherFixed.value = Math.round(otherFixed).toLocaleString('vi-VN');
  }

  // Cập nhật nhãn tổng phụ tiền điện & lương
  const dispElecSum = document.getElementById("mr-display-elec-sum");
  if (dispElecSum) dispElecSum.textContent = formatVND(inElec + embElec);

  const dispSalarySum = document.getElementById("mr-display-salary-sum");
  if (dispSalarySum) dispSalarySum.textContent = formatVND(inSalary + embSalary);

  // Phân bổ định phí theo bộ lọc nhà máy
  let activeSalary = 0;
  let activeElec = 0;
  let activeOther = 0;

  if (filterFactory === "In") {
    activeSalary = inSalary;
    activeElec = inElec;
    activeOther = otherFixed * (inSalary / (inSalary + embSalary || 1));
  } else if (filterFactory === "Thêu") {
    activeSalary = embSalary;
    activeElec = embElec;
    activeOther = otherFixed * (embSalary / (inSalary + embSalary || 1));
  } else {
    activeSalary = inSalary + embSalary;
    activeElec = inElec + embElec;
    activeOther = otherFixed;
  }

  const totalMonthlyFixedCost = activeSalary + activeElec + activeOther;

  // 2. Lọc sản phẩm theo nhà máy & danh mục
  const filterCategory = document.getElementById("monthly-report-filter-category")?.value || "all";
  const filteredProducts = state.products.filter(p => {
    const matchesFactory = filterFactory === "all" || p.factoryType === filterFactory;
    const catInfo = getCategoryInfo(p.category);
    const matchesCat = filterCategory === "all" || catInfo.id === filterCategory;
    return matchesFactory && matchesCat;
  });

  let totalMonthQty = 0;
  let totalMonthVC = 0;
  let totalMonthRevenue = 0;
  let totalMonthContribution = 0;
  let totalMonthCapex = 0;
  let totalMonthMat = 0;
  let totalMonthLabor = 0;

  tbody.innerHTML = "";

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="no-data" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Không có sản phẩm nào cho bộ lọc này.</td></tr>`;
  } else {
    // Group products by category
    const groups = {};
    filteredProducts.forEach(p => {
      const catInfo = getCategoryInfo(p.category);
      if (!groups[catInfo.id]) {
        groups[catInfo.id] = { info: catInfo, products: [] };
      }
      groups[catInfo.id].products.push(p);
    });

    Object.keys(groups).forEach(catId => {
      const group = groups[catId];
      let catQty = 0;
      let catVC = 0;
      let catRev = 0;
      let catMargin = 0;
      let catCapex = 0;

      const prodTrs = group.products.map(p => {
        const costDetails = calculateProductCost(p, state.settings);
        
        // Sản lượng theo tháng:
        let qty = 0;
        if (month === "7") {
          qty = (p.forecast.actualSales !== undefined) ? p.forecast.actualSales : Math.round((p.forecast.salesForecast || 0) / 1.1);
        } else if (p.forecast.monthlySales && p.forecast.monthlySales[month] !== undefined) {
          qty = p.forecast.monthlySales[month];
        } else if (month === "8") {
          qty = p.forecast.salesForecast || Math.round((p.forecast.actualSales || 0) * 1.1);
        } else {
          qty = p.forecast.salesForecast || (p.forecast.actualSales || 0);
        }

        const unitVC = costDetails.variableCost;
        const totalVC = unitVC * qty;
        const unitSellerPrice = costDetails.paybackSellerPrice || costDetails.sellerPrice;
        const totalRevenue = unitSellerPrice * qty;
        const productMargin = totalRevenue - totalVC;
        const unitCapex = costDetails.paybackSurchargeFirst3Years || 0;
        const totalCapex = unitCapex * qty;

        catQty += qty;
        catVC += totalVC;
        catRev += totalRevenue;
        catMargin += productMargin;
        catCapex += totalCapex;

        totalMonthQty += qty;
        totalMonthVC += totalVC;
        totalMonthRevenue += totalRevenue;
        totalMonthContribution += productMargin;
        totalMonthCapex += totalCapex;
        totalMonthMat += (costDetails.materialsCost * qty);
        totalMonthLabor += (costDetails.laborCost * qty);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong style="color: #60a5fa;">${p.code || 'SKU trống'}</strong></td>
          <td>
            <div style="font-weight: 600; color: #fff;">${p.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-secondary);">${p.category || 'Chưa phân loại'}</div>
          </td>
          <td style="text-align: center;">
            <span class="table-row-factory type-${p.factoryType === 'In' ? 'print' : 'embroid'}">
              ${p.factoryType === 'In' ? 'In ấn' : 'Thêu dệt'}
            </span>
          </td>
          <td style="text-align: right; font-weight: 700; color: #fff;">${qty.toLocaleString('vi-VN')}</td>
          <td style="text-align: right; color: #34d399;">${formatVND(unitVC)}</td>
          <td style="text-align: right; font-weight: 600; color: #34d399;">${formatVND(totalVC)}</td>
          <td style="text-align: right; color: #f59e0b;">${formatVND(unitSellerPrice)}</td>
          <td style="text-align: right; font-weight: 700; color: #38bdf8;">${formatVND(totalRevenue)}</td>
          <td style="text-align: right; font-weight: 700; color: #a78bfa;">${formatVND(productMargin)}</td>
          <td style="text-align: right; color: #fbbf24;">${formatVND(totalCapex)}</td>
        `;
        return tr;
      });

      const countLabel = catId === 'giftbook' ? `${group.products.length} biến thể` : `${group.products.length} sản phẩm`;
      const dividerTr = document.createElement("tr");
      dividerTr.className = "category-table-row-divider";
      dividerTr.innerHTML = `
        <td colspan="10">
          <div class="cat-divider-wrap">
            <span>${group.info.icon} <strong>${group.info.name}</strong> (${countLabel})</span>
            <span class="cat-divider-stats">
              <span>SL: <strong>${catQty.toLocaleString('vi-VN')}</strong></span>
              <span>Doanh thu: <strong>${formatVND(catRev)}</strong></span>
              <span>Biến phí: <strong>${formatVND(catVC)}</strong></span>
              <span>Lãi gộp: <strong style="color: #a78bfa;">${formatVND(catMargin)}</strong></span>
            </span>
          </div>
        </td>
      `;
      tbody.appendChild(dividerTr);
      prodTrs.forEach(tr => tbody.appendChild(tr));
    });
  }

  // 3. Tính toán Khấu hao máy móc theo đường thẳng 3 năm (cố định theo tháng, không phụ thuộc đơn hàng)
  let straightLineCapexMonthly = 0;
  if (state.settings.machines) {
    state.settings.machines.forEach(m => {
      const cat = m.category || (m.factoryType === "Thêu" ? "Thêu & Laser" : (m.factoryType === "In 3D" ? "Máy in 3D" : "In, Cắt & Hoàn Thiện"));
      if (filterFactory === "all" || m.factoryType === filterFactory || (filterFactory === "In" && cat.includes("In")) || (filterFactory === "Thêu" && cat.includes("Thêu"))) {
        straightLineCapexMonthly += calculateStraightLineDepreciation(m).monthlyDepreciation;
      }
    });
  }

  // Tổng Chi Phí Hoạt Động (Grand Total Expenses) & Lợi Nhuận
  const grandTotalExpenses = totalMonthlyFixedCost + totalMonthVC + straightLineCapexMonthly;
  const fixedPct = grandTotalExpenses > 0 ? Math.round((totalMonthlyFixedCost / grandTotalExpenses) * 100) : 0;
  const varPct = grandTotalExpenses > 0 ? Math.round((totalMonthVC / grandTotalExpenses) * 100) : 0;
  const capexPct = grandTotalExpenses > 0 ? Math.max(0, 100 - fixedPct - varPct) : 0;

  const contributionMarginRatio = totalMonthRevenue > 0 ? Math.round((totalMonthContribution / totalMonthRevenue) * 100) : 0;
  const netOperatingProfit = totalMonthRevenue - grandTotalExpenses;

  // 4. Cập nhật Banner Hero Tổng Chi Phí & Phân rã
  const elGrandTotal = document.getElementById("mr-grand-total-cost");
  if (elGrandTotal) elGrandTotal.textContent = formatVND(grandTotalExpenses);

  const elKpiGrandTotal = document.getElementById("mr-kpi-grand-total");
  if (elKpiGrandTotal) elKpiGrandTotal.textContent = formatVND(grandTotalExpenses);

  const elGrandTotalBreakdown = document.getElementById("mr-grand-total-breakdown");
  if (elGrandTotalBreakdown) {
    elGrandTotalBreakdown.innerHTML = `Định phí (Lương+Điện): <strong style="color: #fb7185;">${formatVND(totalMonthlyFixedCost)}</strong> (${fixedPct}%) + Biến phí NVL: <strong style="color: #34d399;">${formatVND(totalMonthVC)}</strong> (${varPct}%) + Khấu hao đường thẳng (3 năm): <strong style="color: #fbbf24;">${formatVND(straightLineCapexMonthly)}</strong> (${capexPct}%)`;
  }

  const pillFixed = document.getElementById("pill-fixed-pct");
  if (pillFixed) pillFixed.textContent = `Định phí: ${fixedPct}%`;

  const pillVar = document.getElementById("pill-var-pct");
  if (pillVar) pillVar.textContent = `Biến phí: ${varPct}%`;

  const pillCapex = document.getElementById("pill-capex-pct");
  if (pillCapex) pillCapex.textContent = `Khấu hao: ${capexPct}%`;

  // 5. Cập nhật các thẻ KPI tài chính tháng
  const elRev = document.getElementById("mr-total-revenue");
  if (elRev) elRev.textContent = formatVND(totalMonthRevenue);

  const elRevSub = document.getElementById("mr-revenue-sub");
  if (elRevSub) elRevSub.textContent = month === "7" ? "Sản lượng bán thực tế Tháng 7" : `Kế hoạch & dự báo bán Tháng ${month}`;

  const elVc = document.getElementById("mr-total-variable-cost");
  if (elVc) elVc.textContent = formatVND(totalMonthVC);

  const elVcSub = document.getElementById("mr-variable-sub");
  if (elVcSub) elVcSub.textContent = `NVL: ${formatVND(totalMonthMat)} | Nhân công: ${formatVND(totalMonthLabor)}`;

  const elFc = document.getElementById("mr-total-fixed-cost");
  if (elFc) elFc.textContent = formatVND(totalMonthlyFixedCost);

  const elFcSub = document.getElementById("mr-fixed-sub");
  if (elFcSub) elFcSub.textContent = `Lương: ${formatVND(activeSalary)} + Điện: ${formatVND(activeElec)}` + (activeOther > 0 ? ` + Khác: ${formatVND(activeOther)}` : "");

  const elCapex = document.getElementById("mr-total-capex");
  if (elCapex) elCapex.textContent = formatVND(totalMonthCapex);

  const elCapexSub = document.getElementById("mr-capex-sub");
  if (elCapexSub) elCapexSub.textContent = "Trích thu hồi vốn máy 3 năm đầu";

  const elMargin = document.getElementById("mr-contribution-margin");
  if (elMargin) elMargin.textContent = formatVND(totalMonthContribution);

  const elMarginRatio = document.getElementById("mr-margin-ratio");
  if (elMarginRatio) elMarginRatio.textContent = `Tỷ lệ đảm phí: ${contributionMarginRatio}% Doanh thu`;

  const elProfit = document.getElementById("mr-net-profit");
  if (elProfit) {
    elProfit.textContent = formatVND(netOperatingProfit);
    elProfit.style.color = netOperatingProfit >= 0 ? "#10b981" : "#fb7185";
  }

  const elProfitSub = document.getElementById("mr-profit-sub");
  if (elProfitSub) {
    elProfitSub.textContent = netOperatingProfit >= 0 
      ? "Lợi nhuận ròng sau khi bù đắp toàn bộ Biến phí, Định phí & Khấu hao máy"
      : "Doanh thu chưa đủ bù đắp toàn bộ tổng chi phí tháng";
  }

  // 6. Cập nhật dòng chân bảng (Footer)
  const footQty = document.getElementById("mr-foot-qty");
  if (footQty) footQty.textContent = totalMonthQty.toLocaleString('vi-VN');

  const footVc = document.getElementById("mr-foot-vc");
  if (footVc) footVc.textContent = formatVND(totalMonthVC);

  const footRev = document.getElementById("mr-foot-rev");
  if (footRev) footRev.textContent = formatVND(totalMonthRevenue);

  const footMargin = document.getElementById("mr-foot-margin");
  if (footMargin) footMargin.textContent = formatVND(totalMonthContribution);

  const footCapex = document.getElementById("mr-foot-capex");
  if (footCapex) footCapex.textContent = formatVND(totalMonthCapex);
}

function handleLiveMonthlyCostChange() {
  renderMonthlyReport(true);
}

function saveCurrentMonthCosts() {
  const monthSelect = document.getElementById("monthly-report-select");
  const month = monthSelect ? monthSelect.value : "7";

  const inElec = parseCurrencyInput(document.getElementById("mr-input-elec-print")?.value || "0");
  const embElec = parseCurrencyInput(document.getElementById("mr-input-elec-emb")?.value || "0");
  const inSalary = parseCurrencyInput(document.getElementById("mr-input-salary-print")?.value || "0");
  const embSalary = parseCurrencyInput(document.getElementById("mr-input-salary-emb")?.value || "0");
  const otherFixed = parseCurrencyInput(document.getElementById("mr-input-other-fixed")?.value || "0");

  if (!state.settings.monthlyRecords) {
    state.settings.monthlyRecords = {};
  }

  state.settings.monthlyRecords[month] = {
    name: `Tháng ${month}/2026`,
    electricity: { In: inElec, Thêu: embElec },
    salary: { In: inSalary, Thêu: embSalary },
    otherFixedCost: otherFixed
  };

  state.saveSettings(state.settings);
  renderMonthlyReport(false);

  alert(`✅ Đã lưu chi phí Tháng ${month}/2026 thành công!\n\n` +
        `• Tiền điện In: ${formatVND(inElec)} | Thêu: ${formatVND(embElec)}\n` +
        `• Tiền lương In: ${formatVND(inSalary)} | Thêu: ${formatVND(embSalary)}\n` +
        `• Định phí khác: ${formatVND(otherFixed)}\n\n` +
        `Toàn bộ Total Tổng Chi Phí đã được lưu và tự động đồng bộ.`);
}

function resetCurrentMonthSalary() {
  const monthSelect = document.getElementById("monthly-report-select");
  const month = monthSelect ? monthSelect.value : "7";
  const stdPayroll = getStandardPayrollTotals();

  const inputSalaryPrint = document.getElementById("mr-input-salary-print");
  const inputSalaryEmb = document.getElementById("mr-input-salary-emb");
  if (inputSalaryPrint) inputSalaryPrint.value = Math.round(stdPayroll.inSalaryTotal).toLocaleString('vi-VN');
  if (inputSalaryEmb) inputSalaryEmb.value = Math.round(stdPayroll.embSalaryTotal).toLocaleString('vi-VN');

  if (!state.settings.monthlyRecords) state.settings.monthlyRecords = {};
  if (!state.settings.monthlyRecords[month]) {
    const defaultInElec = state.settings.monthlyElectricity?.In || 8000000;
    const defaultEmbElec = state.settings.monthlyElectricity?.Thêu || 11000000;
    state.settings.monthlyRecords[month] = {
      name: `Tháng ${month}/2026`,
      electricity: { In: defaultInElec, Thêu: defaultEmbElec },
      salary: { In: stdPayroll.inSalaryTotal, Thêu: stdPayroll.embSalaryTotal },
      otherFixedCost: 0
    };
  } else {
    state.settings.monthlyRecords[month].salary = { In: stdPayroll.inSalaryTotal, Thêu: stdPayroll.embSalaryTotal };
  }

  state.saveSettings(state.settings);
  renderMonthlyReport(false);

  alert(`🔄 Đã khôi phục lương chuẩn từ 44 nhân sự cho Tháng ${month}/2026:\n` +
        `• Nhà máy In (16 NV): ${formatVND(stdPayroll.inSalaryTotal)}\n` +
        `• Nhà máy Thêu (28 NV): ${formatVND(stdPayroll.embSalaryTotal)}`);
}

function exportMonthlyReportCSV() {
  const month = document.getElementById("monthly-report-select")?.value || "7";
  const filterFactory = document.getElementById("monthly-report-filter-factory")?.value || "all";
  const filterCategory = document.getElementById("monthly-report-filter-category")?.value || "all";
  const filteredProducts = state.products.filter(p => {
    const matchesFactory = filterFactory === "all" || p.factoryType === filterFactory;
    const catInfo = getCategoryInfo(p.category);
    const matchesCat = filterCategory === "all" || catInfo.id === filterCategory;
    return matchesFactory && matchesCat;
  });

  const header = [
    "Mã SKU",
    "Tên Sản Phẩm",
    "Danh Mục",
    "Nhà Máy",
    "Tháng Báo Cáo",
    "Số Lượng Bán",
    "Đơn Giá Biến Phí (VNĐ)",
    "Tổng Biến Phí (VNĐ)",
    "Giá Bán Cho Seller (VNĐ)",
    "Tổng Doanh Thu (VNĐ)",
    "Lãi Gộp Đảm Phí (VNĐ)",
    "Khấu Hao Máy (VNĐ)"
  ];

  const rows = [header];

  filteredProducts.forEach(p => {
    const costDetails = calculateProductCost(p, state.settings);
    let qty = 0;
    if (month === "7") {
      qty = (p.forecast.actualSales !== undefined) ? p.forecast.actualSales : Math.round((p.forecast.salesForecast || 0) / 1.1);
    } else if (p.forecast.monthlySales && p.forecast.monthlySales[month] !== undefined) {
      qty = p.forecast.monthlySales[month];
    } else if (month === "8") {
      qty = p.forecast.salesForecast || Math.round((p.forecast.actualSales || 0) * 1.1);
    } else {
      qty = p.forecast.salesForecast || (p.forecast.actualSales || 0);
    }

    const unitVC = costDetails.variableCost;
    const totalVC = unitVC * qty;
    const unitPrice = costDetails.paybackSellerPrice || costDetails.sellerPrice;
    const totalRev = unitPrice * qty;
    const margin = totalRev - totalVC;
    const unitCapex = costDetails.paybackSurchargeFirst3Years || 0;
    const totalCapex = unitCapex * qty;

    rows.push([
      `"${p.code || ''}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${p.factoryType === 'In' ? 'In ấn' : 'Thêu dệt'}"`,
      `"Tháng ${month}/2026"`,
      qty,
      unitVC,
      totalVC,
      unitPrice,
      totalRev,
      margin,
      totalCapex
    ]);
  });

  const csvContent = "\uFEFF" + rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Bao_Cao_Tai_Chinh_Thang_${month}_2026.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// 7. Tab 4: Settings View Rendering & Handlers
// ==========================================================================

function updateFactoryTotalPayrollBadge(factoryKey) {
  const badgeId = factoryKey === "In" ? "settings-print-payroll-total" : "settings-emb-payroll-total";
  const badgeEl = document.getElementById(badgeId);
  if (!badgeEl) return;
  
  const factoryHr = state.settings.hr[factoryKey];
  let total = 0;
  if (factoryHr) {
    Object.keys(factoryHr).forEach(deptKey => {
      const employees = factoryHr[deptKey];
      total += employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
    });
  }
  
  badgeEl.textContent = formatVND(total);
}

function renderSettings() {
  document.getElementById("settings-electricity-unit-price").value = state.settings.electricityPrice.toLocaleString('vi-VN');
  document.getElementById("settings-default-overhead").value = state.settings.defaultOverhead;
  document.getElementById("settings-standard-hours").value = state.settings.standardHours || 208;
  document.getElementById("settings-default-profit").value = state.settings.defaultProfitMargin !== undefined ? state.settings.defaultProfitMargin : 20;

  const monthlyElecPrint = state.settings.monthlyElectricity?.In !== undefined ? state.settings.monthlyElectricity.In : 8000000;
  const monthlyElecEmb = state.settings.monthlyElectricity?.Thêu !== undefined ? state.settings.monthlyElectricity.Thêu : 11000000;
  document.getElementById("settings-monthly-electricity-print").value = monthlyElecPrint.toLocaleString('vi-VN');
  document.getElementById("settings-monthly-electricity-emb").value = monthlyElecEmb.toLocaleString('vi-VN');

  const sheetUrlInput = document.getElementById("settings-sheet-url");
  const testBtn = document.getElementById("btn-test-sheet");
  const pushBtn = document.getElementById("btn-push-to-sheet");
  const pullBtn = document.getElementById("btn-pull-from-sheet");
  const disconnectBtn = document.getElementById("btn-disconnect-sheet");

  if (sheetUrlInput) {
    sheetUrlInput.value = state.googleSheetUrl;
    if (state.googleSheetUrl) {
      sheetUrlInput.disabled = true;
      if (testBtn) testBtn.style.display = "none";
      if (pushBtn) pushBtn.style.display = "inline-flex";
      if (pullBtn) pullBtn.style.display = "inline-flex";
      if (disconnectBtn) disconnectBtn.style.display = "inline-flex";
    } else {
      sheetUrlInput.disabled = false;
      if (testBtn) {
        testBtn.style.display = "inline-flex";
        testBtn.textContent = "Kết nối & Đồng bộ lần đầu";
      }
      if (pushBtn) pushBtn.style.display = "none";
      if (pullBtn) pullBtn.style.display = "none";
      if (disconnectBtn) disconnectBtn.style.display = "none";
    }
  }

  renderHrAccordion("In", "hr-print-accordion-container");
  renderHrAccordion("Thêu", "hr-emb-accordion-container");

  updateFactoryTotalPayrollBadge("In");
  updateFactoryTotalPayrollBadge("Thêu");
  renderSettingsPaybackList();
  renderMaterialsCatalog();
  updateMaterialsCatalogDatalist();
  renderUsersTable();
}

function renderSettingsPaybackList() {
  const container = document.getElementById("settings-capex-list");
  if (!container) return;
  container.innerHTML = "";

  if (!state.settings.machines || state.settings.machines.length === 0) {
    container.innerHTML = `<div class="no-data" style="font-size: 0.78rem; text-align: center; padding: 1rem; color: var(--text-secondary);">Chưa khai báo máy móc đầu tư nào.</div>`;
    return;
  }

  // Summary Banner: 74 machines - 9.175.590.182 đ
  const totalMachinesCount = state.settings.machines.reduce((sum, m) => sum + (m.quantity || 1), 0);
  const totalInvestment = state.settings.machines.reduce((sum, m) => sum + (m.investment || 0), 0);
  
  const summaryBanner = document.createElement("div");
  summaryBanner.className = "glass-card";
  summaryBanner.style.padding = "0.85rem 1rem";
  summaryBanner.style.marginBottom = "1rem";
  summaryBanner.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))";
  summaryBanner.style.border = "1px solid rgba(99, 102, 241, 0.25)";
  summaryBanner.style.borderRadius = "8px";
  summaryBanner.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
      <div>
        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: #a5b4fc; font-weight: 600;">Tổng Quan Vốn Đầu Tư Máy Móc (CAPEX)</div>
        <div style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-top: 0.15rem;">${formatVND(totalInvestment)} <span style="font-size: 0.78rem; font-weight: 400; color: var(--text-secondary);">/ ${totalMachinesCount} thiết bị</span></div>
      </div>
      <div style="display: flex; gap: 0.75rem; font-size: 0.72rem; color: var(--text-secondary);">
        <div style="background: rgba(0,0,0,0.25); padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06);">
          🧵 Thêu & Laser: <strong style="color: #c084fc;">2.995.000.000 đ</strong> (25 máy)
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06);">
          🖨️ In & Hoàn Thiện: <strong style="color: #38bdf8;">5.450.214.182 đ</strong> (25 máy)
        </div>
        <div style="background: rgba(0,0,0,0.25); padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06);">
          🧊 In 3D: <strong style="color: #34d399;">730.376.000 đ</strong> (24 máy)
        </div>
      </div>
    </div>
  `;
  container.appendChild(summaryBanner);

  let currentCategory = "";

  state.settings.machines.forEach(m => {
    const cat = m.category || (m.factoryType === "Thêu" ? "Thêu & Laser" : (m.factoryType === "In 3D" ? "Máy in 3D" : "In, Cắt & Hoàn Thiện"));
    if (cat !== currentCategory) {
      currentCategory = cat;
      const catHeader = document.createElement("div");
      catHeader.style.fontSize = "0.78rem";
      catHeader.style.fontWeight = "700";
      catHeader.style.color = "#93c5fd";
      catHeader.style.margin = "1rem 0 0.5rem 0";
      catHeader.style.padding = "0.3rem 0.5rem";
      catHeader.style.background = "rgba(255,255,255,0.03)";
      catHeader.style.borderLeft = "3px solid #3b82f6";
      catHeader.style.borderRadius = "0 4px 4px 0";
      catHeader.textContent = `📁 Phân Xưởng: ${cat}`;
      container.appendChild(catHeader);
    }
    const targetVolume = (m.paybackYears || 0) * (m.expectedVolumePerYear || 0);
    const progress = Math.min(100, ((m.currentVolume || 0) / targetVolume * 100)).toFixed(1);
    
    let monthlyVolume = 0;
    state.products.forEach(p => {
      if (p.paybackMachines && Array.isArray(p.paybackMachines)) {
        const match = p.paybackMachines.find(item => item.machineId === m.id);
        if (match) {
          const qtyInProduct = match.qty || 0;
          const salesMonth = p.forecast ? (p.forecast.actualSales || 0) : 0;
          monthlyVolume += salesMonth * qtyInProduct;
        }
      } else if (p.paybackMachineId === m.id) {
        const qtyInProduct = p.paybackMachineQty || 0;
        const salesMonth = p.forecast ? (p.forecast.actualSales || 0) : 0;
        monthlyVolume += salesMonth * qtyInProduct;
      }
    });

    const annualRunRate = monthlyVolume * 12;
    let speedHtml = "";
    
    if (annualRunRate > 0 && m.currentVolume < targetVolume) {
      const remainingVol = targetVolume - (m.currentVolume || 0);
      const remainingYearsTarget = remainingVol / (m.expectedVolumePerYear || 20000);
      const remainingYearsActual = remainingVol / annualRunRate;
      
      if (remainingYearsActual < remainingYearsTarget) {
        const monthsActual = Math.round(remainingYearsActual * 12);
        speedHtml = `
          <div style="margin-top: 0.5rem; padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 4px; color: #10b981; font-size: 0.72rem; display: flex; align-items: center; gap: 0.35rem;">
            <span>🚀</span> <strong>Tăng tốc:</strong> Doanh số Tháng 7 quy đổi đạt ${Math.round(annualRunRate).toLocaleString('vi-VN')} ${m.unitType}/năm. Hòa vốn sau <strong>${monthsActual} tháng</strong> (Nhanh hơn dự kiến mục tiêu ${remainingYearsTarget.toFixed(1)} năm)!
          </div>
        `;
      } else {
        speedHtml = `
          <div style="margin-top: 0.5rem; padding: 0.4rem 0.6rem; background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 4px; color: #a5b4fc; font-size: 0.72rem;">
            📊 Tốc độ bán thực tế: ${Math.round(annualRunRate).toLocaleString('vi-VN')} ${m.unitType}/năm. Dự kiến hòa vốn sau ${remainingYearsActual.toFixed(1)} năm.
          </div>
        `;
      }
    } else if (m.currentVolume >= targetVolume) {
      speedHtml = `
        <div style="margin-top: 0.5rem; padding: 0.4rem 0.6rem; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 4px; color: #34d399; font-size: 0.72rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
          <span>✅</span> Đã hoàn thành hòa vốn! Phụ phí khấu hao máy này trên sản phẩm đã tự động giảm về 0.
        </div>
      `;
    } else {
      const remainingVol = targetVolume - (m.currentVolume || 0);
      const remainingYearsTarget = remainingVol / (m.expectedVolumePerYear || 20000);
      speedHtml = `
        <div style="margin-top: 0.5rem; padding: 0.4rem 0.6rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 4px; color: var(--text-secondary); font-size: 0.72rem;">
          💡 Tiến độ dự kiến ban đầu: Hòa vốn sau <strong>${remainingYearsTarget.toFixed(1)} năm</strong>. Hãy nhập sản lượng bán tháng 7 để theo dõi thời gian hòa vốn thực tế.
        </div>
      `;
    }

    const row = document.createElement("div");
    row.className = "glass-card";
    row.style.padding = "1rem";
    row.style.background = "rgba(255,255,255,0.015)";
    row.style.border = "1px solid var(--border-glass)";
    row.style.borderRadius = "6px";
    
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
        <div>
          <strong style="color: #fff; font-size: 0.85rem;">${m.name}</strong>
          <span style="font-size: 0.7rem; color: #f59e0b; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); padding: 0.1rem 0.35rem; border-radius: 3px; margin-left: 0.4rem;">+${formatVND(m.surchargePerUnit)} / ${m.unitType}</span>
        </div>
        <div style="display: flex; gap: 0.35rem;">
          <button type="button" class="btn btn-xs btn-primary capex-edit-btn" data-id="${m.id}" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; background: #4f46e5; border-color: #6366f1;">✏️ Sửa / Cộng dồn</button>
          <button type="button" class="btn btn-xs btn-danger capex-delete-btn" data-id="${m.id}" style="padding: 0.2rem 0.4rem; font-size: 0.7rem;">Xóa</button>
        </div>
      </div>

      <div style="font-size: 0.75rem; color: var(--text-secondary); display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.35rem; margin-bottom: 0.5rem;">
        <div>Vốn đầu tư: <strong style="color: #fff;">${formatVND(m.investment)}</strong></div>
        <div>Mục tiêu: <strong style="color: #fff;">${m.paybackYears} năm</strong> (${m.expectedVolumePerYear.toLocaleString('vi-VN')} ${m.unitType}/năm)</div>
      </div>

      <div style="margin-bottom: 0.5rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 0.2rem;">
          <span>Hòa vốn: ${m.currentVolume.toLocaleString('vi-VN')} / ${targetVolume.toLocaleString('vi-VN')} ${m.unitType}</span>
          <strong>${progress}%</strong>
        </div>
        <div class="progress-bar-container" style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
          <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, #f59e0b, #eab308); border-radius: 3px;"></div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <label style="font-size: 0.7rem; color: var(--text-secondary);">Sản lượng đã tích lũy:</label>
        <div style="display: flex; gap: 0.35rem;">
          <input type="number" class="form-input capex-volume-input" value="${m.currentVolume}" style="max-width: 90px; min-height: 28px; font-size: 0.72rem; padding: 0.15rem 0.35rem; margin: 0; background: rgba(0,0,0,0.2); color: var(--text-primary); border: 1px solid var(--border-glass);">
          <button type="button" class="btn btn-secondary capex-update-btn" data-id="${m.id}" style="min-height: 28px; padding: 0 0.5rem; font-size: 0.7rem;">Cập nhật</button>
        </div>
      </div>

      ${speedHtml}
    `;

    row.querySelector(".capex-edit-btn").addEventListener("click", () => {
      openEditCapexModal(m);
    });

    row.querySelector(".capex-delete-btn").addEventListener("click", () => {
      if (confirm(`Bạn có muốn xóa thiết lập máy móc "${m.name}" không?\n\nSau khi xóa, máy này sẽ bị gỡ bỏ khỏi hệ thống và tự động đồng bộ lên Google Sheets.`)) {
        state.settings.machines = state.settings.machines.filter(x => x.id !== m.id);
        
        let productsModified = false;
        state.products.forEach(p => {
          if (p.paybackMachines && Array.isArray(p.paybackMachines)) {
            const beforeLen = p.paybackMachines.length;
            p.paybackMachines = p.paybackMachines.filter(item => item.machineId !== m.id);
            if (p.paybackMachines.length !== beforeLen) {
              productsModified = true;
              p.paybackMachineId = p.paybackMachines[0]?.machineId || null;
              p.paybackMachineQty = p.paybackMachines[0]?.qty || 0;
            }
          } else if (p.paybackMachineId === m.id) {
            p.paybackMachineId = null;
            productsModified = true;
          }
        });
        if (productsModified) {
          state.saveProducts();
        }

        state.saveSettings(state.settings);
        renderSettings();
        renderCalculator();
        recalculateForecastTotals();
        updateDashboard();
      }
    });

    row.querySelector(".capex-update-btn").addEventListener("click", () => {
      const vol = parseFloat(row.querySelector(".capex-volume-input").value) || 0;
      m.currentVolume = vol;
      state.saveSettings(state.settings);
      renderSettings();
      renderCalculator();
      recalculateForecastTotals();
      updateDashboard();
      alert(`Đã cập nhật sản lượng tích lũy của "${m.name}" lên ${vol.toLocaleString('vi-VN')} ${m.unitType}!`);
    });

    container.appendChild(row);
  });
}

function openEditCapexModal(machine) {
  const modal = document.getElementById("modal-edit-capex");
  if (!modal) return;

  const isNew = !machine;
  const titleEl = document.getElementById("modal-edit-capex-title");
  const submitBtn = document.getElementById("modal-edit-capex-submit-btn");

  if (titleEl) {
    titleEl.textContent = isNew ? "➕ Thêm Thiết Bị Máy Móc Mới (CAPEX)" : "Chỉnh Sửa & Cộng Dồn Vốn Máy Móc";
  }
  if (submitBtn) {
    submitBtn.textContent = isNew ? "💾 Tạo Máy Mới" : "💾 Lưu Cập Nhật";
  }

  document.getElementById("modal-edit-capex-id").value = isNew ? "" : machine.id;
  document.getElementById("modal-edit-capex-name").value = isNew ? "" : machine.name;
  
  const invInput = document.getElementById("modal-edit-capex-investment");
  invInput.value = isNew ? "" : (machine.investment || 0).toLocaleString('vi-VN');
  maskCurrencyInput(invInput);

  const addInvInput = document.getElementById("modal-edit-capex-add-investment");
  addInvInput.value = "";
  if (isNew) {
    addInvInput.placeholder = "(Không áp dụng khi tạo mới)";
    addInvInput.disabled = true;
  } else {
    addInvInput.placeholder = "Ví dụ: 100.000.000";
    addInvInput.disabled = false;
  }
  maskCurrencyInput(addInvInput);

  const yearsInput = document.getElementById("modal-edit-capex-years");
  yearsInput.value = isNew ? 3 : (machine.paybackYears || 3);

  const volInput = document.getElementById("modal-edit-capex-expected-vol");
  volInput.value = isNew ? 20000 : (machine.expectedVolumePerYear || 20000);

  const unitSelect = document.getElementById("modal-edit-capex-unit-type");
  unitSelect.value = isNew ? "Cái" : (machine.unitType || "Cái");

  const discInput = document.getElementById("modal-edit-capex-discount");
  discInput.value = (!isNew && machine.discountAfter3Years !== undefined) ? machine.discountAfter3Years : 80;

  const curVolInput = document.getElementById("modal-edit-capex-current-vol");
  curVolInput.value = isNew ? 0 : (machine.currentVolume || 0);

  function updatePreview() {
    const curInv = parseInt((invInput.value || "0").replace(/[^0-9]/g, ""), 10) || 0;
    const addInv = parseInt((addInvInput.value || "0").replace(/[^0-9]/g, ""), 10) || 0;
    const totalInv = curInv + addInv;
    const y = parseFloat(yearsInput.value) || 3;
    const ev = parseFloat(volInput.value) || 1;
    const targetVol = y * ev;
    const unitRate = targetVol > 0 ? Math.round(totalInv / targetVol) : 0;
    const discPct = parseFloat(discInput.value) || 80;
    const postRate = Math.round(unitRate * (1 - discPct / 100));
    const unit = unitSelect.value || "Cái";

    const summaryEl = document.getElementById("modal-edit-capex-summary");
    if (summaryEl) {
      let addNote = addInv > 0 ? ` <span style="color:#10b981; font-weight:700;">(+ cộng dồn ${formatVND(addInv)})</span>` : "";
      summaryEl.innerHTML = `
        <div style="margin-bottom: 0.25rem;">💰 <strong>Tổng vốn đầu tư mới:</strong> <span style="font-size: 0.85rem; color:#fff; font-weight:700;">${formatVND(totalInv)}</span>${addNote}</div>
        <div style="margin-bottom: 0.25rem;">🎯 <strong>Sản lượng mục tiêu (${y} năm):</strong> ${targetVol.toLocaleString('vi-VN')} ${unit}</div>
        <div>⚡ <strong>Phụ phí thu hồi vốn mới:</strong> <span style="color:#f87171; font-weight:700;">+${formatVND(unitRate)} / ${unit}</span> (Khấu hao cao) ➔ Giảm còn <span style="color:#34d399; font-weight:700;">+${formatVND(postRate)} / ${unit}</span> (Sau hòa vốn)</div>
      `;
    }
  }

  updatePreview();

  invInput.oninput = updatePreview;
  addInvInput.oninput = updatePreview;
  yearsInput.oninput = updatePreview;
  volInput.oninput = updatePreview;
  unitSelect.onchange = updatePreview;
  discInput.oninput = updatePreview;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function renderHrAccordion(factoryKey, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const stdHours = state.settings.standardHours || 208;
  const factoryHr = state.settings.hr[factoryKey];

  const deptMeta = {
    designer: { label: factoryKey === "In" ? "Designer POD" : "Designer EMB", color: "#a5b4fc" },
    laser: { label: "Preparing Laser", color: "#fb7185" },
    production: { label: factoryKey === "In" ? "Sản xuất POD" : "Sản xuất EMB", color: "#34d399" },
    qc: { label: factoryKey === "In" ? "QC In" : "QC EMB", color: "#fbbf24" }
  };

  Object.keys(factoryHr).forEach(deptKey => {
    const employees = factoryHr[deptKey];
    const meta = deptMeta[deptKey];
    
    const headcount = employees.length;
    const totalSalary = employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
    const avgSalary = headcount > 0 ? totalSalary / headcount : 0;
    const hourlyRate = getDepartmentHourlyRate(employees, stdHours);

    const detailsId = `details-${factoryKey}-${deptKey}`;
    
    const card = document.createElement("div");
    card.className = "accordion-card glass-card";
    card.style.cssText = "border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; margin-bottom: 0.5rem; overflow: hidden; background: rgba(255,255,255,0.01);";
    
    card.innerHTML = `
      <div class="accordion-header" style="padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${meta.color};"></span>
          <strong style="font-size: 0.85rem; color: #f8fafc;">${meta.label}</strong>
          <span class="badge" style="font-size: 0.7rem; padding: 0.1rem 0.4rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: var(--text-secondary);">${headcount} người</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 0.75rem; text-align: right;">
            <div style="color: var(--text-secondary); font-size: 0.7rem;">Tổng quỹ: <span style="font-weight: 700; color: #fb7185;">${formatVND(totalSalary)}</span></div>
            <div style="color: var(--text-secondary); font-size: 0.7rem;">TB: <span style="font-weight: 600; color: #f1f5f9;">${formatVND(avgSalary)}</span> | Giờ: <span style="font-weight: 600; color: #38bdf8;">${formatVND(hourlyRate)}/h</span></div>
          </div>
          <span class="chevron" style="transition: transform 0.2s; font-size: 0.75rem; color: var(--text-secondary);">&#9662;</span>
        </div>
      </div>
      <div class="accordion-body hidden" id="${detailsId}" style="padding: 1rem; background: rgba(0,0,0,0.15); border-top: 1px solid rgba(255,255,255,0.04);">
        <div class="employee-list-scroll" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.25rem;">
          <!-- Dynamic employee rows -->
        </div>
        <div style="margin-top: 0.75rem; display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-xs btn-outline btn-add-emp" style="padding: 0.25rem 0.5rem; font-size: 0.72rem; border-radius: 4px; min-height: 28px;">+ Thêm nhân sự</button>
        </div>
      </div>
    `;

    const header = card.querySelector(".accordion-header");
    const body = card.querySelector(".accordion-body");
    const chevron = card.querySelector(".chevron");
    
    header.addEventListener("click", () => {
      body.classList.toggle("hidden");
      if (body.classList.contains("hidden")) {
        chevron.innerHTML = "&#9662;";
      } else {
        chevron.innerHTML = "&#9652;";
      }
    });

    const listContainer = card.querySelector(".employee-list-scroll");

    const renderEmployeeRows = () => {
      listContainer.innerHTML = "";
      if (employees.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; font-size: 0.75rem; color: var(--text-secondary); padding: 0.5rem 0;">Chưa có nhân sự nào. Click "+ Thêm" để tạo mới.</div>`;
        return;
      }
      employees.forEach((emp, empIdx) => {
        const row = document.createElement("div");
        row.style.cssText = "display: flex; gap: 0.5rem; align-items: center;";
        row.innerHTML = `
          <input type="text" class="form-input emp-name-input" value="${emp.name}" placeholder="Họ và tên" style="flex: 2; min-height: 32px; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px;" required>
          <input type="text" class="form-input emp-salary-input currency-input" value="${emp.salary.toLocaleString('vi-VN')}" placeholder="Lương tháng" style="flex: 1.2; min-height: 32px; font-size: 0.75rem; padding: 0.25rem 0.5rem; text-align: right; border-radius: 4px;" required>
          <button type="button" class="btn-remove-emp" style="border: none; background: transparent; color: #ef4444; font-size: 1.2rem; cursor: pointer; padding: 0.25rem; line-height: 1;">&times;</button>
        `;

        const salaryInput = row.querySelector(".emp-salary-input");
        maskCurrencyInput(salaryInput);

        salaryInput.addEventListener("input", (e) => {
          emp.salary = parseCurrencyInput(e.target.value);
          updateHeaderCount();
        });

        row.querySelector(".emp-name-input").addEventListener("input", (e) => {
          emp.name = e.target.value;
        });

        row.querySelector(".btn-remove-emp").addEventListener("click", () => {
          employees.splice(empIdx, 1);
          renderEmployeeRows();
          updateHeaderCount();
        });

        listContainer.appendChild(row);
      });
    };

    const updateHeaderCount = () => {
      const currentHeadcount = employees.length;
      header.querySelector(".badge").textContent = `${currentHeadcount} người`;
      const currentTotal = employees.reduce((sum, em) => sum + (parseFloat(em.salary) || 0), 0);
      const currentAvg = currentHeadcount > 0 ? currentTotal / currentHeadcount : 0;
      const currentHourly = getDepartmentHourlyRate(employees, stdHours);
      
      header.querySelector("div[style*='font-size: 0.75rem']").innerHTML = `
        <div style="color: var(--text-secondary); font-size: 0.7rem;">Tổng quỹ: <span style="font-weight: 700; color: #fb7185;">${formatVND(currentTotal)}</span></div>
        <div style="color: var(--text-secondary); font-size: 0.7rem;">TB: <span style="font-weight: 600; color: #f1f5f9;">${formatVND(currentAvg)}</span> | Giờ: <span style="font-weight: 600; color: #38bdf8;">${formatVND(currentHourly)}/h</span></div>
      `;
      updateFactoryTotalPayrollBadge(factoryKey);
    };

    renderEmployeeRows();

    card.querySelector(".btn-add-emp").addEventListener("click", () => {
      const nextLetter = String.fromCharCode(65 + (employees.length % 26));
      const deptLabel = deptKey === 'laser' ? 'Laser' : deptKey === 'designer' ? 'Designer' : deptKey === 'production' ? 'Sản xuất' : 'QC';
      const factoryLabel = factoryKey === 'In' ? 'In' : 'Thêu';
      
      const defaultSalary = employees.length > 0 
        ? Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length)
        : (deptKey === 'designer' ? 12000000 : deptKey === 'production' ? 9000000 : 8500000);

      employees.push({
        name: `Nhân viên ${factoryLabel} - ${deptLabel} ${nextLetter}`,
        salary: defaultSalary
      });

      renderEmployeeRows();
      updateHeaderCount();
      setTimeout(() => {
        listContainer.scrollTop = listContainer.scrollHeight;
      }, 50);
    });

    container.appendChild(card);
  });
}

function saveSettingsForm(e) {
  e.preventDefault();
  
  const electricity = parseCurrencyInput(document.getElementById("settings-electricity-unit-price").value);
  const defaultOverhead = parseFloat(document.getElementById("settings-default-overhead").value) || 0;
  const standardHours = parseFloat(document.getElementById("settings-standard-hours").value) || 208;
  const defaultProfitMargin = parseFloat(document.getElementById("settings-default-profit").value) || 20;

  const monthlyElecPrint = parseCurrencyInput(document.getElementById("settings-monthly-electricity-print").value);
  const monthlyElecEmb = parseCurrencyInput(document.getElementById("settings-monthly-electricity-emb").value);

  state.saveSettings({
    ...state.settings,
    electricityPrice: electricity,
    defaultOverhead,
    standardHours,
    defaultProfitMargin,
    monthlyElectricity: {
      In: monthlyElecPrint,
      Thêu: monthlyElecEmb
    }
  });

  alert("Lưu thông tin cấu hình chi phí & giờ công thành công!");
  renderSettings();
}

function saveHrSettingsForm(e) {
  e.preventDefault();
  state.saveSettings(state.settings);
  alert("Lưu cấu hình bảng lương & nhân sự chi tiết thành công!");
  renderSettings();
}

function resetMockData() {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ và nạp lại dữ liệu mẫu gốc? Hành động này sẽ ghi đè lên các thay đổi hiện tại của bạn.")) {
    state.resetData();
    switchTab("dashboard");
    alert("Khôi phục dữ liệu gốc thành công!");
  }
}

// ==========================================================================
// 8. Import / Export Data Helpers
// ==========================================================================

function exportBackupData() {
  const backup = {
    settings: state.settings,
    products: state.products,
    exportDate: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchorNode.setAttribute("download", `factory_cost_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function importBackupData(e) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      if (data.settings && data.products) {
        state.saveSettings(data.settings);
        state.products = data.products;
        state.saveProducts();
        state.selectedProductId = null;
        switchTab("dashboard");
        alert("Nhập dữ liệu thành công!");
      } else {
        alert("File JSON không đúng định dạng lưu trữ lưu trữ!");
      }
    } catch (err) {
      alert("Đã xảy ra lỗi khi đọc file JSON: " + err.message);
    }
  };
  fileReader.readAsText(e.target.files[0]);
}

// ==========================================================================
// 8B. Materials Catalog (Thư Viện Vật Tư & Giấy Chuẩn) Management
// ==========================================================================

let currentCatalogFilter = "all";
let currentCatalogSearch = "";

function updateMaterialsCatalogDatalist() {
  const datalist = document.getElementById("materials-catalog-datalist");
  if (!datalist) return;
  datalist.innerHTML = "";
  const catalog = state.settings.materialsCatalog || [];
  catalog.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.name;
    opt.dataset.unit = item.unit;
    opt.dataset.price = item.defaultPrice;
    opt.dataset.category = item.category;
    opt.textContent = `${item.name} (${formatVND(item.defaultPrice)} / ${item.unit})`;
    datalist.appendChild(opt);
  });
}

function renderMaterialsCatalog(filterCategory = currentCatalogFilter, searchQuery = currentCatalogSearch) {
  currentCatalogFilter = filterCategory;
  currentCatalogSearch = searchQuery;

  const tbody = document.getElementById("catalog-table-body");
  const countBadge = document.getElementById("catalog-total-count");
  if (!tbody) return;

  const catalog = state.settings.materialsCatalog || [];
  if (countBadge) {
    countBadge.textContent = `${catalog.length} vật tư`;
  }

  // Update active pill UI
  document.querySelectorAll(".catalog-filter-pill").forEach(pill => {
    if (pill.dataset.category === filterCategory) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });

  const query = searchQuery.trim().toLowerCase();
  const filtered = catalog.filter(item => {
    const matchesCat = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) || 
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.sheetSize && item.sheetSize.toLowerCase().includes(query)) ||
      (item.notes && item.notes.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="no-data" style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">
          Không tìm thấy vật tư nào phù hợp với bộ lọc.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement("tr");

    let badgeClass = "badge-cat-paper";
    if (item.category === "Màng & Phủ") badgeClass = "badge-cat-film";
    else if (item.category === "Lượt In & Mực") badgeClass = "badge-cat-click";
    else if (item.category === "Vật Tư Thêu") badgeClass = "badge-cat-emb";
    else if (item.category === "Bao Bì & Đóng Gói") badgeClass = "badge-cat-pack";

    let factoryBadge = `<span style="font-size:0.75rem; color:#a5b4fc; background:rgba(99,102,241,0.15); padding:2px 6px; border-radius:4px;">In</span>`;
    if (item.factoryType === "Thêu") {
      factoryBadge = `<span style="font-size:0.75rem; color:#f472b6; background:rgba(236,72,153,0.15); padding:2px 6px; border-radius:4px;">Thêu</span>`;
    } else if (item.factoryType === "Chung") {
      factoryBadge = `<span style="font-size:0.75rem; color:#34d399; background:rgba(16,185,129,0.15); padding:2px 6px; border-radius:4px;">Chung</span>`;
    }

    const sheetSizeText = item.sheetSize ? `<span style="font-size:0.78rem; color:#38bdf8; margin-left:6px; font-weight:normal;">[${item.sheetSize}]</span>` : "";
    const notesText = item.notes ? `<div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${item.notes}</div>` : "";

    tr.innerHTML = `
      <td>
        <strong style="color: #ffffff; font-size: 0.88rem;">${item.name}</strong> ${sheetSizeText}
        ${notesText}
      </td>
      <td>
        <span class="badge-cat ${badgeClass}">${item.category}</span>
      </td>
      <td>
        ${factoryBadge}
      </td>
      <td class="text-center font-semibold" style="color: #cbd5e1;">
        ${item.unit}
      </td>
      <td class="text-right font-semibold" style="color: #38bdf8; font-size: 0.95rem;">
        ${formatVND(item.defaultPrice)}
      </td>
      <td class="text-center" style="white-space: nowrap;">
        <button type="button" class="btn btn-xs btn-outline btn-edit-catalog" data-id="${item.id}" title="Chỉnh sửa vật tư" style="padding: 2px 7px; margin-right: 4px;">
          ✏️
        </button>
        <button type="button" class="btn btn-xs btn-outline btn-delete-catalog" data-id="${item.id}" title="Xóa vật tư" style="padding: 2px 7px; border-color: rgba(239,68,68,0.4); color: #f87171;">
          🗑️
        </button>
      </td>
    `;

    tr.querySelector(".btn-edit-catalog")?.addEventListener("click", () => openCatalogItemModal(item.id));
    tr.querySelector(".btn-delete-catalog")?.addEventListener("click", () => deleteCatalogItem(item.id));

    tbody.appendChild(tr);
  });
}

function openCatalogItemModal(itemId = null) {
  const modal = document.getElementById("modal-catalog-item");
  const form = document.getElementById("modal-catalog-form");
  const title = document.getElementById("modal-catalog-title");
  if (!modal || !form) return;

  form.reset();
  document.getElementById("modal-catalog-id").value = "";

  if (itemId) {
    const item = (state.settings.materialsCatalog || []).find(m => m.id === itemId);
    if (item) {
      title.textContent = "Chỉnh sửa vật tư chuẩn";
      document.getElementById("modal-catalog-id").value = item.id;
      document.getElementById("modal-catalog-name").value = item.name;
      document.getElementById("modal-catalog-category").value = item.category;
      document.getElementById("modal-catalog-factory").value = item.factoryType || "In";
      document.getElementById("modal-catalog-unit").value = item.unit;
      document.getElementById("modal-catalog-price").value = item.defaultPrice.toLocaleString('vi-VN');
      document.getElementById("modal-catalog-sheetsize").value = item.sheetSize || "";
      document.getElementById("modal-catalog-notes").value = item.notes || "";
    }
  } else {
    title.textContent = "Thêm vật tư chuẩn mới";
    document.getElementById("modal-catalog-price").value = "";
  }

  modal.showModal();
}

function handleSaveCatalogItem(e) {
  e.preventDefault();
  const id = document.getElementById("modal-catalog-id").value;
  const name = document.getElementById("modal-catalog-name").value.trim();
  const category = document.getElementById("modal-catalog-category").value;
  const factoryType = document.getElementById("modal-catalog-factory").value;
  const unit = document.getElementById("modal-catalog-unit").value.trim();
  const price = parseCurrencyInput(document.getElementById("modal-catalog-price").value);
  const sheetSize = document.getElementById("modal-catalog-sheetsize").value.trim();
  const notes = document.getElementById("modal-catalog-notes").value.trim();

  if (!name || !unit) {
    alert("Vui lòng nhập tên vật tư và đơn vị tính!");
    return;
  }

  if (!state.settings.materialsCatalog) {
    state.settings.materialsCatalog = [];
  }

  if (id) {
    // Edit existing
    const item = state.settings.materialsCatalog.find(m => m.id === id);
    if (item) {
      item.name = name;
      item.category = category;
      item.factoryType = factoryType;
      item.unit = unit;
      item.defaultPrice = price;
      item.sheetSize = sheetSize;
      item.notes = notes;
    }
  } else {
    // Create new
    const newId = `mat-${Date.now()}`;
    state.settings.materialsCatalog.push({
      id: newId,
      name,
      category,
      factoryType,
      unit,
      defaultPrice: price,
      sheetSize,
      notes
    });
  }

  state.saveSettings(state.settings);
  renderMaterialsCatalog();
  updateMaterialsCatalogDatalist();

  const modal = document.getElementById("modal-catalog-item");
  if (modal) modal.close();
}

function deleteCatalogItem(itemId) {
  const item = (state.settings.materialsCatalog || []).find(m => m.id === itemId);
  if (!item) return;

  if (confirm(`Bạn có chắc chắn muốn xóa vật tư "${item.name}" khỏi Thư viện không?`)) {
    state.settings.materialsCatalog = state.settings.materialsCatalog.filter(m => m.id !== itemId);
    state.saveSettings(state.settings);
    renderMaterialsCatalog();
    updateMaterialsCatalogDatalist();
  }
}

function syncCatalogPricesToProducts() {
  const catalog = state.settings.materialsCatalog || [];
  if (catalog.length === 0) {
    alert("Thư viện vật tư đang trống!");
    return;
  }

  if (!confirm("Hệ thống sẽ quét tất cả sản phẩm: nếu tên vật tư trùng khớp với Thư viện chuẩn, đơn giá sẽ được tự động cập nhật lại theo giá mới nhất và tính lại Base Cost. Bạn có muốn tiếp tục?")) {
    return;
  }

  let updatedCount = 0;
  state.products.forEach(prod => {
    let prodUpdated = false;
    (prod.materials || []).forEach(mat => {
      const match = catalog.find(c => c.name.toLowerCase() === mat.name.trim().toLowerCase());
      if (match && match.defaultPrice !== mat.price) {
        mat.price = match.defaultPrice;
        prodUpdated = true;
      }
    });
    if (prodUpdated) {
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    state.saveProducts();
    renderCalculator();
    alert(`Đã đồng bộ đơn giá mới thành công cho ${updatedCount} sản phẩm!`);
  } else {
    alert("Tất cả sản phẩm đã khớp đơn giá mới nhất với Thư viện, không có thay đổi nào cần cập nhật.");
  }
}

// ==========================================================================
// BOM Material Catalog Picker Modal
// ==========================================================================

let selectedCatalogItemIds = new Set();
let bomPickerCatFilter = "all";
let bomPickerSearchQuery = "";

function openBOMCatalogPickerModal() {
  const modal = document.getElementById("modal-bom-catalog-picker");
  if (!modal) return;

  selectedCatalogItemIds.clear();
  bomPickerCatFilter = "all";
  bomPickerSearchQuery = "";

  const searchInput = document.getElementById("bom-picker-search");
  const catSelect = document.getElementById("bom-picker-cat-filter");
  if (searchInput) searchInput.value = "";
  if (catSelect) catSelect.value = "all";

  renderBOMPickerList();
  modal.showModal();
}

function renderBOMPickerList() {
  const container = document.getElementById("bom-picker-items-container");
  const countEl = document.getElementById("bom-picker-selected-count");
  if (!container) return;

  if (countEl) {
    countEl.textContent = `Đã chọn: ${selectedCatalogItemIds.size} vật tư`;
  }

  const catalog = state.settings.materialsCatalog || [];
  const query = bomPickerSearchQuery.trim().toLowerCase();

  const filtered = catalog.filter(item => {
    const matchesCat = bomPickerCatFilter === "all" || item.category === bomPickerCatFilter;
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) || 
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.sheetSize && item.sheetSize.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 1.5rem; font-size: 0.85rem;">Không tìm thấy vật tư nào.</div>`;
    return;
  }

  filtered.forEach(item => {
    const isSelected = selectedCatalogItemIds.has(item.id);
    const row = document.createElement("div");
    row.className = `picker-item-row ${isSelected ? "selected" : ""}`;

    let badgeClass = "badge-cat-paper";
    if (item.category === "Màng & Phủ") badgeClass = "badge-cat-film";
    else if (item.category === "Lượt In & Mực") badgeClass = "badge-cat-click";
    else if (item.category === "Vật Tư Thêu") badgeClass = "badge-cat-emb";
    else if (item.category === "Bao Bì & Đóng Gói") badgeClass = "badge-cat-pack";

    row.innerHTML = `
      <input type="checkbox" class="picker-item-checkbox" ${isSelected ? "checked" : ""}>
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <strong style="color: #ffffff; font-size: 0.88rem;">${item.name}</strong>
          <span class="badge-cat ${badgeClass}">${item.category}</span>
        </div>
        ${item.notes ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${item.notes}</div>` : ""}
      </div>
      <div style="text-align: right; min-width: 100px;">
        <div style="font-weight: 600; color: #38bdf8; font-size: 0.9rem;">${formatVND(item.defaultPrice)}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary);">/ ${item.unit}</div>
      </div>
    `;

    const checkbox = row.querySelector(".picker-item-checkbox");
    const toggleSelect = () => {
      if (selectedCatalogItemIds.has(item.id)) {
        selectedCatalogItemIds.delete(item.id);
        row.classList.remove("selected");
        checkbox.checked = false;
      } else {
        selectedCatalogItemIds.add(item.id);
        row.classList.add("selected");
        checkbox.checked = true;
      }
      if (countEl) countEl.textContent = `Đã chọn: ${selectedCatalogItemIds.size} vật tư`;
    };

    row.addEventListener("click", (e) => {
      if (e.target !== checkbox) toggleSelect();
    });
    checkbox.addEventListener("change", toggleSelect);

    container.appendChild(row);
  });
}

function handleSelectCatalogItemsToBOM() {
  if (selectedCatalogItemIds.size === 0) {
    alert("Vui lòng tích chọn ít nhất 1 vật tư!");
    return;
  }

  const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
  if (!selectedProduct) return;

  if (!selectedProduct.materials) {
    selectedProduct.materials = [];
  }

  const catalog = state.settings.materialsCatalog || [];
  let addedCount = 0;

  selectedCatalogItemIds.forEach(id => {
    const item = catalog.find(c => c.id === id);
    if (item) {
      selectedProduct.materials.push({
        name: item.name,
        qty: 1,
        unit: item.unit,
        price: item.defaultPrice
      });
      addedCount++;
    }
  });

  renderMaterialsRows(selectedProduct.materials);
  bindDynamicRowEvents();
  triggerLiveCalculation();

  const modal = document.getElementById("modal-bom-catalog-picker");
  if (modal) modal.close();

  alert(`Đã thêm thành công ${addedCount} vật tư vào Bảng BOM! Bạn hãy nhập số lượng (Qty) định mức cho từng vật tư.`);
}

// ==========================================================================
// User Management & Role-Based Access Control (RBAC)
// ==========================================================================

const PERMISSION_LABELS = {
  dashboard: "Tổng Quan",
  calculator: "Xem Giá Thành",
  calculator_edit: "Sửa BOM/Giá",
  forecast: "Dự Báo Mua Hàng",
  order_cost: "Dò Cost Đơn",
  capex: "Máy Móc & CAPEX",
  monthly_report: "Báo Cáo Tháng",
  settings: "Cấu Hình & User"
};

function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem("factory_current_user");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  if (sessionStorage.getItem("factory_auth") === "true") {
    const users = state.settings.users || [];
    const adminUser = users.find(u => u.username === "admin") || users[0];
    return adminUser || null;
  }
  return null;
}

function setCurrentUser(user) {
  if (user) {
    sessionStorage.setItem("factory_current_user", JSON.stringify(user));
    sessionStorage.setItem("factory_auth", "true");
  } else {
    sessionStorage.removeItem("factory_current_user");
    sessionStorage.removeItem("factory_auth");
  }
}

function applyUserPermissions(user) {
  if (!user) return;

  // 1. Cập nhật Badge người dùng trên Top Header
  const badgeEl = document.getElementById("current-user-badge");
  const nameEl = document.getElementById("current-user-name");
  const tagEl = document.getElementById("current-user-role-tag");

  if (badgeEl) badgeEl.style.display = "inline-flex";
  if (nameEl) nameEl.textContent = user.name || user.username;
  if (tagEl) {
    const roleDef = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS.custom;
    tagEl.textContent = roleDef.badge || user.role;
    if (roleDef.color) {
      tagEl.style.color = roleDef.color;
      tagEl.style.background = `${roleDef.color}25`;
    }
  }

  // 2. Phân quyền hiển thị Menu Sidebar
  const tabPermMap = {
    "dashboard": "dashboard",
    "calculator": "calculator",
    "forecast": "forecast",
    "order-cost": "order_cost",
    "capex": "capex",
    "monthly-report": "monthly_report",
    "settings": "settings"
  };

  const allowedTabs = [];

  document.querySelectorAll("nav.nav-menu .nav-item[data-tab]").forEach(btn => {
    const tabId = btn.getAttribute("data-tab");
    const requiredPerm = tabPermMap[tabId];
    const isAllowed = user.permissions && user.permissions.includes(requiredPerm);

    if (isAllowed) {
      btn.style.display = "flex";
      allowedTabs.push(tabId);
    } else {
      btn.style.display = "none";
    }
  });

  // 3. Nếu đang ở tab bị cấm, tự động chuyển về tab đầu tiên được phép
  const currentTab = state.activeTab || "dashboard";
  if (!allowedTabs.includes(currentTab)) {
    const fallbackTab = allowedTabs.length > 0 ? allowedTabs[0] : "dashboard";
    switchTab(fallbackTab);
  }

  // 4. Kiểm tra quyền sửa định mức Tính Giá Thành (calculator_edit)
  const canEditCalc = user.permissions && user.permissions.includes("calculator_edit");
  const readonlyBanner = document.getElementById("calculator-readonly-banner");
  if (readonlyBanner) {
    readonlyBanner.style.display = canEditCalc ? "none" : "flex";
  }

  const editControls = [
    "btn-add-product",
    "btn-add-material-row",
    "btn-add-product-machine-row",
    "btn-quick-create-machine",
    "btn-top-delete-product",
    "btn-delete-product",
    "btn-sync-yield-bom"
  ];
  editControls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = canEditCalc ? "" : "none";
  });

  const submitBtn = document.querySelector("#product-cost-form button[type='submit']");
  if (submitBtn) {
    submitBtn.style.display = canEditCalc ? "" : "none";
  }

  document.querySelectorAll(".btn-remove-material, .product-machine-del-btn, .btn-card-delete").forEach(btn => {
    btn.style.display = canEditCalc ? "" : "none";
  });
}

function renderUsersTable() {
  const tbody = document.getElementById("users-table-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const users = state.settings.users || [];
  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 1rem; color: var(--text-secondary);">Chưa có tài khoản nào.</td></tr>`;
    return;
  }

  const currentUser = getCurrentUser();

  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid rgba(255,255,255,0.04)";

    const roleDef = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.custom;
    const roleBadgeColor = roleDef.color || "#38bdf8";

    // Format permissions badges
    const permsList = (u.permissions || []).map(p => {
      const label = PERMISSION_LABELS[p] || p;
      const isEdit = p === "calculator_edit";
      const bg = isEdit ? "rgba(245, 158, 11, 0.2)" : "rgba(255,255,255,0.06)";
      const color = isEdit ? "#f59e0b" : "var(--text-secondary)";
      return `<span style="display: inline-block; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.68rem; background: ${bg}; color: ${color}; margin: 1px;">${label}</span>`;
    }).join(" ");

    const isMasterAdmin = (u.username === "admin" || u.id === "usr_admin");
    const isCurrentLoggedIn = currentUser && (currentUser.id === u.id || currentUser.username === u.username);

    tr.innerHTML = `
      <td style="padding: 0.65rem 0.75rem; font-weight: 600; color: #fff;">
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span>👤</span>
          <span>${u.username}</span>
          ${isCurrentLoggedIn ? '<span style="font-size: 0.65rem; color: #34d399; background: rgba(52, 211, 153, 0.15); padding: 0.1rem 0.35rem; border-radius: 4px;">(Bạn)</span>' : ''}
        </div>
      </td>
      <td style="padding: 0.65rem 0.75rem; color: var(--text-primary); font-weight: 500;">${u.name || 'N/A'}</td>
      <td style="padding: 0.65rem 0.75rem;">
        <span style="display: inline-block; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.72rem; font-weight: 600; background: ${roleBadgeColor}20; color: ${roleBadgeColor}; border: 1px solid ${roleBadgeColor}40;">
          ${roleDef.badge}
        </span>
      </td>
      <td style="padding: 0.65rem 0.75rem; max-width: 280px; line-height: 1.5;">${permsList}</td>
      <td style="padding: 0.65rem 0.75rem; text-align: center; white-space: nowrap;">
        <button type="button" class="btn btn-xs btn-outline btn-edit-user" data-id="${u.id}" style="color: #38bdf8; border-color: rgba(56, 189, 248, 0.3); padding: 0.2rem 0.5rem; margin-right: 0.35rem;">Sửa</button>
        ${isMasterAdmin ? '' : `<button type="button" class="btn btn-xs btn-outline btn-delete-user" data-id="${u.id}" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.3); padding: 0.2rem 0.5rem;">Xóa</button>`}
      </td>
    `;

    tr.querySelector(".btn-edit-user")?.addEventListener("click", () => openEditUserModal(u.id));
    tr.querySelector(".btn-delete-user")?.addEventListener("click", () => deleteUser(u.id));

    tbody.appendChild(tr);
  });
}

function openCreateUserModal() {
  const modal = document.getElementById("user-modal");
  const form = document.getElementById("user-management-form");
  if (!modal || !form) return;

  form.reset();
  document.getElementById("user-form-id").value = "";
  document.getElementById("user-modal-title").textContent = "➕ Tạo Tài Khoản Người Dùng Mới";
  const usernameInput = document.getElementById("user-form-username");
  if (usernameInput) {
    usernameInput.disabled = false;
    usernameInput.value = "";
  }
  const roleSelect = document.getElementById("user-form-role");
  if (roleSelect) roleSelect.value = "sales";
  
  applyRoleToPermCheckboxes("sales");

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function openEditUserModal(userId) {
  const modal = document.getElementById("user-modal");
  const form = document.getElementById("user-management-form");
  if (!modal || !form) return;

  const user = (state.settings.users || []).find(u => u.id === userId);
  if (!user) return;

  document.getElementById("user-form-id").value = user.id;
  document.getElementById("user-modal-title").textContent = `✏️ Chỉnh Sửa Tài Khoản: ${user.username}`;
  
  const usernameInput = document.getElementById("user-form-username");
  if (usernameInput) {
    usernameInput.value = user.username;
    usernameInput.disabled = (user.username === "admin" || user.id === "usr_admin");
  }

  document.getElementById("user-form-passcode").value = user.passcode || "";
  document.getElementById("user-form-fullname").value = user.name || "";
  
  const roleSelect = document.getElementById("user-form-role");
  if (roleSelect) roleSelect.value = user.role || "custom";

  document.querySelectorAll(".user-perm-checkbox").forEach(cb => {
    cb.checked = (user.permissions || []).includes(cb.value);
  });

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function applyRoleToPermCheckboxes(role) {
  const roleDef = ROLE_DEFINITIONS[role];
  if (!roleDef || role === "custom") return;
  document.querySelectorAll(".user-perm-checkbox").forEach(cb => {
    cb.checked = roleDef.permissions.includes(cb.value);
  });
}

function saveUserModal(e) {
  e.preventDefault();
  const id = document.getElementById("user-form-id").value;
  const username = (document.getElementById("user-form-username")?.value || "").trim().toLowerCase();
  const passcode = (document.getElementById("user-form-passcode")?.value || "").trim();
  const name = (document.getElementById("user-form-fullname")?.value || "").trim();
  const role = document.getElementById("user-form-role")?.value || "custom";

  if (!username) {
    alert("Vui lòng nhập tên đăng nhập!");
    return;
  }
  if (!passcode || passcode.length < 4) {
    alert("Mật khẩu phải có tối thiểu 4 ký tự!");
    return;
  }
  if (!name) {
    alert("Vui lòng nhập họ tên hoặc tên bộ phận!");
    return;
  }

  const permissions = [];
  document.querySelectorAll(".user-perm-checkbox:checked").forEach(cb => {
    permissions.push(cb.value);
  });

  if (permissions.length === 0) {
    alert("Vui lòng chọn ít nhất 1 quyền truy cập cho người dùng!");
    return;
  }

  const users = state.settings.users || [];

  if (id) {
    const existing = users.find(u => u.id === id);
    if (!existing) return;

    if (existing.username !== username && users.some(u => u.id !== id && u.username.toLowerCase() === username)) {
      alert(`Tên đăng nhập "${username}" đã tồn tại! Vui lòng chọn tên khác.`);
      return;
    }

    existing.username = username;
    existing.passcode = passcode;
    existing.name = name;
    existing.role = role;
    existing.permissions = permissions;

    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id === id || currentUser.username === username)) {
      setCurrentUser(existing);
      applyUserPermissions(existing);
    }
    if (existing.username === "admin" || existing.id === "usr_admin") {
      state.settings.passcode = passcode;
    }
  } else {
    if (users.some(u => u.username.toLowerCase() === username)) {
      alert(`Tên đăng nhập "${username}" đã tồn tại! Vui lòng chọn tên khác.`);
      return;
    }

    const newUser = {
      id: "usr_" + Date.now(),
      username,
      passcode,
      name,
      role,
      permissions,
      createdAt: new Date().toISOString().split("T")[0]
    };
    users.push(newUser);
  }

  state.saveSettings({
    ...state.settings,
    users
  });

  const modal = document.getElementById("user-modal");
  if (modal) {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  renderUsersTable();
  alert("Lưu thông tin người dùng thành công!");
}

function deleteUser(userId) {
  const users = state.settings.users || [];
  const user = users.find(u => u.id === userId);
  if (!user) return;

  if (user.username === "admin" || user.id === "usr_admin") {
    alert("Không thể xóa tài khoản Quản Trị Viên (Admin) gốc!");
    return;
  }

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    alert("Bạn không thể tự xóa tài khoản đang đăng nhập!");
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.username}" (${user.name}) không?`)) {
    const updatedUsers = users.filter(u => u.id !== userId);
    state.saveSettings({
      ...state.settings,
      users: updatedUsers
    });
    renderUsersTable();
    alert("Đã xóa người dùng thành công!");
  }
}

// ==========================================================================
// 9. Modals & Popups for Product Creation
// ==========================================================================

const productModal = document.getElementById("product-modal");

function openCreateProductModal() {
  document.getElementById("modal-product-form").reset();
  const modalLayoutGroup = document.getElementById("modal-layout-toggle-group");
  const modalLayoutCheck = document.getElementById("modal-product-has-layout");
  if (modalLayoutGroup) modalLayoutGroup.style.display = "block";
  if (modalLayoutCheck) modalLayoutCheck.checked = false; // Mặc định không thêm nếu sản phẩm không cần xếp khổ
  productModal.showModal();
}

function closeCreateProductModal() {
  productModal.close();
}

function handleCreateProductSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("modal-product-name").value;
  const factoryType = document.getElementById("modal-factory-type").value;
  const code = document.getElementById("modal-product-code").value;
  const category = document.getElementById("modal-product-category").value;
  const hasLayout = factoryType === "In" && !!document.getElementById("modal-product-has-layout")?.checked;

  const newId = `prod-${Date.now()}`;
  
  // Default values based on factory type
  const newProduct = {
    id: newId,
    name,
    code,
    category,
    factoryType,
    hasLayout: hasLayout,
    layout: hasLayout ? {
      preset: "",
      sheetSize: "33x48cm",
      itemSize: "2.0 inch",
      itemsPerSheet: 40,
      unitType: "Tờ"
    } : null,
    materials: [],
    labor: factoryType === "In" 
      ? { designer: 0.01, production: 0.1, qc: 0.05 } 
      : { designer: 0.02, laser: 0.01, production: 0.15, qc: 0.05 },
    electricity: { power: 2.0, runTime: 0.2 },
    overheadPercentage: state.settings.defaultOverhead,
    profitPercentage: state.settings.defaultProfitMargin !== undefined ? state.settings.defaultProfitMargin : 20,
    forecast: {
      actualSales: 0,
      salesForecast: 0,
      currentStock: 0,
      safetyStock: 0
    }
  };

  state.products.push(newProduct);
  state.saveProducts();
  state.selectedProductId = newId;

  closeCreateProductModal();
  switchTab("calculator");
  alert(`Đã tạo mới sản phẩm "${name}" thành công!`);
}

// ==========================================================================
// 10. DOM Event Listeners Binding
// ==========================================================================

// Global Event Masking for Vietnamese Currency inputs (Adds dot separators e.g. 50000 -> 50.000)
function maskCurrencyInput(element) {
  element.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      value = parseInt(value, 10).toLocaleString("vi-VN");
    }
    e.target.value = value;
  });
}

function bindDynamicRowEvents() {
  document.querySelectorAll("#materials-tbody .currency-input").forEach(maskCurrencyInput);
  document.querySelectorAll("#materials-tbody .calc-trigger").forEach(el => {
    el.addEventListener("input", triggerLiveCalculation);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Logic (Light/Dark Mode)
  const themeToggleBtn = document.getElementById("btn-theme-toggle");
  
  const updateThemeUI = (theme) => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
      themeToggleBtn.textContent = "🌙";
      themeToggleBtn.title = "Chuyển sang Chế độ Tối";
    } else {
      document.body.classList.remove("light-mode");
      themeToggleBtn.textContent = "☀️";
      themeToggleBtn.title = "Chuyển sang Chế độ Sáng";
    }
  };

  const currentTheme = localStorage.getItem("factory_theme") || "dark";
  updateThemeUI(currentTheme);

  themeToggleBtn.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-mode");
    const newTheme = isLight ? "dark" : "light";
    localStorage.setItem("factory_theme", newTheme);
    updateThemeUI(newTheme);
    updateDashboard(); // Redraw charts
  });

  // Dynamic forecast months initialization
  updateDynamicForecastMonths();

  // Auth validation overlay & multi-user RBAC logic
  const loginForm = document.getElementById("login-form");
  const loginOverlay = document.getElementById("login-overlay");
  const loginUsernameInput = document.getElementById("login-username");
  const loginPasscodeInput = document.getElementById("login-passcode");
  const loginError = document.getElementById("login-error-msg");

  const activeUser = getCurrentUser();
  if (sessionStorage.getItem("factory_auth") === "true" && activeUser) {
    loginOverlay.style.display = "none";
    applyUserPermissions(activeUser);
  } else {
    loginOverlay.style.display = "flex";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const typedUsername = (loginUsernameInput?.value || "").trim().toLowerCase();
    const typedPasscode = (loginPasscodeInput?.value || "").trim();

    const users = state.settings.users || [];
    let matchedUser = null;

    if (typedUsername) {
      matchedUser = users.find(u => u.username.toLowerCase() === typedUsername && u.passcode === typedPasscode);
    }
    
    // Fallback: Nếu không tìm thấy hoặc người dùng chỉ gõ passcode
    if (!matchedUser && typedPasscode) {
      const masterPasscode = state.settings.passcode || "123456";
      if (typedPasscode === masterPasscode) {
        matchedUser = users.find(u => u.username === "admin") || users[0];
      } else {
        matchedUser = users.find(u => u.passcode === typedPasscode);
      }
    }

    if (matchedUser) {
      setCurrentUser(matchedUser);
      applyUserPermissions(matchedUser);
      loginOverlay.style.opacity = "0";
      setTimeout(() => {
        loginOverlay.style.display = "none";
      }, 400);
      if (loginError) loginError.textContent = "";
    } else {
      if (loginError) loginError.textContent = "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại!";
      if (loginPasscodeInput) {
        loginPasscodeInput.value = "";
        loginPasscodeInput.focus();
      }
    }
  });

  document.getElementById("btn-logout").addEventListener("click", () => {
    if (confirm("Bạn có muốn đăng xuất khỏi hệ thống không?")) {
      setCurrentUser(null);
      window.location.reload();
    }
  });

  // User Management Modal bindings
  const btnOpenCreateUser = document.getElementById("btn-open-create-user-modal");
  if (btnOpenCreateUser) {
    btnOpenCreateUser.addEventListener("click", openCreateUserModal);
  }

  const btnCloseUserModal = document.getElementById("btn-close-user-modal");
  const btnCancelUserModal = document.getElementById("btn-cancel-user-modal");
  const userModal = document.getElementById("user-modal");
  const closeUserModal = () => {
    if (!userModal) return;
    if (typeof userModal.close === "function") userModal.close();
    else userModal.removeAttribute("open");
  };
  if (btnCloseUserModal) btnCloseUserModal.addEventListener("click", closeUserModal);
  if (btnCancelUserModal) btnCancelUserModal.addEventListener("click", closeUserModal);

  const userForm = document.getElementById("user-management-form");
  if (userForm) {
    userForm.addEventListener("submit", saveUserModal);
  }

  const roleSelect = document.getElementById("user-form-role");
  if (roleSelect) {
    roleSelect.addEventListener("change", (e) => {
      applyRoleToPermCheckboxes(e.target.value);
    });
  }

  document.querySelectorAll(".user-perm-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      if (roleSelect && roleSelect.value !== "custom") {
        roleSelect.value = "custom";
      }
    });
  });

  document.getElementById("settings-security-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const current = document.getElementById("security-current-passcode").value;
    const newPass = document.getElementById("security-new-passcode").value;
    const confirmPass = document.getElementById("security-confirm-passcode").value;

    const correctPasscode = state.settings.passcode || "123456";
    if (current !== correctPasscode) {
      alert("Mật khẩu hiện tại không chính xác!");
      return;
    }
    if (newPass.length < 4) {
      alert("Mật khẩu mới phải từ 4 ký tự trở lên!");
      return;
    }
    if (newPass !== confirmPass) {
      alert("Xác nhận mật khẩu mới không khớp!");
      return;
    }

    const users = state.settings.users || [];
    const adminUser = users.find(u => u.username === "admin" || u.id === "usr_admin");
    if (adminUser) adminUser.passcode = newPass;

    state.saveSettings({
      ...state.settings,
      passcode: newPass,
      users: users
    });
    alert("Đổi mật khẩu truy cập thành công!");
    document.getElementById("settings-security-form").reset();
  });

  // 1. Tab switches
  document.querySelectorAll(".nav-menu .nav-item").forEach(btn => {
    if (btn.id === "btn-logout") return;
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")));
  });

  // Top header JSON export/import buttons
  document.getElementById("btn-export").addEventListener("click", exportBackupData);
  document.getElementById("import-file-input").addEventListener("change", importBackupData);

  // Dashboard buttons
  document.getElementById("btn-dashboard-go-forecast").addEventListener("click", () => switchTab("forecast"));
  const btnGotoCapex = document.getElementById("btn-goto-capex-tab");
  if (btnGotoCapex) {
    btnGotoCapex.addEventListener("click", () => switchTab("capex"));
  }

  // 2. Calculator triggers
  document.getElementById("btn-add-product").addEventListener("click", openCreateProductModal);
  document.getElementById("calc-search").addEventListener("input", renderCalculator);
  document.getElementById("calc-filter-factory").addEventListener("change", renderCalculator);
  const calcCatFilter = document.getElementById("calc-filter-category");
  if (calcCatFilter) {
    calcCatFilter.addEventListener("change", renderCalculator);
  }

  document.getElementById("btn-add-material-row").addEventListener("click", addNewMaterialRow);
  
  // Custom rate input masking
  document.querySelectorAll(".calculator-form-panel .currency-input").forEach(maskCurrencyInput);
  
  // Reactivity to changes in form inputs
  document.querySelectorAll(".calculator-form-panel .calc-trigger").forEach(el => {
    el.addEventListener("input", triggerLiveCalculation);
    el.addEventListener("change", triggerLiveCalculation);
  });

  const prodNameInput = document.getElementById("product-name");
  if (prodNameInput) {
    prodNameInput.addEventListener("input", (e) => {
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (selectedProduct) {
        selectedProduct.name = e.target.value;
        state.saveProducts();
        const card = document.querySelector(`.product-card-item[data-id="${selectedProduct.id}"]`) || document.querySelector(".product-card-item.selected");
        if (card) {
          const nameEl = card.querySelector(".product-card-name");
          if (nameEl) nameEl.textContent = selectedProduct.name;
        }
      }
    });
  }

  const prodCodeInput = document.getElementById("product-code");
  if (prodCodeInput) {
    prodCodeInput.addEventListener("input", (e) => {
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (selectedProduct) {
        selectedProduct.code = e.target.value;
        state.saveProducts();
        const card = document.querySelector(`.product-card-item[data-id="${selectedProduct.id}"]`) || document.querySelector(".product-card-item.selected");
        if (card) {
          const skuEl = card.querySelector(".product-card-sku");
          if (skuEl) skuEl.textContent = selectedProduct.code || 'N/A';
        }
      }
    });
  }

  // Watch for factory radio toggle changes
  document.querySelectorAll('input[name="factoryType"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      toggleFactoryInputs(e.target.value);
      
      // Update form parameters dynamically when toggled
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (selectedProduct) {
        if (e.target.value === "In") {
          document.getElementById("labor-print-designer").value = 0.02;
          document.getElementById("labor-print-production").value = 0.15;
          document.getElementById("labor-print-qc").value = 0.05;
        } else {
          document.getElementById("labor-embroid-designer").value = 0.03;
          document.getElementById("labor-embroid-laser").value = 0.01;
          document.getElementById("labor-embroid-production").value = 0.2;
          document.getElementById("labor-embroid-qc").value = 0.06;
        }
      }
      
      triggerLiveCalculation();
    });
  });

  // Form buttons
  document.getElementById("product-cost-form").addEventListener("submit", saveProductCostForm);
  document.getElementById("btn-delete-product").addEventListener("click", deleteCurrentProduct);
  const topDeleteBtn = document.getElementById("btn-top-delete-product");
  if (topDeleteBtn) {
    topDeleteBtn.addEventListener("click", deleteCurrentProduct);
  }
  document.getElementById("btn-cancel-edit").addEventListener("click", cancelEditCalculator);

  // 3. Forecast tab triggers
  document.getElementById("forecast-search").addEventListener("input", renderForecast);
  document.getElementById("forecast-filter-factory").addEventListener("change", renderForecast);
  const forecastCatFilter = document.getElementById("forecast-filter-category");
  if (forecastCatFilter) {
    forecastCatFilter.addEventListener("change", () => {
      renderForecast();
      recalculateForecastTotals();
    });
  }

  const downloadSampleBtn = document.getElementById("btn-download-sample-csv");
  if (downloadSampleBtn) {
    downloadSampleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const csvContent = 
`Mã sản phẩm (SKU),Tên sản phẩm,Biến thể (Size),Số lượng bán
ST-AN-SUA-01,Sticker Decal An Nam Sữa Mờ,2 inches,1500
ST-AN-SUA-01,Sticker Decal An Nam Sữa Mờ,2 inches,1200
ST-TK-SUA-03,Sticker Decal ThaiKK Sữa Mờ,2 inches,2400
ST-UV-DTF-04,Sticker UV-DTF,2 inches,3500
PC-PAPER-01,Bộ bài Playing Cards (Hộp giấy),Mặc định,150
HD-EMB-01,Áo hoodie thêu nổi chữ kí Signature,Mặc định,250
ST-AN-SUA-01,Sticker Decal An Nam Sữa Mờ,3 inches,800
ST-AN-SUA-01,Sticker Decal An Nam Sữa Mờ,4 inches,600`;

      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "doanh_so_mau_thang_7.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  const salesCsvFileInput = document.getElementById("sales-csv-file");
  if (salesCsvFileInput) {
    salesCsvFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const fileExt = file.name.split('.').pop().toLowerCase();
      const reader = new FileReader();

      reader.onload = async (evt) => {
        let rows = [];

        try {
          if (fileExt === 'xlsx' || fileExt === 'xls') {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          } else {
            const text = evt.target.result;
            if (!text) {
              alert("File CSV trống hoặc không đúng định dạng!");
              return;
            }

            const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
            if (lines.length < 2) {
              alert("File CSV cần ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu!");
              return;
            }

            const firstLine = lines[0];
            let sep = ",";
            if (firstLine.includes(";")) sep = ";";
            else if (firstLine.includes("\t")) sep = "\t";

            const splitCSVRow = (row) => {
              const result = [];
              let insideQuote = false;
              let entry = "";
              for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"') {
                  insideQuote = !insideQuote;
                } else if (char === sep && !insideQuote) {
                  result.push(entry.trim().replace(/^"|"$/g, ''));
                  entry = "";
                } else {
                  entry += char;
                }
              }
              result.push(entry.trim().replace(/^"|"$/g, ''));
              return result;
            };

            rows = lines.map(splitCSVRow);
          }
        } catch (error) {
          console.error("Error parsing spreadsheet file:", error);
          alert("Lỗi khi đọc file! Vui lòng đảm bảo file không bị hỏng và ở định dạng .xlsx, .xls hoặc .csv.");
          return;
        }

        if (rows.length < 2) {
          alert("Bảng tính cần ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu!");
          return;
        }

        const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
        
        let skuIdx = -1;
        let nameIdx = -1;
        let varIdx = -1;
        let qtyIdx = -1;
        let statusIdx = -1;

        headers.forEach((h, idx) => {
          if (h.includes("sku") || h.includes("mã") || h.includes("code")) {
            skuIdx = idx;
          } else if (h.includes("tên") || h.includes("name") || h.includes("sản phẩm") || h.includes("product")) {
            nameIdx = idx;
          } else if (h.includes("biến thể") || h.includes("variation") || h.includes("variant") || h.includes("phân loại") || h.includes("kích thước") || h.includes("size")) {
            varIdx = idx;
          } else if (h.includes("status") || h.includes("trạng thái") || h.includes("tình trạng")) {
            statusIdx = idx;
          }
          
          if (h.includes("sản lượng") || h.includes("số lượng") || h.includes("qty") || h.includes("quantity") || h.includes("sales") || h.includes("bán")) {
            qtyIdx = idx;
          }
        });

        if (skuIdx === -1) skuIdx = 0;
        if (nameIdx === -1) nameIdx = 1;
        if (qtyIdx === -1) qtyIdx = 2;

        const normalizeString = (str) => {
          if (!str) return "";
          return String(str).toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]/g, "");
        };

        const normalizeSize = (str) => {
          if (!str) return "";
          const normalized = String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
          const match = normalized.match(/([0-9]+(\.[0-9]+)?)\s*(inch|inches|in|ip|\"|s)/);
          if (match) return parseFloat(match[1]) + "in";
          const numMatch = normalized.match(/^[0-9]+(\.[0-9]+)?$/);
          if (numMatch) return parseFloat(numMatch[0]) + "in";
          const anyNum = normalized.match(/([0-9]+(\.[0-9]+)?)/);
          if (anyNum) return parseFloat(anyNum[1]) + "in";
          return "";
        };

        const findBestMatch = (csvSku, csvName, csvVar, products) => {
          // 0. Use Smart SKU Prefix Engine (v24.0)
          const smartMatch = matchProductBySkuPrefix(csvSku, csvName, csvVar);
          if (smartMatch && smartMatch.product) {
            return smartMatch.product;
          }

          const normSku = normalizeString(csvSku);
          const normName = normalizeString(csvName);
          const normVar = normalizeString(csvVar);
          const normCsvSize = normalizeSize(csvVar) || normalizeSize(csvSku) || normalizeSize(csvName);

          // 1. Exact SKU Match
          if (normSku) {
            const match = products.find(p => normalizeString(p.code) === normSku);
            if (match) return match;
          }

          // 2. Exact Name Match
          if (normName) {
            const match = products.find(p => normalizeString(p.name) === normName);
            if (match) return match;
          }

          // 3. Partial Name/Code matching
          const potentials = products.filter(p => {
            const normPCode = normalizeString(p.code);
            const normPName = normalizeString(p.name);
            const skuPartial = normSku && (normPCode.includes(normSku) || normSku.includes(normPCode));
            const namePartial = normName && (normPName.includes(normName) || normPName.includes(normPName));
            return skuPartial || namePartial;
          });

          if (potentials.length === 1) return potentials[0];

          if (potentials.length > 1) {
            if (normCsvSize) {
              const sizeMatch = potentials.find(p => {
                const pSize = normalizeSize(p.name) || (p.sizeVariation ? p.sizeVariation + "in" : "");
                return pSize === normCsvSize;
              });
              if (sizeMatch) return sizeMatch;
            }
            
            const prefixMatch = potentials.find(p => {
              if (!normSku || !p.code) return false;
              return normSku.startsWith(normalizeString(p.code));
            });
            if (prefixMatch) return prefixMatch;
          }
          return null;
        };

        const overwrite = confirm("Hệ thống sẽ đặt lại số lượng bán Tháng 7 của tất cả sản phẩm về 0 trước khi nhập. Nhấn OK để đồng ý (Khuyên dùng), nhấn Cancel để CỘNG DỒN doanh số mới.");
        if (overwrite) {
          state.products.forEach(p => {
            p.forecast.actualSales = 0;
            p.forecast.salesForecast = 0;
          });
        }

        const quantitiesToAdd = {};
        const unmatchedList = [];
        let totalRowsParsed = 0;
        let matchedRowsCount = 0;
        let totalQtyImported = 0;
        let cancelledCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (!cols || cols.length < 2) continue;

          // Filter out CANCEL status rows
          if (statusIdx !== -1) {
            const statusValue = String(cols[statusIdx] || '').trim().toUpperCase();
            if (statusValue.includes("CANCEL") || statusValue.includes("HỦY")) {
              cancelledCount++;
              continue;
            }
          }

          totalRowsParsed++;
          const sku = cols[skuIdx] || "";
          const name = cols[nameIdx] || "";
          const variation = varIdx !== -1 ? cols[varIdx] || "" : "";
          const qtyVal = parseFloat(cols[qtyIdx]) || 0;

          if (!sku && !name) continue;

          const matchedProd = findBestMatch(sku, name, variation, state.products);
          if (matchedProd) {
            quantitiesToAdd[matchedProd.id] = (quantitiesToAdd[matchedProd.id] || 0) + qtyVal;
            matchedRowsCount++;
            totalQtyImported += qtyVal;
          } else {
            const lineDesc = [sku, name, variation].filter(Boolean).join(" | ");
            unmatchedList.push(`${lineDesc} (Qty: ${qtyVal})`);
          }
        }

        // Apply quantities
        let updatedCount = 0;
        Object.keys(quantitiesToAdd).forEach(pId => {
          const p = state.products.find(x => x.id === pId);
          if (p) {
            p.forecast.actualSales = (p.forecast.actualSales || 0) + quantitiesToAdd[pId];
            p.forecast.salesForecast = Math.round(p.forecast.actualSales * 1.1);
            updatedCount++;
          }
        });

        if (updatedCount > 0) {
          state.saveProducts();
          renderForecast();
          recalculateForecastTotals();
          if (state.googleSheetUrl) {
            state.syncToCloud();
          }

          // Populate report modal
          const reportModal = document.getElementById("sales-report-modal");
          document.getElementById("sales-report-total-rows").textContent = totalRowsParsed.toLocaleString('vi-VN');
          document.getElementById("sales-report-matched-rows").textContent = matchedRowsCount.toLocaleString('vi-VN');
          document.getElementById("sales-report-total-qty").textContent = totalQtyImported.toLocaleString('vi-VN');

          const reportTbody = document.getElementById("sales-report-tbody");
          reportTbody.innerHTML = "";

          state.products.forEach(p => {
            if (p.forecast.actualSales > 0) {
              const sizeLabel = p.sizeVariation ? `${p.sizeVariation} inch` : (normalizeSize(p.name) ? normalizeSize(p.name).replace("in", " inch") : "Mặc định");
              const tr = document.createElement("tr");
              tr.style.borderBottom = "1px solid var(--border-glass)";
              tr.innerHTML = `
                <td style="padding: 0.6rem; font-family: monospace;">${p.code || 'N/A'}</td>
                <td style="padding: 0.6rem; color: #fff; font-weight: 500;">${p.name}</td>
                <td style="padding: 0.6rem; color: #a5b4fc;">${sizeLabel}</td>
                <td style="padding: 0.6rem; text-align: right; font-weight: 600; color: #f59e0b;">${p.forecast.actualSales.toLocaleString('vi-VN')}</td>
                <td style="padding: 0.6rem; text-align: right; font-weight: 600; color: #34d399;">${p.forecast.salesForecast.toLocaleString('vi-VN')}</td>
              `;
              reportTbody.appendChild(tr);
            }
          });

          if (reportTbody.innerHTML === "") {
            reportTbody.innerHTML = `<tr><td colspan="5" style="padding: 1rem; text-align: center; color: var(--text-secondary);">Không có sản phẩm nào được nhập sản lượng bán lớn hơn 0.</td></tr>`;
          }

          const unmatchedPanel = document.getElementById("sales-report-unmatched-panel");
          const unmatchedListEl = document.getElementById("sales-report-unmatched-list");
          const unmatchedTitle = document.getElementById("sales-report-unmatched-title");

          if (unmatchedList.length > 0) {
            unmatchedPanel.style.display = "block";
            let warningText = `⚠️ Không Thể Đối Khớp (${unmatchedList.length} dòng đã bỏ qua)`;
            if (cancelledCount > 0) warningText += ` [Đã lọc bỏ ${cancelledCount} dòng Hủy đơn]`;
            if (unmatchedTitle) unmatchedTitle.textContent = warningText;
            unmatchedListEl.textContent = unmatchedList.join("\n");
          } else if (cancelledCount > 0) {
            unmatchedPanel.style.display = "block";
            if (unmatchedTitle) unmatchedTitle.textContent = `ℹ️ Đã tự động lọc bỏ ${cancelledCount} dòng đơn hàng CANCEL/HỦY`;
            unmatchedListEl.textContent = "Không có dòng không đối khớp nào bị lỗi.";
          } else {
            unmatchedPanel.style.display = "none";
          }

          if (reportModal) {
            reportModal.showModal();
          }
        } else {
          alert("Không khớp được sản phẩm nào trong file Excel/CSV! Vui lòng kiểm tra lại cột Mã sản phẩm (SKU) hoặc Tên sản phẩm.");
        }
        
        salesCsvFileInput.value = "";
      };

      if (fileExt === 'xlsx' || fileExt === 'xls') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }

  // Register sales report modal closing triggers
  const reportModal = document.getElementById("sales-report-modal");
  if (reportModal) {
    document.getElementById("sales-report-close-btn").addEventListener("click", () => reportModal.close());
    document.getElementById("sales-report-btn-done").addEventListener("click", () => {
      reportModal.close();
      const mrpHeader = document.querySelector("#tab-forecast h4");
      if (mrpHeader) {
        mrpHeader.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 4. Settings tab triggers
  document.getElementById("settings-cost-form").addEventListener("submit", saveSettingsForm);
  document.getElementById("settings-hr-form").addEventListener("submit", saveHrSettingsForm);
  document.getElementById("btn-settings-export").addEventListener("click", exportBackupData);
  document.getElementById("btn-settings-reset").addEventListener("click", resetMockData);
  document.querySelectorAll(".settings-form .currency-input").forEach(maskCurrencyInput);
  
  // CapEx Form submit handler
  const capexForm = document.getElementById("settings-capex-form");
  if (capexForm) {
    const capexInvestmentInput = document.getElementById("capex-mach-investment");
    if (capexInvestmentInput) maskCurrencyInput(capexInvestmentInput);
    
    capexForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("capex-mach-name").value.trim();
      const investment = parseCurrencyInput(document.getElementById("capex-mach-investment").value);
      const years = parseFloat(document.getElementById("capex-mach-years").value) || 2;
      const expectedVol = parseFloat(document.getElementById("capex-mach-expected-vol").value) || 20000;
      const unitType = document.getElementById("capex-mach-unit-type").value;

      if (!name || investment <= 0 || years <= 0 || expectedVol <= 0) {
        alert("Vui lòng điền đầy đủ và chính xác thông tin máy móc đầu tư!");
        return;
      }

      const targetVolume = years * expectedVol;
      const surcharge = Math.round(investment / targetVolume);
      
      const newMachine = {
        id: `mach-${Date.now()}`,
        name,
        category: "In, Cắt & Hoàn Thiện",
        factoryType: "In",
        quantity: 1,
        unitPrice: investment,
        investment,
        paybackYears: years,
        expectedVolumePerYear: expectedVol,
        currentVolume: 0,
        surchargePerUnit: surcharge,
        discountAfter3Years: 80,
        unitType
      };

      if (!state.settings.machines) {
        state.settings.machines = [];
      }
      state.settings.machines.push(newMachine);
      state.saveSettings(state.settings);

      capexForm.reset();
      renderSettings();
      renderCapexView();
      renderCalculator();
      alert(`Đã thêm thiết lập hòa vốn thành công cho máy "${name}"!`);
    });
  }

  // Edit & Accumulate Investment for Capex Machines
  const editCapexForm = document.getElementById("modal-edit-capex-form");
  if (editCapexForm) {
    editCapexForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const machId = document.getElementById("modal-edit-capex-id").value;
      const mach = machId ? state.settings.machines?.find(m => m.id === machId) : null;
      const isCreateNew = !machId;

      const name = document.getElementById("modal-edit-capex-name").value.trim();
      const curInv = parseInt((document.getElementById("modal-edit-capex-investment").value || "0").replace(/[^0-9]/g, ""), 10) || 0;
      const addInv = parseInt((document.getElementById("modal-edit-capex-add-investment").value || "0").replace(/[^0-9]/g, ""), 10) || 0;
      const totalInv = curInv + addInv;
      const years = parseFloat(document.getElementById("modal-edit-capex-years").value) || 3;
      const expectedVol = parseFloat(document.getElementById("modal-edit-capex-expected-vol").value) || 20000;
      const unitType = document.getElementById("modal-edit-capex-unit-type").value || "Cái";
      const discount = parseFloat(document.getElementById("modal-edit-capex-discount").value) || 80;
      const currentVol = parseFloat(document.getElementById("modal-edit-capex-current-vol").value) || 0;

      if (!name || totalInv <= 0 || years <= 0 || expectedVol <= 0) {
        alert("Vui lòng điền đầy đủ và chính xác thông tin máy móc đầu tư!");
        return;
      }

      const targetVol = years * expectedVol;
      const surcharge = Math.round(totalInv / targetVol);

      if (isCreateNew) {
        const newMachId = "mach-" + Date.now();
        const selectedProd = state.products.find(p => p.id === state.selectedProductId);
        const factoryType = selectedProd ? selectedProd.factoryType : "In";
        const category = factoryType === "Thêu" ? "Thêu & Laser" : (factoryType === "In 3D" ? "Máy in 3D" : "In, Cắt & Hoàn Thiện");

        const newMachine = {
          id: newMachId,
          name: name,
          category: category,
          factoryType: factoryType,
          quantity: 1,
          unitPrice: totalInv,
          investment: totalInv,
          paybackYears: years,
          expectedVolumePerYear: expectedVol,
          currentVolume: currentVol,
          surchargePerUnit: surcharge,
          discountAfter3Years: discount,
          unitType: unitType
        };

        if (!state.settings.machines) state.settings.machines = [];
        state.settings.machines.push(newMachine);
        state.saveSettings(state.settings);

        // Auto-assign to current product if selected
        if (selectedProd) {
          syncProductMachinesFromDom(selectedProd);
          if (!selectedProd.paybackMachines) selectedProd.paybackMachines = [];
          selectedProd.paybackMachines.push({
            machineId: newMachId,
            qty: 1
          });
          selectedProd.paybackMachineId = selectedProd.paybackMachines[0].machineId;
          selectedProd.paybackMachineQty = selectedProd.paybackMachines[0].qty;
          state.saveProducts();
        }

        const modal = document.getElementById("modal-edit-capex");
        if (modal) {
          if (typeof modal.close === "function") modal.close();
          else modal.removeAttribute("open");
        }

        renderSettings();
        renderCapexView();
        renderCalculator();
        recalculateForecastTotals();
        updateDashboard();

        alert(`✅ Đã tạo mới thành công máy "${name}" và đưa vào hệ thống CAPEX!\n\n- Vốn đầu tư: ${formatVND(totalInv)}\n- Phụ phí khấu hao: ${formatVND(surcharge)} / ${unitType}\n\nĐã tự động liên kết máy này vào sản phẩm đang tính giá.`);
        return;
      }

      if (!mach) return;

      mach.name = name;
      mach.investment = totalInv;
      mach.paybackYears = years;
      mach.expectedVolumePerYear = expectedVol;
      mach.unitType = unitType;
      mach.discountAfter3Years = discount;
      mach.currentVolume = currentVol;
      mach.surchargePerUnit = surcharge;

      state.saveSettings(state.settings);

      const modal = document.getElementById("modal-edit-capex");
      if (modal) {
        if (typeof modal.close === "function") modal.close();
        else modal.removeAttribute("open");
      }

      renderSettings();
      renderCapexView();
      renderCalculator();
      recalculateForecastTotals();
      updateDashboard();

      let addMsg = addInv > 0 ? ` (Đã cộng dồn thêm ${formatVND(addInv)})` : "";
      alert(`✅ Đã cập nhật thành công máy "${name}"!\n\n- Vốn đầu tư mới: ${formatVND(totalInv)}${addMsg}\n- Phụ phí khấu hao mới: ${formatVND(surcharge)} / ${unitType}`);
    });
  }

  document.getElementById("modal-edit-capex-close-btn")?.addEventListener("click", () => {
    const modal = document.getElementById("modal-edit-capex");
    if (typeof modal?.close === "function") modal.close();
    else modal?.removeAttribute("open");
  });

  document.getElementById("modal-edit-capex-cancel-btn")?.addEventListener("click", () => {
    const modal = document.getElementById("modal-edit-capex");
    if (typeof modal?.close === "function") modal.close();
    else modal?.removeAttribute("open");
  });

  // Copy Google Apps Script Button
  const copyScriptBtn = document.getElementById("btn-copy-apps-script");
  if (copyScriptBtn) {
    copyScriptBtn.addEventListener("click", () => {
      const codeBlock = document.getElementById("apps-script-code-block");
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent.trim()).then(() => {
          const originalText = copyScriptBtn.textContent;
          copyScriptBtn.textContent = "✅ Đã sao chép!";
          setTimeout(() => { copyScriptBtn.textContent = originalText; }, 2000);
        }).catch(() => {
          alert("Vui lòng bôi đen và sao chép thủ công toàn bộ đoạn mã trong khung!");
        });
      }
    });
  }
  
  // Live hourly rate calculations in Settings
  document.getElementById("settings-standard-hours").addEventListener("input", () => {
    const val = parseFloat(document.getElementById("settings-standard-hours").value) || 208;
    state.settings.standardHours = val;
    renderSettings();
  });

  // 5. Modal buttons
  document.getElementById("modal-close-btn").addEventListener("click", closeCreateProductModal);
  document.getElementById("modal-btn-cancel").addEventListener("click", closeCreateProductModal);
  document.getElementById("modal-product-form").addEventListener("submit", handleCreateProductSubmit);

  // Modal Factory Type change listener
  const modalFactoryType = document.getElementById("modal-factory-type");
  const modalLayoutToggleGroup = document.getElementById("modal-layout-toggle-group");
  const modalProductHasLayout = document.getElementById("modal-product-has-layout");
  if (modalFactoryType && modalLayoutToggleGroup) {
    modalFactoryType.addEventListener("change", (e) => {
      if (e.target.value === "In") {
        modalLayoutToggleGroup.style.display = "block";
      } else {
        modalLayoutToggleGroup.style.display = "none";
        if (modalProductHasLayout) modalProductHasLayout.checked = false;
      }
    });
  }

  // Imposition Layout Event Listeners
  const productHasLayout = document.getElementById("product-has-layout");
  if (productHasLayout) {
    productHasLayout.addEventListener("change", (e) => {
      const checked = e.target.checked;
      const layoutDetails = document.getElementById("imposition-layout-details");
      const layoutDisabledMsg = document.getElementById("imposition-layout-disabled-msg");
      const layoutBadge = document.getElementById("product-layout-status-badge");
      if (checked) {
        if (layoutDetails) layoutDetails.style.display = "block";
        if (layoutDisabledMsg) layoutDisabledMsg.style.display = "none";
        if (layoutBadge) {
          layoutBadge.textContent = "Đang áp dụng";
          layoutBadge.style.color = "#34d399";
          layoutBadge.style.borderColor = "rgba(52, 211, 153, 0.4)";
          layoutBadge.style.background = "rgba(52, 211, 153, 0.15)";
        }
        updateImpositionOrderCalc();
      } else {
        if (layoutDetails) layoutDetails.style.display = "none";
        if (layoutDisabledMsg) layoutDisabledMsg.style.display = "block";
        if (layoutBadge) {
          layoutBadge.textContent = "Không áp dụng";
          layoutBadge.style.color = "var(--text-muted)";
          layoutBadge.style.borderColor = "rgba(255, 255, 255, 0.1)";
          layoutBadge.style.background = "rgba(255, 255, 255, 0.05)";
        }
      }
    });
  }

  const layoutPreset = document.getElementById("layout-preset");
  const layoutSheetSize = document.getElementById("layout-sheet-size");
  const layoutItemSize = document.getElementById("layout-item-size");
  const layoutItemSizeSelect = document.getElementById("layout-item-size-select");
  const layoutItemsPerSheet = document.getElementById("layout-items-per-sheet");
  const btnSyncYieldToBOM = document.getElementById("btn-sync-yield-to-bom");

  // Helper function to lookup exact layout yield based on official manufacturer table
  function lookupYield(sheetSizeStr, itemSizeStr) {
    const sheet = String(sheetSizeStr || "").toLowerCase();
    const sizeNum = parseFloat(itemSizeStr) || 2.0;

    // 1. UV-DTF (khổ 0.62 x 1m - vùng in 55x90cm)
    if (sheet.includes("0.62") || (sheet.includes("uv") && sheet.includes("dtf"))) {
      if (sizeNum <= 1.5) return 135;
      if (sizeNum <= 2.0) return 84;
      if (sizeNum <= 3.0) return 45;
      if (sizeNum <= 4.0) return 28;
      return 18; // 5 inch trở lên
    }

    // 2. Decal Tờ 33x35.4cm (Bạc bóng, Kraft ThaiKK)
    if (sheet.includes("35.4") || sheet.includes("35")) {
      if (sizeNum <= 1.5) return 56;
      if (sizeNum <= 2.0) return 30;
      if (sizeNum <= 3.0) return 16;
      if (sizeNum <= 4.0) return 9;
      return 4; // 5 inch
    }

    // 3. Decal Cuộn Khổ 1.2m / 1.22m (Vàng bóng 1.22m, Mccal trắng sữa 1.2m)
    if (sheet.includes("1.22") || sheet.includes("1.2x") || sheet.includes("1.2 x") || sheet.includes("1.2m") || sheet.includes("mccal") || sheet.includes("vàng")) {
      if (sizeNum <= 1.5) return 546;
      if (sizeNum <= 2.0) return 304;
      if (sizeNum <= 3.0) return 143;
      if (sizeNum <= 4.0) return 80;
      if (sizeNum <= 5.0) return 48;
      if (sizeNum <= 6.0) return 30;
      if (sizeNum <= 7.0) return 25;
      if (sizeNum <= 8.0) return 20;
      if (sizeNum <= 9.0) return 16;
      if (sizeNum <= 10.0) return 12;
      if (sizeNum <= 12.0) return 9;
      if (sizeNum <= 14.0) return 6;
      if (sizeNum <= 18.0) return 4;
      if (sizeNum <= 21.0) return 2;
      return 1; // 22 - 30 inch
    }

    // 4. Decal Cuộn Khổ 1.27m (Siêu trong, Bạc bóng, Hologram tia laser, Proton trong)
    if (sheet.includes("1.27") || sheet.includes("cuộn") || sheet.includes("roll")) {
      if (sizeNum <= 1.5) return 567;
      if (sizeNum <= 2.0) return 304;
      if (sizeNum <= 3.0) return 154;
      if (sizeNum <= 4.0) return 80;
      if (sizeNum <= 5.0) return 48;
      if (sizeNum <= 6.0) return 35;
      if (sizeNum <= 7.0) return 30;
      if (sizeNum <= 8.0) return 20;
      if (sizeNum <= 9.0) return 16;
      if (sizeNum <= 11.0) return 12; // 10 - 11 inch
      if (sizeNum <= 12.0) return 9;
      if (sizeNum <= 14.0) return 6;  // 13 - 14 inch
      if (sizeNum <= 18.0) return 4;  // 15 - 18 inch
      if (sizeNum <= 22.0) return 2;  // 19 - 22 inch
      return 1; // 23 - 30 inch
    }

    // 5. Decal Tờ 33x48cm (Sữa mờ, Trong Fasson)
    if (sizeNum <= 1.5) return 70;
    if (sizeNum <= 2.0) return 40;
    if (sizeNum <= 3.0) return 20;
    if (sizeNum <= 4.0) return 12;
    return 6; // 5 inch
  }

  if (layoutPreset) {
    layoutPreset.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "decal-33x48") {
        layoutSheetSize.value = "33x48cm";
        layoutItemSizeSelect.value = "2.0 inch";
        layoutItemSize.value = "2.0 inch";
        layoutItemsPerSheet.value = 40;
      } else if (val === "decal-33x35") {
        layoutSheetSize.value = "33x35.4cm";
        layoutItemSizeSelect.value = "2.0 inch";
        layoutItemSize.value = "2.0 inch";
        layoutItemsPerSheet.value = 30;
      } else if (val === "decal-cuon-127") {
        layoutSheetSize.value = "1.27 x 1m";
        layoutItemSizeSelect.value = "2.0 inch";
        layoutItemSize.value = "2.0 inch";
        layoutItemsPerSheet.value = 304;
      } else if (val === "decal-cuon-120") {
        layoutSheetSize.value = "1.2 x 1m";
        layoutItemSizeSelect.value = "2.0 inch";
        layoutItemSize.value = "2.0 inch";
        layoutItemsPerSheet.value = 304;
      } else if (val === "uv-dtf-roll") {
        layoutSheetSize.value = "0.62 x 1m";
        layoutItemSizeSelect.value = "2.0 inch";
        layoutItemSize.value = "2.0 inch";
        layoutItemsPerSheet.value = 84;
      } else if (val === "skin-card") {
        layoutSheetSize.value = "33x48cm";
        layoutItemSizeSelect.value = "custom";
        layoutItemSize.value = "3.35 x 2.12 inch";
        layoutItemsPerSheet.value = 21;
      } else if (val === "playing-cards") {
        layoutSheetSize.value = "33x48cm";
        layoutItemSizeSelect.value = "custom";
        layoutItemSize.value = "Bộ bài 54 lá (3 tờ/bộ)";
        layoutItemsPerSheet.value = 0.333333;
      } else if (val === "calendar-a4") {
        layoutSheetSize.value = "A4 (21x29.7cm)";
        layoutItemSizeSelect.value = "custom";
        layoutItemSize.value = "Lịch 13 tờ lò xo";
        layoutItemsPerSheet.value = 0.076923;
      } else if (val === "gift-card-book") {
        layoutSheetSize.value = "33x48cm";
        layoutItemSizeSelect.value = "custom";
        layoutItemSize.value = "Sổ thẻ 10 trang";
        layoutItemsPerSheet.value = 0.333333;
      } else if (val === "hop-giay") {
        layoutSheetSize.value = "33x48cm";
        layoutItemSizeSelect.value = "custom";
        layoutItemSize.value = "Hộp Ivory 15.8x18cm";
        layoutItemsPerSheet.value = 4;
      }
      updateImpositionOrderCalc();
    });
  }

  if (layoutItemSizeSelect) {
    layoutItemSizeSelect.addEventListener("change", (e) => {
      const sizeVal = e.target.value;
      if (sizeVal !== "custom") {
        layoutItemSize.value = sizeVal;
        layoutItemsPerSheet.value = lookupYield(layoutSheetSize.value, sizeVal);
      }
      updateImpositionOrderCalc();
    });
  }

  if (layoutItemsPerSheet) {
    layoutItemsPerSheet.addEventListener("input", updateImpositionOrderCalc);
  }
  if (layoutSheetSize) {
    layoutSheetSize.addEventListener("input", updateImpositionOrderCalc);
  }
  if (layoutItemSize) {
    layoutItemSize.addEventListener("input", updateImpositionOrderCalc);
  }
  if (btnSyncYieldToBOM) {
    btnSyncYieldToBOM.addEventListener("click", syncYieldToBOM);
  }

  // Google Sheets Database Event Listeners
  document.getElementById("btn-test-sheet").addEventListener("click", async () => {
    const urlInput = document.getElementById("settings-sheet-url");
    const url = urlInput.value.trim();
    if (!url) {
      alert("Vui lòng nhập URL Web App của Google Apps Script!");
      return;
    }
    // Smart URL validation
    if (url.includes("docs.google.com/spreadsheets")) {
      alert("⚠️ Bạn đang dán đường link của trang tính Google Sheet, không phải link Web App!\n\nCách lấy link đúng:\n1. Trong Google Sheet, vào menu 'Tiện ích mở rộng' (Extensions) ➔ 'Apps Script'.\n2. Bấm nút xanh 'Triển khai' (Deploy) ở góc trên bên phải ➔ chọn 'Triển khai mới' (New deployment).\n3. Copy đường link Web App có dạng: https://script.google.com/macros/s/.../exec");
      return;
    }

    if (!url.startsWith("https://script.google.com/")) {
      alert("URL không đúng định dạng Google Apps Script!\n\nĐường link chuẩn phải bắt đầu bằng:\nhttps://script.google.com/macros/s/.../exec");
      return;
    }

    if (url.includes("/edit")) {
      alert("⚠️ Bạn đang copy link trang chỉnh sửa code Apps Script!\n\nVui lòng bấm nút 'Triển khai' (Deploy) ➔ 'Triển khai mới' (New deployment) để lấy link Web App chính thức có đuôi /exec.");
      return;
    }

    if (url.endsWith("/dev")) {
      alert("⚠️ Bạn đang dùng link thử nghiệm nội bộ (/dev) của Google Apps Script!\n\nVui lòng vào Triển khai (Deploy) ➔ Triển khai mới ➔ Chọn Web App để lấy link chính thức có đuôi /exec.");
      return;
    }

    const oldUrl = state.googleSheetUrl;
    state.googleSheetUrl = url;
    
    updateCloudStatus("syncing");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      
      if (data && data.products && data.settings) {
        if (confirm("Tìm thấy dữ liệu trên Google Sheets! Bạn có muốn nạp dữ liệu này đè lên máy hiện tại không?\n\n- Chọn OK để NẠP dữ liệu từ Google Sheets về máy này.\n- Chọn Cancel để ĐẨY dữ liệu máy này lên Google Sheets.")) {
          state.products = data.products;
          state.settings = data.settings;
          localStorage.setItem("factory_settings_v2", JSON.stringify(state.settings));
          localStorage.setItem("factory_products_v2", JSON.stringify(state.products));
          localStorage.setItem("factory_sheet_url_v2", url);
          alert("Nạp dữ liệu từ Google Sheets về máy thành công!");
        } else {
          localStorage.setItem("factory_sheet_url_v2", url);
          await state.syncToCloud();
          alert("Đẩy dữ liệu máy cục bộ lên Google Sheets thành công!");
        }
      } else {
        localStorage.setItem("factory_sheet_url_v2", url);
        await state.syncToCloud();
        alert("Khởi tạo database trống trên Google Sheets và đồng bộ thành công!");
      }
      
      renderCalculator();
      renderForecast();
      renderSettings();
      recalculateForecastTotals();
      updateDashboard();
    } catch (e) {
      console.error(e);
      alert("⚠️ Không thể kết nối tới Google Apps Script URL!\n\nNguyên nhân thường gặp nhất:\n1. CHƯA CẤU HÌNH QUYỀN TRUY CẬP LÀ 'ANYONE':\n   Trong Apps Script, bấm Deploy (Triển khai) ➔ Quản lý việc triển khai (Manage deployments) ➔ Bấm icon hình bút chì (Edit) ➔ Ở mục 'Who has access' (Ai có quyền truy cập), chọn bắt buộc là 'Anyone' (Bất kỳ ai).\n2. CHƯA CẤP QUYỀN (Authorize access):\n   Khi Deploy, Google sẽ hiện hộp thoại yêu cầu cấp quyền truy cập vào Sheet. Hãy bấm 'Advanced' ➔ 'Go to Untitled project' ➔ Bấm 'Allow'.\n3. Đảm bảo URL kết thúc bằng chữ /exec.");
      state.googleSheetUrl = oldUrl;
      updateCloudStatus(oldUrl ? "synced" : "local");
    }
  });

  // Push to Google Sheets (Upload)
  const pushBtn = document.getElementById("btn-push-to-sheet");
  if (pushBtn) {
    pushBtn.addEventListener("click", async () => {
      await state.syncToCloud(true);
    });
  }

  // Pull from Google Sheets (Download)
  const pullBtn = document.getElementById("btn-pull-from-sheet");
  if (pullBtn) {
    pullBtn.addEventListener("click", async () => {
      if (confirm("⚠️ CẢNH BÁO GHI ĐÈ:\n\nBạn có chắc chắn muốn nạp dữ liệu từ Google Sheets về máy này không?\n\nDữ liệu trên trang tính sẽ ghi đè lên toàn bộ sản phẩm và cài đặt hiện tại trên máy này.")) {
        const success = await state.syncFromCloud(true);
        if (success) {
          renderCalculator();
          renderForecast();
          renderSettings();
          recalculateForecastTotals();
          updateDashboard();
          alert("✅ Đã nạp dữ liệu mới nhất từ Google Sheets về máy thành công!");
        } else {
          alert("❌ Không thể nạp dữ liệu từ Google Sheets. Vui lòng kiểm tra lại URL hoặc kết nối mạng!");
        }
      }
    });
  }

  document.getElementById("btn-disconnect-sheet").addEventListener("click", () => {
    if (confirm("Bạn có muốn ngắt kết nối với Google Sheets? Dữ liệu của bạn sẽ quay về lưu trữ cục bộ trên máy này.")) {
      state.googleSheetUrl = "";
      localStorage.setItem("factory_sheet_url_v2", "none");
      updateCloudStatus("local");
      renderSettings();
    }
  });

  document.getElementById("cloud-sync-status").addEventListener("click", async () => {
    if (!state.googleSheetUrl) {
      switchTab("settings");
      document.getElementById("settings-sheet-url")?.focus();
    } else {
      const choice = confirm("ĐỒNG BỘ GOOGLE SHEETS:\n\n- Bấm [OK] để ⬆️ ĐẨY DỮ LIỆU từ web này lên Google Sheets.\n- Bấm [Cancel] để ⬇️ NẠP DỮ LIỆU từ Google Sheets về máy này.");
      if (choice) {
        await state.syncToCloud(true);
      } else {
        const pullConfirm = confirm("Bạn có chắc chắn muốn nạp dữ liệu từ Google Sheets về ghi đè lên máy này?");
        if (pullConfirm) {
          const success = await state.syncFromCloud(true);
          if (success) {
            renderCalculator();
            renderForecast();
            renderSettings();
            recalculateForecastTotals();
            updateDashboard();
            alert("✅ Đã nạp dữ liệu từ Google Sheets về máy thành công!");
          }
        }
      }
    }
  });

  // 5. Monthly Report tab triggers
  const mrSelect = document.getElementById("monthly-report-select");
  if (mrSelect) {
    mrSelect.addEventListener("change", () => renderMonthlyReport(false));
  }
  const mrFilter = document.getElementById("monthly-report-filter-factory");
  if (mrFilter) {
    mrFilter.addEventListener("change", () => renderMonthlyReport(false));
  }
  const mrCatFilter = document.getElementById("monthly-report-filter-category");
  if (mrCatFilter) {
    mrCatFilter.addEventListener("change", () => renderMonthlyReport(false));
  }
  const mrExportBtn = document.getElementById("btn-export-monthly-report");
  if (mrExportBtn) {
    mrExportBtn.addEventListener("click", exportMonthlyReportCSV);
  }

  // Monthly Cost Control Center Listeners
  const btnMrSave = document.getElementById("btn-mr-save-month-costs");
  if (btnMrSave) {
    btnMrSave.addEventListener("click", saveCurrentMonthCosts);
  }

  const btnMrResetSalary = document.getElementById("btn-mr-reset-salary");
  if (btnMrResetSalary) {
    btnMrResetSalary.addEventListener("click", resetCurrentMonthSalary);
  }

  const mrCostInputs = document.querySelectorAll("#mr-cost-control-panel .mr-cost-calc-trigger");
  mrCostInputs.forEach(input => {
    input.addEventListener("input", handleLiveMonthlyCostChange);
    input.addEventListener("blur", (e) => {
      const val = parseCurrencyInput(e.target.value);
      e.target.value = val.toLocaleString('vi-VN');
      handleLiveMonthlyCostChange();
    });
  });

  // Cloud Database Sync on Startup (An toàn: force = false, không tự ý ghi đè dữ liệu trên máy)
  if (state.googleSheetUrl) {
    state.syncFromCloud(false).then(success => {
      if (success) {
        renderCalculator();
        renderForecast();
        renderSettings();
        recalculateForecastTotals();
        updateDashboard();
      }
    });
  } else {
    updateCloudStatus("local");
  }

  // 6. Materials Catalog & BOM Picker Listeners
  const catalogPills = document.querySelectorAll(".catalog-filter-pill");
  catalogPills.forEach(pill => {
    pill.addEventListener("click", () => {
      renderMaterialsCatalog(pill.dataset.category, currentCatalogSearch);
    });
  });

  const catalogSearchInput = document.getElementById("catalog-search-input");
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener("input", (e) => {
      renderMaterialsCatalog(currentCatalogFilter, e.target.value);
    });
  }

  const btnAddCatalog = document.getElementById("btn-add-catalog-item");
  if (btnAddCatalog) {
    btnAddCatalog.addEventListener("click", () => openCatalogItemModal());
  }

  const btnSyncCatalog = document.getElementById("btn-sync-catalog-to-products");
  if (btnSyncCatalog) {
    btnSyncCatalog.addEventListener("click", syncCatalogPricesToProducts);
  }

  // Catalog Item Modal triggers
  const modalCatalogItem = document.getElementById("modal-catalog-item");
  const modalCatalogCloseBtn = document.getElementById("modal-catalog-close-btn");
  const modalCatalogCancelBtn = document.getElementById("modal-catalog-cancel-btn");
  const modalCatalogForm = document.getElementById("modal-catalog-form");

  if (modalCatalogCloseBtn && modalCatalogItem) {
    modalCatalogCloseBtn.addEventListener("click", () => modalCatalogItem.close());
  }
  if (modalCatalogCancelBtn && modalCatalogItem) {
    modalCatalogCancelBtn.addEventListener("click", () => modalCatalogItem.close());
  }
  if (modalCatalogForm) {
    modalCatalogForm.addEventListener("submit", handleSaveCatalogItem);
  }

  // BOM Material Catalog Picker triggers
  const btnOpenBOMPicker = document.getElementById("btn-open-material-catalog");
  if (btnOpenBOMPicker) {
    btnOpenBOMPicker.addEventListener("click", openBOMCatalogPickerModal);
  }

  const modalBomPicker = document.getElementById("modal-bom-catalog-picker");
  const modalBomPickerClose = document.getElementById("modal-bom-picker-close-btn");
  const modalBomPickerCancel = document.getElementById("modal-bom-picker-cancel-btn");
  const modalBomPickerAdd = document.getElementById("modal-bom-picker-add-btn");
  const bomPickerSearch = document.getElementById("bom-picker-search");
  const bomPickerCat = document.getElementById("bom-picker-cat-filter");

  if (modalBomPickerClose && modalBomPicker) {
    modalBomPickerClose.addEventListener("click", () => modalBomPicker.close());
  }
  if (modalBomPickerCancel && modalBomPicker) {
    modalBomPickerCancel.addEventListener("click", () => modalBomPicker.close());
  }
  if (modalBomPickerAdd) {
    modalBomPickerAdd.addEventListener("click", handleSelectCatalogItemsToBOM);
  }
  if (bomPickerSearch) {
    bomPickerSearch.addEventListener("input", (e) => {
      bomPickerSearchQuery = e.target.value;
      renderBOMPickerList();
    });
  }
  if (bomPickerCat) {
    bomPickerCat.addEventListener("change", (e) => {
      bomPickerCatFilter = e.target.value;
      renderBOMPickerList();
    });
  }

  // ==========================================================================
  // 7. ORDER COST INSPECTOR EVENT BINDINGS (v24.0)
  // ==========================================================================

  const btnUploadOrderFile = document.getElementById("btn-upload-order-file");
  const orderCostFileInput = document.getElementById("order-cost-file-input");
  const btnOpenPasteModal = document.getElementById("btn-open-paste-modal");
  const modalOrderPaste = document.getElementById("modal-order-paste");
  const modalOrderPasteClose = document.getElementById("modal-order-paste-close-btn");
  const modalOrderPasteCancel = document.getElementById("modal-order-paste-cancel-btn");
  const modalOrderPasteSubmit = document.getElementById("modal-order-paste-submit-btn");
  const orderPasteTextarea = document.getElementById("order-paste-textarea");

  const btnLoadSampleOrders = document.getElementById("btn-load-sample-orders");
  const btnDownloadSampleOrderXlsx = document.getElementById("btn-download-sample-order-xlsx");
  const btnExportOrderCostXlsx = document.getElementById("btn-export-order-cost-xlsx");
  const btnSyncOrdersToMRP = document.getElementById("btn-sync-orders-to-mrp");

  const liveSkuInput = document.getElementById("live-sku-input");
  const orderSearchInput = document.getElementById("order-search-input");
  const orderFilterStatus = document.getElementById("order-filter-status");
  const btnViewOrderGroup = document.getElementById("btn-view-order-group");
  const btnViewFlatItems = document.getElementById("btn-view-flat-items");

  if (btnUploadOrderFile && orderCostFileInput) {
    btnUploadOrderFile.addEventListener("click", () => orderCostFileInput.click());
  }

  if (orderCostFileInput) {
    orderCostFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop().toLowerCase();
      const reader = new FileReader();

      reader.onload = (evt) => {
        try {
          let grid = [];
          if (fileExt === 'xlsx' || fileExt === 'xls') {
            if (typeof XLSX === 'undefined') {
              alert("Lỗi: Thư viện đọc file Excel chưa sẵn sàng!");
              return;
            }
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.SheetNames[0];
            grid = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });
          } else {
            const text = evt.target.result;
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            if (lines.length < 2) {
              alert("File CSV cần ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu!");
              return;
            }
            let sep = ",";
            if (lines[0].includes("\t")) sep = "\t";
            else if (lines[0].includes(";")) sep = ";";

            grid = lines.map(line => {
              const res = [];
              let inside = false;
              let curr = "";
              for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') inside = !inside;
                else if (ch === sep && !inside) {
                  res.push(curr.trim().replace(/^"|"$/g, ''));
                  curr = "";
                } else {
                  curr += ch;
                }
              }
              res.push(curr.trim().replace(/^"|"$/g, ''));
              return res;
            });
          }

          const parsedRows = parseOrderRowsFromGrid(grid);
          if (parsedRows.length === 0) {
            alert("Không tìm thấy dòng đơn hàng hợp lệ nào trong file! Vui lòng tải file mẫu để xem cấu trúc chuẩn.");
            return;
          }

          state.orderCostState.rawRows = parsedRows;
          renderOrderCostInspector();
          alert(`✅ Đã tải lên và nhận diện thành công ${parsedRows.length} dòng đơn hàng từ file!`);
        } catch (err) {
          console.error("Lỗi khi xử lý file đơn hàng:", err);
          alert("Lỗi khi đọc file đơn hàng! Vui lòng kiểm tra định dạng .xlsx hoặc .csv.");
        } finally {
          orderCostFileInput.value = "";
        }
      };

      if (fileExt === 'xlsx' || fileExt === 'xls') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file, 'utf-8');
      }
    });
  }

  // Paste dialog
  if (btnOpenPasteModal && modalOrderPaste) {
    btnOpenPasteModal.addEventListener("click", () => {
      if (orderPasteTextarea) orderPasteTextarea.value = "";
      modalOrderPaste.showModal();
    });
  }
  if (modalOrderPasteClose && modalOrderPaste) {
    modalOrderPasteClose.addEventListener("click", () => modalOrderPaste.close());
  }
  if (modalOrderPasteCancel && modalOrderPaste) {
    modalOrderPasteCancel.addEventListener("click", () => modalOrderPaste.close());
  }
  if (modalOrderPasteSubmit && modalOrderPaste) {
    modalOrderPasteSubmit.addEventListener("click", () => {
      const text = (orderPasteTextarea?.value || '').trim();
      if (!text) {
        alert("Vui lòng dán dữ liệu danh sách đơn hàng vào ô văn bản!");
        return;
      }
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const sep = lines[0].includes("\t") ? "\t" : (lines[0].includes(",") ? "," : ";");
      const grid = lines.map(line => line.split(sep).map(c => c.trim().replace(/^"|"$/g, '')));

      // Check if first line is a header
      const firstLineHeaderCheck = grid[0].some(cell => {
        const c = cell.toLowerCase();
        return c.includes("mã") || c.includes("sku") || c.includes("đơn") || c.includes("tên") || c.includes("order");
      });

      let parsedRows = [];
      if (firstLineHeaderCheck) {
        parsedRows = parseOrderRowsFromGrid(grid);
      } else {
        // synthesize header if missing
        grid.unshift(["Mã Đơn", "Mã SKU", "Tên Sản Phẩm", "Biến Thể", "Số Lượng", "Đơn Giá"]);
        parsedRows = parseOrderRowsFromGrid(grid);
      }

      if (parsedRows.length === 0) {
        alert("Không thể phân tích dữ liệu đã dán! Vui lòng kiểm tra lại số cột.");
        return;
      }

      state.orderCostState.rawRows = parsedRows;
      modalOrderPaste.close();
      renderOrderCostInspector();
      alert(`✅ Đã phân tích thành công ${parsedRows.length} dòng đơn hàng!`);
    });
  }

  // Load sample orders
  if (btnLoadSampleOrders) {
    btnLoadSampleOrders.addEventListener("click", () => {
      state.orderCostState.rawRows = JSON.parse(JSON.stringify(SAMPLE_ORDERS_RAW));
      renderOrderCostInspector();
      alert("✨ Đã nạp 12 đơn hàng mẫu bao quát toàn bộ 13 tiền tố chuẩn!");
    });
  }

  // Download Sample Excel
  if (btnDownloadSampleOrderXlsx) {
    btnDownloadSampleOrderXlsx.addEventListener("click", downloadSampleOrdersXLSX);
  }

  // Export Order Cost Report Excel
  if (btnExportOrderCostXlsx) {
    btnExportOrderCostXlsx.addEventListener("click", exportOrderCostReportXLSX);
  }

  // Sync to MRP
  if (btnSyncOrdersToMRP) {
    btnSyncOrdersToMRP.addEventListener("click", syncOrdersToMRP);
  }

  // Live Single SKU Tester input
  if (liveSkuInput) {
    liveSkuInput.addEventListener("input", (e) => {
      renderLiveSkuInspector(e.target.value);
    });
  }

  // Quick SKU pills
  document.querySelectorAll(".quick-sku-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const sku = pill.getAttribute("data-sku");
      if (liveSkuInput && sku) {
        liveSkuInput.value = sku;
        renderLiveSkuInspector(sku);
      }
    });
  });

  // Search input
  if (orderSearchInput) {
    orderSearchInput.addEventListener("input", (e) => {
      state.orderCostState.searchQuery = e.target.value;
      renderOrderCostInspector();
    });
  }

  // Status filter
  if (orderFilterStatus) {
    orderFilterStatus.addEventListener("change", (e) => {
      state.orderCostState.filterStatus = e.target.value;
      renderOrderCostInspector();
    });
  }

  // View mode toggles
  if (btnViewOrderGroup && btnViewFlatItems) {
    btnViewOrderGroup.addEventListener("click", () => {
      state.orderCostState.viewMode = "order";
      btnViewOrderGroup.classList.add("active");
      btnViewFlatItems.classList.remove("active");
      renderOrderCostInspector();
    });
    btnViewFlatItems.addEventListener("click", () => {
      state.orderCostState.viewMode = "flat";
      btnViewFlatItems.classList.add("active");
      btnViewOrderGroup.classList.remove("active");
      renderOrderCostInspector();
    });
  }

  // Initialize
  updateMaterialsCatalogDatalist();
  switchTab("dashboard");
});

// ==========================================================================
// 8. ORDER COST INSPECTOR UI CONTROLLER FUNCTIONS (v24.0)
// ==========================================================================

function renderLiveSkuInspector(query) {
  const container = document.getElementById("live-sku-result-box");
  if (!container) return;

  const q = String(query || '').trim();
  if (!q) {
    container.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">Vui lòng nhập mã SKU hoặc tiền tố để kiểm tra giá cost...</span>`;
    return;
  }

  const match = matchProductBySkuPrefix(q);
  const p = match.product;
  const pref = match.prefixDef;

  if (!p) {
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #ef4444; font-size: 1.1rem;">⚠️</span>
          <div>
            <div style="font-weight: 600; color: #f87171; font-size: 0.85rem;">Không tìm thấy tiền tố hoặc sản phẩm phù hợp cho "${q}"</div>
            <span style="font-size: 0.72rem; color: var(--text-secondary);">Hãy kiểm tra lại xem mã SKU có bắt đầu bằng 1 trong 13 tiền tố chuẩn: CAL-, PLC-, PLC2-, GCB-, SCARD-, STICKER-, CSTICKER-, CLEAR-CSTICKER-, UV-CSTICKER-, KRAFT-CSTICKER-, SILVER-CSTICKER-, HD-EMB-, CAP-EMB-</span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const cost = calculateProductCost(p, state.settings);
  const unitVar = cost.variableCost || 0;
  const unitMat = cost.materialsCost || 0;
  const unitLabor = cost.laborCost || 0;
  const unitPayback = cost.paybackSurchargeFirst3Years || 0;
  const unitOverhead = cost.overheadCost || 0;
  const unitFull = cost.paybackBaseCost || (cost.baseCost + unitPayback);
  const unitSeller = cost.paybackSellerPrice || cost.sellerPrice || 0;

  const prefBadge = pref ? `
    <span class="badge-prefix-tag" style="background: ${pref.bg}; color: ${pref.color}; border: 1px solid ${pref.border};">
      🏷️ ${pref.prefix} (${pref.name})
    </span>
  ` : `<span class="badge-prefix-tag" style="background: rgba(255,255,255,0.1); color: #fff;">${p.code}</span>`;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; align-items: center;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
          ${prefBadge}
          <span class="badge-match-status badge-match-${match.matchType.toLowerCase()}">${match.matchLabel}</span>
        </div>
        <h3 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 0.25rem 0;">${p.name}</h3>
        <div style="font-size: 0.75rem; color: #a5b4fc; display: flex; gap: 0.75rem;">
          <span>Mã gốc: <strong style="color: #fff; font-family: monospace;">${p.code}</strong></span>
          <span>Nhà máy: <strong style="color: #fff;">${p.factoryType}</strong></span>
          <span>Đơn vị: <strong style="color: #fff;">${p.layout?.unitType || 'Cái'}</strong></span>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: flex-end;">
        <div style="background: rgba(0,0,0,0.25); padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); text-align: right;">
          <span style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">Biến Phí (NVL+Thợ)</span>
          <div style="font-size: 0.95rem; font-weight: 700; color: #fbbf24;">${formatVND(unitVar)}</div>
          <span style="font-size: 0.65rem; color: #94a3b8;">NVL: ${formatVND(unitMat)} | Thợ: ${formatVND(unitLabor)}</span>
        </div>

        <div style="background: rgba(0,0,0,0.25); padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); text-align: right;">
          <span style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">Khấu Hao Máy + QL</span>
          <div style="font-size: 0.95rem; font-weight: 700; color: #60a5fa;">${formatVND(unitPayback + unitOverhead)}</div>
          <span style="font-size: 0.65rem; color: #94a3b8;">Máy: ${formatVND(unitPayback)} | QL: ${formatVND(unitOverhead)}</span>
        </div>

        <div style="background: rgba(239, 68, 68, 0.1); padding: 0.5rem 0.85rem; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.3); text-align: right;">
          <span style="font-size: 0.65rem; color: #f87171; text-transform: uppercase; font-weight: 700;">GIÁ COST TOÀN PHẦN</span>
          <div style="font-size: 1.15rem; font-weight: 800; color: #f87171;">${formatVND(unitFull)}</div>
          <span style="font-size: 0.65rem; color: #34d399;">Giá bán xưởng: ${formatVND(unitSeller)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderOrderCostInspector() {
  if (!state.orderCostState.rawRows || state.orderCostState.rawRows.length === 0) {
    state.orderCostState.rawRows = JSON.parse(JSON.stringify(SAMPLE_ORDERS_RAW));
  }

  const { orders, flatItems } = groupAndCalculateOrders(state.orderCostState.rawRows);
  state.orderCostState.orders = orders;
  state.orderCostState.flatItems = flatItems;

  // 1. Render Live SKU inspector
  const liveInput = document.getElementById("live-sku-input");
  if (liveInput) {
    renderLiveSkuInspector(liveInput.value);
  }

  // 2. Compute Batch Totals
  const totalOrders = orders.length;
  const totalItems = flatItems.reduce((sum, it) => sum + (it.qty || 0), 0);
  const matchedRowsCount = flatItems.filter(it => it.isMatched).length;
  const matchRate = flatItems.length > 0 ? Math.round((matchedRowsCount / flatItems.length) * 100) : 100;
  const totalVariableCost = orders.reduce((sum, o) => sum + o.totalVariableCost, 0);
  const totalFullCost = orders.reduce((sum, o) => sum + o.totalFullCost, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalRevenue, 0);
  const totalProfit = orders.reduce((sum, o) => sum + o.totalProfit, 0);
  const totalProfitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
  const totalDepreciation = totalFullCost - totalVariableCost;

  // 3. Update KPI cards
  const elOrders = document.getElementById("kpi-batch-orders");
  const elOrdersSub = document.getElementById("kpi-batch-orders-sub");
  const elItems = document.getElementById("kpi-batch-items");
  const elItemsSub = document.getElementById("kpi-batch-items-sub");
  const elMatchRate = document.getElementById("kpi-batch-match-rate");
  const elMatchSub = document.getElementById("kpi-batch-match-sub");
  const elVarCost = document.getElementById("kpi-batch-variable-cost");
  const elTotalCost = document.getElementById("kpi-batch-total-cost");
  const elDeprecSub = document.getElementById("kpi-batch-depreciation-sub");
  const elRevProfit = document.getElementById("kpi-batch-revenue-profit");
  const elMarginSub = document.getElementById("kpi-batch-margin-sub");

  if (elOrders) elOrders.textContent = `${totalOrders.toLocaleString('vi-VN')} đơn`;
  if (elOrdersSub) elOrdersSub.textContent = `${flatItems.length.toLocaleString('vi-VN')} dòng sản phẩm`;
  if (elItems) elItems.textContent = `${totalItems.toLocaleString('vi-VN')} chiếc`;
  if (elItemsSub) {
    const avgPerOrder = totalOrders > 0 ? Math.round(totalItems / totalOrders) : 0;
    elItemsSub.textContent = `Trung bình: ${avgPerOrder} cái/đơn`;
  }
  if (elMatchRate) elMatchRate.textContent = `${matchRate}%`;
  if (elMatchSub) {
    const unmatchedCount = flatItems.length - matchedRowsCount;
    elMatchSub.textContent = unmatchedCount > 0 ? `⚠️ ${unmatchedCount} dòng chưa nhận diện SKU` : `✅ Đã nhận diện 100% SKU`;
  }
  if (elVarCost) elVarCost.textContent = formatVND(totalVariableCost);
  if (elTotalCost) elTotalCost.textContent = formatVND(totalFullCost);
  if (elDeprecSub) elDeprecSub.textContent = `Khấu hao máy & QL: ${formatVND(totalDepreciation)}`;
  if (elRevProfit) elRevProfit.textContent = formatVND(totalRevenue);
  if (elMarginSub) elMarginSub.textContent = `Lãi gộp: ${formatVND(totalProfit)} (${totalProfitMargin >= 0 ? '+' : ''}${totalProfitMargin}%)`;

  // 4. Render Prefix Filter Pills
  const pillsContainer = document.getElementById("order-prefix-pills");
  if (pillsContainer) {
    const activePref = state.orderCostState.filterPrefix || "all";
    let pillsHtml = `
      <button type="button" class="prefix-pill-btn ${activePref === 'all' ? 'active' : ''}" data-prefix="all">
        <span>Tất Cả</span> (${flatItems.length})
      </button>
    `;

    PREFIX_DEFINITIONS.forEach(def => {
      const count = flatItems.filter(it => it.prefixDef && it.prefixDef.prefix === def.prefix).length;
      const isActive = activePref === def.prefix;
      pillsHtml += `
        <button type="button" class="prefix-pill-btn ${isActive ? 'active' : ''}" data-prefix="${def.prefix}" style="border-color: ${isActive ? def.color : 'rgba(255,255,255,0.08)'}; color: ${isActive ? '#fff' : def.color};">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${def.color};"></span>
          <span>${def.prefix}</span> (${count})
        </button>
      `;
    });

    pillsContainer.innerHTML = pillsHtml;

    pillsContainer.querySelectorAll(".prefix-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.orderCostState.filterPrefix = btn.getAttribute("data-prefix");
        renderOrderCostInspector();
      });
    });
  }

  // 5. Filter orders
  const query = (state.orderCostState.searchQuery || '').toLowerCase().trim();
  const filterPrefix = state.orderCostState.filterPrefix || 'all';
  const filterStatus = state.orderCostState.filterStatus || 'all';

  let filteredOrders = orders.filter(order => {
    if (filterPrefix !== 'all') {
      const hasPref = order.items.some(it => it.prefixDef && it.prefixDef.prefix === filterPrefix);
      if (!hasPref) return false;
    }

    if (filterStatus === 'matched' && !order.isAllMatched) return false;
    if (filterStatus === 'unmatched' && order.isAllMatched) return false;

    if (query) {
      const matchOrderId = order.orderId.toLowerCase().includes(query);
      const matchItem = order.items.some(it =>
        (it.sku && it.sku.toLowerCase().includes(query)) ||
        (it.name && it.name.toLowerCase().includes(query)) ||
        (it.product && it.product.name.toLowerCase().includes(query)) ||
        (it.product && it.product.code.toLowerCase().includes(query))
      );
      if (!matchOrderId && !matchItem) return false;
    }

    return true;
  });

  // 6. Render Container
  const container = document.getElementById("order-cost-results-container");
  if (!container) return;

  if (filteredOrders.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.75rem;">🔍</span>
        <h4 style="color: #fff; font-size: 1rem; margin-bottom: 0.5rem;">Không tìm thấy đơn hàng nào phù hợp với bộ lọc</h4>
        <p style="font-size: 0.8rem; margin-bottom: 1rem;">Hãy thử xóa bộ lọc tìm kiếm hoặc nạp lại dữ liệu đơn hàng mẫu.</p>
        <button type="button" class="btn btn-secondary" onclick="state.orderCostState.searchQuery=''; state.orderCostState.filterPrefix='all'; state.orderCostState.filterStatus='all'; renderOrderCostInspector();">
          Đặt Lại Bộ Lọc
        </button>
      </div>
    `;
    return;
  }

  if (state.orderCostState.viewMode === "flat") {
    // Flat Table View
    let tableHtml = `
      <div class="glass-card table-responsive" style="padding: 0; overflow-x: auto;">
        <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 0.78rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-glass); background: rgba(0,0,0,0.25);">
              <th style="padding: 0.65rem; text-align: center;">STT</th>
              <th style="padding: 0.65rem;">Mã Đơn Hàng</th>
              <th style="padding: 0.65rem;">SKU Trong File</th>
              <th style="padding: 0.65rem;">Tiền Tố Nhận Diện</th>
              <th style="padding: 0.65rem;">Sản Phẩm Trong Hệ Thống</th>
              <th style="padding: 0.65rem; text-align: right;">Số Lượng</th>
              <th style="padding: 0.65rem; text-align: right;">Đơn Giá Biến Phí</th>
              <th style="padding: 0.65rem; text-align: right;">Đơn Giá Cost Toàn Phần</th>
              <th style="padding: 0.65rem; text-align: right; color: #f87171;">TỔNG COST MÓN</th>
              <th style="padding: 0.65rem; text-align: right;">Đơn Giá Bán</th>
              <th style="padding: 0.65rem; text-align: right; color: #34d399;">Lãi Gộp Món</th>
            </tr>
          </thead>
          <tbody>
    `;

    let itemStt = 1;
    filteredOrders.forEach(ord => {
      ord.items.forEach(it => {
        const prefBadge = it.prefixDef ? `
          <span class="badge-prefix-tag" style="background: ${it.prefixDef.bg}; color: ${it.prefixDef.color}; border: 1px solid ${it.prefixDef.border};">
            ${it.prefixDef.prefix}
          </span>
        ` : `<span style="color: #f87171; font-weight: 600;">Không có</span>`;

        tableHtml += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
            <td style="padding: 0.6rem; text-align: center; color: var(--text-muted); font-family: monospace;">${itemStt++}</td>
            <td style="padding: 0.6rem; font-weight: 700; color: #60a5fa; font-family: monospace;">${ord.orderId}</td>
            <td style="padding: 0.6rem; font-family: monospace; color: #fff;">${it.sku || 'N/A'}</td>
            <td style="padding: 0.6rem;">${prefBadge}</td>
            <td style="padding: 0.6rem;">
              <select class="form-input select-manual-prod" data-item-index="${it.itemIndex}" style="padding: 0.25rem 0.45rem; font-size: 0.72rem; min-width: 220px; background: rgba(15,23,42,0.8);">
                <option value="" ${!it.product ? 'selected' : ''}>-- Chọn sản phẩm khớp --</option>
                ${state.products.map(p => `<option value="${p.id}" ${it.product && it.product.id === p.id ? 'selected' : ''}>[${p.code}] ${p.name}</option>`).join("")}
              </select>
            </td>
            <td style="padding: 0.6rem; text-align: right; font-weight: 600; color: #fff;">${(it.qty || 0).toLocaleString('vi-VN')}</td>
            <td style="padding: 0.6rem; text-align: right; color: #fbbf24;">${formatVND(it.unitVariableCost)}</td>
            <td style="padding: 0.6rem; text-align: right; color: #f87171; font-weight: 600;">${formatVND(it.unitFullCost)}</td>
            <td style="padding: 0.6rem; text-align: right; color: #f87171; font-weight: 800; background: rgba(239,68,68,0.05);">${formatVND(it.lineFullCost)}</td>
            <td style="padding: 0.6rem; text-align: right; color: #94a3b8;">${formatVND(it.effectiveUnitPrice)}</td>
            <td style="padding: 0.6rem; text-align: right; color: ${it.lineProfit >= 0 ? '#34d399' : '#f87171'}; font-weight: 700;">
              ${formatVND(it.lineProfit)}
              <span style="font-size: 0.65rem; display: block; color: var(--text-muted); font-weight: 400;">(${it.profitMargin >= 0 ? '+' : ''}${it.profitMargin}%)</span>
            </td>
          </tr>
        `;
      });
    });

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;
    container.innerHTML = tableHtml;
  } else {
    // Order Group View (Default)
    let cardsHtml = "";
    filteredOrders.forEach((order, oIdx) => {
      const badgesHtml = order.prefixesList.map(prefStr => {
        const pDef = PREFIX_DEFINITIONS.find(d => d.prefix === prefStr);
        return pDef ? `
          <span class="badge-prefix-tag" style="background: ${pDef.bg}; color: ${pDef.color}; border: 1px solid ${pDef.border};">
            ${pDef.prefix}
          </span>
        ` : `<span class="badge-prefix-tag" style="background: rgba(255,255,255,0.1); color: #fff;">${prefStr}</span>`;
      }).join(" ");

      const statusBadge = order.isAllMatched ?
        `<span class="badge-match-status badge-match-exact">✅ Khớp 100%</span>` :
        `<span class="badge-match-status badge-match-unmatched">⚠️ Cần gán SP</span>`;

      // Sub-items table
      let subTableHtml = `
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.74rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); text-align: left;">
                <th style="padding: 0.4rem 0.5rem;">Mã SKU File</th>
                <th style="padding: 0.4rem 0.5rem;">Tiền Tố</th>
                <th style="padding: 0.4rem 0.5rem;">Sản Phẩm Trong Hệ Thống (Có thể gán lại)</th>
                <th style="padding: 0.4rem 0.5rem; text-align: right;">SL</th>
                <th style="padding: 0.4rem 0.5rem; text-align: right;">Biến Phí (1 sp)</th>
                <th style="padding: 0.4rem 0.5rem; text-align: right;">Cost Toàn Phần (1 sp)</th>
                <th style="padding: 0.4rem 0.5rem; text-align: right; color: #f87171;">Thành Tiền Cost</th>
                <th style="padding: 0.4rem 0.5rem; text-align: right;">Đơn Giá Bán</th>
                <th style="padding: 0.4rem 0.5rem; text-align: right; color: #34d399;">Lãi Gộp Món</th>
              </tr>
            </thead>
            <tbody>
      `;

      order.items.forEach(it => {
        const itemPref = it.prefixDef ? `
          <span class="badge-prefix-tag" style="background: ${it.prefixDef.bg}; color: ${it.prefixDef.color}; border: 1px solid ${it.prefixDef.border};">
            ${it.prefixDef.prefix}
          </span>
        ` : `<span style="color: #f87171; font-size: 0.7rem; font-weight: 600;">⚠️ Chưa khớp</span>`;

        subTableHtml += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
            <td style="padding: 0.5rem; font-family: monospace; color: #fff; font-weight: 500;">
              ${it.sku || 'N/A'}
              ${it.name ? `<span style="font-size: 0.65rem; display: block; color: var(--text-muted); font-family: sans-serif;">${it.name} ${it.variant ? `(${it.variant})` : ''}</span>` : ''}
            </td>
            <td style="padding: 0.5rem;">${itemPref}</td>
            <td style="padding: 0.5rem;">
              <select class="form-input select-manual-prod" data-item-index="${it.itemIndex}" style="padding: 0.25rem 0.45rem; font-size: 0.72rem; min-width: 240px; background: rgba(15,23,42,0.85);">
                <option value="" ${!it.product ? 'selected' : ''}>-- Chọn sản phẩm để tính cost --</option>
                ${state.products.map(p => `<option value="${p.id}" ${it.product && it.product.id === p.id ? 'selected' : ''}>[${p.code}] ${p.name}</option>`).join("")}
              </select>
            </td>
            <td style="padding: 0.5rem; text-align: right; font-weight: 700; color: #fff;">${it.qty}</td>
            <td style="padding: 0.5rem; text-align: right; color: #fbbf24;">${formatVND(it.unitVariableCost)}</td>
            <td style="padding: 0.5rem; text-align: right; color: #f87171; font-weight: 600;">${formatVND(it.unitFullCost)}</td>
            <td style="padding: 0.5rem; text-align: right; color: #f87171; font-weight: 800; background: rgba(239,68,68,0.05);">${formatVND(it.lineFullCost)}</td>
            <td style="padding: 0.5rem; text-align: right; color: #94a3b8;">${formatVND(it.effectiveUnitPrice)}</td>
            <td style="padding: 0.5rem; text-align: right; color: ${it.lineProfit >= 0 ? '#34d399' : '#f87171'}; font-weight: 700;">
              ${formatVND(it.lineProfit)}
            </td>
          </tr>
        `;
      });

      subTableHtml += `
            </tbody>
          </table>
        </div>
      `;

      cardsHtml += `
        <div class="order-group-card">
          <div class="order-card-header" data-order-index="${oIdx}">
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <span style="font-size: 1.1rem; color: #60a5fa;">📦</span>
              <strong style="color: #fff; font-size: 0.92rem; font-family: monospace;">${order.orderId}</strong>
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">${badgesHtml}</div>
              ${statusBadge}
              <span style="font-size: 0.75rem; color: #94a3b8;">(${order.items.length} món • ${order.totalQty} sản phẩm)</span>
            </div>

            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="text-align: right;">
                <span style="font-size: 0.65rem; color: #f87171; text-transform: uppercase; font-weight: 700; display: block;">TỔNG GIÁ COST ĐƠN:</span>
                <span style="font-size: 1.05rem; font-weight: 800; color: #f87171;">${formatVND(order.totalFullCost)}</span>
              </div>

              <div style="text-align: right;">
                <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; display: block;">Doanh Thu / Lãi Gộp:</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #34d399;">${formatVND(order.totalRevenue)}</span>
                <span style="font-size: 0.7rem; color: #a5b4fc; margin-left: 0.25rem;">(Lãi: ${formatVND(order.totalProfit)})</span>
              </div>

              <span class="order-chevron" style="font-size: 0.75rem; color: #94a3b8; transition: transform 0.2s;">▼</span>
            </div>
          </div>

          <div class="order-card-body" id="order-body-${oIdx}" style="display: block;">
            ${subTableHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = cardsHtml;

    // Toggle accordions
    container.querySelectorAll(".order-card-header").forEach(header => {
      header.addEventListener("click", (e) => {
        if (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
        const oIdx = header.getAttribute("data-order-index");
        const body = document.getElementById(`order-body-${oIdx}`);
        const chevron = header.querySelector(".order-chevron");
        if (body) {
          const isHidden = body.style.display === "none";
          body.style.display = isHidden ? "block" : "none";
          if (chevron) chevron.style.transform = isHidden ? "rotate(0deg)" : "rotate(-90deg)";
        }
      });
    });
  }

  // Handle manual product select changes
  container.querySelectorAll(".select-manual-prod").forEach(select => {
    select.addEventListener("change", () => {
      const itIdx = parseInt(select.getAttribute("data-item-index"), 10);
      const chosenProdId = select.value;
      if (!isNaN(itIdx) && state.orderCostState.rawRows[itIdx]) {
        state.orderCostState.rawRows[itIdx].manualProductId = chosenProdId || null;
        renderOrderCostInspector();
      }
    });
  });
}

function parseOrderRowsFromGrid(grid) {
  if (!grid || grid.length < 2) return [];

  const headers = grid[0].map(h => String(h || '').trim().toLowerCase());
  let orderIdx = -1;
  let skuIdx = -1;
  let nameIdx = -1;
  let varIdx = -1;
  let qtyIdx = -1;
  let priceIdx = -1;
  let statusIdx = -1;

  headers.forEach((h, idx) => {
    if (h.includes("đơn") || h.includes("order") || h.includes("vận đơn") || h.includes("tracking")) {
      orderIdx = idx;
    } else if (h.includes("sku") || h.includes("mã sp") || h.includes("mã sản phẩm") || h.includes("code") || h.includes("barcode")) {
      skuIdx = idx;
    } else if (h.includes("tên") || h.includes("name") || h.includes("sản phẩm") || h.includes("product") || h.includes("title")) {
      nameIdx = idx;
    } else if (h.includes("biến thể") || h.includes("variant") || h.includes("variation") || h.includes("phân loại") || h.includes("size") || h.includes("kích thước")) {
      varIdx = idx;
    } else if (h.includes("số lượng") || h.includes("qty") || h.includes("quantity") || h.includes("sl") || h.includes("bán")) {
      qtyIdx = idx;
    } else if (h.includes("giá") || h.includes("price") || h.includes("retail") || h.includes("đơn giá") || h.includes("tiền")) {
      priceIdx = idx;
    } else if (h.includes("status") || h.includes("trạng thái") || h.includes("tình trạng")) {
      statusIdx = idx;
    }
  });

  if (orderIdx === -1 && grid[0].length >= 4) orderIdx = 0;
  if (skuIdx === -1) skuIdx = orderIdx === 0 ? 1 : 0;
  if (qtyIdx === -1) {
    for (let c = 0; c < grid[1]?.length; c++) {
      if (c !== orderIdx && c !== skuIdx && c !== nameIdx && !isNaN(parseFloat(grid[1][c]))) {
        qtyIdx = c;
        break;
      }
    }
  }

  const resultRows = [];
  for (let i = 1; i < grid.length; i++) {
    const row = grid[i];
    if (!row || row.length === 0) continue;

    if (statusIdx !== -1) {
      const st = String(row[statusIdx] || '').toUpperCase();
      if (st.includes("CANCEL") || st.includes("HỦY")) continue;
    }

    const orderId = orderIdx !== -1 ? String(row[orderIdx] || '').trim() : `#ORD-${i}`;
    const sku = skuIdx !== -1 ? String(row[skuIdx] || '').trim() : '';
    const name = nameIdx !== -1 ? String(row[nameIdx] || '').trim() : '';
    const variant = varIdx !== -1 ? String(row[varIdx] || '').trim() : '';
    const qty = qtyIdx !== -1 ? (parseFloat(row[qtyIdx]) || 1) : 1;
    const price = priceIdx !== -1 ? (parseFloat(row[priceIdx]) || 0) : 0;

    if (!sku && !name) continue;

    resultRows.push({
      orderId: orderId || `#ORD-${i}`,
      sku,
      name,
      variant,
      qty,
      price
    });
  }

  return resultRows;
}

function downloadSampleOrdersXLSX() {
  if (typeof XLSX === 'undefined') {
    alert("Thư viện SheetJS chưa sẵn sàng, đang chuyển sang tải file CSV...");
    downloadSampleOrdersCSV();
    return;
  }
  const headers = ["Mã Đơn Hàng", "Mã SKU", "Tên Sản Phẩm", "Biến Thể (Size/Màu)", "Số Lượng", "Đơn Giá Bán"];
  const data = SAMPLE_ORDERS_RAW.map(r => [r.orderId, r.sku, r.name, r.variant, r.qty, r.price]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Don_Hang_Mau");
  XLSX.writeFile(wb, "danh_sach_don_hang_mau_13_tien_to.xlsx");
}

function downloadSampleOrdersCSV() {
  const csvContent = 
`Mã Đơn Hàng,Mã SKU,Tên Sản Phẩm,Biến Thể (Size/Màu),Số Lượng,Đơn Giá Bán
#ORD-2026-001,CLEAR-CSTICKER-CUSTOM-09,Decal Trong Suốt 5cm (Clear Sticker),5cm Tròn,25,12000
#ORD-2026-001,GCB-05P-MATTE,Sổ Thẻ Gift Card Book (5 trang bìa mờ),5 trang Mờ,2,85000
#ORD-2026-002,CAL-2026-DESK,Lịch Để Bàn A4 Lò Xo 13 Tờ,Khổ A4,5,95000
#ORD-2026-003,UV-CSTICKER-GOLD-99,Sticker UV DTF Logo Nổi Chuyển Nhiệt,Khổ cuộn 0.62m,30,15000
#ORD-2026-004,PLC2-DELUXE-01,Bộ Bài Playing Cards V.2 Cao Cấp,Bản V.2,3,120000
#ORD-2026-005,SCARD-ATM-PAY,Skin Card ATM / Ngân Hàng Hologram,Chuẩn ATM,50,25000
#ORD-2026-006,STICKER-FASSON-SUA,Sticker Decal Sữa Fasson Chống Nước,33x48cm,40,10000
#ORD-2026-007,SILVER-CSTICKER-SHINE,Custom Silver Sticker Decal Xi Bạc Bóng,Tem bạc máy móc,15,35000
#ORD-2026-008,KRAFT-CSTICKER-RETRO,Custom Kraft Sticker Decal Giấy Da Bò,Vintage Kraft,20,20000
#ORD-2026-009,CSTICKER-HOLO-127,Decal Hologram Tia Laser 7 Màu,Cuộn 1.27m,10,45000
#ORD-2026-010,GCB-15P-HOLO-VIP,Sổ Thẻ Quà Tặng Gift Card Book (15 trang bìa Holo),15 trang Holo,4,150000
#ORD-2026-011,HD-EMB-BLACK-XL,Áo Hoodie Nỉ Bông Thêu Vi Tính Nổi Chữ Kí,Size XL Đen,2,380000
#ORD-2026-012,CAP-EMB-NAVY-01,Mũ Lưỡi Trai Classic Thêu Logo 3D Nổi,Màu Navy,6,125000`;

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "danh_sach_don_hang_mau_13_tien_to.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportOrderCostReportXLSX() {
  const { orders, flatItems } = groupAndCalculateOrders(state.orderCostState.rawRows);
  if (flatItems.length === 0) {
    alert("Không có dữ liệu đơn hàng nào để xuất báo cáo!");
    return;
  }

  if (typeof XLSX === 'undefined') {
    alert("Đang xuất báo cáo dạng CSV...");
    exportOrderCostReportCSV(flatItems);
    return;
  }

  const rows = [
    [
      "Mã Đơn Hàng",
      "Mã SKU File",
      "Tên Hàng File",
      "Biến Thể",
      "Tiền Tố Nhận Diện",
      "Mã SP Khớp Hệ Thống",
      "Tên Sản Phẩm Hệ Thống",
      "Số Lượng",
      "Đơn Giá Biến Phí (NVL+Thợ)",
      "Đơn Giá Khấu Hao Máy & QL",
      "ĐƠN GIÁ COST TOÀN PHẦN",
      "TỔNG CHI PHÍ COST MÓN",
      "Đơn Giá Bán Thực Tế",
      "TỔNG DOANH THU MÓN",
      "LÃI GỘP MÓN",
      "TỶ SUẤT LỢI NHUẬN (%)",
      "Độ Tin Cậy Khớp"
    ]
  ];

  flatItems.forEach(it => {
    rows.push([
      it.orderId || '',
      it.sku || '',
      it.name || '',
      it.variant || '',
      it.prefixDef ? it.prefixDef.prefix : 'N/A',
      it.product ? it.product.code : 'CHƯA KHỚP',
      it.product ? it.product.name : 'CHƯA KHỚP',
      it.qty || 0,
      it.unitVariableCost || 0,
      (it.unitOverheadCost || 0) + (it.unitPaybackSurcharge || 0),
      it.unitFullCost || 0,
      it.lineFullCost || 0,
      it.effectiveUnitPrice || 0,
      it.lineRevenue || 0,
      it.lineProfit || 0,
      it.profitMargin || 0,
      it.matchLabel || ''
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Chi_Phi_Don_Hang");
  XLSX.writeFile(wb, `bao_cao_cost_don_hang_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function exportOrderCostReportCSV(flatItems) {
  const headers = [
    "Mã Đơn Hàng",
    "Mã SKU File",
    "Tên Hàng File",
    "Biến Thể",
    "Tiền Tố Nhận Diện",
    "Mã SP Khớp",
    "Tên SP Khớp",
    "Số Lượng",
    "Đơn Giá Biến Phí",
    "Đơn Giá Cost Toàn Phần",
    "Tổng Chi Phí Cost",
    "Đơn Giá Bán",
    "Tổng Doanh Thu",
    "Lãi Gộp",
    "Tỷ Suất Lợi Nhuận (%)"
  ];

  let csvContent = headers.join(",") + "\n";
  flatItems.forEach(it => {
    const row = [
      `"${it.orderId || ''}"`,
      `"${it.sku || ''}"`,
      `"${(it.name || '').replace(/"/g, '""')}"`,
      `"${(it.variant || '').replace(/"/g, '""')}"`,
      `"${it.prefixDef ? it.prefixDef.prefix : 'N/A'}"`,
      `"${it.product ? it.product.code : ''}"`,
      `"${it.product ? (it.product.name || '').replace(/"/g, '""') : ''}"`,
      it.qty || 0,
      it.unitVariableCost || 0,
      it.unitFullCost || 0,
      it.lineFullCost || 0,
      it.effectiveUnitPrice || 0,
      it.lineRevenue || 0,
      it.lineProfit || 0,
      it.profitMargin || 0
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `bao_cao_cost_don_hang_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function syncOrdersToMRP() {
  const { flatItems } = groupAndCalculateOrders(state.orderCostState.rawRows);
  if (flatItems.length === 0) {
    alert("Không có sản phẩm nào để đồng bộ vào MRP!");
    return;
  }

  const quantitiesToAdd = {};
  let totalQty = 0;
  let matchedCount = 0;

  flatItems.forEach(it => {
    if (it.product && it.qty > 0) {
      quantitiesToAdd[it.product.id] = (quantitiesToAdd[it.product.id] || 0) + it.qty;
      totalQty += it.qty;
      matchedCount++;
    }
  });

  const confirmMsg = `Bạn có chắc muốn đồng bộ sản lượng từ danh sách đơn hàng vào Kế Hoạch & Dự Báo (MRP) Tháng 7?\n\n- Tổng số dòng đã khớp: ${matchedCount} dòng\n- Tổng sản lượng cộng thêm: ${totalQty.toLocaleString('vi-VN')} chiếc\n\nNhấn OK để đồng bộ, Cancel để hủy.`;
  if (!confirm(confirmMsg)) return;

  let updatedProducts = 0;
  Object.keys(quantitiesToAdd).forEach(pId => {
    const p = state.products.find(x => x.id === pId);
    if (p) {
      p.forecast.actualSales = (p.forecast.actualSales || 0) + quantitiesToAdd[pId];
      p.forecast.salesForecast = Math.round(p.forecast.actualSales * 1.1);
      updatedProducts++;
    }
  });

  if (updatedProducts > 0) {
    state.saveProducts();
    renderForecast();
    recalculateForecastTotals();
    alert(`✅ Đã đồng bộ thành công sản lượng của ${updatedProducts} sản phẩm vào Kế Hoạch Sản Xuất & Dự Báo (MRP)!`);
  }
}

// Export application instance globally for inline button onclick bindings if any
window.app = {
  switchTab,
  triggerLiveCalculation,
  renderMonthlyReport,
  exportMonthlyReportCSV,
  saveCurrentMonthCosts,
  resetCurrentMonthSalary,
  handleLiveMonthlyCostChange,
  renderOrderCostInspector,
  downloadSampleOrdersXLSX,
  downloadSampleOrdersCSV,
  exportOrderCostReportXLSX,
  syncOrdersToMRP,
  matchProductBySkuPrefix
};

