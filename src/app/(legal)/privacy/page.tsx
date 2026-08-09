import type { Metadata } from "next";
import { H1, Meta, Intro, H2, P, Ul } from "@/app/(legal)/legal-content";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_NAME}`,
};

const EFFECTIVE_DATE = "August 8, 2026";
const CONTACT_EMAIL = "toctocruz@gmail.com";

export default function PrivacyPage() {
  return (
    <article>
      <H1>Privacy Policy</H1>
      <Meta>Effective date: {EFFECTIVE_DATE}</Meta>

      <Intro>
        This Privacy Policy explains what information {APP_NAME} (&quot;we&quot;, &quot;us&quot;)
        collects, how we use it, and the choices you have — including, specifically, what happens when
        you connect a social platform like TikTok to your workspace.
      </Intro>

      <H2>1. Information we collect</H2>
      <P><strong>Account information.</strong> When you sign up, our authentication provider (Clerk) collects your email address, name, and authentication data. We don&apos;t receive or store your password.</P>
      <P><strong>Content you create.</strong> Everything you enter into the Service — objectives, key results, sprints, ideas, content plans, scripts, reviews, and knowledge base docs — is stored so the Service can display it back to you.</P>
      <P><strong>Data from connected platforms.</strong> If you choose to connect a social platform, we collect the data described in Section 3 below, and only for the platforms you actively connect.</P>
      <P><strong>Usage data.</strong> Standard technical data (IP address, browser type, pages visited) collected automatically to operate and secure the Service.</P>

      <H2>2. How we use your information</H2>
      <Ul>
        <li>To provide, maintain, and improve the Service.</li>
        <li>To authenticate you and keep your account secure.</li>
        <li>To sync and display your content and its performance metrics from platforms you connect.</li>
        <li>To communicate with you about your account or changes to the Service.</li>
      </Ul>
      <P>We do not sell your personal information, and we do not use it for third-party advertising.</P>

      <H2>3. TikTok data, specifically</H2>
      <P>
        If you connect a TikTok account, we use TikTok&apos;s official Login Kit (OAuth 2.0) to request
        your explicit authorization for the following, and only the following, scopes:
      </P>
      <Ul>
        <li><strong>user.info.basic</strong> — your TikTok open ID, display name, and avatar, used to confirm which account is connected.</li>
        <li><strong>user.info.stats</strong> — your follower count, following count, likes count, and video count, used to power the growth metrics shown in your dashboard.</li>
        <li><strong>video.list</strong> — your public videos and their view/like/comment/share counts, used to populate and keep your Content module in sync with what you&apos;ve actually published.</li>
      </Ul>
      <P>
        We only request this data when you click &quot;Connect&quot; in Settings, and only after you
        approve it on TikTok&apos;s own authorization screen. Your TikTok access and refresh tokens are
        encrypted at rest (AES-256-GCM) and are never displayed in the interface or sent anywhere other
        than TikTok&apos;s own API, from our servers, to keep your data in sync. We do not share TikTok
        data with any other third party.
      </P>
      <P>
        You can disconnect TikTok at any time from Settings. Disconnecting stops all future syncing
        immediately; previously synced content and metrics remain in your workspace until you delete
        them or your account, since they&apos;re your data to keep or remove as you choose. You can
        request full deletion of TikTok-derived data by contacting us (Section 8).
      </P>

      <H2>4. How we share information</H2>
      <P>We share information only with the service providers that operate the Service on our behalf, under their own confidentiality and security obligations:</P>
      <Ul>
        <li><strong>Clerk</strong> — authentication and account management.</li>
        <li><strong>Neon</strong> — our PostgreSQL database host, where your workspace data is stored.</li>
        <li><strong>Vercel</strong> — hosting and infrastructure for the application itself.</li>
        <li><strong>TikTok (and future connected platforms)</strong> — solely to fetch the data you&apos;ve authorized, described in Section 3.</li>
      </Ul>
      <P>We may also disclose information if required by law, or to protect the rights, safety, and security of the Service and its users.</P>

      <H2>5. Data security</H2>
      <P>
        We use industry-standard measures to protect your data, including encryption in transit (HTTPS)
        and encryption at rest for sensitive credentials like platform access tokens (AES-256-GCM). No
        method of transmission or storage is 100% secure, but we work to protect your information using
        commercially reasonable safeguards.
      </P>

      <H2>6. Data retention</H2>
      <P>
        We retain your account and content data for as long as your account is active. If you delete
        your account, we delete your workspace data, including any encrypted platform tokens, within a
        reasonable period, except where we&apos;re required to retain it for legal or accounting
        purposes.
      </P>

      <H2>7. Cookies</H2>
      <P>
        We use essential cookies to keep you signed in (via Clerk) and, briefly, to secure the OAuth
        connection flow when you connect a platform (a short-lived state and PKCE verifier, cleared
        immediately after the connection completes or fails). We don&apos;t use advertising or
        cross-site tracking cookies.
      </P>

      <H2>8. Your rights and choices</H2>
      <P>You can, at any time:</P>
      <Ul>
        <li>Access, edit, or delete any content in your workspace directly in the app.</li>
        <li>Disconnect any connected platform from Settings.</li>
        <li>Request a copy of your data, or full deletion of your account and associated data, by emailing us.</li>
      </Ul>

      <H2>9. Children&apos;s privacy</H2>
      <P>The Service isn&apos;t directed at, and we don&apos;t knowingly collect information from, anyone under 18.</P>

      <H2>10. Changes to this policy</H2>
      <P>
        We may update this Privacy Policy from time to time. If we make material changes, we&apos;ll
        update the effective date above.
      </P>

      <H2>11. Contact</H2>
      <P>
        Questions about this policy, or requests regarding your data? Reach out at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </P>
    </article>
  );
}
