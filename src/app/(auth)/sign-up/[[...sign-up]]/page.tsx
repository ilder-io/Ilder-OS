import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          card: "bg-surface-raised border border-border shadow-elevated",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
        },
      }}
    />
  );
}
