const renderableEntries: Array<string> = [];

for (let i = 32; i <= 126; i++) {
  renderableEntries.push(String.fromCharCode(i));
}

export { renderableEntries };
