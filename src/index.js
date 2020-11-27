const fs = require('fs');
const hadamard = require('./hadamard.js');

const binary = (signal) => signal.map(bit => (1 - bit) / 2); // перехід від біполярного до бінарного виду
const decimal = (binaryView) => { //кожні 8 біт зчитуємо як десяткове число
    const bitCount = 8;
    let str = '';
    const result = [];
    binaryView.forEach((key, index) => {
        str += key;
        if ((index + 1) % bitCount === 0) {
            result.push(parseInt(str, 2));
            str = '';
        }
    });
    return result;
};

const result = (decimal) => decimal.map(String.fromCharCode).join('').replace(/\W/g, ''); // переводимо в текст та убираємо лишній текст(неписемні символи)

const restoreWalsh = (input, variant) => {
    const walshCode = hadamard[variant - 1]; //обираємо варінт
    let result = Array(input.length / walshCode.length).fill(0); // створюємо масив з новою довжиною та заповнюємо нулями
    for (let i = 0; i < result.length; ++i) {
        walshCode.forEach((code, j) => {
            result[i] += code * input[i * walshCode.length + j] // перемножуємо матриці
        });
        result[i] /= walshCode.length; // нормалізуємо
    }
    return result;
};

const runCode = () => {
    // Зчитуємо файл та робимо з нього масив чисел
    const data = fs.readFileSync(process.argv[2]).toString()
        .replace(/ +/g, ' ') // чистимо пробіли
        .replace(' ', '') //перший символ - пробіл, чистимо його
        .split(' ')
        .map(Number);

    const a = restoreWalsh(data, process.argv[3]);
    const b = binary(a);
    const c = decimal(b);
    const d = result(c);
    console.log(
        'Біполярна репрезентація:\n',
        a,
        '\nБінарна репрезентація:\n',
        b,
        '\nДесяткова репрезентація:\n',
        c,
        '\nРезультат:\n',
        d
    )
};

runCode();
