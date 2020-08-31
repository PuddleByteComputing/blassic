const eolCode = 10; // newline in UTF8

export function firstLine(buffer) {
  const lineEnd = buffer.indexOf(eolCode);

  return buffer.slice(0, lineEnd);
}

// export { firstLine };

export function lineCount(buffer) {
  let lines = 0;
  let idx = -1;
  while ((idx = buffer.indexOf(eolCode, idx + 1)) > -1) { lines++; }
  return lines;
}

// export lineCount;
