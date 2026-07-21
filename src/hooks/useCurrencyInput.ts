import { type ChangeEvent, useState } from 'react';

function formatCentsToBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function useCurrencyInput(initialValueInCents = 0) {
  const [valueInCents, setValueInCents] = useState(initialValueInCents);

  const displayValue = formatCentsToBRL(valueInCents);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    const cents = digitsOnly === '' ? 0 : Number(digitsOnly);
    setValueInCents(cents);
  }

  function reset() {
    setValueInCents(0);
  }

  return {
    displayValue,
    valueInCents,
    valueInReais: valueInCents / 100,
    handleChange,
    reset,
  };
}
