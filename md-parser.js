const fs = require("fs/promises");

/*
 * parse the md file into list of pairs (section, content)
 * @param {string} path to markdown file
 *
 */
async function mdParser(filename) {
  const lines = (await fs.readFile(filename)).toString().split("\n");
  const data = [];
  let section = "";
  let content = "";

  if (lines.length && lines[0][0] === "#") {
    section = lines[0];
  }
  for (let i = 1; i < 10; i++) {
    const line = lines[i];
    if (line && line[0] === "#") {
      data.push({section_idx: filename + section, section, content });
      section = lines[i]
      content = "";
    }
    content += lines[i];
  }
  data.push({section_idx: filename + section, section, content });
  return data;
}

module.exports = mdParser;
