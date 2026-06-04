const CLASS_ORDER = ['Pre-KG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// Compress an array of class strings into a display string
// e.g. ['I','II','III','IV','V'] → 'I–V'
// e.g. ['Pre-KG','LKG','UKG','I','II','III'] → 'Pre-KG, LKG, UKG, I–III'
export const compressClassRange = (classRange) => {
  if (!classRange || classRange.length === 0) return 'All Classes';
  if (classRange.length === CLASS_ORDER.length) return 'All Classes';

  // Separate KG and roman numeral classes
  const kgClasses = classRange.filter((c) => ['Pre-KG', 'LKG', 'UKG'].includes(c));
  const romanClasses = classRange.filter((c) => ROMAN.includes(c));

  const parts = [];

  // KG classes: list individually
  if (kgClasses.length > 0) {
    // Compress consecutive KG: Pre-KG, LKG, UKG → KG (all three)
    if (kgClasses.length === 3) {
      parts.push('KG');
    } else {
      parts.push(...kgClasses);
    }
  }

  // Roman classes: compress consecutive runs into ranges
  if (romanClasses.length > 0) {
    const indices = romanClasses
      .map((c) => ROMAN.indexOf(c))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b);

    let start = indices[0];
    let prev = indices[0];

    for (let i = 1; i <= indices.length; i++) {
      const curr = indices[i];
      if (curr === prev + 1) {
        prev = curr;
      } else {
        if (prev === start) {
          parts.push(`Class ${ROMAN[start]}`);
        } else if (prev === start + 1) {
          parts.push(`Class ${ROMAN[start]}, Class ${ROMAN[prev]}`);
        } else {
          parts.push(`Class ${ROMAN[start]}–${ROMAN[prev]}`);
        }
        start = curr;
        prev = curr;
      }
    }
  }

  return parts.join(', ');
};

// For a classes string (legacy), just return as-is
export const formatClasses = (classes) => {
  if (!classes) return '';
  return classes;
};
