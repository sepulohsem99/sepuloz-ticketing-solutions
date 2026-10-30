/* ==========================================================================
   Sepuloz — aplikasi
   Tiga peranan: Penguatkuasa · Project Manager · IT Support
   Bahasa: English (lalai) / Bahasa Melayu
   ========================================================================== */
(function () {
  "use strict";

  var D = window.DATA;
  var B = window.BAHASA;

  function t(k) { return B.t(k); }

  var TICKETS = D.TICKETS;
  var sevPilih = null;

  /* ------------------------------------------------------------- keadaan */
  var S = {
    user: null,
    view: "dashboard",
    q: "",
    fStatus: "all",
    fSev: "all",
    fProjek: "all",
    fAssign: "all",
    fDari: "",
    fHingga: "",
    sortKey: "updated",
    sortDir: -1,
    page: 1,
    size: 10,
    laci: null
  };

  /* ------------------------------------------------------------- utiliti */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function fmtTarikh(d) {
    var hari = pad(d.getDate()), bln = pad(d.getMonth() + 1);
    return B.kod() === "ms" ? hari + "/" + bln + "/" + d.getFullYear()
                            : bln + "/" + hari + "/" + d.getFullYear();
  }

  function fmtMasa(d) { return pad(d.getHours()) + ":" + pad(d.getMinutes()); }
  function fmtPenuh(d) { return fmtTarikh(d) + " " + fmtMasa(d); }

  function ago(d) {
    var ms = D.NOW.getTime() - d.getTime();
    if (ms < 0) ms = 0;
    var m = Math.round(ms / 60000);
    var mel = B.kod() === "ms";
    if (m < 1) return mel ? "baru sahaja" : "just now";
    if (m < 60) return m + (mel ? "m lalu" : "m ago");
    var h = Math.round(m / 60);
    if (h < 24) return h + (mel ? "j lalu" : "h ago");
    var dd = Math.round(h / 24);
    return dd + (mel ? "h lalu" : "d ago");
  }

  function fmtSaiz(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return Math.round(b / 1024) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  }

  function tiketById(id) { return TICKETS.filter(function (x) { return x.id === id; })[0] || null; }
  function pengguna(id) { return D.userById(id); }

  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("on"); }, 2400);
  }

  function ikon(nama, saiz) {
    var s = saiz || 14;
    var p = {
      tiket: '<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/>',
      papan: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
      projek: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      tambah: '<path d="M12 5v14M5 12h14"/>',
      cari: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      lampiran: '<path d="M21 12.5 12.5 21a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7"/>',
      kiri: '<path d="m15 18-6-6 6-6"/>',
      kanan: '<path d="m9 18 6-6-6-6"/>',
      mata: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
      tutup: '<path d="M18 6 6 18M6 6l12 12"/>',
      gabung: '<path d="M8 3v6a3 3 0 0 0 3 3h7"/><path d="m15 9 3 3-3 3"/><path d="M8 21v-6"/>',
      tanda: '<path d="M20 6 9 17l-5-5"/>',
      fail: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
      imej: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
      muatTurun: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
      zoomMasuk: '<circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-3.5-3.5"/>',
      zoomKeluar: '<circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-3.5-3.5"/>',
      putar: '<path d="M21 2v6h-6"/><path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>',
      tabBaharu: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
      bahasa: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>'
    };
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (p[nama] || "") + "</svg>";
  }

  /* ------------------------------------------------------------- tema */
  var KUNCI_TEMA = "sepuloz_tema";

  function pasangTema(v) {
    document.documentElement.setAttribute("data-theme", v);
    try { localStorage.setItem(KUNCI_TEMA, v); } catch (e) {}
  }

  function tukarTema() {
    var kini = document.documentElement.getAttribute("data-theme");
    pasangTema(kini === "dark" ? "light" : "dark");
  }

  (function temaAwal() {
    var v = "dark";
    try { v = localStorage.getItem(KUNCI_TEMA) || "dark"; } catch (e) {}
    pasangTema(v);
  })();

  /* ------------------------------------------------------------- bahasa */
  function tukarBahasa() {
    B.set(B.kod() === "en" ? "ms" : "en");
    renderLogin();
    if (S.user) render();
    toast(B.kod() === "en" ? "Language: English" : "Bahasa: Melayu");
  }

  /* ------------------------------------------------------------- log masuk */
  function senaraiPeranan() {
    return [
      { id: "penguatkuasa", ikon: "tiket" },
      { id: "pm", ikon: "projek" },
      { id: "it", ikon: "papan" }
    ];
  }

  function renderLogin() {
    var el = $("#perananSenarai");
    if (!el) return;
    el.innerHTML = senaraiPeranan().map(function (p) {
      return '<button class="peranan-btn" data-peranan="' + p.id + '" type="button">' +
        '<span class="peranan-ikon">' + ikon(p.ikon, 15) + "</span>" +
        "<span>" +
          '<span class="peranan-nama">' + esc(t("peranan." + p.id)) + "</span>" +
          '<span class="peranan-desc">' + esc(t("peranan." + p.id + ".desc")) + "</span>" +
        "</span>" +
      "</button>";
    }).join("");

    var e1 = $("#loginEyebrow"), e2 = $("#loginTajuk1"), e3 = $("#loginTajuk2"), e4 = $("#loginHuraian");
    if (e1) e1.textContent = t("login.eyebrow");
    if (e2) e2.textContent = t("login.tajuk1");
    if (e3) e3.textContent = t("login.tajuk2");
    if (e4) e4.textContent = t("login.huraian");

    var lbl = $("#loginMasukLbl"), h2 = $("#loginPilihH2");
    if (lbl) lbl.textContent = t("login.masukSebagai");
    if (h2) h2.textContent = t("login.pilihPeranan");

    $$(".landing-tab-btn").forEach(function (b) {
      if (b.getAttribute("data-tab") === "peranan") b.textContent = t("login.tabMasuk");
      else b.textContent = t("login.tabProses");
    });

    var pl = $("#prosesLbl"), ph = $("#prosesH2");
    if (pl) pl.textContent = t("proses.lbl");
    if (ph) ph.textContent = t("proses.tajuk");

    lukisProses();
  }

  function lukisProses() {
    var svg = $("#prosesSvg");
    if (!svg || !window.PROSES) return;
    var kod = B.kod();
    var L = window.PROSES.teks(kod);
    svg.innerHTML = '<title id="prosesTitle">' + esc(L.tajuk) + "</title>" +
                    '<desc id="prosesDesc">' + esc(L.desc) + "</desc>" +
                    window.PROSES.lukis(kod);
    svg.setAttribute("viewBox", "0 0 " + window.PROSES.W + " " + window.PROSES.H);
  }

  function tukarTab(nama) {
    $$(".landing-tab-btn").forEach(function (b) {
      var on = b.getAttribute("data-tab") === nama;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".tab-panel").forEach(function (p) {
      p.classList.toggle("on", p.getAttribute("data-panel") === nama);
    });
    var kad = $(".peranan-kad");
    if (kad) kad.classList.toggle("lebar", nama === "proses");
  }

  function bukaPemilihPengguna(peranan) {
    var senarai = D.USERS.filter(function (u) { return u.role === peranan; });
    modal({
      tajuk: t("login.masukSebagai") + " " + t("peranan." + peranan),
      badan:
        '<div class="pilih-senarai">' +
        senarai.map(function (u) {
          return '<button class="pilih-btn" data-pilih="' + u.id + '" type="button">' +
            '<span class="avatar">' + esc(u.initials) + "</span>" +
            "<span>" +
              '<span class="pilih-nama">' + esc(u.name) + "</span>" +
              '<span class="pilih-sub">' + esc(u.spec || u.dept || t("peranan." + peranan)) + "</span>" +
            "</span>" +
          "</button>";
        }).join("") +
        "</div>",
      kaki: '<button class="btn" data-tutup type="button">' + esc(t("login.batal")) + "</button>",
      lebar: 420
    });
  }

  function masuk(id) {
    var u = pengguna(id);
    if (!u) return;
    S.user = u;
    S.view = "dashboard";
    S.q = ""; S.fStatus = "all"; S.fSev = "all"; S.fProjek = "all";
    S.fAssign = "all"; S.fDari = ""; S.fHingga = ""; S.page = 1;
    tutupModal();
    $("#login").style.display = "none";
    $("#app").classList.add("on");
    render();
  }

  function tukarPeranan(id) {
    var u = pengguna(id);
    if (!u) return;
    S.user = u;
    S.view = "dashboard";
    S.q = ""; S.fStatus = "all"; S.fSev = "all"; S.fProjek = "all";
    S.fAssign = "all"; S.fDari = ""; S.fHingga = ""; S.page = 1;
    tutupLaci();
    tutupModal();
    $("#rs").classList.remove("on");
    $("#tbProfil").setAttribute("aria-expanded", "false");
    render();
    toast(t("toast.peranan") + " " + t("peranan." + u.role) + " — " + u.short);
  }

  function keluar() {
    S.user = null;
    S.laci = null;
    S.q = "";
    tutupLaci();
    tutupModal();
    $("#app").classList.remove("on");
    $("#login").style.display = "";
    renderLogin();
  }

  /* ------------------------------------------------------------- shell */
  function navUntuk(u) {
    var nav = [{ id: "dashboard", label: t("nav.dashboard") }];
    if (u.role === "pm") {
      nav.push({ id: "tiket", label: t("nav.semuaTiket") });
      nav.push({ id: "projek", label: t("nav.projek") });
    } else {
      nav.push({ id: "tiket", label: t("nav.tiketSaya") });
    }
    return nav;
  }

  function renderShell() {
    var u = S.user;
    $("#tbAvatar").textContent = u.initials;
    $("#tbNama").textContent = u.short;
    $("#tbPeranan").textContent = t("peranan." + u.role) + " · " + t("nav.tukarPeranan");

    $("#navUtama").innerHTML = navUntuk(u).map(function (n) {
      return '<button class="tb-tab' + (S.view === n.id ? " on" : "") + '" data-nav="' + n.id + '" type="button">' +
        esc(n.label) + "</button>";
    }).join("");

    $("#rsSenarai").innerHTML = senaraiPeranan().map(function (p) {
      var orang = D.USERS.filter(function (x) { return x.role === p.id; });
      var dalam = orang.map(function (x) {
        return '<button class="rs-orang' + (x.id === u.id ? " on" : "") + '" data-tukar-peranan="' + x.id + '" type="button">' +
          '<span class="avatar" style="width:22px;height:22px;font-size:8.5px">' + esc(x.initials) + "</span>" +
          '<span class="rs-nama">' + esc(x.name) + "</span>" +
          (x.id === u.id ? '<span class="rs-tanda">' + ikon("tanda", 12) + "</span>" : "") +
        "</button>";
      }).join("");
      return '<div class="rs-kumpulan">' +
        '<span class="lbl rs-lbl">' + esc(t("peranan." + p.id)) + "</span>" + dalam +
      "</div>";
    }).join("");

    var tajuk = $("#rs .rs-tajuk");
    if (tajuk) tajuk.textContent = t("nav.tukarPeranan");
    $("#btnTema2").title = t("nav.tukarTema");
    $("#btnBahasa").title = t("nav.tukarBahasa");
    $("#btnKeluar").title = t("nav.logKeluar");
  }

  /* ------------------------------------------------------------- penapis */
  function tiketSaya() {
    var u = S.user;
    return TICKETS.filter(function (x) {
      if (x.mergedInto) return false;
      if (u.role === "pm") return true;
      /* IT Support boleh baca semua tiket, tetapi tindakan status
         hanya pada tiket yang diagihkan kepadanya. */
      if (u.role === "it") return true;
      return x.createdBy === u.id;
    });
  }

  function tapisSenarai() {
    var q = S.q.trim().toLowerCase();
    return tiketSaya().filter(function (x) {
      if (S.fStatus !== "all" && x.status !== S.fStatus) return false;
      if (S.fSev !== "all" && x.severity !== S.fSev) return false;
      if (S.fProjek !== "all" && x.project !== S.fProjek) return false;
      if (S.fAssign !== "all") {
        if (S.fAssign === "tiada" && x.assignee) return false;
        if (S.fAssign !== "tiada" && x.assignee !== S.fAssign) return false;
      }
      if (S.fDari) {
        var dari = new Date(S.fDari + "T00:00:00");
        if (x.created < dari) return false;
      }
      if (S.fHingga) {
        var hingga = new Date(S.fHingga + "T23:59:59");
        if (x.created > hingga) return false;
      }
      if (q) {
        var teks = (x.id + " " + x.issue + " " + (x.steps || "")).toLowerCase();
        if (teks.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function nilaiSusun(x, k) {
    switch (k) {
      case "id": return x.id;
      case "issue": return x.issue.toLowerCase();
      case "project": return x.project;
      case "status": return D.STATUS[x.status].order;
      case "severity": return x.severity ? D.SEVERITY[x.severity].order : 99;
      case "assignee": return x.assignee ? D.nameOf(x.assignee).toLowerCase() : "zzz";
      case "created": return x.created.getTime();
      case "updated": return x.updated.getTime();
      default: return 0;
    }
  }

  /* ------------------------------------------------------------- paparan */
  function render() {
    renderShell();
    var el = $("#utama");
    if (S.view === "dashboard") el.innerHTML = viewDashboard();
    else if (S.view === "tiket") el.innerHTML = viewTiket();
    else if (S.view === "projek") el.innerHTML = viewProjek();
    ikat();
  }

  function lencanaStatus(st) {
    return '<span class="lencana st-' + st + '">' + esc(t("status." + st)) + "</span>";
  }

  function lencanaSev(sv) {
    if (!sv) return '<span class="lencana sev sev-normal" style="opacity:.45">—</span>';
    return '<span class="lencana sev sev-' + sv + '">' + esc(t("sev." + sv)) + "</span>";
  }

  function pilProjek(pid) {
    return '<span class="projek-pil">' + esc(D.projectById(pid).prefix) + "</span>";
  }

  /* --- dashboard: register --- */
  function viewDashboard() {
    var u = S.user;
    var senarai = tiketSaya();

    var kira = {};
    D.STATUS_ORDER.forEach(function (s) {
      kira[s] = senarai.filter(function (x) { return x.status === s; }).length;
    });

    function perluTindakan(x) {
      if (u.role === "pm") return x.status === "open";
      if (u.role === "it") return x.assignee === u.id && (x.status === "assigned" || x.status === "reopen");
      return x.createdBy === u.id && x.status === "fixed";
    }

    var tindakan = senarai.filter(perluTindakan).sort(function (a, b) {
      var sa = a.severity ? D.SEVERITY[a.severity].order : 9;
      var sb = b.severity ? D.SEVERITY[b.severity].order : 9;
      if (sa !== sb) return sa - sb;
      return b.updated - a.updated;
    });

    var menunggu = senarai.filter(function (x) {
      if (x.status === "closed") return false;
      return !perluTindakan(x);
    }).sort(function (a, b) { return b.updated - a.updated; }).slice(0, 6);

    function baris(x, no) {
      var pl = pengguna(x.createdBy);
      return '<button class="reg-baris" data-tiket="' + x.id + '" type="button">' +
        '<span class="reg-no">' + pad(no) + "</span>" +
        '<span class="reg-utama">' +
          '<span class="reg-atas">' +
            '<span class="sel-id">' + esc(x.id) + "</span>" +
            '<span class="reg-titik">·</span>' +
            '<span class="reg-projek">' + esc(D.projectById(x.project).prefix) + "</span>" +
            (x.severity ? '<span class="reg-titik">·</span>' + lencanaSev(x.severity) : "") +
          "</span>" +
          '<span class="reg-isu">' + esc(x.issue) + "</span>" +
          '<span class="reg-meta">' + esc(pl.short) + " · " + fmtTarikh(x.created) + " · " + ago(x.updated) + "</span>" +
        "</span>" +
        '<span class="reg-kanan">' + lencanaStatus(x.status) + "</span>" +
      "</button>";
    }

    var senaraiTindakan = tindakan.length
      ? tindakan.map(function (x, i) { return baris(x, i + 1); }).join("")
      : '<div class="reg-kosong">' + esc(t("dash.kosongTindakan")) + "</div>";

    var senaraiMenunggu = menunggu.length
      ? menunggu.map(function (x, i) { return baris(x, i + 1); }).join("")
      : '<div class="reg-kosong">' + esc(t("dash.kosongLain")) + "</div>";

    var jalur = D.STATUS_ORDER.map(function (st) {
      return '<button class="jalur-sel" data-tapis-status="' + st + '" type="button"' + (kira[st] > 0 ? "" : " disabled") + ">" +
        '<span class="jalur-label">' + esc(t("status." + st)) + "</span>" +
        '<span class="jalur-angka">' + kira[st] + "</span>" +
      "</button>";
    }).join("");

    var sapaan = u.role === "pm" ? t("dash.semuaTiket")
      : u.role === "it" ? t("dash.tiketIt")
      : t("dash.tiketSaya");

    var tajukTindakan = u.role === "pm" ? t("dash.menungguAgihan")
      : u.role === "it" ? t("dash.dalamTangan")
      : t("dash.menungguSah");

    return '<div class="kepala-halaman">' +
        "<div>" +
          '<span class="lbl">' + esc(t("peranan." + u.role)) + " · " + esc(u.short) + "</span>" +
          "<h1>" + esc(sapaan) + "</h1>" +
        "</div>" +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn" data-nav="tiket" type="button">' + esc(t("dash.senaraiPenuh")) + "</button>" +
          '<button class="btn btn-utama" data-baharu type="button">' + ikon("tambah", 13) + " " + esc(t("dash.tiketBaharu")) + "</button>" +
        "</div>" +
      "</div>" +
      '<div class="jalur">' + jalur + "</div>" +
      '<section class="reg">' +
        '<header class="reg-kepala">' +
          '<span class="lbl">' + esc(tajukTindakan) + "</span>" +
          '<span class="reg-bil">' + tindakan.length + "</span>" +
        "</header>" +
        '<div class="reg-badan">' + senaraiTindakan + "</div>" +
      "</section>" +
      '<section class="reg reg-redup">' +
        '<header class="reg-kepala">' +
          '<span class="lbl">' + esc(t("dash.dalamProses")) + "</span>" +
          '<span class="reg-bil">' + menunggu.length + "</span>" +
        "</header>" +
        '<div class="reg-badan">' + senaraiMenunggu + "</div>" +
      "</section>";
  }

  /* --- jadual tiket --- */
  var KOLUM = [
    { k: "id", l: "jadual.id", w: "104px" },
    { k: "issue", l: "jadual.isu", w: "" },
    { k: "project", l: "jadual.projek", w: "86px" },
    { k: "status", l: "jadual.status", w: "104px" },
    { k: "severity", l: "jadual.severity", w: "92px" },
    { k: "assignee", l: "jadual.itSupport", w: "128px" },
    { k: "created", l: "jadual.tarikh", w: "104px" }
  ];

  function viewTiket() {
    var u = S.user;
    var semua = tapisSenarai();

    semua.sort(function (a, b) {
      var va = nilaiSusun(a, S.sortKey), vb = nilaiSusun(b, S.sortKey);
      if (va < vb) return -1 * S.sortDir;
      if (va > vb) return 1 * S.sortDir;
      return 0;
    });

    var jumlah = semua.length;
    var mula = (S.page - 1) * S.size;
    var totalHal = Math.max(1, Math.ceil(jumlah / S.size));
    if (S.page > totalHal) S.page = totalHal;
    var halaman = semua.slice((S.page - 1) * S.size, S.page * S.size);

    var kepala = KOLUM.map(function (c) {
      var aktif = S.sortKey === c.k;
      var ik = aktif ? (S.sortDir === 1 ? "▲" : "▼") : "▲▼";
      return '<th class="boleh-susun' + (aktif ? " disusun" : "") + '" data-susun="' + c.k + '"' +
        (c.w ? ' style="width:' + c.w + '"' : "") + ">" +
        esc(t(c.l)) + '<span class="jd-susun-ikon">' + ik + "</span></th>";
    }).join("");

    var baris = halaman.map(function (x) {
      return '<tr data-tiket="' + x.id + '" tabindex="0">' +
        '<td data-label="' + esc(t("jadual.id")) + '"><span class="sel-id">' + esc(x.id) + "</span></td>" +
        '<td data-label="' + esc(t("jadual.isu")) + '"><span class="sel-isu">' + esc(x.issue) + "</span></td>" +
        '<td data-label="' + esc(t("jadual.projek")) + '">' + pilProjek(x.project) + "</td>" +
        '<td data-label="' + esc(t("jadual.status")) + '">' + lencanaStatus(x.status) + "</td>" +
        '<td data-label="' + esc(t("jadual.severity")) + '">' + lencanaSev(x.severity) + "</td>" +
        '<td data-label="' + esc(t("jadual.itSupport")) + '">' + (x.assignee ? esc(pengguna(x.assignee).short) : '<span style="color:var(--muted)">' + esc(t("jadual.belum")) + "</span>") + "</td>" +
        '<td data-label="' + esc(t("jadual.tarikh")) + '">' + esc(fmtTarikh(x.created)) + "</td>" +
      "</tr>";
    }).join("");

    var hal = [];
    hal.push('<button class="jd-hal-btn" data-hal="' + Math.max(1, S.page - 1) + '"' + (S.page === 1 ? " disabled" : "") + ">" + ikon("kiri", 13) + "</button>");
    for (var i = 1; i <= totalHal; i++) {
      if (totalHal > 7 && i > 2 && i < totalHal - 1 && Math.abs(i - S.page) > 1) {
        if (i === 3) hal.push('<span class="jd-titik">…</span>');
        continue;
      }
      hal.push('<button class="jd-hal-btn' + (i === S.page ? " on" : "") + '" data-hal="' + i + '">' + i + "</button>");
    }
    hal.push('<button class="jd-hal-btn" data-hal="' + Math.min(totalHal, S.page + 1) + '"' + (S.page === totalHal ? " disabled" : "") + ">" + ikon("kanan", 13) + "</button>");

    var pilihan = [10, 20, 30, 40, 50].map(function (n) {
      return '<option value="' + n + '"' + (S.size === n ? " selected" : "") + ">" + n + " " + esc(t("jadual.rekod")) + "</option>";
    }).join("");

    var opsiStatus = ['<option value="all">' + esc(t("jadual.semuaStatus")) + "</option>"].concat(
      D.STATUS_ORDER.map(function (s) {
        return '<option value="' + s + '"' + (S.fStatus === s ? " selected" : "") + ">" + esc(t("status." + s)) + "</option>";
      })
    ).join("");

    var opsiSev = ['<option value="all">' + esc(t("jadual.semuaSev")) + "</option>"].concat(
      D.SEVERITY_ORDER.map(function (s) {
        return '<option value="' + s + '"' + (S.fSev === s ? " selected" : "") + ">" + esc(t("sev." + s)) + "</option>";
      })
    ).join("");

    var opsiProjek = ['<option value="all">' + esc(t("jadual.semuaProjekOpsi")) + "</option>"].concat(
      D.PROJECTS.map(function (p) {
        return '<option value="' + p.id + '"' + (S.fProjek === p.id ? " selected" : "") + ">" + esc(p.name) + "</option>";
      })
    ).join("");

    var opsiAssign = ['<option value="all">' + esc(t("jadual.semuaIt")) + "</option>",
      '<option value="tiada"' + (S.fAssign === "tiada" ? " selected" : "") + ">" + esc(t("jadual.belumDiagih")) + "</option>"].concat(
      D.USERS.filter(function (x) { return x.role === "it"; }).map(function (x) {
        return '<option value="' + x.id + '"' + (S.fAssign === x.id ? " selected" : "") + ">" + esc(x.short) + "</option>";
      })
    ).join("");

    return '<div class="kepala-halaman">' +
        "<div>" +
          '<span class="lbl">' + esc(u.role === "pm" ? t("jadual.semuaProjek") : t("jadual.tugasanAnda")) + "</span>" +
          "<h1>" + esc(u.role === "pm" ? t("jadual.semuaTiket") : t("jadual.tiketSaya")) + "</h1>" +
        "</div>" +
        '<button class="btn btn-utama" data-baharu type="button">' + ikon("tambah", 13) + " " + esc(t("dash.tiketBaharu")) + "</button>" +
      "</div>" +

      '<div class="tapis">' +
        '<div class="medan medan-cari">' +
          "<label>" + esc(t("jadual.cari")) + "</label>" +
          '<input type="search" id="cariTiket" placeholder="' + esc(t("jadual.cariPlaceholder")) + '" value="' + esc(S.q) + '">' +
        "</div>" +
        '<div class="medan"><label>' + esc(t("jadual.status")) + '</label><select id="fStatus">' + opsiStatus + "</select></div>" +
        '<div class="medan"><label>' + esc(t("jadual.severity")) + '</label><select id="fSev">' + opsiSev + "</select></div>" +
        '<div class="medan"><label>' + esc(t("jadual.projek")) + '</label><select id="fProjek">' + opsiProjek + "</select></div>" +
        '<div class="medan"><label>' + esc(t("jadual.itSupport")) + '</label><select id="fAssign">' + opsiAssign + "</select></div>" +
        '<div class="medan medan-tarikh">' +
          "<label>" + esc(t("jadual.tarikh")) + "</label>" +
          '<div class="tarikh-julat">' +
            '<input type="date" id="fDari" value="' + esc(S.fDari) + '" aria-label="From">' +
            '<span class="tarikh-sela">—</span>' +
            '<input type="date" id="fHingga" value="' + esc(S.fHingga) + '" aria-label="To">' +
          "</div>" +
        "</div>" +
        '<div class="medan medan-tetap">' +
          "<label>&nbsp;</label>" +
          '<button class="btn btn-kecil" id="btnTarikh" type="button">' + ikon("tutup", 12) + " " + esc(t("jadual.setSemula")) + "</button>" +
        "</div>" +
      "</div>" +

      '<div class="jd">' +
        '<div class="jd-skrol">' +
          '<table><thead><tr>' + kepala + "</tr></thead><tbody>" +
          (baris || '<tr><td colspan="7"><div class="kosong">' + esc(t("jadual.tiadaHasil")) + "</div></td></tr>") +
          "</tbody></table>" +
        "</div>" +
        '<div class="jd-kaki">' +
          '<div class="jd-kiri">' +
            '<span class="jd-info">' + esc(t("jadual.memaparkan")) + " <strong>" + (jumlah ? mula + 1 : 0) + "–" + Math.min(mula + S.size, jumlah) +
              "</strong> " + esc(t("jadual.daripada")) + " <strong>" + jumlah + "</strong> " + esc(t("jadual.tiketWord")) + "</span>" +
            '<span class="jd-saiz">' + esc(t("jadual.papar")) + ' <select id="saizHal">' + pilihan + "</select></span>" +
          "</div>" +
          '<div class="jd-hal">' + hal.join("") + "</div>" +
        "</div>" +
      "</div>" +

      '<section class="legend">' +
        '<header class="legend-kepala"><span class="lbl">' + esc(t("jadual.maksudStatus")) + "</span></header>" +
        '<div class="legend-grid">' +
          D.STATUS_ORDER.map(function (st) {
            return '<div class="legend-item">' +
              '<div class="legend-atas">' + lencanaStatus(st) +
                '<span class="legend-bil">' + D.STATUS[st].order + "/6</span>" +
              "</div>" +
              '<p class="legend-teks">' + esc(t("status." + st + ".desc")) + "</p>" +
            "</div>";
          }).join("") +
        "</div>" +
      "</section>";
  }

  /* --- projek --- */
  function viewProjek() {
    var kad = D.PROJECTS.map(function (p) {
      var isi = TICKETS.filter(function (x) { return x.project === p.id && !x.mergedInto; });
      var aktif = isi.filter(function (x) { return x.status !== "closed"; }).length;
      return '<div class="kad" style="padding:18px">' +
        '<span class="projek-pil"><b>' + esc(p.prefix) + "</b></span>" +
        '<h3 style="font-size:16px;margin-top:8px">' + esc(p.name) + "</h3>" +
        '<p style="font-size:12.5px;color:var(--muted);margin:3px 0 0">' + esc(p.desc) + "</p>" +
        '<div class="meta-grid" style="grid-template-columns:1fr 1fr;margin:14px 0 0">' +
          '<div class="meta"><span class="lbl">' + esc(t("projek.aktif")) + '</span><span class="nilai">' + aktif + "</span></div>" +
          '<div class="meta"><span class="lbl">' + esc(t("projek.tutup")) + '</span><span class="nilai">' + (isi.length - aktif) + "</span></div>" +
        "</div>" +
        '<button class="btn btn-kecil" data-projek="' + p.id + '" type="button" style="margin-top:12px">' + esc(t("projek.lihat")) + "</button>" +
      "</div>";
    }).join("");

    return '<div class="kepala-halaman">' +
        "<div>" +
          '<span class="lbl">' + esc(t("projek.tajuk")) + "</span>" +
          "<h1>" + esc(t("projek.tajuk")) + "</h1>" +
          "<p>" + esc(t("projek.huraian")) + "</p>" +
        "</div>" +
        '<button class="btn btn-utama" data-projek-baharu type="button">' + ikon("tambah", 13) + " " + esc(t("projek.baharu")) + "</button>" +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">' + kad + "</div>";
  }

  /* ------------------------------------------------------------- laci */
  function bukaLaci(id) {
    S.laci = id;
    var x = tiketById(id);
    if (!x) return;

    var u = S.user;
    var pelapor = pengguna(x.createdBy);
    var assignee = x.assignee ? pengguna(x.assignee) : null;

    var lampiran = x.attachments.length ? x.attachments.map(function (a, i) {
      var imej = /\.(png|jpe?g|gif|webp)$/i.test(a.name);
      return '<button class="lampiran" data-lihat="' + x.id + '" data-idx="' + i + '" type="button">' +
        '<span class="lam-ikon">' + ikon(imej ? "imej" : "fail", 15) + "</span>" +
        '<span class="lam-teks">' +
          '<span class="lam-nama">' + esc(a.name) + "</span>" +
          '<span class="lam-meta">' + fmtSaiz(a.size) + " · " + esc(pengguna(a.by) ? pengguna(a.by).short : "") + "</span>" +
        "</span>" +
        '<span class="lam-buka">' + ikon("mata", 14) + "</span>" +
      "</button>";
    }).join("") : '<p class="lam-kosong">' + esc(t("laci.tiadaLampiran")) + "</p>";

    var gabungDari = TICKETS.filter(function (y) { return y.mergedInto === x.id; });
    var blokGabung = gabungDari.length
      ? '<div class="blok"><span class="lbl">' + esc(t("laci.digabungDari")) + "</span>" +
        gabungDari.map(function (g) {
          return '<div class="lampiran" style="cursor:default">' + ikon("gabung", 13) +
            '<span class="sel-id">' + esc(g.id) + "</span>" +
            '<span class="lam-nama" style="flex:1 1 auto;color:var(--muted)">' + esc(g.issue) + "</span></div>";
        }).join("") + "</div>"
      : "";

    var blokMergeInfo = x.mergedInto
      ? '<div class="blok"><span class="lbl">' + esc(t("laci.statusGabungan")) + '</span><div class="blok-teks">' +
        esc(t("laci.digabungKe")) + " <b>" + esc(x.mergedInto) + "</b>.</div></div>"
      : "";

    var garis = x.events.slice().sort(function (a, b) { return a.t - b.t; }).map(function (e) {
      var kelas = "";
      if (/re-open|reopen|masih berlaku|still happening|still occurs/i.test(e.text)) kelas = "danger";
      else if (/Ditutup|closed|Disahkan selesai|confirmed|resolved/i.test(e.text)) kelas = "ok";
      else if (e.kind === "status") kelas = "gold";
      return '<div class="gm-item ' + kelas + '">' +
        '<span class="gm-titik"></span>' +
        "<div>" +
          '<div class="gm-teks">' + esc(e.text) + "</div>" +
          '<div class="gm-meta"><b>' + esc(pengguna(e.actor) ? pengguna(e.actor).short : t("laci.sistem")) + "</b> · " + fmtPenuh(e.t) + "</div>" +
        "</div>" +
      "</div>";
    }).join("");

    $("#laci").innerHTML =
      '<div class="laci-kepala">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">' +
          '<span class="sel-id" style="font-size:12.5px">' + esc(x.id) + "</span>" +
          '<button class="laci-tutup" data-tutup-laci type="button">' + ikon("tutup", 14) + "</button>" +
        "</div>" +
        "<h2>" + esc(x.issue) + "</h2>" +
        '<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">' +
          lencanaStatus(x.status) + lencanaSev(x.severity) + pilProjek(x.project) +
        "</div>" +
      "</div>" +
      '<div class="laci-badan">' +
        '<div class="meta-grid">' +
          '<div class="meta"><span class="lbl">' + esc(t("laci.pelapor")) + '</span><span class="nilai">' + esc(pelapor.name) + "</span></div>" +
          '<div class="meta"><span class="lbl">' + esc(t("laci.itSupport")) + '</span><span class="nilai">' + (assignee ? esc(assignee.name) : esc(t("jadual.belumDiagih"))) + "</span></div>" +
          '<div class="meta"><span class="lbl">' + esc(t("laci.dicipta")) + '</span><span class="nilai">' + fmtPenuh(x.created) + "</span></div>" +
          '<div class="meta"><span class="lbl">' + esc(t("laci.dikemas")) + '</span><span class="nilai">' + fmtPenuh(x.updated) + "</span></div>" +
        "</div>" +

        (x.steps ? '<div class="blok"><span class="lbl">' + esc(t("laci.langkah")) + '</span><div class="blok-teks">' + esc(x.steps) + "</div></div>" : "") +

        '<div class="blok"><span class="lbl">' + esc(t("laci.lampiran")) + "</span>" + lampiran + "</div>" +
        blokGabung + blokMergeInfo +
        '<div class="blok"><span class="lbl">' + esc(t("laci.sejarah")) + '</span><div class="garis-masa">' + garis + "</div></div>" +
      "</div>" +
      '<div class="laci-kaki">' + kakiLaci(x) + "</div>";

    $("#laci").classList.add("on");
    $("#laci").setAttribute("aria-hidden", "false");
    $("#laciBg").classList.add("on");
  }

  function tutupLaci() {
    S.laci = null;
    $("#laci").classList.remove("on");
    $("#laci").setAttribute("aria-hidden", "true");
    $("#laciBg").classList.remove("on");
  }

  function kakiLaci(x) {
    var u = S.user;
    var b = [];

    if (x.status === "closed") {
      b.push('<span style="font-size:11.5px;color:var(--muted);flex:1 1 100%">' + esc(t("aksi.tutupNota")) + "</span>");
      if (u.role === "penguatkuasa") b.push('<button class="btn btn-utama" data-baharu type="button">' + esc(t("aksi.tiketBaharu")) + "</button>");
      return b.join("");
    }

    if (u.role === "pm" && (x.status === "open" || x.status === "assigned")) {
      b.push('<button class="btn btn-utama" data-agih="' + x.id + '" type="button">' +
        esc(x.assignee ? t("aksi.tukarAgih") : t("aksi.agih")) + "</button>");
    }
    if (u.role === "it" && x.status === "assigned" && x.assignee === u.id) {
      b.push('<button class="btn btn-utama" data-fixed="' + x.id + '" type="button">' + esc(t("aksi.fixed")) + "</button>");
    }
    if (u.role === "it" && x.status === "reopen" && x.assignee === u.id) {
      b.push('<button class="btn btn-utama" data-sambung="' + x.id + '" type="button">' + esc(t("aksi.sambung")) + "</button>");
    }
    if (u.role === "penguatkuasa" && x.status === "fixed" && x.createdBy === u.id) {
      b.push('<button class="btn btn-utama" data-resolved="' + x.id + '" type="button">' + ikon("tanda", 13) + " " + esc(t("aksi.selesai")) + "</button>");
      b.push('<button class="btn" data-reopen="' + x.id + '" type="button">' + esc(t("aksi.masih")) + "</button>");
    }
    if (u.role === "it" && x.status === "resolved") {
      b.push('<button class="btn btn-utama" data-closed="' + x.id + '" type="button">' + esc(t("aksi.tutup")) + "</button>");
    }
    if (u.role === "it" && !x.mergedInto && x.status !== "closed") {
      b.push('<button class="btn" data-gabung="' + x.id + '" type="button">' + ikon("gabung", 13) + " " + esc(t("aksi.gabung")) + "</button>");
    }
    b.push('<button class="btn" data-lampir="' + x.id + '" type="button">' + ikon("lampiran", 13) + " " + esc(t("aksi.lampiran")) + "</button>");
    return b.join("");
  }

  /* ------------------------------------------------------------- lampiran viewer */
  var LIHAT = { zoom: 1, x: 0, y: 0, putar: 0, seret: false, sx: 0, sy: 0, ox: 0, oy: 0 };

  function bukaLampiran(tid, idx) {
    var x = tiketById(tid);
    if (!x || !x.attachments[idx]) return;
    var a = x.attachments[idx];
    var imej = /\.(png|jpe?g|gif|webp)$/i.test(a.name);
    var teks = /\.(txt|log|md|json|csv|har)$/i.test(a.name);

    LIHAT = { zoom: 1, x: 0, y: 0, putar: 0, seret: false, sx: 0, sy: 0, ox: 0, oy: 0 };

    var isi;
    if (!a.src) {
      isi = '<div class="lihat-kosong">' + esc(t("lihat.bukanFail")) + "</div>";
    } else if (imej) {
      isi = '<div class="lihat-kanvas" id="lihatKanvas">' +
        '<img id="lihatImej" src="' + esc(a.src) + '" alt="' + esc(a.name) + '" draggable="false">' +
        "</div>";
    } else if (teks) {
      isi = '<div class="lihat-teks"><pre id="lihatTeks">…</pre></div>';
    } else {
      isi = '<div class="lihat-kosong">' + esc(t("lihat.tiadaPratonton")) + "</div>";
    }

    var alat = imej
      ? '<button class="lihat-btn" data-zoom="-" type="button" title="' + esc(t("lihat.zoomOut")) + '">' + ikon("zoomKeluar", 15) + "</button>" +
        '<span class="lihat-paras" id="lihatParas">100%</span>' +
        '<button class="lihat-btn" data-zoom="+" type="button" title="' + esc(t("lihat.zoomIn")) + '">' + ikon("zoomMasuk", 15) + "</button>" +
        '<span class="lihat-pemisah"></span>' +
        '<button class="lihat-btn" data-zoom="1" type="button" title="' + esc(t("lihat.saizAsal")) + '">1:1</button>' +
        '<button class="lihat-btn" data-zoom="putar" type="button" title="' + esc(t("lihat.putar")) + '">' + ikon("putar", 15) + "</button>"
      : "";

    $("#lihatAkar").innerHTML =
      '<div class="lihat-bg">' +
        '<div class="lihat" role="dialog" aria-modal="true">' +
          '<header class="lihat-kepala">' +
            '<div class="lihat-info">' +
              '<span class="lihat-nama">' + esc(a.name) + "</span>" +
              '<span class="lihat-meta">' + fmtSaiz(a.size) + " · " + fmtPenuh(a.at) + "</span>" +
            "</div>" +
            '<div class="lihat-alat">' + alat +
              '<span class="lihat-pemisah"></span>' +
              (a.src ? '<a class="lihat-btn" href="' + esc(a.src) + '" download="' + esc(a.name) + '" title="' + esc(t("lihat.muatTurun")) + '">' + ikon("muatTurun", 15) + "</a>" : "") +
              (a.src ? '<a class="lihat-btn" href="' + esc(a.src) + '" target="_blank" rel="noopener" title="' + esc(t("lihat.bukaTab")) + '">' + ikon("tabBaharu", 15) + "</a>" : "") +
              '<button class="lihat-btn" data-tutup-lihat type="button" title="' + esc(t("lihat.tutup")) + '">' + ikon("tutup", 15) + "</button>" +
            "</div>" +
          "</header>" +
          '<div class="lihat-badan">' + isi + "</div>" +
          (imej ? '<footer class="lihat-kaki">' + esc(t("lihat.petunjuk")) + "</footer>" : "") +
        "</div>" +
      "</div>";

    document.body.style.overflow = "hidden";
    ikatLampiran(imej, teks);
    if (teks && a.src) {
      fetch(a.src).then(function (r) { return r.text(); })
        .then(function (tt) { var el = $("#lihatTeks"); if (el) el.textContent = tt; })
        .catch(function () { var el = $("#lihatTeks"); if (el) el.textContent = "—"; });
    }
  }

  function ikatLampiran(imej, teks) {
    $$("#lihatAkar [data-tutup-lihat]").forEach(function (b) {
      b.addEventListener("click", tutupLampiran);
    });

    var latar = $("#lihatAkar .lihat-bg");
    if (latar) latar.addEventListener("click", function (e) { if (e.target === latar) tutupLampiran(); });

    if (!imej) return;

    var im = $("#lihatImej"), kanvas = $("#lihatKanvas");
    if (!im) return;

    im.addEventListener("load", function () { lukisLampiran(); });

    $$("#lihatAkar [data-zoom]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-zoom");
        if (v === "putar") LIHAT.putar = (LIHAT.putar + 90) % 360;
        else if (v === "1") { LIHAT.zoom = 1; LIHAT.x = 0; LIHAT.y = 0; }
        else if (v === "+") LIHAT.zoom = Math.min(8, LIHAT.zoom * 1.35);
        else LIHAT.zoom = Math.max(0.15, LIHAT.zoom / 1.35);
        lukisLampiran();
      });
    });

    kanvas.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = kanvas.getBoundingClientRect();
      var mx = e.clientX - r.left - r.width / 2;
      var my = e.clientY - r.top - r.height / 2;
      var lama = LIHAT.zoom;
      var baharu = e.deltaY < 0 ? Math.min(8, lama * 1.12) : Math.max(0.15, lama / 1.12);
      var nisbah = baharu / lama;
      LIHAT.x = mx - (mx - LIHAT.x) * nisbah;
      LIHAT.y = my - (my - LIHAT.y) * nisbah;
      LIHAT.zoom = baharu;
      lukisLampiran();
    }, { passive: false });

    kanvas.addEventListener("mousedown", function (e) {
      LIHAT.seret = true;
      LIHAT.sx = e.clientX; LIHAT.sy = e.clientY;
      LIHAT.ox = LIHAT.x; LIHAT.oy = LIHAT.y;
      kanvas.classList.add("seret");
    });
    window.addEventListener("mousemove", gerakLampiran);
    window.addEventListener("mouseup", lepasLampiran);

    var jarak0 = 0, zoom0 = 1;
    kanvas.addEventListener("touchstart", function (e) {
      if (e.touches.length === 2) {
        jarak0 = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        zoom0 = LIHAT.zoom;
      } else if (e.touches.length === 1) {
        LIHAT.seret = true;
        LIHAT.sx = e.touches[0].clientX; LIHAT.sy = e.touches[0].clientY;
        LIHAT.ox = LIHAT.x; LIHAT.oy = LIHAT.y;
      }
    }, { passive: true });

    kanvas.addEventListener("touchmove", function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var j = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        LIHAT.zoom = Math.min(8, Math.max(0.15, zoom0 * (j / jarak0)));
        lukisLampiran();
      } else if (LIHAT.seret && e.touches.length === 1) {
        LIHAT.x = LIHAT.ox + (e.touches[0].clientX - LIHAT.sx);
        LIHAT.y = LIHAT.oy + (e.touches[0].clientY - LIHAT.sy);
        lukisLampiran();
      }
    }, { passive: false });

    kanvas.addEventListener("touchend", function () { LIHAT.seret = false; });
  }

  function gerakLampiran(e) {
    if (!LIHAT.seret) return;
    LIHAT.x = LIHAT.ox + (e.clientX - LIHAT.sx);
    LIHAT.y = LIHAT.oy + (e.clientY - LIHAT.sy);
    lukisLampiran();
  }

  function lepasLampiran() {
    if (!LIHAT.seret) return;
    LIHAT.seret = false;
    var k = $("#lihatKanvas");
    if (k) k.classList.remove("seret");
  }

  function lukisLampiran() {
    var im = $("#lihatImej"), paras = $("#lihatParas");
    if (!im) return;
    im.style.transform =
      "translate(" + LIHAT.x + "px," + LIHAT.y + "px) " +
      "rotate(" + LIHAT.putar + "deg) " +
      "scale(" + LIHAT.zoom + ")";
    if (paras) paras.textContent = Math.round(LIHAT.zoom * 100) + "%";
  }

  function tutupLampiran() {
    $("#lihatAkar").innerHTML = "";
    document.body.style.overflow = "";
    window.removeEventListener("mousemove", gerakLampiran);
    window.removeEventListener("mouseup", lepasLampiran);
  }

  /* ------------------------------------------------------------- modal */
  function modal(opt) {
    $("#modalAkar").innerHTML =
      '<div class="modal-bg">' +
        '<div class="modal"' + (opt.lebar ? ' style="max-width:' + opt.lebar + 'px"' : "") + ' role="dialog" aria-modal="true">' +
          '<div class="modal-kepala">' +
            "<h3>" + esc(opt.tajuk) + "</h3>" +
            '<button class="laci-tutup" data-tutup type="button">' + ikon("tutup", 14) + "</button>" +
          "</div>" +
          '<div class="modal-badan">' + opt.badan + "</div>" +
          (opt.kaki ? '<div class="modal-kaki">' + opt.kaki + "</div>" : "") +
        "</div>" +
      "</div>";
    ikatModal();
  }

  function tutupModal() { $("#modalAkar").innerHTML = ""; }

  /* ------------------------------------------------------------- borang tiket */
  function modalTiket() {
    var opsiProjek = D.PROJECTS.map(function (p) {
      return '<option value="' + p.id + '">' + esc(p.name) + " · " + esc(p.prefix) + "</option>";
    }).join("");

    var opsiKategori = D.CATEGORY.map(function (c) {
      return '<option value="' + esc(c) + '">' + esc(c) + "</option>";
    }).join("");

    modal({
      tajuk: t("borang.tiketBaharu"),
      lebar: 560,
      badan:
        '<div class="borang-medan">' +
          "<label>" + esc(t("borang.projek")) + ' <span class="wajib">*</span></label>' +
          '<select id="bProjek">' + opsiProjek + "</select>" +
        "</div>" +
        '<div class="borang-medan">' +
          "<label>" + esc(t("borang.isu")) + ' <span class="wajib">*</span></label>' +
          '<textarea id="bIsu" placeholder="' + esc(t("borang.isuPlaceholder")) + '"></textarea>' +
          '<div class="ralat" id="rIsu">' + esc(t("borang.isuWajib")) + "</div>" +
        "</div>" +
        '<div class="borang-medan">' +
          "<label>" + esc(t("borang.langkah")) + "</label>" +
          '<textarea id="bLangkah" placeholder="' + esc(t("borang.langkahPlaceholder")) + '"></textarea>' +
          '<div class="hint">' + esc(t("borang.langkahHint")) + "</div>" +
        "</div>" +
        '<div class="borang-baris">' +
          '<div class="borang-medan"><label>' + esc(t("borang.kategori")) + '</label><select id="bKategori">' + opsiKategori + "</select></div>" +
          '<div class="borang-medan"><label>' + esc(t("borang.lampiran")) + '</label><input type="file" id="bFail" multiple></div>' +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">' + esc(t("borang.batal")) + "</button>" +
        '<button class="btn btn-utama" data-simpan-tiket type="button">' + esc(t("borang.cipta")) + "</button>"
    });
  }

  function simpanTiket() {
    var isu = $("#bIsu").value.trim();
    if (!isu) { $("#rIsu").classList.add("on"); $("#bIsu").focus(); return; }
    $("#rIsu").classList.remove("on");

    var pid = $("#bProjek").value;
    var langkah = $("#bLangkah").value.trim();
    var kategori = $("#bKategori").value;
    var fail = $("#bFail").files;

    var id = D.makeId(pid);
    var no = D.nextNo(pid);
    var projek = D.projectById(pid);

    var lampiran = [];
    for (var i = 0; i < fail.length; i++) {
      lampiran.push({ name: fail[i].name, size: fail[i].size, by: S.user.id, at: new Date() });
    }

    var x = {
      id: id, no: no, project: pid, issue: isu, steps: langkah,
      status: "open", severity: null, category: kategori,
      createdBy: S.user.id, assignee: null, assignedBy: null,
      created: new Date(), updated: new Date(),
      attachments: lampiran, mergedInto: null, mergedFrom: [],
      reopenCount: 0,
      events: [{ t: new Date(), actor: S.user.id, kind: "create", text: "Ticket created." }]
    };

    if (lampiran.length) {
      x.events.push({ t: new Date(), actor: S.user.id, kind: "lampiran", text: lampiran.length + " attachment(s) uploaded." });
    }

    TICKETS.unshift(x);
    tutupModal();
    toast(id + " " + t("toast.dicipta") + " " + projek.name);
    S.view = "tiket";
    S.page = 1;
    render();
    bukaLaci(id);
  }

  /* ------------------------------------------------------------- agih */
  function modalAgih(id) {
    var x = tiketById(id);
    var opsi = D.USERS.filter(function (u) { return u.role === "it"; }).map(function (u) {
      var beban = TICKETS.filter(function (y) {
        return y.assignee === u.id && ["assigned", "reopen", "fixed"].indexOf(y.status) >= 0;
      }).length;
      return '<option value="' + u.id + '"' + (x.assignee === u.id ? " selected" : "") + ">" +
        esc(u.name) + " · " + esc(u.spec) + " · " + beban + "</option>";
    }).join("");

    var sev = D.SEVERITY_ORDER.map(function (s) {
      return '<button class="sev-btn' + (x.severity === s ? " on" : "") + '" data-sev="' + s + '" type="button">' +
        esc(t("sev." + s)) + "</button>";
    }).join("");

    sevPilih = x.severity || null;

    modal({
      tajuk: t("agih.tajuk") + " " + x.id,
      lebar: 520,
      badan:
        '<div class="borang-medan">' +
          "<label>" + esc(t("agih.itSupport")) + ' <span class="wajib">*</span></label>' +
          '<select id="aPegawai">' + opsi + "</select>" +
          '<div class="hint">' + esc(t("agih.bebanHint")) + "</div>" +
        "</div>" +
        '<div class="borang-medan">' +
          "<label>" + esc(t("agih.severity")) + ' <span class="wajib">*</span></label>' +
          '<div class="sev-pilih" id="aSev">' + sev + "</div>" +
          '<div class="hint">' + esc(t("agih.severityHint")) + "</div>" +
          '<div class="ralat" id="rSev">' + esc(t("agih.severityWajib")) + "</div>" +
        "</div>" +
        '<div class="borang-medan">' +
          "<label>" + esc(t("agih.nota")) + "</label>" +
          '<textarea id="aNota" placeholder="' + esc(t("agih.notaPlaceholder")) + '"></textarea>' +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">' + esc(t("borang.batal")) + "</button>" +
        '<button class="btn btn-utama" data-simpan-agih="' + id + '" type="button">' + esc(t("agih.hantar")) + "</button>"
    });

    $$("#aSev .sev-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        sevPilih = b.getAttribute("data-sev");
        $$("#aSev .sev-btn").forEach(function (y) { y.classList.remove("on"); });
        b.classList.add("on");
        $("#rSev").classList.remove("on");
      });
    });
  }

  function simpanAgih(id) {
    var x = tiketById(id);
    if (!sevPilih) { $("#rSev").classList.add("on"); return; }

    var pegawai = $("#aPegawai").value;
    var nota = $("#aNota").value.trim();
    var lama = x.assignee;

    x.assignee = pegawai;
    x.assignedBy = S.user.id;
    x.severity = sevPilih;
    x.status = "assigned";
    x.updated = new Date();

    x.events.push({
      t: new Date(), actor: S.user.id, kind: "assign",
      text: (lama ? "Reassigned to " : "Assigned to ") + D.nameOf(pegawai) + " · severity " + t("sev." + sevPilih) + "."
    });
    if (nota) x.events.push({ t: new Date(), actor: S.user.id, kind: "nota", text: nota });

    tutupModal();
    toast(x.id + " " + t("toast.diagih") + " " + pengguna(pegawai).short);
    render();
    if (S.laci === id) bukaLaci(id);
  }

  /* ------------------------------------------------------------- status */
  function tukarStatus(id, ke, teks, jenis) {
    var x = tiketById(id);
    x.status = ke;
    x.updated = new Date();
    x.events.push({ t: new Date(), actor: S.user.id, kind: jenis || "status", text: teks });
    render();
    if (S.laci === id) bukaLaci(id);
  }

  function modalFixed(id) {
    modal({
      tajuk: t("fixed.tajuk") + " — " + id,
      badan:
        '<div class="borang-medan">' +
          "<label>" + esc(t("fixed.ringkasan")) + "</label>" +
          '<textarea id="fNota" placeholder="' + esc(t("fixed.placeholder")) + '"></textarea>' +
          '<div class="hint">' + esc(t("fixed.hint")) + "</div>" +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">' + esc(t("borang.batal")) + "</button>" +
        '<button class="btn btn-utama" data-simpan-fixed="' + id + '" type="button">' + esc(t("fixed.hantar")) + "</button>"
    });
  }

  function simpanFixed(id) {
    var nota = $("#fNota").value.trim();
    var x = tiketById(id);
    if (nota) x.events.push({ t: new Date(), actor: S.user.id, kind: "nota", text: nota });
    tutupModal();
    tukarStatus(id, "fixed", "Marked Fixed by IT support — awaiting officer verification.");
    toast(id + " " + t("toast.fixed"));
  }

  function modalGabung(id) {
    var x = tiketById(id);
    var calon = TICKETS.filter(function (y) {
      return y.project === x.project && y.id !== x.id && !y.mergedInto && y.status !== "closed";
    });

    if (!calon.length) { toast(t("gabung.tiadaCalon")); return; }

    modal({
      tajuk: t("gabung.tajuk") + " " + id,
      lebar: 560,
      badan:
        '<p class="hint" style="margin-top:0;margin-bottom:12px">' + esc(t("gabung.huraian")) + " <b>" + esc(id) + "</b>.</p>" +
        '<div class="semak">' +
        calon.map(function (y) {
          return '<label><input type="checkbox" value="' + y.id + '">' +
            '<span><b class="sel-id">' + esc(y.id) + "</b> — " + esc(y.issue) + "</span></label>";
        }).join("") +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">' + esc(t("borang.batal")) + "</button>" +
        '<button class="btn btn-utama" data-simpan-gabung="' + id + '" type="button">' + esc(t("gabung.hantar")) + "</button>"
    });
  }

  function simpanGabung(id) {
    var pilih = $$("#modalAkar input[type=checkbox]:checked").map(function (c) { return c.value; });
    if (!pilih.length) { toast(t("gabung.pilihDulu")); return; }

    var induk = tiketById(id);
    pilih.forEach(function (kid) {
      var k = tiketById(kid);
      k.mergedInto = id;
      k.updated = new Date();
      k.events.push({ t: new Date(), actor: S.user.id, kind: "gabung", text: "Merged into " + id + "." });
      induk.events.push({ t: new Date(), actor: S.user.id, kind: "gabung", text: "Received merge from " + kid + "." });
    });

    tutupModal();
    toast(pilih.length + " " + t("toast.gabung") + " " + id);
    render();
    bukaLaci(id);
  }

  function muatLampiran(id) {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.multiple = true;
    inp.onchange = function () {
      var x = tiketById(id);
      var n = 0;
      for (var i = 0; i < inp.files.length; i++) {
        x.attachments.push({ name: inp.files[i].name, size: inp.files[i].size, by: S.user.id, at: new Date() });
        n++;
      }
      if (n) {
        x.updated = new Date();
        x.events.push({ t: new Date(), actor: S.user.id, kind: "lampiran", text: n + " attachment(s) uploaded." });
        toast(n + " " + t("toast.lampiran"));
        bukaLaci(id);
      }
    };
    inp.click();
  }

  /* ------------------------------------------------------------- projek baharu */
  function modalProjek() {
    modal({
      tajuk: t("projek.baharu"),
      lebar: 480,
      badan:
        '<div class="borang-medan"><label>' + esc(t("projek.nama")) + ' <span class="wajib">*</span></label>' +
          '<input type="text" id="pNama" placeholder="Portal Tundaan"></div>' +
        '<div class="borang-medan"><label>' + esc(t("projek.prefix")) + ' <span class="wajib">*</span></label>' +
          '<input type="text" id="pPrefix" placeholder="TUND" maxlength="6" style="text-transform:uppercase">' +
          '<div class="hint">' + esc(t("projek.prefixHint")) + "</div>" +
          '<div class="ralat" id="rPrefix">' + esc(t("projek.prefixRalat")) + "</div></div>" +
        '<div class="borang-medan"><label>' + esc(t("projek.keterangan")) + "</label>" +
          '<textarea id="pDesc"></textarea></div>',
      kaki:
        '<button class="btn" data-tutup type="button">' + esc(t("borang.batal")) + "</button>" +
        '<button class="btn btn-utama" data-simpan-projek type="button">' + esc(t("projek.cipta")) + "</button>"
    });
  }

  function simpanProjek() {
    var nama = $("#pNama").value.trim();
    var prefix = $("#pPrefix").value.trim().toUpperCase();
    var desc = $("#pDesc").value.trim();

    if (!nama) { $("#pNama").focus(); return; }
    if (!/^[A-Z]{3,6}$/.test(prefix) || D.PROJECTS.some(function (p) { return p.prefix === prefix; })) {
      $("#rPrefix").classList.add("on");
      return;
    }

    D.PROJECTS.push({ id: prefix.toLowerCase(), name: nama, prefix: prefix, desc: desc || "—" });
    tutupModal();
    toast(t("toast.projek") + " — " + nama);
    render();
  }

  /* ------------------------------------------------------------- ikatan */
  function ikat() {
    $$("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () {
        S.view = b.getAttribute("data-nav");
        S.page = 1;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    $$("[data-baharu]").forEach(function (b) { b.addEventListener("click", modalTiket); });

    $$("[data-tiket]").forEach(function (b) {
      b.addEventListener("click", function () { bukaLaci(b.getAttribute("data-tiket")); });
    });

    $$("[data-projek-baharu]").forEach(function (b) { b.addEventListener("click", modalProjek); });
    $$("[data-projek]").forEach(function (b) {
      b.addEventListener("click", function () {
        S.fProjek = b.getAttribute("data-projek");
        S.view = "tiket";
        S.page = 1;
        render();
      });
    });

    $$("[data-susun]").forEach(function (th) {
      th.addEventListener("click", function () {
        var k = th.getAttribute("data-susun");
        if (S.sortKey === k) S.sortDir = -S.sortDir;
        else { S.sortKey = k; S.sortDir = 1; }
        render();
      });
    });

    $$("[data-hal]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = parseInt(b.getAttribute("data-hal"), 10);
        if (!isNaN(n)) { S.page = n; render(); }
      });
    });

    $$("[data-tapis-status]").forEach(function (b) {
      b.addEventListener("click", function () {
        S.fStatus = b.getAttribute("data-tapis-status");
        S.view = "tiket";
        S.page = 1;
        render();
      });
    });

    var cari = $("#cariTiket");
    if (cari) {
      var tm;
      cari.addEventListener("input", function () {
        clearTimeout(tm);
        tm = setTimeout(function () {
          S.q = cari.value;
          S.page = 1;
          render();
          var c2 = $("#cariTiket");
          if (c2) { c2.focus(); c2.setSelectionRange(c2.value.length, c2.value.length); }
        }, 260);
      });
    }

    var fStatus = $("#fStatus");
    if (fStatus) fStatus.addEventListener("change", function () { S.fStatus = fStatus.value; S.page = 1; render(); });

    var fSev = $("#fSev");
    if (fSev) fSev.addEventListener("change", function () { S.fSev = fSev.value; S.page = 1; render(); });

    var fProjek = $("#fProjek");
    if (fProjek) fProjek.addEventListener("change", function () { S.fProjek = fProjek.value; S.page = 1; render(); });

    var fAssign = $("#fAssign");
    if (fAssign) fAssign.addEventListener("change", function () { S.fAssign = fAssign.value; S.page = 1; render(); });

    var fDari = $("#fDari");
    if (fDari) fDari.addEventListener("change", function () { S.fDari = fDari.value; S.page = 1; render(); });

    var fHingga = $("#fHingga");
    if (fHingga) fHingga.addEventListener("change", function () { S.fHingga = fHingga.value; S.page = 1; render(); });

    var btnTarikh = $("#btnTarikh");
    if (btnTarikh) btnTarikh.addEventListener("click", function () {
      S.fDari = ""; S.fHingga = ""; S.page = 1; render();
    });

    var saiz = $("#saizHal");
    if (saiz) saiz.addEventListener("change", function () {
      S.size = parseInt(saiz.value, 10);
      S.page = 1;
      render();
    });
  }

  function ikatModal() {
    var bg = $("#modalAkar .modal-bg");
    if (bg) {
      bg.addEventListener("mousedown", function (e) { if (e.target === bg) tutupModal(); });
    }

    $$("#modalAkar [data-tutup]").forEach(function (b) {
      b.addEventListener("click", tutupModal);
    });

    var simpan = $("#modalAkar [data-simpan-tiket]");
    if (simpan) simpan.addEventListener("click", simpanTiket);

    $$("#modalAkar [data-simpan-agih]").forEach(function (b) {
      b.addEventListener("click", function () { simpanAgih(b.getAttribute("data-simpan-agih")); });
    });

    $$("#modalAkar [data-simpan-fixed]").forEach(function (b) {
      b.addEventListener("click", function () { simpanFixed(b.getAttribute("data-simpan-fixed")); });
    });

    $$("#modalAkar [data-simpan-gabung]").forEach(function (b) {
      b.addEventListener("click", function () { simpanGabung(b.getAttribute("data-simpan-gabung")); });
    });

    $$("#modalAkar [data-simpan-projek]").forEach(function (b) {
      b.addEventListener("click", simpanProjek);
    });

    $$("#modalAkar [data-pilih]").forEach(function (b) {
      b.addEventListener("click", function () { masuk(b.getAttribute("data-pilih")); });
    });
  }

  /* ------------------------------------------------------------- global */
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest(
      "[data-peranan],[data-tutup-laci],[data-agih],[data-fixed],[data-sambung]," +
      "[data-resolved],[data-reopen],[data-closed],[data-gabung],[data-lampir],[data-tukar-peranan],[data-lihat]"
    ) : null;
    if (!el) return;

    if (el.hasAttribute("data-peranan")) {
      var r = el.getAttribute("data-peranan");
      if (r === "pm") { masuk("u-pm"); return; }
      bukaPemilihPengguna(r);
      return;
    }
    if (el.hasAttribute("data-tutup-laci")) { tutupLaci(); return; }
    if (el.hasAttribute("data-tukar-peranan")) { tukarPeranan(el.getAttribute("data-tukar-peranan")); return; }
    if (el.hasAttribute("data-agih")) { modalAgih(el.getAttribute("data-agih")); return; }
    if (el.hasAttribute("data-fixed")) { modalFixed(el.getAttribute("data-fixed")); return; }

    if (el.hasAttribute("data-sambung")) {
      var ids = el.getAttribute("data-sambung");
      tukarStatus(ids, "assigned", "Work resumed by IT support.");
      toast(ids + " " + t("toast.sambung"));
      return;
    }
    if (el.hasAttribute("data-resolved")) {
      var idr = el.getAttribute("data-resolved");
      tukarStatus(idr, "resolved", "Confirmed resolved by the enforcement officer.");
      toast(idr + " " + t("toast.selesai"));
      return;
    }
    if (el.hasAttribute("data-reopen")) {
      var idre = el.getAttribute("data-reopen");
      var tk = tiketById(idre);
      tk.reopenCount = (tk.reopenCount || 0) + 1;
      tukarStatus(idre, "reopen", "Reopened — the issue still occurs after the fix.", "reopen");
      toast(idre + " " + t("toast.reopen"));
      return;
    }
    if (el.hasAttribute("data-closed")) {
      var idc = el.getAttribute("data-closed");
      tukarStatus(idc, "closed", "Closed by IT support after officer confirmation.");
      toast(idc + " " + t("toast.tutup"));
      return;
    }
    if (el.hasAttribute("data-gabung")) { modalGabung(el.getAttribute("data-gabung")); return; }
    if (el.hasAttribute("data-lampir")) { muatLampiran(el.getAttribute("data-lampir")); return; }
    if (el.hasAttribute("data-lihat")) {
      bukaLampiran(el.getAttribute("data-lihat"), parseInt(el.getAttribute("data-idx"), 10));
      return;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target && e.target.hasAttribute && e.target.hasAttribute("data-tiket")) {
      bukaLaci(e.target.getAttribute("data-tiket"));
      return;
    }
    if (e.key === "Escape") {
      if ($("#lihatAkar").innerHTML) { tutupLampiran(); return; }
      if ($("#rs") && $("#rs").classList.contains("on")) {
        $("#rs").classList.remove("on");
        $("#tbProfil").setAttribute("aria-expanded", "false");
        return;
      }
      if ($("#modalAkar").innerHTML) { tutupModal(); return; }
      if (S.laci) tutupLaci();
    }
    if ((e.key === "+" || e.key === "=") && $("#lihatImej")) {
      LIHAT.zoom = Math.min(8, LIHAT.zoom * 1.35); lukisLampiran();
    }
    if (e.key === "-" && $("#lihatImej")) {
      LIHAT.zoom = Math.max(0.15, LIHAT.zoom / 1.35); lukisLampiran();
    }
    if (e.key === "0" && $("#lihatImej")) {
      LIHAT.zoom = 1; LIHAT.x = 0; LIHAT.y = 0; lukisLampiran();
    }
  });

  /* ------------------------------------------------------------- mula */
  document.addEventListener("DOMContentLoaded", function () {
    renderLogin();

    $$(".landing-tab-btn").forEach(function (b) {
      b.addEventListener("click", function () { tukarTab(b.getAttribute("data-tab")); });
    });

    var profil = $("#tbProfil");
    profil.addEventListener("click", function (e) {
      if (e.target.closest("[data-tukar-peranan]")) return;
      var buka = $("#rs").classList.toggle("on");
      profil.setAttribute("aria-expanded", buka ? "true" : "false");
    });
    profil.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); profil.click(); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("#tbProfil")) {
        $("#rs").classList.remove("on");
        $("#tbProfil").setAttribute("aria-expanded", "false");
      }
    });

    var bt = $("#btnTema2");
    if (bt) bt.addEventListener("click", tukarTema);
    var bb = $("#btnBahasa");
    if (bb) bb.addEventListener("click", tukarBahasa);
    var bk = $("#btnKeluar");
    if (bk) bk.addEventListener("click", keluar);
    var lbg = $("#laciBg");
    if (lbg) lbg.addEventListener("click", tutupLaci);

    var lt = $("#loginTema");
    if (lt) lt.addEventListener("click", tukarTema);
    var lb = $("#loginBahasa");
    if (lb) lb.addEventListener("click", tukarBahasa);
  });

  /* untuk ujian */
  window.__sepuloz = { S: S, render: render, masuk: masuk };
})();
