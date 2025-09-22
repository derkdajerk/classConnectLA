import Link from "next/link";
import React from "react";

export default function TermsOfUsePage() {
  return (
    <main className="p-6 font-sans max-w-3xl mx-auto">
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
      <h1 className="text-2xl font-bold mb-4">Terms &amp; Conditions</h1>
      <p className="mb-4">
        These terms and conditions apply to the ClassConnectLA app (hereby
        referred to as &quot;Application&quot;) for mobile devices that was
        created by Traunico, LLC (hereby referred to as &quot;Service
        Provider&quot;) as a Freemium service.
      </p>
      <p className="mb-4">
        Upon downloading or utilizing the Application, you are automatically
        agreeing to the following terms. It is strongly advised that you
        thoroughly read and understand these terms prior to using the
        Application. Unauthorized copying or modification of the Application,
        any part of the Application, or our trademarks is strictly prohibited.
        Any attempts to extract the source code of the Application, translate
        the Application into other languages, or create derivative versions are
        not permitted. All trademarks, copyrights, database rights, and other
        intellectual property rights related to the Application remain the
        property of the Service Provider.
      </p>
      <p className="mb-4">
        The Service Provider is dedicated to ensuring that the Application is as
        beneficial and efficient as possible. As such, they reserve the right to
        modify the Application or charge for their services at any time and for
        any reason. The Service Provider assures you that any charges for the
        Application or its services will be clearly communicated to you.
      </p>
      <p className="mb-4">
        The Application stores and processes personal data that you have
        provided to the Service Provider in order to provide the Service. It is
        your responsibility to maintain the security of your phone and access to
        the Application. The Service Provider strongly advise against
        jailbreaking or rooting your phone, which involves removing software
        restrictions and limitations imposed by the official operating system of
        your device. Such actions could expose your phone to malware, viruses,
        malicious programs, compromise your phone&apos;s security features, and
        may result in the Application not functioning correctly or at all.
      </p>
      <div className="mb-4">
        <p className="mb-2">
          Please note that the Application utilizes third-party services that
          have their own Terms and Conditions. Below are the links to the Terms
          and Conditions of the third-party service providers used by the
          Application:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Play Services
            </a>
          </li>
          <li>
            <a
              href="https://expo.io/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Expo
            </a>
          </li>
        </ul>
      </div>
      <p className="mb-4">
        Please be aware that the Service Provider does not assume responsibility
        for certain aspects. Some functions of the Application require an active
        internet connection, which can be Wi-Fi or provided by your mobile
        network provider. The Service Provider cannot be held responsible if the
        Application does not function at full capacity due to lack of access to
        Wi-Fi or if you have exhausted your data allowance.
      </p>
      <p className="mb-4">
        If you are using the application outside of a Wi-Fi area, please be
        aware that your mobile network provider&apos;s agreement terms still
        apply. Consequently, you may incur charges from your mobile provider for
        data usage during the connection to the application, or other
        third-party charges. By using the application, you accept responsibility
        for any such charges, including roaming data charges if you use the
        application outside of your home territory (i.e., region or country)
        without disabling data roaming. If you are not the bill payer for the
        device on which you are using the application, they assume that you have
        obtained permission from the bill payer.
      </p>
      <p className="mb-4">
        Similarly, the Service Provider cannot always assume responsibility for
        your usage of the application. For instance, it is your responsibility
        to ensure that your device remains charged. If your device runs out of
        battery and you are unable to access the Service, the Service Provider
        cannot be held responsible.
      </p>
      <p className="mb-4">
        In terms of the Service Provider&apos;s responsibility for your use of
        the application, it is important to note that while they strive to
        ensure that it is updated and accurate at all times, they do rely on
        third parties to provide information to them so that they can make it
        available to you. The Service Provider accepts no liability for any
        loss, direct or indirect, that you experience as a result of relying
        entirely on this functionality of the application.
      </p>
      <p className="mb-4">
        The Service Provider may wish to update the application at some point.
        The application is currently available as per the requirements for the
        operating system (and for any additional systems they decide to extend
        the availability of the application to) may change, and you will need to
        download the updates if you want to continue using the application. The
        Service Provider does not guarantee that it will always update the
        application so that it is relevant to you and/or compatible with the
        particular operating system version installed on your device. However,
        you agree to always accept updates to the application when offered to
        you. The Service Provider may also wish to cease providing the
        application and may terminate its use at any time without providing
        termination notice to you. Unless they inform you otherwise, upon any
        termination, (a) the rights and licenses granted to you in these terms
        will end; (b) you must cease using the application, and (if necessary)
        delete it from your device.
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">
        No Warranty and Limitation of Liability
      </h2>
      <p className="mb-4">
        The Application is provided on an &quot;as is&quot; and &quot;as
        available&quot; basis. While the Service Provider will make reasonable
        efforts to maintain the Application, they do not guarantee uninterrupted
        or error-free service. To the fullest extent permitted by law, Traunico,
        LLC and its affiliates are not liable for any direct, indirect,
        incidental, consequential, or special damages arising out of or in any
        way related to your use of the Application, including but not limited to
        downtime, lost data, or lost opportunities. Brief outages or temporary
        disruptions do not automatically entitle users to refunds. If you are
        dissatisfied with the Application, your sole remedy is to stop using it
        and, if applicable, cancel your subscription.
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">
        Changes to These Terms and Conditions
      </h2>
      <p className="mb-4">
        The Service Provider may periodically update their Terms and Conditions.
        Therefore, you are advised to review this page regularly for any
        changes. The Service Provider will notify you of any changes by posting
        the new Terms and Conditions on this page.
      </p>
      <p className="mb-4">
        These terms and conditions are effective as of 2025-09-14
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="mb-6">
        If you have any questions or suggestions about the Terms and Conditions,
        please do not hesitate to contact the Service Provider at{" "}
        <a href="mailto:team@traunico.com" className="text-blue-600 underline">
          team@traunico.com
        </a>
        .
      </p>
      <hr className="mb-6" />
      <p className="text-sm text-gray-600">
        This Terms and Conditions page was generated by{" "}
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
