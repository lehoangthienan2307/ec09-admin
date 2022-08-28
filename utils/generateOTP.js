export default function (digit) {
    return Math.floor(Math.random() * Math.pow(10, digit) - Math.pow(10, digit - 1) - 1) + Math.pow(10, digit - 1);
}