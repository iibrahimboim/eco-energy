/* ============================================================
   EcoEnergi Sekolah - charts.js
   Visualisasi data kuesioner perilaku hemat energi
   menggunakan Chart.js + DATA_ENERGI dari data-perilaku-energi.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // Pastikan data tersedia
  if (typeof DATA_ENERGI === 'undefined') return;

  const d       = DATA_ENERGI;
  const ring    = d.ringkasan;
  const butir   = d.per_butir;
  const jurusan = d.per_jurusan;

  // ── Palet warna brand ───────────────────────────────────────
  const C = {
    sangatBaik : '#12544F',
    baik       : '#2A835F',
    cukup      : '#8BBB92',
    kurang     : '#D4B886',
    grid       : 'rgba(0,0,0,0.06)',
    white      : '#ffffff',
  };

  // Palet per jurusan (7 jurusan)
  const jurusanColors = [
    '#12544F','#2A835F','#8BBB92','#D4B886',
    '#B8B3AD','#4A4743','#EEDBB2'
  ];

  // ── Global default Chart.js ─────────────────────────────────
  Chart.defaults.font.family = "'Poppins', 'Inter', system-ui, sans-serif";
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = '#4A4743';
  Chart.defaults.responsive  = true;
  Chart.defaults.maintainAspectRatio = false;

  /* ============================================================
     1. PIE CHART — Distribusi Kategori Siswa
     ============================================================ */
  (function buildPieKategori() {
    const ctx = document.getElementById('chartPieKategori');
    if (!ctx) return;

    const labels = ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'];
    const values = labels.map(k => ring.kategori[k]);
    const pcts   = labels.map(k => ring.kategori_persen[k]);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [C.sangatBaik, C.baik, C.cukup, C.kurang],
          borderColor: C.white,
          borderWidth: 3,
          hoverOffset: 10,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        cutout: '62%',
        layout: {
          padding: 10
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 12,
              usePointStyle: true,
              pointStyleWidth: 10,
              font: {
                size: 11
              },
              boxWidth: 10,
              boxHeight: 10
            }
          },
          tooltip: {
            padding: 12,
            bodyFont: { size: 12 },
            titleFont: { size: 13, weight: 'bold' },
            callbacks: {
              label(ctx) {
                const idx = ctx.dataIndex;
                return ` ${ctx.label}: ${ctx.parsed} siswa (${pcts[idx]}%)`;
              }
            }
          }
        },
        animation: { animateRotate: true, duration: 900 }
      }
    });
  })();

  /* ============================================================
     2. BAR CHART HORIZONTAL — Rata-rata Skor per Butir
     ============================================================ */
  (function buildBarPerButir() {
    const ctx = document.getElementById('chartBarPerButir');
    if (!ctx) return;

    const labels  = butir.map(b => b.kode);
    const values  = butir.map(b => b.rata_rata);
    const persenS = butir.map(b => b.persen_sering);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Rata-rata Skor',
          data: values,
          backgroundColor: values.map(v =>
            v >= 3.26 ? C.sangatBaik : C.baik
          ),
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 'flex',
          maxBarThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
          padding: {
            left: 10,
            right: 20,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          x: {
            min: 2.8,
            max: 4,
            grid: { 
              color: C.grid,
              drawBorder: false
            },
            ticks: {
              callback: v => v.toFixed(2),
              font: { size: 11 },
              padding: 8
            },
            title: {
              display: true,
              text: 'Rata-rata Skor (skala 1–4)',
              font: { weight: '600', size: 11 },
              padding: { top: 10 }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: '600' },
              padding: 8
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 12,
            bodyFont: { size: 11 },
            titleFont: { size: 12, weight: 'bold' },
            callbacks: {
              title(items) {
                const idx = items[0].dataIndex;
                return butir[idx].label;
              },
              label(item) {
                const idx  = item.dataIndex;
                return [
                  ` Rata-rata: ${item.raw.toFixed(2)}`,
                  ` Sering: ${persenS[idx]}%`,
                ];
              }
            }
          }
        },
        animation: { duration: 800 }
      }
    });
  })();

  /* ============================================================
     3. BAR CHART VERTIKAL — Rata-rata Skor per Jurusan
     ============================================================ */
  (function buildBarPerJurusan() {
    const ctx = document.getElementById('chartBarJurusan');
    if (!ctx) return;

    const labels = jurusan.map(j => j.kode);
    const values = jurusan.map(j => j.rata_rata_skor);
    const nama   = jurusan.map(j => j.nama);
    const resp   = jurusan.map(j => j.jumlah_responden);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Rata-rata Skor',
          data: values,
          backgroundColor: jurusanColors,
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 'flex',
          maxBarThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          y: {
            min: 3.0,
            max: 3.6,
            grid: { 
              color: C.grid,
              drawBorder: false
            },
            ticks: { 
              callback: v => v.toFixed(2),
              font: { size: 11 },
              padding: 8
            },
            title: {
              display: true,
              text: 'Rata-rata Skor (skala 1–4)',
              font: { weight: '600', size: 11 },
              padding: { bottom: 10 }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: '600' },
              padding: 8
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 12,
            bodyFont: { size: 11 },
            titleFont: { size: 12, weight: 'bold' },
            callbacks: {
              title(items) {
                const idx = items[0].dataIndex;
                return nama[idx];
              },
              label(item) {
                const idx = item.dataIndex;
                return [
                  ` Rata-rata: ${item.raw.toFixed(2)}`,
                  ` Responden: ${resp[idx]} siswa`,
                ];
              }
            }
          }
        },
        animation: { duration: 800 }
      }
    });
  })();

});
