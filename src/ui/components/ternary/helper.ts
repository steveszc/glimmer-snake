export default function(params) {
    let [condition, isTruthy, isFalsey] = params;
    return condition ? isTruthy : isFalsey;
};
