// What the Teaser-based blocks share when they turn their fields into Teaser() props. Nothing here
// names a field: the block passes the values and the tables.

// The "Card action" switch decides which of the whole-card link and the action buttons applies,
// whatever else was authored. An empty value (content from before the field existed) leaves both
// as the fields gave them.
export function applyCardAction(props, cardAction) {
  if (cardAction === 'link') {
    return { ...props, actions: [], actionsEnabled: false };
  }
  if (cardAction === 'buttons') return { ...props, link: undefined };
  if (cardAction === 'none') {
    return {
      ...props, actions: [], actionsEnabled: false, link: undefined,
    };
  }
  return props;
}

// A modifier field belongs to one type. The editor keeps a hidden field's old value when the type
// is switched, so a modifier is dropped unless it belongs to the type in `type`.
export function modifiersForType(values, type, typeOfModifier) {
  const kept = { ...values };
  Object.entries(typeOfModifier).forEach(([name, modifierType]) => {
    if (modifierType !== type) delete kept[name];
  });
  return kept;
}
