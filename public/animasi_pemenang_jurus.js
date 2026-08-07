// ============================================================================
// 🏆 ANIMASI PEMENANG KHUSUS KATEGORI JURUS (SENI) - REGULASI IPSI 2024
// ============================================================================

const stylePemenangJurus = document.createElement('style');
stylePemenangJurus.innerHTML = `
    #winnerOverlayJurus {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: radial-gradient(circle at center, rgba(30,30,35,0.95) 0%, rgba(5,5,5,1) 100%);
        z-index: 10000; display: flex; flex-direction: column; justify-content: center; align-items: center;
        opacity: 0; pointer-events: none; transition: background 0.8s, opacity 0.8s ease-in-out;
        font-family: 'Arial', sans-serif; box-sizing: border-box; overflow: hidden; 
    }
    #winnerOverlayJurus.show { opacity: 1; pointer-events: all; }

    #winnerOverlayJurus.theme-biru { background: radial-gradient(circle at center, rgba(11, 30, 80, 0.98) 0%, rgba(2, 6, 15, 1) 100%); }
    #winnerOverlayJurus.theme-biru .sudut-teks { color: #0b5ed7; text-shadow: 0px 4px 2vh rgba(11, 94, 215, 0.6); }
    #winnerOverlayJurus.theme-merah { background: radial-gradient(circle at center, rgba(80, 11, 20, 0.98) 0%, rgba(15, 2, 4, 1) 100%); }
    #winnerOverlayJurus.theme-merah .sudut-teks { color: #dc3545; text-shadow: 0px 4px 2vh rgba(220, 53, 69, 0.6); }

    #particleContainerJurus { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; overflow: hidden; pointer-events: none; }
    .bokeh { position: absolute; bottom: -5vh; background-color: rgba(255, 223, 100, 0.4); border-radius: 50%; filter: blur(4px); opacity: 0; animation: floatUp linear forwards; }

    .winner-content { z-index: 3; text-align: center; position: relative; padding: 4vh 0; transition: opacity 0.5s; width: 100%; }
    .rekap-view { z-index: 4; width: 100vw; height: 100vh; display: none; flex-direction: column; justify-content: center; opacity: 0; transition: opacity 0.8s ease-in-out; padding: 2vh 4vw; box-sizing: border-box; }

    /* 🔥 CSS TAMBAHAN FOTO EKSKLUSIF 🔥 */
    .foto-pemenang-utama { width: 24vh; height: 32vh; object-fit: cover; object-position: top center; border-radius: 1vh; border: 0.6vh solid #ffc107; box-shadow: 0 0 6vh rgba(255,193,7,0.9); margin-bottom: 2vh; transform: scale(0); opacity: 0; transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); background: #111; }
    #winnerOverlayJurus.show .foto-pemenang-utama.tampil { transform: scale(1); opacity: 1; animation: floatFoto 3s infinite ease-in-out; }
    @keyframes floatFoto { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1) translateY(-1.5vh); box-shadow: 0 1.5vh 6vh rgba(255,193,7,1); } }
    
    .foto-rekap-kecil { width: 9vh; height: 12vh; object-fit: cover; object-position: top center; border-radius: 0.5vh; border: 0.3vh solid #fff; box-shadow: 0 1vh 2vh rgba(0,0,0,0.8); opacity: 0; transform: scale(0.5); transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 10; position: relative; background: #111; margin: 0; }
    .foto-rekap-kecil.tampil { opacity: 1; transform: scale(1); }
    .rkp-bg-biru .foto-rekap-kecil.menang, .rkp-bg-merah .foto-rekap-kecil.menang { border-color: #ffc107; box-shadow: 0 0 3vh rgba(255,193,7,0.8); }
    /* ============================== */

    .center-line { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); box-shadow: 0 0 1.5vh rgba(255,255,255,0.5); z-index: -1; }
    #winnerOverlayJurus.show .center-line { animation: drawLine 1s cubic-bezier(0.86, 0, 0.07, 1) forwards; }
    .reveal-box { overflow: hidden; padding: 1vh 4vw; }
    .reveal-content { transform: translateY(100%); opacity: 0; }
    #winnerOverlayJurus.show .reveal-content { animation: slideReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.5s; }
    
    .alasan-menang { color: #a8a8a8; font-size: 3vh; letter-spacing: 1vw; font-weight: 300; margin-bottom: 2vh; text-transform: uppercase; }
    .sudut-teks { font-family: 'Arial Black', sans-serif; font-size: 18vh; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5vw; display: block; line-height: 1; }
    .menang-teks { font-family: 'Arial Black', sans-serif; font-size: 14vh; font-weight: 900; letter-spacing: 0.8vw; display: block; margin-top: -1vh; position: relative; background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c); -webkit-background-clip: text; color: transparent; }
    .nama-atlet { font-size: 7vh; color: #ffffff; font-weight: bold; letter-spacing: 0.3vw; margin-top: 3vh; text-transform: uppercase; text-shadow: 0 0.5vh 1.5vh rgba(0,0,0,0.5); }

    .rkp-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5vh; position: relative; }
    .rkp-sponsor { display: flex; align-items: center; gap: 0.5vw; }
    .rkp-sponsor img { height: 6vh; max-width: 15vw; object-fit: contain; }
    .rkp-title { font-size: 3vh; font-weight: 900; letter-spacing: 0.2vw; text-transform: uppercase; text-shadow: 0.2vh 0.2vh 0.5vh rgba(0,0,0,0.8); position: absolute; left: 50%; transform: translateX(-50%); background: linear-gradient(180deg, rgba(51, 51, 51, 0.5) 0%, rgba(17, 17, 17, 0.5) 100%); backdrop-filter: blur(5px); border: 0.2vh solid rgba(85, 85, 85, 0.5); border-radius: 1vh; padding: 1vh 3vw; box-shadow: 0 0.4vh 1vh rgba(0,0,0,0.3); white-space: nowrap; color: white; }
    
    .rkp-bar { display: flex; gap: 1vw; margin-bottom: 1vh; }
    .rkp-box { flex: 1; display: flex; align-items: center; border-radius: 1vh; border: 0.2vh solid rgba(255,255,255,0.1); box-shadow: 0 0.4vh 0.8vh rgba(0,0,0,0.4); padding: 2px; background: rgba(0,0,0,0.4); color: white;}
    .rkp-box-info { flex: 1; background: linear-gradient(180deg, #444 0%, #222 100%); font-size: 2vh; font-weight: bold; border-radius: 1vh; border: 0.2vh solid #555; text-transform: uppercase; box-shadow: 0 0.4vh 0.6vh rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 1vh 0; color: white; }
    
    .rkp-bg-biru { border-bottom: 0.8vh solid #0d6efd; flex-direction: row; justify-content: flex-start; text-align: left; }
    .rkp-bg-merah { border-bottom: 0.8vh solid #dc3545; flex-direction: row; justify-content: flex-end; text-align: right; }
    
    .rkp-teks-wadah { padding: 0 1vw; display: flex; flex-direction: column; justify-content: center; }
    .rkp-nama { font-size: 3vh; font-weight: bold; text-transform: uppercase; margin-bottom: 0; line-height: 1.1; }
    .rkp-negara { font-size: 1.8vh; color: #ccc; text-transform: uppercase; margin-top: 0.5vh; }

    .rkp-container { background: rgba(0,0,0,0.6); border: 0.1vh solid rgba(255,255,255,0.1); border-radius: 1.5vh; max-width: 90vw; margin: 0 auto; width: 100%; padding: 2.5vh 4vw; box-shadow: 0 1vh 3vh rgba(0,0,0,0.8); }
    .rkp-row { display: flex; align-items: center; text-align: center; border-bottom: 0.1vh solid rgba(255,255,255,0.15); padding: 1.5vh 0; }
    .rkp-row:last-child { border-bottom: none; }
    .rkp-col { flex: 1; }
    
    .rkp-skor { font-family: 'Roboto', monospace, sans-serif; font-size: 4.5vh; font-weight: 700; color: #ffffff; text-shadow: 0 0.3vh 1vh rgba(0,0,0,0.7); line-height: 1; }
    .rkp-label { font-size: 2.2vh; font-weight: bold; color: #ffffff; letter-spacing: 0.2vw; text-transform: uppercase; text-shadow: 0 0.2vh 0.5vh rgba(0,0,0,0.5); }
    
    .teks-warning { color: #ff4d4d !important; }
    .rkp-skor-akhir { font-family: 'Roboto', monospace, sans-serif; font-size: 8vh; font-weight: 900; color: #ffffff; text-shadow: 0 0.4vh 1.5vh rgba(0,0,0,0.8); line-height: 1; display: inline-block; }

    .skor-menang { color: #ffc107 !important; animation: pulseGlowScore 1.5s infinite; }
    
    @keyframes pulseGlowScore {
        0% { text-shadow: 0 0 2vh rgba(255,193,7,0.8), 0 0 3vh rgba(255,193,7,0.4); transform: scale(1.02); }
        50% { text-shadow: 0 0 4vh rgba(255,193,7,1), 0 0 6vh rgba(255,193,7,0.8); transform: scale(1.08); }
        100% { text-shadow: 0 0 2vh rgba(255,193,7,0.8), 0 0 3vh rgba(255,193,7,0.4); transform: scale(1.02); }
    }

    @keyframes drawLine { 0% { width: 0%; opacity: 1; } 50% { width: 80%; opacity: 1; } 100% { width: 100%; opacity: 0; } }
    @keyframes slideReveal { 0% { transform: translateY(5vh); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    @keyframes floatUp { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.5; } 100% { transform: translateY(-120vh) scale(1.5); opacity: 0; } }
`;
document.head.appendChild(stylePemenangJurus);

const overlayPemenangHtml = document.createElement('div');
overlayPemenangHtml.id = 'winnerOverlayJurus';
overlayPemenangHtml.innerHTML = `
    <div id="particleContainerJurus"></div>
    
    <!-- PHASE 1: PENGUMUMAN PEMENANG -->
    <div class="winner-content" id="winnerContentPanelJurus">
        <div class="center-line"></div>
        <div class="reveal-box">
            <div class="reveal-content">
                <h2 id="winReasonJurus" class="alasan-menang">ALASAN MENANG</h2>
                <img id="winFotoJurus" class="foto-pemenang-utama" src="" style="display:none;" onerror="this.style.display='none'">
                <h1 class="title-menang">
                    <span id="winSudutJurus" class="sudut-teks">SUDUT X</span>
                    <span class="menang-teks">MENANG</span>
                </h1>
                <h3 id="winNameJurus" class="nama-atlet">NAMA PESILAT</h3>
            </div>
        </div>
    </div>

    <!-- PHASE 2: REKAP STATISTIK JURUS -->
    <div class="rekap-view" id="rekapViewPanelJurus">
        
        <div class="rkp-header-top">
            <div class="rkp-sponsor" id="rkpSponsorKiriJurus"></div>
            <div class="rkp-title" id="rkpKejuaraanJurus">KEJUARAAN</div>
            <div class="rkp-sponsor" id="rkpSponsorKananJurus"></div>
        </div>

        <div class="rkp-bar">
            <div class="rkp-box rkp-bg-biru">
                <img id="rkpFotoBiruJurus" class="foto-rekap-kecil" src="" style="display:none;" onerror="this.style.display='none'">
                <div class="rkp-teks-wadah">
                    <div class="rkp-nama" id="rkpNamaBiruJurus">SUDUT BIRU</div>
                    <div class="rkp-negara" id="rkpKonBiruJurus">-</div>
                </div>
            </div>
            <div class="rkp-box rkp-bg-merah">
                <div class="rkp-teks-wadah">
                    <div class="rkp-nama" id="rkpNamaMerahJurus">SUDUT MERAH</div>
                    <div class="rkp-negara" id="rkpKonMerahJurus">-</div>
                </div>
                <img id="rkpFotoMerahJurus" class="foto-rekap-kecil" src="" style="display:none;" onerror="this.style.display='none'">
            </div>
        </div>

        <div class="rkp-bar" style="margin-bottom: 2vh;">
            <div class="rkp-box-info" id="rkpGelanggangJurus">G?</div>
            <div class="rkp-box-info" id="rkpKategoriJurus">KATEGORI JURUS</div>
            <div class="rkp-box-info" id="rkpKelasJurus">KELAS / TINGKAT</div>
            <div class="rkp-box-info" id="rkpBabakJurus">BABAK</div>
        </div>

        <div class="rkp-container">
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpMedianBiru">0.000</div>
                <div class="rkp-col rkp-label">NILAI TENGAH (MEDIAN JURI)</div>
                <div class="rkp-col rkp-skor" id="rkpMedianMerah">0.000</div>
            </div>
            <div class="rkp-row">
                <div class="rkp-col rkp-skor teks-warning" id="rkpHukumanBiru">0.00</div>
                <div class="rkp-col rkp-label teks-warning">HUKUMAN / POTONGAN DEWAN</div>
                <div class="rkp-col rkp-skor teks-warning" id="rkpHukumanMerah">0.00</div>
            </div>
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpWaktuBiru" style="color:#4dabf7;">00:00</div>
                <div class="rkp-col rkp-label">WAKTU PENAMPILAN</div>
                <div class="rkp-col rkp-skor" id="rkpWaktuMerah" style="color:#ff4d4d;">00:00</div>
            </div>
            <div class="rkp-row">
                <div class="rkp-col rkp-skor" id="rkpSDBiru" style="font-size: 3vh; color:#aaa;">0.00000</div>
                <div class="rkp-col rkp-label" style="font-size: 1.8vh; color:#aaa;">STANDAR DEVIASI (S.D)</div>
                <div class="rkp-col rkp-skor" id="rkpSDMerah" style="font-size: 3vh; color:#aaa;">0.00000</div>
            </div>

            <div class="rkp-row" style="margin-top: 1.5vh; border-top: 0.3vh dashed rgba(255, 193, 7, 0.5); padding-top: 2.5vh;">
                <div class="rkp-col rkp-skor-akhir" id="rkpTotalBiruJurus">0.000</div>
                <div class="rkp-col rkp-label" style="font-size: 3vh; color: #ffffff; text-shadow: 0 0 1vh rgba(255,255,255,0.5);">SKOR AKHIR</div>
                <div class="rkp-col rkp-skor-akhir" id="rkpTotalMerahJurus">0.000</div>
            </div>
            
            <div style="margin-top: 1vh; text-align: center;">
                <div id="rkpAlasanBawahJurus" class="skor-menang" style="font-family: 'Arial Black', sans-serif; font-size: 3.5vh; font-weight: 900; color: #ffc107; text-transform: uppercase; text-shadow: 0 0.4vh 1.5vh rgba(0,0,0,0.8); line-height: 1;">ALASAN</div>
            </div>
        </div>
    </div>
`;
document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(overlayPemenangHtml);
});

let bokehIntervalJurus;
let rekapTimeout1Jurus;
let rekapTimeout2Jurus;

window.mainkanEfekPemenangJurus = function (sudut, namaAtlet, alasan, dataBiru, dataMerah) {
    let overlay = document.getElementById('winnerOverlayJurus');
    if (!overlay) return;

    clearTimeout(rekapTimeout1Jurus);
    clearTimeout(rekapTimeout2Jurus);
    document.getElementById('winnerContentPanelJurus').style.display = 'block';
    document.getElementById('winnerContentPanelJurus').style.opacity = '1';
    document.getElementById('rekapViewPanelJurus').style.display = 'none';
    document.getElementById('rekapViewPanelJurus').style.opacity = '0';

    // 🔥 FUNGSI SULAP LINK GOOGLE DRIVE MENJADI GAMBAR LANGSUNG (SERVER LH3) 🔥
    function ubahKeLinkGambar(url) {
        if (!url) return "";
        // Tangkap ID unik foto dari link Drive Anda
        let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
            // Gunakan server gambar khusus Google (100% Anti-Blokir)
            return "https://lh3.googleusercontent.com/d/" + match[1];
        }
        return url;
    }

    // 🔥 LOGIKA FOTO JURUS (DARI HTML JEMBATAN) 🔥
    let urlBiru = ubahKeLinkGambar(window.fotoBiruGlobal || "");
    let urlMerah = ubahKeLinkGambar(window.fotoMerahGlobal || "");
    let saklar = window.saklarFotoGlobal || "sembunyi";
    let urlPemenang = (sudut.toLowerCase() === 'biru') ? urlBiru : urlMerah;
    
    let elWinFotoJ = document.getElementById('winFotoJurus');
    if (saklar === 'tampil' && urlPemenang && sudut !== 'seri') {
        elWinFotoJ.src = urlPemenang; elWinFotoJ.style.display = 'inline-block';
        setTimeout(() => elWinFotoJ.classList.add('tampil'), 100);
    } else { elWinFotoJ.style.display = 'none'; elWinFotoJ.classList.remove('tampil'); }

    document.getElementById('winReasonJurus').innerText = alasan;
    document.getElementById('winSudutJurus').innerText = (sudut === 'seri') ? "HASIL" : "SUDUT " + sudut;
    document.getElementById('winNameJurus').innerText = (sudut === 'seri') ? "SERI / DRAW" : namaAtlet;

    overlay.className = '';
    if (sudut.toLowerCase() === 'biru') overlay.classList.add('theme-biru');
    else if (sudut.toLowerCase() === 'merah') overlay.classList.add('theme-merah');

    void overlay.offsetWidth; 
    overlay.classList.add('show');

    let container = document.getElementById('particleContainerJurus');
    container.innerHTML = '';
    clearInterval(bokehIntervalJurus);
    bokehIntervalJurus = setInterval(() => {
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

    rekapTimeout1Jurus = setTimeout(() => {
        document.getElementById('winnerContentPanelJurus').style.opacity = '0';
        
        rekapTimeout2Jurus = setTimeout(() => {
            document.getElementById('winnerContentPanelJurus').style.display = 'none';
            let rekapView = document.getElementById('rekapViewPanelJurus');
            rekapView.style.display = 'flex';

            // 🔥 LOGIKA FOTO TABEL REKAP JURUS 🔥
            let elRkpFotoBiru = document.getElementById('rkpFotoBiruJurus');
            let elRkpFotoMerah = document.getElementById('rkpFotoMerahJurus');
            elRkpFotoBiru.classList.remove('menang', 'tampil'); elRkpFotoMerah.classList.remove('menang', 'tampil');
            
            if (saklar === 'tampil') {
                if (urlBiru) { elRkpFotoBiru.src = urlBiru; elRkpFotoBiru.style.display = 'inline-block'; setTimeout(() => elRkpFotoBiru.classList.add('tampil'), 100); if (sudut.toLowerCase() === 'biru') elRkpFotoBiru.classList.add('menang'); } else { elRkpFotoBiru.style.display = 'none'; }
                if (urlMerah) { elRkpFotoMerah.src = urlMerah; elRkpFotoMerah.style.display = 'inline-block'; setTimeout(() => elRkpFotoMerah.classList.add('tampil'), 100); if (sudut.toLowerCase() === 'merah') elRkpFotoMerah.classList.add('menang'); } else { elRkpFotoMerah.style.display = 'none'; }
            } else { elRkpFotoBiru.style.display = 'none'; elRkpFotoMerah.style.display = 'none'; }

            if (document.getElementById('wadahKiri')) document.getElementById('rkpSponsorKiriJurus').innerHTML = document.getElementById('wadahKiri').innerHTML;
            if (document.getElementById('wadahKanan')) document.getElementById('rkpSponsorKananJurus').innerHTML = document.getElementById('wadahKanan').innerHTML;
            if (document.getElementById('judulKejuaraan')) document.getElementById('rkpKejuaraanJurus').innerText = document.getElementById('judulKejuaraan').innerText;

            if (document.getElementById('s_nama_atlet')) {
                let dSetup = window.dataSetupGlobalTV || {};
                document.getElementById('rkpNamaBiruJurus').innerText = dSetup.nama_biru || "SUDUT BIRU";
                document.getElementById('rkpKonBiruJurus').innerText = dSetup.kontingen_biru || "-";
                document.getElementById('rkpNamaMerahJurus').innerText = dSetup.nama_merah || "SUDUT MERAH";
                document.getElementById('rkpKonMerahJurus').innerText = dSetup.kontingen_merah || "-";
                
                let gelLayar = document.getElementById('lGelanggangLayar');
                document.getElementById('rkpGelanggangJurus').innerText = gelLayar ? gelLayar.value.toUpperCase() : "G1";
                document.getElementById('rkpKategoriJurus').innerText = dSetup.jenis_seni || "JURUS";
                let tkt = dSetup.tingkat || ""; let kls = dSetup.kelas || "";
                document.getElementById('rkpKelasJurus').innerText = (tkt + " " + kls).trim().toUpperCase();
                document.getElementById('rkpBabakJurus').innerText = dSetup.babak || "PENAMPILAN";
            }

            if(dataBiru && dataMerah) {
                document.getElementById('rkpMedianBiru').innerText = parseFloat(dataBiru.median).toFixed(3);
                document.getElementById('rkpMedianMerah').innerText = parseFloat(dataMerah.median).toFixed(3);
                document.getElementById('rkpHukumanBiru').innerText = (parseFloat(dataBiru.hukuman) === 0) ? "0.00" : parseFloat(dataBiru.hukuman).toFixed(2);
                document.getElementById('rkpHukumanMerah').innerText = (parseFloat(dataMerah.hukuman) === 0) ? "0.00" : parseFloat(dataMerah.hukuman).toFixed(2);
                document.getElementById('rkpWaktuBiru').innerText = dataBiru.waktu || "00:00";
                document.getElementById('rkpWaktuMerah').innerText = dataMerah.waktu || "00:00";
                document.getElementById('rkpSDBiru').innerText = parseFloat(dataBiru.sd).toFixed(5);
                document.getElementById('rkpSDMerah').innerText = parseFloat(dataMerah.sd).toFixed(5);
                document.getElementById('rkpTotalBiruJurus').innerText = parseFloat(dataBiru.final).toFixed(3);
                document.getElementById('rkpTotalMerahJurus').innerText = parseFloat(dataMerah.final).toFixed(3);
            }

            let elTotalBiru = document.getElementById('rkpTotalBiruJurus');
            let elTotalMerah = document.getElementById('rkpTotalMerahJurus');
            elTotalBiru.classList.remove('skor-menang');
            elTotalMerah.classList.remove('skor-menang');

            if (sudut.toLowerCase() === 'biru') elTotalBiru.classList.add('skor-menang');
            else if (sudut.toLowerCase() === 'merah') elTotalMerah.classList.add('skor-menang');

            document.getElementById('rkpAlasanBawahJurus').innerText = alasan;

            void rekapView.offsetWidth;
            rekapView.style.opacity = '1';
        }, 500);
    }, 2800); 
};

window.tutupEfekPemenangJurus = function () {
    let overlay = document.getElementById('winnerOverlayJurus');
    if (overlay) overlay.classList.remove('show');
    clearInterval(bokehIntervalJurus); clearTimeout(rekapTimeout1Jurus); clearTimeout(rekapTimeout2Jurus);
    let container = document.getElementById('particleContainerJurus');
    if (container) container.innerHTML = '';
    
    // Matikan Foto
    if(document.getElementById('winFotoJurus')) document.getElementById('winFotoJurus').classList.remove('tampil');
    if(document.getElementById('rkpFotoBiruJurus')) document.getElementById('rkpFotoBiruJurus').classList.remove('tampil');
    if(document.getElementById('rkpFotoMerahJurus')) document.getElementById('rkpFotoMerahJurus').classList.remove('tampil');
};