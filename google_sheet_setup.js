/**
 * =========================================================================================
 * BỘ KHỞI TẠO HỆ THỐNG TÍNH GIÁ THÀNH & DỰ BÁO TỰ ĐỘNG TRÊN GOOGLE SHEETS (BẢN CHUẨN 100%)
 * Khắc phục triệt để lỗi #ERROR! và #VALUE! do lệch dòng và định dạng số thập phân.
 * 
 * 6 Tabs liên kết tự động:
 * 1. 1_CAU_HINH       : Giờ chuẩn (B3), Overhead (B4), Lợi nhuận (B5), Đơn giá điện (B6), Tiền điện 2 xưởng
 * 2. 2_NHAN_SU_LUONG  : Danh sách nhân viên & Bảng tổng hợp đơn giá giờ công từng khâu (AVERAGEIFS/COUNTIFS)
 * 3. 3_KHAU_HAO_MAY   : Khấu hao máy móc trong 3 năm đầu và sau 3 năm (Khấu hao giảm 80%)
 * 4. 4_GIA_NVL        : Danh mục giá sỉ & Công thức quy đổi giá lẻ nguyên vật liệu
 * 5. 5_GIA_THANH_BOM  : Định mức BOM & 2 Biểu giá song song (3 năm đầu & Sau 3 năm)
 * 6. 6_DU_BAO_MRP     : Nhập doanh số bán Tháng 7, tự tính tiêu hao & đơn hàng mua Tháng 8
 * =========================================================================================
 */

function khoiTaoHeThongTinhGia() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

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
  Browser.msgBox("Thành công!", "Đã cập nhật hệ thống Google Sheets hoàn chỉnh 100%! Không còn lỗi #ERROR! hay #VALUE!.", Browser.Buttons.OK);
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

  var staticData = [
    ["Thông số", "Giá trị", "Đơn vị / Ghi chú"],
    ["Giờ công chuẩn / tháng", 208, "Giờ (26 ngày x 8h)"],
    ["Tỷ lệ chi phí quản lý chung (Overhead)", 0.10, "% tính trên tổng NVL + Nhân công + Điện"],
    ["Biên lợi nhuận đề xuất cho Seller", 0.20, "% lợi nhuận mong muốn"],
    ["Đơn giá điện chuẩn EVN", 3000, "₫/kWh"],
    ["", "", ""],
    ["CHI PHÍ ĐIỆN THEO NHÀ MÁY", "Số tiền (₫/tháng)", "Sản lượng điện tương đương (kWh/tháng)"],
    ["Nhà máy In", 8000000, ""],
    ["Nhà máy Thêu", 11000000, ""]
  ];

  sheet.getRange(2, 1, staticData.length, 3).setValues(staticData);
  sheet.getRange("A2:C2").setFontWeight("bold").setBackground("#e0e7ff");
  sheet.getRange("A8:C8").setFontWeight("bold").setBackground("#e0e7ff");
  sheet.getRange("A9:A10").setFontWeight("bold");

  // Công thức điện
  sheet.getRange("C9").setFormula("=B9/$B$6");
  sheet.getRange("C10").setFormula("=B10/$B$6");

  sheet.getRange("B3").setNumberFormat("#,##0");
  sheet.getRange("B4").setNumberFormat("0.0%");
  sheet.getRange("B5").setNumberFormat("0.0%");
  sheet.getRange("B6").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("B9:B10").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("C9:C10").setNumberFormat("#,##0\" kWh\"");

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
    ["In", "Designer", "Nhân viên In - Designer A", 12000000],
    ["In", "Designer", "Nhân viên In - Designer B", 12000000],
    ["In", "Designer", "Nhân viên In - Designer C", 12000000],
    ["In", "Designer", "Nhân viên In - Designer D", 12000000],
    ["In", "Designer", "Nhân viên In - Designer E", 12000000],
    ["In", "Designer", "Nhân viên In - Designer F", 12000000],
    ["In", "Designer", "Nhân viên In - Designer G", 12000000],
    ["In", "Sản xuất", "Nhân viên In - Sản xuất A", 9000000],
    ["In", "Sản xuất", "Nhân viên In - Sản xuất B", 9000000],
    ["In", "Sản xuất", "Nhân viên In - Sản xuất C", 9000000],
    ["In", "QC", "Nhân viên In - QC A", 8500000],
    ["In", "QC", "Nhân viên In - QC B", 8500000],

    ["Thêu", "Designer", "Nhân viên Thêu - Designer A", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer B", 13000000],
    ["Thêu", "Laser", "Nhân viên Thêu - Laser A", 9500000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành A", 9000000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành B", 9000000],
    ["Thêu", "QC", "Nhân viên Thêu - QC A", 8500000],
    ["Thêu", "QC", "Nhân viên Thêu - QC B", 8500000]
  ];

  sheet.getRange(3, 1, employees.length, 4).setValues(employees);

  for (var i = 3; i <= employees.length + 2; i++) {
    sheet.getRange("E" + i).setFormula("='1_CAU_HINH'!$B$3");
    sheet.getRange("F" + i).setFormula("=D" + i + "/E" + i);
  }

  sheet.getRange("D3:D" + (employees.length + 2)).setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("E3:E" + (employees.length + 2)).setNumberFormat("#,##0");
  sheet.getRange("F3:F" + (employees.length + 2)).setNumberFormat("#,##0\" ₫/h\"");

  // Bảng tổng hợp đơn giá giờ công tự động theo từng khâu (Dùng cho BOM)
  sheet.getRange("H1:L1").merge().setValue("BẢNG TỔNG HỢP ĐƠN GIÁ GIỜ CÔNG BÌNH QUÂN TỪNG KHÂU")
    .setFontWeight("bold").setFontSize(12).setBackground("#047857").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var summaryHeaders = ["Nhà máy", "Khâu sản xuất", "Số lượng nhân sự", "Tổng quỹ lương (₫)", "Đơn giá giờ công BQ (₫/h)"];
  sheet.getRange(2, 8, 1, summaryHeaders.length).setValues([summaryHeaders]).setFontWeight("bold").setBackground("#a7f3d0");

  var summaryMeta = [
    ["In", "Designer"],
    ["In", "Sản xuất"],
    ["In", "QC"],
    ["Thêu", "Designer"],
    ["Thêu", "Laser"],
    ["Thêu", "Sản xuất"],
    ["Thêu", "QC"]
  ];

  sheet.getRange(3, 8, summaryMeta.length, 2).setValues(summaryMeta);

  for (var j = 3; j <= 9; j++) {
    sheet.getRange("J" + j).setFormula("=COUNTIFS(A:A, H" + j + ", B:B, I" + j + ")");
    sheet.getRange("K" + j).setFormula("=SUMIFS(D:D, A:A, H" + j + ", B:B, I" + j + ")");
    sheet.getRange("L" + j).setFormula("=IF(J" + j + ">0, K" + j + "/(J" + j + "*'1_CAU_HINH'!$B$3), 0)");
  }

  sheet.getRange("J3:J9").setNumberFormat("#,##0");
  sheet.getRange("K3:K9").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("L3:L9").setNumberFormat("#,##0\" ₫/h\"").setFontWeight("bold");

  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 220);
  sheet.setColumnWidth(4, 140);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 30);
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

  var machineStatic = [
    ["MACH-KONICA", "Máy in Konica C4000", 150000000, 3, 20000, "Click", "", "", 0.80, "", "3 năm đầu thu hồi 100% vốn; sau 3 năm chỉ trích 20% phụ phí để bảo trì"],
    ["MACH-UVDTF", "Máy in UV-DTF 60cm", 200000000, 3, 15000, "Mét", "", "", 0.80, "", "3 năm đầu thu hồi 100% vốn; sau 3 năm phụ phí giảm 80%"],
    ["MACH-EMB-12", "Máy thêu vi tính 12 đầu", 360000000, 3, 18000, "Cái", "", "", 0.75, "", "3 năm đầu thu hồi vốn; sau 3 năm phụ phí giảm 75%"]
  ];

  sheet.getRange(3, 1, machineStatic.length, headers.length).setValues(machineStatic);

  for (var i = 3; i <= 5; i++) {
    sheet.getRange("G" + i).setFormula("=D" + i + "*E" + i);
    sheet.getRange("H" + i).setFormula("=C" + i + "/G" + i);
    sheet.getRange("J" + i).setFormula("=H" + i + "*(1-I" + i + ")");
  }

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
    ["NVL-DECAL-SUA-AN", "Decal sữa mờ An Nam", "An Nam", "Xấp 100 tờ A3+", 600000, "Xấp", 100],
    ["NVL-DECAL-SUA-TK", "Decal Sữa Mờ ThaiKK", "ThaiKK", "Xấp 100 tờ A3+", 282600, "Xấp", 100],
    ["NVL-DECAL-TRONG-TK", "Decal Trong ThaiKK", "ThaiKK", "Xấp 100 tờ A3+", 270900, "Xấp", 100],
    ["NVL-DECAL-BAC-TK", "Decal Bạc Bóng ThaiKK", "ThaiKK", "Xấp 100 tờ 33x35", 231300, "Xấp", 100],
    ["NVL-DECAL-KRAFT-TK", "Decal Kraft ThaiKK", "ThaiKK", "Xấp 100 tờ 33x35", 114500, "Xấp", 100],
    ["NVL-MANG-OPAM", "Màng Nguội Mờ OPAM", "OPAM", "Cuộn 48m", 105000, "Cuộn", 48],
    ["NVL-PET-A-UVDTF", "Màng A (pet in UV-DTF)", "UV Supplier", "Cuộn 50m", 722300, "Cuộn", 50],
    ["NVL-PET-B-UVDTF", "Màng B (cán định hình UV-DTF)", "UV Supplier", "Cuộn 50m", 722300, "Cuộn", 50],
    ["NVL-GIAY-C300-A3", "Giấy C300gsm A3", "Bảo Long", "Ram 500 tờ", 450000, "Ram", 500],
    ["NVL-GIAY-IVORY-300", "Giấy Ivory 300gsm (Hộp)", "Bảo Long", "Ram 500 tờ", 470000, "Ram", 500],
    ["NVL-PHOI-HOODIE", "Phôi áo hoodie nỉ bông 380gsm", "Xưởng dệt", "Cái lẻ", 110000, "Cái", 1],
    ["NVL-CHI-THEU", "Chỉ thêu polyester màu", "Phong Phú", "Cuộn nhỏ", 15000, "Cuộn", 1],
    ["NVL-DUNG-LOT", "Dựng giấy lót thêu & vải lót xé", "Bảo An", "Cuộn 100m2", 2000000, "Cuộn", 100]
  ];

  sheet.getRange(3, 1, materials.length, 7).setValues(materials);

  for (var i = 3; i <= 15; i++) {
    sheet.getRange("H" + i).setFormula("=E" + i + "/G" + i);
  }

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

  var productsStatic = [
    ["ST-AN-SUA-2IN", "Sticker Decal An Nam Sữa Mờ (2 inch)", "2 inches (40 cái/tờ)", "In", "", 0.005, 0.030, 0.010, "", "", "", "MACH-KONICA", 0.025, "", "", "", ""],
    ["ST-TK-SUA-2IN", "Sticker Decal ThaiKK Sữa Mờ (2 inch)", "2 inches (40 cái/tờ)", "In", "", 0.005, 0.050, 0.015, "", "", "", "MACH-KONICA", 0.025, "", "", "", ""],
    ["ST-UV-DTF-2IN", "Sticker UV-DTF (2 inch)", "2 inches (84 cái/mét)", "In", "", 0.010, 0.080, 0.020, "", "", "", "MACH-UVDTF", 0.0119, "", "", "", ""],
    ["PC-PAPER-01", "Bộ bài Playing Cards (Hộp giấy)", "54 lá + Hộp", "In", "", 0.020, 0.150, 0.050, "", "", "", "MACH-KONICA", 3.250, "", "", "", ""],
    ["HD-EMB-01", "Áo hoodie thêu nổi Signature", "Size tiêu chuẩn", "Thêu", "", 0.050, 0.300, 0.080, "", "", "", "MACH-EMB-12", 1.000, "", "", "", ""]
  ];

  sheet.getRange(3, 1, productsStatic.length, headers.length).setValues(productsStatic);

  // Set formulas individually to avoid any syntax / locale issues
  // Product 1: Sticker An Nam 2 inch
  sheet.getRange("E3").setFormula("=(1/40)*'4_GIA_NVL'!$H$3 + (1/40)*1200");
  sheet.getRange("I3").setFormula("=F3*'2_NHAN_SU_LUONG'!$L$3 + G3*'2_NHAN_SU_LUONG'!$L$4 + H3*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J3").setFormula("=1.5 * 0.05 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K3").setFormula("=(E3+I3+J3)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N3").setFormula("=E3+I3+J3+K3 + M3*VLOOKUP(L3, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O3").setFormula("=N3*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P3").setFormula("=E3+I3+J3+K3 + M3*VLOOKUP(L3, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q3").setFormula("=P3*(1+'1_CAU_HINH'!$B$5)");

  // Product 2: Sticker ThaiKK 2 inch
  sheet.getRange("E4").setFormula("=(1/40)*'4_GIA_NVL'!$H$4 + (1/40)*1200 + 0.012*'4_GIA_NVL'!$H$8");
  sheet.getRange("I4").setFormula("=F4*'2_NHAN_SU_LUONG'!$L$3 + G4*'2_NHAN_SU_LUONG'!$L$4 + H4*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J4").setFormula("=1.8 * 0.06 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K4").setFormula("=(E4+I4+J4)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N4").setFormula("=E4+I4+J4+K4 + M4*VLOOKUP(L4, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O4").setFormula("=N4*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P4").setFormula("=E4+I4+J4+K4 + M4*VLOOKUP(L4, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q4").setFormula("=P4*(1+'1_CAU_HINH'!$B$5)");

  // Product 3: UV-DTF 2 inch
  sheet.getRange("E5").setFormula("=(1/84)*'4_GIA_NVL'!$H$9 + (1/84)*'4_GIA_NVL'!$H$10 + (1/84)*15000");
  sheet.getRange("I5").setFormula("=F5*'2_NHAN_SU_LUONG'!$L$3 + G5*'2_NHAN_SU_LUONG'!$L$4 + H5*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J5").setFormula("=3.0 * 0.12 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K5").setFormula("=(E5+I5+J5)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N5").setFormula("=E5+I5+J5+K5 + M5*VLOOKUP(L5, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O5").setFormula("=N5*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P5").setFormula("=E5+I5+J5+K5 + M5*VLOOKUP(L5, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q5").setFormula("=P5*(1+'1_CAU_HINH'!$B$5)");

  // Product 4: Playing Cards
  sheet.getRange("E6").setFormula("=3*'4_GIA_NVL'!$H$11 + 6*600 + 0.25*'4_GIA_NVL'!$H$12 + 0.25*1200");
  sheet.getRange("I6").setFormula("=F6*'2_NHAN_SU_LUONG'!$L$3 + G6*'2_NHAN_SU_LUONG'!$L$4 + H6*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J6").setFormula("=2.5 * 0.20 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K6").setFormula("=(E6+I6+J6)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N6").setFormula("=E6+I6+J6+K6 + M6*VLOOKUP(L6, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O6").setFormula("=N6*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P6").setFormula("=E6+I6+J6+K6 + M6*VLOOKUP(L6, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q6").setFormula("=P6*(1+'1_CAU_HINH'!$B$5)");

  // Product 5: Hoodie
  sheet.getRange("E7").setFormula("=1*'4_GIA_NVL'!$H$13 + 0.35*'4_GIA_NVL'!$H$14 + 0.2*'4_GIA_NVL'!$H$15");
  sheet.getRange("I7").setFormula("=F7*'2_NHAN_SU_LUONG'!$L$6 + G7*'2_NHAN_SU_LUONG'!$L$8 + H7*'2_NHAN_SU_LUONG'!$L$9");
  sheet.getRange("J7").setFormula("=1.8 * 0.30 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K7").setFormula("=(E7+I7+J7)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N7").setFormula("=E7+I7+J7+K7 + M7*VLOOKUP(L7, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O7").setFormula("=N7*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P7").setFormula("=E7+I7+J7+K7 + M7*VLOOKUP(L7, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q7").setFormula("=P7*(1+'1_CAU_HINH'!$B$5)");

  sheet.getRange("E3:E7").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("F3:H7").setNumberFormat("0.000");
  sheet.getRange("I3:K7").setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("M3:M7").setNumberFormat("0.0000");
  sheet.getRange("N3:N7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#fee2e2");
  sheet.getRange("O3:O7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#fef3c7");
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

  var forecastStatic = [
    ["ST-AN-SUA-2IN", "Sticker Decal An Nam Sữa Mờ (2 inch)", 2700, "", 500, 800, "", "", ""],
    ["ST-TK-SUA-2IN", "Sticker Decal ThaiKK Sữa Mờ (2 inch)", 2400, "", 300, 600, "", "", ""],
    ["ST-UV-DTF-2IN", "Sticker UV-DTF (2 inch)", 3500, "", 400, 700, "", "", ""],
    ["PC-PAPER-01", "Bộ bài Playing Cards (Hộp giấy)", 150, "", 30, 50, "", "", ""],
    ["HD-EMB-01", "Áo hoodie thêu nổi Signature", 250, "", 40, 80, "", "", ""]
  ];

  sheet.getRange(3, 1, forecastStatic.length, headers.length).setValues(forecastStatic);

  // Set formulas individually
  for (var i = 3; i <= 7; i++) {
    sheet.getRange("D" + i).setFormula("=C" + i + "*110/100");
    sheet.getRange("G" + i).setFormula("=MAX(0, D" + i + "+F" + i + "-E" + i + ")");
    sheet.getRange("H" + i).setFormula("=D" + i + "*VLOOKUP(A" + i + ", '5_GIA_THANH_BOM'!$A$3:$Q$7, 15, FALSE)");
    sheet.getRange("I" + i).setFormula("=D" + i + "*VLOOKUP(A" + i + ", '5_GIA_THANH_BOM'!$A$3:$Q$7, 17, FALSE)");
  }

  sheet.getRange("C3:G7").setNumberFormat("#,##0");
  sheet.getRange("H3:I7").setNumberFormat("#,##0\" ₫\"").setFontWeight("bold");

  // Dòng Tổng Cộng
  sheet.getRange(8, 1).setValue("TỔNG CỘNG").setFontWeight("bold");
  sheet.getRange("C8").setFormula("=SUM(C3:C7)").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange("D8").setFormula("=SUM(D3:D7)").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange("G8").setFormula("=SUM(G3:G7)").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange("H8").setFormula("=SUM(H3:H7)").setFontWeight("bold").setNumberFormat("#,##0\" ₫\"").setBackground("#fef3c7");
  sheet.getRange("I8").setFormula("=SUM(I3:I7)").setFontWeight("bold").setNumberFormat("#,##0\" ₫\"").setBackground("#bbf7d0");

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
