const models = require('../models');

const criterias = async user_id => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const dataCriteria = [
    { user_id, name: 'Harga', bobot: 0.25, createdAt, updatedAt },
    { user_id, name: 'Kualitas', bobot: 0.25, createdAt, updatedAt },
    { user_id, name: 'Kuantitas', bobot: 0.15, createdAt, updatedAt },
    { user_id, name: 'Pelayanan', bobot: 0.15, createdAt, updatedAt },
    { user_id, name: 'Waktu Pengiriman', bobot: 0.1, createdAt, updatedAt },
    { user_id, name: 'Biaya Pengiriman', bobot: 0.1, createdAt, updatedAt },
  ];
  const dataLocation = [
    {
      user_id,
      name: 'Toko Sepatu Belbe',
      core: 0.007,
      secondary: 0.005,
      hasil: 0.0064,
      alamat: 'Jl. Dewi sartika Ruko No.24 pabaton Bogor tengah',
      contact: '081211121974',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Radar (RCBI)',
      core: 0.007,
      secondary: 0.004,
      hasil: 0.0061,
      alamat: 'Jl.Dewi sartika No 23 Bogor',
      contact: '085693972941',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Metro Sepatu Anak',
      core: 0.006,
      secondary: 0.004,
      hasil: 0.0054,
      alamat: 'Jl.Dewi sartika No 52 Bogor',
      contact: '081187903893',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Toko Acc Bogor',
      core: 0.006,
      secondary: 0.004,
      hasil: 0.0054,
      alamat: 'Jl.Dewi sartika Ruko Central Blok C4 No4',
      contact: '082304300888',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Toko Paris Grosir Sepatu & Sandal',
      core: 0.005,
      secondary: 0.004,
      hasil: 0.0047,
      alamat: 'Jl. Dewi sartika No 49 Bogor',
      contact: '(021)56973669',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Toko Sepatu Paramount',
      core: 0.005,
      secondary: 0.004,
      hasil: 0.0047,
      alamat: 'Jl. Merdeka no.53 Bogor',
      contact: '085227001500',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Toko Sepatu Canada',
      core: 0.005,
      secondary: 0.002,
      hasil: 0.0041,
      alamat: 'Jl.Merdeka No. 7A Bogor',
      contact: '087780149485',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Putra Collection',
      core: 0.005,
      secondary: 0.002,
      hasil: 0.0041,
      alamat: 'Perumahan alam tirta lestari, jln gn semeru blok c5 no 28',
      contact: '087776000043',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Zaffar Shoes',
      core: 0.006,
      secondary: 0.003,
      hasil: 0.0051,
      alamat: 'Jl. Gn. Semeru, Pagelaran, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610',
      contact: '087786160758',
      createdAt,
      updatedAt,
    },
    {
      user_id,
      name: 'Petra Shoes',
      core: 0.007,
      secondary: 0.003,
      hasil: 0.0055,
      alamat: 'Pasar Kebon Kembang Blok B1 lantai 1 no:81, Kota Bogor, Jawa Barat 16124',
      contact: '087754660744',
      createdAt,
      updatedAt,
    },
  ];
  const valueLink = [
    [5, 4, 2, 5, 5, 5],
    [5, 2, 5, 3, 3, 5],
    [2, 2, 5, 4, 4, 3],
    [4, 3, 2, 3, 3, 4],
    [5, 3, 1, 3, 3, 4],
    [3, 2, 3, 3, 4, 3],
    [2, 4, 1, 2, 2, 2],
    [1, 5, 1, 2, 2, 2],
    [4, 3, 2, 2, 2, 3],
    [5, 5, 1, 2, 2, 1],
  ];
  const criterias = await models.criteria.bulkCreate(dataCriteria);
  const locations = await models.supplier.bulkCreate(dataLocation);

  for (const i in locations) {
    if (Object.hasOwnProperty.call(locations, i)) {
      const location = locations[i];
      for (const j in criterias) {
        if (Object.hasOwnProperty.call(criterias, j)) {
          const criteria = criterias[j];
          await models.link.create({
            user_id,
            supplier_id: location.id,
            criteria_id: criteria.id,
            value: valueLink[i][j],
          });
        }
      }
    }
  }
  return { status: 'success' };
};

module.exports = criterias;
