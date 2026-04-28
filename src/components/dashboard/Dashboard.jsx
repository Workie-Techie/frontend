import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import profileService from "../../services/profileService";

const statusClasses = {
  draft: "bg-slate-100 text-slate-600",
  pending_review: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  approved: "bg-blue-100 text-blue-700",
  paused: "bg-slate-100 text-slate-500",
  intake: "bg-slate-100 text-slate-700",
  review: "bg-amber-100 text-amber-700",
  awaiting_payment: "bg-amber-100 text-amber-700",
  paid_verified: "bg-emerald-100 text-emerald-700",
  matching: "bg-indigo-100 text-indigo-700",
  assignment_sent: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-rose-100 text-rose-700",
  in_progress: "bg-sky-100 text-sky-700",
  client_review: "bg-violet-100 text-violet-700",
  submitted: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
  verified: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-rose-100 text-rose-700",
  refund_dispute: "bg-rose-100 text-rose-700",
};

const Dashboard = () => {
  const { user, profile, logout, fetchProfile } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [threads, setThreads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [assignmentResponseDrafts, setAssignmentResponseDrafts] = useState({});
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportRequestId, setSupportRequestId] = useState("");
  const [supportFeedback, setSupportFeedback] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    client_request: "",
    method: "manual",
    amount: "",
    reference: "",
    notes: "",
    evidence: null,
  });

  const refreshData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const tasks = [
        fetchProfile(),
        profileService.getAssignments().catch(() => []),
        profileService.getThreads().catch(() => []),
        profileService.getPayments().catch(() => []),
      ];
      if (user.is_client) {
        tasks.push(profileService.getClientRequests().catch(() => []));
      } else {
        tasks.push(profileService.getBankAccounts().catch(() => []));
      }

      const [profileData, assignmentData, threadData, paymentData, roleData] = await Promise.all(tasks);
      setAssignments(assignmentData);
      setThreads(threadData);
      setPayments(paymentData);
      if (user.is_client) {
        setRequests(roleData);
      } else {
        setBankAccounts(roleData);
      }
      return profileData;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const roleHeading = user?.is_client ? "Client operations" : "Professional hub";
  const roleSummary = user?.is_client
    ? "Track structured project requests, payments, approvals, and conversations with the WorkieTechie team."
    : "Stay ready for assignments, manage your portfolio and payout details, and respond quickly when the admin team matches you to a project.";

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = ["name", "title", "bio", "expertise_category", "profile_image"];
    const completed = fields.filter((field) => Boolean(profile[field])).length;
    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const clientMetrics = useMemo(() => {
    if (!user?.is_client) return null;
    return {
      activeRequests: requests.filter((request) => !["completed", "archived"].includes(request.status)).length,
      pendingPayments: payments.filter((payment) => payment.status === "pending").length,
      openThreads: threads.filter((thread) => !thread.is_closed).length,
    };
  }, [user, requests, payments, threads]);

  const handleAssignmentAction = async (assignmentId, action) => {
    const responseText = assignmentResponseDrafts[assignmentId] || "";
    await profileService.actOnAssignment(assignmentId, action, responseText);
    if (action === "submit") {
      setAssignmentResponseDrafts((prev) => ({ ...prev, [assignmentId]: "" }));
    }
    refreshData();
  };

  const handleSendMessage = async (threadId) => {
    const body = replyDrafts[threadId];
    if (!body?.trim()) return;
    await profileService.sendMessage(threadId, body.trim());
    setReplyDrafts((prev) => ({ ...prev, [threadId]: "" }));
    refreshData();
  };

  const handleCreateSupportThread = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) return;
    setSupportFeedback("");
    const threadType = user?.is_client ? "client_admin" : "professional_admin";
    const thread = await profileService.createThread({
      thread_type: threadType,
      subject: supportSubject.trim(),
      ...(user?.is_client && supportRequestId ? { client_request: Number(supportRequestId) } : {}),
    });
    await profileService.sendMessage(thread.id, supportMessage.trim());
    setSupportSubject("");
    setSupportMessage("");
    setSupportRequestId("");
    setSupportFeedback("Support thread opened successfully.");
    refreshData();
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!paymentForm.client_request || !paymentForm.amount) return;
    setPaymentMessage("");
    const payload = new FormData();
    payload.append("client_request", Number(paymentForm.client_request));
    payload.append("method", paymentForm.method);
    payload.append("amount", Number(paymentForm.amount));
    payload.append("reference", paymentForm.reference);
    payload.append("notes", paymentForm.notes);
    if (paymentForm.evidence) {
      payload.append("evidence", paymentForm.evidence);
    }
    await profileService.createPayment(payload);
    setPaymentForm({
      client_request: "",
      method: "manual",
      amount: "",
      reference: "",
      notes: "",
      evidence: null,
    });
    const paymentEvidenceInput = document.getElementById("payment-evidence-input");
    if (paymentEvidenceInput) {
      paymentEvidenceInput.value = "";
    }
    setPaymentMessage("Payment record submitted. The admin team will verify it and update your request.");
    refreshData();
  };

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-workie-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="shell-card bg-gradient-to-br from-[#12354b] via-workie-blue to-workie-blue-light p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className={`status-pill ${statusClasses[profile?.profile_status] || "bg-white/15 text-white"}`}>
                {profile?.profile_status?.replaceAll("_", " ") || "Profile"}
              </span>
              <h1 className="shell-title mt-4 text-4xl font-bold">
                {roleHeading}, {profile?.name || user?.email}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-100">{roleSummary}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/profile"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-workie-blue shadow-lg transition hover:bg-slate-100"
              >
                Update profile
              </Link>
              {user?.is_client ? (
                <Link
                  to="/client-request"
                  className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  New project request
                </Link>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {user?.is_client && clientMetrics ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="shell-panel p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-workie-blue">Requests</div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{clientMetrics.activeRequests}</div>
              <div className="mt-1 text-sm text-slate-500">Active and in-flight requests</div>
            </div>
            <div className="shell-panel p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-workie-blue">Payments</div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{clientMetrics.pendingPayments}</div>
              <div className="mt-1 text-sm text-slate-500">Payment records awaiting verification</div>
            </div>
            <div className="shell-panel p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-workie-blue">Support</div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{clientMetrics.openThreads}</div>
              <div className="mt-1 text-sm text-slate-500">Open conversations with the admin team</div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="shell-panel p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Profile readiness</p>
                  <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">{profileCompletion}% complete</h2>
                </div>
                <div className="text-sm font-semibold text-slate-600">{profile?.expertise_category?.name || "No expertise set"}</div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-workie-gold to-workie-blue-light"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Keep your profile current so the admin team can qualify you quickly and share your portfolio confidently with clients.
              </p>
            </div>

            {user?.is_client ? (
              <div className="shell-panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Project requests</p>
                    <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Your active requests</h2>
                  </div>
                  <Link to="/client-request" className="text-sm font-semibold text-workie-gold">
                    Create new
                  </Link>
                </div>
                <div className="mt-6 space-y-4">
                  {requests.length ? (
                    requests.map((request) => (
                      <div key={request.id} className="rounded-3xl border border-slate-200 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <Link
                              to={`/client-request/${request.id}`}
                              className="text-lg font-semibold text-slate-900 transition hover:text-workie-blue"
                            >
                              {request.title}
                            </Link>
                            <p className="mt-1 text-sm text-slate-500">{request.expertise_category?.name}</p>
                          </div>
                          <span className={`status-pill ${statusClasses[request.status] || "bg-slate-100 text-slate-700"}`}>
                            {request.status.replaceAll("_", " ")}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">{request.summary}</p>
                        <div className="mt-4">
                          <Link to={`/client-request/${request.id}`} className="text-sm font-semibold text-workie-blue">
                            View full workflow
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No project requests yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="shell-panel p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Assignments</p>
                <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Admin-matched opportunities</h2>
                <div className="mt-6 space-y-4">
                  {assignments.length ? (
                    assignments.map((assignment) => (
                      <div key={assignment.id} className="rounded-3xl border border-slate-200 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{assignment.client_request.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {assignment.client_request.expertise_category?.name || "Curated assignment"}
                            </p>
                          </div>
                          <span className={`status-pill ${statusClasses[assignment.status] || "bg-slate-100 text-slate-700"}`}>
                            {assignment.status.replaceAll("_", " ")}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {assignment.offer_message || assignment.client_request.summary}
                        </p>
                        {assignment.status === "assignment_sent" ? (
                          <div className="mt-5 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleAssignmentAction(assignment.id, "accept")}
                              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAssignmentAction(assignment.id, "decline")}
                              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                            >
                              Decline
                            </button>
                          </div>
                        ) : null}
                        {["accepted", "in_progress"].includes(assignment.status) ? (
                          <div className="mt-5 space-y-3">
                            <textarea
                              rows="3"
                              value={assignmentResponseDrafts[assignment.id] || ""}
                              onChange={(event) =>
                                setAssignmentResponseDrafts((prev) => ({
                                  ...prev,
                                  [assignment.id]: event.target.value,
                                }))
                              }
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-workie-gold"
                              placeholder="Add a handoff note for admin/client review..."
                            />
                            <button
                              type="button"
                              onClick={() => handleAssignmentAction(assignment.id, "submit")}
                              className="rounded-full bg-workie-blue px-4 py-2 text-sm font-semibold text-white"
                            >
                              Submit for review
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No assignments yet. Stay ready and keep your profile sharp.</p>
                  )}
                </div>
              </div>
            )}

            <div className="shell-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Communication</p>
              <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Threaded inbox</h2>
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Start a new conversation with the admin team</p>
                <div className="mt-3 space-y-3">
                  {user?.is_client && requests.length ? (
                    <select
                      value={supportRequestId}
                      onChange={(event) => setSupportRequestId(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                    >
                      <option value="">Attach to a request (optional)</option>
                      {requests.map((request) => (
                        <option key={request.id} value={request.id}>
                          {request.title}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  <input
                    value={supportSubject}
                    onChange={(event) => setSupportSubject(event.target.value)}
                    placeholder="Subject"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                  />
                  <textarea
                    value={supportMessage}
                    onChange={(event) => setSupportMessage(event.target.value)}
                    rows="3"
                    placeholder={
                      user?.is_client
                        ? "Describe your request, approval, refund, or concern..."
                        : "Ask about assignments, delivery, or payout support..."
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                  />
                  <button
                    type="button"
                    onClick={handleCreateSupportThread}
                    className="rounded-2xl bg-workie-blue px-4 py-3 text-sm font-semibold text-white"
                  >
                    Open support thread
                  </button>
                  {supportFeedback ? <div className="text-sm text-emerald-700">{supportFeedback}</div> : null}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {threads.length ? (
                  threads.map((thread) => (
                    <div key={thread.id} className="rounded-3xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{thread.subject}</h3>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                            {thread.thread_type.replaceAll("_", " ")}
                          </p>
                        </div>
                        {thread.is_closed ? (
                          <span className="status-pill bg-slate-100 text-slate-500">Closed</span>
                        ) : (
                          <span className="status-pill bg-emerald-100 text-emerald-700">Open</span>
                        )}
                      </div>

                      <div className="mt-4 space-y-3">
                        {thread.messages.slice(-3).map((message) => (
                          <div key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            <div className="mb-1 font-semibold text-slate-900">{message.sender_name}</div>
                            <div>{message.body}</div>
                          </div>
                        ))}
                      </div>

                      {!thread.is_closed ? (
                        <div className="mt-4 flex gap-3">
                          <input
                            value={replyDrafts[thread.id] || ""}
                            onChange={(event) =>
                              setReplyDrafts((prev) => ({ ...prev, [thread.id]: event.target.value }))
                            }
                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                            placeholder="Reply to the admin team..."
                          />
                          <button
                            type="button"
                            onClick={() => handleSendMessage(thread.id)}
                            className="rounded-2xl bg-workie-blue px-4 py-3 text-sm font-semibold text-white"
                          >
                            Send
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No conversations yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="shell-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Payments</p>
              <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">
                {user?.is_client ? "Payment history" : "Payout readiness"}
              </h2>
              {user?.is_client ? (
                <form className="mt-5 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4" onSubmit={handlePaymentSubmit}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={paymentForm.client_request}
                      onChange={(event) => setPaymentForm((prev) => ({ ...prev, client_request: event.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                    >
                      <option value="">Select request</option>
                      {requests.map((request) => (
                        <option key={request.id} value={request.id}>
                          {request.title}
                        </option>
                      ))}
                    </select>
                    <select
                      value={paymentForm.method}
                      onChange={(event) => setPaymentForm((prev) => ({ ...prev, method: event.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                    >
                      <option value="manual">Manual transfer</option>
                      <option value="paystack">Paystack</option>
                    </select>
                    <input
                      value={paymentForm.amount}
                      onChange={(event) => setPaymentForm((prev) => ({ ...prev, amount: event.target.value }))}
                      placeholder="Amount"
                      type="number"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                    />
                    <input
                      value={paymentForm.reference}
                      onChange={(event) => setPaymentForm((prev) => ({ ...prev, reference: event.target.value }))}
                      placeholder="Reference"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                    />
                  </div>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(event) => setPaymentForm((prev) => ({ ...prev, notes: event.target.value }))}
                    rows="3"
                    placeholder="Anything the admin team should know about this payment?"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold"
                  />
                  <label className="block text-sm font-medium text-slate-700">
                    Evidence or receipt
                    <input
                      id="payment-evidence-input"
                      type="file"
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          evidence: event.target.files?.[0] || null,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <button type="submit" className="rounded-2xl bg-workie-blue px-4 py-3 text-sm font-semibold text-white">
                    Submit payment record
                  </button>
                  {paymentMessage ? <div className="text-sm text-emerald-700">{paymentMessage}</div> : null}
                </form>
              ) : null}
              <div className="mt-6 space-y-4">
                {user?.is_client ? (
                  payments.length ? (
                    payments.map((payment) => (
                      <div key={payment.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-slate-900">
                            {requests.find((request) => request.id === payment.client_request)?.title || `Request #${payment.client_request}`}
                          </div>
                          <span className={`status-pill ${statusClasses[payment.status] || "bg-slate-100 text-slate-700"}`}>
                            {payment.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{`${payment.method} - ${payment.amount}`}</p>
                        {payment.reference ? <p className="mt-1 text-xs text-slate-400">Reference: {payment.reference}</p> : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No payment records yet.</p>
                  )
                ) : bankAccounts.length ? (
                  bankAccounts.map((account) => (
                    <div key={account.id} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{account.bank_name || "Bank account"}</div>
                          <p className="text-sm text-slate-500">{account.account_number}</p>
                        </div>
                        <span className={`status-pill ${statusClasses[account.status] || "bg-slate-100 text-slate-700"}`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No verified bank account yet. Add one from your profile page.</p>
                )}
              </div>
            </div>

            {!user?.is_client ? (
              <div className="shell-panel p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Future-ready</p>
                <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Resources</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This space is reserved for future free and paid learning resources so professionals can keep upskilling between assignments.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
