const a = [
    { name: "tit", age: 10 },
    { name: "bet", age: 11 },
    { name: "bet", age: 10 },
    { name: "tit", age: 12 },
    { name: "tititl", age: 13 },
    { name: "tiktak", age: 12 },
    { name: "tit", age: 19 },
    { name: "tit", age: 10 },
];

const b = ["tit", "bet"];
const c = [10];

console.log(
    a
        .filter((aEl) => b.some((bEl) => aEl.name.toLowerCase() === bEl.toLowerCase()))
        .filter((aEl) => c.some((cEl) => aEl.age === cEl))
);
