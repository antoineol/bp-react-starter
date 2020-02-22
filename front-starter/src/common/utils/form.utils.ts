import { FormEvent, KeyboardEvent, SyntheticEvent } from 'react';

export function onEnterFocusNextField(event: SyntheticEvent<any>) {
  if (!event) {
    throw new Error('Trying to focus next field, but event is falsy');
  }
  if ((event as KeyboardEvent<HTMLElement>).keyCode === 13) {
    focusNextField(event);
  }
}

export function focusNextField(event: FormEvent<HTMLElement>) {
  const t = event.target as HTMLInputElement;
  const form = t.form;
  if (!form) {
    throw new Error('Trying to focus next field, but the field does not belong to a form');
  }
  const index = Array.prototype.indexOf.call(form, event.target);
  let nextElt: Element;
  let i = 1;
  do {
    nextElt = form.elements[index + i];
    i += 1;
  } while (nextElt && ((nextElt as any).tabIndex === -1 || (nextElt as any).type === 'hidden'));
  if (nextElt) {
    (nextElt as any).focus();
  }
  event.preventDefault();
}
