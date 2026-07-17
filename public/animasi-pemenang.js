// ====================================================================
// 1. INJEKSI GAYA CSS (FULL RESPONSIVE VIEWPORT UNTUK TV / CASTING)
// ====================================================================
const stylePemenang = document.createElement('style');
stylePemenang.innerHTML = `
    #winnerOverlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: radial-gradient(circle at center, rgba(30,30,35,0.95) 0%, rgba(5,5,5,1) 100%);
        z-index: 10000; display: flex; flex-direction: column; justify-content: center; align-items: center;
        opacity: 0; pointer-events: none; transition: background 0.8s, opacity 0.8s ease-in-out;
        font-family: 'Arial', sans-serif;
        box-sizing: border-box;
        overflow: hidden; /* 🔥 MENCEGAH SCROLL / OFFSIDE 🔥 */
    }
    #winnerOverlay.show { opacity: 1; pointer-events: all; }

    #winnerOverlay.theme-biru { background: radial-gradient(circle at center, rgba(11, 30, 80, 0.98) 0%, rgba(2, 6, 15, 1) 100%); }
    #winnerOverlay.theme-biru .sudut-teks { color: #0b5ed7; text-shadow: 0px 4px 2vh rgba(11, 94, 215, 0.6); }
    
    #winnerOverlay.theme-merah { background: radial-gradient(circle at center, rgba(80, 11, 20, 0.98) 0%, rgba(15, 2, 4, 1) 100%); }
    #winnerOverlay.theme-merah .sudut-teks { color: #dc3545; text-shadow: 0px 4px 2vh rgba(220, 53, 69, 0.6); }

    #particleContainerPemenang { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; overflow: hidden; pointer-events: none; }
    .bokeh { position: absolute; bottom: -5vh; background-color: rgba(255, 223, 100, 0.4); border-radius: 50%; filter: blur(4px); opacity: 0; animation: floatUp linear forwards; }

    .winner-content { z-index: 3; text-align: center; position: relative; padding: 4vh 0; transition: opacity 0.5s; width: 100%; }
    .rekap-view { z-index: 4; width: 100vw; height: 100vh; display: none; flex-direction: column; justify-content: center; opacity: 0; transition: opacity 0.8s ease-in-out; padding: 2vh 4vw; box-sizing: border-box; }

    .center-line { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); box-shadow: 0 0 1.5vh rgba(255,255,255,0.5); z-index: -1; }
    #winnerOverlay.show .center-line { animation: drawLine 1s cubic-bezier(0.86, 0, 0.07, 1) forwards; }
    .reveal-box { overflow: hidden; padding: 1vh 4vw; }
    .reveal-content { transform: translateY(100%); opacity: 0; }
    #winnerOverlay.show .reveal-content { animation: slideReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.5s; }
    
    /* 🔥 PENGUMUMAN AWAL MENGGUNAKAN VIEWPORT (VH/VW) 🔥 */
    .alasan-menang { color: #a8a8a8; font-size: 3vh; letter-spacing: 1vw; font-weight: 300; margin-bottom: 2vh; text-transform: uppercase; }
    .sudut-teks { font-family: 'FontGadugi', sans-serif; font-size: 18vh; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5vw; display: block; line-height: 1; }
    .menang-teks { font-family: 'FontGadugi', sans-serif; font-size: 14vh; font-weight: 900; letter-spacing: 0.8vw; display: block; margin-top: -1vh; position: relative; background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c); -webkit-background-clip: text; color: transparent; }
    .nama-atlet { font-size: 8vh; color: #ffffff; font-weight: 400; letter-spacing: 0.5vw; margin-top: 3vh; text-transform: uppercase; text-shadow: 0 0.5vh 1.5vh rgba(0,0,0,0.5); }

    /* 🔥 REKAPAN MENGGUNAKAN VIEWPORT (VH/VW) 🔥 */
    .rkp-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5vh; position: relative; }
    .rkp-sponsor { display: flex; align-items: center; gap: 0.5vw; }
    .rkp-sponsor img { height: 6vh; max-width: 15vw; object-fit: contain; }
    .rkp-title { font-size: 3vh; font-weight: 900; letter-spacing: 0.2vw; text-transform: uppercase; text-shadow: 0.2vh 0.2vh 0.5vh rgba(0,0,0,0.8); position: absolute; left: 50%; transform: translateX(-50%); background: linear-gradient(180deg, rgba(51, 51, 51, 0.5) 0%, rgba(17, 17, 17, 0.5) 100%); backdrop-filter: blur(5px); border: 0.2vh solid rgba(85, 85, 85, 0.5); border-radius: 1vh; padding: 1vh 3vw; box-shadow: 0 0.4vh 1vh rgba(0,0,0,0.3); white-space: nowrap; color: white; }
    
    .rkp-bar { display: flex; gap: 1vw; margin-bottom: 1vh; }
    .rkp-box { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 1vh; border: 0.2vh solid rgba(255,255,255,0.1); box-shadow: 0 0.4vh 0.8vh rgba(0,0,0,0.4); padding: 1vh; background: rgba(0,0,0,0.4); color: white;}
    .rkp-box-info { flex: 1; background: linear-gradient(180deg, #444 0%, #222 100%); font-size: 2.2vh; font-weight: bold; border-radius: 1vh; border: 0.2vh solid #555; text-transform: uppercase; box-shadow: 0 0.4vh 0.6vh rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 1vh 0; color: white; }
    
    .rkp-bg-biru { border-bottom: 0.6vh solid #0d6efd; }
    .rkp-bg-merah { border-bottom: 0.6vh solid #dc3545; }
    .rkp-nama { font-size: 3.5vh; font-weight: bold; text-transform: uppercase; margin-bottom: 0; line-height: 1.2; }
    .rkp-negara { font-size: 2vh; color: #ccc; text-transform: uppercase; }

    .rkp-container { background: rgba(0,0,0,0.6); border: 0.1vh solid rgba(255,255,255,0.1); border-radius: 1.5vh; max-width: 90vw; margin: 0 auto; width: 100%; padding: 2vh 4vw; box-shadow: 0 1vh 3vh rgba(0,0,0,0.8); }
    .rkp-row { display: flex; align-items: center; text-align: center; border-bottom: 0.1vh solid rgba(255,255,255,0.15); padding: 0.8vh 0; }
    .rkp-row:last-child { border-bottom: none; }
    .rkp-col { flex: 1; }
    
    .rkp-skor { font-family: 'Roboto', 'Arial', sans-serif; font-size: 5vh; font-weight: 700; color: #ffffff; text-shadow: 0 0.3vh 1vh rgba(0,0,0,0.7); line-height: 1; }
    .rkp-label { font-size: 2.5vh; font-weight: bold; color: #ffffff; letter-spacing: 0.2vw; text-transform: uppercase; text-shadow: 0 0.2vh 0.5vh rgba(0,0,0,0.5); }
    
    .rkp-pelanggaran-title { display: inline-block; font-size: 2vh; font-weight: 900; color: #ffc107; letter-spacing: 0.2vw; border-bottom: 0.2vh solid #ffc107; padding-bottom: 0.5vh; margin: 1.5vh 0 0.5vh 0; text-shadow: 0 0.2vh 0.5vh rgba(0,0,0,0.5); }
    .teks-warning { color: #ffc107 !important; }

    /* 🔥 GAYA KHUSUS SKOR AKHIR & ANIMASI KEMENANGAN 🔥 */
    .rkp-skor-akhir { font-family: 'Roboto', 'Arial', sans-serif; font-size: 8vh; font-weight: 900; color: #ffffff; text-shadow: 0 0.4vh 1.5vh rgba(0,0,0,0.8); line-height: 1; display: inline-block; }

    .skor-menang { 
        color: #ffc107 !important; 
        animation: pulseGlowScore 1.5s infinite;
    }
    
    @keyframes pulseGlowScore {
        0% { text-shadow: 0 0 2vh rgba(255,193,7,0.8), 0 0 3vh rgba(255,193,7,0.4); transform: scale(1.02); }
        50% { text-shadow: 0 0 4vh rgba(255,193,7,1), 0 0 6vh rgba(255,193,7,0.8); transform: scale(1.08); }
        100% { text-shadow: 0 0 2vh rgba(255,193,7,0.8), 0 0 3vh rgba(255,193,7,0.4); transform: scale(1.02); }
    }

    @keyframes drawLine { 0% { width: 0%; opacity: 1; } 50% { width: 80%; opacity: 1; } 100% { width: 100%; opacity: 0; } }
    @keyframes slideReveal { 0% { transform: translateY(5vh); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    @keyframes floatUp { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.5; } 100% { transform: translateY(-120vh) scale(1.5); opacity: 0; } }
`;
document.head.appendChild(stylePemenang);

// ====================================================================
// 2. INJEKSI ELEMEN HTML (PENGUMUMAN + REKAP ID NYATA)
// ====================================================================
const overlayPemenang = document.createElement('div');
overlayPemenang.id = 'winnerOverlay';
overlayPemenang.innerHTML = `
    <div id="particleContainerPemenang"></div>
    
    <!-- PHASE 1: PENGUMUMAN PEMENANG -->
    <div class="winner-content" id="winnerContentPanel">
        <div class="center-line"></div>
        <div class="reveal-box">
            <div class="reveal-content">
                <h2 id="winReason" class="alasan-menang">ALASAN</h2>
                <h1 class="title-menang">
                    <span id="winSudut" class="sudut-teks">SUDUT X</span>
                    <span class="menang-teks">MENANG</span>
                </h1>
                <h3 id="winName" class="nama-atlet">NAMA PESILAT</h3>
            </div>
        </div>
    </div>

    <!-- PHASE 2: REKAP PERTANDINGAN REAL DATA -->
    <div class="rekap-view" id="rekapViewPanel">
        
        <div class="rkp-header-top">
            <div class="rkp-sponsor" id="rkpSponsorKiri"></div>
            <div class="rkp-title" id="rkpKejuaraan">KEJUARAAN</div>
            <div class="rkp-sponsor" id="rkpSponsorKanan"></div>
        </div>

        <div class="rkp-bar">
            <div class="rkp-box rkp-bg-biru">
                <div class="rkp-nama" id="rkpNamaBiru">SUDUT BIRU</div>
                <div class="rkp-negara" id="rkpKonBiru">-</div>
            </div>
            <div class="rkp-box rkp-bg-merah">
                <div class="rkp-nama" id="rkpNamaMerah">SUDUT MERAH</div>
                <div class="rkp-negara" id="rkpKonMerah">-</div>
            </div>
        </div>

        <div class="rkp-bar" style="margin-bottom: 2vh;">
            <div class="rkp-box-info" id="rkpGelanggang">G?</div>
            <div class="rkp-box-info" id="rkpKelas">KELAS</div>
            <div class="rkp-box-info" id="rkpPartai">PARTAI</div>
            <div class="rkp-box-info" id="rkpBabak">BABAK</div>
        </div>

        <div class="rkp-container">
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpPukulanBiru">0</div>
                <div class="rkp-col rkp-label">Pukulan</div>
                <div class="rkp-col rkp-skor" id="rkpPukulanMerah">0</div>
            </div>
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpTendanganBiru">0</div>
                <div class="rkp-col rkp-label">Tendangan</div>
                <div class="rkp-col rkp-skor" id="rkpTendanganMerah">0</div>
            </div>
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpJatuhanBiru">0</div>
                <div class="rkp-col rkp-label">Jatuhan</div>
                <div class="rkp-col rkp-skor" id="rkpJatuhanMerah">0</div>
            </div>

            <div style="text-align: center;">
                <span class="rkp-pelanggaran-title">REKAP PELANGGARAN</span>
            </div>

            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpBinaanBiru">0</div>
                <div class="rkp-col rkp-label">Binaan</div>
                <div class="rkp-col rkp-skor" id="rkpBinaanMerah">0</div>
            </div>
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpTegBiru">0</div>
                <div class="rkp-col rkp-label">Teguran</div>
                <div class="rkp-col rkp-skor" id="rkpTegMerah">0</div>
            </div>
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpPerBiru">0</div>
                <div class="rkp-col rkp-label teks-warning">Peringatan</div>
                <div class="rkp-col rkp-skor" id="rkpPerMerah">0</div>
            </div>

            <!-- 🔥 GABUNGAN: SKOR AKHIR DAN ALASAN MENANG 🔥 -->
            <div class="rkp-row" style="margin-top: 1.5vh; border-top: 0.3vh dashed rgba(255, 193, 7, 0.5); padding-top: 1.5vh;">
                <div class="rkp-col rkp-skor-akhir" id="rkpTotalBiru">0</div>
                <div class="rkp-col rkp-label" style="font-size: 3vh; color: #ffffff; text-shadow: 0 0 1vh rgba(255,255,255,0.5);">SKOR AKHIR</div>
                <div class="rkp-col rkp-skor-akhir" id="rkpTotalMerah">0</div>
            </div>
            
            <div style="margin-top: 1vh; text-align: center;">
                <div id="rkpAlasanMenangBawah" class="skor-menang" style="font-family: 'Roboto', 'Arial', sans-serif; font-size: 4vh; font-weight: 900; color: #ffc107; text-transform: uppercase; text-shadow: 0 0.4vh 1.5vh rgba(0,0,0,0.8); line-height: 1;">ALASAN</div>
            </div>
        </div>
    </div>
`;
document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(overlayPemenang);
});

// ====================================================================
// 3. FUNGSI PEMICU ANIMASI GLOBAL & EKSTRAKSI DATA LOG
// ====================================================================
let bokehInterval;
let rekapTimeout1;
let rekapTimeout2;

function hitungRekap(riwayat) {
    let r = { pukulan:0, tendangan:0, jatuhan:0, binaan:0, teguran:0, per:0 };
    if(!riwayat) return r;
    
    for(let i=1; i<=3; i++) {
        if(riwayat[i]) {
            riwayat[i].forEach(poin => {
                if(poin === 1) r.pukulan++;
                else if(poin === 2) r.tendangan++;
                else if(poin === 3) r.jatuhan++;
                else if(poin === 0) r.binaan++;
                else if(poin === -1 || poin === -2) r.teguran++;
                else if(poin === -5 || poin === -10) r.per++;
            });
        }
    }
    return r;
}

window.mainkanEfekPemenang = function(sudut, namaAtlet, alasan) {
    let overlay = document.getElementById('winnerOverlay');
    if(!overlay) return;
    
    clearTimeout(rekapTimeout1);
    clearTimeout(rekapTimeout2);
    document.getElementById('winnerContentPanel').style.display = 'block';
    document.getElementById('winnerContentPanel').style.opacity = '1';
    document.getElementById('rekapViewPanel').style.display = 'none';
    document.getElementById('rekapViewPanel').style.opacity = '0';

    document.getElementById('winReason').innerText = alasan;
    document.getElementById('winSudut').innerText = "SUDUT " + sudut;
    document.getElementById('winName').innerText = namaAtlet;
    
    overlay.className = ''; 
    if (sudut.toLowerCase() === 'biru') overlay.classList.add('theme-biru');
    else overlay.classList.add('theme-merah');

    void overlay.offsetWidth;
    overlay.classList.add('show');
    
    let container = document.getElementById('particleContainerPemenang');
    container.innerHTML = ''; 
    clearInterval(bokehInterval);
    
    bokehInterval = setInterval(() => {
        let bokeh = document.createElement('div');
        bokeh.classList.add('bokeh');
        let size = Math.random() * 20 + 10;
        bokeh.style.width = size + 'px'; bokeh.style.height = size + 'px';
        bokeh.style.filter = `blur(${Math.random() * 6 + 2}px)`;
        bokeh.style.left = Math.random() * 100 + '%';
        let duration = Math.random() * 6 + 6;
        bokeh.style.animationDuration = duration + 's';
        container.appendChild(bokeh);
        setTimeout(() => { bokeh.remove(); }, duration * 1000);
    }, 200);

    rekapTimeout1 = setTimeout(() => {
        document.getElementById('winnerContentPanel').style.opacity = '0';
        rekapTimeout2 = setTimeout(() => {
            document.getElementById('winnerContentPanel').style.display = 'none';
            let rekapView = document.getElementById('rekapViewPanel');
            rekapView.style.display = 'flex';
            
            if (document.getElementById('wadahKiri')) document.getElementById('rkpSponsorKiri').innerHTML = document.getElementById('wadahKiri').innerHTML;
            if (document.getElementById('wadahKanan')) document.getElementById('rkpSponsorKanan').innerHTML = document.getElementById('wadahKanan').innerHTML;
            if (document.getElementById('judulKejuaraan')) document.getElementById('rkpKejuaraan').innerText = document.getElementById('judulKejuaraan').innerText;

            if (document.getElementById('l_nama_biru')) document.getElementById('rkpNamaBiru').innerText = document.getElementById('l_nama_biru').innerText;
            if (document.getElementById('l_kon_biru')) document.getElementById('rkpKonBiru').innerText = document.getElementById('l_kon_biru').innerText;
            if (document.getElementById('l_nama_merah')) document.getElementById('rkpNamaMerah').innerText = document.getElementById('l_nama_merah').innerText;
            if (document.getElementById('l_kon_merah')) document.getElementById('rkpKonMerah').innerText = document.getElementById('l_kon_merah').innerText;

            if (document.getElementById('labelGelanggangBar')) document.getElementById('rkpGelanggang').innerText = document.getElementById('labelGelanggangBar').innerText;
            if (document.getElementById('l_kelas')) document.getElementById('rkpKelas').innerText = document.getElementById('l_kelas').innerText;
            if (document.getElementById('l_partai')) document.getElementById('rkpPartai').innerText = document.getElementById('l_partai').innerText;
            if (document.getElementById('l_babak')) document.getElementById('rkpBabak').innerText = document.getElementById('l_babak').innerText;

            let dataBiru = hitungRekap(window.riwayatBiru);
            let dataMerah = hitungRekap(window.riwayatMerah);

            document.getElementById('rkpPukulanBiru').innerText = dataBiru.pukulan;
            document.getElementById('rkpPukulanMerah').innerText = dataMerah.pukulan;
            document.getElementById('rkpTendanganBiru').innerText = dataBiru.tendangan;
            document.getElementById('rkpTendanganMerah').innerText = dataMerah.tendangan;
            document.getElementById('rkpJatuhanBiru').innerText = dataBiru.jatuhan;
            document.getElementById('rkpJatuhanMerah').innerText = dataMerah.jatuhan;
            
            document.getElementById('rkpBinaanBiru').innerText = dataBiru.binaan;
            document.getElementById('rkpBinaanMerah').innerText = dataMerah.binaan;
            document.getElementById('rkpTegBiru').innerText = dataBiru.teguran;
            document.getElementById('rkpTegMerah').innerText = dataMerah.teguran;
            document.getElementById('rkpPerBiru').innerText = dataBiru.per;
            document.getElementById('rkpPerMerah').innerText = dataMerah.per;

            // 🔥 HITUNG & SUNTIKKAN SKOR AKHIR BERSAMAAN DENGAN ALASAN 🔥
            let logB = [ ...(window.riwayatBiru[1]||[]), ...(window.riwayatBiru[2]||[]), ...(window.riwayatBiru[3]||[]) ];
            let logM = [ ...(window.riwayatMerah[1]||[]), ...(window.riwayatMerah[2]||[]), ...(window.riwayatMerah[3]||[]) ];
            
            let totalB = logB.reduce((a,b) => a+b, 0);
            let totalM = logM.reduce((a,b) => a+b, 0);
            
            let elTotalBiru = document.getElementById('rkpTotalBiru');
            let elTotalMerah = document.getElementById('rkpTotalMerah');
            
            elTotalBiru.innerText = totalB;
            elTotalMerah.innerText = totalM;
            
            // Bersihkan efek skor akhir sebelumnya
            elTotalBiru.classList.remove('skor-menang');
            elTotalMerah.classList.remove('skor-menang');
            
            // Berikan Efek Menyala Khusus Untuk Skor Pemenang Saja
            if (sudut.toLowerCase() === 'biru') {
                elTotalBiru.classList.add('skor-menang');
            } else if (sudut.toLowerCase() === 'merah') {
                elTotalMerah.classList.add('skor-menang');
            }

            // Tampilkan Alasan Menang di bawah Skor
            document.getElementById('rkpAlasanMenangBawah').innerText = alasan;

            void rekapView.offsetWidth;
            rekapView.style.opacity = '1';
        }, 500); 
    }, 2500); 
};

window.tutupEfekPemenang = function() {
    let overlay = document.getElementById('winnerOverlay');
    if(overlay) overlay.classList.remove('show');
    clearInterval(bokehInterval); 
    clearTimeout(rekapTimeout1);
    clearTimeout(rekapTimeout2);
    let container = document.getElementById('particleContainerPemenang');
    if(container) container.innerHTML = ''; 
};