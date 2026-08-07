// ==========================================
// 🔥 MESIN FACE-OFF EKSKLUSIF (TALE OF THE TAPE) 🔥
// ==========================================
(function() {
    // 1. Merakit Panggung HTML & CSS langsung dari Javascript
    const style = document.createElement('style');
    style.innerHTML = `
        #faceoff-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.95); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.5s ease;
            overflow: hidden;
        }
        #faceoff-overlay.show { opacity: 1; pointer-events: auto; }
        
        .fo-side { width: 50%; height: 100%; position: absolute; top: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .fo-blue { left: 0; background: linear-gradient(90deg, rgba(13,110,253,0.4) 0%, rgba(0,0,0,0) 100%); transform: translateX(-100%); }
        .fo-red { right: 0; background: linear-gradient(-90deg, rgba(220,53,69,0.4) 0%, rgba(0,0,0,0) 100%); transform: translateX(100%); }
        
        #faceoff-overlay.show .fo-blue { animation: slideInL 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        #faceoff-overlay.show .fo-red { animation: slideInR 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        
        @keyframes slideInL { to { transform: translateX(0); } }
        @keyframes slideInR { to { transform: translateX(0); } }
        
        .fo-foto { width: 45vh; height: 60vh; object-fit: cover; object-position: top center; border-radius: 1vh; box-shadow: 0 2vh 5vh rgba(0,0,0,0.8); border: 0.5vh solid #fff; background: #111; }
        .fo-nama { font-family: 'Arial Black', sans-serif; font-size: 6vh; color: #fff; margin-top: 3vh; text-transform: uppercase; text-shadow: 0 0.5vh 1vh rgba(0,0,0,0.8); text-align: center; line-height: 1.1; }
        .fo-kontingen { font-size: 3vh; color: #ffc107; text-transform: uppercase; margin-top: 1vh; font-weight: bold; }
        
        .fo-vs { position: absolute; z-index: 10; font-family: 'Arial Black', sans-serif; font-size: 20vh; color: #ffc107; text-shadow: 0 0 5vh rgba(255,193,7,1), 0 1vh 3vh #000; transform: scale(0); }
        #faceoff-overlay.show .fo-vs { animation: boomVS 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; animation-delay: 0.6s; }
        
        @keyframes boomVS { 0% { transform: scale(0); } 100% { transform: scale(1) rotate(-5deg); } }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'faceoff-overlay';
    overlay.innerHTML = `
        <div class="fo-side fo-blue">
            <img id="fo-img-biru" class="fo-foto" src="" onerror="this.style.display='none'">
            <div id="fo-nama-biru" class="fo-nama">BIRU</div>
            <div id="fo-kont-biru" class="fo-kontingen">-</div>
        </div>
        <div class="fo-side fo-red">
            <img id="fo-img-merah" class="fo-foto" src="" onerror="this.style.display='none'">
            <div id="fo-nama-merah" class="fo-nama">MERAH</div>
            <div id="fo-kont-merah" class="fo-kontingen">-</div>
        </div>
        <div class="fo-vs">VS</div>
    `;
    document.body.appendChild(overlay);

    // 2. Fungsi Jalur Belakang Server Foto
    function sulapLinkFaceOff(url) {
        if (!url) return "";
        let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return (match && match[1]) ? "https://lh3.googleusercontent.com/d/" + match[1] : url;
    }

    // 3. Tombol Pemicu Utama (Dijalankan dari file utama)
    window.mainkanFaceOff = function(dataSetup) {
        if (!dataSetup) return;
        
        // Cek Saklar (Kalau di layar pengaturan panitia fiturnya dimatikan, Face-Off batal)
        let saklar = window.saklarFotoGlobal || "sembunyi";
        if (saklar !== 'tampil') return; 

        // Pasang Link Gambar
        let urlBiru = sulapLinkFaceOff(dataSetup.foto_biru || "");
        let urlMerah = sulapLinkFaceOff(dataSetup.foto_merah || "");
        
        let imgB = document.getElementById('fo-img-biru');
        let imgM = document.getElementById('fo-img-merah');
        
        // Sembunyikan bingkai jika foto kosong agar tidak ada kotak kosong bolong
        imgB.src = urlBiru; imgB.style.display = urlBiru ? 'block' : 'none';
        imgM.src = urlMerah; imgM.style.display = urlMerah ? 'block' : 'none';
        
        // Pasang Teks
        document.getElementById('fo-nama-biru').innerText = dataSetup.nama_biru || "BIRU";
        document.getElementById('fo-kont-biru').innerText = dataSetup.kontingen_biru || "-";
        
        document.getElementById('fo-nama-merah').innerText = dataSetup.nama_merah || "MERAH";
        document.getElementById('fo-kont-merah').innerText = dataSetup.kontingen_merah || "-";

        // MUNCULKAN!
        const foOverlay = document.getElementById('faceoff-overlay');
        foOverlay.classList.add('show');

        // TUTUP OTOMATIS SETELAH 4 DETIK
        // (Waktu yang pas sebelum juri mulai menekan nilai)
        setTimeout(() => {
            foOverlay.classList.remove('show');
        }, 4000); 
    };
})();