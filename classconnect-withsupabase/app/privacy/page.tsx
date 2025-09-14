// app/privacy-policy/page.tsx (Next.js 13+ App Router)
// or pages/privacy-policy.tsx (if you're still on Pages Router)

import Link from "next/link";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="p-6 font-sans">
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-2xl text-gray-800 hover:text-purple-600 transition-all duration-200 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/30"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          ClassConnectLA
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-center mt-5">
        Privacy Policy
      </h1>
      <p>
        This privacy policy applies to the ClassConnectLA app (hereby referred
        to as &quot;Application&quot;) for mobile devices that was created by
        Traunico, LLC (hereby referred to as &quot;Service Provider&quot;) as a
        Freemium service. This service is intended for use &quot;AS IS&quot;.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Information Collection and Use
      </h2>
      <p>
        The Application collects information when you download and use it. This
        information may include information such as:
      </p>
      <ul className="list-disc pl-6">
        <li>Your device&apos;s Internet Protocol address (e.g. IP address)</li>
        <li>
          The pages of the Application that you visit, the time and date of your
          visit, the time spent on those pages
        </li>
        <li>The time spent on the Application</li>
        <li>The operating system you use on your mobile device</li>
      </ul>

      <p className="mt-4">
        The Application does not gather precise information about the location
        of your mobile device.
      </p>

      <p className="mt-4">
        The Service Provider may use the information you provided to contact you
        from time to time to provide you with important information, required
        notices and marketing promotions.
      </p>

      <p className="mt-4">
        For a better experience, while using the Application, the Service
        Provider may require you to provide us with certain personally
        identifiable information, including but not limited to email, name,
        phone number, classes taken, and dance class information. The
        information that the Service Provider requests will be retained and used
        as described in this privacy policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third Party Access</h2>
      <p>
        Only aggregated, anonymized data is periodically transmitted to external
        services to aid the Service Provider in improving the Application and
        their service. The Service Provider may share your information with
        third parties in the ways that are described in this privacy statement.
      </p>
      <p className="mt-2">The Application utilizes third-party services:</p>
      <ul className="list-disc pl-6">
        <li>
          <a
            href="https://www.google.com/policies/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google Play Services
          </a>
        </li>
        <li>
          <a
            href="https://expo.io/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Expo
          </a>
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Opt-Out Rights</h2>
      <p>
        You can stop all collection of information by the Application easily by
        uninstalling it. You may use the standard uninstall processes as may be
        available as part of your mobile device or via the mobile application
        marketplace or network.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Retention Policy</h2>
      <p>
        The Service Provider will retain User Provided data for as long as you
        use the Application and for a reasonable time thereafter. If you&apos;d
        like them to delete User Provided Data, please contact them at{" "}
        <a href="mailto:team@traunico.com" className="text-blue-600 underline">
          team@traunico.com
        </a>{" "}
        and they will respond in a reasonable time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Children</h2>
      <p>
        The Service Provider does not use the Application to knowingly solicit
        data from or market to children under the age of 13.
      </p>
      <p className="mt-2">
        If you are a parent or guardian and are aware that your child has
        provided us with personal information, please contact the Service
        Provider at{" "}
        <a href="mailto:team@traunico.com" className="text-blue-600 underline">
          team@traunico.com
        </a>{" "}
        so that necessary actions can be taken.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Security</h2>
      <p>
        The Service Provider is concerned about safeguarding the confidentiality
        of your information. The Service Provider provides physical, electronic,
        and procedural safeguards to protect information the Service Provider
        processes and maintains.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes</h2>
      <p>
        This Privacy Policy may be updated from time to time for any reason. The
        Service Provider will notify you of any changes to the Privacy Policy by
        updating this page with the new Privacy Policy.
      </p>
      <p className="mt-2">Effective as of 2025-09-14.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Consent</h2>
      <p>
        By using the Application, you consent to the processing of your
        information as set forth in this Privacy Policy now and as amended by
        us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p>
        If you have any questions regarding privacy while using the Application,
        please contact the Service Provider via email at{" "}
        <a href="mailto:team@traunico.com" className="text-blue-600 underline">
          team@traunico.com
        </a>
        .
      </p>

      <hr className="my-6" />
      <p className="text-sm text-gray-600">
        This privacy policy page was generated by{" "}
        <a
          href="https://app-privacy-policy-generator.nisrulz.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          App Privacy Policy Generator
        </a>
      </p>
    </main>
  );
}
