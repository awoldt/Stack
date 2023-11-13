/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import { IsValidAccountCookie } from "@/functions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SideNav from "../../components/CustomNav";
import { stacksCollection } from "@/services/mongodb";

export const metadata: Metadata = {
  title: null,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const cookieStore = cookies();

  const account: any = await IsValidAccountCookie(cookieStore.get("a_id"));
  const userStacks = await stacksCollection
    .find({ aid: String(account._id) })
    .limit(10)
    .sort({ created_on: -1 })
    .toArray();

  metadata.title = `@${account.username} | Stack`;

  if (account === false) {
    redirect("/signup");
  } else {
    return (
      <>
        <div>
          <section>
            <SideNav isSignedIn={true} />
          </section>

          {/* USER PROFILE */}
          <section>
            <main>
              <div className="header-container">
                <div
                  className="profile-container-header"
                  style={{ marginTop: "4rem" }}
                >
                  <div className="profile-header">
                    <div className="header">
                      {account.profile_pic === null && (
                        <img
                          src="/imgs/icons/noprofile.png"
                          className="profile-img"
                          alt="basic profile pic"
                        />
                      )}
                      {account.profile_pic_filename !== null && (
                        <img
                          src={account.profile_pic_filename}
                          className="profile-img"
                          alt={`${account.username}'s profile pic`}
                        />
                      )}

                      <h1>
                        {account.first_name} {account.last_name}
                      </h1>

                      <span>@{account.username}</span>

                      {account.bio !== null && (
                        <p
                          style={{
                            marginTop: "20px",
                            marginBottom: "20px",
                          }}
                        >
                          {account.bio}
                        </p>
                      )}

                      <div
                        style={{
                          marginTop: "40px",
                          marginBottom: "40px",
                        }}
                      >
                        <a
                          href={"/profile/edit"}
                          title="Edit your profile"
                          className="btn"
                        >
                          Edit Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </section>

          <section>
            {userStacks.length === 0 && (
              <>
                <div
                  className="card-container"
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "40px",
                  }}
                >
                  <div
                    className="card"
                    style={{
                      textAlign: "center",
                      paddingBottom: "80px",
                    }}
                  >
                    <h2>Stacks</h2>
                    <span>
                      0 Stacks
                      <br />
                      <br />
                    </span>
                    <br />
                    <a href={"/create"} className="btn">
                      Create Stack
                    </a>
                  </div>
                </div>
              </>
            )}
            {userStacks.length > 0 && (
              <div
                className="card-container"
                style={{
                  paddingTop: "0px",
                  paddingBottom: "80px",
                }}
              >
                <div className="card" style={{ textAlign: "center" }}>
                  <h2>
                    Stacks
                  </h2>
                  <span className="subtitle">
                    {userStacks.length !== 10 && (
                      <><>{userStacks.length} Stacks</><br /></>
                    )}
                    {userStacks.length === 10 && (
                      <><>Showing your 10 most recent Stacks</><br /></>
                    )}
                    <br />
                  </span>

                  {userStacks.map((x: any, index: number) => {
                    return (
                      <a href={`/stack/${x._id}`} key={index}>
                        <div className="card-container">
                          <div className="card-thumbnail">
                            <img
                              src={x.thumbnail_url!}
                              style={{ cursor: "pointer" }}
                              alt={`${x.name} thumbnail`}
                            />
                          </div>
                        </div>
                        <h4><b>{x.name}</b></h4>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </>
    );
  }
}
