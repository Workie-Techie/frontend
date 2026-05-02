import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import logoImage from "../../assets/logo2.png";
import useAuth from "../../hooks/useAuth";
import profileService from "../../services/profileService";

const getUploadError = (error, fallback = "Upload failed. Please try again.") => {
  const detail = error?.response?.data?.detail || error?.response?.data?.image?.[0] || error?.message;
  return detail || fallback;
};

const makeUploadItem = (file) => ({
  clientId: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
  file,
  name: file.name,
  previewUrl: URL.createObjectURL(file),
  status: "uploading",
  progress: 0,
  asset: null,
  error: "",
});

const hasPendingUploads = (items = []) => items.some((item) => item.status === "uploading");
const successfulAssetIds = (items = []) => items.filter((item) => item.status === "uploaded" && item.asset?.id).map((item) => item.asset.id);

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

const clientNav = [
  { id: "overview", label: "Overview", path: "/dashboard" },
  { id: "requests", label: "Requests", path: "/dashboard/requests" },
  { id: "browse", label: "Browse Talent", path: "/dashboard/browse" },
  { id: "assignments", label: "Assignments", path: "/dashboard/assignments" },
  { id: "messages", label: "Messages", path: "/dashboard/messages" },
  { id: "payments", label: "Payments", path: "/dashboard/payments" },
  { id: "approvals", label: "Approvals & Disputes", path: "/dashboard/approvals" },
  { id: "settings", label: "Settings", path: "/dashboard/settings" },
];

const professionalNav = [
  { id: "overview", label: "Overview", path: "/dashboard" },
  { id: "assignments", label: "Assignments", path: "/dashboard/assignments" },
  { id: "messages", label: "Messages", path: "/dashboard/messages" },
  { id: "portfolio", label: "Portfolio", path: "/dashboard/portfolio" },
  { id: "payouts", label: "Payouts", path: "/dashboard/payouts" },
  { id: "resources", label: "Resources", path: "/dashboard/resources" },
  { id: "settings", label: "Settings", path: "/dashboard/settings" },
];

const formatStatus = (status) => status?.replaceAll("_", " ") || "pending";

const StatusPill = ({ status }) => (
  <span className={`status-pill capitalize ${statusClasses[status] || "bg-slate-100 text-slate-700"}`}>
    {formatStatus(status)}
  </span>
);

const EmptyState = ({ title, body, action }) => (
  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
    <h3 className="shell-title text-2xl font-bold text-slate-900">{title}</h3>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{body}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);

const MetricCard = ({ label, value, body }) => (
  <div className="shell-panel p-5">
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-workie-blue">{label}</div>
    <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
    <div className="mt-1 text-sm text-slate-500">{body}</div>
  </div>
);

const Dashboard = () => {
  const { user, profile, logout, fetchProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [threads, setThreads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [browseSettings, setBrowseSettings] = useState({ enabled: true });
  const [browseCategories, setBrowseCategories] = useState([]);
  const [browseProfiles, setBrowseProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [assignmentResponseDrafts, setAssignmentResponseDrafts] = useState({});
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportRequestId, setSupportRequestId] = useState("");
  const [supportFeedback, setSupportFeedback] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [portfolioForm, setPortfolioForm] = useState({ title: "", description: "", project_url: "", uploads: [] });
  const [portfolioSaving, setPortfolioSaving] = useState(false);
  const [portfolioUploadKey, setPortfolioUploadKey] = useState(0);
  const [portfolioFeedback, setPortfolioFeedback] = useState("");
  const [shareLinkCreating, setShareLinkCreating] = useState(false);
  const [shareLinkFeedback, setShareLinkFeedback] = useState("");
  const [viewingPortfolioItem, setViewingPortfolioItem] = useState(null);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState(null);
  const [portfolioEditForm, setPortfolioEditForm] = useState({ title: "", description: "", project_url: "", imageOrder: [], newUploads: [] });
  const [portfolioUpdating, setPortfolioUpdating] = useState(false);
  const [portfolioEditUploadKey, setPortfolioEditUploadKey] = useState(0);
  const [paymentForm, setPaymentForm] = useState({
    client_request: "",
    method: "manual",
    amount: "",
    reference: "",
    notes: "",
    evidence: null,
  });

  const isClient = Boolean(user?.is_client);
  const navItems = isClient ? clientNav : professionalNav;
  const section = location.pathname.replace("/dashboard", "").split("/").filter(Boolean)[0] || "overview";
  const selectedCategory = searchParams.get("category");
  const unreadTotal = threads.reduce((sum, thread) => sum + (thread.unread_count || 0), 0);

  const refreshData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const baseTasks = [
        profileService.getAssignments().catch(() => []),
        profileService.getThreads().catch(() => []),
        profileService.getPayments().catch(() => []),
      ];
      const roleTask = isClient
        ? Promise.all([
            profileService.getClientRequests().catch(() => []),
            profileService.getBrowseSettings().catch(() => ({ enabled: false })),
            profileService.getBrowseCategories().catch(() => []),
          ])
        : Promise.all([
            profileService.getBankAccounts().catch(() => []),
            profileService.getPortfolioItems().catch(() => []),
            profileService.getShareLinks().catch(() => []),
          ]);
      const [assignmentData, threadData, paymentData, roleData] = await Promise.all([...baseTasks, roleTask]);
      setAssignments(assignmentData);
      setThreads(threadData);
      setPayments(paymentData);
      if (isClient) {
        const [requestData, settingsData, categoryData] = roleData;
        setRequests(requestData);
        setBrowseSettings(settingsData);
        setBrowseCategories(categoryData);
      } else {
        const [bankData, portfolioData, shareLinkData] = roleData;
        setBankAccounts(bankData);
        setPortfolioItems(portfolioData);
        setShareLinks(shareLinkData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
    refreshData();
  }, [user, profile, fetchProfile]);

  useEffect(() => {
    if (!isClient || section !== "browse" || !browseSettings.enabled) return;
    profileService
      .getBrowseProfiles(selectedCategory ? { category: selectedCategory } : {})
      .then(setBrowseProfiles)
      .catch(() => setBrowseProfiles([]));
  }, [isClient, section, selectedCategory, browseSettings.enabled]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = ["name", "title", "bio", "profile_image"];
    const completed = fields.filter((field) => Boolean(profile[field])).length;
    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const metrics = useMemo(() => {
    if (isClient) {
      return [
        {
          label: "Requests",
          value: requests.filter((request) => !["completed", "archived"].includes(request.status)).length,
          body: "Active and in-flight project briefs",
        },
        {
          label: "Payments",
          value: payments.filter((payment) => payment.status === "pending").length,
          body: "Records awaiting admin verification",
        },
        {
          label: "Messages",
          value: threads.filter((thread) => !thread.is_closed).length,
          body: "Open conversations with operations",
        },
      ];
    }
    return [
      {
        label: "Assignments",
        value: assignments.filter((assignment) =>
          ["assignment_sent", "accepted", "in_progress", "submitted", "client_review"].includes(assignment.status)
        ).length,
        body: "Active opportunities and deliveries",
      },
      {
        label: "Portfolio",
        value: portfolioItems.length,
        body: "Work samples attached to your profile",
      },
      {
        label: "Payouts",
        value: bankAccounts.filter((account) => account.status === "verified").length,
        body: "Verified bank accounts",
      },
    ];
  }, [isClient, requests, payments, threads, assignments, portfolioItems, bankAccounts]);

  const handleAssignmentAction = async (assignmentId, action) => {
    await profileService.actOnAssignment(assignmentId, action, assignmentResponseDrafts[assignmentId] || "");
    setAssignmentResponseDrafts((prev) => ({ ...prev, [assignmentId]: "" }));
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
    const thread = await profileService.createThread({
      thread_type: isClient ? "client_admin" : "professional_admin",
      subject: supportSubject.trim(),
      ...(isClient && supportRequestId ? { client_request: Number(supportRequestId) } : {}),
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
    const payload = new FormData();
    Object.entries(paymentForm).forEach(([key, value]) => {
      if (value) payload.append(key, key === "client_request" ? Number(value) : value);
    });
    await profileService.createPayment(payload);
    setPaymentForm({ client_request: "", method: "manual", amount: "", reference: "", notes: "", evidence: null });
    setPaymentMessage("Payment record submitted. The admin team will verify and update your request.");
    refreshData();
  };

  const handlePortfolioSubmit = async (event) => {
    event.preventDefault();
    setPortfolioFeedback("");
    if (!portfolioForm.uploads.length) {
      setPortfolioFeedback("Add at least one image before saving a portfolio item.");
      return;
    }
    if (hasPendingUploads(portfolioForm.uploads)) {
      setPortfolioFeedback("Please wait for all selected images to finish uploading.");
      return;
    }
    const assetIds = successfulAssetIds(portfolioForm.uploads);
    if (!assetIds.length) {
      setPortfolioFeedback("No image uploaded successfully. Please retry or choose another image.");
      return;
    }
    const payload = {
      title: portfolioForm.title,
      description: portfolioForm.description,
      project_url: portfolioForm.project_url,
      cover_asset_id: assetIds[0],
      gallery_asset_ids: assetIds.slice(1),
    };
    setPortfolioSaving(true);
    try {
      await profileService.createPortfolioItem(payload);
      setPortfolioForm({ title: "", description: "", project_url: "", uploads: [] });
      setPortfolioUploadKey((key) => key + 1);
      setPortfolioFeedback("Portfolio item added successfully.");
      setPortfolioItems(await profileService.getPortfolioItems());
    } catch (error) {
      setPortfolioFeedback(getUploadError(error));
    } finally {
      setPortfolioSaving(false);
    }
  };

  const uploadPortfolioAsset = async (uploadItem, updateItems) => {
    try {
      const asset = await profileService.uploadMediaAsset(uploadItem.file, "portfolio", (progressEvent) => {
        const total = progressEvent.total || uploadItem.file.size || 1;
        const progress = Math.min(99, Math.round((progressEvent.loaded * 100) / total));
        updateItems((items) =>
          items.map((item) => (item.clientId === uploadItem.clientId ? { ...item, progress } : item))
        );
      });
      updateItems((items) =>
        items.map((item) =>
          item.clientId === uploadItem.clientId ? { ...item, status: "uploaded", progress: 100, asset, error: "" } : item
        )
      );
    } catch (error) {
      updateItems((items) =>
        items.map((item) =>
          item.clientId === uploadItem.clientId
            ? { ...item, status: "failed", progress: 0, error: getUploadError(error) }
            : item
        )
      );
    }
  };

  const appendPortfolioImages = (files) => {
    const uploadItems = Array.from(files || []).map(makeUploadItem);
    if (!uploadItems.length) return;
    setPortfolioForm((prev) => ({ ...prev, uploads: [...prev.uploads, ...uploadItems] }));
    uploadItems.forEach((item) => uploadPortfolioAsset(item, (updater) => {
      setPortfolioForm((prev) => ({ ...prev, uploads: updater(prev.uploads) }));
    }));
  };

  const removePendingPortfolioImage = (indexToRemove) => {
    setPortfolioForm((prev) => ({
      ...prev,
      uploads: prev.uploads.filter((_, index) => index !== indexToRemove),
    }));
  };

  const retryPortfolioUpload = (uploadItem, index) => {
    const retryItem = { ...uploadItem, status: "uploading", progress: 0, error: "" };
    setPortfolioForm((prev) => ({
      ...prev,
      uploads: prev.uploads.map((item, itemIndex) => (itemIndex === index ? retryItem : item)),
    }));
    uploadPortfolioAsset(retryItem, (updater) => {
      setPortfolioForm((prev) => ({ ...prev, uploads: updater(prev.uploads) }));
    });
  };

  const openPortfolioItem = (item) => {
    const galleryOrder = (item.images || [])
      .map((image) => image.id)
      .filter((id) => Number.isInteger(id));
    setViewingPortfolioItem(item);
    setEditingPortfolioItem(null);
    setPortfolioEditForm({
      title: item.title || "",
      description: item.description || "",
      project_url: item.project_url || "",
      imageOrder: galleryOrder,
      newUploads: [],
    });
  };

  const startPortfolioEdit = () => {
    if (!viewingPortfolioItem) return;
    setEditingPortfolioItem(viewingPortfolioItem.id);
  };

  const movePortfolioImage = (imageId, direction) => {
    if (!Number.isInteger(imageId)) return;
    setPortfolioEditForm((prev) => {
      const nextOrder = [...prev.imageOrder];
      const currentIndex = nextOrder.indexOf(imageId);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= nextOrder.length) return prev;
      [nextOrder[currentIndex], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[currentIndex]];
      return { ...prev, imageOrder: nextOrder };
    });
  };

  const getOrderedPortfolioImages = (item, order = []) => {
    const images = item?.images?.length ? item.images : item?.image ? [{ id: "primary", image: item.image }] : [];
    const orderMap = new Map(order.map((id, index) => [id, index]));
    return [...images].sort((first, second) => {
      const firstOrder = Number.isInteger(first.id) ? orderMap.get(first.id) ?? 999 : -1;
      const secondOrder = Number.isInteger(second.id) ? orderMap.get(second.id) ?? 999 : -1;
      return firstOrder - secondOrder;
    });
  };

  const handlePortfolioUpdate = async (event) => {
    event.preventDefault();
    if (!viewingPortfolioItem) return;
    if (hasPendingUploads(portfolioEditForm.newUploads)) {
      setPortfolioFeedback("Please wait for all selected images to finish uploading.");
      return;
    }
    const payload = {
      title: portfolioEditForm.title,
      description: portfolioEditForm.description,
      project_url: portfolioEditForm.project_url,
      image_order: portfolioEditForm.imageOrder,
      gallery_asset_ids: successfulAssetIds(portfolioEditForm.newUploads),
    };
    setPortfolioUpdating(true);
    try {
      const updatedItem = await profileService.updatePortfolioItem(viewingPortfolioItem.id, payload);
      setPortfolioEditForm((prev) => ({ ...prev, newUploads: [] }));
      setPortfolioEditUploadKey((key) => key + 1);
      setViewingPortfolioItem(updatedItem);
      setEditingPortfolioItem(null);
      setPortfolioItems(await profileService.getPortfolioItems());
    } catch (error) {
      setPortfolioFeedback(getUploadError(error, "Portfolio item update failed. Please try again."));
    } finally {
      setPortfolioUpdating(false);
    }
  };

  const appendPortfolioEditImages = (files) => {
    const uploadItems = Array.from(files || []).map(makeUploadItem);
    if (!uploadItems.length) return;
    setPortfolioEditForm((prev) => ({ ...prev, newUploads: [...prev.newUploads, ...uploadItems] }));
    uploadItems.forEach((item) => uploadPortfolioAsset(item, (updater) => {
      setPortfolioEditForm((prev) => ({ ...prev, newUploads: updater(prev.newUploads) }));
    }));
  };

  const retryPortfolioEditUpload = (uploadItem, index) => {
    const retryItem = { ...uploadItem, status: "uploading", progress: 0, error: "" };
    setPortfolioEditForm((prev) => ({
      ...prev,
      newUploads: prev.newUploads.map((item, itemIndex) => (itemIndex === index ? retryItem : item)),
    }));
    uploadPortfolioAsset(retryItem, (updater) => {
      setPortfolioEditForm((prev) => ({ ...prev, newUploads: updater(prev.newUploads) }));
    });
  };

  const handleCreateShareLink = async () => {
    setShareLinkCreating(true);
    setShareLinkFeedback("");
    try {
      await profileService.createShareLink({});
      setShareLinks(await profileService.getShareLinks());
      setShareLinkFeedback("Private portfolio link created.");
    } finally {
      setShareLinkCreating(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="shell-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Readiness</p>
          <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">{profileCompletion}% profile strength</h2>
          <div className="mt-5 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-gradient-to-r from-workie-gold to-workie-blue-light" style={{ width: `${profileCompletion}%` }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {isClient
              ? "A complete profile helps the operations team qualify requests, payments, and approvals faster."
              : "A sharp profile helps admins shortlist you faster and share stronger portfolio evidence with clients."}
          </p>
          <Link to="/profile" className="mt-5 inline-flex rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">
            Update profile
          </Link>
        </div>
        <div className="shell-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Next best action</p>
          <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">
            {isClient ? "Start or track a brief" : "Stay assignment-ready"}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {isClient
              ? "Submit a structured request, browse admin-approved talent by service category, or continue a conversation with the WorkieTechie team."
              : "Keep your portfolio and payout details up to date so new admin-matched work can move quickly."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {isClient ? (
              <>
                <Link to="/client-request" className="rounded-full bg-workie-gold px-5 py-3 text-sm font-semibold !text-white">
                  New request
                </Link>
                <Link to="/dashboard/browse" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                  Browse talent
                </Link>
              </>
            ) : (
              <Link to="/dashboard/portfolio" className="rounded-full bg-workie-gold px-5 py-3 text-sm font-semibold !text-white">
                Review portfolio
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="shell-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Client requests</p>
          <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">Project command center</h2>
        </div>
        <Link to="/client-request" className="rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">
          Create request
        </Link>
      </div>
      <div className="mt-6 space-y-4">
        {requests.length ? (
          requests.map((request) => (
            <div key={request.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link to={`/client-request/${request.id}`} className="text-lg font-bold text-slate-900 hover:text-workie-blue">
                    {request.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">{request.expertise_category?.name || "General request"}</p>
                </div>
                <StatusPill status={request.status} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{request.summary}</p>
            </div>
          ))
        ) : (
          <EmptyState
            title="No requests yet"
            body="Create a structured brief and the WorkieTechie team will qualify it, confirm payment, and match the right professional."
            action={<Link to="/client-request" className="rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Start a request</Link>}
          />
        )}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="shell-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Assignments</p>
      <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">
        {isClient ? "Matched work in motion" : "Admin-matched opportunities"}
      </h2>
      <div className="mt-6 space-y-4">
        {assignments.length ? (
          assignments.map((assignment) => (
            <div key={assignment.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{assignment.client_request.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {isClient ? `Professional: ${assignment.professional_name}` : assignment.client_request.expertise_category?.name}
                  </p>
                </div>
                <StatusPill status={assignment.status} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{assignment.offer_message || assignment.client_request.summary}</p>
              {!isClient && assignment.status === "assignment_sent" ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => handleAssignmentAction(assignment.id, "accept")} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold !text-white">
                    Accept
                  </button>
                  <button onClick={() => handleAssignmentAction(assignment.id, "decline")} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                    Decline
                  </button>
                </div>
              ) : null}
              {!isClient && ["accepted", "in_progress"].includes(assignment.status) ? (
                <div className="mt-5 space-y-3">
                  <textarea
                    rows="3"
                    value={assignmentResponseDrafts[assignment.id] || ""}
                    onChange={(event) => setAssignmentResponseDrafts((prev) => ({ ...prev, [assignment.id]: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-workie-gold"
                    placeholder="Add a delivery note..."
                  />
                  <button onClick={() => handleAssignmentAction(assignment.id, "submit")} className="rounded-full bg-workie-blue px-4 py-2 text-sm font-semibold !text-white">
                    Submit for review
                  </button>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <EmptyState title="No assignments yet" body="Assignments appear here after the admin team matches work to the right professional." />
        )}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="shell-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Messages</p>
      <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">Operations inbox</h2>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Open a new conversation with admin</p>
        <div className="mt-3 grid gap-3">
          {isClient && requests.length ? (
            <select value={supportRequestId} onChange={(event) => setSupportRequestId(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold">
              <option value="">Attach to request (optional)</option>
              {requests.map((request) => (
                <option key={request.id} value={request.id}>{request.title}</option>
              ))}
            </select>
          ) : null}
          <input value={supportSubject} onChange={(event) => setSupportSubject(event.target.value)} placeholder="Subject" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold" />
          <textarea value={supportMessage} onChange={(event) => setSupportMessage(event.target.value)} rows="3" placeholder="Write your message..." className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold" />
          <button onClick={handleCreateSupportThread} className="w-fit rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Open thread</button>
          {supportFeedback ? <p className="text-sm text-emerald-700">{supportFeedback}</p> : null}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {threads.length ? (
          threads.map((thread) => (
            <div key={thread.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{thread.subject}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{thread.thread_type?.replaceAll("_", " ")}</p>
                </div>
                <span className={`status-pill ${thread.is_closed ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>
                  {thread.is_closed ? "Closed" : `${thread.unread_count || 0} unread`}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {(thread.messages || []).slice(-3).map((message) => (
                  <div key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div className="mb-1 font-semibold text-slate-900">{message.sender_name}</div>
                    <div>{message.body}</div>
                  </div>
                ))}
              </div>
              {!thread.is_closed ? (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input value={replyDrafts[thread.id] || ""} onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [thread.id]: event.target.value }))} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold" placeholder="Reply..." />
                  <button onClick={() => handleSendMessage(thread.id)} className="rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Send</button>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <EmptyState title="No conversations yet" body="Start a thread when you need support, clarification, approvals, refunds, or delivery help." />
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="shell-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">{isClient ? "Payments" : "Payouts"}</p>
      <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">{isClient ? "Payment records" : "Payout readiness"}</h2>
      {isClient ? (
        <form onSubmit={handlePaymentSubmit} className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <select value={paymentForm.client_request} onChange={(event) => setPaymentForm((prev) => ({ ...prev, client_request: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold">
              <option value="">Select request</option>
              {requests.map((request) => <option key={request.id} value={request.id}>{request.title}</option>)}
            </select>
            <input type="number" value={paymentForm.amount} onChange={(event) => setPaymentForm((prev) => ({ ...prev, amount: event.target.value }))} placeholder="Amount" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold" />
            <input value={paymentForm.reference} onChange={(event) => setPaymentForm((prev) => ({ ...prev, reference: event.target.value }))} placeholder="Reference" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold" />
            <input type="file" onChange={(event) => setPaymentForm((prev) => ({ ...prev, evidence: event.target.files?.[0] || null }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
          </div>
          <textarea value={paymentForm.notes} onChange={(event) => setPaymentForm((prev) => ({ ...prev, notes: event.target.value }))} rows="3" placeholder="Notes for admin verification" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-workie-gold" />
          <button className="w-fit rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Submit payment record</button>
          {paymentMessage ? <p className="text-sm text-emerald-700">{paymentMessage}</p> : null}
        </form>
      ) : null}
      <div className="mt-6 space-y-4">
        {(isClient ? payments : bankAccounts).length ? (
          (isClient ? payments : bankAccounts).map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">{isClient ? `${item.method} payment` : item.bank_name || "Bank account"}</div>
                  <p className="mt-1 text-sm text-slate-500">{isClient ? item.reference || `Amount: ${item.amount}` : item.account_number}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
            </div>
          ))
        ) : (
          <EmptyState title={isClient ? "No payment records" : "No verified payout account"} body={isClient ? "Submit a payment record after transfer or Paystack payment." : "Add and verify your Nigerian bank account from profile settings."} />
        )}
      </div>
    </div>
  );

  const renderBrowse = () => {
    if (!browseSettings.enabled) {
      const message = browseSettings.message || {};
      return (
        <EmptyState
          title={message.title || "Browse Talent is currently closed"}
          body={message.body || "The admin team is curating visible portfolios. You can still submit a brief and we will match you directly."}
          action={<Link to="/client-request" className="rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Submit a brief</Link>}
        />
      );
    }
    const category = browseCategories.find((item) => String(item.id) === String(selectedCategory));
    return (
      <div className="space-y-6">
        <div className="shell-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Browse Talent</p>
          <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">
            {category ? `${category.name} portfolios` : "Choose the service category you need"}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Browse only admin-approved profiles. When you find the kind of expertise you need, start a structured brief so the team can match and manage delivery.
          </p>
        </div>
        {!selectedCategory ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {browseCategories.map((item) => (
              <Link key={item.id} to={`/dashboard/browse?category=${item.id}`} className="shell-panel group p-6 transition hover:-translate-y-1 hover:border-workie-gold">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-workie-gold">{item.visible_profiles_count} visible</div>
                <h3 className="shell-title mt-3 text-2xl font-bold text-slate-900 group-hover:text-workie-blue">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description || "Curated professionals ready for admin-led matching."}</p>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <button onClick={() => navigate("/dashboard/browse")} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Back to service categories
            </button>
            <div className="grid gap-5 lg:grid-cols-2">
              {browseProfiles.length ? (
                browseProfiles.map((talent) => (
                  <div key={talent.id} className="shell-panel overflow-hidden">
                    <div className="p-6">
                      <div className="flex gap-4">
                        {talent.profile_image ? <img src={talent.profile_image} alt={talent.name} className="h-16 w-16 rounded-2xl object-cover" /> : <div className="h-16 w-16 rounded-2xl bg-workie-blue/10" />}
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{talent.name || "WorkieTechie Professional"}</h3>
                          <p className="mt-1 text-sm font-semibold text-workie-blue">{talent.title || talent.expertise_category?.name}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">{talent.browse_summary || talent.bio || "Admin-approved professional profile available for curated matching."}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {(talent.specializations || []).slice(0, 4).map((specialization) => (
                          <span key={specialization.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{specialization.name}</span>
                        ))}
                      </div>
                    </div>
                    {talent.portfolio?.length ? (
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-3">
                        {talent.portfolio.slice(0, 2).map((item) => (
                          <div key={item.id} className="rounded-2xl bg-slate-50 p-2">
                            {item.image ? <img src={item.image} alt={item.title} className="h-28 w-full rounded-xl object-cover" /> : null}
                            <div className="mt-2 text-sm font-semibold text-slate-900">{item.title || "Portfolio sample"}</div>
                            {item.project_url ? (
                              <a href={item.project_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-workie-blue">
                                Open project
                              </a>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-3 border-t border-slate-100 p-5">
                      <Link to={`/portfolio/${talent.share_token}`} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                        View profile
                      </Link>
                      <Link to="/client-request" className="rounded-full bg-workie-blue px-4 py-2 text-sm font-semibold !text-white">
                        Request this kind of talent
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title="No visible portfolios yet" body="The admin team has not published portfolios for this service category yet. You can still start a brief and request matching." />
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="shell-panel overflow-hidden p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Portfolio</p>
            <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">Build your proof of work</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Add polished case-study cards with multiple images. WorkieTechie can use these internally and, when approved,
              make selected items visible to clients.
            </p>
          </div>
          <Link to="/profile" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Open full profile
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <form className="shell-panel p-6" onSubmit={handlePortfolioSubmit}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Add item</p>
            <h3 className="shell-title mt-2 text-2xl font-bold text-slate-900">New portfolio sample</h3>
            <div className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Project title
                  <input
                  value={portfolioForm.title}
                  onChange={(event) => setPortfolioForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                  placeholder="e.g. Fintech landing page redesign"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Project link
                  <input
                    type="url"
                    value={portfolioForm.project_url}
                    onChange={(event) => setPortfolioForm((prev) => ({ ...prev, project_url: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    placeholder="https://example.com/project-or-case-study"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  What did you deliver?
                <textarea
                  rows="4"
                  value={portfolioForm.description}
                  onChange={(event) => setPortfolioForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                  placeholder="Briefly describe the problem, your role, and outcome."
                />
              </label>
              <div>
                <p className="text-sm font-medium text-slate-700">Images</p>
                <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-workie-blue transition hover:border-workie-gold hover:bg-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-workie-blue text-lg leading-none !text-white">+</span>
                  Add images
                  <input
                    key={portfolioUploadKey}
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={portfolioSaving}
                    onChange={(event) => {
                      appendPortfolioImages(event.target.files);
                      event.target.value = "";
                    }}
                    className="sr-only"
                  />
                </label>
              </div>
              {portfolioForm.uploads.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {portfolioForm.uploads.map((upload, index) => (
                    <div key={upload.clientId} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="relative">
                        <img src={upload.asset?.url || upload.previewUrl} alt={upload.name} className="h-28 w-full object-cover" />
                        {upload.status === "uploading" ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-slate-600">
                        <div className="min-w-0">
                          <span className="block truncate">{upload.name}</span>
                          <span className={upload.status === "failed" ? "text-rose-600" : upload.status === "uploaded" ? "text-emerald-600" : "text-workie-blue"}>
                            {upload.status === "uploading" ? `Uploading ${upload.progress}%` : upload.status === "uploaded" ? "Uploaded" : upload.error}
                          </span>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {upload.status === "failed" ? (
                            <button type="button" onClick={() => retryPortfolioUpload(upload, index)} className="text-workie-blue">
                              Retry
                            </button>
                          ) : null}
                          <button type="button" onClick={() => removePendingPortfolioImage(index)} className="text-rose-600">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={portfolioSaving || hasPendingUploads(portfolioForm.uploads)}
                className="inline-flex items-center gap-2 rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {portfolioSaving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : null}
                {portfolioSaving ? "Adding portfolio..." : hasPendingUploads(portfolioForm.uploads) ? "Uploading images..." : "Add portfolio item"}
              </button>
              {portfolioFeedback ? (
                <p className={`text-sm ${portfolioFeedback.toLowerCase().includes("failed") ? "text-rose-600" : "text-emerald-700"}`}>
                  {portfolioFeedback}
                </p>
              ) : null}
            </div>
          </form>

          <div className="shell-panel p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Private sharing</p>
                <h3 className="shell-title mt-2 text-2xl font-bold text-slate-900">Portfolio links</h3>
              </div>
              <button
                type="button"
                onClick={handleCreateShareLink}
                disabled={shareLinkCreating}
                className="inline-flex items-center gap-2 rounded-full bg-workie-gold px-4 py-2 text-sm font-semibold !text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {shareLinkCreating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : null}
                {shareLinkCreating ? "Creating..." : "Create link"}
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {shareLinks.length ? shareLinks.map((link) => (
                <div key={link.id} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                  <div className="break-all font-semibold text-slate-900">{window.location.origin}/portfolio/{link.token}</div>
                  <div className="mt-1 text-slate-500">{link.is_active ? "Active" : "Inactive"}</div>
                </div>
              )) : <p className="text-sm text-slate-500">No share links yet.</p>}
            </div>
            {shareLinkFeedback ? <p className="mt-4 text-sm text-emerald-700">{shareLinkFeedback}</p> : null}
          </div>
        </div>

        <div className="shell-panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Gallery</p>
              <h3 className="shell-title mt-2 text-2xl font-bold text-slate-900">Your work samples</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              {portfolioItems.length} item{portfolioItems.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {portfolioItems.length ? portfolioItems.map((item) => {
              const coverImage = item.images?.[0]?.image || item.image;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => openPortfolioItem(item)}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-left transition hover:-translate-y-1 hover:border-workie-gold hover:shadow-xl"
                >
                  {coverImage ? (
                    <img src={coverImage} alt={item.title || "Portfolio"} className="h-40 w-full object-cover transition group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-workie-blue/10 text-sm font-semibold text-workie-blue">No image</div>
                  )}
                    <div className="p-4">
                      <div className="font-bold text-slate-900">{item.title || "Portfolio item"}</div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.description || "No description added yet."}</p>
                      {item.project_url ? (
                        <span className="mt-3 inline-flex text-xs font-semibold text-workie-blue">Project link attached</span>
                      ) : null}
                      <div className="mt-3 text-xs font-semibold text-workie-blue">
                      {(item.images?.length || (item.image ? 1 : 0))} image{(item.images?.length || (item.image ? 1 : 0)) === 1 ? "" : "s"} attached
                    </div>
                  </div>
                </button>
              );
            }) : (
              <EmptyState title="No portfolio items yet" body="Add your first work sample with clear visuals and a short delivery story." />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewingPortfolioItem ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setViewingPortfolioItem(null);
              setEditingPortfolioItem(null);
            }}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl"
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Portfolio preview</p>
                  <h3 className="shell-title mt-2 text-3xl font-bold text-slate-900">
                    {editingPortfolioItem ? "Edit portfolio item" : viewingPortfolioItem.title || "Portfolio item"}
                  </h3>
                  {!editingPortfolioItem ? (
                    <>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{viewingPortfolioItem.description || "No description added yet."}</p>
                      {viewingPortfolioItem.project_url ? (
                        <a
                          href={viewingPortfolioItem.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex rounded-full bg-workie-blue px-4 py-2 text-sm font-semibold !text-white"
                        >
                          Open project link
                        </a>
                      ) : null}
                    </>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!editingPortfolioItem ? (
                    <button type="button" onClick={startPortfolioEdit} className="rounded-full bg-workie-blue px-4 py-2 text-sm font-semibold !text-white">
                      Edit item
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setViewingPortfolioItem(null);
                      setEditingPortfolioItem(null);
                    }}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                  >
                    Close
                  </button>
                </div>
              </div>
              {editingPortfolioItem ? (
                <form className="mt-6 space-y-5" onSubmit={handlePortfolioUpdate}>
                  <label className="block text-sm font-medium text-slate-700">
                    Project title
                    <input
                      value={portfolioEditForm.title}
                      onChange={(event) => setPortfolioEditForm((prev) => ({ ...prev, title: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                    <textarea
                      rows="4"
                      value={portfolioEditForm.description}
                      onChange={(event) => setPortfolioEditForm((prev) => ({ ...prev, description: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Project link
                    <input
                      type="url"
                      value={portfolioEditForm.project_url}
                      onChange={(event) => setPortfolioEditForm((prev) => ({ ...prev, project_url: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                      placeholder="https://example.com/project-or-case-study"
                    />
                  </label>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">Arrange images</p>
                    <p className="mt-1 text-xs text-slate-500">Use the controls to set the gallery order. The cover image stays first.</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {getOrderedPortfolioImages(viewingPortfolioItem, portfolioEditForm.imageOrder).map((image, index) => (
                        <div key={image.id || image.image} className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                          <img src={image.image} alt={portfolioEditForm.title || "Portfolio"} className="h-44 w-full rounded-2xl object-cover" />
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-500">{index === 0 ? "Cover" : `Image ${index + 1}`}</span>
                            {Number.isInteger(image.id) ? (
                              <div className="flex gap-2">
                                <button type="button" onClick={() => movePortfolioImage(image.id, -1)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                                  Up
                                </button>
                                <button type="button" onClick={() => movePortfolioImage(image.id, 1)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                                  Down
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Add more images</p>
                    <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-workie-blue transition hover:border-workie-gold hover:bg-white">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-workie-blue text-lg leading-none !text-white">+</span>
                      Choose additional images
                      <input
                        key={portfolioEditUploadKey}
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={portfolioUpdating}
                        onChange={(event) => {
                          appendPortfolioEditImages(event.target.files);
                          event.target.value = "";
                        }}
                        className="sr-only"
                      />
                    </label>
                    {portfolioEditForm.newUploads.length ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {portfolioEditForm.newUploads.map((upload, index) => (
                          <div key={upload.clientId} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            <div className="relative">
                              <img src={upload.asset?.url || upload.previewUrl} alt={upload.name} className="h-28 w-full object-cover" />
                              {upload.status === "uploading" ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                                  <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                </div>
                              ) : null}
                            </div>
                            <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-slate-600">
                              <div className="min-w-0">
                                <span className="block truncate">{upload.name}</span>
                                <span className={upload.status === "failed" ? "text-rose-600" : upload.status === "uploaded" ? "text-emerald-600" : "text-workie-blue"}>
                                  {upload.status === "uploading" ? `Uploading ${upload.progress}%` : upload.status === "uploaded" ? "Uploaded" : upload.error}
                                </span>
                              </div>
                              <div className="flex shrink-0 gap-2">
                                {upload.status === "failed" ? (
                                  <button type="button" onClick={() => retryPortfolioEditUpload(upload, index)} className="text-workie-blue">
                                    Retry
                                  </button>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPortfolioEditForm((prev) => ({
                                      ...prev,
                                      newUploads: prev.newUploads.filter((_, fileIndex) => fileIndex !== index),
                                    }))
                                  }
                                  className="text-rose-600"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={portfolioUpdating || hasPendingUploads(portfolioEditForm.newUploads)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-workie-blue px-5 py-3 text-sm font-semibold !text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {portfolioUpdating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : null}
                      {portfolioUpdating ? "Saving..." : hasPendingUploads(portfolioEditForm.newUploads) ? "Uploading images..." : "Save portfolio item"}
                    </button>
                    <button type="button" onClick={() => setEditingPortfolioItem(null)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {getOrderedPortfolioImages(viewingPortfolioItem).filter((image) => image.image).map((image) => (
                    <img key={image.id || image.image} src={image.image} alt={viewingPortfolioItem.title || "Portfolio"} className="h-64 w-full rounded-3xl object-cover" />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  const renderSettings = () => (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="shell-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Account</p>
        <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">{profile?.name || user?.email}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Manage profile details, onboarding answers, portfolio, and payout information from the profile workspace.</p>
        <Link to="/profile" className="mt-5 inline-flex rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">Open profile settings</Link>
      </div>
      <div className="shell-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Platform</p>
        <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">Managed by WorkieTechie</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Requests, matching, payments, approvals, and disputes are operated by the admin team for quality control.</p>
      </div>
    </div>
  );

  const renderResources = () => (
    <EmptyState
      title="Resources are coming"
      body="This section is reserved for curated free and paid learning resources that help professionals upskill while waiting for matches."
    />
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <div className="shell-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Approvals & disputes</p>
        <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">Review delivered work</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Open each request workflow to approve submitted work, request changes, or raise a dispute/refund case.</p>
      </div>
      {renderAssignments()}
    </div>
  );

  const renderSection = () => {
    if (loading && !profile) return <div className="h-14 w-14 animate-spin rounded-full border-4 border-workie-blue border-t-transparent" />;
    if (section === "requests") return isClient ? renderRequests() : renderOverview();
    if (section === "browse") return isClient ? renderBrowse() : renderOverview();
    if (section === "assignments") return renderAssignments();
    if (section === "messages") return renderMessages();
    if (section === "payments" || section === "payouts") return renderPayments();
    if (section === "portfolio") return renderPortfolio();
    if (section === "approvals") return isClient ? renderApprovals() : renderOverview();
    if (section === "resources") return renderResources();
    if (section === "settings") return renderSettings();
    return renderOverview();
  };

  return (
    <div className="min-h-screen bg-transparent">
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : 0 }}
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col bg-[#0e3148] p-5 !text-white shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2" aria-label="WorkieTechie home">
            <img src={logoImage} alt="WorkieTechie" className="h-9 w-auto" />
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close dashboard menu"
          >
            X
          </button>
        </div>
        <div className="mt-8 rounded-3xl bg-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-workie-gold">{isClient ? "Client workspace" : "Professional hub"}</p>
          <h2 className="mt-2 truncate text-lg font-bold" title={profile?.name || user?.email}>
            {profile?.name || user?.email}
          </h2>
          <p className="mt-1 truncate text-sm !text-white/70" title={profile?.title || "Vetted matching workspace"}>
            {profile?.title || "Vetted matching workspace"}
          </p>
        </div>
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const active = item.id === section || (item.id === "overview" && section === "overview");
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active ? "bg-workie-gold text-[#0e3148]" : "!text-white/80 hover:bg-white/10 hover:!text-white"
                }`}
              >
                {item.label}
                {item.id === "messages" && threads.some((thread) => thread.unread_count) ? (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-workie-blue">
                    {unreadTotal}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-5 rounded-3xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-workie-gold">Quick action</p>
          <Link
            to={isClient ? "/client-request" : "/profile"}
            onClick={() => setSidebarOpen(false)}
            className="mt-3 inline-flex w-full justify-center rounded-2xl bg-workie-gold px-4 py-3 text-sm font-semibold !text-white"
          >
            {isClient ? "Create request" : "Update profile"}
          </Link>
        </div>
      </motion.aside>
      <AnimatePresence>
        {sidebarOpen ? (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
      </AnimatePresence>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-workie-blue shadow-sm lg:hidden"
                aria-label="Open dashboard menu"
              >
                <span className="absolute h-0.5 w-5 -translate-y-1.5 rounded-full bg-current" />
                <span className="absolute h-0.5 w-5 rounded-full bg-current" />
                <span className="absolute h-0.5 w-5 translate-y-1.5 rounded-full bg-current" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">{isClient ? "Client operations" : "Professional operations"}</p>
                <h1 className="shell-title text-2xl font-bold capitalize text-slate-900">{section.replaceAll("-", " ")}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadTotal ? (
                <Link to="/dashboard/messages" className="hidden rounded-full bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 md:inline-flex">
                  {unreadTotal} unread
                </Link>
              ) : null}
              {isClient ? (
                <Link to="/client-request" className="hidden rounded-full bg-workie-gold px-5 py-3 text-sm font-semibold !text-white sm:inline-flex">
                  New request
                </Link>
              ) : (
                <Link to="/profile" className="hidden rounded-full bg-workie-gold px-5 py-3 text-sm font-semibold !text-white sm:inline-flex">
                  Update profile
                </Link>
              )}
              <button onClick={logout} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                Logout
              </button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{renderSection()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
