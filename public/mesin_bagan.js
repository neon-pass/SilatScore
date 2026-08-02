function getWeight(finalKat) {
    let str = finalKat.toUpperCase();
    if (str.includes("DINI 1")) return 1;
    if (str.includes("DINI 2") || str.includes("SD")) return 2;
    if (str.includes("PRA REMAJA") || str.includes("SMP")) return 3;
    if (str.includes("REMAJA") || str.includes("SMA")) return 4;
    if (str.includes("DEWASA") || str.includes("MAHASISWA") || str.includes("UMUM")) return 5;
    if (str.includes("MASTER")) return 6;
    return 99;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function buatBaganTopDown(poolMembers, tingkat, kelasStr, poolName, baganSize, levelSifat, kategoriJenis) {
    let aslis = poolMembers.filter(p => !p.IsDami);
    let damis = poolMembers.filter(p => p.IsDami);
    let matches = [];

    if (baganSize === 6) {
        let slots = new Array(6).fill(null);
        slots[2] = aslis.shift(); slots[5] = aslis.shift();
        slots[1] = damis.length > 0 ? damis.shift() : aslis.shift();
        slots[4] = damis.length > 0 ? damis.shift() : aslis.shift();
        slots[0] = aslis.shift(); slots[3] = aslis.shift();

        let p1_m1 = slots[0]; let p2_m1 = slots[1];
        let p1_m2 = slots[3]; let p2_m2 = slots[4];
        let isGhostM1 = (p1_m1 && p1_m1.IsDami) || (p2_m1 && p2_m1.IsDami) || false;
        let isGhostM2 = (p1_m2 && p1_m2.IsDami) || (p2_m2 && p2_m2.IsDami) || false;

        let m1 = { type: "Penyisihan", tingkat, kelasLengkap: kelasStr, pool: poolName, p1: p1_m1, p2: p2_m1, isGhost: isGhostM1, refP1: p1_m1, refP2: p2_m1, levelSifat, kategoriJenis };
        let m2 = { type: "Penyisihan", tingkat, kelasLengkap: kelasStr, pool: poolName, p1: p1_m2, p2: p2_m2, isGhost: isGhostM2, refP1: p1_m2, refP2: p2_m2, levelSifat, kategoriJenis };
        matches.push(m1, m2);

        let refWin1 = { Nama: "PEMENANG PARTAI", refMatch: m1, Kontingen: "-" };
        let refWin2 = { Nama: "PEMENANG PARTAI", refMatch: m2, Kontingen: "-" };
        let p2_sf1 = slots[2]; let p2_sf2 = slots[5];

        let sf1 = { type: "Semi Final", tingkat, kelasLengkap: kelasStr, pool: poolName, p1: refWin1, p2: p2_sf1, isGhost: false, refP1: refWin1, refP2: p2_sf1, levelSifat, kategoriJenis };
        let sf2 = { type: "Semi Final", tingkat, kelasLengkap: kelasStr, pool: poolName, p1: refWin2, p2: p2_sf2, isGhost: false, refP1: refWin2, refP2: p2_sf2, levelSifat, kategoriJenis };
        matches.push(sf1, sf2);

        let refWinSF1 = { Nama: "PEMENANG PARTAI", refMatch: sf1, Kontingen: "-" };
        let refWinSF2 = { Nama: "PEMENANG PARTAI", refMatch: sf2, Kontingen: "-" };
        let f = { type: "Final", tingkat, kelasLengkap: kelasStr, pool: poolName, p1: refWinSF1, p2: refWinSF2, isGhost: false, refP1: refWinSF1, refP2: refWinSF2, levelSifat, kategoriJenis };
        matches.push(f);

        return matches;
    } else {
        let S = baganSize;
        let slots = new Array(S).fill(null);
        for (let i = 0; i < S; i += 2) {
            slots[i] = aslis.shift();
            if (damis.length > 0) slots[i + 1] = damis.shift();
            else if (aslis.length > 0) slots[i + 1] = aslis.shift();
            else slots[i + 1] = { Nama: "DAMI99", Kontingen: "-", IsDami: true };
        }

        let curRound = slots;
        let sCount = S;
        let totalRounds = Math.log2(S);

        let getRoundName = (rIdx, tRounds) => {
            let jarakKeFinal = (tRounds - 1) - rIdx;
            if (jarakKeFinal === 0) return "Final";
            if (jarakKeFinal === 1) return "Semi Final";
            if (jarakKeFinal === 2) return "Perempat Final";
            return "Penyisihan";
        };

        let rIdx = 0;
        while (sCount >= 2) {
            let nextRound = [];
            let rName = getRoundName(rIdx, totalRounds);

            for (let i = 0; i < sCount; i += 2) {
                let p1 = curRound[i]; let p2 = curRound[i + 1];
                let isGhost = (p1 && p1.IsDami) || (p2 && p2.IsDami) || false;
                let matchObj = { type: rName, tingkat, kelasLengkap: kelasStr, pool: poolName, p1, p2, isGhost, refP1: p1, refP2: p2, levelSifat, kategoriJenis };
                matches.push(matchObj);
                nextRound.push({ Nama: "PEMENANG PARTAI", refMatch: matchObj, Kontingen: "-" });
            }
            curRound = nextRound;
            sCount /= 2;
            rIdx++;
        }
        return matches;
    }
}

const prosesKategoriJurusPool = (arrayData, kapMaks, sifatLabel) => {
    let grouped = {}; let results = [];
    arrayData.forEach(a => {
        let kelasStr = a.Kelas ? a.Kelas.toString().toUpperCase().trim() : 'JURUS';
        let key = `${a.Kategori} ${kelasStr} ${a.Gender}`;
        if (!grouped[key]) grouped[key] = { name: key, tingkat: a.Kategori, gender: a.Gender, kelasRaw: kelasStr, weight: a.weight, members: [] };
        grouped[key].members.push(a);
    });

    Object.values(grouped).forEach(cat => {
        let N = cat.members.length; if (N === 0) return;

        let numPools = Math.ceil(N / kapMaks);
        let totalSlots = numPools * kapMaks;
        let numDamis = totalSlots - N;

        let sortedAthletes = cat.members.slice().sort((a, b) => a.Kontingen.localeCompare(b.Kontingen));
        shuffleArray(sortedAthletes);

        let damis = Array.from({ length: numDamis }, () => ({ Nama: "DAMI99", Kontingen: "-", IsDami: true }));
        let pools = Array.from({ length: numPools }, () => []);

        let allEntities = [...sortedAthletes, ...damis];
        allEntities.forEach((ent, i) => { let pIdx = i % numPools; pools[pIdx].push(ent); });

        let allMatches = []; let abjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        pools.forEach((poolMembers, i) => {
            let pName = numPools > 1 ? `Pool ${abjad[i]}` : "-";
            let kLable = `${cat.kelasRaw} ${cat.gender}`;

            poolMembers.forEach((member) => {
                allMatches.push({
                    type: "Penampilan",
                    tingkat: cat.tingkat,
                    kelasLengkap: kLable,
                    pool: pName,
                    p1: member,
                    p2: { Nama: "-", Kontingen: "-", IsDami: false },
                    isGhost: member.IsDami || false,
                    refP1: member,
                    refP2: null,
                    levelSifat: sifatLabel,
                    kategoriJenis: "Jurus"
                });
            });
        });
        results.push({ name: cat.name, weight: cat.weight, matches: allMatches });
    });
    return results;
};

window.prosesDataMentahVIP = function (actionType) {
    let numGel = parseInt(document.getElementById('setJmlGelanggang').value) || 1;
    let sortDir = document.getElementById('setUrutanUsia').value || 'naik';
    let kapPrestasi = parseInt(document.getElementById('setPoolPrestasi').value) || 6;
    let kapPemasalan = parseInt(document.getElementById('setPoolPemasalan').value) || 4;

    let setMetodeJurusPrestasi = document.getElementById('setMetodeJurusPrestasi') ? document.getElementById('setMetodeJurusPrestasi').value : 'pool';
    let setMetodeJurusPemasalan = document.getElementById('setMetodeJurusPemasalan') ? document.getElementById('setMetodeJurusPemasalan').value : 'bagan';

    let kapJurusPrestasi = document.getElementById('setKapasitasJurusPrestasi') ? parseInt(document.getElementById('setKapasitasJurusPrestasi').value) : 8;
    let kapJurusPemasalan = document.getElementById('setKapasitasJurusPemasalan') ? parseInt(document.getElementById('setKapasitasJurusPemasalan').value) : 4;

    window.tempJadwalTanding = []; window.tempJadwalJurus = [];
    let prestasi = [], pemasalan = [], tgrPrestasi = [], tgrPemasalan = [];

    window.jsonMentahGlobal.forEach(row => {
        let nRow = {}; for (let key in row) { nRow[key.toUpperCase().trim()] = row[key]; }

        let namaAsli = String(nRow['NAMA ATLET'] || nRow['NAMA'] || "").trim();
        let kontingen = String(nRow['KONTINGEN'] || "-").trim();
        if (!namaAsli || (namaAsli.toUpperCase().includes("BYE") && kontingen === "-")) return;

        let kategoriRaw = String(nRow['KATEGORI'] || "").trim();
        let levelRaw = String(nRow['LEVEL'] || "").trim();
        let kelasRaw = String(nRow['KELAS'] || "").trim();
        let tingkatRaw = String(nRow['TINGKAT PENDIDIKAN / KLASIFIKASI'] || nRow['TINGKAT'] || "").trim();
        let jkRaw = String(nRow['JENIS KELAMIN'] || "").toLowerCase();

        let jenisPertandingan = "Pertandingan";
        let gabunganCek = kategoriRaw.toLowerCase() + " " + kelasRaw.toLowerCase();
        if (gabunganCek.includes('jurus') || gabunganCek.includes('tgr') || gabunganCek.includes('tunggal') || gabunganCek.includes('ganda') || gabunganCek.includes('regu')) {
            jenisPertandingan = "Jurus";
        }

        let sifatPertandingan = "Prestasi";
        let gabunganSifat = levelRaw.toLowerCase() + " " + kategoriRaw.toLowerCase();
        if (gabunganSifat.includes('pemasalan') || (jenisPertandingan === "Pertandingan" && kelasRaw === '')) {
            sifatPertandingan = "Pemasalan";
        }

        let namaOlahan = namaAsli;
        if (jenisPertandingan === "Jurus" && namaAsli.includes(',')) {
            let pecahNama = namaAsli.split(',');
            namaOlahan = pecahNama.map(nama => nama.trim()).join('\n');
        }

        let isPutri = (jkRaw.includes('p') && !jkRaw.includes('putra')) || jkRaw.includes('wanita') || jkRaw === 'pi';
        let gender = isPutri ? "Putri" : "Putra";
        let finalKat = tingkatRaw !== '' ? `[${tingkatRaw}]` : "[Kategori Kosong]";

        let atlet = { Nama: namaOlahan, Kontingen: kontingen, Gender: gender, Kategori: finalKat, Kelas: kelasRaw, weight: getWeight(finalKat), sifat: sifatPertandingan, jenis: jenisPertandingan };

        if (jenisPertandingan === "Jurus") {
            if (sifatPertandingan === "Pemasalan") tgrPemasalan.push(atlet);
            else tgrPrestasi.push(atlet);
        } else {
            if (sifatPertandingan === "Pemasalan") pemasalan.push(atlet);
            else prestasi.push(atlet);
        }
    });

    const prosesKategoriTanding = (arrayData, kapMaks, sifatLabel, kategoriJenis = "Pertandingan") => {
        let grouped = {}; let results = [];
        arrayData.forEach(a => {
            let kelasStr = a.Kelas ? a.Kelas.toString().toUpperCase().replace(/PUTRA|PUTRI|KELAS/g, '').trim() : '';
            let key = `${a.Kategori} Kelas ${kelasStr} ${a.Gender}`;
            if (!grouped[key]) grouped[key] = { name: key, tingkat: a.Kategori, gender: a.Gender, kelasRaw: kelasStr, weight: a.weight, members: [] };
            grouped[key].members.push(a);
        });

        Object.values(grouped).forEach(cat => {
            let N = cat.members.length; if (N === 0) return;

            let numPools = Math.ceil(N / kapMaks);
            let totalSlots = numPools * kapMaks;
            let numDamis = totalSlots - N;

            let sortedAthletes = cat.members.slice().sort((a, b) => a.Kontingen.localeCompare(b.Kontingen));
            let damis = Array.from({ length: numDamis }, () => ({ Nama: "DAMI99", Kontingen: "-", IsDami: true }));
            let pools = Array.from({ length: numPools }, () => []);

            let allEntities = [...sortedAthletes, ...damis];
            allEntities.forEach((ent, i) => { let pIdx = i % numPools; pools[pIdx].push(ent); });

            let allMatches = []; let abjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            pools.forEach((poolMembers, i) => {
                let pName = numPools > 1 ? `Pool ${abjad[i]}` : "-";
                let kLable = (sifatLabel === "Pemasalan" && kategoriJenis === "Pertandingan") ? `Kelas  ${cat.kelasRaw} ${cat.gender}` : `Kelas ${cat.kelasRaw} ${cat.gender}`;

                allMatches.push(...buatBaganTopDown(poolMembers, cat.tingkat, kLable, pName, kapMaks, sifatLabel, kategoriJenis));
            });
            results.push({ name: cat.name, weight: cat.weight, matches: allMatches });
        });
        return results;
    };

    let groupsPrestasi = prosesKategoriTanding(prestasi, kapPrestasi, "Prestasi", "Pertandingan");
    let groupsPemasalan = prosesKategoriTanding(pemasalan, kapPemasalan, "Pemasalan", "Pertandingan");
    let groupsTGRPrestasi = [];
    if (setMetodeJurusPrestasi === 'bagan') {
        groupsTGRPrestasi = prosesKategoriTanding(tgrPrestasi, kapJurusPrestasi, "Prestasi", "Jurus");
    } else {
        groupsTGRPrestasi = prosesKategoriJurusPool(tgrPrestasi, kapJurusPrestasi, "Prestasi");
    }

    let groupsTGRPemasalan = [];
    if (setMetodeJurusPemasalan === 'bagan') {
        groupsTGRPemasalan = prosesKategoriTanding(tgrPemasalan, kapJurusPemasalan, "Pemasalan", "Jurus");
    } else {
        groupsTGRPemasalan = prosesKategoriJurusPool(tgrPemasalan, kapJurusPemasalan, "Pemasalan");
    }

    let sortFn = (a, b) => sortDir === 'naik' ? a.weight - b.weight || a.name.localeCompare(b.name) : b.weight - a.weight || a.name.localeCompare(b.name);
    // Sortir per kelompok sebelum digabung
    groupsPrestasi.sort(sortFn);
    groupsPemasalan.sort(sortFn);
    groupsTGRPrestasi.sort(sortFn);
    groupsTGRPemasalan.sort(sortFn);

    let flatSemua = [];
    // --- BLOK TANDING (Blok 1 sampai 5) 
    groupsPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "PENYISIHAN") { m._blok = 1; flatSemua.push(m); }
    }));
    groupsPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "PEREMPAT FINAL") { m._blok = 2; flatSemua.push(m); }
    }));
    groupsPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "SEMI FINAL") { m._blok = 3; flatSemua.push(m); }
    }));
    groupsPemasalan.forEach(g => g.matches.forEach(m => { m._blok = 4; flatSemua.push(m); }));
    groupsPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "FINAL") { m._blok = 5; flatSemua.push(m); }
    }));

    // --- BLOK JURUS (Blok 6 sampai 10)
    groupsTGRPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "PENYISIHAN" || t === "PENAMPILAN") { m._blok = 6; flatSemua.push(m); }
    }));
    groupsTGRPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "PEREMPAT FINAL") { m._blok = 7; flatSemua.push(m); }
    }));
    groupsTGRPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "SEMI FINAL") { m._blok = 8; flatSemua.push(m); }
    }));
    groupsTGRPemasalan.forEach(g => g.matches.forEach(m => { m._blok = 9; flatSemua.push(m); }));
    groupsTGRPrestasi.forEach(g => g.matches.forEach(m => {
        let t = String(m.type).toUpperCase().trim();
        if (t === "FINAL") { m._blok = 10; flatSemua.push(m); }
    }));

    let kumpulanPool = {};
    flatSemua.forEach(m => {
        let keyPool = `${m.kelasLengkap} - ${m.pool}`;
        if (!kumpulanPool[keyPool]) kumpulanPool[keyPool] = [];
        kumpulanPool[keyPool].push(m);
    });

    let bebanGelanggang = new Array(numGel).fill(0);

    Object.values(kumpulanPool).forEach(isiPool => {
        let minGelIdx = bebanGelanggang.indexOf(Math.min(...bebanGelanggang));
        let namaGelanggangTerpilih = `G${minGelIdx + 1}`;

        isiPool.forEach(m => { m.gelanggangMutlak = namaGelanggangTerpilih; });
        bebanGelanggang[minGelIdx] += isiPool.length;
    });

    flatSemua.sort((a, b) => {
        if (a._blok !== b._blok) return a._blok - b._blok;
        let gelA = parseInt(a.gelanggangMutlak.replace('G', ''));
        let gelB = parseInt(b.gelanggangMutlak.replace('G', ''));
        if (gelA !== gelB) return gelA - gelB; 

        let wA = getWeight(a.tingkat); let wB = getWeight(b.tingkat);
        if (wA !== wB) return sortDir === 'naik' ? wA - wB : wB - wA; 

        return a.kelasLengkap.localeCompare(b.kelasLengkap); 
    });

    let globalPartyCounter = 1;
    flatSemua.forEach(m => {
        m.gelanggang = m.gelanggangMutlak;
        m.partyNo = globalPartyCounter++;

        let p1Safe = m.refP1 || {}; let p2Safe = m.refP2 || {};
        let namaBiru = p1Safe.refMatch ? `PEMENANG PARTAI ${p1Safe.refMatch.partyNo}` : (p1Safe.Nama || "-");
        let namaMerah = p2Safe.refMatch ? `PEMENANG PARTAI ${p2Safe.refMatch.partyNo}` : (p2Safe.Nama || "-");

        let obj = {
            mapped_partai: m.partyNo, mapped_gelanggang: m.gelanggang, mapped_pool: m.pool,
            mapped_kategori: m.kategoriJenis, mapped_level: m.levelSifat, mapped_tingkat: m.tingkat, mapped_kelas: m.kelasLengkap, mapped_babak: m.type,
            mapped_biru: namaBiru, mapped_kont_biru: p1Safe.Kontingen || "-", mapped_merah: namaMerah, mapped_kont_merah: p2Safe.Kontingen || "-",
            _refOriginal: m
        };

        if (m.kategoriJenis === "Jurus") {
            window.tempJadwalJurus.push(obj);
        } else {
            window.tempJadwalTanding.push(obj);
        }
    });

    if (actionType === 'tampilkan') {
        let opsiDami = document.querySelector('input[name="opsiDamiLayar"]:checked');
        if (opsiDami && opsiDami.value === 'sembunyi') {
            window.eksekusiBuatJadwalMatang();
        }
        window.eksekusiKirimKeLayar();
    }
    else if (actionType === 'matang_tanpa_dami') {
        window.eksekusiBuatJadwalMatang();
        window.downloadHasilOlahanExcel();
    }
    else {
        window.downloadHasilOlahanExcel();
    }
};

window.eksekusiBuatJadwalMatang = function (isSilent = false) {
    let filterJadwal = (jadwalMentah) => {
        if (!jadwalMentah || jadwalMentah.length === 0) return [];
        let jadwalMatang = [];
        let validMatches = jadwalMentah.filter(row => !row._refOriginal.isGhost);

        function lacakPemenangDinamic(p) {
            if (!p) return { Nama: "-", Kontingen: "-" };
            if (p.refMatch) {
                if (p.refMatch.isGhost) {
                    let atletAsli = (p.refMatch.refP1 && p.refMatch.refP1.IsDami) ? p.refMatch.refP2 : p.refMatch.refP1;
                    return lacakPemenangDinamic(atletAsli);
                } else {
                    let targetRow = validMatches.find(r => r._refOriginal === p.refMatch);
                    if (targetRow) return { Nama: `PEMENANG PARTAI ${targetRow.mapped_partai}`, Kontingen: "-" };
                }
            }
            return p;
        }

        validMatches.forEach(row => {
            let m = row._refOriginal;
            let resolvedP1 = lacakPemenangDinamic(m.refP1); let resolvedP2 = lacakPemenangDinamic(m.refP2);
            row.mapped_biru = resolvedP1.Nama; row.mapped_kont_biru = resolvedP1.Kontingen;
            row.mapped_merah = resolvedP2.Nama; row.mapped_kont_merah = resolvedP2.Kontingen;
        });

        validMatches.forEach(row => { delete row._refOriginal; jadwalMatang.push(row); });
        return jadwalMatang;
    };

    window.tempJadwalTanding = filterJadwal(window.tempJadwalTanding);
    window.tempJadwalJurus = filterJadwal(window.tempJadwalJurus);
};