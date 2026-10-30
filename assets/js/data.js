/* ==========================================================================
   Sepuloz — lapisan data
   Tiga peranan: Penguatkuasa · Project Manager · IT Support
   Setiap projek ada board dan prefix tiket sendiri.
   ========================================================================== */
(function (w) {
  "use strict";

  /* ------------------------------------------------------------- pengguna */
  var USERS = [
    { id: "u-pm",  name: "Saifullah Muhamad", short: "Saifullah", role: "pm",           initials: "SM" },
    { id: "u-pg1", name: "Rosli Ahmad",       short: "Rosli",     role: "penguatkuasa", initials: "RA", dept: "Penguatkuasaan" },
    { id: "u-pg2", name: "Nur Aisyah",        short: "Aisyah",    role: "penguatkuasa", initials: "NA", dept: "Penguatkuasaan" },
    { id: "u-it1", name: "Faiz Rahman",       short: "Faiz",      role: "it",           initials: "FR", spec: "Backend" },
    { id: "u-it2", name: "Tan Wei Ming",      short: "Wei Ming",  role: "it",           initials: "TW", spec: "Frontend" },
    { id: "u-it3", name: "Priya Nair",        short: "Priya",     role: "it",           initials: "PN", spec: "Infra" }
  ];

  var ROLE_LABEL = {
    pm: "Project Manager",
    penguatkuasa: "Penguatkuasa",
    it: "IT Support"
  };

  /* --------------------------------------------------------------- projek */
  var PROJECTS = [
    { id: "emas", name: "eMAS Portal", prefix: "EMAS", desc: "Portal penguatkuasaan bersepadu" },
    { id: "itcs", name: "ITCS",        prefix: "ITCS", desc: "Clamp, tow dan kompaun" },
    { id: "ies",  name: "IES",         prefix: "IES",  desc: "Aplikasi penguatkuasaan lapangan" },
    { id: "ips",  name: "IPS",         prefix: "IPS",  desc: "Sistem rondaan bersepadu" }
  ];

  /* --------------------------------------------------------------- status */
  var STATUS = {
    open:     { label: "Open",     order: 1 },
    assigned: { label: "Assigned", order: 2 },
    fixed:    { label: "Fixed",    order: 3 },
    reopen:   { label: "Re-open",  order: 4 },
    resolved: { label: "Resolved", order: 5 },
    closed:   { label: "Closed",   order: 6 }
  };

  var STATUS_ORDER = ["open", "assigned", "fixed", "reopen", "resolved", "closed"];

  /* Peralihan sah: dari status → { ke, oleh } */
  var TRANSITIONS = {
    open:     [{ to: "assigned", by: "pm" }],
    assigned: [{ to: "fixed",    by: "it" }],
    fixed:    [{ to: "reopen",   by: "penguatkuasa" },
               { to: "resolved", by: "penguatkuasa" }],
    reopen:   [{ to: "assigned", by: "it" }],
    resolved: [{ to: "closed",   by: "it" }],
    closed:   []
  };

  /* Severity — ditetapkan PM semasa assign kepada IT Support.
     KIV = keep in view (ditangguh, bukan urgent). */
  var SEVERITY = {
    critical: { label: "Critical", order: 1 },
    urgent:   { label: "Urgent",   order: 2 },
    normal:   { label: "Normal",   order: 3 },
    kiv:      { label: "KIV",      order: 4 }
  };
  var SEVERITY_ORDER = ["critical", "urgent", "normal", "kiv"];

  var CATEGORY = ["Pangkalan data", "Paparan", "API", "Akses & kebenaran", "Prestasi", "Lain-lain"];

  /* ------------------------------------------------------------ dummy data */
  var NOW = new Date("2026-10-29T14:20:00+08:00");
  var H = 3600e3;

  function ago(hours) { return new Date(NOW.getTime() - hours * H); }

  /* [projek, isu, status, priority, kategori, pelapor, assignee, jamLalu, steps, reopenKira] */
  var RAW = [
    ["emas", "Senarai kompaun tidak memaparkan rekod melebihi 50 baris", "assigned", "urgent", "Pangkalan data", "u-pg1", "u-it1", 6,
      "1. Buka Akaun Saya\n2. Tapis kompaun tahun 2026\n3. Skrol ke bawah — senarai berhenti pada baris ke-50", 0],
    ["emas", "Muat naik lampiran gagal apabila nama fail ada aksara Cina", "fixed", "normal", "API", "u-pg2", "u-it2", 20,
      "1. Cipta tiket\n2. Lampir fail bernama 罚款.pdf\n3. Butang simpan tidak memberi respons", 0],
    ["emas", "Butang Bayar Dipilih kekal kelabu walaupun checkbox ditanda", "resolved", "urgent", "Paparan", "u-pg1", "u-it2", 52,
      "1. Pilih 2 kompaun\n2. Butang tidak bertukar biru", 0],
    ["emas", "Log masuk gagal selepas tukar kata laluan melalui pautan emel", "closed", "critical", "Akses & kebenaran", "u-pg2", "u-it3", 96,
      "1. Minta reset kata laluan\n2. Ikut pautan emel\n3. Kata laluan baharu ditolak", 1],
    ["emas", "Tarikh pada resit bercetak salah format (YYYY-MM-DD)", "assigned", "kiv", "Paparan", "u-pg1", "u-it3", 9,
      "1. Bayar kompaun\n2. Buka resit\n3. Tarikh dipaparkan 2026-10-14", 0],
    ["emas", "Pencarian mengikut nombor plat memulangkan rekod kenderaan lain", "fixed", "critical", "Pangkalan data", "u-pg2", "u-it1", 30,
      "1. Cari JSU7721\n2. Rekod JNM1340 turut muncul", 1],
    ["emas", "Halaman Soalan Lazim tidak boleh diskrol pada iOS Safari", "closed", "normal", "Paparan", "u-pg1", "u-it2", 140,
      "1. Buka FAQ pada iPhone\n2. Kandungan tersekat selepas item ke-4", 0],
    ["emas", "Notifikasi emel dihantar dua kali untuk setiap perubahan status", "open", null, "API", "u-pg2", null, 4, "", 0],
    ["emas", "Eksport Excel mengandungi lajur kosong di hujung", "assigned", "kiv", "Lain-lain", "u-pg1", "u-it3", 14,
      "1. Eksport senarai transaksi\n2. Buka dalam Excel — ada 3 lajur kosong", 0],
    ["emas", "Sesi tamat secara tiba-tiba selepas 5 minit tanpa aktiviti", "open", null, "Akses & kebenaran", "u-pg2", null, 2, "", 0],

    ["itcs", "Clamp tidak dikeluarkan selepas bayaran disahkan", "assigned", "urgent", "API", "u-pg1", "u-it1", 3,
      "1. Bayar kompaun clamp\n2. Semak status kenderaan\n3. Status kekal 'Clamped'", 0],
    ["itcs", "Resit eKutipan tidak menjana nombor rujukan", "fixed", "urgent", "Pangkalan data", "u-pg2", "u-it3", 26,
      "1. Bayar melalui eKutipan\n2. Resit kosong pada medan No. Rujukan", 0],
    ["itcs", "Laporan harian tundaan tidak sepadan dengan jumlah sebenar", "resolved", "urgent", "Pangkalan data", "u-pg1", "u-it1", 60,
      "1. Jana laporan 28/10\n2. Jumlah RM 4,200 vs sistem RM 4,650", 0],
    ["itcs", "Tiket kompaun berganda apabila butang simpan ditekan dua kali", "closed", "normal", "API", "u-pg2", "u-it2", 110,
      "1. Isi borang kompaun\n2. Tekan Simpan dua kali pantas\n3. Dua rekod tercipta", 0],
    ["itcs", "Peta lokasi clamp tidak memuatkan penanda", "open", null, "Paparan", "u-pg1", null, 7, "", 0],
    ["itcs", "Carian no. pendaftaran tidak sensitif kepada huruf kecil", "assigned", "kiv", "Pangkalan data", "u-pg2", "u-it3", 18,
      "1. Cari jsu7721\n2. Tiada hasil", 0],
    ["itcs", "Butang cetak notis menyembunyikan logo MBPG", "fixed", "normal", "Paparan", "u-pg1", "u-it2", 40,
      "1. Buka notis\n2. Cetak — logo hilang pada salinan", 0],

    ["ies", "Aplikasi mudah alih ranap apabila kamera dibuka tanpa kebenaran", "assigned", "urgent", "Akses & kebenaran", "u-pg1", "u-it2", 5,
      "1. Pasang IES\n2. Tolak kebenaran kamera\n3. Buka modul sita — aplikasi ranap", 1],
    ["ies", "Kompaun yang dicipta luar talian tidak disegerakkan", "fixed", "urgent", "API", "u-pg2", "u-it1", 34,
      "1. Matikan data\n2. Cipta kompaun\n3. Hidupkan data — rekod tidak naik", 0],
    ["ies", "Tandatangan digital pada notis tidak muncul dalam PDF", "resolved", "normal", "Paparan", "u-pg1", "u-it3", 72,
      "1. Jana notis PDF\n2. Bahagian tandatangan kosong", 0],
    ["ies", "Senarai checkpoint tidak mengikut susunan jarak", "closed", "normal", "Pangkalan data", "u-pg2", "u-it1", 160,
      "1. Buka senarai checkpoint\n2. Susunan rawak", 0],
    ["ies", "Masa peranti tidak segerak dengan pelayan (beza 7 minit)", "open", null, "Prestasi", "u-pg1", null, 11, "", 0],
    ["ies", "Imej bukti terpusing 90 darjah selepas dimuat naik", "assigned", "normal", "Paparan", "u-pg2", "u-it2", 22,
      "1. Ambil gambar potret\n2. Muat naik sebagai bukti\n3. Imej terpusing", 0],

    ["ips", "Laluan rondaan tidak direkodkan apabila GPS hilang isyarat", "assigned", "urgent", "API", "u-pg1", "u-it3", 8,
      "1. Mula rondaan\n2. Masuk kawasan tanpa isyarat 3 minit\n3. Laluan terputus", 0],
    ["ips", "Laporan rondaan bulanan tidak menjumlahkan jarak", "fixed", "normal", "Pangkalan data", "u-pg2", "u-it1", 44,
      "1. Jana laporan Oktober\n2. Lajur jarak kosong", 0],
    ["ips", "Checkpoint tidak boleh ditanda jika telefon dalam mod jimat bateri", "resolved", "normal", "Prestasi", "u-pg1", "u-it2", 88,
      "1. Aktifkan jimat baterai\n2. Cuba tanda checkpoint", 0],
    ["ips", "Peta rondaan memaparkan laluan semalam dan hari ini bercampur", "closed", "normal", "Paparan", "u-pg2", "u-it3", 130,
      "1. Buka peta\n2. Laluan 28/10 dan 29/10 bertindih", 0],
    ["ips", "Notifikasi tugasan rondaan lewat 15 minit", "open", null, "API", "u-pg1", null, 16, "", 0],
    ["ips", "Butang tamat rondaan tidak boleh ditekan pada Android 14", "assigned", "normal", "Paparan", "u-pg2", "u-it1", 27,
      "1. Mula rondaan\n2. Cuba tamat — butang tidak responsif", 0]
  ];

  function nameOf(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0];
    return u ? u.name : "—";
  }

  /* bina tiket — id berperingkat ikut projek, kronologi ikut jam lalu */
  RAW.sort(function (a, b) { return b[7] - a[7]; });

  var counter = {};
  PROJECTS.forEach(function (p) { counter[p.id] = 0; });

  var TICKETS = RAW.map(function (r) {
    var proj = r[0], issue = r[1], status = r[2], severity = r[3], category = r[4];
    var by = r[5], assignee = r[6], hrs = r[7], steps = r[8], reopened = r[9];

    counter[proj] += 1;
    var no = counter[proj];
    var prefix = PROJECTS.filter(function (p) { return p.id === proj; })[0].prefix;
    var created = ago(hrs);

    var ev = [{ t: created, actor: by, kind: "create", text: "Tiket dicipta." }];

    if (assignee) {
      ev.push({ t: ago(hrs - 0.4), actor: "u-pm", kind: "assign",
                text: "Ditugaskan kepada " + nameOf(assignee) + "." });
    }
    if (["fixed", "reopen", "resolved", "closed"].indexOf(status) >= 0) {
      ev.push({ t: ago(Math.max(0.2, hrs - 4)), actor: assignee || "u-it1", kind: "status",
                text: "Ditanda Fixed oleh IT Support." });
    }
    if (status === "reopen") {
      ev.push({ t: ago(Math.max(0.15, hrs - 6)), actor: by, kind: "status",
                text: "Di-re-open — masalah masih berlaku." });
      ev.push({ t: ago(Math.max(0.1, hrs - 6.5)), actor: assignee || "u-it1", kind: "assign",
                text: "Ditugaskan semula kepada IT Support yang sama." });
    }
    if (status === "resolved" || status === "closed") {
      ev.push({ t: ago(Math.max(0.2, hrs - 8)), actor: by, kind: "status",
                text: "Disahkan selesai oleh Penguatkuasa." });
    }
    if (status === "closed") {
      ev.push({ t: ago(Math.max(0.1, hrs - 10)), actor: "u-it2", kind: "status",
                text: "Ditutup oleh IT Support." });
    }

    return {
      id: prefix + "-" + String(no).padStart(3, "0"),
      no: no,
      project: proj,
      issue: issue,
      steps: steps || "",
      status: status,
      severity: severity,
      category: category,
      createdBy: by,
      assignee: assignee,
      assignedBy: assignee ? "u-pm" : null,
      created: created,
      updated: ago(Math.max(0.1, hrs - 12)),
      attachments: [],
      mergedInto: null,
      mergedFrom: [],
      reopenCount: reopened,
      events: ev
    };
  });

  /* lampiran contoh */
  var a1 = TICKETS.filter(function (t) { return t.project === "emas"; })[1];
  var a2 = TICKETS.filter(function (t) { return t.project === "itcs"; })[0];
  var a3 = TICKETS.filter(function (t) { return t.project === "ies"; })[0];
  if (a1) a1.attachments.push({ name: "ralat-muat-naik.png", size: 184320, by: "u-pg2", at: ago(19) });
  if (a2) a2.attachments.push({ name: "log-clamp.txt", size: 4096, by: "u-pg1", at: ago(2) });
  if (a3) a3.attachments.push({ name: "crash-android14.txt", size: 22184, by: "u-pg1", at: ago(4) });

  /* ------------------------------------------------------------- eksport */
  w.DATA = {
    USERS: USERS,
    PROJECTS: PROJECTS,
    STATUS: STATUS,
    STATUS_ORDER: STATUS_ORDER,
    TRANSITIONS: TRANSITIONS,
    SEVERITY: SEVERITY,
    SEVERITY_ORDER: SEVERITY_ORDER,
    CATEGORY: CATEGORY,
    TICKETS: TICKETS,
    ROLE_LABEL: ROLE_LABEL,
    NOW: NOW,

    nameOf: nameOf,
    userById: function (id) { return USERS.filter(function (u) { return u.id === id; })[0] || null; },
    projectById: function (id) { return PROJECTS.filter(function (p) { return p.id === id; })[0] || null; },

    nextNo: function (projectId) {
      return TICKETS.filter(function (t) { return t.project === projectId; })
        .reduce(function (m, t) { return Math.max(m, t.no); }, 0) + 1;
    },

    makeId: function (projectId) {
      var p = this.projectById(projectId);
      return p.prefix + "-" + String(this.nextNo(projectId)).padStart(3, "0");
    }
  };
})(window);
