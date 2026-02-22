import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import SEOHead from "./SEOHead";

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-bg">
      <SEOHead
        title="Terms of Service"
        description="Terms of service and usage for NanoCraft platform."
        url="https://nanocraft.app/terms"
      />
      <header
        className="w-full px-8 py-8 flex justify-between items-center"
        role="banner"
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <LogoIcon className="text-clay" size={28} />
          </div>
          <span className="text-2xl font-display tracking-wide text-off-white">
            NanoCraft
          </span>
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="text-xs uppercase tracking-widest font-medium text-stone-light/60 hover:text-off-white transition-colors border-b border-transparent hover:border-off-white/30 pb-0.5"
        >
          ← Back
        </button>
      </header>

      <main className="flex-grow px-6 md:px-12 lg:px-24 py-12 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-display tracking-wide text-off-white mb-2">
          Terms of Service
        </h1>
        <p className="text-xs uppercase tracking-widest text-stone-light/40 mb-12">
          Last updated: February 22, 2026
        </p>

        <div className="space-y-10 text-stone-light/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using NanoCraft ("the Service"), you agree to be
              bound by these Terms of Service. If you do not agree to all of
              these terms, you may not access or use the Service. NanoCraft
              reserves the right to modify these terms at any time. Continued
              use of the Service following any such modifications constitutes
              your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              2. Description of Service
            </h2>
            <p>
              NanoCraft is an AI-powered platform that transforms publicly
              accessible DIY and instructional content into structured,
              visual-first learning guides. The Service processes user-submitted
              URLs, extracts instructional data, and generates AI-rendered
              imagery and formatted step-by-step project guides.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              3. AI-Generated Content
            </h2>
            <p className="mb-3">
              The Service utilizes artificial intelligence models to generate
              images, text summaries, and structured representations of
              instructional content. You acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                AI-generated images are synthetic and may not accurately
                represent real-world materials, tools, or outcomes.
              </li>
              <li>
                Generated content is provided for informational and educational
                purposes only and should not be relied upon as the sole source
                of instruction for projects involving safety risks.
              </li>
              <li>
                NanoCraft makes no warranty regarding the accuracy,
                completeness, or fitness for purpose of any AI-generated
                content.
              </li>
              <li>
                AI models may produce content that is unexpected, inconsistent,
                or requires human review before practical application.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              4. Intellectual Property
            </h2>
            <p className="mb-3">
              <strong className="text-off-white/80">4.1 Platform IP.</strong>{" "}
              All NanoCraft branding, software, design systems, proprietary
              algorithms, and platform infrastructure are the exclusive
              intellectual property of NanoCraft and its licensors. No license
              or right is granted to you except for the limited right to use the
              Service as described herein.
            </p>
            <p className="mb-3">
              <strong className="text-off-white/80">4.2 Source Content.</strong>{" "}
              NanoCraft processes publicly available third-party instructional
              content. We do not claim ownership of the original source
              material. Users are responsible for ensuring they have the right
              to process any URL submitted to the Service.
            </p>
            <p>
              <strong className="text-off-white/80">
                4.3 Generated Outputs.
              </strong>{" "}
              AI-generated images and restructured guide content produced by the
              Service are derivative works. You are granted a non-exclusive,
              non-transferable, personal license to use generated outputs for
              private, non-commercial purposes. Redistribution, resale, or
              commercial exploitation of generated outputs without prior written
              consent from NanoCraft is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              5. User Conduct
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                Submit URLs containing content that is illegal, infringing, or
                violates the rights of any third party.
              </li>
              <li>
                Attempt to reverse-engineer, decompile, or extract the
                underlying models, algorithms, or source code of the Service.
              </li>
              <li>
                Use the Service to generate content that is misleading, harmful,
                or intended to deceive.
              </li>
              <li>
                Circumvent any rate limits, access controls, or technical
                restrictions imposed by the Service.
              </li>
              <li>
                Scrape, crawl, or systematically extract data from NanoCraft for
                any unauthorized purpose.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              6. Data & Privacy
            </h2>
            <p>
              NanoCraft may collect and store submitted URLs, generated project
              data, and usage analytics to improve the Service. We do not sell
              personal data to third parties. Generated content may be stored
              temporarily for caching and performance optimization. Users may
              request deletion of their stored data by contacting us through our
              official channels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, NanoCraft and
              its affiliates, officers, employees, and agents shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits,
              data, or goodwill, arising out of or in connection with your use
              of the Service. The Service is provided on an "AS IS" and "AS
              AVAILABLE" basis without warranties of any kind, whether express
              or implied.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              8. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless NanoCraft, its
              affiliates, and their respective officers, directors, employees,
              and agents from and against any claims, liabilities, damages,
              losses, and expenses (including reasonable legal fees) arising out
              of or in connection with your use of the Service, your violation
              of these Terms, or your infringement of any intellectual property
              or other rights of any third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              9. Termination
            </h2>
            <p>
              NanoCraft reserves the right to suspend or terminate your access
              to the Service at any time, with or without cause, and with or
              without notice. Upon termination, your right to use the Service
              will immediately cease, and any generated content associated with
              your usage may be deleted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display text-clay tracking-wide mb-3">
              10. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law principles. Any
              disputes arising under these Terms shall be resolved through
              binding arbitration in accordance with standard arbitration
              procedures.
            </p>
          </section>

          <section className="border-t border-stone-light/10 pt-8">
            <p className="text-stone-light/40 text-xs">
              For questions regarding these Terms, please visit our{" "}
              <a
                href="https://github.com/vynride/NanoCraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay hover:text-off-white transition-colors"
              >
                GitHub repository
              </a>{" "}
              or contact us through our official channels.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
