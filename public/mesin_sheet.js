// ============================================================================
// 🔥 MESIN PENGIRIMAN DATA (SHEET BUILDER) - DIGITAL PENCAK SILAT 🔥
// Tugas: Merakit Payload lengkap (Termasuk data Sertifikat) & Mengirim ke Sheet
// ============================================================================

window.kirimKeSheetPanitia = function(dataPayload) {
    try {
        let link = dataPayload.googleSheetUrl; 
        if(!link || link.trim() === "") {
            console.warn("URL Sheet kosong, tidak bisa mengirim ke excel.");
            return; 
        } 
        
        let sheetMatch = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if(!sheetMatch) { console.warn("URL Sheet tidak valid, abaikan."); return; }
        let sheetId = sheetMatch[1]; 

        let gidMatch = link.match(/[#&]gid=([0-9]+)/); 
        let tabId = gidMatch ? parseInt(gidMatch[1]) : 0; 
        
        let wkt = new Date().toLocaleString("id-ID"); 
        
        // ---------------------------------------------------------
        // 🏗️ STRUKTUR LOGIKA BAGAN (SEKRETARIS CERDAS)
        // ---------------------------------------------------------
        let mPenyisihan = "-"; let mSemi = "-"; let mFinal = "-";
        let jTiga2 = "-"; let jTiga1 = "-"; let jDua = "-"; let jSatu = "-";

        if (dataPayload.kategoriAktif === 'tanding' && dataPayload.pemenangArah !== 'seri') {
            let babakStr = String(dataPayload.babak).toUpperCase();
            
            if (babakStr.includes("SEMI")) {
                mSemi = `${dataPayload.namaPemenang} (${dataPayload.kontPemenang})`;
                
                if (!window.penghitungSemiFinalLokal) window.penghitungSemiFinalLokal = {};
                if (!window.penghitungSemiFinalLokal[dataPayload.kelasLengkap]) window.penghitungSemiFinalLokal[dataPayload.kelasLengkap] = 0;
                window.penghitungSemiFinalLokal[dataPayload.kelasLengkap]++; 
                
                let kalahFull = `${dataPayload.namaKalah} (${dataPayload.kontKalah})`;
                
                if (window.penghitungSemiFinalLokal[dataPayload.kelasLengkap] % 2 !== 0) {
                    jTiga2 = kalahFull;
                } else {
                    jTiga1 = kalahFull;
                }
            } 
            else if (babakStr.includes("FINAL")) {
                mFinal = `${dataPayload.namaPemenang} (${dataPayload.kontPemenang})`;
                jSatu = `${dataPayload.namaPemenang} (${dataPayload.kontPemenang})`;
                jDua = `${dataPayload.namaKalah} (${dataPayload.kontKalah})`;
            } 
            else {
                mPenyisihan = `${dataPayload.namaPemenang} (${dataPayload.kontPemenang})`;
            }
        }

        // ---------------------------------------------------------
        //  PAYLOAD KOLOM EXCEL (Diperbarui dengan Data Sertifikat Lengkap)
        // ---------------------------------------------------------
        let dataSheet = (dataPayload.kategoriAktif === 'tanding') 
            ? [
                wkt, dataPayload.gelText, dataPayload.partai, dataPayload.babak, dataPayload.kelasLengkap, 
                dataPayload.nB, dataPayload.kB, dataPayload.skorBiruTotal, 
                dataPayload.nM, dataPayload.kM, dataPayload.skorMerahTotal, 
                dataPayload.alasan, 
                mPenyisihan, mSemi, mFinal, 
                jTiga2, jTiga1, jDua, jSatu, 
                dataPayload.wasit, dataPayload.j1, dataPayload.j2, dataPayload.j3,
                
                // 🔥 EKSTRA DATA UNTUK SERTIFIKAT (Kolom Baru di Kanan)
                dataPayload.namaPemenang, 
                dataPayload.kontPemenang, 
                dataPayload.kategoriJuara,   // 1, 2, atau 3
                "Pertandingan (Tanding)",            // Jenis Lomba
                dataPayload.kelasSertifikat, // Misal: "Kelas A"
                dataPayload.gender,          // Putra/Putri
                dataPayload.tingkatSertifikat// Misal: "[Pra Remaja]"
              ]
            : [
                wkt, dataPayload.gelText, dataPayload.partai, dataPayload.babak, dataPayload.kelasLengkap, 
                dataPayload.nB, dataPayload.kB, dataPayload.skorBiruTotal, 
                dataPayload.nM, dataPayload.kM, dataPayload.skorMerahTotal, 
                dataPayload.alasan, 
                "-", "-", "-", "-", "-", "-", "-", 
                dataPayload.wasit, dataPayload.dewan, dataPayload.j1, dataPayload.j2,
                
                // 🔥 EKSTRA DATA UNTUK SERTIFIKAT (Jurus)
                dataPayload.namaPemenang, 
                dataPayload.kontPemenang, 
                "1",                         // Asumsi Juara 1 untuk Jurus
                "Jurus / TGR",                // Jenis Lomba
                dataPayload.kelasSertifikat, // Misal: "Tunggal"
                dataPayload.gender,          // Putra/Putri
                dataPayload.tingkatSertifikat// Misal: "[Remaja]"
              ];
              

        // MENGIRIM PAYLOAD KE GOOGLE APPS SCRIPT
        fetch("https://script.google.com/macros/s/AKfycbxPahwtXYz_ITepb8D_3HLmZGQq978yLz-GXE5_0j12mOlGr1152wxd74xnHmWVOrHeHw/exec", { 
            method: 'POST', 
            body: JSON.stringify({ 
                sheetId: sheetId, 
                tabId: tabId, 
                kategori: dataPayload.kategoriAktif, 
                // 🔥 Ubah tulisan REKAP_TANDING menjadi nama tab asli Anda di sini 🔥
                sheetTab: (dataPayload.kategoriAktif === 'tanding' ? 'Data Pertandingan' : 'Data Jurus'), 
                data: dataSheet, 
                pemenang: dataPayload.pemenangArah 
            }), 
            headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
        })
        .catch(e => console.warn("Gagal sync ke Sheet, namun aman di Firebase: " + e));
        
    } catch (error) {
        console.warn("Ada yang salah saat merakit link Sheet, penyimpanan lanjut ke lokal.", error);
    }
}