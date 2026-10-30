/* ==========================================================================
   Sepuloz — aplikasi
   Peranan: Penguatkuasa · Project Manager · IT Support
   ========================================================================== */
(function () {
  "use strict";

  var D = window.DATA;
  var TICKETS = D.TICKETS;
  var SEQ = 0;
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
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function fmtMasa(d) {
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function fmtPenuh(d) {
    return fmtTarikh(d) + " " + fmtMasa(d);
  }

  function ago(d) {
    var ms = D.NOW.getTime() - d.getTime();
    if (ms < 0) ms = 0;
    var m = Math.round(ms / 60000);
    if (m < 1) return "baru sahaja";
    if (m < 60) return m + "m lalu";
    var h = Math.round(m / 60);
    if (h < 24) return h + "j lalu";
    var dd = Math.round(h / 24);
    return dd + "h lalu";
  }

  function fmtSaiz(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return Math.round(b / 1024) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  }

  function tiketById(id) {
    return TICKETS.filter(function (t) { return t.id === id; })[0] || null;
  }

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
      tanda: '<path d="M20 6 9 17l-5-5"/>'
    };
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (p[nama] || "") + "</svg>";
  }

  /* ------------------------------------------------------------- tema */
  var KUNCI_TEMA = "sepuloz_tema";

  function pasangTema(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(KUNCI_TEMA, t); } catch (e) {}
  }

  function tukarTema() {
    var kini = document.documentElement.getAttribute("data-theme");
    pasangTema(kini === "dark" ? "light" : "dark");
  }

  (function temaAwal() {
    var t = "dark";
    try { t = localStorage.getItem(KUNCI_TEMA) || "dark"; } catch (e) {}
    pasangTema(t);
  })();

  /* ------------------------------------------------------------- log masuk */
  var PERANAN = [
    {
      id: "penguatkuasa", nama: "Penguatkuasa", ikon: "tiket",
      desc: "Lapor bugs, pantau status, sahkan pembaikan."
    },
    {
      id: "pm", nama: "Project Manager", ikon: "projek",
      desc: "Tetapkan severity, agih tiket, urus projek."
    },
    {
      id: "it", nama: "IT Support", ikon: "papan",
      desc: "Baiki, tanda Fixed, gabung tiket serupa."
    }
  ];

  function renderLogin() {
    var el = $("#perananSenarai");
    el.innerHTML = PERANAN.map(function (p) {
      return '<button class="peranan-btn" data-peranan="' + p.id + '" type="button">' +
        '<span class="peranan-ikon">' + ikon(p.ikon, 15) + "</span>" +
        "<span>" +
          '<span class="peranan-nama">' + esc(p.nama) + "</span>" +
          '<span class="peranan-desc">' + esc(p.desc) + "</span>" +
        "</span>" +
      "</button>";
    }).join("");
  }

  function bukaPemilihPengguna(peranan) {
    var senarai = D.USERS.filter(function (u) { return u.role === peranan; });
    modal({
      tajuk: "Masuk sebagai " + D.ROLE_LABEL[peranan],
      badan:
        '<div class="pilih-senarai">' +
        senarai.map(function (u) {
          return '<button class="pilih-btn" data-pilih="' + u.id + '" type="button">' +
            '<span class="avatar">' + esc(u.initials) + "</span>" +
            "<span>" +
              '<span class="pilih-nama">' + esc(u.name) + "</span>" +
              '<span class="pilih-sub">' + esc(u.spec || u.dept || D.ROLE_LABEL[peranan]) + "</span>" +
            "</span>" +
          "</button>";
        }).join("") +
        "</div>",
      kaki: '<button class="btn" data-tutup type="button">Batal</button>',
      lebar: 420
    });
  }

  function masuk(id) {
    var u = pengguna(id);
    if (!u) return;
    S.user = u;
    S.view = "dashboard";
    S.q = "";
    S.fStatus = "all";
    S.fSev = "all";
    S.fProjek = "all";
    S.fAssign = "all";
    S.page = 1;
    tutupModal();
    $("#login").style.display = "none";
    $("#app").classList.add("on");
    renderShell();
    render();
  }

  function keluar() {
    S.user = null;
    S.laci = null;
    S.q = "";
    tutupLaci();
    $("#app").classList.remove("on");
    $("#login").style.display = "";
    renderLogin();
  }

  /* ------------------------------------------------------------- shell */
  function navUntuk(u) {
    var nav = [{ id: "dashboard", label: "Dashboard", ikon: "papan" }];
    if (u.role === "pm") {
      nav.push({ id: "tiket", label: "Semua Tiket", ikon: "tiket" });
      nav.push({ id: "projek", label: "Projek", ikon: "projek" });
    } else {
      nav.push({ id: "tiket", label: "Tiket Saya", ikon: "tiket" });
    }
    return nav;
  }

  function renderShell() {
    var u = S.user;
    $("#tbAvatar").textContent = u.initials;
    $("#tbNama").textContent = u.short;
    $("#tbPeranan").textContent = D.ROLE_LABEL[u.role];

    $("#navUtama").innerHTML = navUntuk(u).map(function (n) {
      return '<button class="tb-tab' + (S.view === n.id ? " on" : "") + '" data-nav="' + n.id + '" type="button">' +
        esc(n.label) + "</button>";
    }).join("");
  }

  /* ------------------------------------------------------------- penapis */
  function tiketSaya() {
    var u = S.user;
    return TICKETS.filter(function (t) {
      if (t.mergedInto) return false;
      if (u.role === "pm") return true;
      /* IT Support nampak semua tiket (boleh baca), tetapi tindakan
         status hanya dibenarkan pada tiket yang diagihkan kepadanya. */
      if (u.role === "it") return true;
      return t.createdBy === u.id;
    });
  }

  function tapisSenarai() {
    var q = S.q.trim().toLowerCase();
    return tiketSaya().filter(function (t) {
      if (S.fStatus !== "all" && t.status !== S.fStatus) return false;
      if (S.fSev !== "all" && t.severity !== S.fSev) return false;
      if (S.fProjek !== "all" && t.project !== S.fProjek) return false;
      if (S.fAssign !== "all") {
        if (S.fAssign === "tiada" && t.assignee) return false;
        if (S.fAssign !== "tiada" && t.assignee !== S.fAssign) return false;
      }
      if (q) {
        var teks = (t.id + " " + t.issue + " " + (t.steps || "")).toLowerCase();
        if (teks.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function nilaiSusun(t, k) {
    switch (k) {
      case "id": return t.id;
      case "issue": return t.issue.toLowerCase();
      case "project": return t.project;
      case "status": return D.STATUS[t.status].order;
      case "severity": return t.severity ? D.SEVERITY[t.severity].order : 99;
      case "assignee": return t.assignee ? D.nameOf(t.assignee).toLowerCase() : "zzz";
      case "createdBy": return D.nameOf(t.createdBy).toLowerCase();
      case "updated": return t.updated.getTime();
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
    return '<span class="lencana st-' + st + '">' + esc(D.STATUS[st].label) + "</span>";
  }

  function lencanaSev(sv) {
    if (!sv) return '<span class="lencana sev sev-normal" style="opacity:.45">—</span>';
    return '<span class="lencana sev sev-' + sv + '">' + esc(D.SEVERITY[sv].label) + "</span>";
  }

  function pilProjek(pid) {
    var p = D.projectById(pid);
    return '<span class="projek-pil">' + esc(p.prefix) + "</span>";
  }

  /* --- dashboard --- */
  function viewDashboard() {
    var u = S.user;
    var senarai = tiketSaya();
    var kira = {};
    D.STATUS_ORDER.forEach(function (s) { kira[s] = senarai.filter(function (t) { return t.status === s; }).length; });

    var kad = D.STATUS_ORDER.map(function (s) {
      var cls = s === "reopen" ? "bahaya" : (s === "closed" ? "ok" : (s === "open" || s === "assigned" ? "aktif" : ""));
      return '<div class="stat ' + cls + '">' +
        '<span class="lbl">' + esc(D.STATUS[s].label) + "</span>" +
        "<strong>" + kira[s] + "</strong></div>";
    }).join("");

    var papan = D.STATUS_ORDER.map(function (s) {
      var isi = senarai.filter(function (t) { return t.status === s; })
        .sort(function (a, b) { return b.updated - a.updated; });
      return '<section class="kolum">' +
        '<div class="kolum-kepala">' +
          '<span class="lbl">' + esc(D.STATUS[s].label) + "</span>" +
          '<span class="kolum-bil">' + isi.length + "</span>" +
        "</div>" +
        '<div class="kolum-badan">' +
          (isi.length ? isi.map(function (t) {
            return '<button class="kad-tiket" data-tiket="' + t.id + '" type="button">' +
              '<span class="kt-id">' + esc(t.id) + "</span>" +
              '<span class="kt-isu">' + esc(t.issue) + "</span>" +
              '<span class="kt-bawah">' +
                lencanaSev(t.severity) +
                '<span class="kt-masa">' + ago(t.updated) + "</span>" +
              "</span>" +
            "</button>";
          }).join("") : '<div class="kosong" style="padding:18px 8px;font-size:11.5px">Tiada tiket</div>') +
        "</div>" +
      "</section>";
    }).join("");

    var sapaan = u.role === "pm" ? "Semua tiket dalam pantauan anda."
      : u.role === "it" ? "Tiket yang diagihkan kepada anda. Semua tiket projek boleh dibaca."
      : "Tiket yang anda laporkan.";

    return '<div class="kepala-halaman">' +
        "<div>" +
          '<span class="lbl">' + esc(D.ROLE_LABEL[u.role]) + "</span>" +
          "<h1>Dashboard</h1>" +
          "<p>" + esc(sapaan) + "</p>" +
        "</div>" +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn" data-nav="tiket" type="button">Senarai penuh</button>' +
          '<button class="btn btn-utama" data-baharu type="button">' + ikon("tambah", 13) + " Tiket baharu</button>" +
        "</div>" +
      "</div>" +
      '<div class="stat-grid">' + kad + "</div>" +
      '<div class="board">' + papan + "</div>";
  }

  /* --- jadual tiket --- */
  var KOLUM = [
    { k: "id", t: "ID", w: "104px" },
    { k: "issue", t: "Isu", w: "" },
    { k: "project", t: "Projek", w: "86px" },
    { k: "status", t: "Status", w: "104px" },
    { k: "severity", t: "Severity", w: "92px" },
    { k: "assignee", t: "IT Support", w: "128px" },
    { k: "updated", t: "Dikemas kini", w: "112px" }
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
    var halaman = semua.slice(mula, mula + S.size);
    var totalHal = Math.max(1, Math.ceil(jumlah / S.size));
    if (S.page > totalHal) { S.page = totalHal; halaman = semua.slice((S.page - 1) * S.size, S.page * S.size); }

    var kepala = KOLUM.map(function (c) {
      var aktif = S.sortKey === c.k;
      var ik = aktif ? (S.sortDir === 1 ? "▲" : "▼") : "▲▼";
      return '<th class="boleh-susun' + (aktif ? " disusun" : "") + '" data-susun="' + c.k + '"' +
        (c.w ? ' style="width:' + c.w + '"' : "") + ">" +
        esc(c.t) + '<span class="jd-susun-ikon">' + ik + "</span></th>";
    }).join("");

    var baris = halaman.map(function (t) {
      return '<tr data-tiket="' + t.id + '" tabindex="0">' +
        '<td data-label="ID"><span class="sel-id">' + esc(t.id) + "</span></td>" +
        '<td data-label="Isu"><span class="sel-isu">' + esc(t.issue) + "</span></td>" +
        '<td data-label="Projek">' + pilProjek(t.project) + "</td>" +
        '<td data-label="Status">' + lencanaStatus(t.status) + "</td>" +
        '<td data-label="Severity">' + lencanaSev(t.severity) + "</td>" +
        '<td data-label="IT Support">' + (t.assignee ? esc(pengguna(t.assignee).short) : '<span style="color:var(--muted)">Belum</span>') + "</td>" +
        '<td data-label="Dikemas kini">' + esc(fmtTarikh(t.updated)) + "</td>" +
      "</tr>";
    }).join("");

    /* penomboran */
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
      return '<option value="' + n + '"' + (S.size === n ? " selected" : "") + ">" + n + " rekod</option>";
    }).join("");

    var opsiStatus = ['<option value="all">Semua status</option>'].concat(
      D.STATUS_ORDER.map(function (s) {
        return '<option value="' + s + '"' + (S.fStatus === s ? " selected" : "") + ">" + D.STATUS[s].label + "</option>";
      })
    ).join("");

    var opsiSev = ['<option value="all">Semua severity</option>'].concat(
      D.SEVERITY_ORDER.map(function (s) {
        return '<option value="' + s + '"' + (S.fSev === s ? " selected" : "") + ">" + D.SEVERITY[s].label + "</option>";
      })
    ).join("");

    var opsiProjek = ['<option value="all">Semua projek</option>'].concat(
      D.PROJECTS.map(function (p) {
        return '<option value="' + p.id + '"' + (S.fProjek === p.id ? " selected" : "") + ">" + esc(p.name) + "</option>";
      })
    ).join("");

    var opsiAssign = ['<option value="all">Semua IT Support</option>', '<option value="tiada"' + (S.fAssign === "tiada" ? " selected" : "") + ">Belum diagih</option>"].concat(
      D.USERS.filter(function (x) { return x.role === "it"; }).map(function (x) {
        return '<option value="' + x.id + '"' + (S.fAssign === x.id ? " selected" : "") + ">" + esc(x.short) + "</option>";
      })
    ).join("");

    return '<div class="kepala-halaman">' +
        "<div>" +
          '<span class="lbl">' + (u.role === "pm" ? "Semua projek" : "Tugasan anda") + "</span>" +
          "<h1>" + (u.role === "pm" ? "Semua Tiket" : "Tiket Saya") + "</h1>" +
        "</div>" +
        '<button class="btn btn-utama" data-baharu type="button">' + ikon("tambah", 13) + " Tiket baharu</button>" +
      "</div>" +

      '<div class="tapis">' +
        '<div class="medan medan-cari">' +
          "<label>Cari</label>" +
          '<input type="search" id="cariTiket" placeholder="ID tiket, isu atau langkah…" value="' + esc(S.q) + '">' +
        "</div>" +
        '<div class="medan"><label>Status</label><select id="fStatus">' + opsiStatus + "</select></div>" +
        '<div class="medan"><label>Severity</label><select id="fSev">' + opsiSev + "</select></div>" +
        '<div class="medan"><label>Projek</label><select id="fProjek">' + opsiProjek + "</select></div>" +
        '<div class="medan"><label>IT Support</label><select id="fAssign">' + opsiAssign + "</select></div>" +
      "</div>" +

      '<div class="jd">' +
        '<div class="jd-skrol">' +
          '<table><thead><tr>' + kepala + "</tr></thead><tbody>" +
          (baris || '<tr><td colspan="7"><div class="kosong">Tiada tiket sepadan dengan tapisan ini.</div></td></tr>') +
          "</tbody></table>" +
        "</div>" +
        '<div class="jd-kaki">' +
          '<div class="jd-kiri">' +
            '<span class="jd-info">Memaparkan <strong>' + (jumlah ? mula + 1 : 0) + "–" + Math.min(mula + S.size, jumlah) +
              "</strong> daripada <strong>" + jumlah + "</strong> tiket</span>" +
            '<span class="jd-saiz">Papar <select id="saizHal">' + pilihan + "</select></span>" +
          "</div>" +
          '<div class="jd-hal">' + hal.join("") + "</div>" +
        "</div>" +
      "</div>";
  }

  /* --- projek --- */
  function viewProjek() {
    var kad = D.PROJECTS.map(function (p) {
      var isi = TICKETS.filter(function (t) { return t.project === p.id && !t.mergedInto; });
      var aktif = isi.filter(function (t) { return t.status !== "closed"; }).length;
      var tutup = isi.length - aktif;
      return '<div class="kad" style="padding:18px">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">' +
          '<div><span class="projek-pil"><b>' + esc(p.prefix) + "</b></span>" +
          '<h3 style="font-size:16px;margin-top:8px">' + esc(p.name) + "</h3>" +
          '<p style="font-size:12.5px;color:var(--muted);margin:3px 0 0">' + esc(p.desc) + "</p></div>" +
        "</div>" +
        '<div class="meta-grid" style="grid-template-columns:1fr 1fr;margin:14px 0 0">' +
          '<div class="meta"><span class="lbl">Aktif</span><span class="nilai">' + aktif + "</span></div>" +
          '<div class="meta"><span class="lbl">Tutup</span><span class="nilai">' + tutup + "</span></div>" +
        "</div>" +
        '<button class="btn btn-kecil" data-projek="' + p.id + '" type="button" style="margin-top:12px">Lihat board</button>' +
      "</div>";
    }).join("");

    return '<div class="kepala-halaman">' +
        "<div>" +
          '<span class="lbl">Struktur</span>' +
          "<h1>Projek</h1>" +
          "<p>Setiap projek ada board dan prefix tiket sendiri. Workflow status sama untuk semua.</p>" +
        "</div>" +
        '<button class="btn btn-utama" data-projek-baharu type="button">' + ikon("tambah", 13) + " Projek baharu</button>" +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">' + kad + "</div>";
  }

  /* ------------------------------------------------------------- laci */
  function bukaLaci(id) {
    S.laci = id;
    var t = tiketById(id);
    if (!t) return;

    var u = S.user;
    var pelapor = pengguna(t.createdBy);
    var assignee = t.assignee ? pengguna(t.assignee) : null;

    var lampiran = t.attachments.length ? t.attachments.map(function (a) {
      return '<div class="lampiran">' + ikon("lampiran", 13) +
        '<span style="flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(a.name) + "</span>" +
        '<span style="color:var(--muted);font-size:11px">' + fmtSaiz(a.size) + "</span></div>";
    }).join("") : '<p style="font-size:12px;color:var(--muted);margin:0">Tiada lampiran.</p>';

    var gabungDari = TICKETS.filter(function (x) { return x.mergedInto === t.id; });
    var blokGabung = gabungDari.length
      ? '<div class="blok"><span class="lbl">Digabung dari</span>' +
        gabungDari.map(function (g) {
          return '<div class="lampiran">' + ikon("gabung", 13) + '<span class="sel-id">' + esc(g.id) + "</span>" +
            '<span style="flex:1 1 auto;color:var(--muted);font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(g.issue) + "</span></div>";
        }).join("") + "</div>"
      : "";

    var blokMergeInfo = t.mergedInto
      ? '<div class="blok"><span class="lbl">Status gabungan</span><div class="blok-teks">Tiket ini telah digabung ke <b>' + esc(t.mergedInto) + "</b>.</div></div>"
      : "";

    var garis = t.events.slice().sort(function (a, b) { return a.t - b.t; }).map(function (e) {
      var kelas = e.kind === "status" ? "gold" : (e.kind === "assign" ? "" : "");
      if (/re-open|masih berlaku/i.test(e.text)) kelas = "danger";
      if (/Ditutup|Disahkan selesai/i.test(e.text)) kelas = "ok";
      return '<div class="gm-item ' + kelas + '">' +
        '<span class="gm-titik"></span>' +
        "<div>" +
          '<div class="gm-teks">' + esc(e.text) + "</div>" +
          '<div class="gm-meta"><b>' + esc(pengguna(e.actor) ? pengguna(e.actor).short : "Sistem") + "</b> · " + fmtPenuh(e.t) + "</div>" +
        "</div>" +
      "</div>";
    }).join("");

    $("#laci").innerHTML =
      '<div class="laci-kepala">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">' +
          '<span class="sel-id" style="font-size:12.5px">' + esc(t.id) + "</span>" +
          '<button class="laci-tutup" data-tutup-laci type="button">' + ikon("tutup", 14) + "</button>" +
        "</div>" +
        "<h2>" + esc(t.issue) + "</h2>" +
        '<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">' +
          lencanaStatus(t.status) + lencanaSev(t.severity) + pilProjek(t.project) +
        "</div>" +
      "</div>" +
      '<div class="laci-badan">' +
        '<div class="meta-grid">' +
          '<div class="meta"><span class="lbl">Pelapor</span><span class="nilai">' + esc(pelapor.name) + "</span></div>" +
          '<div class="meta"><span class="lbl">IT Support</span><span class="nilai">' + (assignee ? esc(assignee.name) : "Belum diagih") + "</span></div>" +
          '<div class="meta"><span class="lbl">Dicipta</span><span class="nilai">' + fmtPenuh(t.created) + "</span></div>" +
          '<div class="meta"><span class="lbl">Dikemas kini</span><span class="nilai">' + fmtPenuh(t.updated) + "</span></div>" +
        "</div>" +

        (t.steps ? '<div class="blok"><span class="lbl">Langkah untuk hasilkan semula</span><div class="blok-teks">' + esc(t.steps) + "</div></div>" : "") +

        '<div class="blok"><span class="lbl">Lampiran</span>' + lampiran + "</div>" +
        blokGabung +
        blokMergeInfo +

        '<div class="blok"><span class="lbl">Sejarah</span><div class="garis-masa">' + garis + "</div></div>" +
      "</div>" +
      '<div class="laci-kaki">' + kakiLaci(t) + "</div>";

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

  function kakiLaci(t) {
    var u = S.user;
    var b = [];
    var tutup = t.status === "closed";

    if (tutup) {
      b.push('<span style="font-size:11.5px;color:var(--muted);flex:1 1 100%">Tiket ditutup. Jika isu berulang, cipta tiket baharu.</span>');
      if (u.role === "penguatkuasa") b.push('<button class="btn btn-utama" data-baharu type="button">Tiket baharu</button>');
      return b.join("");
    }

    if (u.role === "pm" && (t.status === "open" || t.status === "assigned")) {
      b.push('<button class="btn btn-utama" data-agih="' + t.id + '" type="button">' +
        (t.assignee ? "Tukar agihan" : "Agih kepada IT Support") + "</button>");
    }

    if (u.role === "it" && t.status === "assigned" && t.assignee === u.id) {
      b.push('<button class="btn btn-utama" data-fixed="' + t.id + '" type="button">Tanda Fixed</button>');
    }

    if (u.role === "it" && t.status === "reopen" && t.assignee === u.id) {
      b.push('<button class="btn btn-utama" data-sambung="' + t.id + '" type="button">Sambung kerja</button>');
    }

    if (u.role === "penguatkuasa" && t.status === "fixed" && t.createdBy === u.id) {
      b.push('<button class="btn btn-utama" data-resolved="' + t.id + '" type="button">' + ikon("tanda", 13) + " Isu selesai</button>");
      b.push('<button class="btn" data-reopen="' + t.id + '" type="button">Masih berlaku</button>');
    }

    if (u.role === "it" && t.status === "resolved") {
      b.push('<button class="btn btn-utama" data-closed="' + t.id + '" type="button">Tutup tiket</button>');
    }

    if (u.role === "it" && !t.mergedInto && t.status !== "closed") {
      b.push('<button class="btn" data-gabung="' + t.id + '" type="button">' + ikon("gabung", 13) + " Gabung</button>");
    }

    b.push('<button class="btn" data-lampir="' + t.id + '" type="button">' + ikon("lampiran", 13) + " Lampiran</button>");

    return b.join("");
  }

  /* ------------------------------------------------------------- modal */
  function modal(opt) {
    var akar = $("#modalAkar");
    akar.innerHTML =
      '<div class="modal-bg" data-latar>' +
        '<div class="modal"' + (opt.lebar ? ' style="max-width:' + opt.lebar + 'px"' : "") + ' role="dialog" aria-modal="true">' +
          '<div class="modal-kepala">' +
            "<h3>" + esc(opt.tajuk) + "</h3>" +
            '<button class="laci-tutup" data-tutup type="button">' + ikon("tutup", 14) + "</button>" +
          "</div>" +
          '<div class="modal-badan">' + opt.badan + "</div>" +
          (opt.kaki ? '<div class="modal-kaki">' + opt.kaki + "</div>" : "") +
        "</div>" +
      "</div>";
    ikatModal(opt);
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
      tajuk: "Tiket baharu",
      lebar: 560,
      badan:
        '<div class="borang-medan">' +
          '<label>Projek <span class="wajib">*</span></label>' +
          '<select id="bProjek">' + opsiProjek + "</select>" +
        "</div>" +
        '<div class="borang-medan">' +
          '<label>Isu <span class="wajib">*</span></label>' +
          '<textarea id="bIsu" placeholder="Contoh: Senarai kompaun tidak memaparkan rekod melebihi 50 baris"></textarea>' +
          '<div class="ralat" id="rIsu">Isu wajib diisi.</div>' +
        "</div>" +
        '<div class="borang-medan">' +
          "<label>Langkah untuk hasilkan semula</label>" +
          '<textarea id="bLangkah" placeholder="1. Buka Akaun Saya&#10;2. Tapis kompaun 2026&#10;3. Skrol ke bawah"></textarea>' +
          '<div class="hint">Tidak wajib, tetapi sangat membantu IT Support.</div>' +
        "</div>" +
        '<div class="borang-baris">' +
          '<div class="borang-medan"><label>Kategori</label><select id="bKategori">' + opsiKategori + "</select></div>" +
          '<div class="borang-medan"><label>Lampiran</label><input type="file" id="bFail" multiple></div>' +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">Batal</button>' +
        '<button class="btn btn-utama" data-simpan-tiket type="button">Cipta tiket</button>'
    });
  }

  function simpanTiket() {
    var isu = $("#bIsu").value.trim();
    var ralat = $("#rIsu");
    if (!isu) { ralat.classList.add("on"); $("#bIsu").focus(); return; }
    ralat.classList.remove("on");

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

    var t = {
      id: id,
      no: no,
      project: pid,
      issue: isu,
      steps: langkah,
      status: "open",
      severity: null,
      category: kategori,
      createdBy: S.user.id,
      assignee: null,
      assignedBy: null,
      created: new Date(),
      updated: new Date(),
      attachments: lampiran,
      mergedInto: null,
      mergedFrom: [],
      reopenCount: 0,
      events: [{ t: new Date(), actor: S.user.id, kind: "create", text: "Tiket dicipta." }]
    };

    if (lampiran.length) {
      t.events.push({
        t: new Date(), actor: S.user.id, kind: "lampiran",
        text: "Memuat naik " + lampiran.length + " lampiran."
      });
    }

    TICKETS.unshift(t);
    tutupModal();
    toast(id + " dicipta di " + projek.name);
    S.view = "tiket";
    S.page = 1;
    render();
    bukaLaci(id);
  }

  /* ------------------------------------------------------------- agih + severity */
  function modalAgih(id) {
    var t = tiketById(id);
    var opsi = D.USERS.filter(function (u) { return u.role === "it"; }).map(function (u) {
      var beban = TICKETS.filter(function (x) {
        return x.assignee === u.id && ["assigned", "reopen", "fixed"].indexOf(x.status) >= 0;
      }).length;
      return '<option value="' + u.id + '"' + (t.assignee === u.id ? " selected" : "") + ">" +
        esc(u.name) + " · " + esc(u.spec) + " · " + beban + " aktif</option>";
    }).join("");

    var sev = D.SEVERITY_ORDER.map(function (s) {
      return '<button class="sev-btn' + (t.severity === s ? " on" : "") + '" data-sev="' + s + '" type="button">' +
        esc(D.SEVERITY[s].label) + "</button>";
    }).join("");

    modal({
      tajuk: "Agih " + t.id,
      lebar: 520,
      badan:
        '<div class="borang-medan">' +
          "<label>IT Support <span class=\"wajib\">*</span></label>" +
          '<select id="aPegawai">' + opsi + "</select>" +
          '<div class="hint">Beban aktif dipaparkan supaya agihan seimbang.</div>' +
        "</div>" +
        '<div class="borang-medan">' +
          "<label>Severity <span class=\"wajib\">*</span></label>" +
          '<div class="sev-pilih" id="aSev">' + sev + "</div>" +
          '<div class="hint">Critical = sistem tidak boleh diguna. KIV = diterima tetapi ditangguh.</div>' +
          '<div class="ralat" id="rSev">Pilih severity sebelum agih.</div>' +
        "</div>" +
        '<div class="borang-medan">' +
          "<label>Nota untuk IT Support</label>" +
          '<textarea id="aNota" placeholder="Konteks tambahan, keutamaan bisnes, dsb."></textarea>' +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">Batal</button>' +
        '<button class="btn btn-utama" data-simpan-agih="' + id + '" type="button">Agihkan</button>'
    });

    sevPilih = t.severity || null;
    var pilih = sevPilih;
    $$("#aSev .sev-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        pilih = b.getAttribute("data-sev");
        sevPilih = pilih;
        $$("#aSev .sev-btn").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        $("#rSev").classList.remove("on");
      });
    });

  }

  function simpanAgih(id) {
    var t = tiketById(id);
    var sev = sevPilih;
    var pegawai = $("#aPegawai").value;
    var nota = $("#aNota").value.trim();

    if (!sev) { $("#rSev").classList.add("on"); return; }

    var lama = t.assignee;
    t.assignee = pegawai;
    t.assignedBy = S.user.id;
    t.severity = sev;
    t.status = "assigned";
    t.updated = new Date();

    t.events.push({
      t: new Date(), actor: S.user.id, kind: "assign",
      text: (lama ? "Agihan ditukar kepada " : "Ditugaskan kepada ") + D.nameOf(pegawai) + " · severity " + D.SEVERITY[sev].label + "."
    });
    if (nota) {
      t.events.push({ t: new Date(), actor: S.user.id, kind: "nota", text: nota });
    }

    tutupModal();
    toast(t.id + " diagih kepada " + pengguna(pegawai).short);
    render();
    if (S.laci === id) bukaLaci(id);
  }

  /* ------------------------------------------------------------- tindakan status */
  function tukarStatus(id, ke, teks, jenis) {
    var t = tiketById(id);
    t.status = ke;
    t.updated = new Date();
    t.events.push({ t: new Date(), actor: S.user.id, kind: jenis || "status", text: teks });
    render();
    if (S.laci === id) bukaLaci(id);
  }

  function modalFixed(id) {
    var t = tiketById(id);
    modal({
      tajuk: "Tanda " + id + " sebagai Fixed",
      badan:
        '<div class="borang-medan">' +
          "<label>Ringkasan pembaikan</label>" +
          '<textarea id="fNota" placeholder="Apa yang diubah dan mengapa ia menyelesaikan isu."></textarea>' +
          '<div class="hint">Penguatkuasa akan nampak nota ini sebelum uji semula.</div>' +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">Batal</button>' +
        '<button class="btn btn-utama" data-simpan-fixed="' + id + '" type="button">Tanda Fixed</button>'
    });
  }

  function simpanFixed(id) {
    var nota = $("#fNota").value.trim();
    var t = tiketById(id);
    if (nota) t.events.push({ t: new Date(), actor: S.user.id, kind: "nota", text: nota });
    tutupModal();
    tukarStatus(id, "fixed", "Ditanda Fixed oleh IT Support — menunggu pengesahan Penguatkuasa.");
    toast(id + " ditanda Fixed");
  }

  function modalGabung(id) {
    var t = tiketById(id);
    var calon = TICKETS.filter(function (x) {
      return x.project === t.project && x.id !== t.id && !x.mergedInto && x.status !== "closed";
    });

    if (!calon.length) {
      toast("Tiada tiket lain dalam projek ini untuk digabung");
      return;
    }

    modal({
      tajuk: "Gabung ke " + id,
      lebar: 560,
      badan:
        '<p class="hint" style="margin-top:0;margin-bottom:12px">Pilih tiket yang isunya sama. Ia akan disembunyikan dari senarai dan dipautkan ke ' + esc(id) + ".</p>" +
        '<div class="semak">' +
        calon.map(function (x) {
          return '<label><input type="checkbox" value="' + x.id + '">' +
            '<span><b class="sel-id">' + esc(x.id) + "</b> — " + esc(x.issue) + "</span></label>";
        }).join("") +
        "</div>",
      kaki:
        '<button class="btn" data-tutup type="button">Batal</button>' +
        '<button class="btn btn-utama" data-simpan-gabung="' + id + '" type="button">Gabungkan</button>'
    });
  }

  function simpanGabung(id) {
    var pilih = $$("#modalAkar input[type=checkbox]:checked").map(function (c) { return c.value; });
    if (!pilih.length) { toast("Pilih sekurang-kurangnya satu tiket"); return; }

    var induk = tiketById(id);
    pilih.forEach(function (kid) {
      var k = tiketById(kid);
      k.mergedInto = id;
      k.updated = new Date();
      k.events.push({ t: new Date(), actor: S.user.id, kind: "gabung", text: "Digabung ke " + id + "." });
      induk.events.push({ t: new Date(), actor: S.user.id, kind: "gabung", text: "Menerima gabungan dari " + kid + "." });
    });

    tutupModal();
    toast(pilih.length + " tiket digabung ke " + id);
    render();
    bukaLaci(id);
  }

  function muatLampiran(id) {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.multiple = true;
    inp.onchange = function () {
      var t = tiketById(id);
      var n = 0;
      for (var i = 0; i < inp.files.length; i++) {
        t.attachments.push({ name: inp.files[i].name, size: inp.files[i].size, by: S.user.id, at: new Date() });
        n++;
      }
      if (n) {
        t.updated = new Date();
        t.events.push({ t: new Date(), actor: S.user.id, kind: "lampiran", text: "Memuat naik " + n + " lampiran." });
        toast(n + " lampiran dimuat naik");
        bukaLaci(id);
      }
    };
    inp.click();
  }

  /* ------------------------------------------------------------- projek baharu */
  function modalProjek() {
    modal({
      tajuk: "Projek baharu",
      lebar: 480,
      badan:
        '<div class="borang-medan"><label>Nama projek <span class="wajib">*</span></label>' +
          '<input type="text" id="pNama" placeholder="Contoh: Portal Tundaan"></div>' +
        '<div class="borang-medan"><label>Prefix tiket <span class="wajib">*</span></label>' +
          '<input type="text" id="pPrefix" placeholder="Contoh: TUND" maxlength="6" style="text-transform:uppercase">' +
          '<div class="hint">3–6 huruf. Contoh: TUND-001, TUND-002.</div>' +
          '<div class="ralat" id="rPrefix">Prefix mesti 3–6 huruf dan belum digunakan.</div></div>' +
        '<div class="borang-medan"><label>Keterangan</label>' +
          '<textarea id="pDesc" placeholder="Ringkasan ringkas projek ini."></textarea></div>',
      kaki:
        '<button class="btn" data-tutup type="button">Batal</button>' +
        '<button class="btn btn-utama" data-simpan-projek type="button">Cipta projek</button>'
    });
  }

  function simpanProjek() {
    var nama = $("#pNama").value.trim();
    var prefix = $("#pPrefix").value.trim().toUpperCase();
    var desc = $("#pDesc").value.trim();
    var ralat = $("#rPrefix");

    if (!nama) { $("#pNama").focus(); return; }
    if (!/^[A-Z]{3,6}$/.test(prefix) || D.PROJECTS.some(function (p) { return p.prefix === prefix; })) {
      ralat.classList.add("on");
      return;
    }

    var id = prefix.toLowerCase();
    D.PROJECTS.push({ id: id, name: nama, prefix: prefix, desc: desc || "—" });
    tutupModal();
    toast("Projek " + nama + " dicipta");
    render();
  }

  /* ------------------------------------------------------------- ikatan */
  function ikat() {
    /* navigasi */
    $$("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () {
        S.view = b.getAttribute("data-nav");
        S.page = 1;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    /* tiket baharu */
    $$("[data-baharu]").forEach(function (b) {
      b.addEventListener("click", modalTiket);
    });

    /* buka laci dari board */
    $$("[data-tiket]").forEach(function (b) {
      b.addEventListener("click", function () { bukaLaci(b.getAttribute("data-tiket")); });
    });

    /* projek */
    $$("[data-projek-baharu]").forEach(function (b) { b.addEventListener("click", modalProjek); });
    $$("[data-projek]").forEach(function (b) {
      b.addEventListener("click", function () {
        S.fProjek = b.getAttribute("data-projek");
        S.view = "tiket";
        S.page = 1;
        render();
      });
    });

    /* susunan */
    $$("[data-susun]").forEach(function (th) {
      th.addEventListener("click", function () {
        var k = th.getAttribute("data-susun");
        if (S.sortKey === k) S.sortDir = -S.sortDir;
        else { S.sortKey = k; S.sortDir = 1; }
        render();
      });
    });

    /* halaman */
    $$("[data-hal]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = parseInt(b.getAttribute("data-hal"), 10);
        if (!isNaN(n)) { S.page = n; render(); }
      });
    });

    /* penapis */
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
      bg.addEventListener("mousedown", function (e) {
        if (e.target === bg) tutupModal();
      });
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

  /* ------------------------------------------------------------- ikatan global */
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-peranan],[data-tutup-laci],[data-agih],[data-fixed],[data-sambung],[data-resolved],[data-reopen],[data-closed],[data-gabung],[data-lampir]") : null;
    if (!t) return;

    if (t.hasAttribute("data-peranan")) {
      var r = t.getAttribute("data-peranan");
      if (r === "pm") { masuk("u-pm"); return; }
      bukaPemilihPengguna(r);
      return;
    }
    if (t.hasAttribute("data-tutup-laci")) { tutupLaci(); return; }

    if (t.hasAttribute("data-agih")) { modalAgih(t.getAttribute("data-agih")); return; }

    if (t.hasAttribute("data-fixed")) { modalFixed(t.getAttribute("data-fixed")); return; }
    if (t.hasAttribute("data-sambung")) {
      var ids = t.getAttribute("data-sambung");
      tukarStatus(ids, "assigned", "Kerja disambung semula oleh IT Support.");
      toast(ids + " disambung semula");
      return;
    }
    if (t.hasAttribute("data-resolved")) {
      var idr = t.getAttribute("data-resolved");
      tukarStatus(idr, "resolved", "Disahkan selesai oleh Penguatkuasa.");
      toast(idr + " disahkan selesai — menunggu IT Support tutup");
      return;
    }
    if (t.hasAttribute("data-reopen")) {
      var idre = t.getAttribute("data-reopen");
      var tk = tiketById(idre);
      tk.reopenCount = (tk.reopenCount || 0) + 1;
      tukarStatus(idre, "reopen", "Di-re-open — masalah masih berlaku selepas pembaikan.", "reopen");
      toast(idre + " di-re-open");
      return;
    }
    if (t.hasAttribute("data-closed")) {
      var idc = t.getAttribute("data-closed");
      tukarStatus(idc, "closed", "Ditutup oleh IT Support selepas pengesahan Penguatkuasa.");
      toast(idc + " ditutup");
      return;
    }
    if (t.hasAttribute("data-gabung")) { modalGabung(t.getAttribute("data-gabung")); return; }
    if (t.hasAttribute("data-lampir")) { muatLampiran(t.getAttribute("data-lampir")); return; }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target && e.target.hasAttribute && e.target.hasAttribute("data-tiket")) {
      bukaLaci(e.target.getAttribute("data-tiket"));
      return;
    }
    if (e.key === "Escape") {
      if ($("#modalAkar").innerHTML) tutupModal();
      else if (S.laci) tutupLaci();
    }
  });

  /* ------------------------------------------------------------- mula */
  document.addEventListener("DOMContentLoaded", function () {
    renderLogin();
    $("#btnTema").addEventListener("click", tukarTema);
    $("#btnTema2").addEventListener("click", tukarTema);
    $("#btnKeluar").addEventListener("click", keluar);
    $("#laciBg").addEventListener("click", tutupLaci);
  });
})();
