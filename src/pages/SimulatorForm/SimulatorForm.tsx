import { CreditCard, DollarSign, Receipt, Sparkles, Target } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, FormIntro, FormQuestionInput, StepProgress } from '@/components';
import { useSimulationHistory } from '@/hooks/useSimulationHistory';

const steps = [
  {
    id: 'renda',
    label: 'Renda',
    icon: DollarSign,
    question: 'Quanto é depositado todo mês em sua conta (todas as rendas)?',
    type: 'number',
    helperText: 'Some salário, freelas e qualquer outra renda mensal',
    placeholder: 'R$ 0,00',
  },
  {
    id: 'custos-fixos',
    label: 'Custos fixos',
    icon: Receipt,
    question: 'Quanto você gasta mensalmente com custos fixos?',
    type: 'number',
    helperText: 'Aluguel, contas, assinaturas e outras despesas recorrentes',
    placeholder: 'R$ 0,00',
  },
  {
    id: 'parcelas',
    label: 'Parcelas',
    icon: CreditCard,
    question: 'Você tem algum valor comprometido com parcelas ou empréstimos mensalmente?',
    type: 'number',
    helperText: 'Se não tiver nenhum, pode deixar como 0',
    placeholder: 'R$ 0,00',
  },
  {
    id: 'objetivo',
    label: 'Objetivo',
    icon: Target,
    question: 'Qual objetivo você deseja alcançar?',
    type: 'text',
    helperText: undefined,
    placeholder: 'Ex: Viagem para o Havai',
  },
  {
    id: 'custo-objetivo',
    label: 'Seu sonho',
    icon: Sparkles,
    question: 'Quanto custaria realizar seu sonho?',
    type: 'number',
    helperText: 'Uma estimativa já ajuda bastante',
    placeholder: 'R$ 0,00',
  },
] as const;

type StepId = (typeof steps)[number]['id'];

type FormValues = Record<StepId, number | string>;

const initialValues: FormValues = {
  renda: 0,
  'custos-fixos': 0,
  parcelas: 0,
  objetivo: '',
  'custo-objetivo': 0,
};

function formatCentsToBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function SimulatorForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const { addSimulation } = useSimulationHistory();
  const navigate = useNavigate();
  const { id, question, icon: Icon, helperText, type, placeholder } = steps[currentStep];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function handleCurrencyChange(event: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    const cents = digitsOnly === '' ? 0 : Number(digitsOnly);
    setValues((prev) => ({ ...prev, [id]: cents }));
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({ ...prev, [id]: event.target.value }));
  }

  function centsToReais(values: FormValues): Record<StepId, number | string> {
    const result = {} as Record<StepId, number | string>;

    for (const step of steps) {
      const value = values[step.id];
      result[step.id] = step.type === 'number' ? (value as number) / 100 : value;
    }

    return result;
  }

  const isCurrency = type === 'number';
  const currentValue = values[id];

  const displayValue = isCurrency
    ? formatCentsToBRL(currentValue as number)
    : (currentValue as string);

  function handleNext() {
    if (isLastStep) {
      const valuesInReais = centsToReais(values);

      const newRecord = addSimulation({
        renda: valuesInReais.renda as number,
        custosFixos: valuesInReais['custos-fixos'] as number,
        parcelas: valuesInReais.parcelas as number,
        objetivo: valuesInReais.objetivo as string,
        custoObjetivo: valuesInReais['custo-objetivo'] as number,
      });

      navigate(`/resultado/${newRecord.id}`);
      return;
    }
    setCurrentStep((s) => s + 1);
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <FormIntro
        title="Vamos planejar seu futuro"
        description="Responda algumas questões para ter um insight financeiro personalizado"
      />
      <StepProgress steps={steps} currentStep={currentStep} />

      <div className="border-border bg-card rounded-lg border p-6 shadow-md dark:shadow-black/30">
        <FormQuestionInput
          question={question}
          icon={Icon}
          type="text"
          inputMode={isCurrency ? 'decimal' : 'text'}
          placeholder={placeholder}
          helperText={helperText}
          value={displayValue}
          onChange={isCurrency ? handleCurrencyChange : handleTextChange}
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={isFirstStep}
          onClick={() => setCurrentStep((s) => s - 1)}
        >
          Voltar
        </Button>

        <Button onClick={handleNext}>{isLastStep ? 'Gerar Simulação' : 'Continuar'}</Button>
      </div>
      <Button onClick={() => navigate('/historico')}>Ver histórico</Button>
    </div>
  );
}
