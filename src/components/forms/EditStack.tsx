/* eslint-disable @next/next/no-img-element */
"use client";

import { EditStackTechCheckboxs, RepoSelectList } from "@/functions";
import { Stack } from "@/models/stacks";
import { useRef, useState } from "react";
import RepoSelect from "../../components/GitHubRepoSelect";
import StackCheckboxs from "../../components/EditStackTechCheckboxs";

export default function Edit({
  stackDetails,
  stackID,
  repoSelectData,
  editStackCheckboxs,
}: {
  stackDetails: Stack;
  stackID: string;
  repoSelectData:
  | "error"
  | RepoSelectList[]
  | "must_connect_github_account"
  | null;
  editStackCheckboxs: EditStackTechCheckboxs;
}) {
  const [iconImgSrc, setIconImgSrc] = useState(stackDetails.icon_url);
  const [thumbnailImgSrc, setThumbnailImgSrc] = useState(
    stackDetails.thumbnail_url
  );
  const [loading, setLoading] = useState(false);
  const [deleteStackLoading, setDeleteStackLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
          const f = new FormData(formRef.current!);
          f.append("stack_id", stackID);
          const req = await fetch(`/api/update-stack`, {
            method: "POST",
            body: f,
          });
          if (req.ok) {
            window.location.href = `/stack/${stackID}`;
          } else {
            const res = await req.json();
            alert(res.message);
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      }}
    >
      <div className="card-container">
        <div className="create-content">
          <div className="input-group">
            <input
              className="input"
              type="text"
              id="app_title"
              name="stack_name"
              defaultValue={stackDetails.name}
              required
            />
            <label className="label" htmlFor="app_title">
              *Title
            </label>
          </div>

          <div className="input-group">
            <textarea
              className="input"
              name="stack_description"
              cols={44}
              rows={10}
              required
              defaultValue={stackDetails.description}
              id="app_description"
              style={{ marginBottom: "10px" }}
            />
            <label className="label" htmlFor="app_description">
              *Description
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="subheading" style={{ padding: "0" }} htmlFor="stack_icon_input">
              *Icon
            </label>
            <img
              src={iconImgSrc}
              width={100}
              style={{
                display: "block",
                marginBottom: "10px",
                marginTop: "0px",
                height: "12rem",
                width: "12rem",
                borderRadius: "50%",
                overflow: "hidden",
                objectFit: "cover",
                boxShadow: "0px 2px 10px 2px rgba(0, 0, 0, 0.025)"
              }}
            />
            <input
              id="stack_icon_input"
              type="file"
              name="stack_icon"
              accept="image/*"
              onChange={async (e) => {
                const fileInput = e.target;
                if (fileInput.files && fileInput.files[0]) {
                  if (fileInput.files[0].size > 5000000) {
                    alert("File too large");
                  } else {
                    const reader = new FileReader();

                    reader.onload = (r) => {
                      setIconImgSrc(r.target?.result?.toString()!);
                    };

                    reader.readAsDataURL(fileInput.files[0]);
                  }
                }
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label className="subheading" style={{ padding: "0" }} htmlFor="stack_thumbnail_input">
              *Thumbnail
            </label>
            <img
              src={thumbnailImgSrc}
              width={100}
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "240px",
                display: "block",
                marginBottom: "10px",
                paddingBottom: "0px",
                borderRadius: "20px",
                objectFit: "contain",
                boxShadow: "0px 2px 10px 2px rgba(0, 0, 0, 0.025)",
              }}
            />
            <input
              id="stack_thumbnail_input"
              type="file"
              name="stack_thumbnail"
              accept="image/*"
              style={{
                marginBottom: "1rem",
              }}
              onChange={async (e) => {
                const fileInput = e.target;
                if (fileInput.files && fileInput.files[0]) {
                  if (fileInput.files[0].size > 5000000) {
                    alert("File too large");
                  } else {
                    const reader = new FileReader();

                    reader.onload = (r) => {
                      setThumbnailImgSrc(r.target?.result?.toString()!);
                    };

                    reader.readAsDataURL(fileInput.files[0]);
                  }
                }
              }}
            />
          </div>

          <div className="input-group">
            <input
              className="input"
              type="url"
              id="website_url"
              name="website_url"
              defaultValue={stackDetails.website_url!}
            />
            <label className="label" htmlFor="website_url">
              URL
            </label>
          </div>

          {stackDetails.github_repo_name !== null && (
            <span className="subheading">
              <b>{stackDetails.github_repo_name}</b> is currently associated
              with this Stack.
            </span>
          )}
          <RepoSelect repoData={repoSelectData} />

          <StackCheckboxs stackData={editStackCheckboxs} />

          {!deleteStackLoading && (
            <button
              type="button"
              className="btn-delete"
              id="delete_stack_btn"
              style={{
                marginBottom: "40px",
              }}
              onClick={async () => {
                try {
                  setDeleteStackLoading(true);
                  const req = await fetch(
                    "/api/delete-stack?stack_id=" + stackID
                  );
                  if (req.status === 200) {
                    alert("Stack successfully deleted");
                    window.location.assign("/profile");
                  }
                  setDeleteStackLoading(false);
                } catch (e) {
                  console.log(e);
                  alert("Error while deleting stack");
                  setDeleteStackLoading(false);
                }
              }}
            >
              Delete Stack
            </button>
          )}
          {deleteStackLoading && <div className="lds-dual-ring"></div>}

          {!loading && (
            <div
              className="card-container"
              style={{
                paddingBottom: "0px",
                marginBottom: "0px",
              }}
            >
              <button
                className="btn-confirm"
                type="submit"
                style={{
                  marginBottom: "0px",
                }}
              >
                Update Stack
              </button>
            </div>
          )}

          {loading && (
            <div
              className="card-container"
              style={{
                paddingBottom: "0px",
                marginBottom: "0px",
              }}
            >
              <div className="lds-dual-ring"></div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
