
"use strict";
H.Namespace.set(H, 'Fraction');
H.Fraction = function(num) {
    const precision = H.Utils.precision;
    const gcd = H.Utils.gcd;
    const abs = Math.abs;
    const pow = Math.pow;
    if (num === 0) return '0';
    let _precision = precision(num);
    _precision = pow(10, _precision);
    let numerator = num * _precision,
        denominator = _precision;
    const _gcd = abs(gcd(numerator, denominator));
    numerator /= _gcd;
    denominator /= _gcd;
    return numerator + '/' + denominator;
};


"use strict";
H.Namespace.set(H, 'Format_Number');
H.Format_Number = function() {
    var currency = function(num) {
        let format = '$ ' + Sugar.Number(num).abbr(2);
        return format;
    };
    var currency_long = function(num) {
        let format = '$ ' + Sugar.Number(num).format(2)
        return format;
    };
    var percentage = function(num) {
        let format = Sugar.Number(num).floor(2) + ' %';
        return format;
    }
    var percentage_short = function(num) {
        let format = Sugar.Number(num).floor() + ' %';
        return format;
    };
    var short_one = function(num) {
        let format = Sugar.Number(num).round(1).raw
        return format;
    };
    var short_two = function(num) {
        let format = Sugar.Number(num).round(2).raw
        return format;
    };
    var short_three = function(num) {
        let format = Sugar.Number(num).round(3).raw
        return format;
    };
    var decimal = function(num) {
        let format = Sugar.Number(num).floor(2).raw
        return format;
    };
    var no_decimal = function(num) {
        let format = Sugar.Number(num).round().raw
        return format;
    };
    var ordinal = function(num) {
        let format = Sugar.Number(num).ordinalize().raw
        return format;
    };
    var decimal_to_fraction = function(num) {
        let format = H.Fraction(num);
        return format;
    };
    var currency_label_column = function( collection, source_column, target_label ) {
        let result = [];
        let i = 0;
        const len = collection.length;
        for (i; i < len; i++) {
            let label = target_label.toUpperCase();
            console.log(collection[i][source_column])
            let currency_label = currency( Number(collection[i][source_column]) );
            let insert = { [label]: currency_label };
            let merged = H.Obj.merge(insert, collection[i]);
            result.push(merged);
        }
        return result;
    };
    var currency_long_column = function(collection, column) {
        let result = [];
        collection.forEach(function(d) {
            d[column] = currency_long(+d[column]);
        })
        return collection;
    };
    var decimal_column = function(collection, column) {
        let result = [];
        collection.forEach(function(d) {
            d[column] = decimal(+d[column]);
        })
        return collection;
    };
    var no_decimal_column = function(collection, column) {
        let result = [];
        collection.forEach(function(d) {
            d[column] = no_decimal(d[column]);
        })
        return collection;
    };
    return {
        currency: currency,
        currency_long: currency_long,
        short_one: short_one,
        short_two: short_two,
        short_three: short_three,
        decimal: decimal,
        no_decimal: no_decimal,
        percentage: percentage,
        percentage_short: percentage_short,
        ordinal: ordinal,
        decimal_to_fraction : decimal_to_fraction,
        currency_label_column: currency_label_column,
        currency_long_column: currency_long_column,
        decimal_column: decimal_column,
        no_decimal_column: no_decimal_column
    };
}();