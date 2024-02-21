const dataFormat = datas => {
  let result = [];
  datas.forEach(data => {
    let tempData;
    data.forEach(temp => {
      const nameNilaiTarget = temp.nilai_target.name;
      tempData = {
        ...tempData,
        id: temp.alternatif.kode_alternatif,
        name: temp.alternatif.name,
        [nameNilaiTarget]: temp.value,
      };
    });
    result.push(tempData);
  });
  return result;
};

module.exports = dataFormat;
