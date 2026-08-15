/**
 * FactoryCost - Forecast & Analytics Application Logic
 * Pure client-side JavaScript, localStorage state, reactive calculations, and SVG charts.
 */

// ==========================================================================
// 1. Initial Mock Data & State Configuration
// ==========================================================================

const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwoheq43Jz30MQWTkDqzC6KJ7zdOKUJDlWAyk75oI39q8YNesK-NYzKqqVhyZP1oNqF/exec";

const DEFAULT_SETTINGS = {
  electricityPrice: 3000,   // đ/kWh
  defaultOverhead: 10,      // %
  standardHours: 208,       // Giờ công chuẩn/tháng
  defaultProfitMargin: 20,  // % Lợi nhuận mặc định
  passcode: "123456",       // Mật khẩu truy cập mặc định
  monthlyElectricity: {
    In: 8000000,
    Thêu: 11000000
  },
  hr: {
    In: {
      designer: [
        { name: "Nhân viên In - Designer A", salary: 12000000 },
        { name: "Nhân viên In - Designer B", salary: 12000000 },
        { name: "Nhân viên In - Designer C", salary: 12000000 },
        { name: "Nhân viên In - Designer D", salary: 12000000 },
        { name: "Nhân viên In - Designer E", salary: 12000000 },
        { name: "Nhân viên In - Designer F", salary: 12000000 },
        { name: "Nhân viên In - Designer G", salary: 12000000 }
      ],
      production: [
        { name: "Nhân viên In - Sản xuất A", salary: 9000000 },
        { name: "Nhân viên In - Sản xuất B", salary: 9000000 },
        { name: "Nhân viên In - Sản xuất C", salary: 9000000 }
      ],
      qc: [
        { name: "Nhân viên In - QC A", salary: 8500000 },
        { name: "Nhân viên In - QC B", salary: 8500000 }
      ]
    },
    Thêu: {
      designer: [
        { name: "Nhân viên Thêu - Designer A", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer B", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer C", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer D", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer E", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer F", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer G", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer H", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer I", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer J", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer K", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer L", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer M", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer N", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer O", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer P", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer Q", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer R", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer S", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer T", salary: 13000000 },
        { name: "Nhân viên Thêu - Designer U", salary: 13000000 }
      ],
      laser: [
        { name: "Nhân viên Thêu - Laser A", salary: 9500000 }
      ],
      production: [
        { name: "Nhân viên Thêu - Vận hành A", salary: 9000000 },
        { name: "Nhân viên Thêu - Vận hành B", salary: 9000000 },
        { name: "Nhân viên Thêu - Vận hành C", salary: 9000000 },
        { name: "Nhân viên Thêu - Vận hành D", salary: 9000000 },
        { name: "Nhân viên Thêu - Vận hành E", salary: 9000000 },
        { name: "Nhân viên Thêu - Vận hành F", salary: 9000000 }
      ],
      qc: [
        { name: "Nhân viên Thêu - QC A", salary: 8500000 },
        { name: "Nhân viên Thêu - QC B", salary: 8500000 },
        { name: "Nhân viên Thêu - QC C", salary: 8500000 },
        { name: "Nhân viên Thêu - QC D", salary: 8500000 }
      ]
    }
  },
  machines: [
    {
      id: "mach-konica",
      name: "Máy in Konica C4000",
      investment: 150000000,
      paybackYears: 2,
      expectedVolumePerYear: 20000,
      currentVolume: 12000,
      surchargePerUnit: 3750,
      unitType: "Click"
    },
    {
      id: "mach-uvdtf",
      name: "Máy in UV-DTF 60cm",
      investment: 200000000,
      paybackYears: 3,
      expectedVolumePerYear: 15000,
      currentVolume: 8000,
      surchargePerUnit: 4444,
      unitType: "Mét"
    }
  ]
};

const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Bộ bài Playing Cards (Hộp giấy)",
    code: "PC-PAPER-01",
    category: "Bài in (Playing Cards)",
    factoryType: "In",
    materials: [
      { name: "Giấy C300gsm A3", qty: 3, unit: "Tờ", price: 900 },
      { name: "In Konica (2 mặt) - Click", qty: 12, unit: "Click", price: 600 },
      { name: "Cán màng MỜ (OPAM)", qty: 6, unit: "Lần", price: 1008 },
      { name: "Giấy Irovy 300gsm (Hộp Ivory)", qty: 0.25, unit: "Tờ", price: 940 },
      { name: "In hộp (Konica) - Click", qty: 0.5, unit: "Click", price: 600 },
      { name: "Cán màng MỜ hộp (OPAM)", qty: 0.25, unit: "Lần", price: 1008 }
    ],
    labor: { designer: 0.02, production: 0.15, qc: 0.05 },
    electricity: { power: 2.5, runTime: 0.2 },
    overheadPercentage: 10,
    forecast: {
      salesForecast: 1000,
      currentStock: 100,
      safetyStock: 200
    }
  },
  {
    id: "prod-2",
    name: "Bộ bài Playing Cards (Hộp nhựa)",
    code: "PC-PLASTIC-02",
    category: "Bài in (Playing Cards)",
    factoryType: "In",
    materials: [
      { name: "Giấy C300gsm A3", qty: 3, unit: "Tờ", price: 900 },
      { name: "In Konica (2 mặt) - Click", qty: 12, unit: "Click", price: 600 },
      { name: "Cán màng MỜ (OPAM)", qty: 6, unit: "Lần", price: 1008 },
      { name: "Hộp nhựa cứng bảo vệ", qty: 1, unit: "Hộp", price: 25000 },
      { name: "Decal sữa (dải cuốn ngoài hộp)", qty: 0.111, unit: "Tờ", price: 6000 },
      { name: "In dải cuốn (Konica) - Click", qty: 0.222, unit: "Click", price: 600 }
    ],
    labor: { designer: 0.02, production: 0.12, qc: 0.04 },
    electricity: { power: 2.5, runTime: 0.15 },
    overheadPercentage: 10,
    forecast: {
      salesForecast: 600,
      currentStock: 40,
      safetyStock: 120
    }
  },
  {
    id: "prod-3",
    name: "Bộ bài Uno Cards (Hộp giấy gộp)",
    code: "UNO-PAPER-01",
    category: "Bài in (Uno Cards)",
    factoryType: "In",
    materials: [
      { name: "Giấy C300gsm A3 (Thẻ + Hộp)", qty: 7, unit: "Tờ", price: 900 },
      { name: "In Konica (2 mặt) - Click", qty: 28, unit: "Click", price: 600 },
      { name: "Cán màng MỜ (OPAM)", qty: 14, unit: "Lần", price: 1008 }
    ],
    labor: { designer: 0.03, production: 0.25, qc: 0.08 },
    electricity: { power: 2.5, runTime: 0.35 },
    overheadPercentage: 10,
    forecast: {
      salesForecast: 800,
      currentStock: 150,
      safetyStock: 150
    }
  },
  {
    id: "prod-4",
    name: "Sticker Decal An Nam Sữa Mờ (Không cán)",
    code: "ST-AN-SUA-01",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    materials: [
      { name: "Decal sữa mờ (An Nam) A3+", qty: 1, unit: "Tờ", price: 6000 },
      { name: "In Konica (1 mặt) - Click", qty: 1, unit: "Tờ", price: 1200 }
    ],
    labor: { designer: 0.005, production: 0.03, qc: 0.01 },
    electricity: { power: 1.5, runTime: 0.05 },
    overheadPercentage: 5,
    forecast: {
      salesForecast: 5000,
      currentStock: 1200,
      safetyStock: 1500
    }
  },
  {
    id: "prod-5",
    name: "Sticker Decal ThaiKK Sữa Mờ (Cán màng OPAM)",
    code: "ST-TK-SUA-03",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    materials: [
      { name: "Decal sữa mờ (ThaiKK) A3+", qty: 1, unit: "Tờ", price: 3000 },
      { name: "In Konica (1 mặt) - Click", qty: 1, unit: "Tờ", price: 1200 },
      { name: "Màng Nguội Mờ OPAM", qty: 0.48, unit: "Mét", price: 2187 }
    ],
    labor: { designer: 0.005, production: 0.05, qc: 0.015 },
    electricity: { power: 1.8, runTime: 0.06 },
    overheadPercentage: 5,
    forecast: {
      salesForecast: 4000,
      currentStock: 300,
      safetyStock: 800
    }
  },
  {
    id: "prod-6",
    name: "Sticker UV-DTF (Màng A + B)",
    code: "ST-UV-DTF-04",
    category: "Nhãn dán (Sticker)",
    factoryType: "In",
    materials: [
      { name: "Màng A (pet in UV-DTF)", qty: 1, unit: "Mét", price: 16423 },
      { name: "Màng B (cán định hình UV-DTF)", qty: 1, unit: "Mét", price: 16423 }
    ],
    labor: { designer: 0.01, production: 0.08, qc: 0.02 },
    electricity: { power: 3.0, runTime: 0.12 },
    overheadPercentage: 8,
    forecast: {
      salesForecast: 2000,
      currentStock: 100,
      safetyStock: 300
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
    forecast: {
      salesForecast: 600,
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
    forecast: {
      salesForecast: 1500,
      currentStock: 450,
      safetyStock: 350
    }
  }
];

class AppStateManager {
  constructor() {
    this.settings = this.loadSettings();
    this.products = this.loadProducts();
    this.activeTab = "dashboard";
    this.selectedProductId = null;
    
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
        
        // Migrate HR settings from old { count, salary } format to new array format if necessary
        const migrateHrDepartment = (dept, deptKey, defaultDeptList) => {
          if (!dept || !dept[deptKey]) return defaultDeptList;
          const data = dept[deptKey];
          if (Array.isArray(data)) return data; // Already migrated
          
          // Old format: { count, salary }
          const count = parseInt(data.count, 10) || 0;
          const salary = parseFloat(data.salary) || 0;
          
          const employees = [];
          for (let i = 0; i < count; i++) {
            const letter = String.fromCharCode(65 + i); // A, B, C...
            const deptLabel = deptKey === 'laser' ? 'Laser' : deptKey === 'designer' ? 'Designer' : deptKey === 'production' ? 'Sản xuất' : 'QC';
            employees.push({
              name: `Nhân viên ${deptLabel} ${letter}`,
              salary: salary
            });
          }
          return employees;
        };

        const migratedHr = {
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

        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          hr: migratedHr,
          machines: parsed.machines || DEFAULT_SETTINGS.machines || []
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
      if (p.forecast) {
        if (p.forecast.actualSales === undefined) {
          p.forecast.actualSales = Math.round((p.forecast.salesForecast || 0) / 1.1);
        }
      }
      return p;
    };

    const saved = localStorage.getItem("factory_products_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(processProduct);
      } catch (e) {
        console.error("Error parsing products", e);
      }
    }
    return JSON.parse(JSON.stringify(MOCK_PRODUCTS)).map(processProduct);
  }

  saveProducts() {
    localStorage.setItem("factory_products_v2", JSON.stringify(this.products));
    this.syncToCloud();
  }

  async syncFromCloud() {
    if (!this.googleSheetUrl) return false;
    try {
      updateCloudStatus("syncing");
      const res = await fetch(this.googleSheetUrl);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      
      if (data && data.products && data.settings) {
        this.products = data.products;
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

  async syncToCloud() {
    if (!this.googleSheetUrl) {
      updateCloudStatus("local");
      return false;
    }
    try {
      updateCloudStatus("syncing");
      const stateData = {
        products: this.products,
        settings: this.settings,
        saved: new Date().toLocaleString('vi-VN')
      };
      
      await fetch(this.googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(stateData)
      });
      
      updateCloudStatus("synced");
      return true;
    } catch (e) {
      console.error("Failed to sync to cloud:", e);
      updateCloudStatus("error");
      return false;
    }
  }

  resetData() {
    localStorage.removeItem("factory_settings_v2");
    localStorage.removeItem("factory_products_v2");
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
  // 1. Nguyên vật liệu
  const materialsCost = product.materials.reduce((sum, item) => sum + (item.qty * item.price), 0);

  // 2. Nhân công trực tiếp
  let laborCost = 0;
  const stdHours = settings.standardHours || 208;
  const factoryType = product.factoryType;

  let designerCost = 0;
  let productionCost = 0;
  let qcCost = 0;
  let laserCost = 0;

  if (factoryType === "In") {
    const desHourly = getDepartmentHourlyRate(settings.hr.In.designer, stdHours);
    const prodHourly = getDepartmentHourlyRate(settings.hr.In.production, stdHours);
    const qcHourly = getDepartmentHourlyRate(settings.hr.In.qc, stdHours);

    designerCost = (product.labor.designer || 0) * desHourly;
    productionCost = (product.labor.production || 0) * prodHourly;
    qcCost = (product.labor.qc || 0) * qcHourly;

    laborCost = designerCost + productionCost + qcCost;
  } else {
    const desHourly = getDepartmentHourlyRate(settings.hr.Thêu.designer, stdHours);
    const laserHourly = getDepartmentHourlyRate(settings.hr.Thêu.laser, stdHours);
    const prodHourly = getDepartmentHourlyRate(settings.hr.Thêu.production, stdHours);
    const qcHourly = getDepartmentHourlyRate(settings.hr.Thêu.qc, stdHours);

    designerCost = (product.labor.designer || 0) * desHourly;
    laserCost = (product.labor.laser || 0) * laserHourly;
    productionCost = (product.labor.production || 0) * prodHourly;
    qcCost = (product.labor.qc || 0) * qcHourly;

    laborCost = designerCost + laserCost + productionCost + qcCost;
  }

  // 3. Điện năng tiêu thụ (Sử dụng đơn giá điện phân bổ động)
  const productsList = typeof state !== 'undefined' ? state.products : [];
  const factoryElectricityPrice = getElectricityRateForFactory(factoryType, settings, productsList);
  const electricityCost = (product.electricity.power || 0) * 
                          (product.electricity.runTime || 0) * 
                          factoryElectricityPrice;

  // 4. Chi phí quản lý chung phân bổ
  const overheadPercentage = product.overheadPercentage !== undefined ? product.overheadPercentage : settings.defaultOverhead;
  const baseSubtotal = materialsCost + laborCost + electricityCost;
  const overheadCost = baseSubtotal * (overheadPercentage / 100);

  // 5. Tổng giá vốn cơ bản (sau khi hòa vốn - Tiêu chuẩn)
  const baseCost = Math.round(baseSubtotal + overheadCost);

  // 6. Giá bán đề xuất cho Seller sau khi hòa vốn
  const profitPercentage = product.profitPercentage !== undefined ? product.profitPercentage : (settings.defaultProfitMargin !== undefined ? settings.defaultProfitMargin : 20);
  const sellerPrice = Math.round(baseCost * (1 + profitPercentage / 100));

  // 7. Tính toán phụ phí hòa vốn máy móc (nếu có)
  let paybackSurcharge = 0;
  let machineName = "";
  let isMachineActive = false;

  if (product.paybackMachineId && settings.machines) {
    const machine = settings.machines.find(m => m.id === product.paybackMachineId);
    if (machine) {
      machineName = machine.name;
      const targetVolume = (machine.paybackYears || 0) * (machine.expectedVolumePerYear || 0);
      if ((machine.currentVolume || 0) < targetVolume) {
        isMachineActive = true;
        paybackSurcharge = (product.paybackMachineQty || 0) * (machine.surchargePerUnit || 0);
      }
    }
  }

  const paybackBaseCost = baseCost + Math.round(paybackSurcharge);
  const paybackSellerPrice = Math.round(paybackBaseCost * (1 + profitPercentage / 100));

  return {
    materialsCost,
    laborCost,
    electricityCost,
    overheadCost,
    baseCost,
    sellerPrice,
    paybackBaseCost,
    paybackSellerPrice,
    isMachineActive,
    machineName,
    paybackSurcharge,
    profitPercentage,
    breakdown: {
      designerCost,
      laserCost,
      productionCost,
      qcCost
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
// 5. Tab 2: Cost Calculator View Rendering & Interactions
// ==========================================================================

function renderCalculator() {
  const searchVal = document.getElementById("calc-search").value.toLowerCase();
  const filterFactory = document.getElementById("calc-filter-factory").value;

  // Filter products list
  const filteredProducts = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || 
                          (p.code && p.code.toLowerCase().includes(searchVal)) ||
                          (p.category && p.category.toLowerCase().includes(searchVal));
    const matchesFactory = filterFactory === "all" || p.factoryType === filterFactory;
    return matchesSearch && matchesFactory;
  });

  // Render Left Column Product Cards
  const cardsList = document.getElementById("product-cards-list");
  cardsList.innerHTML = "";
  
  document.getElementById("product-count-badge").textContent = `${filteredProducts.length} sản phẩm`;

  if (filteredProducts.length === 0) {
    cardsList.innerHTML = `<div class="no-data">Không tìm thấy sản phẩm.</div>`;
  } else {
    filteredProducts.forEach(p => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `product-card-item ${state.selectedProductId === p.id ? 'selected' : ''}`;
      
      const { baseCost } = calculateProductCost(p, state.settings);
      
      card.innerHTML = `
        <div class="product-card-item-header">
          <div class="product-card-name">${p.name}</div>
          <span class="table-row-factory type-${p.factoryType === "In" ? "print" : "embroid"}">
            ${p.factoryType}
          </span>
        </div>
        <div class="product-card-sku">${p.code || 'N/A'}</div>
        <div class="product-card-footer">
          <span class="text-secondary text-xs">${p.category || 'Không phân nhóm'}</span>
          <div class="product-card-price">${formatVND(baseCost)}</div>
        </div>
      `;
      card.addEventListener("click", () => selectProduct(p.id));
      cardsList.appendChild(card);
    });
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

  // Populate payback machine dropdown options
  const paybackSelect = document.getElementById("payback-machine-select");
  if (paybackSelect) {
    paybackSelect.innerHTML = `<option value="">-- Không liên kết --</option>`;
    if (state.settings.machines) {
      state.settings.machines.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.name;
        paybackSelect.appendChild(opt);
      });
    }
    paybackSelect.value = selectedProduct.paybackMachineId || "";
  }

  const paybackQtyInput = document.getElementById("payback-machine-qty");
  if (paybackQtyInput) {
    paybackQtyInput.value = selectedProduct.paybackMachineQty !== undefined ? selectedProduct.paybackMachineQty : 1;
  }

  // Run calculation & update displays
  triggerLiveCalculation();
}

function selectProduct(id) {
  state.selectedProductId = id;
  renderCalculator();
}

function toggleFactoryInputs(factoryType) {
  const printBlock = document.getElementById("labor-print-block");
  const embroidBlock = document.getElementById("labor-embroid-block");
  const badgeResult = document.getElementById("form-result-factory-badge");

  if (factoryType === "In") {
    printBlock.style.display = "block";
    embroidBlock.style.display = "none";
    badgeResult.textContent = "Nhà máy In";
    badgeResult.className = "badge-factory-type";
  } else {
    printBlock.style.display = "none";
    embroidBlock.style.display = "block";
    badgeResult.textContent = "Nhà máy Thêu";
    badgeResult.className = "badge-factory-type type-embroid";
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
        <input type="text" value="${mat.name}" placeholder="Tên vật tư" class="form-input row-mat-name" required style="min-height:38px;">
      </td>
      <td>
        <input type="number" step="any" min="0" value="${mat.qty}" placeholder="0" class="form-input text-center row-mat-qty calc-trigger" required style="min-height:38px;">
      </td>
      <td>
        <input type="text" value="${mat.unit}" placeholder="m2, cái, kg..." class="form-input text-center row-mat-unit" style="min-height:38px;">
      </td>
      <td>
        <input type="text" value="${mat.price.toLocaleString('vi-VN')}" placeholder="0" class="form-input row-mat-price currency-input calc-trigger" required style="min-height:38px;">
      </td>
      <td class="text-right font-semibold row-mat-total" style="padding: 0 0.5rem; text-align: right; min-width: 120px;">
        ${formatVND(mat.qty * mat.price)}
      </td>
      <td>
        <button type="button" class="btn-remove-row btn-remove-material">&times;</button>
      </td>
    `;
    
    // Add remove handler
    tr.querySelector(".btn-remove-material").addEventListener("click", () => {
      materials.splice(idx, 1);
      renderMaterialsRows(materials);
      triggerLiveCalculation();
    });

    tbody.appendChild(tr);
  });
}

function addNewMaterialRow() {
  const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
  if (!selectedProduct) return;

  if (!selectedProduct.materials) {
    selectedProduct.materials = [];
  }

  selectedProduct.materials.push({
    name: "",
    qty: 1,
    unit: "Cái",
    price: 0
  });

  renderMaterialsRows(selectedProduct.materials);
  // Re-bind currency masking & calculator triggers to the newly added row
  bindDynamicRowEvents();
}

/**
 * Chạy tính toán giá trị trực tiếp dựa trên form nhập liệu hiện tại và cập nhật UI kết quả
 */
function triggerLiveCalculation() {
  const factoryType = document.querySelector('input[name="factoryType"]:checked').value;
  
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

  // 3. Điện năng
  const power = parseFloat(document.getElementById("utility-machine-power").value) || 0;
  const runTime = parseFloat(document.getElementById("utility-run-time").value) || 0;
  const allocatedRate = getElectricityRateForFactory(factoryType, state.settings, state.products);
  const customElectricityPrice = document.getElementById("utility-electricity-price").value;
  const electricityPrice = customElectricityPrice ? parseCurrencyInput(customElectricityPrice) : allocatedRate;
  const electricityCost = power * runTime * electricityPrice;
  document.getElementById("calc-electricity-cost").textContent = formatVND(electricityCost);
  document.getElementById("utility-electricity-price").placeholder = `Phân bổ: ${Math.round(allocatedRate).toLocaleString('vi-VN')} đ/kWh`;

  // 4. Chi phí chung (Overheads)
  const overheadPercentage = parseFloat(document.getElementById("overhead-rate-percentage").value) || 0;
  const baseSubtotal = materialsCost + laborCost + electricityCost;
  const overheadCost = baseSubtotal * (overheadPercentage / 100);
  document.getElementById("calc-overhead-cost").textContent = formatVND(overheadCost);

  // 5. Tổng Base Cost
  const baseCost = Math.round(baseSubtotal + overheadCost);
  document.getElementById("calculated-base-cost").textContent = baseCost.toLocaleString('vi-VN');
  document.getElementById("sticky-base-cost").textContent = baseCost.toLocaleString('vi-VN');

  // 6. Tính giá bán cho seller
  const profitPercentage = parseFloat(document.getElementById("profit-margin-percentage").value) || 0;
  const sellerPrice = Math.round(baseCost * (1 + profitPercentage / 100));
  document.getElementById("calculated-seller-price").textContent = sellerPrice.toLocaleString('vi-VN');
  document.getElementById("sticky-seller-price").textContent = sellerPrice.toLocaleString('vi-VN');
  document.getElementById("bottom-profit-percentage").textContent = profitPercentage;

  // 7. Tính khấu hao hoàn vốn máy móc live
  const paybackMachineSelect = document.getElementById("payback-machine-select");
  const paybackMachineQty = parseFloat(document.getElementById("payback-machine-qty").value) || 0;
  const paybackSurchargeEl = document.getElementById("calc-payback-surcharge");
  const paybackInfoEl = document.getElementById("calc-payback-info-banner");
  
  const costStandardContainer = document.getElementById("cost-standard-container");
  const costPaybackContainer = document.getElementById("cost-payback-container");
  const sellerPriceStandard = document.getElementById("seller-price-standard-container");
  const sellerPricePayback = document.getElementById("seller-price-payback-container");
  
  const stickyPaybackBaseCostBadge = document.getElementById("sticky-payback-base-cost-badge");
  const stickyPaybackSellerPriceBadge = document.getElementById("sticky-payback-seller-price-badge");

  let paybackSurcharge = 0;
  let isMachineActive = false;

  if (paybackMachineSelect && paybackMachineSelect.value && state.settings.machines) {
    const machine = state.settings.machines.find(m => m.id === paybackMachineSelect.value);
    if (machine) {
      const targetVolume = (machine.paybackYears || 0) * (machine.expectedVolumePerYear || 0);
      paybackSurcharge = paybackMachineQty * (machine.surchargePerUnit || 0);
      
      const helpTextEl = document.getElementById("payback-machine-unit-help");
      if (helpTextEl) helpTextEl.textContent = `Quy đổi theo đơn vị ${machine.unitType} của máy`;
      
      if ((machine.currentVolume || 0) < targetVolume) {
        isMachineActive = true;
      }
      
      if (paybackInfoEl) {
        paybackInfoEl.style.display = "block";
        const progress = ((machine.currentVolume || 0) / targetVolume * 100).toFixed(1);
        
        let monthlyVolume = 0;
        state.products.forEach(p => {
          if (p.paybackMachineId === machine.id) {
            const qtyInProduct = p.paybackMachineQty || 0;
            const salesMonth = p.forecast.actualSales || 0;
            monthlyVolume += salesMonth * qtyInProduct;
          }
        });
        
        const annualRunRate = monthlyVolume * 12;
        let speedHtml = "";
        
        if (annualRunRate > 0) {
          const remainingVol = targetVolume - (machine.currentVolume || 0);
          const remainingYearsTarget = remainingVol / (machine.expectedVolumePerYear || 20000);
          const remainingYearsActual = remainingVol / annualRunRate;
          
          if (remainingYearsActual < remainingYearsTarget) {
            const monthsActual = Math.round(remainingYearsActual * 12);
            speedHtml = `<span style="display:block; margin-top: 0.2rem; color: #10b981; font-weight: 600;">🚀 Tốc độ bán thực tế: ${Math.round(annualRunRate).toLocaleString('vi-VN')} ${machine.unitType}/năm. Dự kiến hòa vốn sau ${monthsActual} tháng (Nhanh hơn dự kiến mục tiêu ${remainingYearsTarget.toFixed(1)} năm)!</span>`;
          } else {
            speedHtml = `<span style="display:block; margin-top: 0.2rem; color: #a5b4fc;">Tốc độ bán thực tế: ${Math.round(annualRunRate).toLocaleString('vi-VN')} ${machine.unitType}/năm. Dự kiến hòa vốn sau ${remainingYearsActual.toFixed(1)} năm.</span>`;
          }
        } else {
          speedHtml = `<span style="display:block; margin-top: 0.2rem; color: var(--text-secondary);">Nhập sản lượng bán ở Tab Dự Báo để dự phóng thời gian hòa vốn thực tế.</span>`;
        }

        paybackInfoEl.innerHTML = `
          <strong>${machine.name}</strong>: Đã hoàn vốn <strong>${progress}%</strong> (${(machine.currentVolume || 0).toLocaleString('vi-VN')} / ${targetVolume.toLocaleString('vi-VN')} ${machine.unitType}).
          ${speedHtml}
        `;
      }
    }
  } else {
    if (paybackInfoEl) paybackInfoEl.style.display = "none";
    const helpTextEl = document.getElementById("payback-machine-unit-help");
    if (helpTextEl) helpTextEl.textContent = `Đơn vị tiêu hao của máy`;
  }

  if (paybackSurchargeEl) {
    paybackSurchargeEl.textContent = formatVND(paybackSurcharge);
  }

  if (isMachineActive && paybackSurcharge > 0) {
    const paybackBaseCost = baseCost + Math.round(paybackSurcharge);
    const paybackSellerPrice = Math.round(paybackBaseCost * (1 + profitPercentage / 100));

    if (costStandardContainer) costStandardContainer.style.display = "none";
    if (costPaybackContainer) costPaybackContainer.style.display = "block";
    if (sellerPriceStandard) sellerPriceStandard.style.display = "none";
    if (sellerPricePayback) sellerPricePayback.style.display = "flex";
    
    document.getElementById("calculated-payback-base-cost").textContent = paybackBaseCost.toLocaleString('vi-VN');
    document.getElementById("calculated-standard-base-cost-label").textContent = baseCost.toLocaleString('vi-VN');
    document.getElementById("calculated-payback-seller-price").textContent = paybackSellerPrice.toLocaleString('vi-VN');
    document.getElementById("calculated-standard-seller-price-label").textContent = sellerPrice.toLocaleString('vi-VN');
    
    if (stickyPaybackBaseCostBadge) {
      stickyPaybackBaseCostBadge.style.display = "inline";
      stickyPaybackBaseCostBadge.textContent = `(Trước HV: ₫${paybackBaseCost.toLocaleString('vi-VN')})`;
    }
    if (stickyPaybackSellerPriceBadge) {
      stickyPaybackSellerPriceBadge.style.display = "inline";
      stickyPaybackSellerPriceBadge.textContent = `(Trước HV: ₫${paybackSellerPrice.toLocaleString('vi-VN')})`;
    }
  } else {
    if (costStandardContainer) costStandardContainer.style.display = "block";
    if (costPaybackContainer) costPaybackContainer.style.display = "none";
    if (sellerPriceStandard) sellerPriceStandard.style.display = "flex";
    if (sellerPricePayback) sellerPricePayback.style.display = "none";

    if (stickyPaybackBaseCostBadge) stickyPaybackBaseCostBadge.style.display = "none";
    if (stickyPaybackSellerPriceBadge) stickyPaybackSellerPriceBadge.style.display = "none";
  }

  // Breakdown percentages
  if (baseCost > 0) {
    const matPct = Math.round((materialsCost / baseCost) * 100);
    const labPct = Math.round((laborCost / baseCost) * 100);
    const elePct = Math.round((electricityCost / baseCost) * 100);
    const ovhPct = 100 - matPct - labPct - elePct; // Để tổng luôn bằng 100%

    document.getElementById("breakdown-materials").textContent = `${formatVND(materialsCost)} (${matPct}%)`;
    document.getElementById("breakdown-labor").textContent = `${formatVND(laborCost)} (${labPct}%)`;
    document.getElementById("breakdown-electricity").textContent = `${formatVND(electricityCost)} (${elePct}%)`;
    document.getElementById("breakdown-overhead").textContent = `${formatVND(overheadCost)} (${ovhPct}%)`;
  } else {
    document.getElementById("breakdown-materials").textContent = "₫0 (0%)";
    document.getElementById("breakdown-labor").textContent = "₫0 (0%)";
    document.getElementById("breakdown-electricity").textContent = "₫0 (0%)";
    document.getElementById("breakdown-overhead").textContent = "₫0 (0%)";
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

  // Cập nhật nguyên vật liệu
  product.materials = [];
  const rows = document.querySelectorAll("#materials-tbody tr:not(.empty-materials-row)");
  rows.forEach(row => {
    const name = row.querySelector(".row-mat-name").value;
    const qty = parseFloat(row.querySelector(".row-mat-qty").value) || 0;
    const unit = row.querySelector(".row-mat-unit").value;
    const price = parseCurrencyInput(row.querySelector(".row-mat-price").value);
    
    if (name) {
      product.materials.push({ name, qty, unit, price });
    }
  });

  // Cập nhật nhân công
  product.labor = {};
  if (product.factoryType === "In") {
    product.labor.designer = parseFloat(document.getElementById("labor-print-designer").value) || 0;
    product.labor.production = parseFloat(document.getElementById("labor-print-production").value) || 0;
    product.labor.qc = parseFloat(document.getElementById("labor-print-qc").value) || 0;
  } else {
    product.labor.designer = parseFloat(document.getElementById("labor-embroid-designer").value) || 0;
    product.labor.laser = parseFloat(document.getElementById("labor-embroid-laser").value) || 0;
    product.labor.production = parseFloat(document.getElementById("labor-embroid-production").value) || 0;
    product.labor.qc = parseFloat(document.getElementById("labor-embroid-qc").value) || 0;
  }

  // Cập nhật điện năng
  product.electricity = {};
  product.electricity.power = parseFloat(document.getElementById("utility-machine-power").value) || 0;
  product.electricity.runTime = parseFloat(document.getElementById("utility-run-time").value) || 0;
  const customElectricity = document.getElementById("utility-electricity-price").value;
  product.electricity.rate = customElectricity ? parseCurrencyInput(customElectricity) : null;

  // Cập nhật overhead
  product.overheadPercentage = parseFloat(document.getElementById("overhead-rate-percentage").value);

  // Cập nhật tỷ lệ lợi nhuận
  product.profitPercentage = parseFloat(document.getElementById("profit-margin-percentage").value) || 0;

  // Cập nhật cấu hình hoàn vốn máy móc
  product.paybackMachineId = document.getElementById("payback-machine-select").value || null;
  product.paybackMachineQty = parseFloat(document.getElementById("payback-machine-qty").value) || 0;

  // Lưu vào localStorage
  state.saveProducts();
  
  // Reload view
  renderCalculator();
  alert("Lưu thông tin sản phẩm thành công!");
}

function deleteCurrentProduct() {
  if (!state.selectedProductId) return;
  const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
  if (!selectedProduct) return;

  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${selectedProduct.name}" khỏi hệ thống?`)) {
    state.products = state.products.filter(p => p.id !== state.selectedProductId);
    state.selectedProductId = null;
    state.saveProducts();
    renderCalculator();
  }
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

  const tbody = document.getElementById("forecast-table-tbody");
  tbody.innerHTML = "";

  const filteredProducts = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || 
                          (p.code && p.code.toLowerCase().includes(searchVal)) ||
                          (p.category && p.category.toLowerCase().includes(searchVal));
    const matchesFactory = filterFactory === "all" || p.factoryType === filterFactory;
    return matchesSearch && matchesFactory;
  });

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="no-data">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
    recalculateForecastTotals();
    return;
  }

  filteredProducts.forEach(p => {
    const costDetails = calculateProductCost(p, state.settings);
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
        <div class="text-secondary text-xs">${p.code || 'SKU trống'}</div>
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
        <button type="button" class="btn btn-xs btn-outline btn-go-calc">Sửa giá</button>
      </td>
    `;

    // Go to Cost calculator tab for that product
    tr.querySelector(".btn-go-calc").addEventListener("click", () => {
      state.selectedProductId = p.id;
      switchTab("calculator");
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
  const disconnectBtn = document.getElementById("btn-disconnect-sheet");

  if (sheetUrlInput) {
    sheetUrlInput.value = state.googleSheetUrl;
    if (state.googleSheetUrl) {
      sheetUrlInput.disabled = true;
      testBtn.textContent = "Đồng bộ ngay";
      disconnectBtn.style.display = "block";
    } else {
      sheetUrlInput.disabled = false;
      testBtn.textContent = "Kết nối & Đồng bộ";
      disconnectBtn.style.display = "none";
    }
  }

  renderHrAccordion("In", "hr-print-accordion-container");
  renderHrAccordion("Thêu", "hr-emb-accordion-container");

  updateFactoryTotalPayrollBadge("In");
  updateFactoryTotalPayrollBadge("Thêu");
  renderSettingsPaybackList();
}

function renderSettingsPaybackList() {
  const container = document.getElementById("settings-capex-list");
  if (!container) return;
  container.innerHTML = "";

  if (!state.settings.machines || state.settings.machines.length === 0) {
    container.innerHTML = `<div class="no-data" style="font-size: 0.78rem; text-align: center; padding: 1rem; color: var(--text-secondary);">Chưa khai báo máy móc đầu tư nào.</div>`;
    return;
  }

  state.settings.machines.forEach(m => {
    const targetVolume = (m.paybackYears || 0) * (m.expectedVolumePerYear || 0);
    const progress = Math.min(100, ((m.currentVolume || 0) / targetVolume * 100)).toFixed(1);
    
    let monthlyVolume = 0;
    state.products.forEach(p => {
      if (p.paybackMachineId === m.id) {
        const qtyInProduct = p.paybackMachineQty || 0;
        const salesMonth = p.forecast.actualSales || 0;
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
        <button type="button" class="btn btn-xs btn-danger capex-delete-btn" data-id="${m.id}" style="padding: 0.2rem 0.4rem; font-size: 0.7rem;">Xóa</button>
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

    row.querySelector(".capex-delete-btn").addEventListener("click", () => {
      if (confirm(`Bạn có muốn xóa thiết lập hòa vốn cho "${m.name}" không?`)) {
        state.settings.machines = state.settings.machines.filter(x => x.id !== m.id);
        state.saveSettings(state.settings);
        renderSettings();
        renderCalculator();
      }
    });

    row.querySelector(".capex-update-btn").addEventListener("click", () => {
      const vol = parseFloat(row.querySelector(".capex-volume-input").value) || 0;
      m.currentVolume = vol;
      state.saveSettings(state.settings);
      renderSettings();
      renderCalculator();
      alert(`Đã cập nhật sản lượng tích lũy của "${m.name}" lên ${vol.toLocaleString('vi-VN')} ${m.unitType}!`);
    });

    container.appendChild(row);
  });
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
// 9. Modals & Popups for Product Creation
// ==========================================================================

const productModal = document.getElementById("product-modal");

function openCreateProductModal() {
  document.getElementById("modal-product-form").reset();
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

  const newId = `prod-${Date.now()}`;
  
  // Default values based on factory type
  const newProduct = {
    id: newId,
    name,
    code,
    category,
    factoryType,
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

  // Auth validation overlay logic
  const loginForm = document.getElementById("login-form");
  const loginOverlay = document.getElementById("login-overlay");
  const loginInput = document.getElementById("login-passcode");
  const loginError = document.getElementById("login-error-msg");

  if (sessionStorage.getItem("factory_auth") === "true") {
    loginOverlay.style.display = "none";
  } else {
    loginOverlay.style.display = "flex";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const typed = loginInput.value;
    const correctPasscode = state.settings.passcode || "123456";
    if (typed === correctPasscode) {
      sessionStorage.setItem("factory_auth", "true");
      loginOverlay.style.opacity = "0";
      setTimeout(() => {
        loginOverlay.style.display = "none";
      }, 400);
    } else {
      loginError.textContent = "Mật khẩu không chính xác. Vui lòng nhập lại!";
      loginInput.value = "";
      loginInput.focus();
    }
  });

  document.getElementById("btn-logout").addEventListener("click", () => {
    if (confirm("Bạn có muốn đăng xuất khỏi hệ thống không?")) {
      sessionStorage.removeItem("factory_auth");
      window.location.reload();
    }
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

    state.saveSettings({
      ...state.settings,
      passcode: newPass
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

  // 2. Calculator triggers
  document.getElementById("btn-add-product").addEventListener("click", openCreateProductModal);
  document.getElementById("calc-search").addEventListener("input", renderCalculator);
  document.getElementById("calc-filter-factory").addEventListener("change", renderCalculator);

  document.getElementById("btn-add-material-row").addEventListener("click", addNewMaterialRow);
  
  // Custom rate input masking
  document.querySelectorAll(".calculator-form-panel .currency-input").forEach(maskCurrencyInput);
  
  // Reactivity to changes in form inputs
  document.querySelectorAll(".calculator-form-panel .calc-trigger").forEach(el => {
    el.addEventListener("input", triggerLiveCalculation);
  });

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
  document.getElementById("btn-cancel-edit").addEventListener("click", cancelEditCalculator);

  // 3. Forecast tab triggers
  document.getElementById("forecast-search").addEventListener("input", renderForecast);
  document.getElementById("forecast-filter-factory").addEventListener("change", renderForecast);

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
        investment,
        paybackYears: years,
        expectedVolumePerYear: expectedVol,
        currentVolume: 0,
        surchargePerUnit: surcharge,
        unitType
      };

      if (!state.settings.machines) {
        state.settings.machines = [];
      }
      state.settings.machines.push(newMachine);
      state.saveSettings(state.settings);

      capexForm.reset();
      renderSettings();
      renderCalculator();
      alert(`Đã thêm thiết lập hòa vốn thành công cho máy "${name}"!`);
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

  // Spreadsheet Template Selector Event Listeners
  const templateSelect = document.getElementById("template-select");
  const templateSizeContainer = document.getElementById("template-size-container");
  const templateSizeSelect = document.getElementById("template-size");
  const btnApplyTemplate = document.getElementById("btn-apply-template");

  if (templateSelect) {
    templateSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val.startsWith("sticker-") || val === "uv-dtf") {
        templateSizeContainer.style.display = "flex";
      } else {
        templateSizeContainer.style.display = "none";
      }
    });

    btnApplyTemplate.addEventListener("click", () => {
      const template = templateSelect.value;
      if (!template) {
        alert("Vui lòng chọn một mẫu sản phẩm!");
        return;
      }
      
      const selectedProduct = state.products.find(p => p.id === state.selectedProductId);
      if (!selectedProduct) {
        alert("Vui lòng chọn một sản phẩm ở cột bên trái trước khi áp dụng mẫu!");
        return;
      }

      const size = parseFloat(templateSizeSelect.value) || 2.0;
      let materials = [];

      if (template.startsWith("sticker-")) {
        let matKey = "";
        let matPrice = 0;
        if (template === "sticker-sua-mo") {
          matKey = "Decal Sữa Mờ ThaiKK";
          matPrice = 2826;
        } else if (template === "sticker-trong") {
          matKey = "Decal Trong ThaiKK";
          matPrice = 2709;
        } else if (template === "sticker-bac-bong") {
          matKey = "Decal Bạc Bóng ThaiKK";
          matPrice = 2313;
        } else if (template === "sticker-kraft") {
          matKey = "Decal Kraft ThaiKK";
          matPrice = 1145;
        }

        let itemsPerSheet = 40;
        if (template === "sticker-sua-mo" || template === "sticker-trong") {
          const yields = { 1.5: 70, 2: 40, 3: 20, 4: 12, 5: 6 };
          itemsPerSheet = yields[size] || 40;
        } else {
          const yields = { 1.5: 56, 2: 30, 3: 16, 4: 9, 5: 4 };
          itemsPerSheet = yields[size] || 30;
        }

        const qty = 1 / itemsPerSheet;

        materials = [
          { name: matKey, qty: parseFloat(qty.toFixed(6)), unit: "Tờ", price: matPrice },
          { name: "In Konica (1 mặt) - Click", qty: parseFloat(qty.toFixed(6)), unit: "Click", price: 1200 }
        ];

        selectedProduct.factoryType = "In";
        const printRadio = document.getElementById("factory-print");
        if (printRadio) printRadio.checked = true;
        toggleFactoryInputs("In");

      } else if (template === "skin-card") {
        const qty = 1 / 21;
        materials = [
          { name: "Decal Sữa Mờ ThaiKK", qty: parseFloat(qty.toFixed(6)), unit: "Tờ", price: 2826 },
          { name: "In Konica (1 mặt) - Click", qty: parseFloat(qty.toFixed(6)), unit: "Click", price: 1200 }
        ];
        selectedProduct.factoryType = "In";
        const printRadio = document.getElementById("factory-print");
        if (printRadio) printRadio.checked = true;
        toggleFactoryInputs("In");

      } else if (template === "uv-dtf") {
        const yields = { 1.5: 135, 2: 84, 3: 45, 4: 28, 5: 18 };
        const itemsPerMeter = yields[size] || 84;
        const qty = 1 / itemsPerMeter;

        materials = [
          { name: "Màng A (pet in UV-DTF)", qty: parseFloat(qty.toFixed(6)), unit: "Mét", price: 14446 },
          { name: "Màng B (cán định hình UV-DTF)", qty: parseFloat(qty.toFixed(6)), unit: "Mét", price: 14446 },
          { name: "In UV-DTF - Click", qty: parseFloat(qty.toFixed(6)), unit: "Mét", price: 15000 }
        ];
        selectedProduct.factoryType = "In";
        const printRadio = document.getElementById("factory-print");
        if (printRadio) printRadio.checked = true;
        toggleFactoryInputs("In");

      } else if (template === "calendar") {
        materials = [
          { name: "Giấy Coucher A4 300gsm", qty: 13, unit: "Tờ", price: 460 },
          { name: "In Konica (1 mặt) - Click", qty: 13, unit: "Click", price: 1200 }
        ];
        selectedProduct.factoryType = "In";
        const printRadio = document.getElementById("factory-print");
        if (printRadio) printRadio.checked = true;
        toggleFactoryInputs("In");

      } else if (template === "playing-cards") {
        materials = [
          { name: "Giấy Coucher A3 300gsm", qty: 3, unit: "Tờ", price: 900 },
          { name: "In Konica (2 mặt) - Click", qty: 6, unit: "Click", price: 600 }
        ];
        selectedProduct.factoryType = "In";
        const printRadio = document.getElementById("factory-print");
        if (printRadio) printRadio.checked = true;
        toggleFactoryInputs("In");

      } else if (template === "hop-giay") {
        materials = [
          { name: "Giấy Irovy 33x48cm 300gsm", qty: 0.25, unit: "Tờ", price: 940 },
          { name: "In hộp (Konica) - Click", qty: 0.25, unit: "Click", price: 1200 }
        ];
        selectedProduct.factoryType = "In";
        const printRadio = document.getElementById("factory-print");
        if (printRadio) printRadio.checked = true;
        toggleFactoryInputs("In");
      }

      selectedProduct.materials = materials;
      if (template.startsWith("sticker-") || template === "uv-dtf") {
        selectedProduct.sizeVariation = size;
      } else {
        selectedProduct.sizeVariation = null;
      }
      state.saveProducts();
      
      renderCalculator();
      alert(`Đã áp dụng mẫu định mức "${templateSelect.options[templateSelect.selectedIndex].text}" (${template.startsWith("sticker-") || template === "uv-dtf" ? size + " inch" : "Mặc định"}) thành công!`);
    });
  }

  // Google Sheets Database Event Listeners
  document.getElementById("btn-test-sheet").addEventListener("click", async () => {
    const urlInput = document.getElementById("settings-sheet-url");
    const url = urlInput.value.trim();
    if (!url) {
      alert("Vui lòng nhập URL Web App của Google Apps Script!");
      return;
    }
    if (!url.startsWith("https://script.google.com/")) {
      alert("URL không đúng định dạng Google Apps Script (bắt đầu bằng https://script.google.com/)!");
      return;
    }

    const oldUrl = state.googleSheetUrl;
    state.googleSheetUrl = url;
    
    updateCloudStatus("syncing");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Connect failed");
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
      alert("Không thể kết nối tới Google Apps Script URL. Vui lòng kiểm tra lại cấu hình Deploy Web App!");
      state.googleSheetUrl = oldUrl;
      updateCloudStatus(oldUrl ? "synced" : "local");
    }
  });

  document.getElementById("btn-disconnect-sheet").addEventListener("click", () => {
    if (confirm("Bạn có muốn ngắt kết nối với Google Sheets? Dữ liệu của bạn sẽ quay về lưu trữ cục bộ trên máy này.")) {
      state.googleSheetUrl = "";
      localStorage.setItem("factory_sheet_url_v2", "none");
      updateCloudStatus("local");
      renderSettings();
    }
  });

  document.getElementById("cloud-sync-status").addEventListener("click", () => {
    if (!state.googleSheetUrl) {
      switchTab("settings");
      document.getElementById("settings-sheet-url").focus();
    } else {
      state.syncFromCloud().then(success => {
        if (success) {
          renderCalculator();
          renderForecast();
          renderSettings();
          recalculateForecastTotals();
          updateDashboard();
          alert("Đã tải dữ liệu mới nhất từ Google Sheets!");
        } else {
          alert("Đồng bộ thất bại. Vui lòng kiểm tra kết nối mạng!");
        }
      });
    }
  });

  // Cloud Database Sync on Startup
  if (state.googleSheetUrl) {
    state.syncFromCloud().then(success => {
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

  // Initialize
  switchTab("dashboard");
});

// Export application instance globally for inline button onclick bindings if any
window.app = {
  switchTab,
  triggerLiveCalculation
};
