
export type EnvAttacktimeInterface = number;
export type EnvDecayTimeInterface = number;
export type EnvSustainlevelInterface = number;
export type EnvReleasetimeInterface = number;
export type EnvModifierInterface = number;

export interface EnvelopeInterface {
  attackTime: EnvAttacktimeInterface;
  decayTime: EnvDecayTimeInterface;
  sustainLevel: EnvSustainlevelInterface;
  releaseTime: EnvReleasetimeInterface;
  modifier: EnvModifierInterface;
  [k: string]: any;
}

export type OperatorWaveTypeInterface = "sine" | "square" | "sawtooth" | "triangle";
export type OperatorRatioInterface = number;
export type OperatorFrequencyModeInterface = "ratio" | "fixed";
export type OperatorFixedFrequencyInterface = number;
export type OperatorDetuneInterface = number;
export type OperatorModulationfactorInterface = number;
export type OperatorFeedbackInterface = number;

export type OperatorConnectsToInterface = "none" | "output" | "a" | "b" | "b + c" | "b + c + d" | "b + d" | "c" | "c + d" | "d";
export type OperatorAConnectsToInterface = "none" | "output" | "b" | "b + c" | "b + c + d" | "b + d" | "c" | "c + d" | "d";
export type OperatorBConnectsToInterface = "none" | "output" | "a" | "a + c" | "a + c + d" | "a + d" | "c" | "c + d" | "d";
export type OperatorCConnectsToInterface = "none" | "output" | "a" | "a + b" | "a + b + d" | "a + d" | "b" | "b + d" | "d";
export type OperatorDConnectsToInterface = "none" | "output" | "a" | "a + b" | "a + b + c" | "a + c" | "b" | "b + c" | "c";


export interface OperatorInterface {
  waveType: OperatorWaveTypeInterface;
  ratio: OperatorRatioInterface;
  frequencyMode: OperatorFrequencyModeInterface;
  fixedFrequency: OperatorFixedFrequencyInterface;
  detune: OperatorDetuneInterface;
  modulationFactor: OperatorModulationfactorInterface;
  feedback: OperatorFeedbackInterface;
  ampEnv: EnvelopeInterface;
  pitchEnv: EnvelopeInterface;
  [k: string]: any;
}

export interface OperatorAInterface extends OperatorInterface {
  connectsTo: OperatorAConnectsToInterface;
}
export interface OperatorBInterface extends OperatorInterface {
  connectsTo: OperatorBConnectsToInterface;
}

export interface OperatorCInterface extends OperatorInterface {
  connectsTo: OperatorCConnectsToInterface;
}
export interface OperatorDInterface extends OperatorInterface {
  connectsTo: OperatorDConnectsToInterface;
}



export interface PresetInterface {
  a: OperatorAInterface;
  b: OperatorBInterface;
  c: OperatorCInterface;
  d: OperatorDInterface;
  [k: string]: any;
}