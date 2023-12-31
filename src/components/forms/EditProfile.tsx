/* eslint-disable @next/next/no-img-element */
"use client";

import { UserProfile } from "@/models/profile";
import { FormEvent, useRef, useState } from "react";

export default function Form({ user }: { user: UserProfile }) {
  const [profileImgSrc, setProfileImgSrc] = useState(
    user.profile_pic_filename === null
      ? "/imgs/icons/noprofile.png"
      : user.profile_pic_filename
  );
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  async function FormSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);

      const req = await fetch("/api/update-profile", {
        method: "POST",
        body: new FormData(formRef.current!),
      });
      if (req.ok) {
        alert("Profile successfully updated");
        setLoading(false);
        window.location.assign("/profile");
      }
    } catch (e) {
      alert("Error while submitting form");
      setLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        await FormSubmit(e);
      }}
    >
      <div className="card-container">
        <img
          src={profileImgSrc}
          style={{ marginTop: "0" }}
          className="profile-img"
          alt="Proflie picture"
        />
      </div>
      <div className="card-container">
        <input
          type="file"
          name="profile_icon"
          accept="image/png, image/jpeg, image/webp, image/avif, image/tiff"
          style={{ marginTop: "10px", marginBottom: "10px" }}
          onChange={async (e) => {
            const fileInput = e.target;
            if (fileInput.files && fileInput.files[0]) {
              if (fileInput.files[0].size > 5000000) {
                alert("File too large");
              } else {
                const reader = new FileReader();

                reader.onload = (r) => {
                  setProfileImgSrc(r.target?.result?.toString()!);
                };

                reader.readAsDataURL(fileInput.files[0]);
              }
            }
          }}
        />
      </div>

      <div className="input-group">
        <textarea
          className="input"
          defaultValue={user.bio === null ? "" : user.bio}
          name="bio_input"
          id="user_bio"
          cols={44}
          rows={4}
          maxLength={120}
          style={{ marginBottom: "20px" }}
        />
        <label className="label" htmlFor="user_bio">
          Bio
        </label>
      </div>

      <div className="card-container" style={{ marginBottom: "10px" }}>
        {/* HAS GITHUB CONNECTED */}
        {user.github_account_id !== null && (
          <>
            <button
              type="button"
              className="btn"
              onClick={async () => {
                try {
                  const req = await fetch("/api/disconnect-github", {
                    method: "POST",
                  });
                  const res = await req.json();
                  alert(res.message);
                  if (req.ok) {
                    window.location.href = "/profile/edit";
                  }
                } catch (err) {
                  alert("Error while disconnecting GitHub account");
                }
              }}
            >
              Disconnect GitHub
            </button>
          </>
        )}
        {/* DOES NOT HAVE GITHUB CONNECTED */}
        {user.github_account_id === null && (
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`}
            title="Authorize Stack to connect to your GitHub Account"
            className="btn"
          >
            Connect Github
          </a>
        )}
      </div>

      <div className="card-container">
        {!loading && (
          <button className="btn-confirm" type="submit">
            Update Profile
          </button>
        )}
        {loading && <div className="lds-dual-ring"></div>}
      </div>

      <div
        className="card-container"
        style={{
          marginTop: "10px",
          paddingBottom: "0px",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          className="card-container"
          style={{ margin: "0px", marginBottom: "0px" }}
        >
          <button
            className="nav-element"
            type="button"
            style={{
              width: "fit-content",
              background: "none",
              border: "0px",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inter",
            }}
            onClick={async () => {
              try {
                const req = await fetch("/api/signout", {
                  method: "POST",
                });
                if (req.ok) {
                  window.location.assign("/");
                } else {
                  alert("Error while sigining out");
                }
              } catch (err) {
                alert("Error while sigining out");
              }
            }}
          >
            Sign Out
          </button>
        </div>

        <div className="card-container" style={{ margin: "0px" }}>
          <button
            className="nav-element"
            type="button"
            style={{
              width: "fit-content",
              background: "none",
              border: "0px",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inter",
            }}
            onClick={async () => {
              const c1 = confirm(
                "Are you sure you want to delete your Stack account?"
              );
              if (c1) {
                const c2 = confirm(
                  "This action is irreversible. Would you like to continue?"
                );
                if (c2) {
                  const c3 = confirm(
                    "Account deletion is permanant. In order to use Stack again you will need to create a new account. I understand, delete my account."
                  );

                  if (c3) {
                    try {
                      const req = await fetch("/api/delete-account");
                      if (req.ok) {
                        alert(
                          "Account and all associated stacks have been successfully deleted."
                        );

                        //this expression will remove cookie from browser
                        document.cookie =
                          "a_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        window.location.assign("/");
                      }
                    } catch (e) {
                      console.log(e);
                      alert(
                        "An error occurred while attempting to delete your account."
                      );
                    }
                  }
                }
              }
            }}
          >
            Delete Account
            <p style={{ fontSize: "12px", lineHeight: "1" }}>
              Account deletion is irreversible.
            </p>
          </button>
        </div>
      </div>
    </form>
  );
}
