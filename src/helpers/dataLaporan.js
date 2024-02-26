const models = require('../models');

const dummyData = async user_id => {
  const createdAt = new Date();
  const updatedAt = new Date();

  const nilaiTarget = [
    {
      user_id,
      name: 'Harga',
      kode: 'K1',
      value: 4,
      category: 'core_factor',
    },
    {
      user_id,
      name: 'Kualitas',
      kode: 'K2',
      value: 5,
      category: 'core_factor',
    },
    {
      user_id,
      name: 'Kuantitas',
      kode: 'K3',
      value: 4,
      category: 'secondary_factor',
    },
    {
      user_id,
      name: 'Pelayanan',
      kode: 'K4',
      value: 5,
      category: 'secondary_factor',
    },
    {
      user_id,
      name: 'Waktu Pengiriman',
      kode: 'K5',
      value: 3,
      category: 'core_factor',
    },
    {
      user_id,
      name: 'Biaya Pengiriman',
      kode: 'K6',
      value: 4,
      category: 'secondary_factor',
    },
  ];

  const dataAlternatif = [
    {
      user_id,
      kode_alternatif: 'A1',
      name: 'Toko Sepatu Belbe',
      address: 'Jl. Dewi sartika Ruko No.24 pabaton Bogor tengah',
      contact: '081211121974',
      nilai_prefensi: 0.5,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A2',
      name: 'Radar (RCBI)',
      address: 'Jl.Dewi sartika No 23 Bogor',
      contact: '085693972941',
      nilai_prefensi: 0.49,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A3',
      name: 'Metro Sepatu Anak',
      address: 'Jl.Dewi sartika No 52 Bogor',
      contact: '081187903893',
      nilai_prefensi: 0.522,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A4',
      name: 'Toko Acc Bogor',
      address: 'Jl.Dewi sartika Ruko Central Blok C4 No4',
      contact: '082304300888',
      nilai_prefensi: 0.481,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A5',
      name: 'Toko Paris Grosir Sepatu & Sandal',
      address: 'Jl. Dewi sartika No 49 Bogor',
      contact: '(021)56973669',
      nilai_prefensi: 0.509,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A6',
      name: 'Toko Sepatu Paramount',
      address: 'Jl. Merdeka no.53 Bogor',
      contact: '085227001500',
      nilai_prefensi: 0.5,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A7',
      name: 'Toko Sepatu Canada',
      address: 'Jl.Merdeka No. 7A Bogor',
      contact: '(021)56973669',
      nilai_prefensi: 0.528,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A8',
      name: 'Putra Collection',
      address: 'Perumahan alam tirta lestari, jln gn semeru blok c5 no 28',
      contact: '087776000043',
      nilai_prefensi: 0.509,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A9',
      name: 'Zaffar Shoes',
      address: 'Jl. Gn. Semeru, Pagelaran, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610',
      contact: '087786160758',
      nilai_prefensi: 0.473,
      createdAt,
      updatedAt,
    },
    {
      user_id,
      kode_alternatif: 'A10',
      name: 'Petra Shoes',
      address: 'Pasar Kebon Kembang Blok B1 lantai 1 no:81, Kota Bogor, Jawa Barat 16124',
      contact: '087754660744',
      nilai_prefensi: 0.523,
      createdAt,
      updatedAt,
    },
  ];

  const skorDataAlternatif = [
    [4,5,4,5,3,5],
    [3,4,3,4,4,3],
    [5,3,5,3,5,5],
    [4,4,3,4,3,4],
    [3,5,4,5,4,3],
    [4,3,3,3,5,5],
    [3,4,4,4,4,4],
    [5,5,3,5,3,3],
    [4,4,4,4,4,4],
    [3,3,5,3,5,3],
  ];

  // bulk create nilai_target
  const target = await models.nilai_target.bulkCreate(nilaiTarget);

  // bulk create alternatif
  const alternatif = await models.alternatif.bulkCreate(dataAlternatif);

  for (const i in alternatif) {
    if (Object.hasOwnProperty.call(alternatif, i)) {
      const elAlternatif = alternatif[i];
      for (const j in target) {
        if (Object.hasOwnProperty.call(target, j)) {
          const skor = target[j];
          await models.skor.create({
            user_id,
            alternatif_id: elAlternatif.id,
            nilai_target_id: skor.id,
            value: skorDataAlternatif[i][j],
          });
        }
      }
    }
  }
  return { status: 'success' };
};

module.exports = dummyData;
