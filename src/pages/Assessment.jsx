import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { ChevronRight, ChevronLeft, CheckCircle2, Leaf } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'commuteMode',
    step: 1,
    title: 'How do you get to work?',
    description: 'Your primary commute method on office days.',
    type: 'choice',
    options: [
      { value: 'Gas Car',          label: 'Gas Car',          emoji: '🚗', sub: '0.192 kg CO₂/km' },
      { value: 'Electric Vehicle', label: 'Electric Vehicle', emoji: '⚡', sub: '0.070 kg CO₂/km' },
      { value: 'Public Transit',   label: 'Public Transit',   emoji: '🚌', sub: '0.040 kg CO₂/km' },
      { value: 'Bike / Walk',      label: 'Bike / Walk',      emoji: '🚴', sub: '0 kg CO₂/km'     },
    ],
    default: 'Gas Car',
  },
  {
    id: 'commuteDistance',
    step: 2,
    title: 'Round-trip commute distance?',
    description: 'Total miles per day, door to door.',
    type: 'slider',
    min: 0, max: 120, step: 5, default: 20,
    unit: 'miles / day',
  },
  {
    id: 'officeDays',
    step: 3,
    title: 'How many days in office per week?',
    description: 'Average over the past month.',
    type: 'slider',
    min: 0, max: 7, step: 1, default: 3,
    unit: 'days / week',
  },
  {
    id: 'foodLifestyle',
    step: 4,
    title: 'What best describes your diet?',
    description: 'Food production accounts for ~26% of global emissions.',
    type: 'choice',
    options: [
      { value: 'Meat Lover',  label: 'Meat Lover',  emoji: '🥩', sub: '3,300 kg/yr' },
      { value: 'Omnivore',    label: 'Omnivore',    emoji: '🍽️', sub: '2,500 kg/yr' },
      { value: 'Flexitarian', label: 'Flexitarian', emoji: '🥗', sub: '1,900 kg/yr' },
      { value: 'Vegetarian',  label: 'Vegetarian',  emoji: '🥦', sub: '1,700 kg/yr' },
      { value: 'Vegan',       label: 'Vegan',       emoji: '🌱', sub: '1,500 kg/yr' },
    ],
    default: 'Omnivore',
  },
  {
    id: 'lifestylePattern',
    step: 5,
    title: 'General lifestyle intensity?',
    description: 'Flights, online orders, home energy, and consumer goods.',
    type: 'choice',
    options: [
      { value: 'High',   label: 'High',   emoji: '✈️', sub: 'Frequent flier + heavy consumer' },
      { value: 'Medium', label: 'Medium', emoji: '📦', sub: 'Occasional flying + moderate spend' },
      { value: 'Low',    label: 'Low',    emoji: '🌿', sub: 'Rarely flies + mindful consumer' },
    ],
    default: 'Medium',
  },
];

export const Assessment = () => {
  const navigate  = useNavigate();
  const { saveAssessment } = useEco();
  const [step, setStep]   = useState(0);
  const [answers, setAnswers] = useState({
    commuteMode:      'Gas Car',
    commuteDistance:  20,
    officeDays:       3,
    foodLifestyle:    'Omnivore',
    lifestylePattern: 'Medium',
  });

  const q         = QUESTIONS[step];
  const isLast    = step === QUESTIONS.length - 1;
  const progress  = ((step + 1) / QUESTIONS.length) * 100;

  const set = (val) => setAnswers(prev => ({ ...prev, [q.id]: val }));

  const handleNext = () => {
    if (isLast) {
      saveAssessment(answers);
      navigate('/dashboard');
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/15 rounded-full blur-[120px]" />
      </div>



      <div className="w-full max-w-lg relative z-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Step {step + 1} of {QUESTIONS.length}
            </span>
            <span className="text-xs font-bold text-emerald-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="card-dark rounded-2xl overflow-hidden" key={step}>
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{q.title}</h2>
            <p className="text-slate-400 text-sm mb-8">{q.description}</p>

            {/* Slider */}
            {q.type === 'slider' && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <span className="text-6xl font-black text-white tabular-nums">
                    {answers[q.id] ?? q.default}
                  </span>
                  <span className="text-slate-400 ml-3 text-base font-medium">{q.unit}</span>
                </div>
                <input
                  type="range"
                  min={q.min} max={q.max} step={q.step}
                  value={answers[q.id] ?? q.default}
                  onChange={e => set(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #059669 ${((answers[q.id] - q.min) / (q.max - q.min)) * 100}%, rgba(255,255,255,0.1) ${((answers[q.id] - q.min) / (q.max - q.min)) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{q.min}</span>
                  <span>{q.max}</span>
                </div>
              </div>
            )}

            {/* Choice */}
            {q.type === 'choice' && (
              <div className="space-y-3">
                {q.options.map(opt => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => set(opt.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left group ${
                        selected
                          ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                          : 'border-white/6 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div className="flex-grow">
                        <span className={`font-semibold text-sm block ${selected ? 'text-emerald-300' : 'text-white'}`}>
                          {opt.label}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5 block">{opt.sub}</span>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600 group-hover:border-slate-400'
                      }`}>
                        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="px-8 sm:px-10 py-5 border-t border-white/5 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            <button
              id={`assessment-next-step-${step}`}
              onClick={handleNext}
              className="btn-primary"
            >
              {isLast ? (
                <><CheckCircle2 className="h-4 w-4" /> Analyze Footprint</>
              ) : (
                <>Continue <ChevronRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-6">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-emerald-500' : i < step ? 'w-3 bg-emerald-800' : 'w-3 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
