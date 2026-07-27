// ============================================================================
// 📊 MESIN REKAPITULASI DATA LENGKAP & FORMAT PERSIS GOOGLE SHEET
// ============================================================================

window.unduhRekapLengkap = function(dataRiwayatFirebase, namaGelanggang, jadwalTandingGlobal, jadwalJurusGlobal, himpunanSelesai) {
    
    let arr = dataRiwayatFirebase ? Object.values(dataRiwayatFirebase) : [];
    
    // Urutkan berdasarkan nomor partai secara ascending
    arr.sort((a, b) => parseInt(a.mapped_partai || a.PARTAI || a.partai || 0) - parseInt(b.mapped_partai || b.PARTAI || b.partai || 0));

    // 1. Buat kamus pencari pemenang berdasarkan nomor partai untuk melacak "PEMENANG PARTAI X"
    let pemenangPerPartai = {};
    arr.forEach(item => {
        let pNo = parseInt(item.mapped_partai || item.PARTAI || item.partai);
        let pArah = item.SUDUT_MENANG || item.pemenangArah;
        let nB = item.mapped_biru || item['SUDUT BIRU'] || item.nama_biru || "";
        let kB = item.mapped_kont_biru || item['KONTINGEN BIRU'] || item.kontingen_biru || "";
        let nM = item.mapped_merah || item['SUDUT MERAH'] || item.nama_merah || "";
        let kM = item.mapped_kont_merah || item['KONTINGEN MERAH'] || item.kontingen_merah || "";

        let isBiruDami = String(nB).toUpperCase().includes("DAMI") || String(nB).toUpperCase().includes("BYE");
        let isMerahDami = String(nM).toUpperCase().includes("DAMI") || String(nM).toUpperCase().includes("BYE");
        if (isBiruDami) pArah = "merah";
        if (isMerahDami) pArah = "biru";

        let namaMenang = "-";
        let kontMenang = "-";
        if (pArah === "biru") {
            namaMenang = isBiruDami ? nM : nB;
            kontMenang = isBiruDami ? kM : kB;
        } else if (pArah === "merah") {
            namaMenang = isMerahDami ? nB : nM;
            kontMenang = isMerahDami ? kB : kM;
        } else if (item['NAMA ATLET']) {
            namaMenang = item['NAMA ATLET'];
            kontMenang = item['KONTINGEN'] || "-";
        }

        if (pNo) {
            pemenangPerPartai[pNo] = { nama: namaMenang, kontingen: kontMenang };
        }
    });

    // Helper untuk mengubah "PEMENANG PARTAI X" menjadi Nama Atlet Asli
    function resolveCornerName(text) {
        let upper = String(text || "").toUpperCase();
        let match = upper.match(/PEMENANG\s+PARTAI\s+(\d+)/);
        if (match) {
            let targetPartai = parseInt(match[1]);
            if (pemenangPerPartai[targetPartai] && pemenangPerPartai[targetPartai].nama !== "-") {
                return pemenangPerPartai[targetPartai].nama;
            }
        }
        return text;
    }

    function resolveCornerKontingen(text) {
        let upper = String(text || "").toUpperCase();
        let match = upper.match(/PEMENANG\s+PARTAI\s+(\d+)/);
        if (match) {
            let targetPartai = parseInt(match[1]);
            if (pemenangPerPartai[targetPartai]) {
                return pemenangPerPartai[targetPartai].kontingen;
            }
        }
        return text;
    }

    let exportJejak = [];

    arr.forEach(item => {
        let isTanding = (item.mapped_kategori !== "Jurus" && item.KATEGORI !== "Jurus");
        let partaiNo = item.mapped_partai || item.PARTAI || item.partai || "-";

        let rawNB = item.mapped_biru || item['SUDUT BIRU'] || item.nama_biru || "-";
        let rawNM = item.mapped_merah || item['SUDUT MERAH'] || item.nama_merah || "-";

        let nB_resolved = resolveCornerName(rawNB);
        let kB_resolved = resolveCornerKontingen(item.mapped_kont_biru || item['KONTINGEN BIRU'] || item.kontingen_biru || "-");
        let nM_resolved = resolveCornerName(rawNM);
        let kM_resolved = resolveCornerKontingen(item.mapped_kont_merah || item['KONTINGEN MERAH'] || item.kontingen_merah || "-");

        let pemenangArah = item.SUDUT_MENANG || item.pemenangArah || "-";
        let isBiruDami = String(rawNB).toUpperCase().includes("DAMI") || String(rawNB).toUpperCase().includes("BYE");
        let isMerahDami = String(rawNM).toUpperCase().includes("DAMI") || String(rawNM).toUpperCase().includes("BYE");
        let alasan = item.alasan || item.alasan_menang || item.KETERANGAN || item['KEPUTUSAN / ALASAN'] || "MENANG POIN";

        if (isBiruDami || isMerahDami) {
            alasan = "Menang BYE / Undur Diri";
            if (isBiruDami) pemenangArah = "merah";
            if (isMerahDami) pemenangArah = "biru";
        }

        let namaKalah = "-";
        if (pemenangArah === "biru") {
            namaKalah = nM_resolved;
        } else if (pemenangArah === "merah") {
            namaKalah = nB_resolved;
        }

        let babakStr = String(item.mapped_babak || item.BABAK || "").toUpperCase();
        let mPenyisihan = "-", mSemi = "-", mFinal = "-";
        let jTiga = "-", jDua = "-", jSatu = "-";

        if (isTanding && pemenangArah !== "seri" && pemenangArah !== "-") {
            let pemenangFull = pemenangArah === "biru" ? nB_resolved : nM_resolved;
            if (babakStr.includes("SEMI")) {
                mSemi = pemenangFull;
                jTiga = namaKalah;
            } else if (babakStr.includes("FINAL") && !babakStr.includes("PEREMPAT") && !babakStr.includes("DELAPAN")) {
                mFinal = pemenangFull;
                jSatu = pemenangFull;
                jDua = namaKalah;
            } else {
                mPenyisihan = pemenangFull;
            }
        }

        let wkt = item.timestamp ? new Date(item.timestamp).toLocaleString("id-ID") : (item['WAKTU'] || item['WAKTU SELESAI'] || "-");
        let skorBiru = item.skor_biru !== undefined ? item.skor_biru : (item['SKOR BIRU'] !== undefined ? item['SKOR BIRU'] : 0);
        let skorMerah = item.skor_merah !== undefined ? item.skor_merah : (item['SKOR MERAH'] !== undefined ? item['SKOR MERAH'] : 0);
        let kelasLengkap = item['KELAS LENGKAP'] || `${item.mapped_tingkat || item.TINGKAT || "-"} ${item.mapped_kelas || item.KELAS || ""}`;

        // Mapped kolom persis sama dengan urutan Google Sheet Anda
        exportJejak.push({
            "WAKTU": wkt,
            "GELANGGANG": (namaGelanggang || "Gelanggang 1").toUpperCase(),
            "PARTAI": partaiNo,
            "BABAK": item.mapped_babak || item.BABAK || "-",
            "KELAS LENGKAP": kelasLengkap.trim(),
            "NAMA SUDUT BIRU": nB_resolved,
            "KONTINGEN BIRU": kB_resolved,
            "SKOR BIRU": skorBiru,
            "NAMA SUDUT MERAH": nM_resolved,
            "KONTINGEN MERAH": kM_resolved,
            "SKOR MERAH": skorMerah,
            "KEPUTUSAN / ALASAN": alasan,
            "PENYISIHAN": mPenyisihan,
            "SEMI FINAL": mSemi,
            "FINAL": mFinal,
            "JUARA 3 BERSAMA": jTiga,
            "JUARA 2": jDua,
            "JUARA 1": jSatu,
            "WASIT": item.wasit || item.WASIT || "-",
            "JURI 1": item.j1 || item['JURI 1'] || "-",
            "JURI 2": item.j2 || item['JURI 2'] || "-",
            "JURI 3": item.j3 || item['JURI 3'] || "-"
        });
    });

    // 2. Tab Jadwal Siap Tanding
    let exportJadwal = [];
    let urutanPartaiBaru = 1;
    if (jadwalTandingGlobal) {
        jadwalTandingGlobal.forEach((row, index) => {
            if (himpunanSelesai && himpunanSelesai.has(index)) return;
            let nB = resolveCornerName(row.mapped_biru);
            let kB = resolveCornerKontingen(row.mapped_kont_biru);
            let nM = resolveCornerName(row.mapped_merah);
            let kM = resolveCornerKontingen(row.mapped_kont_merah);

            let isGaib = String(nB).toUpperCase().includes("DAMI") || String(nM).toUpperCase().includes("DAMI") || String(nB).toUpperCase().includes("BYE") || String(nM).toUpperCase().includes("BYE");
            if (!isGaib) {
                exportJadwal.push({
                    "PARTAI": urutanPartaiBaru++,
                    "GELANGGANG": row.mapped_gelanggang || (namaGelanggang || "Gelanggang 1").toUpperCase(),
                    "BABAK": row.mapped_babak || "-",
                    "TINGKAT": row.mapped_tingkat || "-",
                    "KELAS": row.mapped_kelas || "-",
                    "SUDUT BIRU": nB,
                    "KONTINGEN BIRU": kB,
                    "SUDUT MERAH": nM,
                    "KONTINGEN MERAH": kM
                });
            }
        });
    }

    // 3. Ekspor ke Excel (2 Tab)
    let wb = XLSX.utils.book_new();
    let wsJejak = exportJejak.length > 0 ? XLSX.utils.json_to_sheet(exportJejak) : XLSX.utils.json_to_sheet([{"Pesan": "Belum ada pemenang"}]);
    XLSX.utils.book_append_sheet(wb, wsJejak, "Daftar Pemenang Lengkap");

    let wsJadwal = exportJadwal.length > 0 ? XLSX.utils.json_to_sheet(exportJadwal) : XLSX.utils.json_to_sheet([{"Pesan": "Belum ada jadwal lanjutan"}]);
    XLSX.utils.book_append_sheet(wb, wsJadwal, "Jadwal Siap Tanding");

    XLSX.writeFile(wb, `Rekap_Pemenang_${(namaGelanggang || "G1").toUpperCase()}.xlsx`);
    
    if (typeof window.showCustomAlert === "function") {
        window.showCustomAlert("✅ Sukses Download", "Data Pemenang berhasil diunduh dengan format identik Google Sheet.", "text-success");
    } else {
        alert("✅ Sukses Download Rekap!");
    }
};