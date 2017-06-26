export default function(params) {
    let [condition, a, b] = params;
    return condition ? a : b;
};
