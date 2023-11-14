import InvalidCookie from "@/components/InvalidUidCookie";
import Sidenav from "@/components/Sidenav";
import UniqueHeader from "@/components/UniqueHeaderTags";
import { IsUserSignedIn } from "@/functions";
import { DEFAULT_PAGE_LAYOUT } from "@/types";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const pageData: DEFAULT_PAGE_LAYOUT = {
    header_tags: {
      title: "Privacy Policy | Stack",
      description:
        "Review the privacy policy for stackapp and know what we expect of you when using our services",
      canonical_link: "https://stackapp.xyz/privacy",
      open_graph_tags: null,
    },
    is_signed_in: await IsUserSignedIn(req.cookies.uid),
  };

  return {
    props: {
      page_data: pageData,
    },
  };
};

export default function Privacy({
  page_data,
}: {
  page_data: DEFAULT_PAGE_LAYOUT;
}) {
  return (
    <>
      {page_data.is_signed_in === "remove_uid_cookie" && (
        <InvalidCookie redirectUrl="/privacy" />
      )}
      {page_data.is_signed_in !== "remove_uid_cookie" && (
        <>
          <UniqueHeader
            title={page_data.header_tags.title}
            description={page_data.header_tags.description}
            canonicalLink={page_data.header_tags.canonical_link!}
            openGraph={page_data.header_tags.open_graph_tags}
          />
          <section>
            {page_data.is_signed_in && <Sidenav isSignedIn={true} />}
            {!page_data.is_signed_in && <Sidenav isSignedIn={false} />}
          </section>
          <div className="background">
            <img
              src="/imgs/background.avif"
              alt="background design"
              className="background-image"
            />
          </div>
          <section>
            <main>
              <div className="card-container-title">
                <div className="card-empty">
                  <h1>Privacy Policy</h1>
                  <p className="subtitle">
                    At Stack, we are committed to protecting your privacy and
                    ensuring the security of your personal information.
                  </p>
                </div>
              </div>

              <div className="card-container">
                <div className="card">
                  <h2 className="bold">General Use</h2>
                  <p>
                    This Privacy Policy explains how we collect, use, share, and
                    protect your data when you use our web application to create and
                    share tech stacks. By accessing or using Stack, you consent
                    to the practices described in this Privacy Policy. Stack may
                    update this Privacy Policy from time to time. We will notify you
                    of any material changes through our platform or via email. It is
                    your responsibility to review the Privacy Policy periodically
                    for any updates. By using Stack, you agree to the terms of
                    this Privacy Policy. We encourage you to read this policy
                    carefullyand make informed decisions about your privacy while
                    using our web app. If you have any questions, concerns, or
                    requests regarding this Privacy Policy or the data we hold about
                    you, please contact us at [stackapphelp@gmail.com].
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Personal Information</h2>
                  <p>
                    When you sign up for an account on Stack, we may collect
                    certain personal information from you, such as your name,
                    email address, and profile picture. This information is used
                    to identify you as a user and to provide you with a
                    personalized experience on our platform.
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Usage Data</h2>
                  <p>
                    We may collect usage data related to your interactions with
                    the Stack web app. This includes information about your
                    browsing activities, the pages you visit, the features you
                    use, and other interactions within the platform. We utilize
                    this data to improve our services and enhance your user
                    experience.
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Providing Services</h2>
                  <p>
                    Stack uses the information collected to offer our web
                    application and enable you to create, customize, and share
                    your tech stacks as intended.
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Personalization</h2>
                  <p>
                    We may use your personal information to personalize your
                    experience on the Stack platform, including displaying your
                    name and profile picture.
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Communication</h2>
                  <p>
                    We may use your email address to send you important updates,
                    notifications, and information about your account or changes
                    to our services. We may also send you promotional materials
                    and updates related to Stack, but you can opt-out of such
                    communications at any time.
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Public Sharing</h2>
                  <p>
                    Stack allows you to share your tech stacks publicly. Please
                    be aware that any information you choose to share publicly
                    may be accessed and used by others.
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Legal Compliance</h2>
                  <p>
                    We may disclose your information when required to comply
                    with applicable laws, regulations, legal processes, or
                    government requests.
                    <br />
                    <br />
                  </p>

                  <h2 className="bold">Data Security</h2>
                  <p>
                    We prioritize the security of your data and employ
                    reasonable technical and organizational measures to
                    safeguard your information from unauthorized access, loss,
                    or alteration.
                    <br />
                    <br />
                  </p>
                </div>
              </div>
            </main>
          </section>
        </>
      )}
    </>
  );
}