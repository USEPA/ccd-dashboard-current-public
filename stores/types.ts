export interface HelpText {
  helpPosition: string;
  helpText: string;
  iconType: string;
  helpTextId: string;
}

export interface UseHelpTextsState {
  helpTexts: HelpText[];
  loadingHelpTexts: boolean;
}
