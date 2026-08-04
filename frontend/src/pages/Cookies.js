import LegalLayout, { CONTACT_EMAIL } from "@/components/LegalLayout";

export default function Cookies() {
  return (
    <LegalLayout label="Legal" title="Cookies Policy" updated="August 3, 2026">
      <h2>1. What this policy covers</h2>
      <p>
        This page explains how Project Nexus ("Nexus", "we", "us") uses cookies and
        similar technologies when you use our website and app.
      </p>

      <h2>2. What cookies we use</h2>
      <p>
        The Nexus website uses one <strong>essential cookie</strong> plus{" "}
        <strong>advertising cookies</strong> from Google AdSense, which funds the free
        4-week trial. We don't use any other analytics or tracking cookies.
      </p>
      <ul>
        <li>
          <strong>access_token</strong> — a secure, "httpOnly" session cookie that keeps
          you logged in after you sign in. It's essential to the service: without it,
          Nexus can't tell that you're authenticated, and features like your dashboard,
          messages, and profile won't work. It's set only when you log in or register,
          expires automatically after about 7 days, and can't be read by JavaScript or
          third parties.
        </li>
        <li>
          <strong>Google AdSense</strong> — we show ads on the website (not the app) to
          keep the free trial free. Google may set cookies (for example, to measure ad
          performance or personalize ads) when you view or interact with an ad. You can
          see and control the ad personalization Google uses across the web at{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>, and learn more about how Google uses this data in{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            Google's Partner Sites policy
          </a>.
        </li>
      </ul>

      <h2>3. Managing advertising cookies</h2>
      <p>
        Because our own <strong>access_token</strong> cookie is strictly necessary to
        keep you logged in, it doesn't require consent under most privacy laws.
        Google's advertising cookies aren't strictly necessary, though, so where the
        law requires it (for example, for visitors in the EU/UK), we honor Google's own
        consent and ad-personalization controls. You can opt out of personalized
        advertising at any time via{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>{" "}
        without affecting your ability to use Nexus.
      </p>

      <h2>4. Local storage</h2>
      <p>
        Nexus's browser app may use your browser's local storage to remember small,
        non-sensitive preferences (like UI state). This data stays on your device and
        isn't shared with anyone.
      </p>

      <h2>5. Third-party sites</h2>
      <p>
        Links to opportunity listings or other third-party sites may set their own
        cookies once you leave Nexus. Their cookie practices are covered by their own
        policies, not this one.
      </p>

      <h2>6. Managing cookies</h2>
      <p>
        Most browsers let you view, delete, or block cookies through their settings.
        Since our session cookie is required to stay logged in, blocking it will sign
        you out and prevent you from using account features.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>
        If the cookies we use change — for example, if we add analytics — we'll update
        this page and the "Last updated" date above.
      </p>

      <h2>8. Contact us</h2>
      <p>
        Questions about our use of cookies? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
