import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import profileService from "../services/profileService";

const statusClasses = {
  intake: "bg-slate-100 text-slate-700",
  review: "bg-amber-100 text-amber-700",
  awaiting_payment: "bg-amber-100 text-amber-700",
  paid_verified: "bg-emerald-100 text-emerald-700",
  matching: "bg-indigo-100 text-indigo-700",
  assignment_sent: "bg-blue-100 text-blue-700",
  in_progress: "bg-sky-100 text-sky-700",
  client_review: "bg-violet-100 text-violet-700",
  refund_dispute: "bg-rose-100 text-rose-700",
  completed: "bg-emerald-100 text-emerald-700",
  approved: "bg-emerald-100 text-emerald-700",
  submitted: "bg-violet-100 text-violet-700",
  pending: "bg-amber-100 text-amber-700",
  verified: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
};

const lifecycleSteps = [
  ["intake", "Intake"],
  ["review", "Review"],
  ["awaiting_payment", "Awaiting payment"],
  ["paid_verified", "Payment verified"],
  ["matching", "Matching"],
  ["assignment_sent", "Assignment sent"],
  ["in_progress", "In progress"],
  ["client_review", "Client review"],
  ["completed", "Completed"],
];

const latestSubmissionFor = (assignment) => assignment?.submissions?.[0] || null;
const getActionError = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const first = Object.values(data).flat().find(Boolean);
    if (first) return String(first);
  }
  return error?.message || fallback;
};

const ClientRequestDetailPage = () => {
  const { requestId } = useParams();
  const [requestDetail, setRequestDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseDrafts, setResponseDrafts] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [actionFeedback, setActionFeedback] = useState({});
  const [escalationForm, setEscalationForm] = useState({
    category: "special_request",
    subject: "",
    body: "",
  });
  const [escalationMessage, setEscalationMessage] = useState("");
  const [escalationSubmitting, setEscalationSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await profileService.getClientRequestDetail(requestId);
      setRequestDetail(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [requestId]);

  const handleAction = async (assignment, action) => {
    const latestSubmission = latestSubmissionFor(assignment);
    setActionLoading((prev) => ({ ...prev, [assignment.id]: action }));
    setActionFeedback((prev) => ({ ...prev, [assignment.id]: "" }));
    try {
      await profileService.actOnAssignment(assignment.id, action, {
        response: responseDrafts[assignment.id] || "",
        ...(latestSubmission ? { submission_id: latestSubmission.id } : {}),
      });
      setResponseDrafts((prev) => ({ ...prev, [assignment.id]: "" }));
      await load();
    } catch (error) {
      setActionFeedback((prev) => ({ ...prev, [assignment.id]: getActionError(error) }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [assignment.id]: "" }));
    }
  };

  const handleEscalationSubmit = async (event) => {
    event.preventDefault();
    if (!escalationForm.subject.trim() || !escalationForm.body.trim()) return;
    setEscalationMessage("");
    setEscalationSubmitting(true);
    try {
      const prefixMap = {
        dispute: "Dispute",
        refund: "Refund request",
        special_request: "Special request",
      };
      const thread = await profileService.createThread({
        thread_type: "client_admin",
        subject: `${prefixMap[escalationForm.category]}: ${escalationForm.subject.trim()}`,
        client_request: requestDetail.id,
      });
      await profileService.sendMessage(thread.id, escalationForm.body.trim());
      setEscalationForm({
        category: "special_request",
        subject: "",
        body: "",
      });
      setEscalationMessage("Your request has been sent to the admin team and logged against this project.");
      await load();
    } catch (error) {
      setEscalationMessage(getActionError(error, "Unable to send this request. Please try again."));
    } finally {
      setEscalationSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-workie-blue border-t-transparent" />
      </div>
    );
  }

  if (!requestDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="shell-card max-w-lg p-8 text-center">
          <h1 className="shell-title text-3xl font-bold text-slate-900">Request not found</h1>
        </div>
      </div>
    );
  }

  const activeStepIndex = Math.max(
    lifecycleSteps.findIndex(([value]) => value === requestDetail.status),
    0
  );

  const recentActivity = (requestDetail.conversation_threads || [])
    .flatMap((thread) =>
      (thread.messages || []).map((message) => ({
        ...message,
        threadSubject: thread.subject,
      }))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="shell-card p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Request detail</p>
              <h1 className="shell-title mt-2 text-4xl font-bold text-slate-900">{requestDetail.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{requestDetail.summary}</p>
            </div>
            <div className={`status-pill ${statusClasses[requestDetail.status] || "bg-slate-100 text-slate-700"}`}>
              {requestDetail.status.replaceAll("_", " ")}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {requestDetail.status === "refund_dispute" ? (
              <div className="shell-panel border border-rose-200 bg-rose-50 p-6">
                <h2 className="shell-title text-2xl font-bold text-rose-900">Dispute in review</h2>
                <p className="mt-3 text-sm leading-6 text-rose-800">
                  This request is currently under refund or dispute review. Use the escalation form below to add any
                  clarifying details for the admin team.
                </p>
              </div>
            ) : null}

            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Lifecycle tracker</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {lifecycleSteps.map(([value, label], index) => {
                  const isActive = requestDetail.status === value;
                  const isComplete = index <= activeStepIndex;
                  return (
                    <div
                      key={value}
                      className={`rounded-3xl border p-4 ${
                        isActive
                          ? "border-workie-blue bg-blue-50"
                          : isComplete
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Step {index + 1}
                      </div>
                      <div className="mt-2 text-base font-semibold text-slate-900">{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Assignments</h2>
              <div className="mt-5 space-y-4">
                {requestDetail.assignments?.length ? (
                  requestDetail.assignments.map((assignment) => (
                    <div key={assignment.id} className="rounded-3xl border border-slate-200 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold text-slate-900">{assignment.professional_name}</div>
                          <div className="mt-1 text-sm text-slate-500">{assignment.offer_message || "Assignment active"}</div>
                        </div>
                        <span className={`status-pill ${statusClasses[assignment.status] || "bg-slate-100 text-slate-700"}`}>
                          {assignment.status.replaceAll("_", " ")}
                        </span>
                      </div>

                        {assignment.professional_response ? (
                          <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Latest handoff note: {assignment.professional_response}
                          </p>
                        ) : null}

                        {assignment.submissions?.length ? (
                          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-workie-blue">Submitted work</p>
                            <div className="mt-3 space-y-3">
                              {assignment.submissions.map((submission) => (
                                <div key={submission.id} className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="font-semibold text-slate-900">{submission.title || "Submitted delivery"}</div>
                                    <span className={`status-pill ${statusClasses[submission.status] || "bg-slate-100 text-slate-700"}`}>
                                      {submission.status?.replaceAll("_", " ") || "submitted"}
                                    </span>
                                  </div>
                                  {submission.note ? <p className="mt-2 leading-6">{submission.note}</p> : null}
                                  <div className="mt-3 flex flex-wrap gap-3">
                                    {submission.link_url ? (
                                      <a href={submission.link_url} target="_blank" rel="noreferrer" className="font-semibold text-workie-blue">
                                        Open project link
                                      </a>
                                    ) : null}
                                    {submission.attachment_url ? (
                                      <a href={submission.attachment_url} target="_blank" rel="noreferrer" className="font-semibold text-workie-blue">
                                        Download attachment
                                      </a>
                                    ) : null}
                                  </div>
                                  {submission.review_note ? (
                                    <p className="mt-3 rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                                      Review note: {submission.review_note}
                                    </p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {["client_review", "submitted", "in_progress"].includes(assignment.status) ? (
                          <div className="mt-5 space-y-3">
                          <textarea
                            rows="3"
                            value={responseDrafts[assignment.id] || ""}
                            onChange={(event) =>
                              setResponseDrafts((prev) => ({ ...prev, [assignment.id]: event.target.value }))
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-workie-gold"
                            placeholder="Add context for approval, changes, or disputes..."
                          />
                          <div className="flex flex-wrap gap-3">
                              {latestSubmissionFor(assignment) && ["client_review", "submitted"].includes(assignment.status) ? (
                                <>
                                  <button
                                    type="button"
                                    disabled={Boolean(actionLoading[assignment.id])}
                                    onClick={() => handleAction(assignment, "approve")}
                                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                                  >
                                    {actionLoading[assignment.id] === "approve" ? "Approving..." : "Approve completion"}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={Boolean(actionLoading[assignment.id])}
                                    onClick={() => handleAction(assignment, "request_changes")}
                                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                                  >
                                    {actionLoading[assignment.id] === "request_changes" ? "Sending..." : "Request changes"}
                                  </button>
                                </>
                              ) : null}
                              <button
                                type="button"
                                disabled={Boolean(actionLoading[assignment.id])}
                                onClick={() => handleAction(assignment, "dispute")}
                                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                              {actionLoading[assignment.id] === "dispute" ? "Raising..." : "Raise dispute"}
                            </button>
                          </div>
                          {actionFeedback[assignment.id] ? (
                            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                              {actionFeedback[assignment.id]}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No assignments yet for this request.</p>
                )}
              </div>
            </div>

            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Recent activity</h2>
              <div className="mt-5 space-y-4">
                {recentActivity.length ? (
                  recentActivity.map((message) => (
                    <div key={`${message.threadSubject}-${message.id}`} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="font-semibold text-slate-900">{message.threadSubject}</div>
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{message.sender_name}</div>
                      </div>
                      <div className="mt-3 text-sm leading-6 text-slate-600">{message.body}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No communication logged yet.</p>
                )}
              </div>
            </div>

            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Escalations and special requests</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use this when you need to raise a dispute, request a refund review, or ask for a special adjustment on
                this request.
              </p>
              <form className="mt-5 space-y-4" onSubmit={handleEscalationSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    Type
                    <select
                      value={escalationForm.category}
                      onChange={(event) =>
                        setEscalationForm((prev) => ({ ...prev, category: event.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    >
                      <option value="special_request">Special request</option>
                      <option value="refund">Refund request</option>
                      <option value="dispute">Dispute</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Subject
                    <input
                      value={escalationForm.subject}
                      onChange={(event) =>
                        setEscalationForm((prev) => ({ ...prev, subject: event.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                      placeholder="Short summary for the admin team"
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Details
                  <textarea
                    rows="4"
                    value={escalationForm.body}
                    onChange={(event) =>
                      setEscalationForm((prev) => ({ ...prev, body: event.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    placeholder="Explain what happened, what you need, and any context that will help the admin team resolve it."
                  />
                </label>
                <button
                  type="submit"
                  disabled={escalationSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {escalationSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : null}
                  {escalationSubmitting ? "Sending..." : "Send to admin team"}
                </button>
                {escalationMessage ? (
                  <div className={`text-sm ${/unable|error|failed/i.test(escalationMessage) ? "text-rose-700" : "text-emerald-700"}`}>
                    {escalationMessage}
                  </div>
                ) : null}
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Payment records</h2>
              <div className="mt-5 space-y-3">
                {requestDetail.payment_records?.length ? (
                  requestDetail.payment_records.map((payment) => (
                    <div key={payment.id} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-slate-900">{payment.method}</div>
                        <span className={`status-pill ${statusClasses[payment.status] || "bg-slate-100 text-slate-700"}`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-500">{payment.amount}</div>
                      {payment.reference ? (
                        <div className="mt-1 text-xs text-slate-400">Reference: {payment.reference}</div>
                      ) : null}
                      {payment.evidence ? (
                        <a
                          href={payment.evidence}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-workie-blue"
                        >
                          View payment evidence
                        </a>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No payment records submitted yet.</p>
                )}
              </div>
            </div>

            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Brief details</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Category:</span>{" "}
                  {requestDetail.expertise_category?.name || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Timeline:</span>{" "}
                  {requestDetail.desired_timeline || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Budget:</span>{" "}
                  {requestDetail.budget || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Admin notes:</span>{" "}
                  {requestDetail.admin_notes || "No admin notes shared yet."}
                </p>
              </div>
              <div className="mt-5">
                <Link to="/dashboard" className="text-sm font-semibold text-workie-blue">
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRequestDetailPage;
