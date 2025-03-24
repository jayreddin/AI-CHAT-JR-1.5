
export interface PuterAuth {
  signIn(): Promise<any>;
  signOut(): void;
  getUser(): Promise<any>;
  isSignedIn(): boolean;
}

export interface PuterAI {
  chat(
    prompt: string | any[],
    options?: { model?: string; stream?: boolean; tools?: any[] } | string
  ): Promise<any>;
  img2txt(imageUrl: string): Promise<string>;
  txt2img(prompt: string, testMode?: boolean): Promise<HTMLImageElement>;
  txt2speech(text: string): Promise<HTMLAudioElement>;
}

export interface Puter {
  auth: PuterAuth;
  ai: PuterAI;
  env: string;
  print: (text: string) => void;
}

declare global {
  interface Window {
    puter: Puter;
  }
}
