const basic: [string] = ["Blink"];
const spell: [string, number?] = basic;

const frozenSpell = ["Frost", 8] as const;
const editableSpell: [string, number] = frozenSpell;

const prepared: [string, number?] = ["Shield"];
const [name, power] = prepared;

function label(name: string = "guest") {
  return name
}