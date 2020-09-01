const eolCode = 10; // newline in UTF8

export function firstLine(buffer) {
  const lineEnd = buffer.indexOf(eolCode);

  return buffer.slice(0, lineEnd);
}

// Last non-empty line in buffer
function lastLineIndices(buffer) {
  let endIndex = buffer.length;
  if (endIndex === 0) { return [0, 0]; }
  if (buffer[endIndex - 1] === eolCode) {
    while(endIndex > 0 && buffer[--endIndex] === eolCode);
  }

  let startIndex = endIndex;
  while(startIndex > 0 && buffer[--startIndex] !== eolCode);

  return [buffer[startIndex] === eolCode ? startIndex + 1 : startIndex,
          endIndex === buffer.length - 1 ? endIndex : endIndex + 1];
}

export function lastLine(buffer) {
  return buffer.slice(...lastLineIndices(buffer));
}

// export { firstLine };

export function lineCount(buffer) {
  let lines = 0;
  let idx = -1;
  while ((idx = buffer.indexOf(eolCode, idx + 1)) > -1) { lines++; }
  return lines;
}
