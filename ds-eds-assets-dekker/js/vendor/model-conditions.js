// Evaluates the field conditions of the block models (blocks/<block>/_<block>.json), so a block
// can leave out the fields the editor hides before it calls the design system. The editor keeps
// the stored value of a field it hides, for instance when the type is switched, and the cell
// stays in the authored content; a hidden field is not part of what the author chose.
//
// Only the operators the family models use are read. Any other operator is an error here, and
// unsupportedOperators lets a site's build check its models against the same list, so a model
// cannot start using one that this file would read wrongly.
export const OPERATORS = ['var', '==', 'in', '!', '!!', 'and'];

// The operators in a condition that this file does not read.
export function unsupportedOperators(condition) {
  if (Array.isArray(condition)) return condition.flatMap(unsupportedOperators);
  if (!condition || typeof condition !== 'object') return [];
  return Object.entries(condition).flatMap(([op, args]) => (
    OPERATORS.includes(op) ? unsupportedOperators(args) : [op]));
}

function evaluate(node, values) {
  if (Array.isArray(node)) return node.map((item) => evaluate(item, values));
  if (!node || typeof node !== 'object') return node;
  const ops = Object.keys(node);
  if (ops.length !== 1 || !OPERATORS.includes(ops[0])) {
    throw new Error(`model condition operator ${ops.join(',')} is not supported`);
  }
  const [op] = ops;
  const args = node[op];
  const list = Array.isArray(args) ? args : [args];
  switch (op) {
    case 'var': return values[args];
    case '==': return evaluate(list[0], values) === evaluate(list[1], values);
    case 'in': return evaluate(list[1], values).includes(evaluate(list[0], values));
    case '!': return !evaluate(list[0], values);
    case '!!': return !!evaluate(list[0], values);
    default: return list.every((item) => evaluate(item, values));
  }
}

// Whether the model shows a field with this condition, given the stored values of the fields (a
// field name -> value map). No condition means shown.
export const isShown = (condition, values) => !condition || !!evaluate(condition, values);

// `values` without the fields the model hides. Every condition reads the stored values, so a
// field hidden by another hidden field's value is judged on that stored value, as the editor does.
export function dropHidden(values, conditions = {}) {
  return Object.fromEntries(Object.entries(values)
    .filter(([field]) => isShown(conditions[field], values)));
}
