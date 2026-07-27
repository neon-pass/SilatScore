// ============================================================================
// MESIN PENGIRIMAN DATA (SHEET BUILDER)
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
        // STRUKTUR LOGIKA BAGAN
        // ---------------------------------------------------------
        let mPenyisihan = "-"; let mSemi = "-"; let mFinal = "-";
        let jTiga = "-"; let jDua = "-"; let jSatu = "-";

        if (dataPayload.kategoriAktif === 'tanding' && dataPayload.pemenangArah !== 'seri') {
            let babakStr = String(dataPayload.babak).toUpperCase();
            
            if (babakStr.includes("SEMI")) {
                mSemi = dataPayload.namaPemenang || "-"; 
                jTiga = dataPayload.namaKalah || "-";    
            } 
            // Anti-Jebakan: Pastikan ini murni FINAL, bukan PEREMPAT FINAL atau 1/4 FINAL
            else if (babakStr.includes("FINAL") && !babakStr.includes("PEREMPAT") && !babakStr.includes("DELAPAN") && !babakStr.includes("1/")) {
                mFinal = dataPayload.namaPemenang || "-";
                jSatu = dataPayload.namaPemenang || "-"; 
                jDua = dataPayload.namaKalah || "-";     
            } 
            else {
                // Semua babak sebelum semi (Penyisihan, Perempat Final, Perdelapan Final) masuk sini
                mPenyisihan = dataPayload.namaPemenang || "-"; 
            }
        }

        // ---------------------------------------------------------
        // PAYLOAD TAB UTAMA
        // ---------------------------------------------------------
        let dataSheet = (dataPayload.kategoriAktif === 'tanding') 
            ? [
                wkt, dataPayload.gelText, dataPayload.partai, dataPayload.babak, dataPayload.kelasLengkap, 
                dataPayload.nB, dataPayload.kB, dataPayload.skorBiruTotal, 
                dataPayload.nM, dataPayload.kM, dataPayload.skorMerahTotal, 
                dataPayload.alasan, 
                mPenyisihan, mSemi, mFinal, 
                jTiga, jDua, jSatu, 
                dataPayload.wasit, dataPayload.j1, dataPayload.j2, dataPayload.j3
              ]
            : [
                wkt, dataPayload.gelText, dataPayload.partai, dataPayload.babak, dataPayload.kelasLengkap, 
                dataPayload.nB, dataPayload.kB, dataPayload.skorBiruTotal, 
                dataPayload.nM, dataPayload.kM, dataPayload.skorMerahTotal, 
                dataPayload.alasan, 
                "-", "-", "-", "-", "-", "-", 
                dataPayload.wasit, dataPayload.dewan, dataPayload.j1, dataPayload.j2
              ];

        fetch("https://script.google.com/macros/s/AKfycbxPahwtXYz_ITepb8D_3HLmZGQq978yLz-GXE5_0j12mOlGr1152wxd74xnHmWVOrHeHw/exec", { 
            method: 'POST', 
            body: JSON.stringify({ 
                sheetId: sheetId, 
                tabId: tabId, 
                kategori: dataPayload.kategoriAktif, 
                sheetTab: dataPayload.sheetTab, 
                data: dataSheet, 
                pemenang: dataPayload.pemenangArah,
                namaPemenang: dataPayload.namaPemenang,
                kontPemenang: dataPayload.kontPemenang,
                namaKalah: dataPayload.namaKalah,
                kontKalah: dataPayload.kontKalah,
                babak: dataPayload.babak,
                kelasSertifikat: dataPayload.kelasSertifikat,
                gender: dataPayload.gender,
                tingkatSertifikat: dataPayload.tingkatSertifikat
            }), 
            headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
        })
        .catch(e => console.warn("Gagal sync ke Sheet, namun aman di Firebase: " + e));
        
    } catch (error) {
        console.warn("Ada yang salah saat merakit link Sheet, penyimpanan lanjut ke lokal.", error);
    }
}