/* ==========================================================================
   Process flow — swimlane 3 peranan
   Lane: Penguatkuasa · Project Manager · IT Support
   Setiap kotak duduk dalam lane pemiliknya, jadi siapa buat apa jelas.
   ========================================================================== */
(function (w) {
  "use strict";

  var T = {
    paper: "#14110E",
    surface: "#1B1815",
    surface2: "#221E1A",
    ink: "#F2ECE2",
    muted: "#9A9184",
    line: "#332D27",
    line2: "#443C34",
    gold: "#D2A04A",
    danger: "#C86B57"
  };

  var FS = "'Inter', system-ui, sans-serif";
  var FM = "'Cascadia Mono', ui-monospace, Consolas, monospace";

  /* ------------------------------------------------------------- teks */
  var TEKS = {
    en: {
      tajuk: "How a ticket moves",
      desc: "Three roles in three lanes. The officer reports, the PM assigns and sets severity, IT fixes, and the officer alone confirms the fix.",
      lane0: "ENFORCEMENT", lane0b: "OFFICER",
      lane1: "PROJECT", lane1b: "MANAGER",
      lane2: "IT SUPPORT", lane2b: "",
      st_report: "Report", st_assign: "Assign", st_fix: "Fix",
      st_retest: "Retest", st_close: "Close",
      n_report: "Open", n_assign: "Assigned", n_fix: "Fixed",
      n_retest: "Resolved", n_close: "Closed",
      s_report: "submits a bug", s_assign: "sets severity", s_fix: "marks fixed",
      s_retest: "confirms the fix", s_close: "locks the ticket",
      a_hand_pm: "ticket", a_hand_it: "assigned",
      a_back: "fixed, retest",
      a_close: "confirmed",
      a_broken: "still broken",
      lg_fwd: "forward handoff", lg_back: "re-open loop"
    },
    ms: {
      tajuk: "Bagaimana tiket bergerak",
      desc: "Tiga peranan dalam tiga lane. Pegawai lapor, PM agih dan tetapkan severity, IT baiki, dan hanya pegawai boleh sahkan pembaikan.",
      lane0: "PENGUATKUASA", lane0b: "",
      lane1: "PROJECT", lane1b: "MANAGER",
      lane2: "IT SUPPORT", lane2b: "",
      st_report: "Lapor", st_assign: "Agih", st_fix: "Baiki",
      st_retest: "Uji", st_close: "Tutup",
      n_report: "Open", n_assign: "Assigned", n_fix: "Fixed",
      n_retest: "Resolved", n_close: "Closed",
      s_report: "hantar bug", s_assign: "set severity", s_fix: "tanda fixed",
      s_retest: "sahkan pembaikan", s_close: "kunci tiket",
      a_hand_pm: "tiket", a_hand_it: "diagih",
      a_back: "fixed, uji",
      a_close: "disahkan",
      a_broken: "masih rosak",
      lg_fwd: "serahan ke hadapan", lg_back: "gelung re-open"
    }
  };

  function tx(k) { return TEKS[k] || TEKS.en; }

  /* ------------------------------------------------------------- geometri */
  var LC = 150;          /* label column */
  var SLOT = 168;
  var NW = 148, NH = 64;
  var HH = 44;           /* header */
  var LH = 96;           /* lane height */
  var NS = 5;
  var NL = 3;

  var W = LC + NS * SLOT + 30;
  var LANE_BOT = HH + NL * LH;
  var CORR = LANE_BOT + 34;
  var H = CORR + 62;

  function cx(j) { return LC + 8 + j * SLOT + NW / 2; }
  function nx(j) { return cx(j) - NW / 2; }
  function ly(k) { return HH + k * LH; }
  function ny(k) { return ly(k) + (LH - NH) / 2; }
  function mid(k) { return ly(k) + LH / 2; }

  /* ------------------------------------------------------------- primitif */
  function kotak(j, k, opt) {
    var x = nx(j), y = ny(k);
    var s = '<rect x="' + x + '" y="' + y + '" width="' + NW + '" height="' + NH + '" rx="8" ' +
            'fill="' + (opt.fill || T.surface) + '" stroke="' + (opt.stroke || T.line2) +
            '" stroke-width="' + (opt.sw || 1) + '"/>';
    s += '<text x="' + (x + 13) + '" y="' + (y + 19) + '" font-family="' + FM + '" font-size="7" ' +
         'letter-spacing="1.5" fill="' + (opt.eyebrowColor || T.muted) + '">' + opt.eyebrow + "</text>";
    s += '<text x="' + (x + 13) + '" y="' + (y + 39) + '" font-family="' + FS + '" font-size="13" ' +
         'font-weight="600" fill="' + (opt.warna || T.ink) + '">' + opt.tajuk + "</text>";
    s += '<text x="' + (x + 13) + '" y="' + (y + 54) + '" font-family="' + FM + '" font-size="8.5" ' +
         'fill="' + T.muted + '">' + opt.sub + "</text>";
    return s;
  }

  function down(x1, y1, x2, y2, opt) {
    opt = opt || {};
    var c = opt.color || T.muted, r = 8;
    var d = "M " + x1 + " " + y1 + " H " + (x2 - r) + " Q " + x2 + " " + y1 + " " + x2 + " " + (y1 + r) + " V " + y2;
    return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + (opt.sw || 1.2) + '"' +
           (opt.dash ? ' stroke-dasharray="5,4"' : "") + ' marker-end="url(#' + (opt.marker || "ah") + ')"/>';
  }

  function up(x1, y1, x2, y2, opt) {
    opt = opt || {};
    var c = opt.color || T.muted, r = 8;
    var d = "M " + x1 + " " + y1 + " H " + (x2 - r) + " Q " + x2 + " " + y1 + " " + x2 + " " + (y1 - r) + " V " + y2;
    return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + (opt.sw || 1.2) + '"' +
           (opt.dash ? ' stroke-dasharray="5,4"' : "") + ' marker-end="url(#' + (opt.marker || "ah") + ')"/>';
  }

  /* laluan balik: kanan → turun → kiri → naik */
  function balik(x1, y1, xd, yc, x2, y2) {
    var r = 8;
    var d = "M " + x1 + " " + y1 +
            " H " + (xd - r) + " Q " + xd + " " + y1 + " " + xd + " " + (y1 + r) +
            " V " + (yc - r) + " Q " + xd + " " + yc + " " + (xd - r) + " " + yc +
            " H " + (x2 + r) + " Q " + x2 + " " + yc + " " + x2 + " " + (yc - r) +
            " V " + y2;
    return '<path d="' + d + '" fill="none" stroke="' + T.danger + '" stroke-width="1.25" ' +
           'stroke-dasharray="5,4" marker-end="url(#ahR)"/>';
  }

  function label(x, y, teks, opt) {
    opt = opt || {};
    var lebar = Math.round(teks.length * 4.3 + 14);
    var s = '<rect x="' + (x - lebar / 2) + '" y="' + (y - 8) + '" width="' + lebar +
            '" height="15" fill="' + T.paper + '"/>';
    s += '<text x="' + x + '" y="' + (y + 2.5) + '" font-family="' + FM + '" font-size="7.5" ' +
         'letter-spacing="0.6" text-anchor="middle" fill="' + (opt.color || T.muted) + '">' +
         teks + "</text>";
    return s;
  }

  /* ------------------------------------------------------------- lukis */
  function lukis(kod) {
    var L = tx(kod);
    var s = "";

    s += "<defs>";
    s += '<marker id="ah" markerWidth="7" markerHeight="6" refX="6.4" refY="3" orient="auto">' +
         '<polygon points="0 0, 7 3, 0 6" fill="' + T.muted + '"/></marker>';
    s += '<marker id="ahR" markerWidth="7" markerHeight="6" refX="6.4" refY="3" orient="auto">' +
         '<polygon points="0 0, 7 3, 0 6" fill="' + T.danger + '"/></marker>';
    s += "</defs>";

    /* --- lane background + divider --- */
    for (var k = 0; k < NL; k++) {
      if (k % 2 === 1) {
        s += '<rect x="' + LC + '" y="' + ly(k) + '" width="' + (W - LC) + '" height="' + LH +
             '" fill="rgba(242,236,226,0.018)"/>';
      }
      s += '<line x1="0" y1="' + ly(k) + '" x2="' + W + '" y2="' + ly(k) +
           '" stroke="' + T.line + '" stroke-width="1"/>';
    }
    s += '<line x1="0" y1="' + LANE_BOT + '" x2="' + W + '" y2="' + LANE_BOT +
         '" stroke="' + T.line + '" stroke-width="1"/>';
    s += '<line x1="' + LC + '" y1="' + HH + '" x2="' + LC + '" y2="' + LANE_BOT +
         '" stroke="' + T.line2 + '" stroke-width="1"/>';

    /* --- label lane --- */
    var laneNama = [
      [L.lane0, L.lane0b],
      [L.lane1, L.lane1b],
      [L.lane2, L.lane2b]
    ];
    for (var i = 0; i < NL; i++) {
      var n1 = laneNama[i][0], n2 = laneNama[i][1];
      var yl = mid(i);
      if (n2) {
        s += '<text x="' + (LC / 2) + '" y="' + (yl - 3) + '" font-family="' + FM + '" font-size="8" ' +
             'letter-spacing="1.4" text-anchor="middle" fill="' + T.muted + '">' + n1 + "</text>";
        s += '<text x="' + (LC / 2) + '" y="' + (yl + 9) + '" font-family="' + FM + '" font-size="8" ' +
             'letter-spacing="1.4" text-anchor="middle" fill="' + T.muted + '">' + n2 + "</text>";
      } else {
        s += '<text x="' + (LC / 2) + '" y="' + (yl + 3) + '" font-family="' + FM + '" font-size="8" ' +
             'letter-spacing="1.4" text-anchor="middle" fill="' + T.muted + '">' + n1 + "</text>";
      }
    }

    /* --- header langkah --- */
    var langkah = [L.st_report, L.st_assign, L.st_fix, L.st_retest, L.st_close];
    for (var j = 0; j < NS; j++) {
      var fokus = (j === 3);
      s += '<rect x="' + (cx(j) - 8) + '" y="10" width="16" height="16" rx="8" ' +
           'fill="' + (fokus ? "rgba(210,160,74,0.22)" : "rgba(242,236,226,0.10)") + '"/>';
      s += '<text x="' + cx(j) + '" y="21.5" font-family="' + FM + '" font-size="8" ' +
           'text-anchor="middle" fill="' + (fokus ? T.gold : T.muted) + '">' + (j + 1) + "</text>";
      s += '<text x="' + cx(j) + '" y="37" font-family="' + FM + '" font-size="7" letter-spacing="1.3" ' +
           'text-anchor="middle" fill="' + (fokus ? T.gold : T.muted) + '">' +
           langkah[j].toUpperCase() + "</text>";
    }

    /* --- anak panah (sebelum kotak) --- */

    /* 1 Officer → 2 PM */
    s += down(nx(0) + NW, mid(0), cx(1), ny(1) - 3);
    s += label(cx(1) - 36, mid(0) + 22, L.a_hand_pm);

    /* 2 PM → 3 IT */
    s += down(nx(1) + NW, mid(1), cx(2), ny(2) - 3);
    s += label(cx(2) - 36, mid(1) + 22, L.a_hand_it);

    /* 3 IT → 4 Officer (naik) */
    s += up(nx(2) + NW, mid(2), cx(3), ny(0) + NH + 3);
    s += label(cx(3) - 46, mid(2) - 24, L.a_back);

    /* 4 Officer → 5 IT (turun) — keluar dari bucu atas kanan */
    s += down(nx(3) + NW, mid(0) - 16, cx(4), ny(2) - 3);
    s += label(cx(4) - 40, mid(0) - 26, L.a_close);

    /* 4 Officer → balik ke 2 PM (gelung re-open) — keluar dari bucu bawah kanan */
    s += balik(nx(3) + NW, mid(0) + 22, nx(3) + NW + 26, CORR, cx(1), ny(1) + NH + 3);
    s += label((nx(3) + NW + 26 + cx(1)) / 2, CORR + 12, L.a_broken, { color: T.danger });

    /* --- kotak --- */
    s += kotak(0, 0, { eyebrow: "01", tajuk: L.n_report, sub: L.s_report });
    s += kotak(1, 1, { eyebrow: "02", tajuk: L.n_assign, sub: L.s_assign });
    s += kotak(2, 2, { eyebrow: "03", tajuk: L.n_fix, sub: L.s_fix });
    s += kotak(3, 0, { eyebrow: "04", tajuk: L.n_retest, sub: L.s_retest,
                       stroke: "rgba(210,160,74,0.55)", fill: "rgba(210,160,74,0.06)",
                       eyebrowColor: T.gold });
    s += kotak(4, 2, { eyebrow: "05", tajuk: L.n_close, sub: L.s_close,
                       fill: T.surface2, warna: T.muted });

    /* --- legenda --- */
    var lgy = H - 20;
    s += '<line x1="0" y1="' + (CORR + 28) + '" x2="' + W + '" y2="' + (CORR + 28) +
         '" stroke="' + T.line + '" stroke-width="1"/>';

    s += '<line x1="' + (LC + 4) + '" y1="' + lgy + '" x2="' + (LC + 38) + '" y2="' + lgy +
         '" stroke="' + T.muted + '" stroke-width="1.2" marker-end="url(#ah)"/>';
    s += '<text x="' + (LC + 48) + '" y="' + (lgy + 3) + '" font-family="' + FM + '" font-size="8" ' +
         'fill="' + T.muted + '">' + L.lg_fwd + "</text>";

    s += '<line x1="' + (LC + 234) + '" y1="' + lgy + '" x2="' + (LC + 268) + '" y2="' + lgy +
         '" stroke="' + T.danger + '" stroke-width="1.2" stroke-dasharray="5,4" marker-end="url(#ahR)"/>';
    s += '<text x="' + (LC + 278) + '" y="' + (lgy + 3) + '" font-family="' + FM + '" font-size="8" ' +
         'fill="' + T.muted + '">' + L.lg_back + "</text>";

    return s;
  }

  w.PROSES = { lukis: lukis, teks: tx, W: W, H: H };
})(window);
