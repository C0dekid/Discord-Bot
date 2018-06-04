module.exports = {
    decimal2hex: (decimal) => {
        return decimal.toString(16);
    },
    hex2decimal: (hex) => {
        return parseInt(hex.replace("#", ""), 16);
    }
}