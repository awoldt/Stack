import { RepoCommitLogs } from "@/functions";

export default function CommitLogs({
  commitLogs,
  repoName,
}: {
  commitLogs: null | "error" | RepoCommitLogs[] | "too_many_requests";
  repoName: string | null;
}) {
  return (
    <>
      {commitLogs !== null && Array.isArray(commitLogs) && (
        <section>
          <div className="card-container">
            <div className="card">
              {/* <p style={{ opacity: "0.4" }}>GITHUB</p>
              <hr /> */}
              {commitLogs.map((x: RepoCommitLogs) => {
                return (
                  <>
                    <div className="github-container">
                      <div style={{ display: "flex", width: "50%", flexDirection: "column" }}>
                        <p>
                          <b>
                            {x.message.length > 40
                            ? x.message.slice(0, 40) + "..."
                            : x.message}
                            </b>
                        </p>
                        <p style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          opacity: "0.4"
                        }}>
                          Pushed {x.date_commited}
                        </p>
                      </div>
                      <div style={{ display: "flex", width: "50%", justifyContent: "right" }}>
                        <a href={x.url} className="btn">
                          <i className="fa-brands fa-github fa-xl"></i> Commit
                        </a>
                        {/* {x.sha} */}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
