import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import logoImage from "../../assets/logo2.png";
import useAuth from "../../hooks/useAuth";
import staffService from "../../services/staffService";

const navItems = [
  ["overview", "Overview"],
  ["requests", "Requests"],
  ["professionals", "Professionals"],
  ["clients", "Clients"],
  ["matching", "Matching"],
  ["assignments", "Assignments"],
  ["conversations", "Conversations"],
  ["payments", "Payments"],
  ["payouts", "Payouts"],
  ["approvals", "Approvals & Disputes"],
  ["forms", "Forms & Skills"],
  ["browse", "Browse Talent"],
  ["content", "Content & Settings"],
  ["audit", "Audit Log"],
].map(([id, label]) => ({ id, label, path: id === "overview" ? "/staff" : `/staff/${id}` }));

const requestStatuses = [
  "intake",
  "review",
  "awaiting_payment",
  "paid_verified",
  "matching",
  "assignment_sent",
  "in_progress",
  "client_review",
  "approved",
  "refund_dispute",
  "completed",
  "archived",
];

const assignmentStatuses = [
  "assignment_sent",
  "accepted",
  "declined",
  "in_progress",
  "submitted",
  "client_review",
  "approved",
  "refund_dispute",
  "completed",
  "archived",
];

const profileStatuses = ["draft", "pending_review", "approved", "active", "paused"];

const statusClasses = {
  pending_review: "bg-amber-100 text-amber-700",
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
  approved: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  verified: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-rose-100 text-rose-700",
  refund_dispute: "bg-rose-100 text-rose-700",
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-slate-100 text-slate-600",
  draft: "bg-slate-100 text-slate-600",
};

const pretty = (value) => value?.replaceAll("_", " ") || "pending";

const StatusPill = ({ status }) => (
  <span className={`status-pill capitalize ${statusClasses[status] || "bg-slate-100 text-slate-700"}`}>{pretty(status)}</span>
);

const Panel = ({ children, className = "" }) => <div className={`shell-panel p-5 ${className}`}>{children}</div>;

const PageTitle = ({ eyebrow, title, body, action }) => (
  <div className="mb-6 flex flex-col justify-between gap-4 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur lg:flex-row lg:items-end">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">{eyebrow}</p>
      <h1 className="shell-title mt-2 text-3xl font-bold text-slate-950">{title}</h1>
      {body ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{body}</p> : null}
    </div>
    {action}
  </div>
);

const TextInput = ({ label, ...props }) => (
  <label className="block text-sm font-semibold text-slate-700">
    {label}
    <input {...props} className={`mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold ${props.className || ""}`} />
  </label>
);

const SelectInput = ({ label, children, ...props }) => (
  <label className="block text-sm font-semibold text-slate-700">
    {label}
    <select {...props} className={`mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold ${props.className || ""}`}>
      {children}
    </select>
  </label>
);

const TextArea = ({ label, ...props }) => (
  <label className="block text-sm font-semibold text-slate-700">
    {label}
    <textarea {...props} className={`mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold ${props.className || ""}`} />
  </label>
);

const StaffConsole = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [overview, setOverview] = useState(null);
  const [requests, setRequests] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [threads, setThreads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [siteContent, setSiteContent] = useState([]);
  const [settings, setSettings] = useState([]);
  const [resources, setResources] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [actionNotes, setActionNotes] = useState("");
  const [matchingForm, setMatchingForm] = useState({ client_request: "", professional: "", offer_message: "", due_date: "" });
  const [payoutForm, setPayoutForm] = useState({ assignment: "", bank_account: "", amount: "", reference: "", notes: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [specializationForm, setSpecializationForm] = useState({ category: "", name: "", description: "" });
  const [questionSetForm, setQuestionSetForm] = useState({ name: "", audience: "professional", is_general: false, category_id: "", description: "" });
  const [questionForm, setQuestionForm] = useState({ question_set: "", text: "", question_type: "text", is_required: false, choices_text: "" });
  const [resourceForm, setResourceForm] = useState({ title: "", description: "", expertise_category: "", resource_type: "free", url: "" });

  const section = location.pathname.replace("/staff", "").split("/").filter(Boolean)[0] || "overview";
  const professionals = useMemo(() => profiles.filter((profile) => profile.user?.is_freelancer), [profiles]);
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const pendingRequests = requests.filter((item) => ["intake", "review", "awaiting_payment"].includes(item.status));

  const loadAll = async () => {
    setLoading(true);
    try {
      const [
        overviewData,
        requestData,
        profileData,
        clientData,
        assignmentData,
        threadData,
        paymentData,
        payoutData,
        categoryData,
        specializationData,
        questionSetData,
        questionData,
        contentData,
        settingData,
        resourceData,
        auditData,
        disputeData,
        submissionData,
        portfolioData,
      ] = await Promise.all([
        staffService.getOverview(),
        staffService.getRequests(),
        staffService.getProfiles(),
        staffService.getClients(),
        staffService.getAssignments(),
        staffService.getThreads(),
        staffService.getPayments(),
        staffService.getPayouts(),
        staffService.getCategories(),
        staffService.getSpecializations(),
        staffService.getQuestionSets(),
        staffService.getQuestions(),
        staffService.getSiteContent(),
        staffService.getSettings(),
        staffService.getResources(),
        staffService.getAuditLogs(),
        staffService.getDisputes(),
        staffService.getSubmissions(),
        staffService.getPortfolioItems(),
      ]);
      setOverview(overviewData);
      setRequests(requestData);
      setProfiles(profileData);
      setClients(clientData);
      setAssignments(assignmentData);
      setThreads(threadData);
      setPayments(paymentData);
      setPayouts(payoutData);
      setCategories(categoryData);
      setSpecializations(specializationData);
      setQuestionSets(questionSetData);
      setQuestions(questionData);
      setSiteContent(contentData);
      setSettings(settingData);
      setResources(resourceData);
      setAuditLogs(auditData);
      setDisputes(disputeData);
      setSubmissions(submissionData);
      setPortfolioItems(portfolioData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const runAction = async (fn, success = "Updated successfully.") => {
    setMessage("");
    await fn();
    setMessage(success);
    await loadAll();
  };

  const renderOverview = () => (
    <>
      <PageTitle eyebrow="Staff console" title="Operations overview" body="A high-signal snapshot of requests, matching, payments, conversations, and talent readiness." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(overview?.metrics || {}).map(([key, value]) => (
          <Panel key={key}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-workie-blue">{pretty(key)}</p>
            <div className="mt-3 text-4xl font-bold text-slate-950">{value}</div>
          </Panel>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Priority requests</h2>
          <div className="mt-4 space-y-3">
            {pendingRequests.slice(0, 6).map((item) => (
              <button key={item.id} onClick={() => setSelectedRequest(item)} className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-workie-gold">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.client?.email || item.expertise_category?.name}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Pending payments</h2>
          <div className="mt-4 space-y-3">
            {pendingPayments.slice(0, 6).map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{payment.request_title}</p>
                    <p className="mt-1 text-xs text-slate-500">{payment.method} payment • {payment.amount}</p>
                  </div>
                  <button onClick={() => runAction(() => staffService.verifyPayment(payment.id, { admin_verification_notes: actionNotes }), "Payment verified.")} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold !text-white">Verify</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );

  const renderRequests = () => (
    <>
      <PageTitle eyebrow="Client operations" title="Requests" body="Review briefs, qualify work, update lifecycle status, and open client threads." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Panel className="space-y-3">
          {requests.map((item) => (
            <button key={item.id} onClick={() => setSelectedRequest(item)} className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-workie-gold">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.client?.email} • {item.expertise_category?.name || "No category"}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.summary}</p>
            </button>
          ))}
        </Panel>
        <Panel>
          {selectedRequest ? (
            <div>
              <h2 className="shell-title text-2xl font-bold text-slate-900">{selectedRequest.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selectedRequest.summary}</p>
              <div className="mt-5 grid gap-3">
                <SelectInput label="Status" value={selectedRequest.status} onChange={(event) => setSelectedRequest((prev) => ({ ...prev, status: event.target.value }))}>
                  {requestStatuses.map((status) => <option key={status} value={status}>{pretty(status)}</option>)}
                </SelectInput>
                <TextArea label="Admin notes" rows="4" value={selectedRequest.admin_notes || ""} onChange={(event) => setSelectedRequest((prev) => ({ ...prev, admin_notes: event.target.value }))} />
                <button onClick={() => runAction(() => staffService.updateRequestStatus(selectedRequest.id, { status: selectedRequest.status, admin_notes: selectedRequest.admin_notes || "" }), "Request status updated.")} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Save status</button>
                <button onClick={() => runAction(() => staffService.ensureRequestThread(selectedRequest.id), "Client thread is ready.")} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Ensure client thread</button>
              </div>
              <div className="mt-6">
                <h3 className="font-bold text-slate-900">Submitted answers</h3>
                <div className="mt-3 space-y-3">
                  {(selectedRequest.question_answers || []).map((answer) => (
                    <div key={answer.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                      <p className="font-semibold text-slate-900">{answer.question?.text}</p>
                      <p className="mt-1 text-slate-600">{answer.value || "No answer"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : <p className="text-sm text-slate-500">Select a request to review details.</p>}
        </Panel>
      </div>
    </>
  );

  const renderProfiles = () => (
    <>
      <PageTitle eyebrow="Talent pool" title="Professionals" body="Review professional readiness, onboarding answers, browse visibility, and internal notes." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Panel className="space-y-3">
          {professionals.map((profile) => (
            <button key={profile.id} onClick={() => setSelectedProfile(profile)} className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-workie-gold">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{profile.name || profile.user?.email}</h3>
                  <p className="mt-1 text-sm text-slate-500">{profile.title || profile.expertise_category_name || "No title"}</p>
                </div>
                <StatusPill status={profile.profile_status} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{profile.is_browse_visible ? "Visible in Browse Talent" : "Hidden from Browse Talent"}</p>
            </button>
          ))}
        </Panel>
        <Panel>
          {selectedProfile ? (
            <div>
              <h2 className="shell-title text-2xl font-bold text-slate-900">{selectedProfile.name || selectedProfile.user?.email}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selectedProfile.bio || "No bio yet."}</p>
              <div className="mt-5 grid gap-3">
                <SelectInput label="Profile status" value={selectedProfile.profile_status} onChange={(event) => setSelectedProfile((prev) => ({ ...prev, profile_status: event.target.value }))}>
                  {profileStatuses.map((status) => <option key={status} value={status}>{pretty(status)}</option>)}
                </SelectInput>
                <TextArea label="Browse summary" rows="3" value={selectedProfile.browse_summary || ""} onChange={(event) => setSelectedProfile((prev) => ({ ...prev, browse_summary: event.target.value }))} />
                <TextArea label="Internal notes" rows="3" value={selectedProfile.internal_admin_notes || ""} onChange={(event) => setSelectedProfile((prev) => ({ ...prev, internal_admin_notes: event.target.value }))} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={Boolean(selectedProfile.is_browse_visible)} onChange={(event) => setSelectedProfile((prev) => ({ ...prev, is_browse_visible: event.target.checked }))} />
                    Browse visible
                  </label>
                  <label className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={Boolean(selectedProfile.is_browse_featured)} onChange={(event) => setSelectedProfile((prev) => ({ ...prev, is_browse_featured: event.target.checked }))} />
                    Featured
                  </label>
                </div>
                <button onClick={() => runAction(() => staffService.updateProfileBrowse(selectedProfile.id, selectedProfile), "Professional profile updated.")} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Save profile controls</button>
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-slate-900">Onboarding answers</h3>
                {(selectedProfile.question_answers || []).map((answer) => (
                  <div key={answer.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <p className="font-semibold text-slate-900">{answer.question?.text}</p>
                    <p className="mt-1 text-slate-600">{answer.value || "No answer"}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-slate-500">Select a professional to review profile details.</p>}
        </Panel>
      </div>
    </>
  );

  const renderClients = () => (
    <>
      <PageTitle eyebrow="Client accounts" title="Clients" body="See client accounts, profile status, and request volume context." />
      <div className="grid gap-4 lg:grid-cols-2">
        {clients.map((client) => (
          <Panel key={client.id}>
            <p className="font-bold text-slate-900">{client.profile_name || client.email}</p>
            <p className="mt-1 text-sm text-slate-500">{client.email}</p>
            <div className="mt-3"><StatusPill status={client.profile_status} /></div>
          </Panel>
        ))}
      </div>
    </>
  );

  const renderMatching = () => (
    <>
      <PageTitle eyebrow="Matching" title="Create assignment offer" body="Match a qualified client request with an appropriate professional." />
      <Panel>
        <div className="grid gap-4 lg:grid-cols-2">
          <SelectInput label="Client request" value={matchingForm.client_request} onChange={(event) => setMatchingForm((prev) => ({ ...prev, client_request: event.target.value }))}>
            <option value="">Select request</option>
            {requests.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </SelectInput>
          <SelectInput label="Professional" value={matchingForm.professional} onChange={(event) => setMatchingForm((prev) => ({ ...prev, professional: event.target.value }))}>
            <option value="">Select professional</option>
            {professionals.map((profile) => <option key={profile.id} value={profile.user?.id}>{profile.name || profile.user?.email} • {profile.expertise_category_name || "General"}</option>)}
          </SelectInput>
          <TextInput label="Due date" type="date" value={matchingForm.due_date} onChange={(event) => setMatchingForm((prev) => ({ ...prev, due_date: event.target.value }))} />
          <div />
          <TextArea label="Offer message" rows="5" value={matchingForm.offer_message} onChange={(event) => setMatchingForm((prev) => ({ ...prev, offer_message: event.target.value }))} className="lg:col-span-2" />
        </div>
        <button
          onClick={() => runAction(async () => {
            await staffService.createAssignment({
              ...matchingForm,
              client_request: Number(matchingForm.client_request),
              professional: Number(matchingForm.professional),
              status: "assignment_sent",
            });
            setMatchingForm({ client_request: "", professional: "", offer_message: "", due_date: "" });
          }, "Assignment offer sent.")}
          className="mt-5 rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white"
        >
          Send assignment offer
        </button>
      </Panel>
    </>
  );

  const renderAssignments = () => (
    <>
      <PageTitle eyebrow="Delivery" title="Assignments" body="Track offers, accepted work, submissions, review, disputes, and completion." />
      <div className="space-y-3">
        {assignments.map((assignment) => (
          <Panel key={assignment.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">{assignment.client_request_title || assignment.client_request?.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{assignment.professional_name} • Due {assignment.due_date || "not set"}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={assignment.status} />
                <select value={assignment.status} onChange={(event) => runAction(() => staffService.updateAssignmentStatus(assignment.id, { status: event.target.value }), "Assignment status updated.")} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold">
                  {assignmentStatuses.map((status) => <option key={status} value={status}>{pretty(status)}</option>)}
                </select>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );

  const renderConversations = () => (
    <>
      <PageTitle eyebrow="Inbox" title="Conversations" body="A central staff inbox for client and professional support threads." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel className="max-h-[70vh] space-y-3 overflow-y-auto">
          {threads.map((thread) => (
            <button key={thread.id} onClick={() => setSelectedThread(thread)} className={`w-full rounded-2xl border p-4 text-left ${selectedThread?.id === thread.id ? "border-workie-gold bg-amber-50" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{thread.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">{thread.user?.email} • {pretty(thread.thread_type)}</p>
                </div>
                {thread.unread_count ? <span className="rounded-full bg-workie-blue px-2 py-1 text-xs font-bold !text-white">{thread.unread_count}</span> : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{thread.last_message_preview}</p>
            </button>
          ))}
        </Panel>
        <Panel>
          {selectedThread ? (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="shell-title text-2xl font-bold text-slate-900">{selectedThread.subject}</h2>
                  <p className="mt-1 text-sm text-slate-500">{selectedThread.user?.email}</p>
                </div>
                <button onClick={() => runAction(() => selectedThread.is_closed ? staffService.reopenThread(selectedThread.id) : staffService.closeThread(selectedThread.id), selectedThread.is_closed ? "Thread reopened." : "Thread closed.")} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                  {selectedThread.is_closed ? "Reopen" : "Close"}
                </button>
              </div>
              <div className="mt-5 max-h-96 space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-4">
                {(selectedThread.messages || []).map((message) => (
                  <div key={message.id} className={`rounded-2xl p-3 text-sm ${message.sender_name === "WorkieTechie Staff" ? "bg-workie-blue !text-white" : "bg-white text-slate-700"}`}>
                    <p className="text-xs font-semibold opacity-75">{message.sender_name}</p>
                    <p className="mt-1 leading-6">{message.body}</p>
                  </div>
                ))}
              </div>
              <TextArea label="Reply" rows="4" value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} className="mt-5" />
              <button onClick={() => runAction(async () => { const updated = await staffService.replyThread(selectedThread.id, replyDraft); setSelectedThread(updated); setReplyDraft(""); }, "Reply sent.")} className="mt-3 rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Send reply</button>
            </div>
          ) : <p className="text-sm text-slate-500">Select a conversation thread.</p>}
        </Panel>
      </div>
    </>
  );

  const renderPayments = () => (
    <>
      <PageTitle eyebrow="Finance" title="Payments" body="Verify manual/Paystack payment records and keep request status moving." />
      <TextArea label="Verification notes" rows="2" value={actionNotes} onChange={(event) => setActionNotes(event.target.value)} />
      <div className="mt-4 space-y-3">
        {payments.map((payment) => (
          <Panel key={payment.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">{payment.request_title}</h3>
                <p className="mt-1 text-sm text-slate-500">{payment.client_email} • {payment.method} • {payment.amount}</p>
                {payment.reference ? <p className="mt-1 text-xs text-slate-400">Reference: {payment.reference}</p> : null}
                {payment.evidence ? <a href={payment.evidence} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-workie-blue">View evidence</a> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill status={payment.status} />
                <button onClick={() => runAction(() => staffService.verifyPayment(payment.id, { admin_verification_notes: actionNotes }), "Payment verified.")} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold !text-white">Verify</button>
                <button onClick={() => runAction(() => staffService.declinePayment(payment.id, { admin_verification_notes: actionNotes }), "Payment declined.")} className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold !text-white">Decline</button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );

  const renderPayouts = () => (
    <>
      <PageTitle eyebrow="Finance" title="Payouts" body="Record manual professional payouts after approved completion." />
      <Panel>
        <div className="grid gap-4 lg:grid-cols-2">
          <SelectInput label="Assignment" value={payoutForm.assignment} onChange={(event) => setPayoutForm((prev) => ({ ...prev, assignment: event.target.value }))}>
            <option value="">Select assignment</option>
            {assignments.map((assignment) => <option key={assignment.id} value={assignment.id}>{assignment.client_request_title || assignment.client_request?.title} • {assignment.professional_name}</option>)}
          </SelectInput>
          <TextInput label="Amount" type="number" value={payoutForm.amount} onChange={(event) => setPayoutForm((prev) => ({ ...prev, amount: event.target.value }))} />
          <TextInput label="Reference" value={payoutForm.reference} onChange={(event) => setPayoutForm((prev) => ({ ...prev, reference: event.target.value }))} />
          <TextInput label="Bank account ID" value={payoutForm.bank_account} onChange={(event) => setPayoutForm((prev) => ({ ...prev, bank_account: event.target.value }))} />
          <TextArea label="Notes" rows="3" value={payoutForm.notes} onChange={(event) => setPayoutForm((prev) => ({ ...prev, notes: event.target.value }))} />
        </div>
        <button onClick={() => runAction(async () => { await staffService.createPayout({ ...payoutForm, assignment: Number(payoutForm.assignment), bank_account: payoutForm.bank_account ? Number(payoutForm.bank_account) : null }); setPayoutForm({ assignment: "", bank_account: "", amount: "", reference: "", notes: "" }); }, "Payout recorded.")} className="mt-5 rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Record payout</button>
      </Panel>
      <div className="mt-5 grid gap-3">
        {payouts.map((payout) => <Panel key={payout.id}><p className="font-bold text-slate-900">{payout.assignment_title}</p><p className="mt-1 text-sm text-slate-500">{payout.professional_email} • {payout.amount} • {payout.reference || "No reference"}</p></Panel>)}
      </div>
    </>
  );

  const renderForms = () => (
    <>
      <PageTitle eyebrow="Configuration" title="Forms & Skills" body="Manage the taxonomy and dynamic prompts that drive signup and project intake." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Expertise categories</h2>
          <div className="mt-4 grid gap-3">
            <TextInput label="Name" value={categoryForm.name} onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextArea label="Description" rows="3" value={categoryForm.description} onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))} />
            <button onClick={() => runAction(async () => { await staffService.createCategory(categoryForm); setCategoryForm({ name: "", description: "" }); }, "Category created.")} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Add category</button>
          </div>
          <div className="mt-5 space-y-2">{categories.map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{item.name}</div>)}</div>
        </Panel>
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Specializations</h2>
          <div className="mt-4 grid gap-3">
            <SelectInput label="Category" value={specializationForm.category} onChange={(event) => setSpecializationForm((prev) => ({ ...prev, category: event.target.value }))}>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </SelectInput>
            <TextInput label="Name" value={specializationForm.name} onChange={(event) => setSpecializationForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextArea label="Description" rows="3" value={specializationForm.description} onChange={(event) => setSpecializationForm((prev) => ({ ...prev, description: event.target.value }))} />
            <button onClick={() => runAction(async () => { await staffService.createSpecialization({ ...specializationForm, category: Number(specializationForm.category) }); setSpecializationForm({ category: "", name: "", description: "" }); }, "Specialization created.")} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Add specialization</button>
          </div>
        </Panel>
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Question sets</h2>
          <div className="mt-4 grid gap-3">
            <TextInput label="Name" value={questionSetForm.name} onChange={(event) => setQuestionSetForm((prev) => ({ ...prev, name: event.target.value }))} />
            <SelectInput label="Audience" value={questionSetForm.audience} onChange={(event) => setQuestionSetForm((prev) => ({ ...prev, audience: event.target.value }))}><option value="professional">Professional</option><option value="client">Client</option></SelectInput>
            <SelectInput label="Category" value={questionSetForm.category_id} onChange={(event) => setQuestionSetForm((prev) => ({ ...prev, category_id: event.target.value }))}>
              <option value="">General / no category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </SelectInput>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={questionSetForm.is_general} onChange={(event) => setQuestionSetForm((prev) => ({ ...prev, is_general: event.target.checked }))} /> General form</label>
            <button onClick={() => runAction(async () => { await staffService.createQuestionSet({ ...questionSetForm, category_id: questionSetForm.category_id ? Number(questionSetForm.category_id) : null }); setQuestionSetForm({ name: "", audience: "professional", is_general: false, category_id: "", description: "" }); }, "Question set created.")} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Add question set</button>
          </div>
          <div className="mt-5 space-y-2">{questionSets.slice(0, 8).map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{item.name} • {item.audience}</div>)}</div>
        </Panel>
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Questions shown to users</h2>
          <div className="mt-4 grid gap-3">
            <SelectInput label="Question set" value={questionForm.question_set} onChange={(event) => setQuestionForm((prev) => ({ ...prev, question_set: event.target.value }))}>
              <option value="">Select form</option>
              {questionSets.map((set) => <option key={set.id} value={set.id}>{set.name}</option>)}
            </SelectInput>
            <TextInput label="Question text" value={questionForm.text} onChange={(event) => setQuestionForm((prev) => ({ ...prev, text: event.target.value }))} />
            <SelectInput label="Type" value={questionForm.question_type} onChange={(event) => setQuestionForm((prev) => ({ ...prev, question_type: event.target.value }))}>
              {["text", "long_text", "number", "select", "multi_select", "boolean", "url"].map((type) => <option key={type} value={type}>{pretty(type)}</option>)}
            </SelectInput>
            <TextArea label="Choices, one per line" rows="3" value={questionForm.choices_text} onChange={(event) => setQuestionForm((prev) => ({ ...prev, choices_text: event.target.value }))} />
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={questionForm.is_required} onChange={(event) => setQuestionForm((prev) => ({ ...prev, is_required: event.target.checked }))} /> Required</label>
            <button onClick={() => runAction(async () => { await staffService.createQuestion({ ...questionForm, question_set: Number(questionForm.question_set) }); setQuestionForm({ question_set: "", text: "", question_type: "text", is_required: false, choices_text: "" }); }, "Question created.")} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Add question</button>
          </div>
        </Panel>
      </div>
    </>
  );

  const renderBrowse = () => (
    <>
      <PageTitle eyebrow="Visibility" title="Browse Talent" body="Control what clients can browse and which portfolio samples are public-safe." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Visible profiles</h2>
          <div className="mt-4 space-y-3">
            {professionals.map((profile) => (
              <div key={profile.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="font-bold text-slate-900">{profile.name || profile.user?.email}</p><p className="text-xs text-slate-500">{profile.expertise_category_name}</p></div>
                  <button onClick={() => runAction(() => staffService.updateProfileBrowse(profile.id, { is_browse_visible: !profile.is_browse_visible }), "Browse visibility updated.")} className={`rounded-full px-3 py-2 text-xs font-semibold ${profile.is_browse_visible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{profile.is_browse_visible ? "Visible" : "Hidden"}</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Portfolio item visibility</h2>
          <div className="mt-4 space-y-3">
            {portfolioItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="font-bold text-slate-900">{item.title || `Portfolio item ${item.id}`}</p><p className="line-clamp-1 text-xs text-slate-500">{item.description}</p></div>
                  <button onClick={() => runAction(() => staffService.updatePortfolioItem(item.id, { is_browse_visible: !item.is_browse_visible }), "Portfolio visibility updated.")} className={`rounded-full px-3 py-2 text-xs font-semibold ${item.is_browse_visible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.is_browse_visible ? "Visible" : "Hidden"}</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );

  const renderContent = () => (
    <>
      <PageTitle eyebrow="Customization" title="Content & Settings" body="Edit landing copy, platform settings, payment instructions, and resource placeholders." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-1">
          <h2 className="shell-title text-2xl font-bold text-slate-900">Resources</h2>
          <div className="mt-4 grid gap-3">
            <TextInput label="Title" value={resourceForm.title} onChange={(event) => setResourceForm((prev) => ({ ...prev, title: event.target.value }))} />
            <SelectInput label="Category" value={resourceForm.expertise_category} onChange={(event) => setResourceForm((prev) => ({ ...prev, expertise_category: event.target.value }))}><option value="">No category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</SelectInput>
            <TextInput label="URL" value={resourceForm.url} onChange={(event) => setResourceForm((prev) => ({ ...prev, url: event.target.value }))} />
            <TextArea label="Description" rows="3" value={resourceForm.description} onChange={(event) => setResourceForm((prev) => ({ ...prev, description: event.target.value }))} />
            <button onClick={() => runAction(async () => { await staffService.createResource({ ...resourceForm, expertise_category: resourceForm.expertise_category ? Number(resourceForm.expertise_category) : null }); setResourceForm({ title: "", description: "", expertise_category: "", resource_type: "free", url: "" }); }, "Resource created.")} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Add resource</button>
          </div>
        </Panel>
        <Panel className="xl:col-span-2">
          <h2 className="shell-title text-2xl font-bold text-slate-900">Site content</h2>
          <div className="mt-4 space-y-3">
            {siteContent.map((block) => (
              <div key={block.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-workie-blue">{block.key}</p>
                <TextArea label={block.title} rows="3" defaultValue={block.body} onBlur={(event) => event.target.value !== block.body && runAction(() => staffService.updateSiteContent(block.id, { body: event.target.value }), "Content updated.")} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="xl:col-span-3">
          <h2 className="shell-title text-2xl font-bold text-slate-900">Platform settings</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {settings.map((setting) => (
              <div key={setting.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-bold text-slate-900">{setting.label}</p>
                <TextArea label="JSON value" rows="4" defaultValue={JSON.stringify(setting.value, null, 2)} onBlur={(event) => {
                  try {
                    const value = JSON.parse(event.target.value);
                    runAction(() => staffService.updateSetting(setting.id, { value }), "Setting updated.");
                  } catch {
                    setMessage("Invalid JSON. Setting was not saved.");
                  }
                }} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );

  const renderApprovals = () => (
    <>
      <PageTitle eyebrow="Quality control" title="Approvals & Disputes" body="Review submissions and resolve dispute/refund cases." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Disputes</h2>
          <div className="mt-4 space-y-3">{disputes.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-bold text-slate-900">{item.reason}</p><p className="mt-1 text-sm text-slate-500">{item.request_title}</p><StatusPill status={item.status} /></div>)}</div>
        </Panel>
        <Panel>
          <h2 className="shell-title text-2xl font-bold text-slate-900">Submissions</h2>
          <div className="mt-4 space-y-3">{submissions.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-bold text-slate-900">{item.assignment_title}</p><p className="mt-1 text-sm text-slate-500">{item.submitted_by_email}</p><p className="mt-2 text-sm text-slate-600">{item.note}</p></div>)}</div>
        </Panel>
      </div>
    </>
  );

  const renderAudit = () => (
    <>
      <PageTitle eyebrow="Accountability" title="Audit log" body="Track important staff-side actions across the platform." />
      <div className="space-y-3">
        {auditLogs.map((log) => (
          <Panel key={log.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{log.action}</p>
                <p className="mt-1 text-sm text-slate-500">{log.actor_email || "System"} • {log.target_type} #{log.target_id}</p>
              </div>
              <p className="text-xs text-slate-400">{new Date(log.created_at).toLocaleString()}</p>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );

  const renderSection = () => {
    if (loading) return <div className="mx-auto mt-20 h-14 w-14 animate-spin rounded-full border-4 border-workie-blue border-t-transparent" />;
    if (section === "requests") return renderRequests();
    if (section === "professionals") return renderProfiles();
    if (section === "clients") return renderClients();
    if (section === "matching") return renderMatching();
    if (section === "assignments") return renderAssignments();
    if (section === "conversations") return renderConversations();
    if (section === "payments") return renderPayments();
    if (section === "payouts") return renderPayouts();
    if (section === "forms") return renderForms();
    if (section === "browse") return renderBrowse();
    if (section === "content") return renderContent();
    if (section === "approvals") return renderApprovals();
    if (section === "audit") return renderAudit();
    return renderOverview();
  };

  return (
    <div className="min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col bg-[#0e3148] p-5 !text-white shadow-2xl transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="rounded-2xl bg-white px-3 py-2"><img src={logoImage} alt="WorkieTechie" className="h-9 w-auto" /></Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-full border border-white/15 px-3 py-2 text-sm lg:hidden">X</button>
        </div>
        <div className="mt-7 rounded-3xl bg-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-workie-gold">Staff workspace</p>
          <h2 className="mt-2 truncate text-lg font-bold">{user?.email}</h2>
          <p className="mt-1 text-sm !text-white/65">{user?.is_superuser ? "Superuser fallback enabled" : "Operations staff"}</p>
        </div>
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const active = item.id === section || (item.id === "overview" && section === "overview");
            return (
              <Link key={item.id} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-workie-gold text-[#0e3148]" : "!text-white/80 hover:bg-white/10 hover:!text-white"}`}>
                {item.label}
                {item.id === "conversations" && overview?.metrics?.unread_conversations ? <span className="rounded-full bg-white px-2 py-0.5 text-xs text-workie-blue">{overview.metrics.unread_conversations}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
      <AnimatePresence>
        {sidebarOpen ? <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}
      </AnimatePresence>
      <main className="lg:pl-80">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-workie-blue lg:hidden">
                <span className="absolute h-0.5 w-5 -translate-y-1.5 rounded-full bg-current" />
                <span className="absolute h-0.5 w-5 rounded-full bg-current" />
                <span className="absolute h-0.5 w-5 translate-y-1.5 rounded-full bg-current" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">WorkieTechie admin</p>
                <h1 className="shell-title text-2xl font-bold capitalize text-slate-900">{pretty(section)}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={loadAll} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Refresh</button>
              <button onClick={logout} className="rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Logout</button>
            </div>
          </div>
          {message ? <div className="mx-auto mt-3 max-w-7xl rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div> : null}
        </header>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{renderSection()}</div>
      </main>
    </div>
  );
};

export default StaffConsole;
