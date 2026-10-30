/* ==========================================================================
   Sepuloz — bahasa
   Lalai: English. Pilihan: Bahasa Melayu.
   Kunci dikumpul ikut kawasan skrin supaya mudah disemak.
   ========================================================================== */
(function (w) {
  "use strict";

  var KAMUS = {
    en: {
      /* --- jenama & nav --- */
      "app.nama": "Sepuloz",
      "nav.dashboard": "Dashboard",
      "nav.semuaTiket": "All Tickets",
      "nav.tiketSaya": "My Tickets",
      "nav.projek": "Projects",
      "nav.logKeluar": "Sign out",
      "nav.tukarTema": "Switch theme",
      "nav.tukarBahasa": "Switch language",
      "nav.tukarPeranan": "Switch role",

      /* --- login --- */
      "login.eyebrow": "Ticketing Solutions",
      "login.tajuk1": "One place.",
      "login.tajuk2": "Every ticket.",
      "login.huraian": "Enforcement reports. The project manager sets severity and assigns. IT support fixes. Every action is recorded — no ticket lost in email.",
      "login.masukSebagai": "Sign in as",
      "login.pilihPeranan": "Choose your role",
      "login.tabMasuk": "Sign in",
      "login.tabProses": "Process flow",
      "login.batal": "Cancel",

      "proses.lbl": "Process flow",
      "proses.tajuk": "How a ticket moves",

      "peranan.penguatkuasa": "Enforcement Officer",
      "peranan.pm": "Project Manager",
      "peranan.it": "IT Support",
      "peranan.penguatkuasa.desc": "Report bugs, track status, confirm fixes.",
      "peranan.pm.desc": "Set severity, assign tickets, manage projects.",
      "peranan.it.desc": "Fix, mark Fixed, merge similar tickets.",

      /* --- status --- */
      "status.open": "Open",
      "status.assigned": "Assigned",
      "status.fixed": "Fixed",
      "status.reopen": "Re-open",
      "status.resolved": "Resolved",
      "status.closed": "Closed",
      "status.open.desc": "Newly reported. Not yet assigned to anyone.",
      "status.assigned.desc": "The PM has assigned it to IT support and set a severity. Work is underway.",
      "status.fixed.desc": "IT support says it is fixed. Waiting for the enforcement officer to retest.",
      "status.reopen.desc": "The officer retested and the bug is still there. Back to the same IT support engineer.",
      "status.resolved.desc": "The officer confirmed the issue is gone. Waiting for IT support to close the ticket.",
      "status.closed.desc": "Ticket closed. It cannot be reopened — raise a new ticket if it recurs.",

      /* --- severity --- */
      "sev.critical": "Critical",
      "sev.urgent": "Urgent",
      "sev.normal": "Normal",
      "sev.kiv": "KIV",

      /* --- dashboard --- */
      "dash.semuaTiket": "All tickets across projects.",
      "dash.tiketIt": "Tickets assigned to you.",
      "dash.tiketSaya": "Tickets you reported.",
      "dash.senaraiPenuh": "All tickets",
      "dash.tiketBaharu": "New ticket",
      "dash.menungguAgihan": "Awaiting assignment",
      "dash.dalamTangan": "In your hands",
      "dash.menungguSah": "Awaiting your confirmation",
      "dash.dalamProses": "In progress",
      "dash.kosongTindakan": "Nothing waiting on you.",
      "dash.kosongLain": "No other active tickets.",

      /* --- jadual --- */
      "jadual.semuaTiket": "All Tickets",
      "jadual.tiketSaya": "My Tickets",
      "jadual.semuaProjek": "All projects",
      "jadual.tugasanAnda": "Your queue",
      "jadual.cari": "Search",
      "jadual.cariPlaceholder": "Ticket ID, issue or steps…",
      "jadual.status": "Status",
      "jadual.severity": "Severity",
      "jadual.projek": "Project",
      "jadual.itSupport": "IT Support",
      "jadual.tarikh": "Date",
      "jadual.semuaStatus": "All statuses",
      "jadual.semuaSev": "All severities",
      "jadual.semuaProjekOpsi": "All projects",
      "jadual.semuaIt": "All IT support",
      "jadual.belumDiagih": "Unassigned",
      "jadual.setSemula": "Reset",
      "jadual.id": "ID",
      "jadual.isu": "Issue",
      "jadual.dikemas": "Updated",
      "jadual.belum": "None",
      "jadual.memaparkan": "Showing",
      "jadual.daripada": "of",
      "jadual.tiketWord": "tickets",
      "jadual.papar": "Show",
      "jadual.rekod": "records",
      "jadual.tiadaHasil": "No tickets match this filter.",
      "jadual.maksudStatus": "What each status means",

      /* --- laci --- */
      "laci.pelapor": "Reported by",
      "laci.itSupport": "IT Support",
      "laci.dicipta": "Created",
      "laci.dikemas": "Updated",
      "laci.langkah": "Steps to reproduce",
      "laci.lampiran": "Attachments",
      "laci.tiadaLampiran": "No attachments.",
      "laci.digabungDari": "Merged from",
      "laci.statusGabungan": "Merge status",
      "laci.digabungKe": "This ticket was merged into",
      "laci.sejarah": "History",
      "laci.sistem": "System",

      /* --- tindakan --- */
      "aksi.agih": "Assign to IT Support",
      "aksi.tukarAgih": "Reassign",
      "aksi.fixed": "Mark Fixed",
      "aksi.sambung": "Resume work",
      "aksi.selesai": "Issue resolved",
      "aksi.masih": "Still happening",
      "aksi.tutup": "Close ticket",
      "aksi.gabung": "Merge",
      "aksi.lampiran": "Attachment",
      "aksi.tiketBaharu": "New ticket",
      "aksi.tutupNota": "This ticket is closed. Raise a new ticket if the issue recurs.",

      /* --- borang tiket --- */
      "borang.tiketBaharu": "New ticket",
      "borang.projek": "Project",
      "borang.isu": "Issue",
      "borang.isuPlaceholder": "e.g. Compound list stops loading past 50 rows",
      "borang.isuWajib": "Issue is required.",
      "borang.langkah": "Steps to reproduce",
      "borang.langkahPlaceholder": "1. Open My Account\n2. Filter 2026 compounds\n3. Scroll down",
      "borang.langkahHint": "Optional, but it saves IT support a lot of guessing.",
      "borang.kategori": "Category",
      "borang.lampiran": "Attachment",
      "borang.batal": "Cancel",
      "borang.cipta": "Create ticket",

      /* --- agih --- */
      "agih.tajuk": "Assign",
      "agih.itSupport": "IT Support",
      "agih.bebanHint": "Active workload shown so the split stays even.",
      "agih.severity": "Severity",
      "agih.severityHint": "Critical = system unusable. KIV = accepted but deferred.",
      "agih.severityWajib": "Pick a severity before assigning.",
      "agih.nota": "Note for IT support",
      "agih.notaPlaceholder": "Extra context, business priority, etc.",
      "agih.hantar": "Assign",

      /* --- fixed --- */
      "fixed.tajuk": "Mark as Fixed",
      "fixed.ringkasan": "Fix summary",
      "fixed.placeholder": "What changed and why it resolves the issue.",
      "fixed.hint": "The enforcement officer sees this note before retesting.",
      "fixed.hantar": "Mark Fixed",

      /* --- gabung --- */
      "gabung.tajuk": "Merge into",
      "gabung.huraian": "Pick the tickets with the same issue. They will be hidden from the list and linked to",
      "gabung.hantar": "Merge",
      "gabung.pilihDulu": "Select at least one ticket",
      "gabung.tiadaCalon": "No other tickets in this project to merge",

      /* --- projek --- */
      "projek.tajuk": "Projects",
      "projek.huraian": "Each project has its own board and ticket prefix. The status workflow is the same for all.",
      "projek.baharu": "New project",
      "projek.aktif": "Active",
      "projek.tutup": "Closed",
      "projek.lihat": "View board",
      "projek.nama": "Project name",
      "projek.prefix": "Ticket prefix",
      "projek.prefixHint": "3–6 letters. e.g. TUND-001, TUND-002.",
      "projek.prefixRalat": "Prefix must be 3–6 letters and not already used.",
      "projek.keterangan": "Description",
      "projek.cipta": "Create project",

      /* --- lampiran viewer --- */
      "lihat.tajuk": "Attachment",
      "lihat.tutup": "Close",
      "lihat.zoomIn": "Zoom in",
      "lihat.zoomOut": "Zoom out",
      "lihat.saizAsal": "Actual size",
      "lihat.putar": "Rotate",
      "lihat.muatTurun": "Download",
      "lihat.bukaTab": "Open in new tab",
      "lihat.taipan": "Text",
      "lihat.tiadaPratonton": "No preview available for this file type.",
      "lihat.bukanFail": "File not included in this prototype.",
      "lihat.petunjuk": "Scroll to zoom · drag to pan · Esc to close",

      /* --- toast --- */
      "toast.dicipta": "created in",
      "toast.diagih": "assigned to",
      "toast.fixed": "marked Fixed",
      "toast.sambung": "resumed",
      "toast.selesai": "confirmed resolved — waiting for IT support to close",
      "toast.reopen": "reopened",
      "toast.tutup": "closed",
      "toast.gabung": "tickets merged into",
      "toast.lampiran": "attachments uploaded",
      "toast.projek": "Project created",
      "toast.peranan": "Now acting as",
      "toast.pilihSatu": "Select at least one ticket"
    },

    ms: {
      "app.nama": "Sepuloz",
      "nav.dashboard": "Papan Pemuka",
      "nav.semuaTiket": "Semua Tiket",
      "nav.tiketSaya": "Tiket Saya",
      "nav.projek": "Projek",
      "nav.logKeluar": "Log keluar",
      "nav.tukarTema": "Tukar tema",
      "nav.tukarBahasa": "Tukar bahasa",
      "nav.tukarPeranan": "Tukar peranan",

      "login.eyebrow": "Ticketing Solutions",
      "login.tajuk1": "Satu tempat.",
      "login.tajuk2": "Semua tiket.",
      "login.huraian": "Penguatkuasa lapor. Project Manager tetapkan severity dan agihkan. IT Support baiki. Setiap tindakan direkodkan — tiada tiket hilang dalam emel.",
      "login.masukSebagai": "Masuk sebagai",
      "login.pilihPeranan": "Pilih peranan anda",
      "login.tabMasuk": "Log masuk",
      "login.tabProses": "Aliran proses",
      "login.batal": "Batal",

      "proses.lbl": "Aliran proses",
      "proses.tajuk": "Bagaimana tiket bergerak",

      "peranan.penguatkuasa": "Penguatkuasa",
      "peranan.pm": "Project Manager",
      "peranan.it": "IT Support",
      "peranan.penguatkuasa.desc": "Lapor bugs, pantau status, sahkan pembaikan.",
      "peranan.pm.desc": "Tetapkan severity, agih tiket, urus projek.",
      "peranan.it.desc": "Baiki, tanda Fixed, gabung tiket serupa.",

      "status.open": "Open",
      "status.assigned": "Assigned",
      "status.fixed": "Fixed",
      "status.reopen": "Re-open",
      "status.resolved": "Resolved",
      "status.closed": "Closed",
      "status.open.desc": "Tiket baharu dilaporkan. Belum diagihkan kepada sesiapa.",
      "status.assigned.desc": "PM sudah agih kepada IT Support dan tetapkan severity. Kerja sedang berjalan.",
      "status.fixed.desc": "IT Support kata sudah dibaiki. Menunggu Penguatkuasa uji semula.",
      "status.reopen.desc": "Penguatkuasa uji, masalah masih berlaku. Balik kepada IT Support yang sama.",
      "status.resolved.desc": "Penguatkuasa sahkan isu selesai. Menunggu IT Support tutup tiket.",
      "status.closed.desc": "Tiket ditutup. Tidak boleh dibuka semula — cipta tiket baharu jika berulang.",

      "sev.critical": "Critical",
      "sev.urgent": "Urgent",
      "sev.normal": "Normal",
      "sev.kiv": "KIV",

      "dash.semuaTiket": "Semua tiket merentas projek.",
      "dash.tiketIt": "Tiket yang diagihkan kepada anda.",
      "dash.tiketSaya": "Tiket yang anda laporkan.",
      "dash.senaraiPenuh": "Semua tiket",
      "dash.tiketBaharu": "Tiket baharu",
      "dash.menungguAgihan": "Menunggu agihan",
      "dash.dalamTangan": "Dalam tangan anda",
      "dash.menungguSah": "Menunggu pengesahan anda",
      "dash.dalamProses": "Dalam proses",
      "dash.kosongTindakan": "Tiada tiket menunggu tindakan anda.",
      "dash.kosongLain": "Tiada tiket lain yang aktif.",

      "jadual.semuaTiket": "Semua Tiket",
      "jadual.tiketSaya": "Tiket Saya",
      "jadual.semuaProjek": "Semua projek",
      "jadual.tugasanAnda": "Tugasan anda",
      "jadual.cari": "Cari",
      "jadual.cariPlaceholder": "ID tiket, isu atau langkah…",
      "jadual.status": "Status",
      "jadual.severity": "Severity",
      "jadual.projek": "Projek",
      "jadual.itSupport": "IT Support",
      "jadual.tarikh": "Tarikh",
      "jadual.semuaStatus": "Semua status",
      "jadual.semuaSev": "Semua severity",
      "jadual.semuaProjekOpsi": "Semua projek",
      "jadual.semuaIt": "Semua IT Support",
      "jadual.belumDiagih": "Belum diagih",
      "jadual.setSemula": "Set semula",
      "jadual.id": "ID",
      "jadual.isu": "Isu",
      "jadual.dikemas": "Dikemas kini",
      "jadual.belum": "Belum",
      "jadual.memaparkan": "Memaparkan",
      "jadual.daripada": "daripada",
      "jadual.tiketWord": "tiket",
      "jadual.papar": "Papar",
      "jadual.rekod": "rekod",
      "jadual.tiadaHasil": "Tiada tiket sepadan dengan tapisan ini.",
      "jadual.maksudStatus": "Maksud status",

      "laci.pelapor": "Pelapor",
      "laci.itSupport": "IT Support",
      "laci.dicipta": "Dicipta",
      "laci.dikemas": "Dikemas kini",
      "laci.langkah": "Langkah untuk hasilkan semula",
      "laci.lampiran": "Lampiran",
      "laci.tiadaLampiran": "Tiada lampiran.",
      "laci.digabungDari": "Digabung dari",
      "laci.statusGabungan": "Status gabungan",
      "laci.digabungKe": "Tiket ini telah digabung ke",
      "laci.sejarah": "Sejarah",
      "laci.sistem": "Sistem",

      "aksi.agih": "Agih kepada IT Support",
      "aksi.tukarAgih": "Tukar agihan",
      "aksi.fixed": "Tanda Fixed",
      "aksi.sambung": "Sambung kerja",
      "aksi.selesai": "Isu selesai",
      "aksi.masih": "Masih berlaku",
      "aksi.tutup": "Tutup tiket",
      "aksi.gabung": "Gabung",
      "aksi.lampiran": "Lampiran",
      "aksi.tiketBaharu": "Tiket baharu",
      "aksi.tutupNota": "Tiket ditutup. Jika isu berulang, cipta tiket baharu.",

      "borang.tiketBaharu": "Tiket baharu",
      "borang.projek": "Projek",
      "borang.isu": "Isu",
      "borang.isuPlaceholder": "Contoh: Senarai kompaun tidak memaparkan rekod melebihi 50 baris",
      "borang.isuWajib": "Isu wajib diisi.",
      "borang.langkah": "Langkah untuk hasilkan semula",
      "borang.langkahPlaceholder": "1. Buka Akaun Saya\n2. Tapis kompaun 2026\n3. Skrol ke bawah",
      "borang.langkahHint": "Tidak wajib, tetapi sangat membantu IT Support.",
      "borang.kategori": "Kategori",
      "borang.lampiran": "Lampiran",
      "borang.batal": "Batal",
      "borang.cipta": "Cipta tiket",

      "agih.tajuk": "Agih",
      "agih.itSupport": "IT Support",
      "agih.bebanHint": "Beban aktif dipaparkan supaya agihan seimbang.",
      "agih.severity": "Severity",
      "agih.severityHint": "Critical = sistem tidak boleh diguna. KIV = diterima tetapi ditangguh.",
      "agih.severityWajib": "Pilih severity sebelum agih.",
      "agih.nota": "Nota untuk IT Support",
      "agih.notaPlaceholder": "Konteks tambahan, keutamaan bisnes, dsb.",
      "agih.hantar": "Agihkan",

      "fixed.tajuk": "Tanda sebagai Fixed",
      "fixed.ringkasan": "Ringkasan pembaikan",
      "fixed.placeholder": "Apa yang diubah dan mengapa ia menyelesaikan isu.",
      "fixed.hint": "Penguatkuasa akan nampak nota ini sebelum uji semula.",
      "fixed.hantar": "Tanda Fixed",

      "gabung.tajuk": "Gabung ke",
      "gabung.huraian": "Pilih tiket yang isunya sama. Ia akan disembunyikan dari senarai dan dipautkan ke",
      "gabung.hantar": "Gabungkan",
      "gabung.pilihDulu": "Pilih sekurang-kurangnya satu tiket",
      "gabung.tiadaCalon": "Tiada tiket lain dalam projek ini untuk digabung",

      "projek.tajuk": "Projek",
      "projek.huraian": "Setiap projek ada board dan prefix tiket sendiri. Workflow status sama untuk semua.",
      "projek.baharu": "Projek baharu",
      "projek.aktif": "Aktif",
      "projek.tutup": "Tutup",
      "projek.lihat": "Lihat board",
      "projek.nama": "Nama projek",
      "projek.prefix": "Prefix tiket",
      "projek.prefixHint": "3–6 huruf. Contoh: TUND-001, TUND-002.",
      "projek.prefixRalat": "Prefix mesti 3–6 huruf dan belum digunakan.",
      "projek.keterangan": "Keterangan",
      "projek.cipta": "Cipta projek",

      "lihat.tajuk": "Lampiran",
      "lihat.tutup": "Tutup",
      "lihat.zoomIn": "Zoom masuk",
      "lihat.zoomOut": "Zoom keluar",
      "lihat.saizAsal": "Saiz asal",
      "lihat.putar": "Putar",
      "lihat.muatTurun": "Muat turun",
      "lihat.bukaTab": "Buka dalam tab baharu",
      "lihat.taipan": "Teks",
      "lihat.tiadaPratonton": "Tiada pratonton untuk jenis fail ini.",
      "lihat.bukanFail": "Fail tidak disertakan dalam prototaip ini.",
      "lihat.petunjuk": "Skrol untuk zoom · seret untuk geser · Esc untuk tutup",

      "toast.dicipta": "dicipta di",
      "toast.diagih": "diagih kepada",
      "toast.fixed": "ditanda Fixed",
      "toast.sambung": "disambung semula",
      "toast.selesai": "disahkan selesai — menunggu IT Support tutup",
      "toast.reopen": "di-re-open",
      "toast.tutup": "ditutup",
      "toast.gabung": "tiket digabung ke",
      "toast.lampiran": "lampiran dimuat naik",
      "toast.projek": "Projek dicipta",
      "toast.peranan": "Kini sebagai",
      "toast.pilihSatu": "Pilih sekurang-kurangnya satu tiket"
    }
  };

  var KUNCI = "sepuloz_bahasa";
  var kini = "en";

  try { kini = localStorage.getItem(KUNCI) || "en"; } catch (e) {}
  if (kini !== "en" && kini !== "ms") kini = "en";

  w.BAHASA = {
    kod: function () { return kini; },
    set: function (kod) {
      if (kod !== "en" && kod !== "ms") return;
      kini = kod;
      try { localStorage.setItem(KUNCI, kod); } catch (e) {}
      document.documentElement.setAttribute("lang", kod === "ms" ? "ms" : "en");
    },
    t: function (kunci) {
      var jadual = KAMUS[kini] || KAMUS.en;
      if (jadual[kunci] != null) return jadual[kunci];
      if (KAMUS.en[kunci] != null) return KAMUS.en[kunci];
      return kunci;
    },
    senarai: function () { return ["en", "ms"]; }
  };

  document.documentElement.setAttribute("lang", kini === "ms" ? "ms" : "en");
})(window);
