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

const ClientRequestDetailPage = () => {
  const { requestId } = useParams();
  const [requestDetail, setRequestDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseDrafts, setResponseDrafts] = useState({});
  const [escalationForm, setEscalationForm] = useState({
    category: "special_request",
    subject: "",
    body: "",
  });
  const [escalationMessage, setEscalationMessage] = useState("");

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

  const handleAction = async (assignmentId, action) => {
    await profileService.actOnAssignment(assignmentId, action, responseDrafts[assignmentId] || "");
    await load();
  };

  const handleEscalationSubmit = async (event) => {
    event.preventDefault();
    if (!escalationForm.subject.trim() || !escalationForm.body.trim()) return;
    setEscalationMessage("");
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

                      {["client_review", "submitted", "accepted", "in_progress"].includes(assignment.status) ? (
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
                            <button
                              type="button"
                              onClick={() => handleAction(assignment.id, "approve")}
                              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                              Approve completion
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAction(assignment.id, "request_changes")}
                              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                            >
                              Request changes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAction(assignment.id, "dispute")}
                              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                            >
                              Raise dispute
                            </button>
                          </div>
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
                  className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold text-white"
                >
                  Send to admin team
                </button>
                {escalationMessage ? <div className="text-sm text-emerald-700">{escalationMessage}</div> : null}
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
