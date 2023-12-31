/* eslint-disable @next/next/no-img-element */
import { IsValidAccountCookie } from "@/functions";
import { cookies } from "next/headers";
import { accountsCollection, stacksCollection } from "@/services/mongodb";
import { Stack } from "@/models/stacks";
import { UserProfile } from "@/models/profile";
import { ObjectId } from "mongodb";
import { Metadata } from "next";

interface ExploreStackDiv {
  stackInfo: Stack;
  userInfo: UserProfile | null;
}

export const metadata: Metadata = {
  title: "Explore Stacks | Stack",
  description:
    "Explore diverse tech stacks. Uncover databases, languages, APIs, frameworks, and construction insights from fellow stack creators.",
  alternates: {
    canonical: "https://stackapp.xyz/explore",
  },
  openGraph: {
    type: "website",
    url: "https://stackapp.xyz/explore",
    title: "Explore Application's Tech Stacks from Other Developers",
    description:
      "Showcase how you built your app and the technology that went into making it. Impress others in the developer community!",
    siteName: "Stack",
    images: [
      {
        url: "https://stackapp.xyz/imgs/splash/image.png",
      },
    ],
  },
};

export default async function Page() {
  const recentStacks = await stacksCollection
    .find()
    .sort({ created_on: -1 })
    .limit(12)
    .toArray();

  // loop through all stacks and only allow 1 account per stack div
  // 1 single user cannot spam all their stacks on explore page
  const featuredStacks: ExploreStackDiv[] = [];
  const usedAccounts: string[] = [];
  for (let i = 0; i < recentStacks.length; i++) {
    if (!usedAccounts.includes(recentStacks[i].aid)) {
      usedAccounts.push(recentStacks[i].aid);

      featuredStacks.push({
        stackInfo: recentStacks[i],
        userInfo: await accountsCollection.findOne({
          _id: new ObjectId(recentStacks[i].aid),
        }),
      });
    }
  }

  // NEED THIS FOR DOWN BELOW
  // IF NOT
  const STACKIDS = featuredStacks.map((x: any) => {
    return x.stackInfo._id;
  });

  return (
    <>
      <div className="card-container-title">
        <div className="card-empty-wide">
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0",
              marginTop: "0",
            }}
          >
            {/* <img src="/imgs/icons/explore.svg" />
            &nbsp; */}
            Explore Stacks
          </h1>
          <p className="subheading">
            Explore recently created Stacks from other members of the community.
          </p>
        </div>
      </div>

      <div className="card-container" id="yourStacks">
        <div className="card">
          {featuredStacks.map((x: ExploreStackDiv, index) => {
            return (
              <div key={index}>
                <a href={`/stack/${STACKIDS[index]}`}>

                  <div className="hover-container">
                    <div className="left-top"></div>
                    <div className="left-bottom"></div>
                    <div className="right-top"></div>
                    <div className="right-bottom"></div>
                    <div className="profile-stack-container">
                      <div className="card-thumbnail">
                        <img src={x.stackInfo.thumbnail_url} />
                      </div>

                      <img
                        src={x.stackInfo.icon_url}
                        className="explore-stack-img"
                        alt="stack-img"
                      />

                      <div className="stack-description">
                        <h2 style={{ lineHeight: "1.4" }}>{x.stackInfo.name}</h2>

                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            opacity: "0.4"
                          }}
                        >
                          {x.stackInfo.created_on.toDateString()}
                        </p>

                        {/* <p style={{ lineHeight: "2.4" }}>
                          {x.stackInfo.description.length > 60
                            ? x.stackInfo.description.slice(0, 60) + "..."
                            : x.stackInfo.description}
                        </p> */}

                        <div className="profile-explore-container">
                          <img
                            src={
                              x.userInfo?.profile_pic_filename !== null
                                ? x.userInfo?.profile_pic_filename!
                                : "/imgs/icons/noprofile.png"
                            }
                            className="user-profile-img"
                            alt="user-profile-img"
                            style={{ cursor: "pointer" }}
                          />
                          <p style={{ cursor: "pointer" }}>
                            <b>
                              {x.userInfo!.first_name} {x.userInfo!.last_name}
                            </b>
                            <br />@{x.userInfo?.username}
                          </p>
                        </div>
                      </div>
                      <div className="explore-stack-icons-container">
                        <img
                          src={`/imgs/tech/${x.stackInfo.languages_used[0]}.svg`}
                          className="explore-stack-icons"
                          alt="language-logo"
                        />
                        {x.stackInfo.databases_used !== null && (
                          <img
                            src={`/imgs/tech/${x.stackInfo.databases_used[0]}.svg`}
                            className="explore-stack-icons"
                            alt="database-logo"
                          />
                        )}

                        {x.stackInfo.clouds_used !== null && (
                          <img
                            src={`/imgs/tech/${x.stackInfo.clouds_used[0]}.svg`}
                            className="explore-stack-icons"
                            alt="cloud-logo"
                          />
                        )}

                        {x.stackInfo.apis_used !== null && (
                          <img
                            src={`/imgs/tech/${x.stackInfo.apis_used[0]}.svg`}
                            className="explore-stack-icons"
                            alt="api-logo"
                          />
                        )}

                        {x.stackInfo.frameworks_used !== null && (
                          <img
                            src={`/imgs/tech/${x.stackInfo.frameworks_used[0]}.svg`}
                            className="explore-stack-icons"
                            alt="framework-logo"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
