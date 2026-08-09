/**
 * Shared Clerk `appearance` config for the sign-in/sign-up widgets. Clerk
 * still owns all auth logic (submission, validation, error/loading states,
 * OAuth redirects) — this only restyles the DOM it renders, via Clerk's
 * supported `elements` classNames API. Rebuilding the form from Clerk's
 * headless hooks instead would mean re-implementing security-sensitive
 * flows for a styling change, which isn't worth the risk.
 *
 * Clerk's own header is hidden in favor of our own <DynamicGreeting> above
 * the widget — one headline, not two competing ones.
 */
export const authAppearance = {
  variables: {
    colorPrimary: "#7C5CFC",
    colorBackground: "transparent",
    colorText: "#F3F3F6",
    colorTextSecondary: "#9A9AA6",
    colorInputBackground: "rgba(255,255,255,0.03)",
    colorInputText: "#F3F3F6",
    colorDanger: "#F2645C",
    borderRadius: "0.875rem",
    fontFamily: "var(--font-sans)",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full bg-transparent shadow-none border-none p-0 gap-5",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-foreground transition-all duration-300 rounded-xl h-11",
    socialButtonsBlockButtonText: "font-medium text-sm",
    dividerRow: "my-1",
    dividerLine: "bg-white/10",
    dividerText: "text-muted-foreground text-2xs uppercase tracking-wider",
    formFieldLabel: "text-xs text-muted-foreground font-medium",
    formFieldInput:
      "bg-white/[0.03] border border-white/10 text-foreground rounded-xl h-11 px-3.5 transition-all duration-300 focus:border-[#A78BFA] focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(124,92,252,0.15)] placeholder:text-muted-foreground/40",
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    formButtonPrimary:
      "relative h-11 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#A78BFA] text-white font-medium text-sm shadow-[0_4px_24px_-4px_rgba(124,92,252,0.5)] hover:shadow-[0_8px_32px_-4px_rgba(124,92,252,0.7)] hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 normal-case",
    footer: "bg-transparent",
    footerAction: "text-center",
    footerActionText: "text-muted-foreground text-xs",
    footerActionLink: "text-[#A78BFA] hover:text-[#7C5CFC] font-medium transition-colors",
    identityPreviewText: "text-foreground",
    identityPreviewEditButtonIcon: "text-muted-foreground",
    formFieldErrorText: "text-destructive text-xs",
    formResendCodeLink: "text-[#A78BFA] hover:text-[#7C5CFC]",
    otpCodeFieldInput: "bg-white/[0.03] border border-white/10 text-foreground rounded-lg",
    alternativeMethodsBlockButton: "border border-white/10 hover:bg-white/[0.04] text-foreground rounded-xl transition-colors duration-300",
    footerPages: "hidden",
  },
};
