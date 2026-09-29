/**
 * =========================================================================================
 * BỘ KHỞI TẠO HỆ THỐNG TÍNH GIÁ THÀNH & DỰ BÁO TỰ ĐỘNG TRÊN GOOGLE SHEETS
 * Tự động tạo 6 Tabs với 100% công thức liên kết động:
 * 1. CAU_HINH       : Giờ công chuẩn, Tỷ lệ Overhead, Lợi nhuận & Tiền điện 2 xưởng
 * 2. NHAN_SU_LUONG  : Danh sách nhân viên & Bảng tổng hợp đơn giá giờ công từng khâu (AVERAGEIFS)
 * 3. KHAU_HAO_MAY   : Khấu hao máy móc trong 3 năm đầu và sau 3 năm (Khấu hao giảm)
 * 4. GIA_NVL        : Danh mục giá sỉ & Công thức quy đổi giá lẻ nguyên vật liệu
 * 5. GIA_THANH_BOM  : Định mức BOM & 2 Biểu giá song song (3 năm đầu & Sau 3 năm)
 * 6. DU_BAO_MRP     : Nhập doanh số bán Tháng 7, tự tính tiêu hao & đơn hàng mua Tháng 8
 * =========================================================================================
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở Bảng tính Google Sheets của bạn.
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết code cũ, dán toàn bộ đoạn mã này vào.
 * 4. Ở menu trên cùng, chọn hàm "khoiTaoHeThongTinhGia" và bấm "Chạy" (Run).
 * 5. Cấp quyền truy cập cho Google Sheets (chỉ cần làm 1 lần).
 * 6. Quay lại Google Sheets: Toàn bộ 6 Tabs và công thức đã được tạo tự động 100%!
 * =========================================================================================
 */

function khoiTaoHeThongTinhGia() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Tạo hoặc lấy các sheet
  var sheetCauHinh = getOrCreateSheet(ss, "1_CAU_HINH");
  var sheetNhanSu = getOrCreateSheet(ss, "2_NHAN_SU_LUONG");
  var sheetKhauHao = getOrCreateSheet(ss, "3_KHAU_HAO_MAY");
  var sheetNVL = getOrCreateSheet(ss, "4_GIA_NVL");
  var sheetBOM = getOrCreateSheet(ss, "5_GIA_THANH_BOM");
  var sheetMRP = getOrCreateSheet(ss, "6_DU_BAO_MRP");

  setupSheetCauHinh(sheetCauHinh);
  setupSheetNhanSu(sheetNhanSu);
  setupSheetKhauHao(sheetKhauHao);
  setupSheetGiaNVL(sheetNVL);
  setupSheetBOM(sheetBOM);
  setupSheetMRP(sheetMRP);

  SpreadsheetApp.flush();
  Browser.msgBox("Thành công!", "Đã khởi tạo thành công hệ thống 6 Bảng tính với đầy đủ công thức liên kết động!", Browser.Buttons.OK);
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  sheet.clear();
  return sheet;
}

// -----------------------------------------------------------------------------
// TAB 1: CẤU HÌNH THÔNG SỐ & TIỀN ĐIỆN
// -----------------------------------------------------------------------------
function setupSheetCauHinh(sheet) {
  sheet.setTabColor("#6366f1");
  
  sheet.getRange("A1:C1").merge().setValue("CẤU HÌNH THÔNG SỐ VẬN HÀNH & CHI PHÍ ĐIỆN NĂNG")
    .setFontWeight("bold").setFontSize(14).setBackground("#4f46e5").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var data = [
    ["Thông số", "Giá trị", "Đơn vị / Ghi chú"],
    ["Giờ công chuẩn / tháng", 208, "Giờ (26 ngày x 8h)"],
    ["Tỷ lệ chi phí quản lý chung (Overhead)", 0.10, "% tính trên tổng NVL + Nhân công + Điện"],
    ["Biên lợi nhuận đề xuất cho Seller", 0.20, "% lợi nhuận mong muốn"],
    ["Đơn giá điện chuẩn EVN", 3000, "₫/kWh"],
    ["", "", ""],
    ["CHI PHÍ ĐIỆN THEO NHÀ MÁY", "Số tiền (₫/tháng)", "Sản lượng điện tương đương (kWh/tháng)"],
    ["Nhà máy In", 8000000, "=B8/B5"],
    ["Nhà máy Thêu", 11000000, "=B9/B5"]
  ];

  sheet.getRange(2, 1, data.length, 3).setValues(data);
  sheet.getRange("A2:C2").setFontWeight("bold").setBackground("#e0e7ff");
  sheet.getRange("A7:C7").setFontWeight("bold").setBackground("#e0e7ff");
  sheet.getRange("A8:A9").setFontWeight("bold");

  sheet.getRange("B3").setNumberFormat("#,##0");
  sheet.getRange("B4").setNumberFormat("0.0%");
  sheet.getRange("B5").setNumberFormat("0.0%");
  sheet.getRange("B6").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("B8:B9").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("C8:C9").setNumberFormat("#,##0\" kWh\"");

  sheet.setColumnWidth(1, 300);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 320);
}

// -----------------------------------------------------------------------------
// TAB 2: NHÂN SỰ & BẢNG LƯƠNG
// -----------------------------------------------------------------------------
function setupSheetNhanSu(sheet) {
  sheet.setTabColor("#10b981");

  sheet.getRange("A1:F1").merge().setValue("DANH SÁCH NHÂN SỰ CHI TIẾT THEO TỪNG KHÂU")
    .setFontWeight("bold").setFontSize(14).setBackground("#059669").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = ["Nhà máy", "Khâu sản xuất", "Tên nhân sự", "Lương tháng (₫)", "Giờ chuẩn/tháng", "Đơn giá giờ công (₫/h)"];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#d1fae5");

  var employees = [
    ["In", "Designer", "Nhân viên In - Designer A", 12000000, "='1_CAU_HINH'!$B$2", "=D3/E3"],
    ["In", "Designer", "Nhân viên In - Designer B", 12000000, "='1_CAU_HINH'!$B$2", "=D4/E4"],
    ["In", "Designer", "Nhân viên In - Designer C", 12000000, "='1_CAU_HINH'!$B$2", "=D5/E5"],
    ["In", "Designer", "Nhân viên In - Designer D", 12000000, "='1_CAU_HINH'!$B$2", "=D6/E6"],
    ["In", "Designer", "Nhân viên In - Designer E", 12000000, "='1_CAU_HINH'!$B$2", "=D7/E7"],
    ["In", "Designer", "Nhân viên In - Designer F", 12000000, "='1_CAU_HINH'!$B$2", "=D8/E8"],
    ["In", "Designer", "Nhân viên In - Designer G", 12000000, "='1_CAU_HINH'!$B$2", "=D9/E9"],
    ["In", "Sản xuất", "Nhân viên In - Sản xuất A", 9000000, "='1_CAU_HINH'!$B$2", "=D10/E10"],
    ["In", "Sản xuất", "Nhân viên In - Sản xuất B", 9000000, "='1_CAU_HINH'!$B$2", "=D11/E11"],
    ["In", "Sản xuất", "Nhân viên In - Sản xuất C", 9000000, "='1_CAU_HINH'!$B$2", "=D12/E12"],
    ["In", "QC", "Nhân viên In - QC A", 8500000, "='1_CAU_HINH'!$B$2", "=D13/E13"],
    ["In", "QC", "Nhân viên In - QC B", 8500000, "='1_CAU_HINH'!$B$2", "=D14/E14"],

    ["Thêu", "Designer", "Nhân viên Thêu - Designer A", 13000000, "='1_CAU_HINH'!$B$2", "=D15/E15"],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer B", 13000000, "='1_CAU_HINH'!$B$2", "=D16/E16"],
    ["Thêu", "Laser", "Nhân viên Thêu - Laser A", 9500000, "='1_CAU_HINH'!$B$2", "=D17/E17"],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành A", 9000000, "='1_CAU_HINH'!$B$2", "=D18/E18"],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành B", 9000000, "='1_CAU_HINH'!$B$2", "=D19/E19"],
    ["Thêu", "QC", "Nhân viên Thêu - QC A", 8500000, "='1_CAU_HINH'!$B$2", "=D20/E20"],
    ["Thêu", "QC", "Nhân viên Thêu - QC B", 8500000, "='1_CAU_HINH'!$B$2", "=D21/E21"]
  ];

  sheet.getRange(3, 1, employees.length, headers.length).setValues(employees);
  sheet.getRange("D3:D" + (employees.length + 2)).setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("E3:E" + (employees.length + 2)).setNumberFormat("#,##0");
  sheet.getRange("F3:F" + (employees.length + 2)).setNumberFormat("#,##0\" ₫/h\"");

  // Bảng tổng hợp đơn giá giờ công tự động theo từng khâu (Dùng cho BOM)
  sheet.getRange("H1:L1").merge().setValue("BẢNG TỔNG HỢP ĐƠN GIÁ GIỜ CÔNG BÌNH QUÂN TỪNG KHÂU")
    .setFontWeight("bold").setFontSize(12).setBackground("#047857").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var summaryHeaders = ["Nhà máy", "Khâu sản xuất", "Số lượng nhân sự", "Tổng quỹ lương (₫)", "Đơn giá giờ công BQ (₫/h)"];
  sheet.getRange(2, 8, 1, summaryHeaders.length).setValues([summaryHeaders]).setFontWeight("bold").setBackground("#a7f3d0");

  var summaryRows = [
    ["In", "Designer", "=COUNTIFS(A:A, H3, B:B, I3)", "=SUMIFS(D:D, A:A, H3, B:B, I3)", "=IF(J3>0, K3/(J3*'1_CAU_HINH'!$B$2), 0)"],
    ["In", "Sản xuất", "=COUNTIFS(A:A, H4, B:B, I4)", "=SUMIFS(D:D, A:A, H4, B:B, I4)", "=IF(J4>0, K4/(J4*'1_CAU_HINH'!$B$2), 0)"],
    ["In", "QC", "=COUNTIFS(A:A, H5, B:B, I5)", "=SUMIFS(D:D, A:A, H5, B:B, I5)", "=IF(J5>0, K5/(J5*'1_CAU_HINH'!$B$2), 0)"],
    ["Thêu", "Designer", "=COUNTIFS(A:A, H6, B:B, I6)", "=SUMIFS(D:D, A:A, H6, B:B, I6)", "=IF(J6>0, K6/(J6*'1_CAU_HINH'!$B$2), 0)"],
    ["Thêu", "Laser", "=COUNTIFS(A:A, H7, B:B, I7)", "=SUMIFS(D:D, A:A, H7, B:B, I7)", "=IF(J7>0, K7/(J7*'1_CAU_HINH'!$B$2), 0)"],
    ["Thêu", "Sản xuất", "=COUNTIFS(A:A, H8, B:B, I8)", "=SUMIFS(D:D, A:A, H8, B:B, I8)", "=IF(J8>0, K8/(J8*'1_CAU_HINH'!$B$2), 0)"],
    ["Thêu", "QC", "=COUNTIFS(A:A, H9, B:B, I9)", "=SUMIFS(D:D, A:A, H9, B:B, I9)", "=IF(J9>0, K9/(J9*'1_CAU_HINH'!$B$2), 0)"]
  ];

  sheet.getRange(3, 8, summaryRows.length, summaryHeaders.length).setValues(summaryRows);
  sheet.getRange("J3:J9").setNumberFormat("#,##0");
  sheet.getRange("K3:K9").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("L3:L9").setNumberFormat("#,##0\" ₫/h\"").setFontWeight("bold");

  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 220);
  sheet.setColumnWidth(4, 140);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 30); // Cột cách
  sheet.setColumnWidth(8, 90);
  sheet.setColumnWidth(9, 110);
  sheet.setColumnWidth(10, 130);
  sheet.setColumnWidth(11, 150);
  sheet.setColumnWidth(12, 170);
}

// -----------------------------------------------------------------------------
// TAB 3: KHẤU HAO MÁY MÓC 3 NĂM ĐẦU & SAU 3 NĂM
// -----------------------------------------------------------------------------
function setupSheetKhauHao(sheet) {
  sheet.setTabColor("#f59e0b");

  sheet.getRange("A1:K1").merge().setValue("QUẢN LÝ KHẤU HAO ĐẦU TƯ MÁY MÓC (3 NĂM ĐẦU & SAU 3 NĂM)")
    .setFontWeight("bold").setFontSize(14).setBackground("#d97706").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = [
    "Mã máy", "Tên máy móc", "Nguyên giá đầu tư (₫)", "Thời gian hòa vốn chính (Năm)", 
    "Sản lượng dự kiến/năm", "Đơn vị tính", "Tổng sản lượng hòa vốn (3 năm)", 
    "PHỤ PHÍ 3 NĂM ĐẦU (Khấu hao cao)", "Tỷ lệ giảm sau 3 năm", "PHỤ PHÍ SAU 3 NĂM (Khấu hao giảm)", "Ghi chú tài chính"
  ];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#fef3c7");

  var machines = [
    [
      "MACH-KONICA", "Máy in Konica C4000", 150000000, 3, 20000, "Click", 
      "=D3*E3", "=C3/G3", 0.80, "=H3*(1-I3)", "3 năm đầu thu hồi 100% vốn; sau 3 năm chỉ trích 20% phụ phí để bảo trì"
    ],
    [
      "MACH-UVDTF", "Máy in UV-DTF 60cm", 200000000, 3, 15000, "Mét", 
      "=D4*E4", "=C4/G4", 0.80, "=H4*(1-I4)", "3 năm đầu thu hồi 100% vốn; sau 3 năm phụ phí giảm 80%"
    ],
    [
      "MACH-EMB-12", "Máy thêu vi tính 12 đầu", 360000000, 3, 18000, "Cái", 
      "=D5*E5", "=C5/G5", 0.75, "=H5*(1-I5)", "3 năm đầu thu hồi vốn; sau 3 năm phụ phí giảm 75%"
    ]
  ];

  sheet.getRange(3, 1, machines.length, headers.length).setValues(machines);

  sheet.getRange("C3:C5").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("D3:D5").setNumberFormat("0\" Năm\"");
  sheet.getRange("E3:E5").setNumberFormat("#,##0");
  sheet.getRange("G3:G5").setNumberFormat("#,##0");
  sheet.getRange("H3:H5").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#fee2e2");
  sheet.getRange("I3:I5").setNumberFormat("0.0%");
  sheet.getRange("J3:J5").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#dcfce7");

  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 170);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 140);
  sheet.setColumnWidth(8, 170);
  sheet.setColumnWidth(9, 140);
  sheet.setColumnWidth(10, 170);
  sheet.setColumnWidth(11, 280);
}

// -----------------------------------------------------------------------------
// TAB 4: BẢNG GIÁ NGUYÊN VẬT LIỆU
// -----------------------------------------------------------------------------
function setupSheetGiaNVL(sheet) {
  sheet.setTabColor("#3b82f6");

  sheet.getRange("A1:H1").merge().setValue("DANH MỤC NGUYÊN VẬT LIỆU & ĐƠN GIÁ QUY ĐỔI")
    .setFontWeight("bold").setFontSize(14).setBackground("#2563eb").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = ["Mã NVL", "Tên nguyên vật liệu", "Nhà cung cấp", "Quy cách sỉ", "Đơn giá sỉ (₫)", "ĐVT Sỉ", "Số lượng quy đổi", "Đơn giá lẻ BOM (₫)"];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#dbeafe");

  var materials = [
    ["NVL-DECAL-SUA-AN", "Decal sữa mờ An Nam", "An Nam", "Xấp 100 tờ A3+", 600000, "Xấp", 100, "=E3/G3"],
    ["NVL-DECAL-SUA-TK", "Decal Sữa Mờ ThaiKK", "ThaiKK", "Xấp 100 tờ A3+", 282600, "Xấp", 100, "=E4/G4"],
    ["NVL-DECAL-TRONG-TK", "Decal Trong ThaiKK", "ThaiKK", "Xấp 100 tờ A3+", 270900, "Xấp", 100, "=E5/G5"],
    ["NVL-DECAL-BAC-TK", "Decal Bạc Bóng ThaiKK", "ThaiKK", "Xấp 100 tờ 33x35", 231300, "Xấp", 100, "=E6/G6"],
    ["NVL-DECAL-KRAFT-TK", "Decal Kraft ThaiKK", "ThaiKK", "Xấp 100 tờ 33x35", 114500, "Xấp", 100, "=E7/G7"],
    ["NVL-MANG-OPAM", "Màng Nguội Mờ OPAM", "OPAM", "Cuộn 48m", 105000, "Cuộn", 48, "=E8/G8"],
    ["NVL-PET-A-UVDTF", "Màng A (pet in UV-DTF)", "UV Supplier", "Cuộn 50m", 722300, "Cuộn", 50, "=E9/G9"],
    ["NVL-PET-B-UVDTF", "Màng B (cán định hình UV-DTF)", "UV Supplier", "Cuộn 50m", 722300, "Cuộn", 50, "=E10/G10"],
    ["NVL-GIAY-C300-A3", "Giấy C300gsm A3", "Bảo Long", "Ram 500 tờ", 450000, "Ram", 500, "=E11/G11"],
    ["NVL-GIAY-IVORY-300", "Giấy Ivory 300gsm (Hộp)", "Bảo Long", "Ram 500 tờ", 470000, "Ram", 500, "=E12/G12"],
    ["NVL-PHOI-HOODIE", "Phôi áo hoodie nỉ bông 380gsm", "Xưởng dệt", "Cái lẻ", 110000, "Cái", 1, "=E13/G13"],
    ["NVL-CHI-THEU", "Chỉ thêu polyester màu", "Phong Phú", "Cuộn nhỏ", 15000, "Cuộn", 1, "=E14/G14"],
    ["NVL-DUNG-LOT", "Dựng giấy lót thêu & vải lót xé", "Bảo An", "Cuộn 100m2", 2000000, "Cuộn", 100, "=E15/G15"]
  ];

  sheet.getRange(3, 1, materials.length, headers.length).setValues(materials);
  sheet.getRange("E3:E15").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("G3:G15").setNumberFormat("#,##0");
  sheet.getRange("H3:H15").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold");

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 150);
}

// -----------------------------------------------------------------------------
// TAB 5: ĐỊNH MỨC BOM & 2 BIỂU GIÁ SẢN PHẨM (TRƯỚC & SAU 3 NĂM)
// -----------------------------------------------------------------------------
function setupSheetBOM(sheet) {
  sheet.setTabColor("#8b5cf6");

  sheet.getRange("A1:Q1").merge().setValue("ĐỊNH MỨC BOM CHI TIẾT & BIỂU GIÁ 2 GIAI ĐOẠN (3 NĂM ĐẦU & SAU 3 NĂM)")
    .setFontWeight("bold").setFontSize(14).setBackground("#7c3aed").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = [
    "Mã SKU", "Tên sản phẩm", "Biến thể / Size", "Nhà máy", 
    "Chi phí NVL (₫)", "Giờ Designer (h)", "Giờ Sản xuất (h)", "Giờ QC (h)", "Chi phí Nhân công (₫)", 
    "Chi phí Điện (₫)", "Chi phí Quản lý chung (₫)", "Máy móc khấu hao", "Hệ số tiêu hao máy",
    "GIÁ VỐN 3 NĂM ĐẦU", "GIÁ BÁN SELLER 3 NĂM ĐẦU",
    "GIÁ VỐN SAU 3 NĂM (Khấu hao giảm)", "GIÁ BÁN SELLER SAU 3 NĂM"
  ];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#ede9fe");

  // Các công thức tự động lấy đơn giá nhân công, nguyên vật liệu và khấu hao
  var products = [
    [
      "ST-AN-SUA-2IN", "Sticker Decal An Nam Sữa Mờ (2 inch)", "2 inches (40 cái/tờ)", "In",
      "=0.025*'4_GIA_NVL'!$H$3 + 0.025*1200", 0.005, 0.03, 0.01,
      "=F3*'2_NHAN_SU_LUONG'!$L$3 + G3*'2_NHAN_SU_LUONG'!$L$4 + H3*'2_NHAN_SU_LUONG'!$L$5",
      "=1.5 * 0.05 * '1_CAU_HINH'!$B$5",
      "=(E3+I3+J3)*'1_CAU_HINH'!$B$3",
      "MACH-KONICA", 0.025,
      "=E3+I3+J3+K3 + M3*XLOOKUP(L3, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$H:$H)",
      "=N3*(1+'1_CAU_HINH'!$B$4)",
      "=E3+I3+J3+K3 + M3*XLOOKUP(L3, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$J:$J)",
      "=P3*(1+'1_CAU_HINH'!$B$4)"
    ],
    [
      "ST-TK-SUA-2IN", "Sticker Decal ThaiKK Sữa Mờ (2 inch)", "2 inches (40 cái/tờ)", "In",
      "=0.025*'4_GIA_NVL'!$H$4 + 0.025*1200 + 0.012*'4_GIA_NVL'!$H$8", 0.005, 0.05, 0.015,
      "=F4*'2_NHAN_SU_LUONG'!$L$3 + G4*'2_NHAN_SU_LUONG'!$L$4 + H4*'2_NHAN_SU_LUONG'!$L$5",
      "=1.8 * 0.06 * '1_CAU_HINH'!$B$5",
      "=(E4+I4+J4)*'1_CAU_HINH'!$B$3",
      "MACH-KONICA", 0.025,
      "=E4+I4+J4+K4 + M4*XLOOKUP(L4, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$H:$H)",
      "=N4*(1+'1_CAU_HINH'!$B$4)",
      "=E4+I4+J4+K4 + M4*XLOOKUP(L4, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$J:$J)",
      "=P4*(1+'1_CAU_HINH'!$B$4)"
    ],
    [
      "ST-UV-DTF-2IN", "Sticker UV-DTF (2 inch)", "2 inches (84 cái/mét)", "In",
      "=0.0119*'4_GIA_NVL'!$H$9 + 0.0119*'4_GIA_NVL'!$H$10 + 0.0119*15000", 0.01, 0.08, 0.02,
      "=F5*'2_NHAN_SU_LUONG'!$L$3 + G5*'2_NHAN_SU_LUONG'!$L$4 + H5*'2_NHAN_SU_LUONG'!$L$5",
      "=3.0 * 0.12 * '1_CAU_HINH'!$B$5",
      "=(E5+I5+J5)*'1_CAU_HINH'!$B$3",
      "MACH-UVDTF", 0.0119,
      "=E5+I5+J5+K5 + M5*XLOOKUP(L5, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$H:$H)",
      "=N5*(1+'1_CAU_HINH'!$B$4)",
      "=E5+I5+J5+K5 + M5*XLOOKUP(L5, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$J:$J)",
      "=P5*(1+'1_CAU_HINH'!$B$4)"
    ],
    [
      "PC-PAPER-01", "Bộ bài Playing Cards (Hộp giấy)", "54 lá + Hộp", "In",
      "=3*'4_GIA_NVL'!$H$11 + 6*600 + 0.25*'4_GIA_NVL'!$H$12 + 0.25*1200", 0.02, 0.15, 0.05,
      "=F6*'2_NHAN_SU_LUONG'!$L$3 + G6*'2_NHAN_SU_LUONG'!$L$4 + H6*'2_NHAN_SU_LUONG'!$L$5",
      "=2.5 * 0.2 * '1_CAU_HINH'!$B$5",
      "=(E6+I6+J6)*'1_CAU_HINH'!$B$3",
      "MACH-KONICA", 3.25,
      "=E6+I6+J6+K6 + M6*XLOOKUP(L6, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$H:$H)",
      "=N6*(1+'1_CAU_HINH'!$B$4)",
      "=E6+I6+J6+K6 + M6*XLOOKUP(L6, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$J:$J)",
      "=P6*(1+'1_CAU_HINH'!$B$4)"
    ],
    [
      "HD-EMB-01", "Áo hoodie thêu nổi Signature", "Size tiêu chuẩn", "Thêu",
      "=1*'4_GIA_NVL'!$H$13 + 0.35*'4_GIA_NVL'!$H$14 + 0.2*'4_GIA_NVL'!$H$15", 0.05, 0.30, 0.08,
      "=F7*'2_NHAN_SU_LUONG'!$L$6 + G7*'2_NHAN_SU_LUONG'!$L$8 + H7*'2_NHAN_SU_LUONG'!$L$9",
      "=1.8 * 0.3 * '1_CAU_HINH'!$B$5",
      "=(E7+I7+J7)*'1_CAU_HINH'!$B$3",
      "MACH-EMB-12", 1,
      "=E7+I7+J7+K7 + M7*XLOOKUP(L7, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$H:$H)",
      "=N7*(1+'1_CAU_HINH'!$B$4)",
      "=E7+I7+J7+K7 + M7*XLOOKUP(L7, '3_KHAU_HAO_MAY'!$A:$A, '3_KHAU_HAO_MAY'!$J:$J)",
      "=P7*(1+'1_CAU_HINH'!$B$4)"
    ]
  ];

  sheet.getRange(3, 1, products.length, headers.length).setValues(products);

  sheet.getRange("E3:E7").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("F3:H7").setNumberFormat("0.000");
  sheet.getRange("I3:K7").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("M3:M7").setNumberFormat("0.0000");
  
  // 3 năm đầu
  sheet.getRange("N3:N7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#fee2e2");
  sheet.getRange("O3:O7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#fef3c7");
  // Sau 3 năm
  sheet.getRange("P3:P7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#dcfce7");
  sheet.getRange("Q3:Q7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#bbf7d0");

  sheet.setColumnWidth(1, 130);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 80);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 110);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 130);
  sheet.setColumnWidth(10, 110);
  sheet.setColumnWidth(11, 140);
  sheet.setColumnWidth(12, 120);
  sheet.setColumnWidth(13, 120);
  sheet.setColumnWidth(14, 150);
  sheet.setColumnWidth(15, 170);
  sheet.setColumnWidth(16, 170);
  sheet.setColumnWidth(17, 180);
}

// -----------------------------------------------------------------------------
// TAB 6: DỰ BÁO BÁN HÀNG & NHU CẦU NGUYÊN VẬT LIỆU (MRP)
// -----------------------------------------------------------------------------
function setupSheetMRP(sheet) {
  sheet.setTabColor("#ec4899");

  sheet.getRange("A1:I1").merge().setValue("KẾ HOẠCH BÁN HÀNG THÁNG 7 & DỰ BÁO SẢN XUẤT THÁNG 8")
    .setFontWeight("bold").setFontSize(14).setBackground("#db2777").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = [
    "Mã SKU", "Tên sản phẩm", "Sản lượng bán Tháng 7 (Thực tế)", "Dự báo bán Tháng 8 (+10%)",
    "Tồn kho hiện tại", "Tồn an toàn", "Nhu cầu sản xuất Tháng 8", 
    "Doanh thu dự kiến T8 (3 năm đầu)", "Doanh thu dự kiến T8 (Sau 3 năm)"
  ];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#fce7f3");

  var forecastData = [
    ["ST-AN-SUA-2IN", "Sticker Decal An Nam Sữa Mờ (2 inch)", 2700, "=C3*1.1", 500, 800, "=MAX(0, D3+F3-E3)", "=D3*XLOOKUP(A3, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$O:$O)", "=D3*XLOOKUP(A3, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$Q:$Q)"],
    ["ST-TK-SUA-2IN", "Sticker Decal ThaiKK Sữa Mờ (2 inch)", 2400, "=C4*1.1", 300, 600, "=MAX(0, D4+F4-E4)", "=D4*XLOOKUP(A4, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$O:$O)", "=D4*XLOOKUP(A4, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$Q:$Q)"],
    ["ST-UV-DTF-2IN", "Sticker UV-DTF (2 inch)", 3500, "=C5*1.1", 400, 700, "=MAX(0, D5+F5-E5)", "=D5*XLOOKUP(A5, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$O:$O)", "=D5*XLOOKUP(A5, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$Q:$Q)"],
    ["PC-PAPER-01", "Bộ bài Playing Cards (Hộp giấy)", 150, "=C6*1.1", 30, 50, "=MAX(0, D6+F6-E6)", "=D6*XLOOKUP(A6, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$O:$O)", "=D6*XLOOKUP(A6, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$Q:$Q)"],
    ["HD-EMB-01", "Áo hoodie thêu nổi Signature", 250, "=C7*1.1", 40, 80, "=MAX(0, D7+F7-E7)", "=D7*XLOOKUP(A7, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$O:$O)", "=D7*XLOOKUP(A7, '5_GIA_THANH_BOM'!$A:$A, '5_GIA_THANH_BOM'!$Q:$Q)"]
  ];

  sheet.getRange(3, 1, forecastData.length, headers.length).setValues(forecastData);
  sheet.getRange("C3:G7").setNumberFormat("#,##0");
  sheet.getRange("H3:I7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold");

  // Dòng Tổng Cộng
  sheet.getRange(8, 1).setValue("TỔNG CỘNG").setFontWeight("bold");
  sheet.getRange(8, 3).setValue("=SUM(C3:C7)").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange(8, 4).setValue("=SUM(D3:D7)").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange(8, 7).setValue("=SUM(G3:G7)").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange(8, 8).setValue("=SUM(H3:H7)").setFontWeight("bold").setNumberFormat("#,##0\" ₫\"").setBackground("#fef3c7");
  sheet.getRange(8, 9).setValue("=SUM(I3:I7)").setFontWeight("bold").setNumberFormat("#,##0\" ₫\"").setBackground("#bbf7d0");

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 230);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 220);
  sheet.setColumnWidth(9, 220);
}
