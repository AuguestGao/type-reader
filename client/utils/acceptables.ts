const acceptables: Array<string> = [];

for (let i = 32; i <= 126; i++) {
  acceptables.push(String.fromCharCode(i));
}

export { acceptables };
