import LegalLayout, { CONTACT_EMAIL, INSTAGRAM_URL } from "@/components/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout label="Legal" title="Privacy Policy" updated="August 2, 2026">
      <h2>1. Overview</h2>
      <p>
        This Privacy Policy explains what information Project Nexus ("Nexus", "we",
        "us") collects when you use the platform, how we use it, and the choices you
        have. Nexus is built for high school students, so we try to collect only what's
        needed to make teammate matching, projects, and community features work.
      </p>

      <h2>2. Information we collect</h2>
      <p>You provide most of this directly when you create and use your account:</p>
      <ul>
        <li><strong>Account info:</strong> name, email address, and password (stored as a secure hash — we never store your plain-text password).</li>
        <li><strong>Profile info:</strong> school, grade, bio, avatar, skills, interests, "looking for" tags, and general location (city/state).</li>
        <li><strong>Activity content:</strong> projects you create or join, opportunity listings, forum posts and comments, direct messages, connection requests, and reviews/ratings you give or receive.</li>
        <li><strong>AI matching input:</strong> the goal text you type when asking Nexus to find teammates or opportunities, plus relevant profile fields (skills, interests, location).</li>
        <li><strong>Technical info:</strong> a session cookie used to keep you logged in (see our <a href="/cookies">Cookies Policy</a>).</li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To operate core features: authentication, profiles, project hub, opportunity board, messaging, forum, connections, and reputation/reviews.</li>
        <li>To power AI-assisted teammate and opportunity matching, and to explain why a match was suggested.</li>
        <li>To show your profile, projects, and reputation to other students on the platform, consistent with the visibility of the features you use.</li>
        <li>To keep the platform safe — for example, investigating reports of harassment or abuse.</li>
        <li>To communicate with you about your account (e.g. respond to a support request you send us).</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>4. AI processing & third-party services</h2>
      <p>
        When you use AI-powered matching, your goal text and relevant profile details are
        sent to a third-party AI model provider to generate suggestions. If that
        provider is unavailable, Nexus falls back to matching you locally using
        rule-based logic instead. We also use a hosted database provider to store
        platform data. These providers process data on our behalf and are not permitted
        to use it for their own purposes.
      </p>

      <h2>5. What other students can see</h2>
      <p>
        Nexus is a collaboration platform, so parts of your profile (name, school,
        grade, bio, skills, interests, avatar, and reputation) are visible to other
        students so they can find and evaluate you as a teammate. Forum posts and
        project activity are visible to students who can access that community or
        project. Direct messages are only visible to you and the recipient.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We keep your account and activity data for as long as your account is active.
        If you delete your account, we remove or anonymize your personal profile
        information, though some content tied to shared activity (like a message you
        sent to another student, or a review someone left about a completed project)
        may remain to preserve the integrity of other users' records.
      </p>

      <h2>7. Your choices</h2>
      <ul>
        <li>You can edit most profile information at any time from your Profile page.</li>
        <li>You can request a copy of your data or deletion of your account by emailing us.</li>
        <li>Parents/guardians of students under 18 may contact us with questions about their student's account.</li>
      </ul>

      <h2>8. Security</h2>
      <p>
        We use industry-standard measures such as password hashing and secure,
        httpOnly session cookies to protect your account. No online service can
        guarantee perfect security, so please use a strong, unique password.
      </p>

      <h2>9. Children's privacy</h2>
      <p>
        Nexus is not directed at children under 13, and we do not knowingly collect
        personal information from anyone under 13. If you believe a child under 13 has
        created an account, please contact us and we will delete it.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy as Nexus evolves. Material changes will be
        reflected in the "Last updated" date above.
      </p>

      <h2>11. Contact us</h2>
      <p>
        Questions about this Privacy Policy or your data? Reach us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or follow us on{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>.
      </p>
    </LegalLayout>
  );
}
