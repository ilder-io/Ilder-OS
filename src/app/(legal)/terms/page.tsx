import type { Metadata } from "next";
import { H1, Meta, Intro, H2, P, Ul } from "@/app/(legal)/legal-content";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Service — ${APP_NAME}`,
};

const EFFECTIVE_DATE = "August 8, 2026";
const CONTACT_EMAIL = "toctocruz@gmail.com";

export default function TermsPage() {
  return (
    <article>
      <H1>Terms of Service</H1>
      <Meta>Effective date: {EFFECTIVE_DATE}</Meta>

      <Intro>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of {APP_NAME} (the
        &quot;Service&quot;), a workspace for planning, producing, and tracking a personal brand or
        creator business. By creating an account or otherwise using the Service, you agree to these
        Terms. If you don&apos;t agree, don&apos;t use the Service.
      </Intro>

      <H2>1. Who can use the Service</H2>
      <P>
        You must be at least 18 years old, or the age of legal majority in your jurisdiction, to create
        an account. You&apos;re responsible for the accuracy of the information you provide and for all
        activity that happens under your account.
      </P>

      <H2>2. Your account</H2>
      <P>
        Accounts are created and authenticated through our identity provider, Clerk. You&apos;re
        responsible for keeping your login credentials secure and for notifying us if you believe your
        account has been compromised.
      </P>

      <H2>3. Your content</H2>
      <P>
        You own the content you create in the Service — objectives, scripts, ideas, reviews, and
        everything else you enter. We don&apos;t claim ownership over it. You grant us a limited license
        to store, process, and display that content solely to operate and provide the Service to you.
      </P>

      <H2>4. Connecting third-party platforms</H2>
      <P>
        The Service can connect to third-party social platforms (currently TikTok, with more planned)
        via each platform&apos;s official authorization flow, so we can display your published content
        and its performance metrics inside your workspace. When you connect a platform:
      </P>
      <Ul>
        <li>You&apos;re authorizing us to access the specific data your account grants, scoped to what that platform&apos;s permission screen discloses — nothing more.</li>
        <li>You remain subject to that platform&apos;s own terms of service and policies.</li>
        <li>You can disconnect a platform at any time from Settings; see our <a href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</a> for what happens to previously synced data.</li>
      </Ul>

      <H2>5. Acceptable use</H2>
      <P>You agree not to:</P>
      <Ul>
        <li>Use the Service for any unlawful purpose, or in a way that infringes anyone else&apos;s rights.</li>
        <li>Attempt to gain unauthorized access to the Service, other accounts, or the systems behind it.</li>
        <li>Interfere with or disrupt the integrity or performance of the Service.</li>
        <li>Use automated means to scrape or extract data from the Service outside of what it offers directly.</li>
      </Ul>

      <H2>6. Plans and billing</H2>
      <P>
        The Service may offer both free and paid plans. If you subscribe to a paid plan, you agree to
        pay the fees in effect at the time of purchase. We&apos;ll give you reasonable notice before any
        pricing change takes effect for your account.
      </P>

      <H2>7. Termination</H2>
      <P>
        You may stop using the Service and delete your account at any time. We may suspend or terminate
        your access if you violate these Terms, or if we discontinue the Service, with notice where
        reasonably possible.
      </P>

      <H2>8. Disclaimers</H2>
      <P>
        The Service is provided &quot;as is,&quot; without warranties of any kind, express or implied.
        We don&apos;t guarantee the Service will be uninterrupted, error-free, or that data pulled from
        third-party platforms will always be accurate or up to date.
      </P>

      <H2>9. Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, {APP_NAME} and its operator won&apos;t be liable for any
        indirect, incidental, special, or consequential damages arising from your use of the Service.
      </P>

      <H2>10. Changes to these Terms</H2>
      <P>
        We may update these Terms from time to time. If we make material changes, we&apos;ll update the
        effective date above. Continued use of the Service after a change means you accept the updated
        Terms.
      </P>

      <H2>11. Contact</H2>
      <P>
        Questions about these Terms? Reach out at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </P>
    </article>
  );
}
