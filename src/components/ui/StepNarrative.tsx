import React from 'react';
import { cx } from '../../utils/cx';

export type StepNarrativeStep = {
  id: 1 | 2 | 3;
  label: string;
  description?: string;
};

export type StepNarrativeProps = {
  activeStep: 1 | 2 | 3;
  className?: string;
};

const STEPS: StepNarrativeStep[] = [
  {
    id: 1,
    label: 'Select contacts',
    description: 'Choose the right journalists for your story.',
  },
  {
    id: 2,
    label: 'Generate AI pitches',
    description: 'Turn your narrative into tailored outreach.',
  },
  {
    id: 3,
    label: 'Track replies',
    description: 'See responses and outcomes in one place.',
  },
];

export const StepNarrative: React.FC<StepNarrativeProps> = ({
  activeStep,
  className,
}) => {
  return (
    <section
      className={cx(
        'relative flex items-center gap-4 rounded-xl border border-border/70 bg-gradient-to-r from-background via-surface/98 to-primary/5 px-3.5 py-2.5 text-[10px] text-muted-foreground',
        'shadow-sm ring-1 ring-black/[0.02]',
        'transition-colors duration-200',
        className,
      )}
      aria-label="Workflow progress"
    >
      <div className="hidden items-center gap-1.5 pr-2 text-[9px] font-medium uppercase tracking-[0.16em] text-primary sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        <span className="text-[9px]">Pitch-to-Press Flow</span>
      </div>

      {STEPS.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = step.id < activeStep;
        const basePill =
          'flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-semibold transition-all duration-200';
        const connectorBase =
          'ml-2 h-px w-6 rounded-full bg-border/70 transition-colors duration-200';

        return (
          <div
            key={step.id}
            className={cx(
              'flex items-center gap-2',
              index < STEPS.length - 1 && 'relative',
            )}
          >
            <div
              className={cx(
                basePill,
                isActive &&
                  'border-primary bg-primary text-primary-foreground shadow-sm',
                isCompleted &&
                  'border-primary/40 bg-primary/5 text-primary',
                !isActive && !isCompleted &&
                  'border-border/70 bg-background/80 text-muted-foreground',
              )}
            >
              {step.id}
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={cx(
                  'font-medium',
                  isActive && 'text-foreground',
                  isCompleted && 'text-muted-foreground',
                  !isActive && !isCompleted && 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
              <span className="hidden text-[9px] text-muted-foreground/90 sm:inline">
                {step.description}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cx(
                  connectorBase,
                  isCompleted && 'bg-primary/60',
                  isActive && 'bg-primary/40',
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default StepNarrative;