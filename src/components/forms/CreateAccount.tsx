"use client";

import { FormEvent, useRef, useState } from "react";

export default function Form() {
  const [formSubmission, setFormSubmission] = useState<
    | {
      status: "success";
      msg: string;
    }
    | {
      status: "error";
      msg: string;
    }
    | null
  >(null);

  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameref = useRef<HTMLInputElement>(null);

  async function FormSubmit(
    event: FormEvent<HTMLFormElement>,
    email: string,
    username: string,
    firstName: string,
    lastName: string
  ) {
    event.preventDefault();
    setFormDisabled(true);
    setLoading(true);
    try {
      const req = await fetch("/api/create-account", {
        method: "POST",
        body: JSON.stringify({
          bio: null,
          created_on: new Date(),
          email: email,
          first_name: firstName,
          github_access_token: null,
          github_account_id: null,
          last_name: lastName,
          liked_stacks: null,
          profile_pic: null,
          profile_pic_filename: null,
          username: username,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await req.json();
      if (data.status === 200) {
        setFormSubmission({ status: "success", msg: data.message });
      } else {
        setFormSubmission({ status: "error", msg: data.message });
      }
      setFormDisabled(false);
      setLoading(false);
    } catch (err) {
      alert(err);
      setFormDisabled(false);
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="card-container"
        style={{
          height: "86vh",
          marginBottom: "0rem",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 className="splash" style={{ marginTop: "0", marginBottom: "1rem" }}>
          Stack
        </h1>

        <div className="card-registration">
          {formSubmission?.status !== "success" && (
            <form
              onSubmit={(e) => {
                FormSubmit(
                  e,
                  emailRef.current!.value,
                  usernameRef.current!.value,
                  fnameRef.current!.value,
                  lnameref.current!.value
                );
              }}
            >
              <div className="input-group">
                <input
                  className="input"
                  type="email"
                  name="email_input"
                  ref={emailRef}
                  disabled={formDisabled}
                  required
                />
                <label className="label" htmlFor="email_input">
                  Email
                </label>
              </div>

              <div className="input-group">
                <input
                  className="input"
                  ref={usernameRef}
                  type="text"
                  name="username_input"
                  disabled={formDisabled}
                  required
                />
                <label className="label" htmlFor="username_input">
                  Username
                </label>
              </div>

              <div className="input-group">
                <input
                  className="input"
                  ref={fnameRef}
                  type="text"
                  name="fname_input"
                  disabled={formDisabled}
                  required
                />
                <label className="label" htmlFor="fname_input">
                  First Name
                </label>
              </div>

              <div className="input-group">
                <input
                  className="input"
                  ref={lnameref}
                  type="text"
                  name="lname_input"
                  disabled={formDisabled}
                  required
                />
                <label className="label" htmlFor="lname_input">
                  Last Name
                </label>
              </div>

              {!loading && (
                <div className="btn-container" style={{ margin: "auto" }}>
                  <button className="btn" type="submit" disabled={formDisabled}>
                    Sign Up
                  </button>
                </div>
              )}
              {loading && (
                <div className="btn-container" style={{ margin: "auto" }}>
                  <div className="lds-dual-ring"></div>
                </div>
              )}
            </form>
          )}
          {formSubmission !== null && (
            <>
              {formSubmission.status === "success" && (
                <div>
                  <p style={{ color: "red", marginTop: "20px", textAlign: "center" }}>{formSubmission.msg}</p>
                </div>
              )}
              {formSubmission.status === "error" && (
                <div>
                  <p style={{ color: "red", marginTop: "20px", textAlign: "center" }}>{formSubmission.msg}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
