const bobotNilaiGap = require('./bobotNilaiGap');

// Helper function to calculate average
const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

// Helper function to calculate preference value
const calculatePreference = (NCF, NSF) => parseFloat((NSF / (NCF + NSF)).toFixed(3));

// Helper function to rank preference values
const rankPreferences = preferences => {
  const sortedPreferences = [...preferences].sort((a, b) => b - a);
  return preferences
    .map((preference, i) => ({
      kode_alternatif: `A${i + 1}`,
      rank: sortedPreferences.indexOf(preference) + 1,
      value: preference,
    }))
    .sort((a, b) => a.rank - b.rank);
};

// Main function
const calculateRankings = (nilaiTarget, skorDataAlternatif, bobotNilaiGap) => {
  const gapProfile = skorDataAlternatif.map(({ skor }) => skor.map(({ value }, i) => value - nilaiTarget[i].value));

  const gapKriteria = gapProfile.map(gap =>
    gap.map(value => bobotNilaiGap[1].bobot[bobotNilaiGap[0].selisihGap.indexOf(value)])
  );

  const { core_factor, secondary_factor } = nilaiTarget.reduce(
    (acc, { kode, category }) => {
      acc[category].push(Number(kode.slice(1)) - 1);
      return acc;
    },
    { core_factor: [], secondary_factor: [] }
  );

  const rearranged = gapKriteria.map(row => [...core_factor, ...secondary_factor].map(i => row[i]));

  const coreSecondaryGroup = rearranged.map(row => {
    const core = row.slice(0, core_factor.length);
    const secondary = row.slice(core_factor.length);
    return { NCF: average(core), NSF: average(secondary) };
  });

  const preferences = coreSecondaryGroup.map(({ NCF, NSF }) => calculatePreference(NCF, NSF));

  return rankPreferences(preferences);
};

// console.log(calculateRankings(nilaiTarget, skorDataAlternatif, bobotNilaiGap));
module.exports = calculateRankings;