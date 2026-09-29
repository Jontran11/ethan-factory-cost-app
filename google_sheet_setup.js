/**
 * =========================================================================================
 * BỘ KHỞI TẠO TOÀN DIỆN: ĐƯA TOÀN BỘ DỮ LIỆU ĐÃ UPLOAD QUA GOOGLE SHEETS
 * Bao gồm:
 * 1. 1_CAU_HINH       : Giờ chuẩn 208h, Overhead 10%, Lợi nhuận 20%, Tiền điện In/Thêu
 * 2. 2_NHAN_SU_LUONG  : Đầy đủ 44 nhân sự (7 Designer In, 21 Designer Thêu, Laser, SX, QC)
 * 3. 3_KHAU_HAO_MAY   : Khấu hao 3 máy lớn (Konica C4000, UV-DTF 60cm, Máy thêu 12 đầu)
 * 4. 4_GIA_NVL        : 17 nguyên vật liệu chuẩn theo NCC (ThaiKK, An Nam, Hoàng Kim Phát, SBC, An Nhân)
 * 5. 5_QUY_CACH_KHO   : Bảng định mức xếp khổ Sticker 1.5"-5", Skin Card, UV-DTF, Bài, Hộp, Lịch
 * 6. 6_GIA_THANH_BOM  : Định mức BOM & 2 Biểu giá song song (3 năm đầu & Sau 3 năm) cho tất cả sản phẩm
 * 7. 7_DU_BAO_MRP     : Sản lượng bán & Kế hoạch mua hàng MRP
 * =========================================================================================
 */

function khoiTaoHeThongTinhGia() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheetCauHinh = getOrCreateSheet(ss, "1_CAU_HINH");
  var sheetNhanSu = getOrCreateSheet(ss, "2_NHAN_SU_LUONG");
  var sheetKhauHao = getOrCreateSheet(ss, "3_KHAU_HAO_MAY");
  var sheetNVL = getOrCreateSheet(ss, "4_GIA_NVL");
  var sheetQuyCach = getOrCreateSheet(ss, "5_QUY_CACH_KHO");
  var sheetBOM = getOrCreateSheet(ss, "6_GIA_THANH_BOM");
  var sheetMRP = getOrCreateSheet(ss, "7_DU_BAO_MRP");

  setupSheetCauHinh(sheetCauHinh);
  setupSheetNhanSu(sheetNhanSu);
  setupSheetKhauHao(sheetKhauHao);
  setupSheetGiaNVL(sheetNVL);
  setupSheetQuyCach(sheetQuyCach);
  setupSheetBOM(sheetBOM);
  setupSheetMRP(sheetMRP);

  SpreadsheetApp.flush();
  Browser.msgBox("Thành công!", "Đã chuyển toàn bộ 100% dữ liệu bạn đã upload sang Google Sheets kèm đầy đủ các hàm động!", Browser.Buttons.OK);
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
// TAB 2: NHÂN SỰ & BẢNG LƯƠNG (44 NHÂN SỰ)
// -----------------------------------------------------------------------------
function setupSheetNhanSu(sheet) {
  sheet.setTabColor("#10b981");

  sheet.getRange("A1:F1").merge().setValue("DANH SÁCH TOÀN BỘ 44 NHÂN SỰ CHI TIẾT THEO TỪNG KHÂU")
    .setFontWeight("bold").setFontSize(14).setBackground("#059669").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = ["Nhà máy", "Khâu sản xuất", "Tên nhân sự", "Lương tháng (₫)", "Giờ chuẩn/tháng", "Đơn giá giờ công (₫/h)"];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#d1fae5");

  var employees = [
    // Xưởng In
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

    // Xưởng Thêu
    ["Thêu", "Designer", "Nhân viên Thêu - Designer A", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer B", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer C", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer D", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer E", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer F", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer G", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer H", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer I", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer J", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer K", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer L", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer M", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer N", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer O", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer P", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer Q", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer R", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer S", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer T", 13000000],
    ["Thêu", "Designer", "Nhân viên Thêu - Designer U", 13000000],
    ["Thêu", "Laser", "Nhân viên Thêu - Laser A", 9500000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành A", 9000000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành B", 9000000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành C", 9000000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành D", 9000000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành E", 9000000],
    ["Thêu", "Sản xuất", "Nhân viên Thêu - Vận hành F", 9000000],
    ["Thêu", "QC", "Nhân viên Thêu - QC A", 8500000],
    ["Thêu", "QC", "Nhân viên Thêu - QC B", 8500000],
    ["Thêu", "QC", "Nhân viên Thêu - QC C", 8500000],
    ["Thêu", "QC", "Nhân viên Thêu - QC D", 8500000]
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
// TAB 4: BẢNG GIÁ 17 NGUYÊN VẬT LIỆU CHUẨN TỪ NHÀ CUNG CẤP
// -----------------------------------------------------------------------------
function setupSheetGiaNVL(sheet) {
  sheet.setTabColor("#3b82f6");

  sheet.getRange("A1:H1").merge().setValue("DANH MỤC 17 NGUYÊN VẬT LIỆU CHUẨN TỪ CÁC NHÀ CUNG CẤP")
    .setFontWeight("bold").setFontSize(14).setBackground("#2563eb").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = ["Mã NVL", "Tên nguyên vật liệu", "Nhà cung cấp", "Quy cách sỉ", "Đơn giá sỉ (₫)", "ĐVT Sỉ", "Số lượng quy đổi", "Đơn giá lẻ BOM (₫)"];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#dbeafe");

  var materials = [
    // Giấy
    ["NVL-GIAY-C300-A3", "Giấy Coucher A3 300gsm", "Hoàng Kim Phát", "Ram 500 tờ", 450000, "Ram", 500],
    ["NVL-GIAY-C250-A3", "Giấy Coucher A3 250gsm", "Hoàng Kim Phát", "Ram 500 tờ", 396000, "Ram", 500],
    ["NVL-GIAY-C300-A4", "Giấy Coucher A4 300gsm", "Hoàng Kim Phát", "Ram 500 tờ", 230000, "Ram", 500],
    ["NVL-GIAY-IVORY-300", "Giấy Irovy 33x48cm 300gsm", "Hoàng Kim Phát", "Ram 500 tờ", 470000, "Ram", 500],

    // Decal
    ["NVL-DECAL-SUA-TK", "Decal Sữa Mờ ThaiKK 33x48cm", "ThaiKK", "Thùng 5000 tờ", 14130072, "Thùng", 5000],
    ["NVL-DECAL-TRONG-TK", "Decal Trong ThaiKK 33x48cm", "ThaiKK", "Thùng 2000 tờ", 5417280, "Thùng", 2000],
    ["NVL-DECAL-BAC-TK", "Decal Bạc Bóng ThaiKK 33x35.4cm", "ThaiKK", "Thùng 2000 tờ", 4626000, "Thùng", 2000],
    ["NVL-DECAL-KRAFT-TK", "Decal Kraft ThaiKK 33x35.4cm", "ThaiKK", "Thùng 2000 tờ", 2290000, "Thùng", 2000],
    ["NVL-DECAL-SUA-AN", "Decal Sữa Mờ An Nam 33x48cm", "An Nam", "Thùng 3000 tờ", 18000000, "Thùng", 3000],
    ["NVL-DECAL-TRONG-AN", "Decal Trong An Nam 33x48cm", "An Nam", "Thùng 3000 tờ", 18000000, "Thùng", 3000],

    // UV-DTF
    ["NVL-PET-A-UVDTF", "Màng A (pet in UV-DTF)", "SBC", "Cuộn 100m", 1444600, "Cuộn", 100],
    ["NVL-PET-B-UVDTF", "Màng B (cán định hình UV-DTF)", "SBC", "Cuộn 100m", 1444600, "Cuộn", 100],

    // Màng cán
    ["NVL-MANG-NHIET-BONG", "Màng Nhiệt Bóng 20MIC", "An Nhân", "Cuộn 1500m", 980000, "Cuộn", 1500],
    ["NVL-MANG-NHIET-MO", "Màng Nhiệt Mờ 20MIC", "An Nhân", "Cuộn 1500m", 1020000, "Cuộn", 1500],
    ["NVL-MANG-NGUOI-OPAT", "Màng Nguội Bóng OPAT", "An Nhân", "Cuộn 500m", 800000, "Cuộn", 500],
    ["NVL-MANG-NGUOI-OPAM", "Màng Nguội Mờ OPAM", "An Nhân", "Cuộn 400m", 800000, "Cuộn", 400],
    ["NVL-MANG-CHONG-XUOC", "Màng Nhiệt Mờ Chống Xước 28MIC", "An Nhân", "Cuộn 1000m", 1500000, "Cuộn", 1000]
  ];

  sheet.getRange(3, 1, materials.length, 7).setValues(materials);

  for (var i = 3; i <= materials.length + 2; i++) {
    sheet.getRange("H" + i).setFormula("=E" + i + "/G" + i);
  }

  sheet.getRange("E3:E" + (materials.length + 2)).setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("G3:G" + (materials.length + 2)).setNumberFormat("#,##0");
  sheet.getRange("H3:H" + (materials.length + 2)).setNumberFormat("#,##0\" ₫\"").setFontWeight("bold");

  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 230);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 150);
}

// -----------------------------------------------------------------------------
// TAB 5: BẢNG QUY CÁCH XẾP KHỔ TỪ SPREADSHEET CỦA BẠN
// -----------------------------------------------------------------------------
function setupSheetQuyCach(sheet) {
  sheet.setTabColor("#06b6d4");

  sheet.getRange("A1:G1").merge().setValue("BẢNG TRA CỨU ĐỊNH MỨC XẾP KHỔ & SỐ LƯỢNG ITEM (TỪ ẢNH BẢNG TÍNH BẠN GỬI)")
    .setFontWeight("bold").setFontSize(14).setBackground("#0891b2").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = ["Sản phẩm", "Biến thể vật liệu", "SL Tờ/Mét", "Kích thước khổ", "Kích thước item", "Số lượng item trên khổ", "Ghi chú xếp file"];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#cffafe");

  var layouts = [
    ["Sticker", "Decal Sữa Mờ", 1, "33x48cm", "1.5 inch", 70, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Sữa Mờ", 1, "33x48cm", "2 inch", 40, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Sữa Mờ", 1, "33x48cm", "3 inch", 20, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Sữa Mờ", 1, "33x48cm", "4 inch", 12, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Sữa Mờ", 1, "33x48cm", "5 inch", 6, "Dựa trên sticker vuông để ra số lượng tối thiểu"],

    ["Sticker", "Decal Trong (Clear)", 1, "33x48cm", "1.5 inch", 70, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Trong (Clear)", 1, "33x48cm", "2 inch", 40, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Trong (Clear)", 1, "33x48cm", "3 inch", 20, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Trong (Clear)", 1, "33x48cm", "4 inch", 12, "Dựa trên sticker vuông để ra số lượng tối thiểu"],
    ["Sticker", "Decal Trong (Clear)", 1, "33x48cm", "5 inch", 6, "Dựa trên sticker vuông để ra số lượng tối thiểu"],

    ["Sticker", "Decal Bạc Bóng", 1, "33x35.4cm", "1.5 inch", 56, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Bạc Bóng", 1, "33x35.4cm", "2 inch", 30, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Bạc Bóng", 1, "33x35.4cm", "3 inch", 16, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Bạc Bóng", 1, "33x35.4cm", "4 inch", 9, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Bạc Bóng", 1, "33x35.4cm", "5 inch", 4, "Khổ 33x35.4cm"],

    ["Sticker", "Decal Kraft", 1, "33x35.4cm", "1.5 inch", 56, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Kraft", 1, "33x35.4cm", "2 inch", 30, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Kraft", 1, "33x35.4cm", "3 inch", 16, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Kraft", 1, "33x35.4cm", "4 inch", 9, "Khổ 33x35.4cm"],
    ["Sticker", "Decal Kraft", 1, "33x35.4cm", "5 inch", 4, "Khổ 33x35.4cm"],

    ["Skin Card", "Decal Sữa Mờ", 1, "33x48cm", "3.35 x 2.12 inch", 21, "Khổ chuẩn dán thẻ ATM/Skin Card"],

    ["UV-DTF", "Màng A + Màng B", 1, "0.62 x 1m", "1.5 inch", 135, "Trừ hao khổ xếp file ngang 55-58cm, dài 90cm"],
    ["UV-DTF", "Màng A + Màng B", 1, "0.62 x 1m", "2 inch", 84, "Trừ hao khổ xếp file ngang 55-58cm, dài 90cm"],
    ["UV-DTF", "Màng A + Màng B", 1, "0.62 x 1m", "3 inch", 45, "Trừ hao khổ xếp file ngang 55-58cm, dài 90cm"],
    ["UV-DTF", "Màng A + Màng B", 1, "0.62 x 1m", "4 inch", 28, "Trừ hao khổ xếp file ngang 55-58cm, dài 90cm"],
    ["UV-DTF", "Màng A + Màng B", 1, "0.62 x 1m", "5 inch", 18, "Trừ hao khổ xếp file ngang 55-58cm, dài 90cm"],

    ["Calendar", "C300gsm", 13, "A4 (21 x 29.7cm)", "A4", 1, "1 quyển 13 tờ A4"],
    ["Playing Cards", "C300gsm", 3, "A3 (29.7 x 42cm)", "Bài tiêu chuẩn", 1, "1 bộ 54 lá bài / 3 tờ A3"],
    ["Hộp Bài Giấy", "Giấy Irovy", 1, "33x48cm", "15.8 x 18cm", 4, "4 hộp trên 1 tờ khổ 33x48cm"]
  ];

  sheet.getRange(3, 1, layouts.length, headers.length).setValues(layouts);
  sheet.getRange("F3:F" + (layouts.length + 2)).setFontWeight("bold").setNumberFormat("#,##0");

  sheet.setColumnWidth(1, 130);
  sheet.setColumnWidth(2, 170);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 140);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 170);
  sheet.setColumnWidth(7, 300);
}

// -----------------------------------------------------------------------------
// TAB 6: ĐỊNH MỨC BOM & 2 BIỂU GIÁ SẢN PHẨM (TRƯỚC & SAU 3 NĂM)
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
    ["ST-AN-SUA-2IN", "Sticker Decal An Nam Sữa Mờ (2 inch)", "2 inch (40 cái/tờ)", "In", "", 0.005, 0.030, 0.010, "", "", "", "MACH-KONICA", 0.025, "", "", "", ""],
    ["ST-TK-SUA-2IN", "Sticker Decal ThaiKK Sữa Mờ (2 inch)", "2 inch (40 cái/tờ)", "In", "", 0.005, 0.050, 0.015, "", "", "", "MACH-KONICA", 0.025, "", "", "", ""],
    ["ST-TK-TRONG-2IN", "Sticker Decal ThaiKK Trong (2 inch)", "2 inch (40 cái/tờ)", "In", "", 0.005, 0.050, 0.015, "", "", "", "MACH-KONICA", 0.025, "", "", "", ""],
    ["ST-TK-BAC-2IN", "Sticker Decal ThaiKK Bạc Bóng (2 inch)", "2 inch (30 cái/tờ)", "In", "", 0.005, 0.050, 0.015, "", "", "", "MACH-KONICA", 0.0333, "", "", "", ""],
    ["ST-SKIN-CARD", "Skin Card Dán Thẻ ATM Decal Sữa", "3.35 x 2.12\" (21 cái/tờ)", "In", "", 0.008, 0.040, 0.012, "", "", "", "MACH-KONICA", 0.0476, "", "", "", ""],
    ["ST-UV-DTF-2IN", "Sticker UV-DTF (2 inch)", "2 inch (84 cái/mét)", "In", "", 0.010, 0.080, 0.020, "", "", "", "MACH-UVDTF", 0.0119, "", "", "", ""],
    ["PC-PAPER-01", "Bộ bài Playing Cards (Hộp giấy)", "54 lá + Hộp", "In", "", 0.020, 0.150, 0.050, "", "", "", "MACH-KONICA", 3.250, "", "", "", ""],
    ["PC-PLASTIC-02", "Bộ bài Playing Cards (Hộp nhựa)", "54 lá + Hộp nhựa", "In", "", 0.020, 0.120, 0.040, "", "", "", "MACH-KONICA", 3.222, "", "", "", ""],
    ["UNO-PAPER-01", "Bộ bài Uno Cards (Hộp giấy gộp)", "108 lá + Hộp", "In", "", 0.030, 0.250, 0.080, "", "", "", "MACH-KONICA", 7.000, "", "", "", ""],
    ["HD-EMB-01", "Áo hoodie thêu nổi Signature", "Size tiêu chuẩn", "Thêu", "", 0.050, 0.300, 0.080, "", "", "", "MACH-EMB-12", 1.000, "", "", "", ""],
    ["CAP-EMB-02", "Mũ lưỡi trai Classic thêu logo 3D", "Size tiêu chuẩn", "Thêu", "", 0.030, 0.200, 0.060, "", "", "", "MACH-EMB-12", 1.000, "", "", "", ""]
  ];

  sheet.getRange(3, 1, productsStatic.length, headers.length).setValues(productsStatic);

  // Set formulas individually
  // 1. Sticker An Nam 2in (40 cái/tờ)
  sheet.getRange("E3").setFormula("=(1/40)*'4_GIA_NVL'!$H$11 + (1/40)*1200");
  sheet.getRange("I3").setFormula("=F3*'2_NHAN_SU_LUONG'!$L$3 + G3*'2_NHAN_SU_LUONG'!$L$4 + H3*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J3").setFormula("=1.5 * 0.05 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K3").setFormula("=(E3+I3+J3)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N3").setFormula("=E3+I3+J3+K3 + M3*VLOOKUP(L3, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O3").setFormula("=N3*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P3").setFormula("=E3+I3+J3+K3 + M3*VLOOKUP(L3, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q3").setFormula("=P3*(1+'1_CAU_HINH'!$B$5)");

  // 2. Sticker ThaiKK Sữa 2in (40 cái/tờ + cán màng)
  sheet.getRange("E4").setFormula("=(1/40)*'4_GIA_NVL'!$H$7 + (1/40)*1200 + (0.48/40)*'4_GIA_NVL'!$H$18");
  sheet.getRange("I4").setFormula("=F4*'2_NHAN_SU_LUONG'!$L$3 + G4*'2_NHAN_SU_LUONG'!$L$4 + H4*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J4").setFormula("=1.8 * 0.06 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K4").setFormula("=(E4+I4+J4)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N4").setFormula("=E4+I4+J4+K4 + M4*VLOOKUP(L4, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O4").setFormula("=N4*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P4").setFormula("=E4+I4+J4+K4 + M4*VLOOKUP(L4, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q4").setFormula("=P4*(1+'1_CAU_HINH'!$B$5)");

  // 3. Sticker ThaiKK Trong 2in (40 cái/tờ)
  sheet.getRange("E5").setFormula("=(1/40)*'4_GIA_NVL'!$H$8 + (1/40)*1200");
  sheet.getRange("I5").setFormula("=F5*'2_NHAN_SU_LUONG'!$L$3 + G5*'2_NHAN_SU_LUONG'!$L$4 + H5*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J5").setFormula("=1.8 * 0.06 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K5").setFormula("=(E5+I5+J5)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N5").setFormula("=E5+I5+J5+K5 + M5*VLOOKUP(L5, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O5").setFormula("=N5*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P5").setFormula("=E5+I5+J5+K5 + M5*VLOOKUP(L5, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q5").setFormula("=P5*(1+'1_CAU_HINH'!$B$5)");

  // 4. Sticker ThaiKK Bạc Bóng 2in (30 cái/tờ)
  sheet.getRange("E6").setFormula("=(1/30)*'4_GIA_NVL'!$H$9 + (1/30)*1200");
  sheet.getRange("I6").setFormula("=F6*'2_NHAN_SU_LUONG'!$L$3 + G6*'2_NHAN_SU_LUONG'!$L$4 + H6*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J6").setFormula("=1.8 * 0.06 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K6").setFormula("=(E6+I6+J6)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N6").setFormula("=E6+I6+J6+K6 + M6*VLOOKUP(L6, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O6").setFormula("=N6*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P6").setFormula("=E6+I6+J6+K6 + M6*VLOOKUP(L6, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q6").setFormula("=P6*(1+'1_CAU_HINH'!$B$5)");

  // 5. Skin Card (21 cái/tờ)
  sheet.getRange("E7").setFormula("=(1/21)*'4_GIA_NVL'!$H$7 + (1/21)*1200 + (0.48/21)*'4_GIA_NVL'!$H$18");
  sheet.getRange("I7").setFormula("=F7*'2_NHAN_SU_LUONG'!$L$3 + G7*'2_NHAN_SU_LUONG'!$L$4 + H7*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J7").setFormula("=1.8 * 0.06 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K7").setFormula("=(E7+I7+J7)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N7").setFormula("=E7+I7+J7+K7 + M7*VLOOKUP(L7, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O7").setFormula("=N7*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P7").setFormula("=E7+I7+J7+K7 + M7*VLOOKUP(L7, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q7").setFormula("=P7*(1+'1_CAU_HINH'!$B$5)");

  // 6. UV-DTF 2in (84 cái/m)
  sheet.getRange("E8").setFormula("=(1/84)*'4_GIA_NVL'!$H$13 + (1/84)*'4_GIA_NVL'!$H$14 + (1/84)*15000");
  sheet.getRange("I8").setFormula("=F8*'2_NHAN_SU_LUONG'!$L$3 + G8*'2_NHAN_SU_LUONG'!$L$4 + H8*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J8").setFormula("=3.0 * 0.12 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K8").setFormula("=(E8+I8+J8)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N8").setFormula("=E8+I8+J8+K8 + M8*VLOOKUP(L8, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O8").setFormula("=N8*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P8").setFormula("=E8+I8+J8+K8 + M8*VLOOKUP(L8, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q8").setFormula("=P8*(1+'1_CAU_HINH'!$B$5)");

  // 7. Playing Cards (Hộp giấy)
  sheet.getRange("E9").setFormula("=3*'4_GIA_NVL'!$H$3 + 12*600 + 6*1008 + 0.25*'4_GIA_NVL'!$H$6 + 0.5*600");
  sheet.getRange("I9").setFormula("=F9*'2_NHAN_SU_LUONG'!$L$3 + G9*'2_NHAN_SU_LUONG'!$L$4 + H9*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J9").setFormula("=2.5 * 0.20 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K9").setFormula("=(E9+I9+J9)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N9").setFormula("=E9+I9+J9+K9 + M9*VLOOKUP(L9, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O9").setFormula("=N9*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P9").setFormula("=E9+I9+J9+K9 + M9*VLOOKUP(L9, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q9").setFormula("=P9*(1+'1_CAU_HINH'!$B$5)");

  // 8. Playing Cards (Hộp nhựa)
  sheet.getRange("E10").setFormula("=3*'4_GIA_NVL'!$H$3 + 12*600 + 6*1008 + 25000 + 0.111*'4_GIA_NVL'!$H$11");
  sheet.getRange("I10").setFormula("=F10*'2_NHAN_SU_LUONG'!$L$3 + G10*'2_NHAN_SU_LUONG'!$L$4 + H10*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J10").setFormula("=2.5 * 0.15 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K10").setFormula("=(E10+I10+J10)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N10").setFormula("=E10+I10+J10+K10 + M10*VLOOKUP(L10, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O10").setFormula("=N10*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P10").setFormula("=E10+I10+J10+K10 + M10*VLOOKUP(L10, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q10").setFormula("=P10*(1+'1_CAU_HINH'!$B$5)");

  // 9. Uno Cards (Hộp giấy gộp)
  sheet.getRange("E11").setFormula("=7*'4_GIA_NVL'!$H$3 + 28*600 + 14*1008");
  sheet.getRange("I11").setFormula("=F11*'2_NHAN_SU_LUONG'!$L$3 + G11*'2_NHAN_SU_LUONG'!$L$4 + H11*'2_NHAN_SU_LUONG'!$L$5");
  sheet.getRange("J11").setFormula("=2.5 * 0.35 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K11").setFormula("=(E11+I11+J11)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N11").setFormula("=E11+I11+J11+K11 + M11*VLOOKUP(L11, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O11").setFormula("=N11*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P11").setFormula("=E11+I11+J11+K11 + M11*VLOOKUP(L11, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q11").setFormula("=P11*(1+'1_CAU_HINH'!$B$5)");

  // 10. Hoodie
  sheet.getRange("E12").setFormula("=110000 + 0.35*15000 + 0.2*20000");
  sheet.getRange("I12").setFormula("=F12*'2_NHAN_SU_LUONG'!$L$6 + G12*'2_NHAN_SU_LUONG'!$L$8 + H12*'2_NHAN_SU_LUONG'!$L$9");
  sheet.getRange("J12").setFormula("=1.8 * 0.30 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K12").setFormula("=(E12+I12+J12)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N12").setFormula("=E12+I12+J12+K12 + M12*VLOOKUP(L12, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O12").setFormula("=N12*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P12").setFormula("=E12+I12+J12+K12 + M12*VLOOKUP(L12, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q12").setFormula("=P12*(1+'1_CAU_HINH'!$B$5)");

  // 11. Cap
  sheet.getRange("E13").setFormula("=28000 + 0.05*35000 + 0.2*25000");
  sheet.getRange("I13").setFormula("=F13*'2_NHAN_SU_LUONG'!$L$6 + G13*'2_NHAN_SU_LUONG'!$L$8 + H13*'2_NHAN_SU_LUONG'!$L$9");
  sheet.getRange("J13").setFormula("=1.2 * 0.18 * '1_CAU_HINH'!$B$6");
  sheet.getRange("K13").setFormula("=(E13+I13+J13)*'1_CAU_HINH'!$B$4");
  sheet.getRange("N13").setFormula("=E13+I13+J13+K13 + M13*VLOOKUP(L13, '3_KHAU_HAO_MAY'!$A$3:$K$5, 8, FALSE)");
  sheet.getRange("O13").setFormula("=N13*(1+'1_CAU_HINH'!$B$5)");
  sheet.getRange("P13").setFormula("=E13+I13+J13+K13 + M13*VLOOKUP(L13, '3_KHAU_HAO_MAY'!$A$3:$K$5, 10, FALSE)");
  sheet.getRange("Q13").setFormula("=P13*(1+'1_CAU_HINH'!$B$5)");

  var totalRows = productsStatic.length;
  sheet.getRange("E3:E" + (totalRows + 2)).setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("F3:H" + (totalRows + 2)).setNumberFormat("0.000");
  sheet.getRange("I3:K" + (totalRows + 2)).setNumberFormat("#,##0\" ₫\"");
  sheet.getRange("M3:M" + (totalRows + 2)).setNumberFormat("0.0000");
  sheet.getRange("N3:N" + (totalRows + 2)).setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#fee2e2");
  sheet.getRange("O3:O" + (totalRows + 2)).setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#fef3c7");
  sheet.getRange("P3:P" + (totalRows + 2)).setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#dcfce7");
  sheet.getRange("Q3:Q" + (totalRows + 2)).setNumberFormat("#,##0\" ₫\"").setFontWeight("bold").setBackground("#bbf7d0");

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 240);
  sheet.setColumnWidth(3, 170);
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
// TAB 7: DỰ BÁO BÁN HÀNG & NHU CẦU NGUYÊN VẬT LIỆU (MRP)
// -----------------------------------------------------------------------------
function setupSheetMRP(sheet) {
  sheet.setTabColor("#ec4899");

  sheet.getRange("A1:I1").merge().setValue("KẾ HOẠCH BÁN HÀNG THÁNG 7 & DỰ BÁO SẢN XUẤT THÁNG 8 CHO TOÀN BỘ SẢN PHẨM")
    .setFontWeight("bold").setFontSize(14).setBackground("#db2777").setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var headers = [
    "Mã SKU", "Tên sản phẩm", "Sản lượng bán Tháng 7 (Thực tế)", "Dự báo bán Tháng 8 (+10%)",
    "Tồn kho hiện tại", "Tồn an toàn", "Nhu cầu sản xuất Tháng 8", 
    "Doanh thu dự kiến T8 (3 năm đầu)", "Doanh thu dự kiến T8 (Sau 3 năm)"
  ];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#fce7f3");

  var forecastStatic = [
    ["ST-AN-SUA-2IN", "Sticker Decal An Nam Sữa Mờ (2 inch)", 2700, "", 1200, 1500, "", "", ""],
    ["ST-TK-SUA-2IN", "Sticker Decal ThaiKK Sữa Mờ (2 inch)", 2400, "", 300, 800, "", "", ""],
    ["ST-TK-TRONG-2IN", "Sticker Decal ThaiKK Trong (2 inch)", 1800, "", 200, 500, "", "", ""],
    ["ST-TK-BAC-2IN", "Sticker Decal ThaiKK Bạc Bóng (2 inch)", 1200, "", 150, 400, "", "", ""],
    ["ST-SKIN-CARD", "Skin Card Dán Thẻ ATM Decal Sữa", 950, "", 100, 300, "", "", ""],
    ["ST-UV-DTF-2IN", "Sticker UV-DTF (2 inch)", 3500, "", 100, 300, "", "", ""],
    ["PC-PAPER-01", "Bộ bài Playing Cards (Hộp giấy)", 150, "", 100, 200, "", "", ""],
    ["PC-PLASTIC-02", "Bộ bài Playing Cards (Hộp nhựa)", 120, "", 40, 120, "", "", ""],
    ["UNO-PAPER-01", "Bộ bài Uno Cards (Hộp giấy gộp)", 180, "", 150, 150, "", "", ""],
    ["HD-EMB-01", "Áo hoodie thêu nổi Signature", 250, "", 80, 150, "", "", ""],
    ["CAP-EMB-02", "Mũ lưỡi trai Classic thêu logo 3D", 400, "", 450, 350, "", "", ""]
  ];

  sheet.getRange(3, 1, forecastStatic.length, headers.length).setValues(forecastStatic);

  var totalRows = forecastStatic.length;
  for (var i = 3; i <= totalRows + 2; i++) {
    sheet.getRange("D" + i).setFormula("=C" + i + "*110/100");
    sheet.getRange("G" + i).setFormula("=MAX(0, D" + i + "+F" + i + "-E" + i + ")");
    sheet.getRange("H" + i).setFormula("=D" + i + "*VLOOKUP(A" + i + ", '6_GIA_THANH_BOM'!$A$3:$Q$13, 15, FALSE)");
    sheet.getRange("I" + i).setFormula("=D" + i + "*VLOOKUP(A" + i + ", '6_GIA_THANH_BOM'!$A$3:$Q$13, 17, FALSE)");
  }

  sheet.getRange("C3:G" + (totalRows + 2)).setNumberFormat("#,##0");
  sheet.getRange("H3:I" + (totalRows + 2)).setNumberFormat("#,##0\" ₫\"").setFontWeight("bold");

  // Dòng Tổng Cộng
  var sumRow = totalRows + 3;
  sheet.getRange(sumRow, 1).setValue("TỔNG CỘNG").setFontWeight("bold");
  sheet.getRange("C" + sumRow).setFormula("=SUM(C3:C" + (sumRow - 1) + ")").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange("D" + sumRow).setFormula("=SUM(D3:D" + (sumRow - 1) + ")").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange("G" + sumRow).setFormula("=SUM(G3:G" + (sumRow - 1) + ")").setFontWeight("bold").setNumberFormat("#,##0");
  sheet.getRange("H" + sumRow).setFormula("=SUM(H3:H" + (sumRow - 1) + ")").setFontWeight("bold").setNumberFormat("#,##0\" ₫\"").setBackground("#fef3c7");
  sheet.getRange("I" + sumRow).setFormula("=SUM(I3:I" + (sumRow - 1) + ")").setFontWeight("bold").setNumberFormat("#,##0\" ₫\"").setBackground("#bbf7d0");

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 250);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 220);
  sheet.setColumnWidth(9, 220);
}
